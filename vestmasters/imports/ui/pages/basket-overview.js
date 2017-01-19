import {calculatePriceCall,obtainBraintreeId,removeItem,sanitizeBasket} from '../../api/method-calls.js';
import {BRAINTREE_CLIENT_TOKEN,BASKET_ID,BASKET_SECRET} from '../../api/session-constants.js';
import '../components/dropdown-products.js';
import '../components/number-of-basket-items.js';
import '../components/navbar-shopping.js';
import './basket-overview.html';


import {Inventory}  from '../../api/products.js';
import {Baskets} from '../../api/products.js';

Template.basketOverview.onCreated(function(){
 this.basket = new ReactiveVar();
 this.autorun(() => {
      Meteor.subscribe('inventory');
      if((typeof amplify.store(BASKET_ID) !== "undefined") && amplify.store(BASKET_ID) !== null
         && (typeof amplify.store(BASKET_SECRET) !== "undefined") && amplify.store(BASKET_SECRET) !== null){
       Meteor.subscribe('baskets',amplify.store(BASKET_ID),amplify.store(BASKET_SECRET));
      }
      this.basket.set(Baskets.findOne({'_id' : amplify.store(BASKET_ID), 'secret' : amplify.store(BASKET_SECRET)}));
  });
});

Template.basketOverview.onRendered(function(){
   Session.set("DocumentTitle","Basket Overview");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.basketOverview.helpers({

  getItemDetails(){
    var basket = Template.instance().basket.get();
    if((typeof basket !== "undefined") && basket !== null) {
    return basket.itemsDetails;
  } else {
    return [];
  } 
  }, 

  getInitial(item){
    return item.initials;
  },

  repeatedInitial(item, initial){
    var quantityCounter = item["quantity" + initial];
    var result = new Array(quantityCounter);
    for (var i =0; i<result.length; i++){
      result[i]=i;
    }
    return result;
  },

  hasInitial(initial){
    return initial !== "noInitials";
  },

  hasSize(size){
     return size !== "noSize";
  },

 total(){
  var basket = Template.instance().basket.get();
  if((typeof basket !== "undefined") && basket !== null) {
 	 return calculatePriceCall(basket);
  }
 }
});

 Template.basketOverview.events({

   'click .remove-item'(event){
          var eventSourceId = $(event.currentTarget).attr("id");
          var eventSourceSize = $(event.currentTarget).next().attr("id");
          var eventSourceInitials = $(event.currentTarget).next().next().attr("id");
          removeItem(amplify.store(BASKET_ID),eventSourceId,eventSourceSize,eventSourceInitials);
    },

    'click .proceed-to-checkout-button'(event){
            obtainBraintreeId();
            FlowRouter.go('DeliveryDetails');
    }
 });