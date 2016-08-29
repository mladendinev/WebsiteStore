import './shopping-template.html';

import {Carousel}  from '../../api/products.js';

Template.shoppingTemplate.helpers({
 carousel(){
  return Carousel.find({});
 },
});

