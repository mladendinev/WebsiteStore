import {Inventory}  from '../imports/api/products.js';
myColl = new Meteor.Pagination(Inventory,{ transform_options: function (filters, options) {
        return {fields : {carted : 0}};
    }
  });
