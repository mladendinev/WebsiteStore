import './number-of-basket-items.html';

Template.numberOfBasketItems.helpers({
 numberOfItemsInBasket(){
      return Session.get('numberOfItemsInBasketSession');
    },
});