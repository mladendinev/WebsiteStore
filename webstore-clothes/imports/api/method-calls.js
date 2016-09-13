export function calculatePriceCall(){
	 Meteor.call("calculateTotalPrice",Session.get('itemsInBasketSession'),function(error,response){
             if(error){
                console.log("price could not be calculated, error occured");
             }
             else{
                Session.set("totalPrice",response);
             }
     });
};