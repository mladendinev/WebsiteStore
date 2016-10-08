import {Baskets,Inventory} from '../imports/api/products.js';
const THRESHOLD_LOCK = 60;
const THRESHOLD_NEXT = 150;

var everyMinute = new Cron(function() {
	 now = new Date()
   var timeout = 1800000;
    threshold = new Date(now - timeout);

    //Lock and find all the expiring carts
    Baskets.update(
        {'status': 'active', 'lastCheckedByClient': { '$lt': threshold } },
        {$set: { 'status': 'expiring'} },
        {multi : true} )

    //Actually expire each cart
    Baskets.find({'status': 'expiring'}).forEach(function(basket){

        //Return all line items to inventory
        basket.itemsDetails.forEach(function(item){
          var incObject = {};
          var invItem = Inventory.findOne({'_id' : item.oid});
          var totalQuantity = 0;
          item.initials.forEach(function(initial){
             totalQuantity = totalQuantity + item["quantity" + initial];
          });
          if (invItem.size){
          incObject["quantitySize."+item.size] = totalQuantity;
            Inventory.update(
                { '_id': item.oid},
                {$inc: incObject,
                $pull: { 'carted': { 'cartId': basket._id }}});
          } else {
             incObject["quantity"] = totalQuantity;
             Inventory.update(
                { '_id': item.oid},
                {$inc: incObject,
                $pull: { 'carted': { 'cartId': basket._id }}});
          }
        })

        Baskets.remove({'_id': cart['id']});
        Meteor.users.remove('_id' : basket.user);
      })
}, {});

