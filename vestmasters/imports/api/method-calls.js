import {Inventory} from './products.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION,ORDER_ID,ORDER_INFO,BASKET_ERROR,PAYMENT_ERROR} from './session-constants.js';
import { FlowRouter } from 'meteor/kadira:flow-router';


export function calculatePriceCall(){
    var total=0;
    var queryArray = [];
    var quantityDict = {};
         Session.get(ITEMS_IN_BASKET_SESSION).forEach(function(basketItem,index){
           if(typeof quantityDict[basketItem.oid] === "undefined") {
            quantityDict[basketItem.oid] = 1;
           } else {
            quantityDict[basketItem.oid] = quantityDict[basketItem.oid] + 1;
           } 
            queryArray.push({"_id": new Meteor.Collection.ObjectID(basketItem.oid)});
           });
              if(queryArray.length>0) {
               Inventory.find({$or: queryArray}).forEach(function(mongoBasketItem,index){
                total = total + parseInt(mongoBasketItem.price)*quantityDict[mongoBasketItem._id.valueOf()];
              
               });
             }
        return total;
};


export function totalPlusDelivery(total_price, delivery_cost){
        return total_price + delivery_cost;
};

export function obtainBraintreeId(){
   Meteor.call('getClientToken', function(error, clientToken) {
    if (error) {
      console.log(error);
    } else { 
	   amplify.store(BRAINTREE_CLIENT_TOKEN,clientToken);
   };
  });
};

export function createTransaction(nonce){
  Session.set("time", new Date().getTime());
	Meteor.call('createTransaction',nonce,amplify.store(ITEMS_IN_BASKET_STORE), amplify.store("DELIVERY_INFO"), function(error, success) {
               if(error){
               switch(error.error) {
                 case "INVENTORY_NOT_SUFFICIENT": 
                  var message = "You have requested:" + error.details.requestedNumber + " items of:" + error.details.product + " but we " +
                  "only have:" +  error.details.availableNumber; 
                  Session.set(BASKET_ERROR,message)
                  FlowRouter.go('/basket')
                  break;
                 case "INVALID_SIZE_SELECTED_BY_USER":
                  var message = "You have requested a size:"  + error.details.requestedSize + " for product " + error.details.product + " but we" +
                  " do not have such size in stock";
                  Session.set(BASKET_ERROR,message);
                  FlowRouter.go('/basket')
                  break;
                 case "BASKET_NOT_VALID":
                  console.log(error.error);
                  var message = "You have requested an item which is not currently supplied.";
                  Session.set(BASKET_ERROR,message);
                  FlowRouter.go('/basket');
                  break;
                 default:
                  Session.set(PAYMENT_ERROR, "There was a problem with your transaction. Please try again.")
                  console.log(error.error);
                  }
                } else {
                  var delivery_info = amplify.store("DELIVERY_INFO");
                  emailData = {'order_id': success, 'products': amplify.store(ITEMS_IN_BASKET_STORE)};
                  amplify.store(ORDER_ID,success);

//                  Meteor.call("sendConfirmationEmail",delivery_info.email_addr, "confirmationEmail",emailData)

                 //TODO replace the email with a real one
                 FlowRouter.go('/confirmation');
                }
           });
};


export function getOrder(){
  Meteor.call('gerOrder', amplify.store(ORDER_ID), function(error,order){
     if(error){
       console.log("Error in retrieving order")
     }else{
       amplify.store(BRAINTREE_CLIENT_TOKEN,null);
       amplify.store(ITEMS_IN_BASKET_STORE,[]);
       Session.set(NUMBER_ITEMS_SESSION,amplify.store(ITEMS_IN_BASKET_STORE).length);
       Session.set(ORDER_INFO,order);
     }
    });
};

export function invalidMessageTrigger(array){
   array.forEach(function(currentValue){
      if (currentValue === 'number') {
            $('#card-number').next('span').text('Invalid Card');
      }

      else if(currentValue === "expirationYear"){
            $('#expiration-year').next('span').text('Invalid Year');
      }
      else if(currentValue === "expirationMonth"){
            $('#expiration-month').next('span').text('Invalid Month');
       }
      else {
            $('#cvv').next('span').text('Invalid security code');
      }
   })
};


export function emptyMessageTrigger(){

            $('#card-number').next('span').text('This field is required');

            $('#expiration-year').next('span').text('This field is required');

            $('#expiration-month').next('span').text('This field is required');

            $('#cvv').next('span').text('This field is required');

};