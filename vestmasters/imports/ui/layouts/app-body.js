import { Template } from 'meteor/templating';

import './app-body.html';

Template.App_body.onCreated(function(){
	var currentValue = amplify.store('itemsInBasket');
  if ((typeof currentValue !== "undefined") && currentValue !== null) {
  Session.set('numberOfItemsInBasketSession',currentValue.length);
  } else {
  	Session.set('numberOfItemsInBasketSession', null);
  }
});
