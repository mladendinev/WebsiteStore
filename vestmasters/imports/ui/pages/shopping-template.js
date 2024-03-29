import './shopping-template.html';
import '../components/navbar-shopping.js';
import '../components/shopping-product.html'
import '../components/number-of-basket-items.js'
import { FlowRouter } from 'meteor/kadira:flow-router';

import {Inventory}  from '../../api/products.js';
import {Products}  from '../../api/products.js';

Template.shoppingTemplate.onRendered(function(){
   Session.set("DocumentTitle","Shopping Page");
   $("body").removeClass();
   $("body").addClass("body-shopping");
  });



Template.shoppingTemplate.created = function () {
   this.autorun(() => {
    Meteor.subscribe("carousel");
  });
  this.pagination = new Meteor.Pagination(Inventory, {fields : {carted : 0},perPage:6, sort:{index:1}, page: Number(FlowRouter.getQueryParam('page'))});
 };

Template.shoppingTemplate.helpers({
    templatePagination() {
       return Template.instance().pagination;
    },
  	
    documents() {
      var templateInstance = this;
      Template.instance().pagination.filters({"type" : FlowRouter.getQueryParam('product')});

      return Template.instance().pagination.getPage();
    },


  	// optional helper used to return a callback that should be executed before changing the page
    clickEvent() {
        return function(e, templateInstance, clickedPage) {
            e.preventDefault();
            FlowRouter.setQueryParams({"page":clickedPage})
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
              },
    soldOut(hasSize,quantity,sizes,quantitySize){   
          if(hasSize === false) {
            return quantity <=0;
          } else {
            var result = true;
            sizes.forEach(function(size,index){
                result = result && ((typeof quantitySize[size] === "undefined") || quantitySize[size] <=0);
            });
            return result;
          }
     },
});


Template.shoppingTemplate.events({
  'click #sel1'(e,tmpl) {
    e.preventDefault();

    var selectedOpt = $('#sel1 option:selected').val();
    var sortBy = ''
    if (selectedOpt !== "Please Select"){
        if (selectedOpt === "priceAsc") {sortBy = {'price':1};}
        else if (selectedOpt === "priceDesc") {sortBy = {'price':-1};}
        else if (selectedOpt === "productAsc") {sortBy = {'product':1};}
        else if (selectedOpt === "productDesc") {sortBy = {'product':-1};}
        else sortBy = 'unrecognised'

        const currentFilters = tmpl.pagination.filters();
        console.log("selected option " + selectedOpt);
        Template.instance().pagination.filters(currentFilters);
        Template.instance().pagination.sort(sortBy);
    }
  },
  'click .sold-out-container' (e,tmpl){
    e.preventDefault();
  }
});