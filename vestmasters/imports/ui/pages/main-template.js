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

     $("#mailing-list" ).validate({
       rules: {
         emailAddress: {
           email: true,
           required : true
         }
       },
       messages: {
         emailAddress: {
           email: "Please use a valid email address!",
           required: "An email address is required."
         }
       },


       errorPlacement: function( error, element ) {
         $( ".error-message" ).text( error[0].innerText );
       },


       success: function( error ) {
         $( ".error-message" ).text( error[0].innerText );
       },

       });
});

Template.mainTemplate.events({

 'click #top-button' (event) {
     scrollWin('#bottom-button', '#top-button' ,-120);
  },

  'click #bottom-button' (event) {
     scrollWin('#bottom-button', '#top-button' ,120)
   },

   'click .button-email-subs'(e,template){
     e.preventDefault();
     var email =  template.find("[id='emailSubscribe']").value;
//     var emailData = '{
//                                              "_id" : "EbFWt8i9GB8bpbcpC",
//                                               "items" : {
//                                                   "_id" : "xnndNrTRKbx4fTgGw",
//                                                   "itemsDetails" : [
//                                                       {
//                                                           "product" : "Varna Gessato Grigio",
//                                                           "file" : "Vest_Masters_Varna_Mod_Gessato_Grigio.jpg",
//                                                           "price" : NumberInt(199),
//                                                           "size" : "50",
//                                                           "oid" : "582779c48ea4c4fd1d906b38",
//                                                           "initials" : [
//                                                               "noInitials"
//                                                           ],
//                                                           "quantitynoInitials" : NumberInt(1)
//                                                       }
//                                                   ],
//                                                   "lastModified" : ISODate("2017-01-17T20:36:22.816+0000"),
//                                                   "lastCheckedByClient" : ISODate("2017-01-17T20:35:53.715+0000"),
//                                                   "status" : "pending",
//                                                   "secret" : "3O8OpiYiA4_GhhDGQtLMoYXd-C5se412nMxVLmmXydR"
//                                               },
//                                               "transactionId" : "3g6y3dz9",
//                                               "amount" : "199.00",
//                                               "currency" : "EUR",
//                                               "deliveryInfo" : {
//                                                   "first_name" : "a",
//                                                   "second_name" : "a",
//                                                   "email_addr" : "a@a.a",
//                                                   "phone_number" : "das",
//                                                   "country_delivery" : "Albania",
//                                                   "city" : "das",
//                                                   "zip" : "das",
//                                                   "address_line_1" : "das",
//                                                   "address_line_2" : "",
//                                                   "undefined" : ""
//                                               }
//                                           }';

       var parsedObj = JSON.parse(emailData)

//     Meteor.call("subscribeEmail",email, "Subscription");
//     Modal.show('subscribeInfo');
       Meteor.call("sendConfirmationEmail","mladenddinev@gmail.com", "Confirmation Email (Vest Masters)",emailData)

   }

});