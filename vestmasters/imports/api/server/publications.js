import {Inventory,Products,Orders,Countries} from '../products.js';

Meteor.publish('inventory', function() {
  return Inventory.find();
});

Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('countries', function() {
  return Countries.find();
});

Meteor.publish('orders', function(id){
	check(id,String);
	return Orders.find({"_id" : id});
})