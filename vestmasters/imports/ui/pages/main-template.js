import '../components/carousel-template.js';
import '../components/navbar-main.js';

import './main-template.html';
import {scrollWin} from '../../api/scroll-function.js';
import {Products}  from '../../api/products.js';

Template.mainTemplate.onCreated(function(){

  this.autorun(() => {
    Meteor.subscribe("products");
    Meteor.subscribe("carousel");
  });
});

Template.mainTemplate.helpers({
 products(){
  return Products.find({display: {$ne: -1}},{sort : {display: 1}});
 },
 isScrollable(count){
   return count>3;
 },

 getClass(index,length){
  var baseClass ="col-md-12 col-sm-4 shop-black-background"
  if(index === 0){
    return baseClass + " shop-content-thirds-height-margin shop-content-padding-right-top"
  } else if(index === length-1) {
    return baseClass + " shop-content-thirds-height shop-content-padding-right-bot"
  } else {
    return baseClass + " shop-content-thirds-height-margin shop-content-padding-right-mid"
  }
 }
});

Template.mainTemplate.onRendered(function(){
   Session.set("DocumentTitle","Shop Online");
   $("body").removeClass();

});

Template.mainTemplate.events({

 'click #top-button' (event) {
     scrollWin('#bottom-button', '#top-button' ,-120);
  },

  'click #bottom-button' (event) {
     scrollWin('#bottom-button', '#top-button' ,120)
   },
});