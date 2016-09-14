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

    card_number = $("[data-stripe=number]").val();


//   TODO: individual validity checking
//    if(Stripe.card.validateCardNumber(card_number) === false){
//
//    }



    Stripe.card.createToken($form, function(status, response) {

      // Error in creating token
      if(response.error){
          template.loading.set(false);
          console.log(response.error.param);
          var error_field = $("[data-stripe=" +response.error.param+"]");
          $("<label class=\"error\">" + response.error.message +"</label>").insertAfter(error_field);
          console.log(response.error.message);
          $form.find('.submit').prop('disabled', false); // Re-enable submission
          return;
      }
      else{
          var token = response.id;
          $form.append($('<input type="hidden" name="stripeToken">').val(token));

          let charge = {
                         amount:10000,
                         source: response.id,
                         currency: 'eur',
                         description: "test transaction"
                        }


//          $form.get(0).submit();
          Meteor.call("chargeCardSynchronous",charge,function(error,result){
             if(error){
                console.log('error');
                $form.find('.payment-errors').text("<label class=\"error\">" + error.message +"</label>");
             }
             else{
                Session.set("orderInfo",result.amount);
                FlowRouter.go('successfulTrans');
                //Call the email service
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



