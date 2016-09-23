import {calculatePriceCall,obtainBraintreeId} from '../../api/method-calls.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION} from '../../api/session-constants.js';
import '../components/dropdown-products.js';
import '../components/number-of-basket-items.js';
import '../components/navbar-shopping.js';
import './basket-overview.html';


import {Inventory}  from '../../api/products.js';


Template.basketOverview.onCreated(function(){
 Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
 this.autorun(() => {
      Meteor.subscribe('inventory');
      Session.set(TOTAL_PRICE_SESSION,calculatePriceCall());
  });
});

Template.basketOverview.onRendered(function(){
   Session.set("DocumentTitle","Basket Overview");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.basketOverview.helpers({

 itemsInBasket(){
    return Session.get(ITEMS_IN_BASKET_SESSION);
 },

 total(){
 	return Session.get(TOTAL_PRICE_SESSION);
 },
});

 Template.basketOverview.events({

   'click .remove-item'(event){
          var currentItemsArray = amplify.store(ITEMS_IN_BASKET_STORE);
          var index = $(event.currentTarget).attr("id");
          currentItemsArray.splice(index,1);
          console.log(currentItemsArray);
          amplify.store(ITEMS_IN_BASKET_STORE,currentItemsArray);
          Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
          Session.set(TOTAL_PRICE_SESSION,calculatePriceCall());
          Session.set(NUMBER_ITEMS_SESSION,amplify.store(ITEMS_IN_BASKET_STORE).length);

   },

    'click .proceed-to-checkout-button'(event){
            obtainBraintreeId();
            FlowRouter.go('DeliveryDetails');
    }
 });