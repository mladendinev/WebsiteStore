import {calculatePriceCall} from '../../api/method-calls.js';
import '../components/dropdown-products.js';
import '../components/number-of-basket-items.js';
import './basket-overview.html';

import {Inventory}  from '../../api/products.js';


Template.basketOverview.onCreated(function(){
 Session.set("itemsInBasketSession",amplify.store("itemsInBasket"));
 calculatePriceCall();
});

Template.basketOverview.onRendered(function(){
   Session.set("DocumentTitle","Basket Overview");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.basketOverview.helpers({

 itemsInBasket(){
    return Session.get("itemsInBasketSession");
 },

 getItem(basketItem){
 	var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}); 
 	return  { "oid" : basketItem.oid,
 		      "size" : basketItem.size,
 		      "item" : item,
 		      "initials" : basketItem.initials,
 		      "quantity" : basketItem.quantity };
 },
 total(){
 	return Session.get("totalPrice");
 },
});

 Template.basketOverview.events({

   'click .remove-item'(event){
          var currentItemsArray = amplify.store("itemsInBasket");
          var index = $(event.currentTarget).attr("id");
          currentItemsArray.splice(index,1);
          console.log(currentItemsArray);
          amplify.store("itemsInBasket",currentItemsArray);
          Session.set("itemsInBasketSession",amplify.store("itemsInBasket"));
          calculatePriceCall();
          Session.set("numberOfItemsInBasketSession",amplify.store("itemsInBasket").length);

   },

    'click .proceed-to-checkout-button'(event){
            FlowRouter.go('DeliveryDetails');
    }
 });