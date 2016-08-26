$.getScript("https://js.stripe.com/v2/", function(){

   console.log("Script loaded but not necessarily executed.");

});


Stripe.setPublishableKey('pk_test_10mTaueKFQ7Vuu0qxUt6b4wA');


$(function() {
  var $form = $('#payment-form');
  $form.submit(function(event) {
    // Disable the submit button to prevent repeated clicks:
    $form.find('.submit').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
  });
});
