import {InventoryLock,LockQueue} from '../imports/api/products.js';
const THRESHOLD_LOCK = 60;
const THRESHOLD_NEXT = 150;

var everyMinute = new Cron(function() {
	var lock = InventoryLock.findOne({"name" : "lock"});
    var difference = (new Date() - lock.lastUpdated)/1000;
    // console.log("next difference" +  difference);
	if(difference>THRESHOLD_LOCK && lock.status=="busy"){
     InventoryLock.update({"status" : "busy"},{$set :{"status":"available", "lastUpdated" : new Date()}});
     console.log("Waiting too long to release lock, setting lock to available");
   }
   // console.log(lock.next[0]);
   if (lock.next.length >0) {
   var difference = (new Date() - lock.lastPopped)/1000;
   // console.log("next difference" +  difference);
   if(difference>THRESHOLD_NEXT) {
    InventoryLock.update({"name" : "lock"}, {$pop : {"next" : -1}});
    LockQueue.remove({"_id" :lock.next[0]});
    console.log("Waiting too long for next payer. Removing him from the queue");
    }
   }
}, {});