import {Inventory} from './products.js';
import {BASKET_ID,BRAINTREE_CLIENT_TOKEN,DELIVERY_COST,ORDER_ID,ORDER_INFO,BASKET_ERROR,PAYMENT_ERROR,BASKET_ID_SESSION} from './session-constants.js';
import { FlowRouter } from 'meteor/kadira:flow-router';


export function updateBasket(item) {
  Session.set("time", new Date().getTime());
  if ((typeof amplify.store(BASKET_ID) !== "string") || amplify.store(BASKET_ID) === null) {
     amplify.store(BASKET_ID,"");
  }

  Meteor.call('updateBasket', item, amplify.store(BASKET_ID), function(error,response){
    if(error) {
      switch(error.error) {
        case "UNEXISTING_BASKET" : 
          amplify.store(BASKET_ID,error.details.userInfo.id);
          Session.set(BASKET_ID_SESSION,amplify.store(BASKET_ID));
          Meteor.loginWithPassword(error.details.userInfo.id, error.details.userInfo.password);
          console.log(Meteor.userId());
          break;
        case "INADEQUATE_INVENTORY" :
        console.log(error);
         //TODO handle error  
         break;
        case "INACTIVE CART" :
        console.log(error); 
        //TODO handle error
        break;
        default:
          console.log(error);
          break;
      }
     };
    console.log((new Date() - Session.get("time"))/1000)
 });

}

export function removeItem(basketId,itemId,size,initials){
  Meteor.call("removeItem",basketId,itemId,size,initials,function(error,response){
     if(error){
      console.log(error);
     }else {
      return response;
     }

  })
}

export function calculatePriceCall(basket){
    var total=0;
     basket.itemsDetails.forEach(function(item){
      item.initials.forEach(function(initial){
         var quantityCounter = item["quantity" + initial];
        while(quantityCounter>0){
              total = total+ parseInt(item.price);
              quantityCounter = quantityCounter-1;
              }
         });  
     });
    return total;
};


export function totalPlusDelivery(basket,deliveryCost){
         var totalPrice = calculatePriceCall(basket);
         return totalPrice + deliveryCost;
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
  Meteor.call('createTransaction',nonce,amplify.store(BASKET_ID), amplify.store("DELIVERY_INFO"), function(error, success) {
               if(error){
                var messages = [];
               switch(error.error) {
                  case "INACTIVE CART":
                  Session.set(PAYMENT_ERROR,"Your basket is inactive. This can happen if you have been inactive for long time.");
                  break;
                  case "BASKET_EMPTY":
                  Session.set(PAYMENT_ERROR,"You can't checkout with an empty basket. Please add items before attempting a payment");
                  break;
                 default:
                  Session.set(PAYMENT_ERROR, "There was a problem with your transaction. Please try again.")
                  console.log(error.error);
                  }
                } else {
                  var delivery_info = amplify.store("DELIVERY_INFO");
                  //emailData = {'order_id': success, 'products': amplify.store(ITEMS_IN_BASKET_STORE)};
                  amplify.store(ORDER_ID,success);
                  Meteor.logout();
//                Meteor.call("sendConfirmationEmail",delivery_info.email_addr, "confirmationEmail",emailData)
                  console.log("Errorless Transaction");
                  //TODO replace the email with a real one
                  amplify.store(BRAINTREE_CLIENT_TOKEN,null);
                  Session.set(PAYMENT_ERROR,null);
                  FlowRouter.go('/confirmation');
                }
           });
};


export function getOrder(){
  Meteor.call('gerOrder', amplify.store(ORDER_ID), function(error,order){
     if(error){
       console.log("Error in retrieving order")
     }else{
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