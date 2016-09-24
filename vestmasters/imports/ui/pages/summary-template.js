import './summary-template.html';
import {Inventory}  from '../../api/products.js';
import {TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,DELIVERY_COST} from '../../api/session-constants.js';
import {calculatePriceCall,totalPlusDelivery} from '../../api/method-calls.js';

Template.summaryOrder.onCreated(function(){
Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
  this.autorun(() => {
    Meteor.subscribe("countries");
    Meteor.subscribe("products");
    Meteor.subscribe("inventory");
    Session.set(TOTAL_PRICE_SESSION,calculatePriceCall());
    Session.set(DELIVERY_COST,'');
  });
});


Template.summaryOrder.helpers({
  getItem(basketItem){
  var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}); 
  return  {"oid" : basketItem.oid,
          "size" : basketItem.size,
          "item" : item,
          "initials" : basketItem.initials,
          "quantity" : basketItem.quantity };
 },

   deliveryOrder(){
       return Session.get(DELIVERY_COST);
   },

   totalPriceOrder(){
      
      return totalPlusDelivery(Session.get(TOTAL_PRICE_SESSION),Session.get(DELIVERY_COST));
   },

   items(){
      return Session.get(ITEMS_IN_BASKET_SESSION);
   },

});