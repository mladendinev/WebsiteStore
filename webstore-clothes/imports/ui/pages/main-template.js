import './carousel-template.js'
import './main-template.html'

import {Products}  from '../../api/products.js';

Template.mainTemplate.helpers({
 products(){
  return Products.find({});
 },
 isScrollable(count){
   return count>3;
 }, 
});

Template.mainTemplate.onRendered(function(){
   Session.set("DocumentTitle","Shop Online");
});