# Implementation Tasks: Tanggalan Web App

## Phase 1: Setup & Structure
- [x] **HTML Skeleton**: Create `index.html` with containers for:
    -   Header/Controls (Year input, Page navigation, Image upload, Print button).
    -   Canvas Area (Image placeholder, Calendar Grid Container).
    -   Hidden Print Area (Container for full-year printing).
- [x] **CSS Setup**: Initialize `style.css` importing all partials.
- [x] **JS Setup**: Initialize `app.js` importing modules.

## Phase 2: Core Logic (JavaScript)
- [x] **State Management (`state.js`)**:
    -   Track `currentYear` (default to current year).
    -   Track `pageIndex` (0-5, representing Jan-Feb, Mar-Apr, etc.).
    -   Track `customImage` (Data URL or path).
- [x] **Utils (`utils.js`)**:
    -   Helper to get month names.
    -   Helper to format dates using `Tanggalan`.
- [x] **Renderer (`renderer.js`)**:
    -   `renderCanvas()`: Update the visible canvas based on state.
    -   `renderGrid(monthIndex, year)`: Generate HTML for a single month grid using `Tanggalan`.
    -   `updateImage()`: Update the artwork section.
- [x] **Event Handling (`events.js`)**:
    -   Listeners for Previous/Next Page buttons.
    -   Listener for Year input change.
    -   Listener for Image Upload (File input).
    -   Listener for Print button.

## Phase 3: Styling (CSS)
- [x] **Variables (`_variables.css`)**: Define colors (primary, secondary, text), fonts, and grid dimensions.
- [x] **Base & Layout (`_base.css`, `_layout.css`)**:
    -   Flexbox/Grid layout for the main canvas.
    -   Responsive adjustments (though primary focus is print/desktop).
- [x] **Calendar Grid (`_calendar.css`)**:
    -   Grid system for days (7 columns).
    -   Styling for headers (Dina, Pasaran).
    -   Styling for dates (Color coding for Sundays/Holidays if applicable).
    -   Pasaran styling (Legi, Pahing, etc.).
- [x] **Controls (`_controls.css`)**: Style the navigation bar and buttons.

## Phase 4: Advanced Features
- [x] **Image Upload**: Implement `FileReader` to preview uploaded images on the canvas.
- [x] **Print Logic (`_print.css` & JS)**:
    -   **JS**: When print is triggered, generate the full 12 months (6 pages) into a hidden container.
    -   **CSS**: Use `@media print` to:
        -   Hide controls.
        -   Show the full-year container.
        -   Use `page-break-after: always` to ensure each 2-month block is on a new page.
        -   Ensure background graphics/images are printed (`-webkit-print-color-adjust: exact`).