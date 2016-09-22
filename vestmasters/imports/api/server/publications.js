import {Inventory,Products} from '../products.js';

Meteor.publish('inventory', function() {
  return Inventory.find();
});

Meteor.publish('products', function() {
  return Products.find();
});