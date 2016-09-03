import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../components/shopping-template.js';
import './shopping-template-show.html';


import {Shopping}  from '../../api/products.js';
import {Products}  from '../../api/products.js';

Template.shoppingTemplateShow.helpers({
    shoppingArgs(){
    var productName = FlowRouter.getQueryParam('product');
    console.log("the query param:" + productName);
    return {
            shopping() {
              return Shopping.find({"type" : productName});
            },
            products(){
               return Products.find({});
            }   
           };
    },
});
