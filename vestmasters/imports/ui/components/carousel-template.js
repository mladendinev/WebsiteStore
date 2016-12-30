import './carousel-template.html';

import {Carousel}  from '../../api/products.js';

import {Shopping}  from '../../api/products.js';

appendIndicators= function(size,el) {
   var li = document.getElementById(el);

   for (i = 0; i < cars.length; i++) {
       var entry = document.createElement('li');
       entry.setAttribute('data-target',"#myCarousel");
       entry.setAttribute('data-slide-to',i);
       li.appendChild(entry)
   }
}

Template.carouselTemplate.helpers({
   carousel(){
     return Carousel.find({});
    },

   sizeList(){
     return Carousel.find({}).count();
   },
   carouselStyleHelper(carouselStyle){
    console.log("The style" + Template.instance().style);
    return Template.instance().style;
   },
   carouselSetStyle(carouselStyle){
     Template.instance().style = carouselStyle;
   }
});
