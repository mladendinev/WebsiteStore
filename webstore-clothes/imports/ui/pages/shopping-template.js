import './carousel-template.js'
import './shopping-template.html';


import {Inventory}  from '../../api/products.js';


Template.shoppingTemplate.created = function () {
	this.pagination = new Meteor.Pagination(Inventory, {perPage:6
    });
}

Template.shoppingTemplate.helpers({
    shopping(){
      var products = {
        'shirts':Inventory.find({'type':'shirts'}),
        'size':Inventory.find({'type':'shirts'}).count()
      }
      return products;
    },

    templatePagination: function () {
          return Template.instance().pagination;
    },
  	documents: function () {
  		return Template.instance().pagination.getPage();
  	},


  	// optional helper used to return a callback that should be executed before changing the page
    clickEvent: function() {
        return function(e, templateInstance, clickedPage) {
            e.preventDefault();
            console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
        };
    }
});

Template.shoppingTemplate.onRendered(function(){
   Session.set("DocumentTitle","Shopping Page");
    $("body").addClass("body-shopping");
});




