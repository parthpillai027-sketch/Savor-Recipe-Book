export default class SubmitRecipeView {
    constructor(store) {
        this.store = store;
    }

    async render() {
        if (!this.store.getCurrentUser()) {
            window.location.hash = '#/login';
            return '';
        }

        return `
            <div class="container mb-8 fade-in">
                <div style="max-width: 800px; margin: 0 auto; background: var(--bg-card); padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
                    <div class="text-center mb-6">
                        <h2>Share Your Recipe</h2>
                        <p>Got a family secret or a new creation? Share it with the Savor community.</p>
                    </div>

                    <form id="submit-recipe-form">
                        <div class="form-group">
                            <label class="form-label">Recipe Title</label>
                            <input type="text" class="form-input" placeholder="E.g., Grandma's Apple Pie" required>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                            <div class="form-group">
                                <label class="form-label">Category</label>
                                <select class="form-input" required>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Desserts">Desserts</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Prep Time (mins)</label>
                                <input type="number" class="form-input" placeholder="30" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-input" rows="4" placeholder="Briefly describe your recipe..." required></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Ingredients (one per line)</label>
                            <textarea class="form-input" rows="6" placeholder="- 2 cups flour\n- 1 cup sugar..." required></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Instructions</label>
                            <textarea class="form-input" rows="8" placeholder="1. Preheat oven...\n2. Mix dry ingredients..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Upload Image</label>
                            <input type="file" class="form-input" accept="image/*">
                        </div>

                        <button type="submit" class="btn btn-primary mt-4" style="width: 100%; justify-content: center;">
                            Submit Recipe for Review
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    async afterRender() {
        const form = document.getElementById('submit-recipe-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you! Your recipe has been submitted for review.');
                window.location.hash = '#/home';
            });
        }
    }
}
