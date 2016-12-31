import './routes.js';

if (Meteor.isClient){
  Meteor.startup(function() {
   
    Deps.autorun(function(){
      document.title = Session.get("DocumentTitle");
    });
  });
}

Template.registerHelper( 'equals', ( a1) => {
  var vest = "vests"
  return a1.indexOf(vest) !== -1;
});

Template.registerHelper( 'checkBasket', ( a1,a2) => {
   return a1 === a2;
});

Template.registerHelper('checkVal',(a1) =>{
      return a1.split(' ')[0]
});

