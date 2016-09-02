import './carousel-template.js'
import './shopping-template.html';


import {Shopping}  from '../../api/products.js';


Template.shoppingTemplate.helpers({
    shopping(){
    return Shopping.find({});
  }
});

