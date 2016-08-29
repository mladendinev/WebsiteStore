import './payment_page.html'
//
//Template.paymentTemplate.onRendered(function(){
//  console.log("Script loaded but not necessarily executed.");
//  $('#payment-form').validate({
//    rules: {
//      card_holder_name: {
//        required: true
//      },
//      card_number: {
//        required: true,
//      },
//      expiry_month: {
//        required: true,
//      },
//      exp_year:{
//      required:true}
//    },
//    messages: {
//      card_holder_name: {
//        required: "Please enter your name."
//      },
//      card_number: {
//        required: "Please enter a card number"
//      },
//      expiry_month: {
//        required: "Please enter an expiry month",
//      },
//      exp_year: {
//         required: "Please enter an expiry year",
//      }
//    }
//  });
//});

Template.paymentTemplate.onRendered(function(){
  var $form = $('#payment-form');
  $form.submit(function(event) {
    // Disable the submit button to prevent repeated clicks:
    $form.find('.submit').prop('disabled', true);
    console.log('dasdad');
//    // Request a token from Stripe:
//    Stripe.card.createToken($form, stripeResponseHandler);
//    // Prevent the form from being submitted:
//    return false;
  });
});
