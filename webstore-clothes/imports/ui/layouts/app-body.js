import { Template } from 'meteor/templating';

import './app-body.html';

Template.App_body.onCreated(function(){
  Session.set('itemsInBasketTemplateLocal',amplify.store('itemsInBasket'));
});
