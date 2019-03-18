var stripe = Stripe('sk_test_An1dJQsDXZBuVvXGyzBFdiqQ');

var $form = $('#checkout-form');

$form.submit(function(event){
    $form.find('button').prop('disabled', true); // to desable button submit when validation is going on
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripeResponseHandler);  
    return false;
});

function stripeResponseHandler(status, response){
    if (response.error) { // Problem!

        // Show the errors on the form
        $form.find('#charge-error').text(response.error.message);
        $form.find('button').prop('disabled', false); // Re-enable submission
    
      } else { // Token was created!
        // Get the token ID:
        var token = response.id;
        //var token = result.token.id
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

      }
}
