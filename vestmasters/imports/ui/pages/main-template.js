import '../components/carousel-template.js';
import '../components/navbar-main.js';

import './main-template.html';
import {scrollWin} from '../../api/scroll-function.js';
import {Products}  from '../../api/products.js';

Template.mainTemplate.onCreated(function(){

  this.autorun(() => {
    Meteor.subscribe("products");
  });
});

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

Template.mainTemplate.events({

 'click #top-button' (event) {

     scrollWin('#bottom-button', '#top-button' ,-120);
     amplify.store('top_button_clicked', 'yess', {expires: 60000});
     
  },

  'click #bottom-button' (event) {

     scrollWin('#bottom-button', '#top-button' ,120)
     console.log(amplify.store('top_button_clicked'));
   },
});