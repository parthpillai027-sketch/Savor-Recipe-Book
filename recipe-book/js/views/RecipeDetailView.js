import { recipes } from '../data.js';

export default class RecipeDetailView {
    constructor(store, params) {
        this.store = store;
        this.recipeId = params.id;
        this.recipe = recipes.find(r => r.id === this.recipeId);
    }

    async render() {
        if (!this.recipe) {
            return `
                <div class="container text-center mt-4">
                    <h2>Recipe Not Found</h2>
                    <a href="#/recipes" class="btn btn-primary mt-4">Back to Recipes</a>
                </div>
            `;
        }

        const isFav = this.store.isFavorite(this.recipe.id) ? 'active' : '';
        const favIcon = isFav ? 'ph-fill' : 'ph';

        return `
            <style>
                .recipe-header {
                    position: relative;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    margin-bottom: var(--space-6);
                }
                .recipe-hero-img {
                    width: 100%;
                    height: 50vh;
                    min-height: 400px;
                    object-fit: cover;
                }
                .recipe-header-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: var(--space-8) var(--space-4) var(--space-4);
                    background: linear-gradient(to top, rgba(15, 16, 21, 1) 0%, rgba(15, 16, 21, 0) 100%);
                }
                .recipe-stats {
                    display: flex;
                    gap: var(--space-4);
                    margin-top: var(--space-3);
                    color: var(--text-secondary);
                }
                .recipe-stats div {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    background: var(--glass-bg);
                    backdrop-filter: var(--glass-blur);
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    border: 1px solid var(--glass-border);
                }
                .recipe-stats i {
                    color: var(--accent-primary);
                    font-size: 1.25rem;
                }
                
                .recipe-body {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: var(--space-6);
                    margin-bottom: var(--space-8);
                }
                
                @media (max-width: 768px) {
                    .recipe-body {
                        grid-template-columns: 1fr;
                    }
                }

                .ingredients-box {
                    background: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: var(--space-5);
                    position: sticky;
                    top: 100px;
                }

                .ingredient-item {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-3);
                    padding: var(--space-2) 0;
                    border-bottom: 1px dashed var(--glass-border);
                }
                .ingredient-item:last-child {
                    border-bottom: none;
                }
                
                .step-item {
                    display: flex;
                    gap: var(--space-4);
                    margin-bottom: var(--space-5);
                    background: var(--bg-card);
                    padding: var(--space-5);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--glass-border);
                }
                .step-number {
                    flex-shrink: 0;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.25rem;
                    box-shadow: var(--shadow-glow);
                }
            </style>

            <div class="container fade-in">
                <div class="recipe-header">
                    <img src="${this.recipe.image}" alt="${this.recipe.title}" class="recipe-hero-img" data-fallback="${this.recipe.fallbackImage || ''}" onerror="this.src = (this.dataset.fallback || 'assets/images/placeholder.svg')">
                    <div class="recipe-header-content">
                        <div class="d-flex justify-between align-center">
                            <div>
                                <div class="d-flex" style="gap: var(--space-2); margin-bottom: var(--space-2);">
                                    <span class="chip">${this.recipe.category}</span>
                                    <span class="chip">${this.recipe.cuisine}</span>
                                </div>
                                <h1 style="margin-bottom: 0;">${this.recipe.title}</h1>
                            </div>
                            <button class="icon-btn fav-detail-btn ${isFav}" style="width: 56px; height: 56px; font-size: 1.8rem; background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border);">
                                <i class="${favIcon} ph-heart" style="color: ${isFav ? 'var(--accent-primary)' : 'var(--text-primary)'}"></i>
                            </button>
                        </div>
                        <div class="recipe-stats">
                            <div><i class="ph ph-clock"></i> <span>${this.recipe.time}</span></div>
                            <div><i class="ph ph-users"></i> <span>${this.recipe.servings} Servings</span></div>
                            <div><i class="ph ph-chart-bar"></i> <span class="difficulty ${this.recipe.difficulty}">${this.recipe.difficulty}</span></div>
                            <div><i class="ph ph-star"></i> <span>${this.recipe.rating} (${this.recipe.reviews})</span></div>
                        </div>
                    </div>
                </div>

                <div class="recipe-body">
                    <div class="ingredients-section">
                        <div class="ingredients-box">
                            <h3>Ingredients</h3>
                            <div class="mt-4">
                                ${this.recipe.ingredients.map(ing => `
                                    <label class="ingredient-item">
                                        <input type="checkbox" style="margin-top: 5px; accent-color: var(--accent-primary); width: 18px; height: 18px;">
                                        <span>${ing}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="steps-section">
                        <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: var(--space-5);">
                            ${this.recipe.description}
                        </p>
                        
                        <h3>Instructions</h3>
                        <div class="mt-4">
                            ${this.recipe.steps.map((step, index) => `
                                <div class="step-item">
                                    <div class="step-number">${index + 1}</div>
                                    <div style="flex-grow: 1;">
                                        <p style="margin: 0; color: var(--text-primary); font-size: 1.1rem; line-height: 1.7;">${step}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        if (!this.recipe) return;

        const favBtn = document.querySelector('.fav-detail-btn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                const isAdded = this.store.toggleFavorite(this.recipe.id);
                const icon = favBtn.querySelector('i');
                
                if (isAdded) {
                    favBtn.classList.add('active');
                    icon.classList.remove('ph');
                    icon.classList.add('ph-fill');
                    icon.style.color = 'var(--accent-primary)';
                } else {
                    favBtn.classList.remove('active');
                    icon.classList.add('ph');
                    icon.classList.remove('ph-fill');
                    icon.style.color = 'var(--text-primary)';
                }
            });
        }
    }
}
