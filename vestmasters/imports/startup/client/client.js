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
      console.log('f!#@#@!#!');
      return a1.split(' ')[0]
});

//Template.registerHelper('pathForPost',() =>{
//    var product = this;
//    var params = {
//        product: product.productName,
//        pageId: pageId
//    };
//    var queryParams = {comments: "yes"};
//    var routeName = "blogPost";
//    var path = FlowRouter.path(routeName, params, queryParams);
//
//    return path;
//});
