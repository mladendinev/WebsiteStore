import {Baskets,Inventory} from '../imports/api/products.js';

Meteor.methods({
  removeItem: function(basketId,itemId,size,initials) {
   check(basketId,String)
   check(itemId,String);
   check(size,String);
   check(initials,String);
   
   removeUpdateQuantity(basketId,itemId,size,initials);

   
  },
   
  sanitizeBasket: function(basketId,itemId,size,initials) {
     check(basketId,String)
     check(itemId,String);
     check(size,String);
     check(initials,String);
     
     // removeSizeWhenZero(basketId,itemId,size,initials);
     // console.log("REMOVED ITEM WITH SIZE ZERO");
     // removeItemWhenInitialsEmpty(basketId,itemId,size,initials); 
     // console.log("REMOVE ITEM INITIALS");
  } 

});

function removeItemWhenInitialsEmpty(basketId,itemId,size,initials){
    var now = new Date();

    result = Baskets.update(
        {'_id': basketId, 'status': 'active', 'itemsDetails': {$elemMatch: {'oid': itemId, "size" : size, 
         'initials' : {$exists: true}, 'initials' : {$size:0}}}},
        { $pull : {"itemsDetails" : {"oid" : itemId, "size" : size}}
        },
        {w:1});

    if (result === 0) {
      throw new Meteor.Error("INITIALS_NOT_EMPTY", "The initials are not empty");
    }
    //Update the inventory
    result = Inventory.update(
        {"_id" : new Meteor.Collection.ObjectID(itemId)},
        {$pull: {"carted" : {"cartId" : basketId, "size": size}},
         $set: {'timestamp': now }},
        {w:1})

}

function removeSizeWhenZero(basketId,itemId,size,initials){
     itemToRemove={};
     itemToRemove["quantity" + initials] = {$lte : 0};
     itemToRemove["oid"] = itemId;
     itemToRemove["size"]= size;
     removeSize =  {}
     removeSize["itemsDetails.$.quantity" + initials] = ""
   //Make sure the cart is still active and add the line item
    result = Baskets.update(
        {"_id" : basketId, "status" : "active", "itemsDetails": {$elemMatch: itemToRemove}},
        { $unset : removeSize,
          $pull: {"itemsDetails.$.initials" : initials}
        },
        {w:1});

    if (result === 0) {
      throw new Meteor.Error("SIZE_NOT_ZERO", "The size has not reached zero");
    }
}


function removeUpdateQuantity(basketId,itemId,size,initials){
 
 var now = new Date();
  itemToRemove = {};
  itemToRemove["itemsDetails.$.quantity" + initials] = -1;
  updateRemoveObject ={}
  updateRemoveObject['oid'] = itemId; 
  updateRemoveObject['size'] = size;
  updateRemoveObject['quantity' + initials] = {$gte : 1};
   //Make sure the cart is still active and add the line item
    result = Baskets.update({"_id" : basketId, 'status':'active' ,'itemsDetails' : {$elemMatch: updateRemoveObject}},
        { $set: {'last_modified': now},
          $inc : itemToRemove
        },
        {w:1});

    if (result === 0) {
      throw new Meteor.Error("INACTIVE CART", "Your cart has expired");
    }
     
   var updateQueryObject = {};
   var decUpdateOperation = {};
   generateQuantityQueryObjectRemove(basketId,updateQueryObject,decUpdateOperation,size,itemId,-1); 
    //Update the inventory
    result = Inventory.update(
        {"_id":new Meteor.Collection.ObjectID(itemId), "carted" : {$elemMatch: updateQueryObject}},
        {$inc: decUpdateOperation,
         $set: {'timestamp': now } },
        {w:1})
        
}

function generateQuantityQueryObjectRemove(basketId,updateQueryObject,decUpdateOperation,size,itemId,value){
	updateQueryObject['cartId'] = basketId;
	updateQueryObject['size'] = size;
	decUpdateOperation['carted.$.quantity'] = value;
	if(size === "noSize") {
   	 decUpdateOperation['quantity'] = -value;
    } else {
   	 decUpdateOperation["quantitySize." + size]  = -value;
    }
}