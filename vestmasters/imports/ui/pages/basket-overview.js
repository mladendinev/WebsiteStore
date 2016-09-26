import '../components/dropdown-products.js'
import '../components/number-of-basket-items.js'
import './basket-overview.html'

import {Inventory}  from '../../api/products.js';


Template.basketOverview.onCreated(function(){
 Session.set("itemsInBasketSession",amplify.store("itemsInBasket"));
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
 	//PROBLEM RACE CONDITION //TODO: read documentation to fix
 	var total = 0;
 	Session.get('itemsInBasketSession').forEach(function(basketItem,index){
       var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}); 
       console.log(item);
       total = total + parseInt(item.price);
 	});
   return total;
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
          Session.set("numberOfItemsInBasketSession",amplify.store("itemsInBasket").length)

   },

 });