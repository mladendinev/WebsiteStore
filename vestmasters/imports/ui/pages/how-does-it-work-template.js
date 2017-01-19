import './how-does-it-work-template.html';
import '../components/navbar-main.js';

Template.howDoesItWork.onRendered(function(){
   Session.set("DocumentTitle","How Does It Work");
   GoogleMaps.load();
});
