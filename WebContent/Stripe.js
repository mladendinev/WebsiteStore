<script type="text/javascript" src="https://js.stripe.com/v2/"></script>

<script type="text/javascript">
  Stripe.setPublishableKey('pk_test_10mTaueKFQ7Vuu0qxUt6b4wA');
</script>

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