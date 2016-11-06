import "./contacts-template.html"

Template.contactsTemplate.onRendered(function(){
   Session.set("DocumentTitle","Contacts");
   GoogleMaps.load();
});


Template.contactsTemplate.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
  });