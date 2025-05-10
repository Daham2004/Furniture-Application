// add items to the "Add Items" tab

$(document).ready(function() {
  var items = [
   {
      "name" : "White Door",
      "image" : "models/thumbnails/door closed.png",
      "model" : "models/js/closed-door28x80_baked.js",
      "type" : "7"
    }, 
   
    {
      "name" : "Window",
      "image" : "models/thumbnails/window.png",
      "model" : "models/js/whitewindow.js",
      "type" : "3"
    }, 
    {
      "name" : "Chair",
      "image" : "models/thumbnails/chair.png",
      "model" : "models/js/gus-churchchair-whiteoak.js",
      "type" : "1"
    }, 
    {
      "name" : "Red Couch",
      "image" : "models/thumbnails/chair_red.png",
      "model" : "models/js/ik-ekero-orange_baked.js",
      "type" : "1"
    },
    {
      "name" : "Blue Couch",  
      "image" : "models/thumbnails/blue_chair.png",
      "model" : "models/js/ik-ekero-blue_baked.js",
      "type" : "1"
    },
    {
      "name" : "Queen Bed(White)",
      "image" : "models/thumbnails/bed.png",
      "model" : "models/js/ik_nordli_full.js",
      "type" : "1"
    },
    
        {
      "name" : "Televeision Stand",
      "image" : "models/thumbnails/tv.png",
      "model" : "models/js/cb-clapboard_baked.js",
      "type" : "1"
    }, 
     
    {
      "name" : "White Dresser",
      "image" : "models/thumbnails/dresser long.png",
      "model" : "models/js/we-narrow6white_baked.js",
      "type" : "1"
    },
     {
      "name" : "Comic Posterr",
      "image" : "models/thumbnails/comic.png",
      "model" : "models/js/nyc-poster2.js",
      "type" : "2"
    }, 
    
   
 
       
    {
      "name" : "Large grey sofa",
      "image" : "models/thumbnails/grey sofa.png",
      "model" : "models/js/cb-rochelle-gray_baked.js",
      "type" : "1"
    }, 
     
  
  
    
   
  
  
   
   /*     
   {
      "name" : "",
      "image" : "",
      "model" : "",
      "type" : "1"
    }, 
    */
  ]



  var itemsDiv = $("#items-wrapper")
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var html = '<div class="col-sm-4">' +
                '<a class="thumbnail add-item" model-name="' + 
                item.name + 
                '" model-url="' +
                item.model +
                '" model-type="' +
                item.type + 
                '"><img src="' +
                item.image + 
                '" alt="Add Item"> '+
                item.name +
                '</a></div>';
    itemsDiv.append(html);
  }
});