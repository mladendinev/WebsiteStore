import {Inventory, InventoryLock} from '../../imports/api/products.js';
import sleep from 'sleep'

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
             });
		return total;
};

export function removeFromInventory(itemsArray,itemsDict){
  var queryArray = [];


  itemsArray.forEach(function(basketItem,index){
    var mongoItem = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}) 
    if(typeof mongoItem === "undefined"){
      generateIdError(basketItem.oid);
    } else {
      if (mongoItem.size) {
           addQuantitySize(itemsDict,basketItem,mongoItem);
           addSizeToSizesArray(itemsDict,basketItem,mongoItem);
         }
        else {
           addQuantityNoSize(itemsDict,mongoItem);
         }
      queryArray.push({"_id": new Meteor.Collection.ObjectID(basketItem.oid)});

    }});

 while(InventoryLock.update({"status" : "available"},{$set :{"status":"busy"}}) === 0){

 }; 
      Inventory.find({$or: queryArray}).forEach(function(mongoItem,index){
        if(mongoItem.size){
           itemsDict[mongoItem._id + ".size"] = true;
           checkSizesProvided(itemsDict,mongoItem);
           checkInventoryCapacity(itemsDict,mongoItem);  
        } else {
           itemsDict[mongoItem._id + ".size"] = false;
           checkInventoryCapacityNoSize(itemsDict,mongoItem);
        }  
 });

updateInventory(itemsDict,itemsArray,-1);    
console.log("got the lock");
InventoryLock.update({"status" : "busy"},{$set :{"status":"available"}})
};

export function updateInventory(itemsDict,itemsArray,value){
  itemsArray.forEach(function(basketItem,index){
          if(itemsDict[basketItem.oid+ ".size"]){
           queryObj = {}
           queryObj["quantitySize." + basketItem.size]  = value;
           Inventory.update({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}, {$inc: queryObj});
           ; 
         } 
          else {
            Inventory.update({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}, {$inc: {"quantity" : value}});
          }
         })
}

function addQuantitySize(itemsDict,basketItem,mongoItem){
   if(typeof itemsDict[mongoItem._id+ "." + basketItem.size] === "undefined") {
            itemsDict[mongoItem._id+ "." + basketItem.size] = 1;
           } else {
            itemsDict[mongoItem._id +"." + basketItem.size] = itemsDict[mongoItem._id + "." + basketItem.size] + 1;
           }
};

function addQuantityNoSize(itemsDict,mongoItem){
  if(typeof itemsDict[mongoItem._id+ ".quantity"] === "undefined") {
            itemsDict[mongoItem._id+ ".quantity"] = 1;
           } else {
            itemsDict[mongoItem._id +".quantity"] = itemsDict[mongoItem._id + ".quantity"] + 1;
           }
};

function addSizeToSizesArray(itemsDict,basketItem,mongoItem){
  if(typeof itemsDict[mongoItem._id+ ".sizes"] === "undefined") {
            itemsDict[mongoItem._id+ ".sizes"] = [basketItem.size];
           } else {
              if(itemsDict[mongoItem._id + ".sizes"].indexOf(basketItem.size)=== -1) {itemsDict[mongoItem._id + ".sizes"].push(basketItem.size);}
             }

};

function checkSizesProvided(itemsDict,mongoItem){
  itemsDict[mongoItem._id + ".sizes"].forEach(function(size){
      if((typeof (mongoItem["quantitySize"])[size.toString()]) === "undefined") {
      generateSizeError(mongoItem,size);
      }
}); 
};

function checkInventoryCapacity(itemsDict,mongoItem){
    mongoItem.sizes.forEach(function(mongoItemSize){
         if(itemsDict[mongoItem._id + "." + mongoItemSize] > (mongoItem["quantitySize"])[mongoItemSize.toString()]){
         generateErrorInventory(itemsDict,mongoItem,true,mongoItemSize);
         }
      });
  };

function checkInventoryCapacityNoSize(itemsDict,mongoItem){
 if(itemsDict[mongoItem._id + ".quantity"] > mongoItem.quantity) {
   generateErrorInventory(itemsDict,mongoItem,false)
 }
}

function generateErrorInventory(itemsDict,mongoItem,size,mongoItemSize){
  var details;
  if(size){
  details = {"product": mongoItem.product, "requestedNumber" : itemsDict[mongoItem._id + "." + mongoItemSize], "availableNumber": (mongoItem["quantitySize"])[mongoItemSize.toString()]} 
  }  else {
  details = {"product": mongoItem.product, "requestedNumber" : itemsDict[mongoItem._id + ".quantity"], "availableNumber": mongoItem["quantity"]}   
  }
  throw new Meteor.Error("INVENTORY_NOT_SUFFICIENT", "The inventory lack the capacity to process the order", details); 
}

function generateSizeError(mongoItem,size){
  var details ={"product": mongoItem.product , "requestedSize" : size};
  throw new Meteor.Error("INVALID_SIZE_SELECTED_BY_USER", "The user passed invalid size to the server", details);
}

function generateIdError(id){
  var details = {"id" :id};
  throw new Meteor.Error('BASKET_NOT_VALID', 'The basket contained invalid items',details);
}