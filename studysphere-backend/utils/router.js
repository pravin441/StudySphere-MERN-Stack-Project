// A minimal manual router — replaces Express's app.get()/app.post()/etc.
// Routes are registered with a method + path pattern, and matched against
// incoming requests. Supports simple dynamic params like /notes/:id.

class Router {
  constructor() {
    this.routes = [];
  }

  addRoute(method, path, handler) {
    // Convert "/notes/:id" into a regex that captures the :id part
    const paramNames = [];
    const regexPath = path
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          paramNames.push(segment.slice(1));
          return '([^/]+)';
        }
        return segment;
      })
      .join('/');

    const regex = new RegExp(`^${regexPath}$`);
    this.routes.push({ method, regex, paramNames, handler });
  }

  get(path, handler) { this.addRoute('GET', path, handler); }
  post(path, handler) { this.addRoute('POST', path, handler); }
  put(path, handler) { this.addRoute('PUT', path, handler); }
  delete(path, handler) { this.addRoute('DELETE', path, handler); }

  // Finds a matching route for the incoming request and extracts params
  match(method, url) {
    // Strip query string (e.g. ?search=react) before matching
    const path = url.split('?')[0];

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }
}

module.exports = Router;