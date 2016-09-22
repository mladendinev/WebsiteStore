import {Inventory} from './products.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION} from './session-constants.js';

export function calculatePriceCall(){
		var total=0;
		     Session.get(ITEMS_IN_BASKET_SESSION).forEach(function(basketItem,index){
		        var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)});
			        if ((typeof item !== "undefined") && item !== null) {
			        total = total + parseInt(item.price);
			    }
		 	  });
		      return total;
	 
};

export function obtainBraintreeId(){
   Meteor.call('getClientToken', function(error, clientToken) {
    if (error) {
      console.log(error);
    } else { 
	   amplify.store(BRAINTREE_CLIENT_TOKEN,clientToken);
   };
  });
};

export function createTransaction(nonce){
	Meteor.call('createTransaction', nonce, function(error, success) {
                if (error) {
                  throw new Meteor.Error('transaction-creation-failed');
                } else {
                  console.log('thank you for your payment!');
                  alert('Thank you for your payment!');
                }
           });
};