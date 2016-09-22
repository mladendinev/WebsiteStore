import { Meteor } from 'meteor/meteor';
import '../imports/api/products.js';
import '../imports/api/server/publications.js'

var gateway;

Meteor.startup(() => {
  var env;
  // Pick Braintree environment based on environment defined in Meteor settings.
  if (Meteor.settings.public.env === 'Production') {
    env = Braintree.Environment.Production;
  } else {
    env = Braintree.Environment.Sandbox;
  }
  // Initialize Braintree connection:
  gateway = BrainTreeConnect({
    environment: env,
    publicKey: Meteor.settings.public.braintree.BT_PUBLIC_KEY,
    privateKey: Meteor.settings.private.braintree.BT_PRIVATE_KEY,
    merchantId: Meteor.settings.public.braintree.BT_MERCHANT_ID
  });
});


Meteor.methods({
   getClientToken: function () {
     var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
     var response = generateToken({});
     return response.clientToken;
   },
   createTransaction: function(nonceFromTheClient) {
    check(nonceFromTheClient,String);
    gateway.transaction.sale({
      amount: '10.00',
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      }
    }, function (err, success) {
      if (err) { 
        console.log(err);
      } else {
         console.log(success);
        
      }
    });
  }
});