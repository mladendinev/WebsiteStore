import './item-template.html';
import '../components/shopping-product.html';
import '../components/number-of-basket-items.js';
import '../components/dropdown-products.js';
import '../components/navbar-shopping.js';
import {ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION} from '../../api/session-constants.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Inventory}  from '../../api/products.js';

Template.itemTemplate.onRendered(function(){
   Session.set("DocumentTitle","Purchase Item");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.itemTemplate.onCreated(function(){
 this.state = new ReactiveDict();

 this.autorun(() => {
   Meteor.subscribe('inventory');
 });
});

Template.itemTemplate.helpers({
    item() {
    	Template.instance().state.set("oid", FlowRouter.getQueryParam('id'));
      return Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(Template.instance().state.get("oid"))});
    },
});

Template.itemTemplate.events({

 'click .item-small-image' (event) {
 	$("#product-main-image").attr("src",$(event.currentTarget).attr("src"));
 },

 'click #add-to-basket-button' (event) {
   var currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
     
     if (typeof currentValue !== "undefined" && currentValue !== null) {
          currentValue.push({
          "size": $("#sel-size").val(),  
          "oid" : Template.instance().state.get("oid"),
          "initials" : $("#initials").val(),
          "qantity" : 1
           });
       amplify.store(ITEMS_IN_BASKET_STORE,currentValue);
     } else {
       amplify.store(ITEMS_IN_BASKET_STORE,[{
        "size": $("#sel-size").val(),  
        "oid" : Template.instance().state.get("oid"),
        "initials" : $("#initials").val(),
        "quantity" : 1
       }]);
     }
   Session.set(NUMBER_ITEMS_SESSION,amplify.store(ITEMS_IN_BASKET_STORE).length);
   console.log(amplify.store('itemsInBasket'));
 }

});