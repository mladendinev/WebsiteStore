import './item-template.html';
import '../components/shopping-product.html';
import '../components/number-of-basket-items.js';
import '../components/dropdown-products.js';
import '../components/navbar-shopping.js';
import {ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION} from '../../api/session-constants.js';
import {getSingleItem} from '../../api/method-calls.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Inventory}  from '../../api/products.js';

Template.itemTemplate.onRendered(function(){
   Session.set("DocumentTitle","Purchase Item");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.itemTemplate.onCreated(function(){
 this.itemId = FlowRouter.getQueryParam('id');
 
 this.autorun(() => {
   Meteor.subscribe('inventory');
  });
});

Template.itemTemplate.helpers({
    item() {
      return Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(Template.instance().itemId)});
    },
});

Template.itemTemplate.events({

 'click .item-small-image' (event) {
 	$("#product-main-image").attr("src",$(event.currentTarget).attr("src"));
 },

 'click #add-to-basket-button' (event) {
   getSingleItem(Template.instance().itemId);   
 }

});