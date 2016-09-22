import './payment-template.html';
import '../components/progress-bar.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE} from '../../api/session-constants.js';
import {calculatePriceCall,createTransaction} from '../../api/method-calls.js';
import {Inventory} from '../../api/products.js';
import braintree from 'braintree-web'

Template.paymentTemplate.onCreated(function(){
 this.clientToken = amplify.store(BRAINTREE_CLIENT_TOKEN);
 Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
 this.autorun(() => {
      Meteor.subscribe('inventory');
      Session.set(TOTAL_PRICE_SESSION,calculatePriceCall());
      
   });
});

Template.paymentTemplate.onRendered(function(){
   Session.set("DocumentTitle","Payment");
   $("body").removeClass();
   $("body").addClass("body-shopping");
  });

Template.paymentTemplate.onRendered(function(){
  
  this.autorun(() => {
      var templateClientToken = Template.instance().clientToken;
      if((typeof templateClientToken !== "undefined") && templateClientToken !== null) {  
      braintree.setup(templateClientToken, "dropin", {
        container: "payment-form", 
        onPaymentMethodReceived: function (response) {
          var nonce = response.nonce;
          createTransaction(nonce);
        }
      });
    }
   });
});


Template.paymentTemplate.helpers({
  loading:function(){
    return Template.instance().loading.get();
  },

   total(){
   	return Session.get(TOTAL_PRICE_SESSION);
   },
});