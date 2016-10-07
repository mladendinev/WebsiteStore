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
    
    displayBasket(){
    var result = "";
    var basket = Session.get(ORDER_INFO).items;
    if((typeof Session.get(ORDER_INFO) !== "undefined") && Session.get(ORDER_INFO) !== null) { 
    basket.itemsDetails.forEach(function(item){
    item.initials.forEach(function(initial){
      var quantityCounter = item["quantity" + initial];
      while(quantityCounter>0){
       result = result + "<tr>\n" +
                    "<td><img class='img-responsive img-circle img-basket' src='images/" + item.file +"' width='40px'/>\n" +
                    "<div class='table-div float-left'>" + item.product + "</div>\n" +
                    "</td>"
      if(item.size !== "noSize") {
      result = result +  "<td>\n" +
                     "<div class='table-div float-left'>" + item.size + "</div>\n" +
                     "</td>\n"
      } else {
       console.log(item.size !== "noSize");       
       result = result + "<td>\n" +
                 "<div class='table-div float-left'> n/a </div>\n" +
                 "</td>\n"
     }
    
     if (initial !== "noInitials") {
        result = result + "<td>\n" +
                 "<div class='table-div float-left'>" + initial + "</div>\n" +
                "</td>\n"
     } else {
        result = result + "<td>\n" +
                          "<div class='table-div float-left'> n/a </div>" +
                          "</td>\n"
     }
        result = result + "<td>\n" +
                    "<div class='table-div float-left'>" + item.price + "</div>\n" +
                    "</div>\n" +
                "</td>\n" +
                "</tr>\n"
      quantityCounter = quantityCounter-1;
      }
     });
    });
   }
  return result;
  }

});