import { Meteor } from 'meteor/meteor';

 if (Meteor.isServer){
    Meteor.startup(function(){
    process.env.MAIL_URL = "smtp://postmaster%40vestmasters.com:751fccbb857d695eca5594fed5488f0e@smtp.mailgun.org:587";
    });
 }