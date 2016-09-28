import {Inventory, InventoryLock} from '../../imports/api/products.js';
import sleep from 'sleep'

export function calculatePriceCallServer(itemsArray,itemsDict){
		var total=0;
        itemsDict.mongoArray.forEach(function(mongoBasketItem,index){
    	  total = total + parseInt(mongoBasketItem.price)*itemsDict[mongoBasketItem._id.valueOf()+ ".quantityPerId"];
           });

  		return total;
};



export function removeFromInventory(itemsArray,itemsDict){
  var queryArray = [];
  setUpData(itemsDict,itemsArray,queryArray)
  

 while(InventoryLock.update({"status" : "available"},{$set :{"status":"busy"}}) === 0){}; 
   itemsDict.mongoArray = Inventory.find({$or: queryArray}).fetch();
   var errorDetails = [];

   itemsDict.mongoArray.forEach(function(mongoItem,index){
        if(mongoItem.size){
           itemsDict[mongoItem._id + ".size"] = true;
           checkInventoryCapacity(itemsDict,mongoItem,errorDetails);  
        } else {
           itemsDict[mongoItem._id + ".size"] = false;
           checkInventoryCapacityNoSize(itemsDict,mongoItem,errorDetails);
        }
   });
   if(errorDetails.length>0){
     throwInventoryError(errorDetails);
   }

   itemsDict.mongoArray.forEach(function(mongoItem,index){    
    if(mongoItem.size){ 
     checkSizesProvided(itemsDict,mongoItem,errorDetails);
    }
   });
   
   if(errorDetails.length>0){
     throwSizeError(errorDetails);
   }   

updateInventory(itemsDict,itemsArray,-1);    
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

function setUpData(itemsDict,itemsArray,queryArray){
   itemsArray.forEach(function(basketItem,index){
    var mongoItem = Inventory.findOne({"_id" : new Meteor.Collection.ObjectID(basketItem.oid)}) 
    if(typeof mongoItem === "undefined"){
      generateIdError(basketItem.oid);
    } else {
      addQuantityPerId(itemsDict,basketItem);
      updatebasketItem(basketItem,mongoItem);
      if (mongoItem.size) {
           addQuantitySize(itemsDict,basketItem,mongoItem);
           addSizeToSizesArray(itemsDict,basketItem,mongoItem);
         }
        else {
          addQuantityNoSize(itemsDict,mongoItem);
         }
        queryArray.push({"_id": new Meteor.Collection.ObjectID(basketItem.oid)});
      

    }});
}

function updatebasketItem(basketItem,mongoItem){
 basketItem.price = mongoItem.price;
 basketItem.product = mongoItem.product;
 basketItem.file =mongoItem.file;
}

function addQuantityPerId(itemsDict,basketItem){
         if(typeof itemsDict[basketItem.oid+ ".quantityPerId"] === "undefined") {
            itemsDict[basketItem.oid+ ".quantityPerId"] = 1;
           } else {
            itemsDict[basketItem.oid +".quantityPerId"] = itemsDict[basketItem.oid + ".quantityPerId"] + 1;
           } 
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

function checkSizesProvided(itemsDict,mongoItem,details){
  itemsDict[mongoItem._id + ".sizes"].forEach(function(size){
      if((typeof (mongoItem["quantitySize"])[size.toString()]) === "undefined") {
      generateSizeError(mongoItem,size,details);
      }
}); 
};

function checkInventoryCapacity(itemsDict,mongoItem,details){
    mongoItem.sizes.forEach(function(mongoItemSize){
         if(itemsDict[mongoItem._id + "." + mongoItemSize] > (mongoItem["quantitySize"])[mongoItemSize.toString()]){
         generateErrorInventory(itemsDict,mongoItem,true,details,mongoItemSize);
         }
      });
  };

function checkInventoryCapacityNoSize(itemsDict,mongoItem,details){
 if(itemsDict[mongoItem._id + ".quantity"] > mongoItem.quantity) {
   generateErrorInventory(itemsDict,mongoItem,false,details);
 }
}

function generateErrorInventory(itemsDict,mongoItem,size,details,mongoItemSize){
  if(size){
  details.push({"product": mongoItem.product, "requestedNumber" : itemsDict[mongoItem._id + "." + mongoItemSize], "availableNumber": (mongoItem["quantitySize"])[mongoItemSize.toString()], "requestedSize":mongoItemSize.toString() })
  }  else {
  details.push({"product": mongoItem.product, "requestedNumber" : itemsDict[mongoItem._id + ".quantity"], "availableNumber": mongoItem["quantity"]})   
  }
  
}

function generateSizeError(mongoItem,size,details){
  details.push({"product": mongoItem.product , "requestedSize" : size});
}

function throwInventoryError(details){
 throw new Meteor.Error("INVENTORY_NOT_SUFFICIENT", "The inventory lack the capacity to process the order", details); 
}

function throwSizeError(details){
 throw new Meteor.Error("INVALID_SIZE_SELECTED_BY_USER", "The user passed invalid size to the server", details);
}

function generateIdError(id){
  var details = {"id" :id};
  throw new Meteor.Error('BASKET_NOT_VALID', 'The basket contained invalid items',details);
}