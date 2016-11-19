import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {BASKET_ID} from '../imports/api/session-constants.js';

import '../imports/startup/client/client.js';

Meteor.startup(function(){
  if (Meteor.isClient && (typeof amplify.store(BASKET_ID) === "string") && amplify.store(BASKET_ID) !== null){
     checkForExpirationClient();
  }
  setInterval(function(){
    checkForExpirationClient();
   },300000);
 });


function checkForExpirationClient(){
	Meteor.call("checkForExpirationClient", amplify.store(BASKET_ID), function(error,response){
	  var message;
      if(error){
      	console.log(error);
      	return;
      }
      
      if (response.expired){
            data = {message:"Your basket has expired!. You now will be redirected to the main page"};
            Modal.show('modalExpiry',data ,{backdrop: 'static',keyboard: false});
      		FlowRouter.go('/main');
      } else{
          if(response.warning){
            data = {message:"Your basket is about to expire in less than 5 minutes. Please ensure that you checkout on time"};
            Modal.show('modalExpiry',data,{backdrop: 'static',keyboard: false});
          }
        }
	});
};

