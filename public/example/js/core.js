// Wait for BP3D to be defined
(function() {
    // Core managers for Blueprint3D
    if (typeof BP3D === 'undefined') {
        BP3D = {};
    }
    if (typeof BP3D.Core === 'undefined') {
        BP3D.Core = {};
    }

    // Color Scheme Manager
    BP3D.Core.ColorSchemeManager = (function() {
        var instance = null;
        var currentPalette = null;
        var palettes = [
            {
                name: "Modern",
                colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161", "#424242"]
            },
            {
                name: "Warm",
                colors: ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFC107", "#FFA000"]
            },
            {
                name: "Cool",
                colors: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3"]
            }
        ];

        function ColorSchemeManager() {
            if (instance) {
                return instance;
            }
            instance = this;
        }

        ColorSchemeManager.prototype.getPalettes = function() {
            return palettes;
        };

        ColorSchemeManager.prototype.getCurrentPalette = function() {
            return currentPalette;
        };

        ColorSchemeManager.prototype.setCurrentPalette = function(paletteName) {
            currentPalette = palettes.find(p => p.name === paletteName);
            return currentPalette;
        };

        ColorSchemeManager.prototype.createPalette = function(name, colors) {
            var newPalette = {
                name: name,
                colors: colors
            };
            palettes.push(newPalette);
            return newPalette;
        };

        ColorSchemeManager.getInstance = function() {
            if (!instance) {
                instance = new ColorSchemeManager();
            }
            return instance;
        };

        return ColorSchemeManager;
    })();

    // Design Manager
    BP3D.Core.DesignManager = (function() {
        var instance = null;
        var designs = [];
        var currentDesign = null;

        function DesignManager() {
            if (instance) {
                return instance;
            }
            instance = this;
        }

        DesignManager.prototype.createDesign = function(name, description, floorplan, items, colorScheme) {
            var design = {
                id: Date.now().toString(),
                name: name,
                description: description,
                floorplan: floorplan,
                items: items,
                colorScheme: colorScheme,
                lastModified: new Date(),
                thumbnail: this.generateThumbnail(floorplan, items)
            };
            designs.push(design);
            return design;
        };

        DesignManager.prototype.getAllDesigns = function() {
            return designs;
        };

        DesignManager.prototype.getDesign = function(id) {
            return designs.find(d => d.id === id);
        };

        DesignManager.prototype.getCurrentDesign = function() {
            return currentDesign;
        };

        DesignManager.prototype.setCurrentDesign = function(id) {
            currentDesign = this.getDesign(id);
            return currentDesign;
        };

        DesignManager.prototype.deleteDesign = function(id) {
            designs = designs.filter(d => d.id !== id);
            if (currentDesign && currentDesign.id === id) {
                currentDesign = null;
            }
        };

        DesignManager.prototype.exportDesign = function(id) {
            var design = this.getDesign(id);
            if (design) {
                return JSON.stringify(design);
            }
            return null;
        };

        DesignManager.prototype.importDesign = function(data) {
            try {
                var design = JSON.parse(data);
                design.id = Date.now().toString();
                design.lastModified = new Date();
                designs.push(design);
                return design;
            } catch (e) {
                console.error("Error importing design:", e);
                return null;
            }
        };

        DesignManager.prototype.generateThumbnail = function(floorplan, items) {
            // This is a placeholder - in a real implementation, you would generate
            // an actual thumbnail image of the design
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
        };

        DesignManager.getInstance = function() {
            if (!instance) {
                instance = new DesignManager();
            }
            return instance;
        };

        return DesignManager;
    })();
})(); 