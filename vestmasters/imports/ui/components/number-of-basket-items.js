import './number-of-basket-items.html';
import {NUMBER_ITEMS_SESSION,BASKET_ID} from '../../api/session-constants.js';
import {Baskets} from '../../api/products.js'

Template.numberOfBasketItems.onCreated(function(){

this.autorun(() => {
      if((typeof amplify.store(BASKET_ID) !== "undefined") && amplify.store(BASKET_ID) !== null){
       Meteor.subscribe('baskets',amplify.store(BASKET_ID));
       }
});

});
Template.numberOfBasketItems.helpers({
 numberOfItemsInBasket(){
	 	var number = 0;
	 	var basket = Baskets.findOne(amplify.store(BASKET_ID));
        if((typeof basket !== "undefined") && basket !== null) {
           basket.itemsDetails.forEach(function(item){
            item.initials.forEach(function(initial){
             var quantityCounter = item["quantity" + initial];
              while(quantityCounter>0){
                number = number + 1;
                quantityCounter = quantityCounter-1;
              }
             }); 
            });
           }
        if(number === 0){
        	return null
        }else {
        	return number;
        }
 },
});