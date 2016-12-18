import {Baskets,Inventory,Products,Orders,Countries,Carousel} from '../imports/api/products.js';

Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('countries', function() {
  return Countries.find();
});

Meteor.publish('baskets', function(basketId,secret) {
  check(basketId,String);
  check(secret,String);
  return Baskets.find({"_id" : basketId, 'secret': secret});
});

Meteor.publish('carousel', function() {
  return Carousel.find({});
});