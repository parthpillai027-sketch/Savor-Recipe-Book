export default class Router {
    constructor(store) {
        this.store = store;
        this.appRoot = document.getElementById('app-root');
        this.routes = {};
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial load
        if (!window.location.hash) {
            window.location.hash = '#/home';
        } else {
            this.handleRoute();
        }
    }

    addRoute(path, viewClass) {
        this.routes[path] = viewClass;
    }

    async handleRoute() {
        const rawUrl = window.location.hash.slice(1) || '/home';
        const rawParts = rawUrl.split('?');
        // Only lowercase the path for route matching — preserve query param case
        // (category names like "Chicken Recipes" must not be lowercased)
        const path = rawParts[0].toLowerCase();
        const url = path;

        // Use original un-lowercased query string to preserve category/search values
        const queryParams = new URLSearchParams(rawParts[1] || '');

        let match = null;
        let params = {};

        // Find route match (supporting simple /recipe/:id)
        for (const routePath in this.routes) {
            const routeParts = routePath.split('/');
            const pathParts = path.split('/');

            if (routeParts.length === pathParts.length) {
                let isMatch = true;
                const tempParams = {};

                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(':')) {
                        tempParams[routeParts[i].substring(1)] = pathParts[i];
                    } else if (routeParts[i] !== pathParts[i]) {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch) {
                    match = routePath;
                    params = tempParams;
                    break;
                }
            }
        }

        if (match) {
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#/${path.split('/')[1]}`) {
                    link.classList.add('active');
                }
            });

            // Initialize view and render
            try {
                // Dynamically import view if not already loaded (Basic lazy loading simulation)
                // For this implementation, we will import them in app.js or directly here
                const ViewClass = this.routes[match];
                const view = new ViewClass(this.store, params, queryParams);
                
                // Fade out current content
                this.appRoot.style.opacity = 0;
                
                setTimeout(async () => {
                    this.appRoot.innerHTML = await view.render();
                    if (view.afterRender) await view.afterRender();
                    
                    // Fade in new content
                    this.appRoot.style.opacity = 1;
                    window.scrollTo(0, 0);
                }, 150);
                
            } catch (e) {
                console.error("Routing error:", e);
                this.appRoot.innerHTML = `<div class="container text-center mt-4"><h2>Error Loading Page</h2></div>`;
                this.appRoot.style.opacity = 1;
            }
        } else {
            this.appRoot.innerHTML = `<div class="container text-center mt-4"><h2>404 - Page Not Found</h2><a href="#/home" class="btn btn-primary mt-4">Go Home</a></div>`;
            this.appRoot.style.opacity = 1;
        }
    }
}
