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
   console.log(Session.get("itemsInBasketSession"));
   return Session.get("itemsInBasketSession");
 },

 getItem(oid){
 	console.log(oid);
 	var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(oid)}); 
 	return  item;
 },
 total(){
 	var total = 0;
 	Session.get('itemsInBasketSession').forEach(function(oid,index){
       var item = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(oid)}); 
       total = total + item.price;
 	});
   return total;
 }

});