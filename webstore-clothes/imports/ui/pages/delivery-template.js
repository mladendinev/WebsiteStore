import './delivery-template.html';

Template.deliveryTemplate.onRendered(function(){
   Session.set("DocumentTitle","Delivery Details");
});

 Template.deliveryTemplate.events({
    'click .continue-delivery'(event){
            FlowRouter.go('Payment');
    }
 });