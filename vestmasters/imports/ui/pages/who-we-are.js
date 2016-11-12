import './who-we-are.html';
import '../components/navbar-main.js';

Template.whoWeAre.onRendered(function(){
   Session.set("DocumentTitle","Who We Are");
   GoogleMaps.load();
});
