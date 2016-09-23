import './successful-transaction.html'

Template.successPayment.onRendered(function(){
   Session.set("DocumentTitle","Order Completed");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});


Template.successPayment.onCreated(function(){
	this.autorun(() => {
		Meteor.subscribe('orders',FlowRouter.getQueryParam('order'));
	});
});

Template.successPayment.helpers({
 order(){
	 	var orderInfo = Session.get("orderInfo");
	 	console.log(orderInfo);
	 	return orderInfo;
	    },
});