import './shopping-product.html';

Template.shoppingProduct.helpers({
  isFutureAndTimezoneIs: function(timezone){
    return this.future && this.timezone == timezone;
  }
});