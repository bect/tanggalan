import { state } from './modules/state.js';
import { renderCanvas } from './modules/renderer.js';
import { initEvents } from './modules/events.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderCanvas(state);
    
    // Setup Event Listeners
    initEvents(state);
});