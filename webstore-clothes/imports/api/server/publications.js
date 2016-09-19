import {Inventory} from '../products.js';

Meteor.publish('inventory', function() {
  return Inventory.find();
});