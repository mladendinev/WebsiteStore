import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/landing-page.js';
import '../../ui/pages/shop-template.js';
import '../../ui/pages/contacts-template.js';
import '../../ui/pages/shopping_page.js';

FlowRouter.route('/',{
  name: 'App.home',
  action() {
   BlazeLayout.render('App_body', { main: 'landingPage' });
  },
});

FlowRouter.route('/shop',{
  name: 'Shop',
  action() {
   BlazeLayout.render('App_body', { main: 'shopTemplate' });
  },
});

FlowRouter.route('/contacts',{
  name: 'Contacts',
  action() {
   BlazeLayout.render('App_body', { main: 'contactsTemplate' });
  },
});

FlowRouter.route('/shopping',{
  name: 'Shopping',
  action() {
   BlazeLayout.render('App_body', { main: 'shoppingTemplate' });
  },
});
