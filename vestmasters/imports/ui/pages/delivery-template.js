import './delivery-template.html';
import {calculatePriceCall,obtainBraintreeId,totalPlusDelivery} from '../../api/method-calls.js';
import {Countries}  from '../../api/products.js';
import {Products}  from '../../api/products.js';
import {Inventory}  from '../../api/products.js';
import './summary-template.js';
import {TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,DELIVERY_COST} from '../../api/session-constants.js';


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
    Meteor.subscribe("deliveryPrices");
    Meteor.subscribe("products");
  });
});


 Template.deliveryTemplate.events({
    'submit form'(event){
        event.preventDefault();
        var map= {};
        $("#user-info :input").each(function(){
           map[$(this).attr("name")] = $(this).val();
        });
        amplify.store("DELIVERY_INFO",map);
        var delivery_info = amplify.store("DELIVERY_INFO");
        emailData = {'order_id': 13231231, 'products': amplify.store(ITEMS_IN_BASKET_STORE)};
        console.log(emailData);
        Meteor.call("sendConfirmationEmail",delivery_info.email_addr, "Confirmation Email (Vest Masters)",emailData)
        FlowRouter.go('Payment');
    },

    'click #countryDelivery'(e){
          e.preventDefault();
          var selectedOpt = $('#countryDelivery option:selected').val();
          if (selectedOpt !== "Country"){
             delivery_price= Countries.findOne({'country': selectedOpt});
             Session.set(DELIVERY_COST,delivery_price.price);
          }
    }
 });

 Template.deliveryTemplate.helpers({
    countries: function(){
         countries = Countries.find({},{sort:{'Country': 1}});
         return countries;
  },
});
