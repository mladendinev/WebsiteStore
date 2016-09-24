import './delivery-template.html';
import {calculatePriceCall,obtainBraintreeId,totalPlusDelivery} from '../../api/method-calls.js';
import {Countries}  from '../../api/products.js';
import {Products}  from '../../api/products.js';
import {Inventory}  from '../../api/products.js';
import './summary-template.js';
import {TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,} from '../../api/session-constants.js';


Template.deliveryTemplate.onRendered(function(){
 Session.set("DocumentTitle","Delivery Details");
  $('#user-info').validate({
    rules: {
      first_name: {
        required: true
      },
      second_name: {
        required: true
      },
      email_addr: {
        required: true
      },
      phone_number:{
        required:true
      },
      address_line_1:{
          required:true
      }
    },
    messages: {
      first_name: {
        required: "Please type your first name."
      },
      second_name: {
        required: "Please type your second name."
      },
      email_addr: {
        required: "Please type your email address.",
      },
      phone_number: {
         required: "Please type your personal phone number.",
      },
      address_line_1: {
         required: "Please type your delivery address.",
      },
    },
  });
});

Template.deliveryTemplate.onCreated(function(){

  this.autorun(() => {
    Meteor.subscribe("countries");
    Meteor.subscribe("products");
  });
});


 Template.deliveryTemplate.events({
    'submit form'(event){
        event.preventDefault();
        FlowRouter.go('Payment');
    },

    'click #countryDelivery'(e){
          e.preventDefault();
          var selectedOpt = $('#countryDelivery option:selected').val();
          if (selectedOpt !== "Country"){
             console.log(selectedOpt);
             delivery_price2= Countries.findOne({'country': selectedOpt});
             console.log(delivery_price2.price);
             Session.set('DELIVERY_COST',delivery_price2.price);
          }
    }
 });

 Template.deliveryTemplate.helpers({
    countries: function(){
         countries = Countries.find({},{sort:{'country': 1}});
         console.log(countries);
         return countries;
  },
});
