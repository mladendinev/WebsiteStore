import "./contacts-template.html"

Template.contactsTemplate.onCreated(function(){
   Session.set("DocumentTitle","Contacts");
   GoogleMaps.load({key:'AIzaSyDSI0LKtxtDGL0pEvjgfCwyxELC9cA-_f4'});
});


Template.contactsTemplate.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('contactsMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});

Template.contactsTemplate.helpers({
  contactsMap: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(43.2104123, 27.9250238),
        zoom: 17
      };
    }
  }
  });