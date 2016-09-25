import './payment-template.html';
import '../components/progress-bar.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE} from '../../api/session-constants.js';
import {calculatePriceCall,createTransaction,cardPaymentCallBack} from '../../api/method-calls.js';
import {Inventory} from '../../api/products.js';
import braintree from 'braintree-web'

Template.paymentTemplate.onCreated(function(){
 this.loading=new ReactiveVar(false);
 this.setup= new ReactiveVar(null);
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
    
    this.autorun(() => {
        if((typeof this.clientToken !== "undefined") && this.clientToken !== null) {
   
        var form = document.querySelector('#credit-card-payment-form');
        var submit = document.querySelector('#credit-card-submit');
        var paypalButton = document.querySelector('.paypal-button');
        console.log(paypalButton);

        braintree.client.create({
          authorization: this.clientToken
        }, function (clientErr, clientInstance) {
          if (clientErr) {
            console.error(clientErr);
            return;
          }

          braintree.hostedFields.create({
            client: clientInstance,
            fields: {
              number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123'
              },
              expirationMonth: {
               selector: '#expiration-month',
               placeholder: 'MM'
              },
              expirationYear: {
               selector: '#expiration-year',
               placeholder: 'YY'
              },
            }
          },function (hostedFieldsErr, hostedFieldsInstance) {
             if (hostedFieldsErr) {
                    console.error(hostedFieldsErr);
                    return;
                 }

            hostedFieldsInstance.on('validityChange', function (event) {
              var field = event.fields[event.emittedBy];
              console.log(event.emmitedBy);
              if (field.isValid) {
                if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
                  if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
                    return;
                  }
                } else if (event.emittedBy === 'number') {
                  $('#card-number').next('span').text('');
                }

                // Apply styling for a valid field
//                $(field.container).parents('.form-group').addClass('has-success');
              } else if (field.isPotentiallyValid) {
                // Remove styling  from potentially valid fields
                $(field.container).parents('.form-group').removeClass('has-warning');
                $(field.container).parents('.form-group').removeClass('has-success');
                if (event.emittedBy === 'number') {
                  $('#card-number').next('span').text('');
                }


              } else {
                // Add styling to invalid fields
                 console.log(field);
                // Add helper text for an invalid card number
                console.log(typeof event.emmitedBy);
                if (event.emittedBy === 'number') {
                  console.log(event);
                  $('#card-number').next('span').text('Please provide valid card');
                }

                else if(event.emmitedBy === "expirationYear"){
                  $('#card-number').next('span').text('asdasda');
                }

                else{
                  console.log(event);
                  $(field.container).next('span').text('Invalid');
                }
              }
            });
          }




          );
        
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


  "submit form"(event,template){
     event.preventDefault();

      template.loading.set(true);
      var $form = $('#credit-card-payment-form');

      $form.find('.submit').prop('disabled', true);



      hostedFieldsInstance.tokenize(function(err, response){
       if (err){
         console.error(err);
         template.loading.set(false);
         $form.find('.submit').prop('disabled', false);
          return;
       }

       else{

       }

    //create transaction
   })
  }
})