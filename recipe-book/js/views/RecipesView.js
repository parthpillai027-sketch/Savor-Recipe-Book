import { recipes } from '../data.js';

export default class RecipesView {
    constructor(store, params, queryParams) {
        this.store = store;
        this.searchQuery = queryParams.get('search') || '';
        this.categoryFilter = queryParams.get('category') || '';
        this.filteredRecipes = [];
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

    filterRecipes() {
        return recipes.filter(r => {
            const matchesSearch = r.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                                  r.ingredients.some(i => i.toLowerCase().includes(this.searchQuery.toLowerCase()));
            const matchesCategory = this.categoryFilter ? r.category === this.categoryFilter : true;
            return matchesSearch && matchesCategory;
        });
    }

    async render() {
        this.filteredRecipes = this.filterRecipes();

        let headerText = 'All Recipes';
        if (this.searchQuery) {
            headerText = `Search Results for "${this.searchQuery}"`;
        } else if (this.categoryFilter) {
            headerText = `${this.categoryFilter} Recipes`;
        }

        return `
            <div class="container mb-8 fade-in">
                <div class="d-flex justify-between align-center mb-5" style="border-bottom: 1px solid var(--glass-border); padding-bottom: var(--space-3); margin-bottom: var(--space-5);">
                    <h2>${headerText} <span style="font-size: 1rem; color: var(--text-secondary); font-weight: normal;">(${this.filteredRecipes.length})</span></h2>
                    
                    <div class="d-flex align-center" style="gap: var(--space-2);">
                        <button class="btn btn-secondary filter-btn"><i class="ph ph-faders"></i> Filter</button>
                    </div>
                </div>
                
                <div class="filter-panel d-none" style="background: var(--bg-card); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--glass-border); margin-bottom: var(--space-5);">
                    <!-- We can expand this with real filters later -->
                    <h4>Filter by Difficulty</h4>
                    <div class="d-flex mt-2" style="gap: var(--space-2)">
                        <span class="chip filter-chip" data-difficulty="easy">Easy</span>
                        <span class="chip filter-chip" data-difficulty="medium">Medium</span>
                        <span class="chip filter-chip" data-difficulty="hard">Hard</span>
                    </div>
                </div>

                ${this.filteredRecipes.length > 0 ? `
                    <div class="recipe-grid">
                        ${this.filteredRecipes.map(r => this.renderRecipeCard(r)).join('')}
                    </div>
                ` : `
                    <div class="text-center" style="padding: var(--space-8) 0; color: var(--text-secondary);">
                        <i class="ph ph-magnifying-glass" style="font-size: 4rem; color: var(--glass-border); margin-bottom: var(--space-3);"></i>
                        <h3>No recipes found</h3>
                        <p>Try adjusting your search or filters.</p>
                        <a href="#/recipes" class="btn btn-primary mt-4">Clear All</a>
                    </div>
                `}
            </div>
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

        const filterBtn = document.querySelector('.filter-btn');
        const filterPanel = document.querySelector('.filter-panel');
        if (filterBtn && filterPanel) {
            filterBtn.addEventListener('click', () => {
                filterPanel.classList.toggle('d-none');
            });
        }

        // Wire up difficulty filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const difficulty = chip.getAttribute('data-difficulty');
                
                // Toggle active state
                const wasActive = chip.classList.contains('active');
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                if (!wasActive) chip.classList.add('active');

                const activeDifficulty = wasActive ? null : difficulty;
                const grid = document.querySelector('.recipe-grid');
                if (!grid) return;

                document.querySelectorAll('.recipe-card').forEach(card => {
                    if (!activeDifficulty) {
                        card.style.display = '';
                    } else {
                        const badge = card.querySelector('.difficulty');
                        if (badge && badge.classList.contains(activeDifficulty)) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
}
