// Polyfill-like function to lazy load a module
function lazyImport(importFunction) {
  let loadedModule = null; // Cache the loaded module

  // Return a promise that resolves when the module is loaded
  const loadModule = () => {
    // If the module is already loaded, return it
    if (loadedModule) return Promise.resolve(loadedModule);

    // Otherwise, dynamically import the module
    return importFunction()
      .then((module) => {
        loadedModule = module.default || module; // Cache the module
        return loadedModule;
      })
      .catch((error) => {
        console.error('Error loading module:', error);
        throw error;
      });
  };

  // Return a function that delays rendering until the module is loaded
  return function (container) {
    loadModule()
      .then((component) => {
        if (typeof component === 'function') {
          // If the loaded component is a function (render function), call it
          component(container);
        } else if (typeof component === 'object' && component.render) {
          // If the loaded component has a render method, call render
          component.render(container);
        } else {
          console.error('Loaded module is not a valid component');
        }
      })
      .catch(() => {
        container.innerHTML = 'Failed to load component'; // Error handling
      });
  };
}

// Example usage:
// Simulate a module that exports a render function
const LazyComponent = lazyImport(() => import('./MyComponent.js'));

// Simulate rendering the component inside a container div
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  LazyComponent(container); // Call the lazy-loaded component
});
