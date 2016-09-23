import {Inventory} from '../../imports/api/products.js';

export function calculatePriceCallServer(itemsArray){
		var total=0;
		var queryArray = [];
		var quantityDict = {};
		     itemsArray.forEach(function(basketItem,index){
		       if(typeof quantityDict[basketItem.oid] === "undefined") {
		       	quantityDict[basketItem.oid] = 1;
		       } else {
		       	quantityDict[basketItem.oid] = quantityDict[basketItem.oid] + 1;
		       } 
               queryArray.push({"_id": new Meteor.Collection.ObjectID(basketItem.oid)});
             });
              Inventory.find({$or: queryArray}).forEach(function(mongoBasketItem,index){
			  total = total + parseInt(mongoBasketItem.price)*quantityDict[mongoBasketItem._id.valueOf()];
	         });
              console.log(total)
		     return total;
};