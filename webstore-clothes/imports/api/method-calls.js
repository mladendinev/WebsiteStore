import {Inventory} from './products.js';

export function calculatePriceCall(){
		var total=0;
		     Session.get('itemsInBasketSession').forEach(function(basketItem,index){
		        var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)});
			        if ((typeof item !== "undefined") && item !== null) {
			        total = total + parseInt(item.price);
			    }
		 	  });
		      return total;
	 
};