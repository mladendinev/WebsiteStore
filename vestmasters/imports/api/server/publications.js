import {Inventory,Products,Orders} from '../products.js';

Meteor.publish('inventory', function() {
  return Inventory.find();
});

Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('orders', function(id){
	check(id,String);
	return Orders.find({"_id" : id});
})