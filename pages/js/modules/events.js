import { renderCanvas, renderPrintView } from './renderer.js';

export function initEvents(state) {
    // 1. Year Input
    const yearInput = document.getElementById('yearInput');
    yearInput.value = state.currentYear;
    
    yearInput.addEventListener('change', (e) => {
        state.currentYear = parseInt(e.target.value);
        renderCanvas(state);
    });

    // 2. Navigation Buttons
    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (state.pageIndex > 0) {
            state.pageIndex--;
            renderCanvas(state);
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        if (state.pageIndex < 2) {
            state.pageIndex++;
            renderCanvas(state);
        }
    });

    // 3. Image Upload
    document.getElementById('imageUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                state.customImage = evt.target.result;
                renderCanvas(state);
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. Print Button
    document.getElementById('printBtn').addEventListener('click', () => {
        renderPrintView(state);
        window.print();
    });
}