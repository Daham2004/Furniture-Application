// Custom items configuration
$(document).ready(function() {
    var customItems = [
        {
            "name": "Custom Chair",
            "image": "models/thumbnails/custom-chair.jpg",
            "model": "models/custom/custom-chair.js",
            "type": "1"  // 1 for furniture
        },
        {
            "name": "Custom Table",
            "image": "models/thumbnails/custom-table.jpg",
            "model": "models/custom/custom-table.js",
            "type": "1"
        }
    ];

    // Add custom items to the items wrapper
    var itemsDiv = $("#items-wrapper");
    for (var i = 0; i < customItems.length; i++) {
        var item = customItems[i];
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