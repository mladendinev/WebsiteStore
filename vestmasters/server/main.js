import { Meteor } from 'meteor/meteor';
import {calculatePriceCallServer,removeFromInventory,updateInventory} from './lib/common.js'
import '../imports/api/products.js';
import {Orders} from '../imports/api/products.js';
import {Baskets} from '../imports/api/products.js';
import {Inventory} from '../imports/api/products.js';
import {Countries} from '../imports/api/products.js';
import './publications.js'

var gateway;

function sendConfirmationEmail(clientEmail,subjectEmail, emailData){
     check(clientEmail,String);
     check(subjectEmail,String);
     check(emailData,Object); //TODO IMPORTANT check argument for security reasons


//    var html=Blaze.toHTMLWithData(Template.shareEmailContent,emailData);
     SSR.compileTemplate('htmlEmail',Assets.getText('emailTemplate.html'));

     Email.send({
       to: clientEmail,
       from: "clients@vestmasters.com",
       subject: subjectEmail,
       html: SSR.render('htmlEmail', emailData),
//      html: html,
      });
}


Meteor.startup(() => {

  var env;
  // Pick Braintree environment based on environment defined in Meteor settings.
  if (Meteor.settings.public.braintree.env === 'Production') {
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
   subscribeEmail: function(subscriber,subjectEmail){
      check(subscriber,String);
      check(subjectEmail,String);

      Email.send({
         to:"clients@2ffashiongroup.com",
         from: subscriber,
         subject: subjectEmail,
         text: "User has subscribed"
      });
    },


   getClientToken: function () {
      var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
      var response = generateToken({});
      return response.clientToken;
   },

   createTransaction: function(nonceFromTheClient,basketId,deliveryDetails,secret) {
      var gatewayTransactionSync = Meteor.wrapAsync(gateway.transaction.sale,gateway.transaction);
      check(nonceFromTheClient,String);
      check(basketId,String); //TODO Add proper check for the items, otherwise a security risk
      check(secret,String);
      check(deliveryDetails,Object); //TODO Add proper check for the delivery, otherwise a security risk
       
      now = new Date();
      //Make sure the cart is still active and set to 'pending'. Also
      // fetch the cart details so we can calculate the checkout price
      var result = Baskets.update({'_id': basketId, 'secret' : secret,'status': 'active',},
      update={$set: { 'status': 'pending','lastModified': now } } )
      if (result ===0) {
         throw new Meteor.Error("INACTIVE CART", "Your cart has expired");
      }

      var basket = Baskets.findOne({"_id" : basketId,'secret' : secret});

      if(basket.length === 0){
         throw new Meteor.Error("BASKET_EMPTY", "Problem with transaction");
      }
       
      var itemsDict={};
      var queryArray = [];
      basket.itemsDetails.forEach(function(item){
       
         if((typeof itemsDict[item.oid+"quantity"] === "undefined") || itemsDict[item.oid+"quantity"] === null){
            itemsDict[item.oid+"quantity"] = 0;
         }
         queryArray.push({"_id": new Meteor.Collection.ObjectID(item.oid)});
         item.initials.forEach(function(initial){
           var quantityCounter = item["quantity" + initial];
           itemsDict[item.oid+"quantity"] =itemsDict[item.oid+"quantity"] + quantityCounter;
         })
       })
      items = Inventory.find({$or: queryArray}).fetch();
      var deliveryPrice = (Countries.findOne({'country': deliveryDetails.country_delivery})).price;
      var totalAmountToPay = calculatePriceCallServer(items,itemsDict) + deliveryPrice;
      try {
         var result = gatewayTransactionSync({amount: totalAmountToPay,
                                         paymentMethodNonce: nonceFromTheClient,
                                         options: {
                                         submitForSettlement: true
                                         }
                                         });
         if(!result.success){
             Baskets.update({'_id': basketId},update={$set: { 'status': 'active'}});
             throw new Meteor.Error("TRANSACTION_FAULURE","Problem with transaction");
         }
      }
      catch(transactionError){
          Baskets.update({'_id': basketId},update={$set: { 'status': 'active'}});
          throw new Meteor.Error("TRANSACTION_FAULURE","Problem with transaction");
      }
     
      Meteor.defer(function(){
         emailData = {'order_id': result.transactionId,
                     'products': basket,
                     "deliveryInfo":deliveryDetails,
                      "amount" : result.transaction.amount,
                      "currency" :result.transaction.currencyIsoCode};
         console.log(basket);
         console.log(deliveryDetails);
         sendConfirmationEmail(deliveryDetails.email_addr, "Confirmation Email (Vest Masters)",emailData);

          Baskets.remove({'_id': basketId });
          Inventory.update({'carted.cartId': basketId},
                                    {$pull: {'carted' :{'cartId': basketId}}},
                                    {multi: true});
       });
       var orderId = Orders.insert({"items" : basket,
                                    "transactionId" : result.transaction.id,
                                    "amount" : result.transaction.amount,
                                    "currency" : result.transaction.currencyIsoCode,
                                    "deliveryInfo":deliveryDetails});


       encrypted = CryptoJS.AES.encrypt(orderId, Meteor.settings.private.crypto.aesKey);
       return encrypted.toString();
    
  },
 });