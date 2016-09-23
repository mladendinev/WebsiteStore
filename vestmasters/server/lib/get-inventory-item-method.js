import {Inventory} from '../../imports/api/products.js';

Meteor.methods({
   getSingleItem: function (id) {
     check(id,String);
     return Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(id)});
   }
});