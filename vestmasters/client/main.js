import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {BASKET_ID} from '../imports/api/session-constants.js';

import '../imports/startup/client/client.js';




setInterval(function(){
 console.log("Event executed");
},1000000);

function checkForExpirationClient(){
	Meteor.call("checkForExpirationClient", amplify.store(BASKET_ID));
};