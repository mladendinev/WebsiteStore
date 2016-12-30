import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/landing-template.js';
import '../../ui/pages/main-template.js';
import '../../ui/pages/contacts-template.js';
import '../../ui/pages/shopping-template.js';
import '../../ui/pages/item-template.js';
import '../../ui/pages/basket-overview.js';
import '../../ui/stripe/payment-template.js';
import '../../ui/pages/delivery-template.js';
import '../../ui/pages/successful-transaction.js';
import '../../ui/pages/how-does-it-work.js';
import '../../ui/pages/who-we-are.js';

FlowRouter.route('/',{
  name: 'App.home',
    triggersEnter:[function(){
        console.log("pendel");
        $('body').addClass('sampleClass');
    }],
  action() {
   BlazeLayout.render('App_body', { main: 'landingTemplate' });
  },
    triggersExit:[function(){
                      $('body').removeClass('sampleClass');
                  }],
});

FlowRouter.route('/main',{
  name: 'Main',
  action() {
   BlazeLayout.render('App_body', { main: 'mainTemplate' });
  },
});

FlowRouter.route('/contacts',{
  name: 'Contacts',
  action() {
   BlazeLayout.render('App_body', { main: 'contactsTemplate' });
  },
});

FlowRouter.route('/shopping-page',{
  name: 'Shopping',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main:'shoppingTemplate'});
  },
});

FlowRouter.route('/payment',{
  name: 'Payment',
  action() {
   BlazeLayout.render('App_body', { main: 'paymentTemplate' });
  },
});

FlowRouter.route('/item',{
  name: 'Item',
  action() {
   BlazeLayout.render('App_body', { main: 'itemTemplate' });
  },
});

FlowRouter.route('/basket',{
  name: 'Basket',
  action() {
   BlazeLayout.render('App_body', { main: 'basketOverview' });
  },
});


FlowRouter.route('/delivery_details',{
  name: 'DeliveryDetails',
  action() {
   BlazeLayout.render('App_body', { main: 'deliveryTemplate' });
  },
});


FlowRouter.route('/confirmation',{
  name: 'successfulTrans',
   action()  {
   BlazeLayout.render('App_body', { main: 'successPayment' });
  },
});

FlowRouter.route('/how-does-it-work',{
  name: 'howDoesItworkInfo',
   action()  {
   BlazeLayout.render('App_body', { main: 'howDoesItWork' });
  },
});

FlowRouter.route('/who-we-are',{
  name: 'whoWeAre',
   action()  {
   BlazeLayout.render('App_body', { main: 'whoWeAre' });
  },
});