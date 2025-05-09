// Color management system
class ColorManager {
    constructor(blueprint3d) {
        this.blueprint3d = blueprint3d;
        this.currentColors = {
            wall: '#ffffff',
            floor: '#f5f5f5',
            item: '#e0e0e0'
        };
        
        this.colorPresets = {
            wall: [
                '#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0',
                '#ffebee', '#e8f5e9', '#e3f2fd', '#fff3e0'
            ],
            floor: [
                '#f5f5f5', '#e0e0e0', '#d0d0d0', '#c0c0c0',
                '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63'
            ],
            item: [
                '#e0e0e0', '#d0d0d0', '#c0c0c0', '#b0b0b0',
                '#ffcdd2', '#c8e6c9', '#bbdefb', '#ffe0b2'
            ]
        };
    }

    init() {
        this.addColorControls();
        this.bindEvents();
    }

    addColorControls() {
        const colorControls = `
            <div class="color-controls">
                <h4>Color Customization</h4>
                
                <div class="color-picker-group">
                    <h5>Wall Color</h5>
                    <input type="color" class="color-picker" id="wall-color" value="${this.currentColors.wall}">
                    <div class="color-presets" id="wall-presets"></div>
                </div>

                <div class="color-picker-group">
                    <h5>Floor Color</h5>
                    <input type="color" class="color-picker" id="floor-color" value="${this.currentColors.floor}">
                    <div class="color-presets" id="floor-presets"></div>
                </div>

                <div class="color-picker-group">
                    <h5>Item Color</h5>
                    <input type="color" class="color-picker" id="item-color" value="${this.currentColors.item}">
                    <div class="color-presets" id="item-presets"></div>
                </div>

                <div class="color-actions">
                    <button class="btn btn-sm btn-primary" id="apply-colors">Apply Colors</button>
                    <button class="btn btn-sm btn-default" id="reset-colors">Reset Colors</button>
                </div>
            </div>
        `;

        // Add color controls to the very top of the sidebar
        $('.sidebar').prepend(colorControls);
        this.addColorPresets();
    }

    addColorPresets() {
        // Add wall color presets
        this.colorPresets.wall.forEach(color => {
            $('#wall-presets').append(`
                <div class="color-preset" style="background-color: ${color}" data-color="${color}"></div>
            `);
        });

        // Add floor color presets
        this.colorPresets.floor.forEach(color => {
            $('#floor-presets').append(`
                <div class="color-preset" style="background-color: ${color}" data-color="${color}"></div>
            `);
        });

        // Add item color presets
        this.colorPresets.item.forEach(color => {
            $('#item-presets').append(`
                <div class="color-preset" style="background-color: ${color}" data-color="${color}"></div>
            `);
        });
    }

    bindEvents() {
        // Wall color picker
        $('#wall-color').on('change', (e) => {
            this.currentColors.wall = e.target.value;
        });

        // Floor color picker
        $('#floor-color').on('change', (e) => {
            this.currentColors.floor = e.target.value;
        });

        // Item color picker
        $('#item-color').on('change', (e) => {
            this.currentColors.item = e.target.value;
        });

        // Color presets
        $('.color-preset').on('click', (e) => {
            const color = $(e.target).data('color');
            const type = $(e.target).parent().attr('id').split('-')[0];
            this.currentColors[type] = color;
            $(`#${type}-color`).val(color);
        });

        // Apply colors
        $('#apply-colors').on('click', () => {
            this.applyColors();
        });

        // Reset colors
        $('#reset-colors').on('click', () => {
            this.resetColors();
        });
    }

    applyColors() {
        console.log('applyColors called', this.currentColors);

        // Apply wall colors as textures
        this.blueprint3d.model.floorplan.walls.forEach(wall => {
            if (wall) {
                wall.frontTexture = {
                    url: this.createColorTexture(this.currentColors.wall),
                    stretch: true,
                    scale: 1
                };
                wall.backTexture = {
                    url: this.createColorTexture(this.currentColors.wall),
                    stretch: true,
                    scale: 1
                };
            }
        });

        // Apply floor colors as textures
        this.blueprint3d.model.floorplan.rooms.forEach(room => {
            if (room && room.setTexture) {
                room.setTexture(this.createColorTexture(this.currentColors.floor), true, 1);
            }
        });

        // Change color of only the selected item
        const controller = this.blueprint3d.three.getController();
        const selectedItem = controller.selectedObject && controller.selectedObject();
        if (selectedItem && selectedItem.material) {
            if (selectedItem.material.materials) {
                selectedItem.material.materials.forEach(material => {
                    if (material) {
                        material.color.set(this.currentColors.item);
                        material.needsUpdate = true;
                    }
                });
            } else {
                selectedItem.material.color.set(this.currentColors.item);
                selectedItem.material.needsUpdate = true;
            }
        }

        // Update the scene
        this.blueprint3d.model.floorplan.update();
    }

    resetColors() {
        this.currentColors = {
            wall: '#ffffff',
            floor: '#f5f5f5',
            item: '#e0e0e0'
        };

        // Update color pickers
        $('#wall-color').val(this.currentColors.wall);
        $('#floor-color').val(this.currentColors.floor);
        $('#item-color').val(this.currentColors.item);

        // Apply reset colors
        this.applyColors();
    }

    createColorTexture(color) {
        // Create a data URL for a solid color texture
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return canvas.toDataURL();
    }
}

// Initialize color manager when document is ready and blueprint3d is loaded
$(document).ready(function() {
    // Wait for blueprint3d to be initialized
    const checkBlueprint3D = setInterval(() => {
        if (typeof blueprint3d !== 'undefined' && blueprint3d.model) {
            clearInterval(checkBlueprint3D);
            const colorManager = new ColorManager(blueprint3d);
            colorManager.init();
        }
    }, 100);
}); 