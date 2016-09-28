import { Meteor } from 'meteor/meteor';
import {calculatePriceCallServer,removeFromInventory,updateInventory} from './lib/common.js'
import '../imports/api/products.js';
import {InventoryLock} from '../imports/api/products.js';
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

  sendConfirmationEmail: function(clientEmail,subjectEmail, emailData){
    check(clientEmail,String);
    check(subjectEmail,String);
    check(emailData,Object);
    SSR.compileTemplate('htmlEmail',Assets.getText('emailToClient.html'));

    Email.send({
      to: clientEmail,
      from: "clients@example.com",
      subject: subjectEmail,
      html: SSR.render('htmlEmail', emailData),
    });
  },

   getClientToken: function () {
     var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
     var response = generateToken({});
     return response.clientToken;
   },

   createTransaction: function(nonceFromTheClient,itemsInBasket,deliveryDetails) {
    var gatewayTransactionSync = Meteor.wrapAsync(gateway.transaction.sale,gateway.transaction); 
    
       check(nonceFromTheClient,String);
       check(itemsInBasket,[Match.Any]); //TODO Add proper check for the items, otherwise a security risk
       check(deliveryDetails,Object); //TODO Add proper check for the delivery, otherwise a security risk
     
       var itemsDict={};
      
       try {
       removeFromInventory(itemsInBasket,itemsDict);
       } catch(inventoryVaidationError){
        InventoryLock.update({"status" : "busy"},{$set :{"status":"available"}});
        throw inventoryVaidationError;
       }
     
       //TODO Add the delivery calculation inside the method
     try {
     var totalAmountToPay = calculatePriceCallServer(itemsInBasket,itemsDict);
     var result = gatewayTransactionSync({amount: totalAmountToPay,
                                         paymentMethodNonce: nonceFromTheClient,
                                         options: {
                                         submitForSettlement: true
                                         }
                                         });
     } catch(transactionError){
       updateInventory(itemsDict,itemsInBasket,1);
       throw new Meteor.Error("TRANSACTION_FAULURE","Problem with transaction");
     }
     

       var orderId = Orders.insert({"items" : itemsInBasket,
                                    "transactionId" : result.transaction.id,
                                    "amount" : result.transaction.amount,
                                    "currency" : result.transaction.currencyIsoCode,
                                    "deliveryInfo":deliveryDetails});


       encrypted = CryptoJS.AES.encrypt(orderId, Meteor.settings.private.crypto.aesKey);
       return encrypted.toString();
    
  },
 });




//  var emailData= {
//    order_id: "-",
//    products: "-",
//  };

