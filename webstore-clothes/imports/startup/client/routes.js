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

FlowRouter.route('/',{
  name: 'App.home',
  action() {
   BlazeLayout.render('App_body', { main: 'landingTemplate' });
  },
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
