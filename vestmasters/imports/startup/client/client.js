import './routes.js';

if (Meteor.isClient){
  Meteor.startup(function() {
   
    Deps.autorun(function(){
      document.title = Session.get("DocumentTitle");
    });
  });
}