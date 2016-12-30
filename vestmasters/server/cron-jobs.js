import {Baskets,Inventory} from '../imports/api/products.js';

var cleanUpBaskets = new Cron(function() {
	 now = new Date();
   var timeout = 1800000;
   var threshold = new Date(now - timeout);

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
}, {minute: 30});

var cleanUpInventory = new Cron(function() {
    
    now = new Date()
    var timeout = 3600000;
    var threshold = new Date(now - timeout);


    // Find all the expiring carted items
    Inventory.find({'carted.timestamp': {'$lt': threshold }}).forEach(function(item){

      // Find all the carted items that matched
        var carted={};
        item['carted'].forEach(function(carted_item){
            if(carted_item['timestamp'] < threshold){
                if(typeof carted[carted_item['cartId']] === 'undefined' || carted[carted_item['cartId']] === null) {
                carted[carted_item['cartId']]={}
              }
                carted[carted_item['cartId']][carted_item['size']] = carted_item;
             }
        })
        
 
        // First Pass: Find any carts that are active and refresh the carted items
        Baskets.find(
            { '_id': {'$in': Object.keys(carted)},
              'status': {'$in' : ['active', 'pending', 'serverExpiring', 'clientExpiring']}}).forEach(function(cart){
               key = cart['_id'];
            Object.keys(carted[cart['_id']]).forEach(function(size){
            Inventory.update(
                { '_id': item['_id'],
                  'carted':{$elemMatch : {'cartId': cart['_id'], 'size': size}}},

                { '$set': {'carted.$.timestamp': now } })

            })
            delete carted[key]  ;
         });

        //Second Pass: All the carted items left in the dict need to now be
        //    returned to inventory
        Object.keys(carted).forEach(function(cart_id){
          Object.keys(carted[cart_id]).forEach(function(cart_size){
           // console.log("deleting");
           // console.log(cart_id);
           // console.log(cart_size);
           // console.log(carted[cart_id][cart_size]['quantity']);
           if(carted[cart_id]["size"]== "noSize") {
           Inventory.update(
                { '_id': item['_id'],
                  'carted' : {$elemMatch: {'cartId': cart_id, 'size' : cart_size, 'quantity' : carted[cart_id][cart_size]['quantity'] }}},
                { '$inc': { 'quantity': carted[cart_id][cart_size]['quantity'] },
                  '$pull': { 'carted': { 'cartId': cart_id, 'size': cart_size} } })
          } else{
            quantitySizeInc={};
            quantitySizeInc["quantitySize." + cart_size] = carted[cart_id][cart_size]['quantity']; 
            Inventory.update(
                { '_id': item['_id'],
                  'carted' : {$elemMatch: {'cartId': cart_id, 'size' : cart_size, 'quantity' : carted[cart_id][cart_size]['quantity']}}},
                { '$inc': quantitySizeInc,
                  '$pull': { 'carted': { 'cartId': cart_id, 'size' : cart_size } } })
          }
        })
       })
     })
},{hour: 12});
