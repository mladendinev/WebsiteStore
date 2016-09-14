import './payment-template.html'
import '../pages/progress-bar.js';
import {calculatePriceCall} from '../../api/method-calls.js';


Template.paymentTemplate.onRendered(function(){
   Session.set("DocumentTitle","Payment");
   $("body").removeClass();
   $("body").addClass("body-shopping");
  });



Template.paymentTemplate.onRendered(function(){

  $('#payment-form').validate({
    rules: {
      card_holder_name: {
        required: true
      },
      card_number: {
        required: true
      },
      expiry_month: {
        required: true
      },
      exp_year:{
        required:true
      },
      cvv:{
          required:true
      }
    },
    messages: {
      card_holder_name: {
        required: "Please enter your name."
      },
      card_number: {
        required: "Please enter a card number"
      },
      expiry_month: {
        required: "Please enter an expiry month",
      },
      exp_year: {
         required: "Please enter an expiry year",
      },
      cvv: {
         required: "Please enter a cvv number",
      },
    },
  });
});


Template.paymentTemplate.events({
  'submit form': (event,template) => {
    event.preventDefault();
    var $form = $('#payment-form');
    // loading state
    template.loading.set(true);

    //disable submit button
    $form.find('.submit').prop('disabled', true);


    Stripe.card.createToken($form, function(status, response) {

      // Error in creating token
      if(response.error){
          template.loading.set(false);
          var error_field = $("[data-stripe=" +response.error.param+"]");
          $("<label class=\"error\">" + response.error.message +"</label>").insertAfter(error_field);
          console.log(response.error.message);


          $form.find('.submit').prop('disabled', false); // Re-enable submission
          return;
      }
      else{
          var token = response.id;
          console.log(response);
          $form.append($('<input type="hidden" name="stripeToken">').val(token));
//          $form.get(0).submit();
          Meteor.apply("chargeCard",[token],{noRetry:true},function(error,response){
             if(error){
                $form.find('.payment-errors').text(error.message);
             }
             else{
                alert("You have been charged");
             }
        });
      }
    });

    //prevent the form from being submitted to the server
  }
});

Template.paymentTemplate.created=function(){
  // attach a reactive var to the template instance
  // you need to meteor add reactive-var first !
  this.loading=new ReactiveVar(false);
};


Template.paymentTemplate.helpers({
  loading:function(){
    // return the value of the reactive var attached to this template instance
    return Template.instance().loading.get();
  },

   total(){
   	return Session.get("totalPrice");
   },
});


Template.paymentTemplate.onCreated(function(){
 Session.set("itemsInBasketSession",amplify.store("itemsInBasket"));
 calculatePriceCall();
});



