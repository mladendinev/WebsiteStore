import './shopping-template.html';
import '../components/shopping-product.html'
import '../components/number-of-basket-items.js'
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Inventory}  from '../../api/products.js';
import {Products}  from '../../api/products.js';

 Template.shoppingTemplate.created = function () {
 
  this.pagination = new Meteor.Pagination(Inventory, {perPage:6});
 };

Template.shoppingTemplate.helpers({
    templatePagination() {
          return Template.instance().pagination;
    },
  	
    documents() {
      Template.instance().pagination.filters({"type" : FlowRouter.getQueryParam('product')});
      return Template.instance().pagination.getPage();
    },


  	// optional helper used to return a callback that should be executed before changing the page
    clickEvent() {
        return function(e, templateInstance, clickedPage) {
            e.preventDefault();
        };
    },
    extractObjectId(id) {
      return id._str;
    },
    shopping() {
                return Inventory.find({"type" : productName});
               },
    products(){
               return Products.find({});
              }   
});




Template.shoppingTemplate.onRendered(function(){
   Session.set("DocumentTitle","Shopping Page");
   $("body").removeClass(); 
   $("body").addClass("body-shopping");
  });
