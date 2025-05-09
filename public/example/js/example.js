/*
 * Camera Buttons
 */

var CameraButtons = function(blueprint3d) {

  var orbitControls = blueprint3d.three.controls;
  var three = blueprint3d.three;

  var panSpeed = 30;
  var directions = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  function init() {
    // Camera controls
    $("#zoom-in").click(zoomIn);
    $("#zoom-out").click(zoomOut);  
    $("#zoom-in").dblclick(preventDefault);
    $("#zoom-out").dblclick(preventDefault);

    $("#reset-view").click(three.centerCamera)

    $("#move-left").click(function(){
      pan(directions.LEFT)
    })
    $("#move-right").click(function(){
      pan(directions.RIGHT)
    })
    $("#move-up").click(function(){
      pan(directions.UP)
    })
    $("#move-down").click(function(){
      pan(directions.DOWN)
    })

    $("#move-left").dblclick(preventDefault);
    $("#move-right").dblclick(preventDefault);
    $("#move-up").dblclick(preventDefault);
    $("#move-down").dblclick(preventDefault);
  }

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function pan(direction) {
    switch (direction) {
      case directions.UP:
        orbitControls.panXY(0, panSpeed);
        break;
      case directions.DOWN:
        orbitControls.panXY(0, -panSpeed);
        break;
      case directions.LEFT:
        orbitControls.panXY(panSpeed, 0);
        break;
      case directions.RIGHT:
        orbitControls.panXY(-panSpeed, 0);
        break;
    }
  }

  function zoomIn(e) {
    e.preventDefault();
    orbitControls.dollyIn(1.1);
    orbitControls.update();
  }

  function zoomOut(e) {
    e.preventDefault;
    orbitControls.dollyOut(1.1);
    orbitControls.update();
  }

  init();
}

/*
 * Context menu for selected item
 */ 

var ContextMenu = function(blueprint3d) {

  var scope = this;
  var selectedItem;
  var three = blueprint3d.three;

  function init() {
    $("#context-menu-delete").click(function(event) {
        selectedItem.remove();
    });

    three.itemSelectedCallbacks.add(itemSelected);
    three.itemUnselectedCallbacks.add(itemUnselected);

    initResize();

    $("#fixed").click(function() {
        var checked = $(this).prop('checked');
        selectedItem.setFixed(checked);
    });
  }

  function cmToIn(cm) {
    return cm / 2.54;
  }

  function inToCm(inches) {
    return inches * 2.54;
  }

  function itemSelected(item) {
    selectedItem = item;

    $("#context-menu-name").text(item.metadata.itemName);

    $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
    $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
    $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));

    $("#context-menu").show();

    $("#fixed").prop('checked', item.fixed);
  }

  function resize() {
    selectedItem.resize(
      inToCm($("#item-height").val()),
      inToCm($("#item-width").val()),
      inToCm($("#item-depth").val())
    );
  }

  function initResize() {
    $("#item-height").change(resize);
    $("#item-width").change(resize);
    $("#item-depth").change(resize);
  }

  function itemUnselected() {
    selectedItem = null;
    $("#context-menu").hide();
  }

  init();
}

/*
 * Loading modal for items
 */

var ModalEffects = function(blueprint3d) {

  var scope = this;
  var blueprint3d = blueprint3d;
  var itemsLoading = 0;

  this.setActiveItem = function(active) {
    itemSelected = active;
    update();
  }

  function update() {
    if (itemsLoading > 0) {
      $("#loading-modal").show();
    } else {
      $("#loading-modal").hide();
    }
  }

  function init() {
    blueprint3d.model.scene.itemLoadingCallbacks.add(function() {
      itemsLoading += 1;
      update();
    });

     blueprint3d.model.scene.itemLoadedCallbacks.add(function() {
      itemsLoading -= 1;
      update();
    });   

    update();
  }

  init();
}

/*
 * Side menu
 */

var SideMenu = function(blueprint3d, floorplanControls, modalEffects) {
  var blueprint3d = blueprint3d;
  var floorplanControls = floorplanControls;
  var modalEffects = modalEffects;

  var ACTIVE_CLASS = "active";

  var tabs = {
    "FLOORPLAN" : $("#floorplan_tab"),
    "SHOP" : $("#items_tab"),
    "DESIGN" : $("#design_tab"),
    "COLOR_SCHEME" : $("#color_scheme_tab"),
    "DESIGN_MANAGEMENT" : $("#design_management_tab")
  }

  var scope = this;
  this.stateChangeCallbacks = $.Callbacks();

  this.states = {
    "DEFAULT" : {
      "div" : $("#viewer"),
      "tab" : tabs.DESIGN
    },
    "FLOORPLAN" : {
      "div" : $("#floorplanner"),
      "tab" : tabs.FLOORPLAN
    },
    "SHOP" : {
      "div" : $("#add-items"),
      "tab" : tabs.SHOP
    },
    "COLOR_SCHEME" : {
      "div" : $("#viewer"),
      "tab" : $("#color_scheme_tab")
    },
    "DESIGN_MANAGEMENT" : {
      "div" : $("#viewer"),
      "tab" : $("#design_management_tab")
    }
  }

  // sidebar state
  var currentState = scope.states.FLOORPLAN;

  function init() {
    for (var tab in tabs) {
      var elem = tabs[tab];
      elem.click(tabClicked(elem));
    }

    // Add handlers for new tabs
    $("#color_scheme_tab").click(function() {
      console.log("Color scheme tab clicked");
      setCurrentState(scope.states.COLOR_SCHEME);
      $("#colorSchemeDiv").show();
      $("#designManagementDiv").hide();
      if (window.BlueprintUI) {
        window.BlueprintUI.initializeColorSchemeManagement();
      }
    });

    $("#design_management_tab").click(function() {
      console.log("Design management tab clicked");
      setCurrentState(scope.states.DESIGN_MANAGEMENT);
      $("#designManagementDiv").show();
      $("#colorSchemeDiv").hide();
      if (window.BlueprintUI) {
        window.BlueprintUI.initializeDesignManagement();
      }
    });

    $("#update-floorplan").click(floorplanUpdate);

    initLeftMenu();

    blueprint3d.three.updateWindowSize();
    handleWindowResize();

    initItems();

    setCurrentState(scope.states.DEFAULT);
  }

  function floorplanUpdate() {
    setCurrentState(scope.states.DEFAULT);
  }

  function tabClicked(tab) {
    return function() {
      // Stop three from spinning
      blueprint3d.three.stopSpin();

      // Selected a new tab
      for (var key in scope.states) {
        var state = scope.states[key];
        if (state.tab == tab) {
          setCurrentState(state);
          break;
        }
      }
    }
  }
  
  function setCurrentState(newState) {

    if (currentState == newState) {
      return;
    }

    // show the right tab as active
    if (currentState.tab !== newState.tab) {
      if (currentState.tab != null) {
        currentState.tab.removeClass(ACTIVE_CLASS);          
      }
      if (newState.tab != null) {
        newState.tab.addClass(ACTIVE_CLASS);
      }
    }

    // set item unselected
    blueprint3d.three.getController().setSelectedObject(null);

    // show and hide the right divs
    currentState.div.hide()
    newState.div.show()

    // custom actions
    if (newState == scope.states.FLOORPLAN) {
      floorplanControls.updateFloorplanView();
      floorplanControls.handleWindowResize();
    } 

    if (currentState == scope.states.FLOORPLAN) {
      blueprint3d.model.floorplan.update();
    }

    if (newState == scope.states.DEFAULT) {
      blueprint3d.three.updateWindowSize();
    }
 
    // set new state
    handleWindowResize();    
    currentState = newState;

    scope.stateChangeCallbacks.fire(newState);
  }

  function initLeftMenu() {
    $( window ).resize( handleWindowResize );
    handleWindowResize();
  }

  function handleWindowResize() {
    $(".sidebar").height(window.innerHeight);
    $("#add-items").height(window.innerHeight);

  };

  // TODO: this doesn't really belong here
  function initItems() {
    $("#add-items").find(".add-item").mousedown(function(e) {
      var modelUrl = $(this).attr("model-url");
      var itemType = parseInt($(this).attr("model-type"));
      var metadata = {
        itemName: $(this).attr("model-name"),
        resizable: true,
        modelUrl: modelUrl,
        itemType: itemType
      }

      blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
      setCurrentState(scope.states.DEFAULT);
    });
  }

  init();

}

/*
 * Change floor and wall textures
 */

var TextureSelector = function (blueprint3d, sideMenu) {

  var scope = this;
  var three = blueprint3d.three;
  var isAdmin = isAdmin;

  var currentTarget = null;

  function initTextureSelectors() {
    $(".texture-select-thumbnail").click(function(e) {
      var textureUrl = $(this).attr("texture-url");
      var textureStretch = ($(this).attr("texture-stretch") == "true");
      var textureScale = parseInt($(this).attr("texture-scale"));
      currentTarget.setTexture(textureUrl, textureStretch, textureScale);

      e.preventDefault();
    });
  }

  function init() {
    three.wallClicked.add(wallClicked);
    three.floorClicked.add(floorClicked);
    three.itemSelectedCallbacks.add(reset);
    three.nothingClicked.add(reset);
    sideMenu.stateChangeCallbacks.add(reset);
    initTextureSelectors();
  }

  function wallClicked(halfEdge) {
    currentTarget = halfEdge;
    $("#floorTexturesDiv").hide();  
    $("#wallTextures").show();  
  }

  function floorClicked(room) {
    currentTarget = room;
    $("#wallTextures").hide();  
    $("#floorTexturesDiv").show();  
  }

  function reset() {
    $("#wallTextures").hide();  
    $("#floorTexturesDiv").hide();  
  }

  init();
}

/*
 * Floorplanner controls
 */

var ViewerFloorplanner = function(blueprint3d) {

  var canvasWrapper = '#floorplanner';

  // buttons
  var move = '#move';
  var remove = '#delete';
  var draw = '#draw';

  var activeStlye = 'btn-primary disabled';

  this.floorplanner = blueprint3d.floorplanner;

  var scope = this;

  function init() {

    $( window ).resize( scope.handleWindowResize );
    scope.handleWindowResize();

    // mode buttons
    scope.floorplanner.modeResetCallbacks.add(function(mode) {
      $(draw).removeClass(activeStlye);
      $(remove).removeClass(activeStlye);
      $(move).removeClass(activeStlye);
      if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
          $(move).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
          $(draw).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
          $(remove).addClass(activeStlye);
      }

      if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
        $("#draw-walls-hint").show();
        scope.handleWindowResize();
      } else {
        $("#draw-walls-hint").hide();
      }
    });

    $(move).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
    });

    $(draw).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
    });

    $(remove).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
    });
  }

  this.updateFloorplanView = function() {
    scope.floorplanner.reset();
  }

  this.handleWindowResize = function() {
    $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
    scope.floorplanner.resizeView();
  };

  init();
}; 

var mainControls = function(blueprint3d) {
  var blueprint3d = blueprint3d;

  function newDesign() {
    blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  }

  function loadDesign() {
    files = $("#loadFile").get(0).files;
    var reader  = new FileReader();
    reader.onload = function(event) {
        var data = event.target.result;
        blueprint3d.model.loadSerialized(data);
    }
    reader.readAsText(files[0]);
  }

  function saveDesign() {
    var data = blueprint3d.model.exportSerialized();
    var a = window.document.createElement('a');
    var blob = new Blob([data], {type : 'text'});
    a.href = window.URL.createObjectURL(blob);
    a.download = 'design.blueprint3d';
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
  }

  function init() {
    $("#new").click(newDesign);
    $("#loadFile").change(loadDesign);
    $("#saveFile").click(saveDesign);
  }

  init();
}

/*
 * Initialize!
 */

$(document).ready(function() {

  // main setup
  var opts = {
    floorplannerElement: 'floorplanner-canvas',
    threeElement: '#viewer',
    threeCanvasElement: 'three-canvas',
    textureDir: "models/textures/",
    widget: false
  }
  var blueprint3d = new BP3D.Blueprint3d(opts);

  var modalEffects = new ModalEffects(blueprint3d);
  var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
  var contextMenu = new ContextMenu(blueprint3d);
  var sideMenu = new SideMenu(blueprint3d, viewerFloorplanner, modalEffects);
  var textureSelector = new TextureSelector(blueprint3d, sideMenu);        
  var cameraButtons = new CameraButtons(blueprint3d);
  mainControls(blueprint3d);

  // This serialization format needs work
  // Load a simple rectangle room
  blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');

  // Global variables
  var colorSchemeManager = null;
  var designManager = null;
  var selectedItem = null;

  // Function to update material properties
  function updateMaterial(material, properties) {
    console.log("Updating material with properties:", properties);
    if (material) {
        if (material.materials && Array.isArray(material.materials)) {
            // Handle multi-material case
            material.materials.forEach(function(subMaterial) {
                for (var prop in properties) {
                    if (prop === 'color') {
                        subMaterial.color.set(properties[prop]);
                    } else {
                        subMaterial[prop] = properties[prop];
                    }
                }
                subMaterial.needsUpdate = true;
            });
        } else {
            // Handle regular materials
            for (var prop in properties) {
                if (prop === 'color') {
                    material.color.set(properties[prop]);
                } else {
                    material[prop] = properties[prop];
                }
            }
            material.needsUpdate = true;
        }
        console.log("Material updated:", material);
    } else {
        console.log("No material found to update");
    }
  }

  // Update the control handlers
  function setupItemControls() {
    // Size controls
    $('#item-width, #item-depth, #item-height').on('change', function() {
        if (selectedItem && selectedItem.resize) {
            var width = parseFloat($('#item-width').val());
            var depth = parseFloat($('#item-depth').val());
            var height = parseFloat($('#item-height').val());
            selectedItem.resize(width, depth, height);
        }
    });

    // Shading controls
    $('#shade-intensity').on('input', function() {
        console.log("Shade intensity changed:", $(this).val());
        if (selectedItem && selectedItem.material) {
            var intensity = $(this).val() / 100;
            var material = selectedItem.material;
            console.log("Current material:", material);
            if (material.materials && Array.isArray(material.materials)) {
                material.materials.forEach(function(subMaterial) {
                    if (subMaterial.shininess !== undefined) {
                        subMaterial.shininess = intensity * 100;
                        subMaterial.needsUpdate = true;
                    }
                });
            } else if (material.shininess !== undefined) {
                updateMaterial(material, {
                    shininess: intensity * 100
                });
            }
        } else {
            console.log("No selected item or material found");
        }
    });

    // Color controls
    $('#item-color').on('input', function() {
        console.log("Color changed:", $(this).val());
        if (selectedItem && selectedItem.material) {
            var material = selectedItem.material;
            console.log("Current material:", material);
            updateMaterial(material, {
                color: new THREE.Color($(this).val())
            });
        } else {
            console.log("No selected item or material found");
        }
    });

    $('#item-opacity').on('input', function() {
        console.log("Opacity changed:", $(this).val());
        if (selectedItem && selectedItem.material) {
            var opacity = $(this).val() / 100;
            var material = selectedItem.material;
            console.log("Current material:", material);
            updateMaterial(material, {
                opacity: opacity,
                transparent: opacity < 1
            });
        } else {
            console.log("No selected item or material found");
        }
    });

    $('#item-shininess').on('input', function() {
        console.log("Shininess changed:", $(this).val());
        if (selectedItem && selectedItem.material) {
            var shininess = parseFloat($(this).val());
            var material = selectedItem.material;
            console.log("Current material:", material);
            if (material.materials && Array.isArray(material.materials)) {
                material.materials.forEach(function(subMaterial) {
                    if (subMaterial.shininess !== undefined) {
                        subMaterial.shininess = shininess;
                        subMaterial.needsUpdate = true;
                    } else if (subMaterial.roughness !== undefined) {
                        subMaterial.roughness = 1 - (shininess / 100);
                        subMaterial.needsUpdate = true;
                    }
                });
            } else if (material.shininess !== undefined) {
                updateMaterial(material, {
                    shininess: shininess
                });
            } else if (material.roughness !== undefined) {
                updateMaterial(material, {
                    roughness: 1 - (shininess / 100)
                });
            }
        } else {
            console.log("No selected item or material found");
        }
    });
  }

  // Update the item selection handler
  function onItemSelected(item) {
    console.log("Item selected:", item);
    selectedItem = item;
    
    if (item && item.material) {
        console.log("Item material:", item.material);
        
        // Update size controls
        if (item.getWidth && item.getDepth && item.getHeight) {
            $('#item-width').val(item.getWidth());
            $('#item-depth').val(item.getDepth());
            $('#item-height').val(item.getHeight());
        }
        
        // Update shading controls
        $('#shade-intensity').val(50); // Default value
        
        // Update color controls
        var material = item.material;
        if (material.materials && Array.isArray(material.materials) && material.materials.length > 0) {
            // Use the first material's properties for the controls
            var firstMaterial = material.materials[0];
            $('#item-color').val('#' + firstMaterial.color.getHexString());
            $('#item-opacity').val(firstMaterial.opacity * 100);
            
            if (firstMaterial.shininess !== undefined) {
                $('#item-shininess').val(firstMaterial.shininess);
            } else if (firstMaterial.roughness !== undefined) {
                $('#item-shininess').val((1 - firstMaterial.roughness) * 100);
            } else {
                $('#item-shininess').val(30);
            }
        } else {
            $('#item-color').val('#' + material.color.getHexString());
            $('#item-opacity').val(material.opacity * 100);
            
            if (material.shininess !== undefined) {
                $('#item-shininess').val(material.shininess);
            } else if (material.roughness !== undefined) {
                $('#item-shininess').val((1 - material.roughness) * 100);
            } else {
                $('#item-shininess').val(30);
            }
        }
    } else {
        console.log("No item material found");
    }
  }

  // Initialize controls when the document is ready
  console.log("Initializing controls");
  setupItemControls();
  
  // Add event listeners for item selection
  blueprint3d.three.itemSelectedCallbacks.add(onItemSelected);

  // Initialize color scheme and design management
  colorSchemeManager = BP3D.Core.ColorSchemeManager.getInstance();
  designManager = BP3D.Core.DesignManager.getInstance();

  // Create a namespace for our functionality
  window.BlueprintUI = {
    colorSchemeManager: null,
    designManager: null,
    selectedItem: null,
    blueprint3d: null,
    scope: null,
    initialized: false,
    roomColorSchemes: new Map(), // Store room-specific color schemes

    init: function(blueprint3d, scope) {
        if (this.initialized) return;
        
        this.blueprint3d = blueprint3d;
        this.scope = scope;
        
        // Initialize managers
        this.colorSchemeManager = BP3D.Core.ColorSchemeManager.getInstance();
        this.designManager = BP3D.Core.DesignManager.getInstance();

        // Set up room color scheme handlers
        this.setupRoomColorSchemeHandlers();

        // Set up item selection handler
        this.blueprint3d.three.itemSelectedCallbacks.add((item) => {
            this.selectedItem = item;
            if (item && item.material) {
                console.log("Item selected:", item);
                // Update color controls with item's current color
                const material = item.material;
                if (material.materials && Array.isArray(material.materials) && material.materials.length > 0) {
                    const firstMaterial = material.materials[0];
                    $('#item-color').val('#' + firstMaterial.color.getHexString());
                    $('#item-opacity').val(firstMaterial.opacity * 100);
                    $('#item-shininess').val(firstMaterial.shininess || 30);
                } else {
                    $('#item-color').val('#' + material.color.getHexString());
                    $('#item-opacity').val(material.opacity * 100);
                    $('#item-shininess').val(material.shininess || 30);
                }
            }
        });

        // Initialize features
        this.initializeColorSchemeManagement();
        this.initializeDesignManagement();
        this.initialized = true;
    },

    setupRoomColorSchemeHandlers: function() {
        const self = this;

        // Handle room selection - only add callback if it exists
        if (this.blueprint3d.three && this.blueprint3d.three.roomClickedCallbacks) {
            this.blueprint3d.three.roomClickedCallbacks.add(function(room) {
                self.updateRoomColorControls(room);
            });
        }

        // Add room scheme button handler
        $('#add-room-scheme').click(function() {
            const room = self.selectedItem;
            if (room && room.isRoom) {
                const wallColor = $('#wall-color').val();
                const floorColor = $('#floor-color').val();
                const ceilingColor = $('#ceiling-color').val();
                
                self.roomColorSchemes.set(room.id, {
                    wallColor: wallColor,
                    floorColor: floorColor,
                    ceilingColor: ceilingColor
                });
                
                self.updateRoomColorSchemeList();
            }
        });

        // Apply colors button handler
        $('#apply-colors').click(function() {
            const room = self.selectedItem;
            if (room && room.isRoom) {
                const wallColor = $('#wall-color').val();
                const floorColor = $('#floor-color').val();
                const ceilingColor = $('#ceiling-color').val();
                
                self.applyRoomColors(room, wallColor, floorColor, ceilingColor);
            }
        });
    },

    updateRoomColorControls: function(room) {
        if (room && room.isRoom) {
            const scheme = this.roomColorSchemes.get(room.id);
            if (scheme) {
                $('#wall-color').val(scheme.wallColor);
                $('#floor-color').val(scheme.floorColor);
                $('#ceiling-color').val(scheme.ceilingColor);
            }
        }
    },

    updateRoomColorSchemeList: function() {
        const $schemeList = $('#room-color-schemes');
        $schemeList.empty();
        
        this.roomColorSchemes.forEach((scheme, roomId) => {
            const room = this.blueprint3d.model.scene.getRoomById(roomId);
            if (room) {
                const $scheme = $('<div class="room-scheme-item"></div>');
                $scheme.append(`<h5>Room ${roomId}</h5>`);
                $scheme.append(`<div class="color-swatch" style="background-color: ${scheme.wallColor}"></div>`);
                $scheme.append(`<div class="color-swatch" style="background-color: ${scheme.floorColor}"></div>`);
                $scheme.append(`<div class="color-swatch" style="background-color: ${scheme.ceilingColor}"></div>`);
                $scheme.append(`<button class="apply-scheme" data-room-id="${roomId}">Apply</button>`);
                $schemeList.append($scheme);
            }
        });
    },

    applyRoomColors: function(room, wallColor, floorColor, ceilingColor) {
        if (!room || !room.isRoom) return;

        // Convert hex colors to THREE.Color objects
        const wallColorObj = new THREE.Color(wallColor);
        const floorColorObj = new THREE.Color(floorColor);
        const ceilingColorObj = new THREE.Color(ceilingColor);

        // Apply wall colors
        if (room.walls) {
            room.walls.forEach(wall => {
                if (wall.frontTexture) {
                    wall.frontTexture.color = wallColorObj;
                    if (wall.frontTexture.material) {
                        if (!(wall.frontTexture.material instanceof THREE.MeshPhongMaterial)) {
                            wall.frontTexture.material = new THREE.MeshPhongMaterial({
                                color: wallColorObj,
                                side: THREE.DoubleSide,
                                specular: new THREE.Color(0x0a0a0a),
                                shininess: 30
                            });
                        } else {
                            wall.frontTexture.material.color = wallColorObj;
                            wall.frontTexture.material.colorAmbient = wallColorObj;
                            wall.frontTexture.material.colorDiffuse = wallColorObj;
                            wall.frontTexture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                        }
                        wall.frontTexture.material.needsUpdate = true;
                    }
                }
                if (wall.backTexture) {
                    wall.backTexture.color = wallColorObj;
                    if (wall.backTexture.material) {
                        if (!(wall.backTexture.material instanceof THREE.MeshPhongMaterial)) {
                            wall.backTexture.material = new THREE.MeshPhongMaterial({
                                color: wallColorObj,
                                side: THREE.DoubleSide,
                                specular: new THREE.Color(0x0a0a0a),
                                shininess: 30
                            });
                        } else {
                            wall.backTexture.material.color = wallColorObj;
                            wall.backTexture.material.colorAmbient = wallColorObj;
                            wall.backTexture.material.colorDiffuse = wallColorObj;
                            wall.backTexture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                        }
                        wall.backTexture.material.needsUpdate = true;
                    }
                }
            });
        }

        // Apply floor color
        if (room.floor && room.floor.texture) {
            room.floor.texture.color = floorColorObj;
            if (room.floor.texture.material) {
                if (!(room.floor.texture.material instanceof THREE.MeshPhongMaterial)) {
                    room.floor.texture.material = new THREE.MeshPhongMaterial({
                        color: floorColorObj,
                        side: THREE.DoubleSide,
                        specular: new THREE.Color(0x0a0a0a),
                        shininess: 30
                    });
                } else {
                    room.floor.texture.material.color = floorColorObj;
                    room.floor.texture.material.colorAmbient = floorColorObj;
                    room.floor.texture.material.colorDiffuse = floorColorObj;
                    room.floor.texture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                }
                room.floor.texture.material.needsUpdate = true;
            }
        }

        // Apply ceiling color
        if (room.ceiling && room.ceiling.texture) {
            room.ceiling.texture.color = ceilingColorObj;
            if (room.ceiling.texture.material) {
                if (!(room.ceiling.texture.material instanceof THREE.MeshPhongMaterial)) {
                    room.ceiling.texture.material = new THREE.MeshPhongMaterial({
                        color: ceilingColorObj,
                        side: THREE.DoubleSide,
                        specular: new THREE.Color(0x0a0a0a),
                        shininess: 30
                    });
                } else {
                    room.ceiling.texture.material.color = ceilingColorObj;
                    room.ceiling.texture.material.colorAmbient = ceilingColorObj;
                    room.ceiling.texture.material.colorDiffuse = ceilingColorObj;
                    room.ceiling.texture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                }
                room.ceiling.texture.material.needsUpdate = true;
            }
        }

        // Update the room
        room.update();

        // Trigger scene update
        this.blueprint3d.model.scene.needsUpdate = true;
        this.blueprint3d.three.needsUpdate();

        // Store the color scheme
        this.roomColorSchemes.set(room.id, {
            wallColor: wallColor,
            floorColor: floorColor,
            ceilingColor: ceilingColor
        });

        this.updateRoomColorSchemeList();
    },

    initializeColorSchemeManagement: function() {
        console.log("Initializing color scheme management");
        
        // Check for required elements
        const wallColorInput = document.getElementById('wall-color');
        const floorColorInput = document.getElementById('floor-color');
        const ceilingColorInput = document.getElementById('ceiling-color');
        const applyColorsBtn = document.getElementById('apply-colors');
        const createPaletteBtn = document.getElementById('create-palette');
        const addRoomSchemeBtn = document.getElementById('add-room-scheme');

        if (!wallColorInput || !floorColorInput || !ceilingColorInput || 
            !applyColorsBtn || !createPaletteBtn || !addRoomSchemeBtn) {
            console.warn("Some color scheme elements not found, but continuing with available elements");
        }

        // Initialize room color controls
        this.initializeRoomColorControls();

        // Set up event handlers for available elements
        if (applyColorsBtn) {
            $(applyColorsBtn).off('click').on('click', () => {
                const room = this.selectedItem;
                if (room && room.isRoom) {
                    const wallColor = wallColorInput ? wallColorInput.value : '#ffffff';
                    const floorColor = floorColorInput ? floorColorInput.value : '#ffffff';
                    const ceilingColor = ceilingColorInput ? ceilingColorInput.value : '#ffffff';
                    this.applyRoomColors(room, wallColor, floorColor, ceilingColor);
                }
            });
        }

        if (createPaletteBtn) {
            $(createPaletteBtn).off('click').on('click', () => {
                this.showCustomPaletteModal();
            });
        }

        if (addRoomSchemeBtn) {
            $(addRoomSchemeBtn).off('click').on('click', () => {
                const room = this.selectedItem;
                if (room && room.isRoom) {
                    const wallColor = wallColorInput ? wallColorInput.value : '#ffffff';
                    const floorColor = floorColorInput ? floorColorInput.value : '#ffffff';
                    const ceilingColor = ceilingColorInput ? ceilingColorInput.value : '#ffffff';
                    
                    this.roomColorSchemes.set(room.id, {
                        wallColor: wallColor,
                        floorColor: floorColor,
                        ceilingColor: ceilingColor
                    });
                    
                    this.updateRoomColorSchemeList();
                }
            });
        }
    },

    initializeRoomColorControls: function() {
        console.log('Initializing room color controls');
        
        if (!this.blueprint3d || !this.blueprint3d.three) {
            console.warn('Blueprint3D not initialized');
            return;
        }

        // Add wall selection handling using the correct event system
        if (this.blueprint3d.three.wallClicked) {
            console.log('Setting up wall selection handler');
            this.blueprint3d.three.wallClicked.add(function(wallEdge) {
                console.log('Wall clicked:', wallEdge);
                
                if (wallEdge && wallEdge.wall) {
                    console.log('Wall selected - Wall object:', wallEdge.wall);
                    selectedWall = wallEdge.wall;
                    
                    // Create materials if they don't exist
                    if (wallEdge.wall.frontTexture && !wallEdge.wall.frontTexture.material) {
                        wallEdge.wall.frontTexture.material = new THREE.MeshPhongMaterial({
                            color: new THREE.Color(0xffffff),
                            side: THREE.DoubleSide,
                            specular: new THREE.Color(0x0a0a0a),
                            shininess: 30
                        });
                    }
                    
                    if (wallEdge.wall.backTexture && !wallEdge.wall.backTexture.material) {
                        wallEdge.wall.backTexture.material = new THREE.MeshPhongMaterial({
                            color: new THREE.Color(0xffffff),
                            side: THREE.DoubleSide,
                            specular: new THREE.Color(0x0a0a0a),
                            shininess: 30
                        });
                    }
                    
                    // Update wall color controls with current wall values
                    if (wallEdge.wall.frontTexture && wallEdge.wall.frontTexture.material) {
                        const material = wallEdge.wall.frontTexture.material;
                        console.log('Front texture material:', material);
                        
                        console.log('Current material properties:', {
                            color: material.color,
                            opacity: material.opacity,
                            shininess: material.shininess
                        });
                        
                        $('#wall-color-control').val('#' + material.color.getHexString());
                        $('#wall-opacity-control').val(material.opacity * 100);
                        $('#wall-shininess-control').val(material.shininess || 30);
                    }
                } else {
                    console.log('Selected item is not a wall:', wallEdge);
                    selectedWall = null;
                }
            });
        } else {
            console.warn('wallClicked not available');
        }

        // Add event handlers for wall color controls
        $('#wall-color-control').on('change', function() {
            try {
                console.log('Wall color changed:', this.value);
                const color = new THREE.Color(this.value);
                const opacity = $('#wall-opacity-control').val() / 100;
                const shininess = $('#wall-shininess-control').val();
                
                console.log('Selected wall:', selectedWall);
                
                if (selectedWall) {
                    console.log('Updating wall color:', color);
                    
                    // Debug: Log current wall state
                    console.log('Wall state before update:', {
                        frontTexture: selectedWall.frontTexture,
                        backTexture: selectedWall.backTexture,
                        backEdge: selectedWall.backEdge,
                        plane: selectedWall.backEdge ? selectedWall.backEdge.plane : null
                    });
                    
                    // Create a new material with the updated properties
                    const newMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        side: THREE.DoubleSide,
                        transparent: opacity < 1,
                        opacity: opacity,
                        map: selectedWall.frontTexture ? selectedWall.frontTexture.material.map : null
                    });
                    
                    // Debug: Log new material
                    console.log('New material created:', newMaterial);
                    
                    // Update front texture material
                    if (selectedWall.frontTexture) {
                        console.log('Updating front texture material');
                        selectedWall.frontTexture.color = color;
                        if (selectedWall.frontTexture.material) {
                          if (!(selectedWall.frontTexture.material instanceof THREE.MeshPhongMaterial)) {
                            selectedWall.frontTexture.material = new THREE.MeshPhongMaterial({
                              color: color,
                              side: THREE.DoubleSide,
                              specular: new THREE.Color(0x0a0a0a),
                              shininess: shininess
                            });
                          } else {
                            selectedWall.frontTexture.material.color = color;
                            selectedWall.frontTexture.material.colorAmbient = color;
                            selectedWall.frontTexture.material.colorDiffuse = color;
                            selectedWall.frontTexture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                          }
                          selectedWall.frontTexture.material.needsUpdate = true;
                        }
                    }
                    
                    // Update back texture material
                    if (selectedWall.backTexture) {
                        console.log('Updating back texture material');
                        selectedWall.backTexture.color = color;
                        if (selectedWall.backTexture.material) {
                          if (!(selectedWall.backTexture.material instanceof THREE.MeshPhongMaterial)) {
                            selectedWall.backTexture.material = new THREE.MeshPhongMaterial({
                              color: color,
                              side: THREE.DoubleSide,
                              specular: new THREE.Color(0x0a0a0a),
                              shininess: shininess
                            });
                          } else {
                            selectedWall.backTexture.material.color = color;
                            selectedWall.backTexture.material.colorAmbient = color;
                            selectedWall.backTexture.material.colorDiffuse = color;
                            selectedWall.backTexture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                          }
                          selectedWall.backTexture.material.needsUpdate = true;
                        }
                    }
                    
                    // Update wall mesh materials
                    if (selectedWall.backEdge && selectedWall.backEdge.plane) {
                        console.log('Updating wall mesh material');
                        const plane = selectedWall.backEdge.plane;
                        
                        if (!(plane.material instanceof THREE.MeshPhongMaterial)) {
                          plane.material = new THREE.MeshPhongMaterial({
                            color: color,
                            side: THREE.DoubleSide,
                            specular: new THREE.Color(0x0a0a0a),
                            shininess: shininess
                          });
                        } else {
                          plane.material.color = color;
                          plane.material.colorAmbient = color;
                          plane.material.colorDiffuse = color;
                          plane.material.colorSpecular = new THREE.Color(0x0a0a0a);
                        }
                        plane.material.needsUpdate = true;
                        
                        // Force geometry update
                        if (plane.geometry) {
                          plane.geometry.computeBoundingBox();
                          plane.geometry.computeBoundingSphere();
                          plane.geometry.verticesNeedUpdate = true;
                          plane.geometry.normalsNeedUpdate = true;
                          plane.geometry.elementsNeedUpdate = true;
                        }
                        
                        plane.updateMatrix();
                        plane.updateMatrixWorld(true);
                    }
                    
                    // Force scene update
                    if (self.blueprint3d && self.blueprint3d.three) {
                        self.blueprint3d.three.needsUpdate();
                        self.blueprint3d.three.render();
                    }
                } else {
                    console.warn('No wall selected');
                }
            } catch (error) {
                console.error('Error updating wall color:', error);
                console.error('Error stack:', error.stack);
            }
        });

        // Add click handler for apply button
        $('#apply-wall-color').on('click', function() {
            try {
                console.log('Apply wall color clicked');
                const color = new THREE.Color($('#wall-color-control').val());
                const opacity = $('#wall-opacity-control').val() / 100;
                const shininess = $('#wall-shininess-control').val();
                
                console.log('Selected wall:', selectedWall);
                
                if (selectedWall) {
                    console.log('Applying wall color changes');
                    
                    // Debug: Log current wall state
                    console.log('Wall state before update:', {
                        frontTexture: selectedWall.frontTexture,
                        backTexture: selectedWall.backTexture,
                        backEdge: selectedWall.backEdge,
                        plane: selectedWall.backEdge ? selectedWall.backEdge.plane : null
                    });
                    
                    // Create a new material with the updated properties
                    const newMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        side: THREE.DoubleSide,
                        transparent: opacity < 1,
                        opacity: opacity,
                        map: selectedWall.frontTexture ? selectedWall.frontTexture.material.map : null
                    });
                    
                    // Debug: Log new material
                    console.log('New material created:', newMaterial);
                    
                    // Update front texture material
                    if (selectedWall.frontTexture) {
                        console.log('Updating front texture material');
                        selectedWall.frontTexture.color = color;
                        if (selectedWall.frontTexture.material) {
                          if (!(selectedWall.frontTexture.material instanceof THREE.MeshPhongMaterial)) {
                            selectedWall.frontTexture.material = new THREE.MeshPhongMaterial({
                              color: color,
                              side: THREE.DoubleSide,
                              specular: new THREE.Color(0x0a0a0a),
                              shininess: shininess
                            });
                          } else {
                            selectedWall.frontTexture.material.color = color;
                            selectedWall.frontTexture.material.colorAmbient = color;
                            selectedWall.frontTexture.material.colorDiffuse = color;
                            selectedWall.frontTexture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                          }
                          selectedWall.frontTexture.material.needsUpdate = true;
                        }
                    }
                    
                    // Update back texture material
                    if (selectedWall.backTexture) {
                        console.log('Updating back texture material');
                        selectedWall.backTexture.color = color;
                        if (selectedWall.backTexture.material) {
                          if (!(selectedWall.backTexture.material instanceof THREE.MeshPhongMaterial)) {
                            selectedWall.backTexture.material = new THREE.MeshPhongMaterial({
                              color: color,
                              side: THREE.DoubleSide,
                              specular: new THREE.Color(0x0a0a0a),
                              shininess: shininess
                            });
                          } else {
                            selectedWall.backTexture.material.color = color;
                            selectedWall.backTexture.material.colorAmbient = color;
                            selectedWall.backTexture.material.colorDiffuse = color;
                            selectedWall.backTexture.material.colorSpecular = new THREE.Color(0x0a0a0a);
                          }
                          selectedWall.backTexture.material.needsUpdate = true;
                        }
                    }
                    
                    // Update wall mesh materials
                    if (selectedWall.backEdge && selectedWall.backEdge.plane) {
                        console.log('Updating wall mesh material');
                        const plane = selectedWall.backEdge.plane;
                        
                        if (!(plane.material instanceof THREE.MeshPhongMaterial)) {
                          plane.material = new THREE.MeshPhongMaterial({
                            color: color,
                            side: THREE.DoubleSide,
                            specular: new THREE.Color(0x0a0a0a),
                            shininess: shininess
                          });
                        } else {
                          plane.material.color = color;
                          plane.material.colorAmbient = color;
                          plane.material.colorDiffuse = color;
                          plane.material.colorSpecular = new THREE.Color(0x0a0a0a);
                        }
                        plane.material.needsUpdate = true;
                        
                        // Force geometry update
                        if (plane.geometry) {
                          plane.geometry.computeBoundingBox();
                          plane.geometry.computeBoundingSphere();
                          plane.geometry.verticesNeedUpdate = true;
                          plane.geometry.normalsNeedUpdate = true;
                          plane.geometry.elementsNeedUpdate = true;
                        }
                        
                        plane.updateMatrix();
                        plane.updateMatrixWorld(true);
                    }
                    
                    // Force scene update
                    if (self.blueprint3d && self.blueprint3d.three) {
                        self.blueprint3d.three.needsUpdate();
                        self.blueprint3d.three.render();
                    }
                } else {
                    console.warn('No wall selected');
                }
            } catch (error) {
                console.error('Error applying wall color:', error);
                console.error('Error stack:', error.stack);
            }
        });
    },

    hexToRgb: function(hex) {
        // Remove the # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        
        return { r, g, b };
    },

    rgbToHex: function(rgb) {
        const r = Math.round(rgb.r * 255).toString(16).padStart(2, '0');
        const g = Math.round(rgb.g * 255).toString(16).padStart(2, '0');
        const b = Math.round(rgb.b * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    },

    updateColorPalettePreview: function(palette) {
        console.log("Updating color palette preview:", palette);
        const colorPalettePreview = document.getElementById('colorPalettePreview');
        colorPalettePreview.innerHTML = '';

        palette.colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.addEventListener('click', () => {
                console.log("Color swatch clicked:", color);
                this.applyColorToSelection(color);
            });
            colorPalettePreview.appendChild(swatch);
        });
    },

    applyColorToSelection: function(color) {
        console.log("Applying color to selection:", color);
        if (this.selectedItem && this.selectedItem.material) {
            const material = this.selectedItem.material;
            if (material.materials && Array.isArray(material.materials)) {
                material.materials.forEach(subMaterial => {
                    subMaterial.color.set(color);
                    subMaterial.needsUpdate = true;
                });
            } else {
                material.color.set(color);
                material.needsUpdate = true;
            }
            // Update the color input to match
            $('#item-color').val(color);
            console.log("Color applied successfully");
        } else {
            console.log("No item selected or item has no material");
        }
    },

    showCustomPaletteModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create Custom Palette</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Palette Name</label>
                            <input type="text" class="form-control" id="paletteName">
                        </div>
                        <div class="form-group">
                            <label>Colors</label>
                            <div id="colorPicker"></div>
                            <button class="btn btn-secondary" id="addColor">Add Color</button>
                        </div>
                        <div id="selectedColors" class="selected-colors"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="savePalette">Save Palette</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        $(modal).modal('show');

        const selectedColors = [];
        const colorPicker = document.getElementById('colorPicker');
        const addColorBtn = document.getElementById('addColor');
        const savePaletteBtn = document.getElementById('savePalette');

        addColorBtn.addEventListener('click', () => {
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'form-control';
            colorInput.style.marginTop = '10px';
            colorPicker.appendChild(colorInput);
        });

        savePaletteBtn.addEventListener('click', () => {
            const paletteName = document.getElementById('paletteName').value;
            const colors = Array.from(colorPicker.querySelectorAll('input[type="color"]'))
                .map(input => input.value);

            if (paletteName && colors.length > 0) {
                this.colorSchemeManager.createPalette(paletteName, colors);
                $(modal).modal('hide');
                modal.remove();
                this.initializeColorSchemeManagement(); // Refresh the palette list
            }
        });
    },

    initializeDesignManagement: function() {
        const saveCurrentDesignBtn = document.getElementById('saveCurrentDesign');
        const loadDesignBtn = document.getElementById('loadDesign');
        const exportDesignBtn = document.getElementById('exportDesign');
        const importDesignBtn = document.getElementById('importDesign');
        const designList = document.getElementById('designList');

        // Save current design
        saveCurrentDesignBtn.addEventListener('click', () => {
            const name = prompt('Enter design name:');
            if (name) {
                const description = prompt('Enter design description:');
                const currentPalette = this.colorSchemeManager.getCurrentPalette();
                const design = this.designManager.createDesign(
                    name,
                    description,
                    this.blueprint3d.model.floorplan,
                    this.blueprint3d.model.scene.items,
                    currentPalette ? currentPalette.name : ''
                );
                this.updateDesignList();
            }
        });

        // Load design
        loadDesignBtn.addEventListener('click', () => {
            this.showDesignSelectionModal();
        });

        // Export design
        exportDesignBtn.addEventListener('click', () => {
            const currentDesign = this.designManager.getCurrentDesign();
            if (currentDesign) {
                const designData = this.designManager.exportDesign(currentDesign.id);
                // Create download link
                const blob = new Blob([designData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${currentDesign.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        });

        // Import design
        importDesignBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const design = this.designManager.importDesign(event.target.result);
                    if (design) {
                        this.updateDesignList();
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        this.updateDesignList();
    },

    updateDesignList: function() {
        const designList = document.getElementById('designList');
        designList.innerHTML = '';

        const designs = this.designManager.getAllDesigns();
        designs.forEach(design => {
            const designItem = document.createElement('div');
            designItem.className = 'design-item';
            designItem.innerHTML = `
                <img src="${design.thumbnail}" class="design-thumbnail">
                <div class="design-info">
                    <div class="design-name">${design.name}</div>
                    <div class="design-date">${new Date(design.lastModified).toLocaleDateString()}</div>
                </div>
                <div class="design-actions">
                    <button class="btn btn-sm btn-primary load-design" data-id="${design.id}">Load</button>
                    <button class="btn btn-sm btn-danger delete-design" data-id="${design.id}">Delete</button>
                </div>
            `;
            designList.appendChild(designItem);
        });

        // Add event listeners
        document.querySelectorAll('.load-design').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const designId = e.target.dataset.id;
                this.loadDesign(designId);
            });
        });

        document.querySelectorAll('.delete-design').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const designId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this design?')) {
                    this.designManager.deleteDesign(designId);
                    this.updateDesignList();
                }
            });
        });
    },

    loadDesign: function(designId) {
        const design = this.designManager.getDesign(designId);
        if (design) {
            this.designManager.setCurrentDesign(designId);
            this.blueprint3d.model.loadSerialized(design.floorplan);
            // Load items
            design.items.forEach(item => {
                this.blueprint3d.model.scene.addItem(
                    item.itemType,
                    item.modelUrl,
                    item.metadata,
                    new THREE.Vector3(item.xpos, item.ypos, item.zpos),
                    item.rotation,
                    new THREE.Vector3(item.scale_x, item.scale_y, item.scale_z),
                    item.fixed
                );
            });
            // Set color scheme
            if (design.colorScheme) {
                this.colorSchemeManager.setCurrentPalette(design.colorScheme);
            }
        }
    },

    showDesignSelectionModal: function() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Select Design</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="designSelectionList"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        $(modal).modal('show');

        const designSelectionList = document.getElementById('designSelectionList');
        const designs = this.designManager.getAllDesigns();
        
        designs.forEach(design => {
            const designItem = document.createElement('div');
            designItem.className = 'design-item';
            designItem.innerHTML = `
                <div class="design-info">
                    <div class="design-name">${design.name}</div>
                    <div class="design-date">${new Date(design.lastModified).toLocaleDateString()}</div>
                </div>
                <button class="btn btn-primary load-design" data-id="${design.id}">Load</button>
            `;
            designSelectionList.appendChild(designItem);
        });

        // Add event listeners
        document.querySelectorAll('.load-design').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const designId = e.target.dataset.id;
                this.loadDesign(designId);
                $(modal).modal('hide');
                modal.remove();
            });
        });
    }
  };

  // Initialize everything when the document is ready
  BlueprintUI.init(blueprint3d, sideMenu);
});

var selectedWall = null;
var floor = null;

// Initialize room color controls
function initRoomColorControls() {
  // ... existing code ...
}
