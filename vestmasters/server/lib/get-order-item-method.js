import {Orders} from '../../imports/api/products.js';

Meteor.methods({
   getOrder: function (id) {
     check(id,String);
     var decrypted = CryptoJS.AES.decrypt(id, Meteor.settings.private.crypto.aesKey);
     var objectId = decrypted.toString(CryptoJS.enc.Utf8);
     return Orders.findOne({"_id" : objectId});
   }
});