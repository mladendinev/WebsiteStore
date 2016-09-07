import './item-template.html';
import '../components/shopping-product.html';
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
    	console.log(oid.valueOf());
    	
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

});