import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/landing-page.js';
import '../../ui/pages/shop-template.js';


FlowRouter.route('/',{
  name: 'App.home',
  action() {
   BlazeLayout.render('App_body', { main: 'landing-page' });
  },
});

FlowRouter.route('/shop',{
  name: 'Shop',
  action() {
   BlazeLayout.render('App_body', { main: 'shop-template' });
  },
});
