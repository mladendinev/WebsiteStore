if (Meteor.isServer){
   var stripe = require("stripe")(Meteor.settings.private.stripe.testSecretKey);

   Meteor.methods({
      "chargeCard": function(cardToken){
       stripe.charges.create({
       amount: 1000, // Amount in cents
           currency: "eur",
           source: cardToken,
           description: "Example charge"
       }, function(err,response){
            if(err){
              console.log(err.message);
              throw new Meteor.Error(500,"Stripe error", err.message);
            }
            else{
              return response;
            }
         })
       }
   })
}
//   var token = request.body.stripeToken;
//   var charge = stripe.charges.create({
//     amount: 1000, // Amount in cents
//     currency: "euro",
//     source: token,
//     description: "Example charge"
//   }, function(err, charge) {
//     if (err && err.type === 'StripeCardError') {
//       // The card has been declined
//     }
//   });
//
//
//}