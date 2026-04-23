import { recipes, categories } from '../data.js';

export default class DatabaseView {
    constructor(store) {
        this.store = store;
    }

    async render() {
        return `
            <style>
                .db-container {
                    background: var(--bg-card);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: var(--space-5);
                    overflow-x: auto;
                    box-shadow: var(--shadow-md);
                }
                .db-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    font-size: 0.875rem;
                }
                .db-table th, .db-table td {
                    padding: var(--space-3);
                    border-bottom: 1px solid var(--glass-border);
                    white-space: nowrap;
                }
                .db-table th {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-secondary);
                    font-weight: 600;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .db-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
                .cell-desc {
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .cell-list {
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            </style>

            <div class="container mb-8 fade-in">
                <div class="section-header" style="border-bottom: 1px solid var(--glass-border); padding-bottom: var(--space-3); margin-bottom: var(--space-5);">
                    <h2>Raw Database View</h2>
                    <p>Total Records: ${recipes.length} Recipes | ${categories.length} Categories</p>
                </div>
                
                <div class="d-flex justify-between mb-4">
                    <div class="d-flex" style="gap: var(--space-2)">
                        <button class="btn btn-primary" id="view-recipes">Recipes Table</button>
                        <button class="btn btn-secondary" id="view-categories">Categories Table</button>
                    </div>
                    <div class="d-flex" style="gap: var(--space-2)">
                        <a href="database.json" download class="btn btn-secondary"><i class="ph ph-download-simple"></i> JSON</a>
                        <a href="database.sql" download class="btn btn-secondary"><i class="ph ph-database"></i> SQL</a>
                    </div>
                </div>

                <div class="db-container" id="table-container">
                    <!-- Default to Recipes Table -->
                    ${this.renderRecipesTable()}
                </div>
            </div>
        `;
    }

    renderRecipesTable() {
        const rows = recipes.map(r => `
            <tr>
                <td>${r.id}</td>
                <td style="font-weight: 600; color: var(--accent-primary);"><a href="#/recipe/${r.id}">${r.title}</a></td>
                <td>${r.category}</td>
                <td>${r.cuisine}</td>
                <td><span class="difficulty ${r.difficulty}">${r.difficulty}</span></td>
                <td>${r.time}</td>
                <td>${r.servings}</td>
                <td>${r.rating} ⭐ (${r.reviews})</td>
                <td class="cell-desc">${r.description}</td>
                <td class="cell-list">${r.ingredients.length} items</td>
                <td class="cell-list">${r.steps.length} steps</td>
            </tr>
        `).join('');

        return `
            <table class="db-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Cuisine</th>
                        <th>Difficulty</th>
                        <th>Time</th>
                        <th>Servings</th>
                        <th>Rating/Reviews</th>
                        <th>Description</th>
                        <th>Ingredients Count</th>
                        <th>Steps Count</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    renderCategoriesTable() {
        const rows = categories.map(c => `
            <tr>
                <td><i class="ph ${c.icon}" style="font-size: 1.5rem; color: var(--accent-primary);"></i></td>
                <td style="font-weight: 600;">${c.name}</td>
                <td>${c.icon}</td>
            </tr>
        `).join('');

        return `
            <table class="db-table" style="max-width: 600px;">
                <thead>
                    <tr>
                        <th>Icon Preview</th>
                        <th>Category Name</th>
                        <th>Phosphor Icon Class</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    async afterRender() {
        const tableContainer = document.getElementById('table-container');
        const btnRecipes = document.getElementById('view-recipes');
        const btnCategories = document.getElementById('view-categories');

        if (btnRecipes && btnCategories && tableContainer) {
            btnRecipes.addEventListener('click', () => {
                tableContainer.innerHTML = this.renderRecipesTable();
                btnRecipes.className = 'btn btn-primary';
                btnCategories.className = 'btn btn-secondary';
            });

            btnCategories.addEventListener('click', () => {
                tableContainer.innerHTML = this.renderCategoriesTable();
                btnCategories.className = 'btn btn-primary';
                btnRecipes.className = 'btn btn-secondary';
            });
        }
    }
}
