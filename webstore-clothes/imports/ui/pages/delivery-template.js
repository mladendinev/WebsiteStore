import './delivery-template.html';


Template.deliveryTemplate.onRendered(function(){
 Session.set("DocumentTitle","Delivery Details");
  $('#user-info').validate({
    rules: {
      first_name: {
        required: true
      },
      second_name: {
        required: true
      },
      email_addr: {
        required: true
      },
      phone_number:{
        required:true
      },
      address_line_1:{
          required:true
      }
    },
    messages: {
      first_name: {
        required: "Please type your first name."
      },
      second_name: {
        required: "Please type your second name."
      },
      email_addr: {
        required: "Please type your email address.",
      },
      phone_number: {
         required: "Please type your personal phone number.",
      },
      address_line_1: {
         required: "Please type your delivery address.",
      },
    },
  });
});


 Template.deliveryTemplate.events({
    'submit form'(event){
        event.preventDefault();
        FlowRouter.go('Payment');
//        var $form = $('##user-info');
//
//        $form.find('.submit').prop('disabled', true);
//
//
//
    }
 });