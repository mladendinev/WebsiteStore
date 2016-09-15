import {exec} from 'child_process';


  if (Meteor.isServer){

   Meteor.methods({'encryptPayPalButton' : function() {
	const CERT_HOME = Meteor.settings.private.keyfileLocations.certificateHome;
	const MY_CERT = CERT_HOME + "pubcert.pem";
	const MY_KEY = CERT_HOME + "prvkey.pem";
	const PAYPAL_CERT = CERT_HOME + "paypal_cert_pem.txt";
    //const SIGNABLE_CONTENT = 'cmd=_xclick\nbusiness=mladen_dinev-facilitator@abv.bg\nitem_name=Jesus Christ its Jason Bourne\namount=34.00\nshipping=2.00 \nno_note=1\ncurrency_code=USD\ncert_id=FKAY6K9XKA98J';    
    var Future = Npm.require( 'fibers/future' ); 
    var future = new Future();
  
	
	var response = exec("printf 'cmd=_xclick\nbusiness=mladen_dinev-facilitator@abv.bg\nitem_name=Webstore Shoping Basket\namount=230\nshipping=2.00 \nno_note=1\ncurrency_code=EUR\ncert_id=FKAY6K9XKA98J\nreturn=http://localhost:3000/confirmation\nnotify_url=http://localhost:3000/post' | openssl smime -sign -signer " +  MY_CERT + ' -inkey '+ MY_KEY + ' -outform  der -nodetach -binary |' +
		 ' openssl smime -encrypt -des3 -binary -outform pem ' + PAYPAL_CERT, (error, stdout, stderr) => {
	  if (error) {
	    console.error(`exec error: ${error}`);
	    future.return( error );
	  }
	  //console.log(`stdout: ${stdout}`);
	   future.return(stdout);
	});
    
    return future.wait();
   }
   });
  }