export default class AuthView {
    constructor(store, params) {
        this.store = store;
        this.isLogin = window.location.hash.includes('login');
    }

    async render() {
        return `
            <style>
                .auth-container {
                    max-width: 400px;
                    margin: var(--space-8) auto;
                    background: var(--bg-card);
                    padding: var(--space-6) var(--space-5);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--shadow-lg);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: var(--space-5);
                }
                .auth-header i {
                    font-size: 3rem;
                    color: var(--accent-primary);
                    margin-bottom: var(--space-2);
                }
            </style>

            <div class="container fade-in">
                <div class="auth-container">
                    <div class="auth-header">
                        <i class="ph-fill ph-cooking-pot"></i>
                        <h2>${this.isLogin ? 'Welcome Back' : 'Join Savor'}</h2>
                        <p>${this.isLogin ? 'Sign in to access your saved recipes.' : 'Create an account to start saving recipes.'}</p>
                    </div>

                    <form id="auth-form">
                        ${!this.isLogin ? `
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-input" id="auth-name" placeholder="John Doe" required>
                            </div>
                        ` : ''}
                        
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" class="form-input" id="auth-email" placeholder="you@example.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-input" id="auth-password" placeholder="••••••••" required>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-3); justify-content: center;">
                            ${this.isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div class="text-center mt-4">
                        <p style="font-size: 0.875rem;">
                            ${this.isLogin ? "Don't have an account?" : "Already have an account?"}
                            <a href="${this.isLogin ? '#/signup' : '#/login'}" style="font-weight: 600;">
                                ${this.isLogin ? 'Sign Up' : 'Sign In'}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        const form = document.getElementById('auth-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            let name = null;
            if (!this.isLogin) {
                name = document.getElementById('auth-name').value;
            }

            // Simple mock authentication
            if (email && password) {
                this.store.login(email, password, name);
                window.location.hash = '#/profile';
            }
        });
    }
}
