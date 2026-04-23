import Router from './router.js';
import Store from './store.js';

import HomeView from './views/HomeView.js';
import RecipesView from './views/RecipesView.js';
import RecipeDetailView from './views/RecipeDetailView.js';
import AuthView from './views/AuthView.js';
import ProfileView from './views/ProfileView.js';
import CategoriesView from './views/CategoriesView.js';
import SubmitRecipeView from './views/SubmitRecipeView.js';
import { AboutView, ContactView } from './views/InfoViews.js';
import DatabaseView from './views/DatabaseView.js';

class App {
    constructor() {
        this.store = new Store();
        this.router = new Router(this.store);
        this.init();
    }

    init() {
        // Handle navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Handle mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-open');
            });
            // Close menu when a link is clicked
            navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navLinks.classList.remove('mobile-open');
                }
            });
        }

        // Register Routes
        this.router.addRoute('/home', HomeView);
        this.router.addRoute('/recipes', RecipesView);
        this.router.addRoute('/recipe/:id', RecipeDetailView);
        this.router.addRoute('/login', AuthView);
        this.router.addRoute('/signup', AuthView);
        this.router.addRoute('/profile', ProfileView);
        this.router.addRoute('/categories', CategoriesView);
        this.router.addRoute('/submit', SubmitRecipeView);
        this.router.addRoute('/about', AboutView);
        this.router.addRoute('/contact', ContactView);
        this.router.addRoute('/database', DatabaseView);

        // Initialize Router
        this.router.init();

        // Setup global search
        this.setupSearch();

        // Render Nav Auth State
        this.updateNavAuthState();
        
        // Listen for store changes
        window.addEventListener('storeUpdated', () => {
            this.updateNavAuthState();
        });
    }

    updateNavAuthState() {
        const authContainer = document.getElementById('auth-nav-section');
        const user = this.store.getCurrentUser();

        if (user) {
            authContainer.innerHTML = `
                <a href="#/profile" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                    <i class="ph ph-user"></i> ${user.name}
                </a>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="#/login" class="btn btn-primary">Sign In</a>
            `;
        }
    }

    setupSearch() {
        const searchBtn = document.querySelector('.search-trigger');
        const closeBtn = document.querySelector('.close-search');
        const overlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('global-search-input');

        searchBtn.addEventListener('click', () => {
            overlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });

        const closeSearch = () => {
            overlay.classList.remove('active');
            searchInput.value = '';
        };

        closeBtn.addEventListener('click', closeSearch);
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeSearch();
            }
        });

        // Search execution
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    this.store.addSearch(query); // Log to search history
                    closeSearch();
                    window.location.hash = `/recipes?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
