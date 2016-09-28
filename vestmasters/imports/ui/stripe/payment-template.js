import './payment-template.html';
import '../components/progress-bar.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,PAYMENT_ERROR} from '../../api/session-constants.js';
import {calculatePriceCall,createTransaction,cardPaymentCallBack,invalidMessageTrigger,emptyMessageTrigger} from '../../api/method-calls.js';
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
   var deliveryDetails = amplify.store('DELIVERY_INFO');
   console.log(deliveryDetails);
   $("body").removeClass();
   $("body").addClass("body-shopping");
   $("#credit-card-number").prop('required',true);
   $("#payment-form" ).validate();

        if((typeof this.clientToken !== "undefined") && this.clientToken !== null) {

        var form = document.querySelector('#payment-form');
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
              //console.log(event.fields[event.emittedBy]);


              // VALID FIELDS
              if (field.isValid) {
                if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
                    $('#expiration-year').next('span').text('');
                    $('#expiration-month').next('span').text('');
                } else if (event.emittedBy === 'number') {
                  $('#card-number').next('span').text('');
                }
                 else if (event.emittedBy === 'cvv') {
                                  $('#cvv').next('span').text('');
                 }



//                $(field.container).parents('.form-group').addClass('has-success');

              // Potentially Valid
              } else if (field.isPotentiallyValid) {
                // Remove styling  from potentially valid fields
                $(field.container).parents('.form-group').removeClass('has-warning');
                $(field.container).parents('.form-group').removeClass('has-success');
                if (event.emittedBy === 'number' && event.fields.number.isEmpty ) {
                  $('#card-number').next('span').text('This field is required');
                }
              }



              // Add styling to invalid fields

              else {

                 console.log(field);
                // Add helper text for an invalid card number
                console.log(typeof event.emmitedBy);
                if (event.emittedBy === 'number') {
                  console.log(event);
                  $('#card-number').next('span').text('Please provide valid card');
                }
              }
            });


          hostedFieldsInstance.on('empty', function (event) {
            var field = event.fields[event.emittedBy];
            console.log("is empty")
            if (field.isEmpty) {
               $(field.container).next('span').text('This field is required');
            }
          }),


          submit.removeAttribute('disabled');

          form.addEventListener('submit', function (event,template) {
             event.preventDefault();
//             this.template.loading.set(true);



            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
               if (tokenizeErr) {
//                  Template.instance().loading.set(false);
                  // Handle error in Hosted Fields tokenization
                  switch (tokenizeErr.code) {
                        case 'HOSTED_FIELDS_FIELDS_EMPTY':
                          console.error('All fields are empty! Please fill out the form.');
                          emptyMessageTrigger();
//                          invalidMessageTrigger()
                          break;
                        case 'HOSTED_FIELDS_FIELDS_INVALID':
                          console.error('Some fields are invalid:', tokenizeErr.details.invalidFieldKeys);
                          var array = tokenizeErr.details.invalidFieldKeys
                          invalidMessageTrigger(array);
                          break;
                        case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
                          console.error('Tokenization failed server side. Is the card valid?');
                          break;
                        case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
                          console.error('Network error occurred when tokenizing.');
                          break;
                        default:
                          console.error('Something bad happened!', tokenizeErr);
                      }
                 return;
               }

               // Successful form, generate nonce and redirect to confirmation
               else{
                createTransaction(payload.nonce);
               }
            });
          },false);
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


Template.paymentTemplate.helpers({
  loading:function(){
    return Template.instance().loading.get();
  },

   total(){
   	return Session.get(TOTAL_PRICE_SESSION);
   },

   paymentErrorPresent(){
  return Session.get(PAYMENT_ERROR) !== null && (typeof Session.get(PAYMENT_ERROR) !== "undefined");
 },

 errorMessage(){
   return Session.get(PAYMENT_ERROR);
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