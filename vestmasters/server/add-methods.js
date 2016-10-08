import {Baskets,Inventory} from '../imports/api/products.js';

Meteor.methods({

 updateBasket: function(item, basketId){
    check(item, Object); //TODO check for security reasons
    check(basketId,String); //TODO check for security reasons

    var basket = Baskets.findOne({"_id" : basketId, "user" : Meteor.userId()});
    
    if((typeof basket === "undefined") || basket === null){
    	var userInfo = insertBasket(item,basketId);
    	throw new Meteor.Error("UNEXISTING_BASKET", 
    		"You have specified an unexisting basket, new basket was created with the initial item inserted"
    		, {"userInfo": userInfo});
    }

    for(i=0; i<basket.itemsDetails.length; i++) {
      if(basket.itemsDetails[i].oid === item.oid && basket.itemsDetails[i].size === item.size) {
        if (basket.itemsDetails[i].initials.indexOf(item.initials)!== (-1)){
          updateQuantityInitials(item,item.initials,basketId,1);
          return;
        }
        updateQuantity(item,basketId,1);
      	return;
      }
    }
    
    updateWithNewItem(item,basketId);
  
  }

});

function insertBasket(item,basketId){
   var now = new Date();

   itemToInsert = {
          "product" : item.product,
          "file" : item.file,
          "price" : item.price,
          "size": item.size,  
          "oid" : item.oid,
          "initials" : [item.initials],
   }
   itemToInsert["quantity" + item.initials] = 1;
   var insertedId = Baskets.insert({"itemsDetails" : [itemToInsert], "lastModified" : now,'lastCheckedByClient' : now, "status" : "active"});
   var password = Random.secret();
   console.log(password);
   var userId = Accounts.createUser({"username" : insertedId, "password" : password});
   Baskets.update({"_id" : insertedId}, {$set: {"user" : userId}});
   var updateQueryObject = {};
   var decUpdateOperation = {};
   generateNewitemQueryObject(updateQueryObject,decUpdateOperation,item,1); 

   //Update the inventory
   var result = Inventory.update(
        updateQueryObject,
        {$inc: decUpdateOperation,
         $push: {
             'carted': { 'quantity': 1, 'cartId':insertedId, "size" : item.size,
                         'timestamp': now } } },
        {w:1})
    
    
   if (result === 0) {
    Baskets.update(
            {'_id': basketId},
            { $pull: { 'itemsDetails' : {'oid': item.oid, 'size' : item.size }}})
    throw new Meteor.Error("INADEQUATE_INVENTORY", "You did not have sufficient items in your inventory");
   }
    
   return {"id" : insertedId, "password" : password};
};

function updateWithNewItem(item,basketId){
	var now = new Date();
  itemToInsert = {
          "product" : item.product,
          "file" : item.file,
          "price" : item.price,
          "size": item.size,  
          "oid" : item.oid,
          "initials" : [item.initials],
   }
   itemToInsert["quantity" + item.initials] = 1;
    //Make sure the cart is still active and add the line item
  var result = Baskets.update(
        {'_id': basketId, 'status': 'active' },
        { $set: { 'lastModified': now },
          $push: {
              'itemsDetails': itemToInsert} },
        {w:1})
    
    if (result === 0) {
    throw new Meteor.Error("INACTIVE CART", "Your cart has expired");
    }

   var updateQueryObject = {};
   var decUpdateOperation = {};
   generateNewitemQueryObject(updateQueryObject,decUpdateOperation,item,1); 
    
    //Update the inventory
    var result = Inventory.update(
        updateQueryObject,
        {$inc: decUpdateOperation,
         $push: {
             'carted': { 'quantity': 1, 'cartId':basketId, 'size' : item.size,
                         'timestamp': now }}},
        {w:1})
    
    
   if (result === 0) {
      Baskets.update(
            {'_id': basketId},
            { $pull: { 'itemsDetails' : {'oid': item.oid, 'size' : item.size }}})
    throw new Meteor.Error("INADEQUATE_INVENTORY", "You did not have sufficient items in your inventory");
    }

}

function updateQuantity(item,basketId,delta){
   var now = new Date();
   var itemToInsert = {};
   itemToInsert["itemsDetails.$.quantity" + item.initials] = 1;
   
   //Make sure the cart is still active and add the line item
    result = Baskets.update(
        {'_id': basketId, 'status': 'active', 'itemsDetails': {$elemMatch: {'oid': item.oid, 'size' : item.size}}},
        { $set: {'last_modified': now},
          $inc : itemToInsert,
          $push :{"itemsDetails.$.initials" : item.initials}
        },
        {w:1});

    if (result === 0) {
      throw new Meteor.Error("INACTIVE CART", "Your cart has expired");
    }
     
   var updateQueryObject = {};
   var decUpdateOperation = {};
   generateQuantityQueryObject(basketId,updateQueryObject,decUpdateOperation,item,1); 
    //Update the inventory
    result = Inventory.update(
        updateQueryObject,
        {$inc: decUpdateOperation,
         $set: {'timestamp': now } },
        {w:1})
        
    // Roll back our cart update
    if (result === 0) {
      Baskets.update(
            {'_id': basketId, 'itemsDetails': {$elemMatch: {'oid': item.oid, 'size' : item.size}}},
            {$unset: itemToInsert,
             $pull:  {"initials" : item.initials}});
     throw new Meteor.Error("INADEQUATE_INVENTORY", "You did not have sufficient items in your inventory");
    }
}

function updateQuantityInitials(item,initials,basketId,value){
  var now = new Date();
  itemToInsert = {};
  itemToRemove = {};
  itemToInsert["itemsDetails.$.quantity" + item.initials] = 1;
  itemToRemove["itemsDetails.$.quantity" + item.initials] = -1;
   //Make sure the cart is still active and add the line item
    result = Baskets.update(
        {'_id': basketId, 'status': 'active', 'itemsDetails': {$elemMatch: {'oid': item.oid, 'size' : item.size}}},
        { $set: {'last_modified': now},
          $inc : itemToInsert
        },
        {w:1});

    if (result === 0) {
      throw new Meteor.Error("INACTIVE CART", "Your cart has expired");
    }
     
   var updateQueryObject = {};
   var decUpdateOperation = {};
   generateQuantityQueryObject(basketId,updateQueryObject,decUpdateOperation,item,1); 
    //Update the inventory
    result = Inventory.update(
        updateQueryObject,
        {$inc: decUpdateOperation,
         $set: {'timestamp': now } },
        {w:1})
        
    // Roll back our cart update
    if (result === 0) {
      Baskets.update(
            {'_id': basketId, 'itemsDetails': {$elemMatch: {'oid': item.oid, 'size' : item.size}}},
            {$inc : itemToRemove})
     throw new Meteor.Error("INADEQUATE_INVENTORY", "You did not have sufficient items in your inventory");
    } 
}


function generateNewitemQueryObject(updateQueryObject,decUpdateOperation,item,value){
	updateQueryObject['_id'] = new Meteor.Collection.ObjectID(item.oid)
	if(item.size === "noSize") {
   	updateQueryObject['quantity'] = {$gte: 1} ;
   	decUpdateOperation['quantity'] = -value;
   } else {
   	updateQueryObject["quantitySize." + item.size]  = {$gte: 1};
   	decUpdateOperation["quantitySize." + item.size]  = -value;
   }
}

function generateQuantityQueryObject(basketId,updateQueryObject,decUpdateOperation,item,value){
	updateQueryObject['_id'] = new Meteor.Collection.ObjectID(item.oid);
	updateQueryObject['carted'] = {$elemMatch: {'cartId' : basketId,'size': item.size}};
	decUpdateOperation['carted.$.quantity'] = value;
	if(item.size === "noSize") {
   	 updateQueryObject['quantity'] = {$gte: value} ;
   	 decUpdateOperation['quantity'] = -value;
    } else {
   	 updateQueryObject["quantitySize." + item.size]  = {$gte: value};
   	 decUpdateOperation["quantitySize." + item.size]  = -value;
    }


}