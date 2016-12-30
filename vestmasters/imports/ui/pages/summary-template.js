import './summary-template.html';
import {Inventory,Baskets}  from '../../api/products.js';
import {BASKET_SECRET,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,DELIVERY_COST,BASKET_ID} from '../../api/session-constants.js';
import {calculatePriceCall,totalPlusDelivery} from '../../api/method-calls.js';

Template.summaryOrder.onCreated(function(){
Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
  this.basket = new ReactiveVar();
  this.autorun(() => {
    if((typeof amplify.store(BASKET_ID) !== "undefined") && amplify.store(BASKET_ID) !== null
         && (typeof amplify.store(BASKET_SECRET) !== "undefined") && amplify.store(BASKET_SECRET) !== null){
       Meteor.subscribe('baskets',amplify.store(BASKET_ID),amplify.store(BASKET_SECRET));
       }
    this.basket.set(Baskets.findOne({'_id' : amplify.store(BASKET_ID), 'secret' : amplify.store(BASKET_SECRET)}));
    Session.set(DELIVERY_COST,'');
  });
});


Template.summaryOrder.helpers({
   deliveryOrder(){
       return Session.get(DELIVERY_COST);
   },

   totalPriceOrder(){
    var basket = Template.instance().basket.get();
    if((typeof basket !== "undefined") && basket !== null) {
      return totalPlusDelivery(basket,Session.get(DELIVERY_COST));
    }
   },

   items(){
    var result =""
    var basket = Template.instance().basket.get();
  if((typeof basket !== "undefined") && basket !== null) {
  basket.itemsDetails.forEach(function(item){
    item.initials.forEach(function(initial){
      var quantityCounter = item["quantity" + initial];
      while(quantityCounter>0){
      result = result + "<p>" + item.product + "</p>\n" 
      quantityCounter = quantityCounter-1;
      }
    });
  });
 }
  return result;
  },

});