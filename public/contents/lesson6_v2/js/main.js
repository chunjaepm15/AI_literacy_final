/**
 * Main Entry Point for Space Detective Agency
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Space Detective Agency: Session 6 Initialized');
    
    // Check if we are inside an iframe (integrated mode)
    if (window.self !== window.top) {
        console.log('Running in integrated mode');
    }
});
