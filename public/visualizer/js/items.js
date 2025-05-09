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
      "name" : "Dresser - White",
      "image" : "models/thumbnails/thumbnail_img25o.jpg",
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
      "name" : "Green Couch",
      "image" : "models/thumbnails/thumbnail_img21o.jpg",
      "model" : "models/js/we-crosby2piece-greenbaked.js",
      "type" : "1"
    },
        {
      "name" : "Dining Table",
      "image" : "models/thumbnails/thumbnail_scholar-dining-table.jpg",
      "model" : "models/js/cb-scholartable_baked.js",
      "type" : "1"
    },   
    {
      "name" : "Small Table",
      "image" : "models/thumbnails/thumbnail_Blu-Dot-Shale-Bedside-Table.jpg",
      "model" : "models/js/bd-shalebedside-smoke_baked.js",
      "type" : "1"
    }, 
    {
      "name" : "Bedside table - White",
      "image" : "models/thumbnails/thumbnail_arch-white-oval-nightstand.jpg",
      "model" : "models/js/cb-archnight-white_baked.js",
      "type" : "1"
    }, 
    {
      "name" : "Wardrobe - White",
      "image" : "models/thumbnails/thumbnail_TN-ikea-kvikine.png",
      "model" : "models/js/ik-kivine_baked.js",
      "type" : "1"
    }, 
     
    {
      "name" : "Bookshelf",
      "image" : "models/thumbnails/thumbnail_kendall-walnut-bookcase.jpg",
      "model" : "models/js/cb-kendallbookcasewalnut_baked.js",
      "type" : "1"
    }, 
       
    {
      "name" : "Sofa - Grey",
      "image" : "models/thumbnails/thumbnail_rochelle-sofa-3.jpg",
      "model" : "models/js/cb-rochelle-gray_baked.js",
      "type" : "1"
    }, 
        {
      "name" : "Wooden Trunk",
      "image" : "models/thumbnails/thumbnail_teca-storage-trunk.jpg",
      "model" : "models/js/cb-tecs_baked.js",
      "type" : "1"
    }, 
        {
      "name" : "Floor Lamp",
      "image" : "models/thumbnails/thumbnail_ore-white.png",
      "model" : "models/js/ore-3legged-white_baked.js",
      "type" : "1"
    },
    {
      "name" : "Coffee Table - Wood",
      "image" : "models/thumbnails/thumbnail_stockholm-coffee-table__0181245_PE332924_S4.JPG",
      "model" : "models/js/ik-stockholmcoffee-brown.js",
      "type" : "1"
    }, 
    {
      "name" : "Side Table",
      "image" : "models/thumbnails/thumbnail_Screen_Shot_2014-02-21_at_1.24.58_PM.png",
      "model" : "models/js/GUSossingtonendtable.js",
      "type" : "1"
    }, 

    {
      "name" : "Dining table",
      "image" : "models/thumbnails/thumbnail_Screen_Shot_2014-01-28_at_6.49.33_PM.png",
      "model" : "models/js/BlakeAvenuejoshuatreecheftable.js",
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