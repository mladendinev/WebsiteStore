import './number-of-basket-items.html';
import {NUMBER_ITEMS_SESSION,BASKET_ID,BASKET_ID_SESSION} from '../../api/session-constants.js';
import {Baskets} from '../../api/products.js'

Template.numberOfBasketItems.onCreated(function(){
Session.set(BASKET_ID_SESSION,amplify.store(BASKET_ID));
this.autorun(() => {
      if((typeof Session.get(BASKET_ID_SESSION) !== "undefined") && Session.get(BASKET_ID_SESSION) !== null){
       Meteor.subscribe('baskets',Session.get(BASKET_ID_SESSION));
       }
});

});
Template.numberOfBasketItems.helpers({
 numberOfItemsInBasket(){
	 	var number = 0;
	 	var basket = Baskets.findOne(Session.get(BASKET_ID_SESSION));
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