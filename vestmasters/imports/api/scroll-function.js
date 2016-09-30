export function scrollWin(idBottom,idTop,x) {
    document.getElementById("scrollable-prod-div").scrollTop += x;
    var newBottom = parseInt($(idBottom).css("bottom"))-parseInt(x);
    var newTop = parseInt($(idTop).css("top"))+parseInt(x);
    var bottomLimit = parseInt($("#scrollable-prod-div").css("height")) - $("#scrollable-prod-div")[0].scrollHeight
     if(newTop < 0) { 
      $(idTop).css("top","0px");
      $(idBottom).css("bottom","0px");  
     } else if (newBottom < bottomLimit) {
        $(idBottom).css("bottom",bottomLimit);  
        $(idTop).css("top", -bottomLimit); 
     } else {
         $(idTop).css("top",newTop);
         $(idBottom).css("bottom",newBottom);  
       }
   };
