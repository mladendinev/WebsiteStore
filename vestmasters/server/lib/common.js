import {Inventory, InventoryLock, LockQueue} from '../../imports/api/products.js';
import sleep from 'sleep'

export function calculatePriceCallServer(itemsArray,itemsDict){
		var total=0;
        itemsArray.forEach(function(item,index){
    	  total = total + itemsDict[item._id.valueOf()+ "quantity"]*item.price;
           });

  		return total;
};