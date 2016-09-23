import { Meteor } from 'meteor/meteor';
import {calculatePriceCallServer} from './lib/common.js'
import '../imports/api/products.js';
import {Orders} from '../imports/api/products.js';
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
   createTransaction: function(nonceFromTheClient,itemsInBasket) {
    check(nonceFromTheClient,String);
    check(itemsInBasket,[Match.Any]); //TODO Add proper check for the items, otherwise a security risk
    var totalAmountToPay = calculatePriceCallServer(itemsInBasket); //TODO Add the delivery calculation inside the method
    var gatewayTransactionSync = Meteor.wrapAsync(gateway.transaction.sale,gateway.transaction); 
    try {
    var result = gatewayTransactionSync({amount: totalAmountToPay,
                                         paymentMethodNonce: nonceFromTheClient,
                                         options: {
                                           submitForSettlement: true
                                         }
                                         }); 
    var orderId = Orders.insert({"items" : itemsInBasket, "transactionId" : result.transaction.id, "amount" : result.transaction.amount, "currency" : result.transaction.currencyIsoCode});
    encrypted = CryptoJS.AES.encrypt(orderId, Meteor.settings.private.crypto.aesKey);
    return encrypted.toString();
    } catch(error){
      console.log(error);
    };
  }
});