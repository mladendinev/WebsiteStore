import './successful-transaction.html'

Template.successPayment.helpers({
 order(){
	 	var orderInfo = Session.get("orderInfo");
	 	console.log(orderInfo);
	 	return orderInfo;
	    },
});