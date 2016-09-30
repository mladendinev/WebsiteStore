import { Template } from 'meteor/templating';
import {ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION} from '../../api/session-constants.js';
import './app-body.html';

Template.App_body.onCreated(function(){
  var currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
  if ((typeof currentValue === "undefined") || currentValue === null) {
     amplify.store(ITEMS_IN_BASKET_STORE,[]);
  }
  currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
  Session.set(NUMBER_ITEMS_SESSION,currentValue.length);
  
});
