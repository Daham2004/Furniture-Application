// Add a flag to track if an item is valid
Item.prototype.isValid = function() {
    return this && !this._isBeingRemoved && this.material;
};

// Disable highlight system
Item.prototype.updateHighlight = function () {
    // Do nothing
    return;
};

Item.prototype.mouseOver = function() {
    // Do nothing
    return;
};

Item.prototype.mouseOff = function() {
    // Do nothing
    return;
};

Item.prototype.setSelected = function() {
    // Do nothing
    return;
};

Item.prototype.setUnselected = function() {
    // Do nothing
    return;
};

// Safe remove function
Item.prototype.remove = function() {
    if (this.scene) {
        this.scene.removeItem(this);
    }
};

// Override the controller's updateMouseover function to be more defensive
function updateMouseover() {
    // If we have an intersected object
    if (intersectedObject != null) {
        // If we already have a mouseover object
        if (mouseoverObject != null) {
            // If it's a different object
            if (mouseoverObject !== intersectedObject) {
                // Only call mouseOff if the object is still valid
                if (mouseoverObject && mouseoverObject.isValid()) {
                    mouseoverObject.mouseOff();
                }
                mouseoverObject = intersectedObject;
                // Only call mouseOver if the object is still valid
                if (mouseoverObject && mouseoverObject.isValid()) {
                    mouseoverObject.mouseOver();
                }
                scope.needsUpdate = true;
            }
            // else do nothing, mouseover already set
        } else {
            mouseoverObject = intersectedObject;
            // Only call mouseOver if the object is still valid
            if (mouseoverObject && mouseoverObject.isValid()) {
                mouseoverObject.mouseOver();
            }
            three.setCursorStyle("pointer");
            scope.needsUpdate = true;
        }
    } else if (mouseoverObject != null) {
        // Only call mouseOff if the object is still valid
        if (mouseoverObject && mouseoverObject.isValid()) {
            mouseoverObject.mouseOff();
        }
        three.setCursorStyle("auto");
        mouseoverObject = null;
        scope.needsUpdate = true;
    }
} 