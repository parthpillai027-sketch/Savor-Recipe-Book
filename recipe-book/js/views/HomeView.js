import { recipes, categories } from '../data.js';

export default class HomeView {
    constructor(store) {
        this.store = store;
    }

    renderRecipeCard(recipe) {
        const isFav = this.store.isFavorite(recipe.id) ? 'active' : '';
        const favIcon = isFav ? 'ph-fill' : 'ph';
        
        return `
            <div class="recipe-card fade-in">
                <button class="fav-btn ${isFav}" data-id="${recipe.id}" aria-label="Save Recipe">
                    <i class="${favIcon} ph-heart"></i>
                </button>
                <a href="#/recipe/${recipe.id}">
                    <div class="card-img-wrap">
                        <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" data-fallback="${recipe.fallbackImage || ''}" onerror="this.src = (this.dataset.fallback || 'assets/images/placeholder.svg')">
                    </div>
                    <div class="card-content">
                        <div class="card-meta">
                            <span><i class="ph ph-clock"></i> ${recipe.time}</span>
                            <span><i class="ph ph-star"></i> ${recipe.rating}</span>
                        </div>
                        <h3 class="card-title">${recipe.title}</h3>
                        <div class="card-footer">
                            <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
                            <span style="color: var(--text-secondary); font-size: 0.875rem;">
                                ${recipe.category}
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    async render() {
        const featuredRecipes = recipes.filter(r => r.featured).slice(0, 3);
        const trendingRecipes = recipes.filter(r => r.trending).slice(0, 4);

        const categoryHTML = categories.map(cat => `
            <a href="#/recipes?category=${encodeURIComponent(cat.name)}" class="category-card">
                <i class="ph ${cat.icon}"></i>
                <span>${cat.name}</span>
            </a>
        `).join('');

        return `
            <style>
                .hero {
                    position: relative;
                    padding: var(--space-8) 0 var(--space-6);
                    text-align: center;
                    background: radial-gradient(circle at 50% 0%, var(--bg-card) 0%, transparent 70%);
                }
                .hero h1 {
                    font-size: clamp(2.5rem, 5vw, 4.5rem);
                    margin-bottom: var(--space-4);
                    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero p {
                    font-size: 1.25rem;
                    max-width: 600px;
                    margin: 0 auto var(--space-5);
                }
                .categories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: var(--space-4);
                    margin-top: var(--space-4);
                }
                .category-card {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: var(--space-4) var(--space-2);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-2);
                    transition: all var(--trans-normal);
                    color: var(--text-primary);
                }
                .category-card i {
                    font-size: 2rem;
                    color: var(--accent-primary);
                }
                .category-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-primary);
                    background: rgba(255, 107, 107, 0.1);
                }
            </style>

            <div class="hero fade-in">
                <div class="container">
                    <h1>Elevate Your Home Cooking</h1>
                    <p>Discover premium, chef-curated recipes with step-by-step instructions designed to make every meal a masterpiece.</p>
                    <div class="d-flex justify-center" style="gap: var(--space-3)">
                        <a href="#/recipes" class="btn btn-primary">Explore Recipes</a>
                        <button class="btn btn-secondary search-trigger">Search Ingredients</button>
                    </div>
                </div>
            </div>

            <section class="container mb-8">
                <div class="section-header">
                    <h2>Featured Creations</h2>
                </div>
                <div class="recipe-grid">
                    ${featuredRecipes.map(r => this.renderRecipeCard(r)).join('')}
                </div>
            </section>

            <section class="container mb-8">
                <div class="section-header">
                    <h2>Explore Categories</h2>
                    <a href="#/categories">View All</a>
                </div>
                <div class="categories-grid">
                    ${categoryHTML}
                </div>
            </section>

            <section class="container mb-8">
                <div class="section-header">
                    <h2>Trending Now</h2>
                    <a href="#/recipes?sort=trending">View All</a>
                </div>
                <div class="recipe-grid">
                    ${trendingRecipes.map(r => this.renderRecipeCard(r)).join('')}
                </div>
            </section>
        `;
    }

    async afterRender() {
        // Handle favorite buttons
        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const id = btn.getAttribute('data-id');
                const isAdded = this.store.toggleFavorite(id);
                
                const icon = btn.querySelector('i');
                if (isAdded) {
                    btn.classList.add('active');
                    icon.classList.remove('ph');
                    icon.classList.add('ph-fill');
                } else {
                    btn.classList.remove('active');
                    icon.classList.add('ph');
                    icon.classList.remove('ph-fill');
                }
            });
        });
        
        // Setup hero search button
        const searchBtn = document.querySelector('.hero .search-trigger');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                document.getElementById('search-overlay').classList.add('active');
                setTimeout(() => document.getElementById('global-search-input').focus(), 100);
            });
        }
    }
}
