import './dropdown-products.html'
import '../../api/products.js'

import {Products}  from '../../api/products.js';

Template.dropdownProducts.helpers({
 products() {
    	return Products.find({});
    },
});