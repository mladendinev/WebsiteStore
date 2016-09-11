import { Meteor } from 'meteor/meteor';

if (Meteor.isServer){
   Meteor.startup(function(){
   console.log('check');
   process.env.MAIL_URL = "smtp://postmaster%40sandbox8509363d39af417d96231d3495a0865a.mailgun.org:6c3a487e8db0775eb688603ad31c2591@smtp.mailgun.org:587";
   });
}
