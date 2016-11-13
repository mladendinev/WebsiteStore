import {Baskets,Inventory} from '../imports/api/products.js';

var everyMinute = new Cron(function() {
	 now = new Date()
   var timeout = 1800000;
    threshold = new Date(now - timeout);

    //Lock and find all the expiring carts
    Baskets.update(
        {'status': 'active', 'lastCheckedByClient': { '$lt': threshold } },
        {$set: { 'status': 'serverExpiring'} },
        {multi : true} )

    //Actually expire each cart
    Baskets.find({'status': 'serverExpiring'}).forEach(function(basket){

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

        Baskets.remove({'_id': basket._id});
      })
}, {});

