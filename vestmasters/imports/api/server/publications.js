import {Baskets,Inventory,Products,Orders,Countries} from '../products.js';

Meteor.publish('inventory', function() {
  return Inventory.find();
});

Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('countries', function() {
  return Countries.find();
});

Meteor.publish('baskets', function(basketId) {
  check(basketId,String);
  return Baskets.find({"_id" : basketId});
});