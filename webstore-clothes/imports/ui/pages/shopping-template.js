import './carousel-template.js'
import './shopping-template.html';


import {Inventory}  from '../../api/products.js';



Template.shoppingTemplate.helpers({
    shopping(){
    return Inventory.find({'type':'shirts'});
  }
});

Template.shoppingTemplate.onRendered(function(){
   Session.set("DocumentTitle","Shopping Page");
    $("body").addClass("body-shopping");
});
