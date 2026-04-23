import { recipes } from '../data.js';

export default class ProfileView {
    constructor(store) {
        this.store = store;
        this.user = this.store.getCurrentUser();
    }

    renderRecipeCard(recipe) {
        const isFav = this.store.isFavorite(recipe.id) ? 'active' : '';
        const favIcon = isFav ? 'ph-fill' : 'ph';
        
        return `
            <div class="recipe-card fade-in" id="fav-card-${recipe.id}">
                <button class="fav-btn ${isFav} profile-fav-btn" data-id="${recipe.id}" aria-label="Remove Recipe">
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
        if (!this.user) {
            window.location.hash = '#/login';
            return '';
        }

        const favIds = this.store.getFavorites();
        const favoriteRecipes = recipes.filter(r => favIds.includes(r.id));
        const searchHistory = this.store.getSearchHistory();

        return `
            <style>
                .profile-header {
                    background: var(--bg-card);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                    display: flex;
                    align-items: center;
                    gap: var(--space-5);
                    margin-bottom: var(--space-6);
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent-primary), var(--warning));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    color: #fff;
                    font-weight: 700;
                    box-shadow: var(--shadow-glow);
                }
                .profile-info h2 {
                    margin-bottom: var(--space-1);
                }
                .profile-stats {
                    display: flex;
                    gap: var(--space-4);
                    margin-top: var(--space-3);
                }
                .stat-box {
                    text-align: center;
                }
                .stat-num {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .stat-label {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
            </style>

            <div class="container fade-in mb-8">
                <div class="profile-header">
                    <div class="avatar">
                        ${this.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-info" style="flex-grow: 1;">
                        <h2>${this.user.name}</h2>
                        <p style="margin: 0;">${this.user.email}</p>
                        <div class="profile-stats">
                            <div class="stat-box">
                                <div class="stat-num" id="fav-count">${favoriteRecipes.length}</div>
                                <div class="stat-label">Saved Recipes</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button id="logout-btn" class="btn btn-secondary"><i class="ph ph-sign-out"></i> Sign Out</button>
                    </div>
                </div>

                <div class="section-header" style="border-bottom: 1px solid var(--glass-border); padding-bottom: var(--space-3); margin-bottom: var(--space-5);">
                    <h2>My Cookbook</h2>
                </div>

                ${favoriteRecipes.length > 0 ? `
                    <div class="recipe-grid" id="favorites-grid">
                        ${favoriteRecipes.map(r => this.renderRecipeCard(r)).join('')}
                    </div>
                ` : `
                    <div class="text-center" style="padding: var(--space-6) 0; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
                        <i class="ph ph-book-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: var(--space-2);"></i>
                        <h3>Your cookbook is empty</h3>
                        <p>Save recipes you love to find them easily later.</p>
                        <a href="#/recipes" class="btn btn-primary mt-3">Discover Recipes</a>
                    </div>
                `}

                <div class="section-header" style="border-bottom: 1px solid var(--glass-border); padding-bottom: var(--space-3); margin-bottom: var(--space-5); margin-top: var(--space-8);">
                    <h2>Recent Searches</h2>
                </div>

                ${searchHistory.length > 0 ? `
                    <div style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: 0;">
                        ${searchHistory.map((entry, index) => `
                            <div style="padding: var(--space-4); border-bottom: ${index === searchHistory.length - 1 ? 'none' : '1px solid var(--glass-border)'}; display: flex; justify-content: space-between; align-items: center;">
                                <a href="#/recipes?search=${encodeURIComponent(entry.query)}" style="font-weight: 500; color: var(--text-primary); display: flex; align-items: center; gap: var(--space-2);">
                                    <i class="ph ph-clock-counter-clockwise" style="color: var(--text-secondary);"></i> ${entry.query}
                                </a>
                                <span style="color: var(--text-secondary); font-size: 0.875rem;">${new Date(entry.timestamp).toLocaleDateString()}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div style="padding: var(--space-4); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); color: var(--text-secondary);">
                        You haven't searched for anything recently.
                    </div>
                `}
            </div>
        `;
    }

    async afterRender() {
        // Logout handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.store.logout();
                window.location.hash = '#/home';
            });
        }

        // Favorite button handler (remove from DOM when unfavorited in profile)
        document.querySelectorAll('.profile-fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const id = btn.getAttribute('data-id');
                this.store.toggleFavorite(id);
                
                // Remove card from grid
                const card = document.getElementById(`fav-card-${id}`);
                if (card) {
                    card.style.opacity = 0;
                    setTimeout(() => {
                        card.remove();
                        // Update count
                        const countEl = document.getElementById('fav-count');
                        if (countEl) {
                            countEl.textContent = parseInt(countEl.textContent) - 1;
                        }
                    }, 300);
                }
            });
        });
    }
}
