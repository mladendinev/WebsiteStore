import {Inventory}  from '../../imports/api/products.js';

if (Meteor.isServer){
	Meteor.methods({
	   "calculateTotalPrice": function(itemsArray) {
	      var total=0;
	      itemsArray.forEach(function(basketItem,index){
	        var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)});
	        total = total + parseInt(item.price);
	 	  });
	      return total;
	   }
	});
}