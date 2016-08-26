import {Template} from 'meteor/templating';

import './shopping_page.html';

import {Products}  from '../../api/products.js';

Template.shopTemplate.helpers({
 products(){
  return Products.find({});
 },
});
