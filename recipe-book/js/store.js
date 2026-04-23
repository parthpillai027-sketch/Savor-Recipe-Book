export default class Store {
    constructor() {
        this.state = {
            user: JSON.parse(localStorage.getItem('savor_user')) || null,
            favorites: JSON.parse(localStorage.getItem('savor_favorites')) || [],
            searchHistory: JSON.parse(localStorage.getItem('savor_search_history')) || [],
        };
    }

    getCurrentUser() {
        return this.state.user;
    }

    login(email, password, name = null) {
        // Mock login / registration
        const user = {
            id: 'u_' + Date.now(),
            email: email,
            name: name || email.split('@')[0],
            joined: new Date().toISOString()
        };
        this.state.user = user;
        localStorage.setItem('savor_user', JSON.stringify(user));
        this.emitUpdate();
        return true;
    }

    addSearch(query) {
        if (!this.state.user || !query.trim()) return;
        
        const timestamp = new Date().toISOString();
        const searchEntry = { query: query.trim(), timestamp };
        
        // Add to front of history
        this.state.searchHistory.unshift(searchEntry);
        
        // Keep only last 20 searches
        if (this.state.searchHistory.length > 20) {
            this.state.searchHistory.pop();
        }
        
        localStorage.setItem('savor_search_history', JSON.stringify(this.state.searchHistory));
        this.emitUpdate();
    }

    getSearchHistory() {
        return this.state.searchHistory;
    }

    logout() {
        this.state.user = null;
        localStorage.removeItem('savor_user');
        this.emitUpdate();
    }

    getFavorites() {
        return this.state.favorites;
    }

    isFavorite(recipeId) {
        return this.state.favorites.includes(recipeId);
    }

    toggleFavorite(recipeId) {
        const index = this.state.favorites.indexOf(recipeId);
        if (index === -1) {
            this.state.favorites.push(recipeId);
        } else {
            this.state.favorites.splice(index, 1);
        }
        localStorage.setItem('savor_favorites', JSON.stringify(this.state.favorites));
        this.emitUpdate();
        return index === -1; // returns true if added
    }

    emitUpdate() {
        window.dispatchEvent(new CustomEvent('storeUpdated'));
    }
}
