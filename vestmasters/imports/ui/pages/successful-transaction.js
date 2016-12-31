import './successful-transaction.html';
import {ORDER_INFO} from '../../api/session-constants.js';
import {getOrder} from '../../api/method-calls.js';

Template.successPayment.onRendered(function(){
   Session.set("DocumentTitle","Order Completed");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});


Template.successPayment.onCreated(function(){
	getOrder();
});

Template.successPayment.helpers({
   orderInfo(){
   	 if((typeof Session.get(ORDER_INFO) !== "undefined") && Session.get(ORDER_INFO) !== null) { 
     return Session.get(ORDER_INFO).transactionId;
     }
   	},

    amount(){
     if((typeof Session.get(ORDER_INFO) !== "undefined") && Session.get(ORDER_INFO) !== null) { 
     return parseInt(Session.get(ORDER_INFO).amount);
     }
    },

  getItemDetails(){
   if((typeof Session.get(ORDER_INFO) !== "undefined") && Session.get(ORDER_INFO) !== null) { 
     var basket = Session.get(ORDER_INFO).items;
    return basket.itemsDetails;
  } else {
    return [];
  } 
  }, 

  getInitial(item){
    return item.initials;
  },

  repeatedInitial(item, initial){
    var quantityCounter = item["quantity" + initial];
    var result = new Array(quantityCounter);
    for (var i =0; i<result.length; i++){
      result[i]=i;
    }
    return result;
  },

  hasInitial(initial){
    return initial !== "noInitials";
  },

  hasSize(size){
     return size !== "noSize";
  },
    
});