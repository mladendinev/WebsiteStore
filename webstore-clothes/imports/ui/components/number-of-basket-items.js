import './number-of-basket-items.html';

Template.numberOfBasketItems.helpers({
 numberOfItemsInBasket(){
      console.log(amplify.store('itemsInBasket'));
      return Session.get('itemsInBasketTemplateLocal');
    },
});