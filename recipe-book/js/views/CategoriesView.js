import { categories } from '../data.js';

export default class CategoriesView {
    constructor(store) {
        this.store = store;
    }

    async render() {
        return `
            <style>
                .category-large-card {
                    background: var(--bg-card);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                    text-align: center;
                    transition: all var(--trans-normal);
                    color: var(--text-primary);
                }
                .category-large-card i {
                    font-size: 4rem;
                    color: var(--accent-primary);
                    margin-bottom: var(--space-3);
                    display: block;
                }
                .category-large-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--accent-primary);
                    background: rgba(255, 107, 107, 0.05);
                }
            </style>

            <div class="container mb-8 fade-in">
                <div class="section-header" style="border-bottom: 1px solid var(--glass-border); padding-bottom: var(--space-3); margin-bottom: var(--space-5);">
                    <h2>Browse by Category</h2>
                </div>
                
                <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-5);">
                    ${categories.map(cat => `
                        <a href="#/recipes?category=${encodeURIComponent(cat.name)}" class="category-large-card">
                            <i class="ph ${cat.icon}"></i>
                            <h3>${cat.name}</h3>
                            <p style="margin-top: var(--space-2); font-size: 0.875rem;">Explore all ${cat.name.toLowerCase().replace(' recipes', '')} recipes</p>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
}
