import './number-of-basket-items.html';

Template.numberOfBasketItems.helpers({
 numberOfItemsInBasket(){
	 	var numberOfItemsInBasket = Session.get("numberOfItemsInBasketSession");
	 	  if(numberOfItemsInBasket > 0) {
	      return Session.get("numberOfItemsInBasketSession");
	      } else {
	      	return null;
	      }
	    },
});