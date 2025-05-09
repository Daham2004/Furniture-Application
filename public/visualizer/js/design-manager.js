// Design management system
class DesignManager {
    constructor() {
        this.designs = JSON.parse(localStorage.getItem('savedDesigns')) || [];
    }

    saveDesign(design) {
        const newDesign = {
            id: Date.now(),
            name: design.name || 'Untitled Design',
            date: new Date().toISOString(),
            data: design.data,
            roomSize: design.roomSize,
            colorScheme: design.colorScheme,
            designer: auth.getCurrentUser().username
        };

        this.designs.push(newDesign);
        this.persistDesigns();
        return newDesign;
    }

    updateDesign(id, updates) {
        const index = this.designs.findIndex(d => d.id === id);
        if (index !== -1) {
            this.designs[index] = { ...this.designs[index], ...updates };
            this.persistDesigns();
            return true;
        }
        return false;
    }

    deleteDesign(id) {
        const index = this.designs.findIndex(d => d.id === id);
        if (index !== -1) {
            this.designs.splice(index, 1);
            this.persistDesigns();
            return true;
        }
        return false;
    }

    getDesign(id) {
        return this.designs.find(d => d.id === id);
    }

    getAllDesigns() {
        return this.designs;
    }

    persistDesigns() {
        localStorage.setItem('savedDesigns', JSON.stringify(this.designs));
    }
}

// Initialize design manager
const designManager = new DesignManager();

// Design management UI
// (Removed Saved Designs UI and all related event handlers) 