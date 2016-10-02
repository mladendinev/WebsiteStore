import {calculatePriceCall,obtainBraintreeId} from '../../api/method-calls.js';
import {BRAINTREE_CLIENT_TOKEN,TOTAL_PRICE_SESSION,ITEMS_IN_BASKET_SESSION,ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION,BASKET_ERROR,BASKET_ID} from '../../api/session-constants.js';
import '../components/dropdown-products.js';
import '../components/number-of-basket-items.js';
import '../components/navbar-shopping.js';
import './basket-overview.html';


import {Inventory}  from '../../api/products.js';
import {Baskets} from '../../api/products.js';

Template.basketOverview.onCreated(function(){
 this.basket = new ReactiveVar();
 this.autorun(() => {
      Meteor.subscribe('inventory');
      if((typeof amplify.store(BASKET_ID) !== "undefined") && amplify.store(BASKET_ID) !== null){
       Meteor.subscribe('baskets',amplify.store(BASKET_ID));
      }
      this.basket.set(Baskets.findOne(amplify.store(BASKET_ID)));
  });
});

Template.basketOverview.onRendered(function(){
   Session.set("DocumentTitle","Basket Overview");
   $("body").removeClass(); 
   $("body").addClass("background-white");
});

Template.basketOverview.helpers({

displayBasket(){
  var result = "";
  var basket = Template.instance().basket.get();
  if((typeof basket !== "undefined") && basket !== null) {
  basket.itemsDetails.forEach(function(item){
    result = result + "<tr>\n" +
                    "<td><img class='img-responsive img-circle img-basket' src='images/" + item.file +"' width='40px'/>\n" +
                    "<div class='table-div float-left'>" + item.product + "</div>\n" +
                    "</td>"
    if(item.size !== "noSize") {
      result = result +  "<td>\n" +
                     "<div class='table-div float-left'>" + item.size + "</div>\n" +
                     "</td>\n"
    } else {
              
       result = result + "<td>\n" +
                +  "<div class='table-div float-left'>n/a</div>\n" +
                +  "</td>\n"
    }
    
    if (item.initials !== "noInitials") {
        result = result + "<td>\n" +
                 "<div class='table-div float-left'>" + item.initials + "</div>\n" +
                "</td>\n"
    } else {
        result = result + "<td>\n" +
                          "<div class='table-div float-left'>n/a</div>" +
                          "</td>\n"
    }
        result = result + "<td>\n" +
                    "<div class='table-div float-left'>" + item.price + "</div>\n" +
                    "<div class='table-div float-right'><span class='glyphicon glyphicon-remove remove-item' aria-hidden='true' id=" +
                    item.oid + "></span></div>\n" +
                "</td>\n" +
                "</tr>\n"
     });
    }
     return result;
},

 total(){
  var basket = Template.instance().basket.get();
  if((typeof basket !== "undefined") && basket !== null) {
 	 return calculatePriceCall(basket);
  }
 },

 basketErrorPresent(){
  return Session.get(BASKET_ERROR) !== null && (typeof Session.get(BASKET_ERROR) !== "undefined");
 },

 errorMessages(){
   return Session.get(BASKET_ERROR);
 },
isDefined(item){
  console.log(item)
  if (Session.get(BASKET_ERROR) === null || (typeof Session.get(BASKET_ERROR) === "undefined")){
    return true;
  } else {
  return (typeof item !== "undefined") && item !== null;
  }
 }
});

 Template.basketOverview.events({

   'click .remove-item'(event){
          var currentItemsArray = amplify.store(ITEMS_IN_BASKET_STORE);
          var index = $(event.currentTarget).attr("id");
          currentItemsArray.splice(index,1);
          console.log(currentItemsArray);
          amplify.store(ITEMS_IN_BASKET_STORE,currentItemsArray);
          Session.set(ITEMS_IN_BASKET_SESSION,amplify.store(ITEMS_IN_BASKET_STORE));
          Session.set(TOTAL_PRICE_SESSION,calculatePriceCall());
          Session.set(NUMBER_ITEMS_SESSION,amplify.store(ITEMS_IN_BASKET_STORE).length);

   },

    'click .proceed-to-checkout-button'(event){
            obtainBraintreeId();
            FlowRouter.go('DeliveryDetails');
    }
 });