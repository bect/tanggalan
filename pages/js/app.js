import { state } from './modules/state.js';
import { renderCanvas } from './modules/renderer.js';
import { initEvents } from './modules/events.js';
import { init } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await init();

    // Initial Render
    renderCanvas(state);
    
    // Setup Event Listeners
    initEvents(state);
});