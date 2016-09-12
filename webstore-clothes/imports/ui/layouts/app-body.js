import { Template } from 'meteor/templating';

import './app-body.html';

Template.App_body.onCreated(function(){
  var currentValue = amplify.store('itemsInBasket');
  if ((typeof currentValue === "undefined") || currentValue === null) {
     amplify.store('itemsInBasket',[]);
  }
  currentValue = amplify.store('itemsInBasket');
  Session.set('numberOfItemsInBasketSession',currentValue.length);
  
});
