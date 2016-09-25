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
   
        var form = document.querySelector('#credit-card-payment-form');
        var submit = document.querySelector('#credit-card-submit');
        var paypalButton = document.querySelector('.paypal-button');
        console.log(paypalButton);

        braintree.client.create({
          authorization: templateClientToken
        }, function (clientErr, clientInstance) {
          if (clientErr) {
            console.error(clientErr);
            return;
          }

          braintree.hostedFields.create({
            client: clientInstance,
            styles: {
              'input': {
                'font-size': '14px'
              },
              'input.invalid': {
                'color': 'red'
              },
              'input.valid': {
                'color': 'green'
              }
            },
            fields: {
              number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123'
              },
              expirationDate: {
                selector: '#expiration-date',
                placeholder: '10 / 2019'
              }
            }
          }, function (hostedFieldsErr, hostedFieldsInstance) {
            if (hostedFieldsErr) {
              console.error(hostedFieldsErr);
              return;
            }

            submit.removeAttribute('disabled');

            form.addEventListener('submit', function (event) {
              event.preventDefault();

              hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                if (tokenizeErr) {
                  console.error(tokenizeErr);
                  return;
                }
                 var nonce = payload.nonce;
                 createTransaction(nonce);
              });
            }, false);
          });
        
           braintree.paypal.create({
      client: clientInstance
    }, function (paypalErr, paypalInstance) {

      // Stop if there was a problem creating PayPal.
      // This could happen if there was a network error or if it's incorrectly
      // configured.
      if (paypalErr) {
        console.error('Error creating PayPal:', paypalErr);
        return;
      }

      // Enable the button.
      paypalButton.removeAttribute('disabled');

      // When the button is clicked, attempt to tokenize.
      paypalButton.addEventListener('click', function (event) {

        // Because tokenization opens a popup, this has to be called as a result of
        // customer action, like clicking a button—you cannot call this at any time.
        paypalInstance.tokenize({
          flow: 'vault'
        }, function (tokenizeErr, payload) {

          // Stop if there was an error.
          if (tokenizeErr) {
            if (tokenizeErr.type !== 'CUSTOMER') {
              console.error('Error tokenizing:', tokenizeErr);
            }
            return;
          }

          // Tokenization succeeded!
          paypalButton.setAttribute('disabled', true);
          var nonce = payload.nonce;
          createTransaction(nonce);
         });

      }, false);

    });
     
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

Template.paymentTemplate.events({
  "change input[name='payment-method']" (event) {
   $("input[name='payment-method']").each(function(){
      if(this.checked) {
        $("#" + this.id +"-container").attr("style", "");  
      } else {
        $("#" + this.id +"-container").attr("style", "display:none");  
      }
   });
  },
})