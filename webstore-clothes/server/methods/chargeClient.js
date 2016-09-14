if (Meteor.isServer){
   var stripe = require("stripe")(Meteor.settings.private.stripe.testSecretKey);

   Meteor.methods({
      "chargeCard": function(charge, fn){
         stripe.charges.create({
           amount: charge.amount, // Amount in cents
           currency: charge.currency,
           source: charge.source,
           description: charge.description
       },function(err,response){
            if(err){
              console.log(err.message);
              throw new Meteor.Error(500,"Stripe error", err.message);
            }
            else{
              return response;
            }
         })
       },

       "chargeCardSynchronous": function(charge){
           check(charge, {
                 amount: Number,
                 currency: String,
                 source: String,
                 description: String,
           });

           let handleCharge = Meteor.wrapAsync(stripe.charges.create,stripe.charges),
               payment= handleCharge(charge);
           console.log(payment);
           return payment;
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