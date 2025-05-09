// Authentication system for designers
class AuthSystem {
    constructor() {
        // Always start as authenticated
        this.isAuthenticated = true;
        this.currentUser = {
            username: 'user',
            name: 'User'
        };
    }

    isLoggedIn() {
        return true; // Always return true
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Update UI based on login status
$(document).ready(function() {
    const user = auth.getCurrentUser();
    if (user) {
        // Update user info in the sidebar
        $('.user-info').show();
        $('#user-name').text(user.name);
    }
}); 