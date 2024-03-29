import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {BASKET_ID,BASKET_SECRET} from '../imports/api/session-constants.js';

import '../imports/startup/client/client.js';

Meteor.startup(function(){
  
  checkForExpirationClient();
  
  setInterval(function(){
    checkForExpirationClient();
   },300000);
 });


function checkForExpirationClient(){
	 if ((typeof amplify.store(BASKET_ID) !== "string") || amplify.store(BASKET_ID) === null) {
     amplify.store(BASKET_ID,"");
  }

  if ((typeof amplify.store(BASKET_SECRET) !== "string") || amplify.store(BASKET_SECRET) === null) {
     amplify.store(BASKET_SECRET,"");
  }
  Meteor.call("checkForExpirationClient", amplify.store(BASKET_ID),amplify.store(BASKET_SECRET), function(error,response){
	  var message;
      if(error){
      	console.log(error);
      	return;
      }
      
      if (response.expired){
            data = {message:"Your basket has expired!. \n  You now will be redirected to the main page"};
            Modal.show('modalExpiry',data ,{backdrop: 'static',keyboard: false});
      		FlowRouter.go('/main');
      } else{
          if(response.warning){
            data = {message:"Your basket is about to expire in less than 5 minutes.\n Please ensure that you checkout on time"};
            Modal.show('modalExpiry',data,{backdrop: 'static',keyboard: false});
          }
        }
	});
};

