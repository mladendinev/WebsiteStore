import './item-template.html';
import '../components/shopping-product.html';
import '../components/number-of-basket-items.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Inventory}  from '../../api/products.js';
import {Products}  from '../../api/products.js';

Template.itemTemplate.onRendered(function(){
   Session.set("DocumentTitle","Purchase Item");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.itemTemplate.helpers({
    item() {
    	var oid = new Meteor.Collection.ObjectID(FlowRouter.getQueryParam('id'));
     return Inventory.findOne({"_id" : oid});
    },

    products() {
    	return Products.find({});
    },
   
});

Template.itemTemplate.events({

 'click .item-small-image' (event) {
 	$("#product-main-image").attr("src",$(event.currentTarget).attr("src"));
 },

 'click #add-to-basket-button' (event) {
   var currentValue = amplify.store('itemsInBasket') 
   if ((typeof currentValue !== " undefined") && (currentValue !== null)) {
     amplify.store('itemsInBasket',currentValue+1);

   } else {
      amplify.store('itemsInBasket',1);
   }
   Session.set('itemsInBasketTemplateLocal',amplify.store('itemsInBasket'));
   console.log(amplify.store('itemsInBasket'));
 }

});