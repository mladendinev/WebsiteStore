import './routes.js';

if (Meteor.isClient){
  Meteor.startup(function() {
    var stripeKey = Meteor.settings.public.stripe.testPublishableKey;
    Stripe.setPublishableKey( stripeKey );

    Deps.autorun(function(){
      document.title = Session.get("DocumentTitle");
    });
  });
}