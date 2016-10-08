import {Baskets,Inventory} from '../imports/api/products.js';

Meteor.methods({
	
checkForExpirationClient: function(basketId){
   check(basketId,String);

   now = new Date()
   var timeout = 900000;
   threshold = new Date(now - timeout);
    //Lock and find all the expiring carts
    var basket = Baskets.findOne({'_id': basketId});
    if( (typeof basket !== "undefined") && basket !== null) {

    var  result = Baskets.update(
                 {'_id': basketId, 'status': 'active', 'lastModified': { $lt: threshold } },
                 {$set: { 'status': 'expiring'} });


    if(result === 0) {
         Baskets.update(
                 {'_id': basketId},
                 {$set: { 'lastCheckedByClient': now} });
        var warning = now - basket.lastModified > 600000;
        return {"expired" : false,"warning" : warning};
    } else {
        //Return all line items to inventory
        basket.itemsDetails.forEach(function(item){
          var incObject = {};
          var invItem = Inventory.findOne({'_id' : new Meteor.Collection.ObjectID(item.oid)});
          var totalQuantity = 0;
          item.initials.forEach(function(initial){
             totalQuantity = totalQuantity + item["quantity" + initial];
          });
          if (invItem.size){
          incObject["quantitySize."+item.size] = totalQuantity;
            Inventory.update(
                { '_id': new Meteor.Collection.ObjectID(item.oid)},
                {$inc: incObject,
                $pull: { 'carted': { 'cartId': basket._id }}});
          } else {
             incObject["quantity"] = totalQuantity;
             Inventory.update(
                { '_id': new Meteor.Collection.ObjectID(item.oid)},
                {$inc: incObject,
                $pull: { 'carted': { 'cartId': basket._id }}});
          }
        })
         //Actually expire each cart
        Baskets.remove({'_id': basket._id});
        return {"expired" : true};
    }
   

	} else {
		return {"expired" : false}
	}
  }
});