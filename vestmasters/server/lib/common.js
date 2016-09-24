import {Inventory} from '../../imports/api/products.js';

export function calculatePriceCallServer(itemsArray){
		var total=0;
		var queryArray = [];
		var itemsDict = {};
             itemsArray.forEach(function(basketItem,index){
		       if(typeof itemsDict[basketItem.oid+ ".quantity"] === "undefined") {
		       	itemsDict[basketItem.oid+ ".quantity"] = 1;
		       } else {
		       	itemsDict[basketItem.oid +".quantity"] = itemsDict[basketItem.oid + ".quantity"] + 1;
		       } 
               queryArray.push({"_id": new Meteor.Collection.ObjectID(basketItem.oid)});
             });
              
              Inventory.find({$or: queryArray}).forEach(function(mongoBasketItem,index){
			  total = total + parseInt(mongoBasketItem.price)*itemsDict[mongoBasketItem._id.valueOf()+ ".quantity"];
              itemsDict[mongoBasketItem._id.valueOf() +".price"]=mongoBasketItem.price;
              itemsDict[mongoBasketItem._id.valueOf()+ ".product"]=mongoBasketItem.product;
              itemsDict[mongoBasketItem._id.valueOf()+ ".file"] = mongoBasketItem.file;
	         });

             itemsArray.forEach(function(basketItem,index){
                basketItem.price = itemsDict[basketItem.oid + ".price"];
                basketItem.product = itemsDict[basketItem.oid +  ".product"];
                basketItem.file = itemsDict[basketItem.oid+ ".file"];
                console.log(basketItem);
             });
		return total;
};