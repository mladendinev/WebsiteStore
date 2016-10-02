import './item-template.html';
import '../components/shopping-product.html';
import '../components/number-of-basket-items.js';
import '../components/dropdown-products.js';
import '../components/navbar-shopping.js';
import {ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION, BASKET_ID} from '../../api/session-constants.js';
import {createNewBasketAndUpdate,updateBasket} from '../../api/method-calls.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Inventory}  from '../../api/products.js';

Template.itemTemplate.onRendered(function(){
   Session.set("DocumentTitle","Purchase Item");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.itemTemplate.onCreated(function(){
 this.itemId = FlowRouter.getQueryParam('id');
 this.item = new ReactiveVar();
 this.autorun(() => {
   Meteor.subscribe('inventory');
   this.item.set(Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(this.itemId)}));
  });
});

Template.itemTemplate.helpers({
    item() {
      return Template.instance().item.get();
    },

    outOfStock(sizeDict,size){
       return (typeof sizeDict[size] === "undefined" || sizeDict[size] <= 0)
    }
});

Template.itemTemplate.events({

 'click .item-small-image' (event) {
 	$("#product-main-image").attr("src",$(event.currentTarget).attr("src"));
 },

 'click #add-to-basket-button' (event) {
   // var currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
    
    var size = $("#sel-size").val();
    if((typeof size === "undefined") || size === null) {
      size = "noSize";
    }
    
    var initials = $("#initials").val();
    if((typeof initials === "undefined") || initials === null || initials === "") {
      initials = "noInitials";
    }

    var item = {
          "file" : Template.instance().item.get().file,
          "price" : Template.instance().item.get().price,
          "size": size,  
          "oid" : Template.instance().itemId,
          "initials" : initials,
          "quantity" : 1
           };

    updateBasket(item);
}

});