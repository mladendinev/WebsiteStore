import { Template } from 'meteor/templating';
import {ITEMS_IN_BASKET_STORE,NUMBER_ITEMS_SESSION} from '../../api/session-constants.js';
import './app-body.html';

Template.App_body.onCreated(function(){
  var currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
  if ((typeof currentValue === "undefined") || currentValue === null) {
     amplify.store(ITEMS_IN_BASKET_STORE,[]);
  }
  currentValue = amplify.store(ITEMS_IN_BASKET_STORE);
  Session.set(NUMBER_ITEMS_SESSION,currentValue.length);
  
});

Template.App_body.onRendered(function(){
 document.body.addEventListener('touchstart', function() {
    var top = document.body.scrollTop
      , totalScroll = document.body.scrollHeight
      , currentScroll = top + document.body.offsetHeight

    //If we're at the top or the bottom of the containers
    //scroll, push up or down one pixel.
    //
    //this prevents the scroll from "passing through" to
    //the body.
    if(top === 0) {
      document.body.scrollTop = 1
    } else if(currentScroll === totalScroll) {
      document.body.scrollTop = top - 1
    }
  })

  document.body.addEventListener('touchmove', function(evt) {
    console.log("executed");
    //if the content is actually scrollable, i.e. the content is long enough
    //that scrolling can occur
    console.log(document.body.offsetHeight);
    console.log(document.body.scrollHeight);
    console.log(document.body.offsetHeight < document.body.scrollHeight);
    if(document.body.offsetHeight < document.body.scrollHeight)
      evt._isScroller = true
  })




document.body.addEventListener('touchmove', function(evt) {
  //In this case, the default behavior is scrolling the body, which
  //would result in an overflow.  Since we don't want that, we preventDefault.
  console.log(evt._isScroller);
  if(!evt._isScroller) {
    evt.preventDefault()
  }
 })
});