import './routes.js';

if (Meteor.isClient){
  Meteor.startup(function() {
   
    Deps.autorun(function(){
      document.title = Session.get("DocumentTitle");
    });
  });
}

Template.registerHelper( 'equals', ( a1, a2 ) => {
  return a1 === a2;
});