import './dropdown-products.html'
import '../../api/products.js'

import {Products}  from '../../api/products.js';

Template.dropdownProducts.onCreated(function(){

  this.autorun(() => {
    Meteor.subscribe('products');
  });

});

Template.dropdownProducts.helpers({
 products() {
        return Products.find({},{sort:{'productName': -1}});
    },
});