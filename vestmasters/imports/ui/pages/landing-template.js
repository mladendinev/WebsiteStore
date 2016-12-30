import { Template } from 'meteor/templating'
import "./landing-template.html"


Template.landingTemplate.onRendered(function(){
   Session.set("DocumentTitle","Vest Masters Official Site");
});