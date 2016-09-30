import './number-of-basket-items.html';
import {NUMBER_ITEMS_SESSION} from '../../api/session-constants.js';


Template.numberOfBasketItems.helpers({
 numberOfItemsInBasket(){
	 	var numberOfItemsInBasket = Session.get(NUMBER_ITEMS_SESSION);
	 	  if(numberOfItemsInBasket > 0) {
	      return Session.get(NUMBER_ITEMS_SESSION);
	      } else {
	      	return null;
	      }
	    },
});