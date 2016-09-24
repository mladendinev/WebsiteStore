import './payment-template.html';
import '../components/progress-bar.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE} from '../../api/session-constants.js';
import {calculatePriceCall,createTransaction,configBrainTree} from '../../api/method-calls.js';
import {Inventory} from '../../api/products.js';
import braintree from 'braintree-web'

Template.paymentTemplate.onCreated(function(){
 this.clientToken = amplify.store(BRAINTREE_CLIENT_TOKEN);
 Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
 this.autorun(() => {
      Meteor.subscribe('inventory');
      Session.set(TOTAL_PRICE_SESSION,calculatePriceCall());
   });

  var templateClientToken = Template.instance().clientToken;
  parentInstance = this;
  parentInstance.currentIntegration = new ReactiveVar(null);
  parentInstance.setup = new ReactiveVar(null);

});

Template.paymentTemplate.onRendered(function(){
   Session.set("DocumentTitle","Payment");
   $("body").removeClass();
   $("body").addClass("body-shopping");

   function validCard() {
     return true;
    }
    var currentValue;

    braintree.setup(Template.instance().clientToken, "custom", {

             onError: function(error){
               log.console(error);
             },
             onReady: function(integration){
                console.log(integration);
                currentValue = integration;
             },
             onPaymentMethodReceived: function (response) {
                 if (response.type === 'PayPalAccount' )
                     //TODO:
             },
    });

   changeSetup = function (setup) {
     if (currentValue){
        console.log(setup);
        currentValue = null;
        braintree.setup(Template.instance().clientToken, "custom", setup);
     }
  }
});



Template.paymentTemplate.helpers({
//  loading:function(){
//    return Template.instance().loading.get();
//  },


   total(){
   	return Session.get(TOTAL_PRICE_SESSION);
   },

   brainTreeSetup(){
     return Template.instance.setup.get()
   }
});



Template.paymentTemplate.events({
  "change input[name='payment-method']" (event, template) {
     $("input[name='payment-method']").each(function(){
        if(this.checked) {
          $("#" + this.id +"-container").attr("style", "");
          var setup = configBrainTree(this.value);
          changeSetup(setup);
        }
        else {
          $("#" + this.id +"-container").attr("style", "display:none");
        }
     });
  },
});
