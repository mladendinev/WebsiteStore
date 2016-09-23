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
     return Session.get(ORDER_INFO);
   	},
});