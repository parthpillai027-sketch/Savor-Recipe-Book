export class AboutView {
    constructor(store) { this.store = store; }
    
    async render() {
        return `
            <div class="container mb-8 fade-in text-center" style="max-width: 800px; padding: var(--space-8) 0;">
                <i class="ph-fill ph-cooking-pot" style="font-size: 5rem; color: var(--accent-primary); margin-bottom: var(--space-4);"></i>
                <h1 style="margin-bottom: var(--space-4);">About Savor</h1>
                <p style="font-size: 1.25rem; line-height: 1.8;">
                    Savor was born out of a simple passion: bringing premium culinary experiences into the home kitchen. We believe that cooking shouldn't just be a chore, but an art form that everyone can master.
                </p>
                <p style="font-size: 1.25rem; line-height: 1.8; margin-top: var(--space-4);">
                    Our curated collection of recipes ranges from quick, weeknight dinners to show-stopping weekend centerpieces. Every recipe is meticulously tested to ensure you get perfect results every time.
                </p>
            </div>
        `;
    }
}

export class ContactView {
    constructor(store) { this.store = store; }
    
    async render() {
        return `
            <div class="container mb-8 fade-in">
                <div style="max-width: 600px; margin: var(--space-8) auto; background: var(--bg-card); padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
                    <div class="text-center mb-6">
                        <h2>Get in Touch</h2>
                        <p>Have a question or just want to say hi? Drop us a message.</p>
                    </div>

                    <form id="contact-form">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Message</label>
                            <textarea class="form-input" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary mt-4" style="width: 100%; justify-content: center;">Send Message</button>
                    </form>
                </div>
            </div>
        `;
    }
    
    async afterRender() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Message sent! We will get back to you soon.');
                form.reset();
            });
        }
    }
}
