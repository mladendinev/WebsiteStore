import {exec} from 'child_process';


  if (Meteor.isServer){

   Meteor.methods({'encryptPayPalButton' : function() {
     var Future = Npm.require( 'fibers/future' ); 
     var future = new Future();

     const PAYPAL_API_VERSION = Meteor.settings.private.paypal.apiVersion;
     const PAYPAL_API_USER = Meteor.settings.private.paypal.apiUserName;
     const PAYPAL_API_PASSWORD = Meteor.settings.private.paypal.apiPassword;
     const PAYPAL_API_SIGNATURE = Meteor.settings.private.paypal.apiSignature;
     const PAYPAL_BUSINESS_ID = Meteor.settings.private.paypal.paypalBusinessId;
     const PAYPAL_API_RETURN_URL = Meteor.settings.private.paypal.paypalApiReturnURL;
     const PAYPAL_API_NOTIFY_URL = Meteor.settings.private.paypal.papyalApiNotifyURL;
     const PAYPAL_API_ADDRESS = Meteor.settings.private.paypal.paypalApiAddress;

    const CONTENT  = "METHOD=BMCreateButton&" +
                     "VERSION=" + PAYPAL_API_VERSION + "&" +
                     "USER=" + PAYPAL_API_USER +"&" +
                     "PWD=" + PAYPAL_API_PASSWORD +"&" +
                     "SIGNATURE=" + PAYPAL_API_SIGNATURE +"&" +
                     "BUTTONCODE=ENCRYPTED&" +
                     "BUTTONTYPE=BUYNOW&" +
                     "L_BUTTONVAR1=business=" + PAYPAL_BUSINESS_ID +"&" +
                     "L_BUTTONVAR2=item_name=Webstore-Shoping-Basket&" +
                     "L_BUTTONVAR3=amount=230&" +
                     "L_BUTTONVAR4=shipping=2.00&" +
                     "L_BUTTONVAR5=currency_code=EUR&" +
                     "L_BUTTONVAR6=return=" + PAYPAL_API_RETURN_URL + "&" +
                     "L_BUTTONVAR7=notify_url=" + PAYPAL_API_NOTIFY_URL
 
	HTTP.call("POST", PAYPAL_API_ADDRESS,
          {content: CONTENT},
          function (error, result) {
            if (!error) {
              var re = /<form(.|[\r\n])*<\/form>/g;
              var decodedResult = decodeURIComponent(result.content);
              var extractedResult = decodedResult.match(re);
              console.log("The results from paypal NVP API:" + decodedResult); 
              console.log("The extracted result:" + extractedResult[0]);
              future.return(extractedResult[0]);
            } else {
              console.log(decodeURIComponent(error));
              future.return("");
            }

          });

          return future.wait();
     }
   });
  }