import './main-template.html'

import {Products}  from '../../api/products.js';

Template.mainTemplate.helpers({
 products(){
  return Products.find({});
 },
});
