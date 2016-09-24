import {Inventory} from './products.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION,ORDER_ID,ORDER_INFO} from './session-constants.js';
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
	Meteor.call('createTransaction',nonce,amplify.store(ITEMS_IN_BASKET_STORE), function(error, success) {
                if (error) {
                  throw new Meteor.Error('transaction-creation-failed');
                } else {
                  amplify.store(ORDER_ID,success);
                  FlowRouter.go('/confirmation');
                }
           });
};

export function getSingleItem(id){
  Meteor.call('getSingleItem',id,function(error,item){
   
    if(error){
      console.log("Error in retrieving item from mongo");
    } else {
      var currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
      var itemToAdd = {
          "product" : item.product,
          "file" : item.file,
          "size": $("#sel-size").val(),  
          "oid" : item._id.valueOf(),
          "initials" : $("#initials").val(),
          "price" : item.price, 
          "qantity" : 1
           };
      if (typeof currentValue !== "undefined" && currentValue !== null) {
          currentValue.push(itemToAdd);
          amplify.store(ITEMS_IN_BASKET_STORE,currentValue);
      } else {
          amplify.store(ITEMS_IN_BASKET_STORE,[itemToAdd]);
      }
      Session.set(NUMBER_ITEMS_SESSION,amplify.store(ITEMS_IN_BASKET_STORE).length);
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