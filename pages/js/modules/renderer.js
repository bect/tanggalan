import { MONTH_NAMES, DAYS_HEADER, getJavaneseDate } from './utils.js';

// Canvas Dimensions (Approx 150 DPI for 38cm x 53cm)
const CANVAS_WIDTH = 2244;
const CANVAS_HEIGHT = 3130;
const MARGIN = 100;
const BINDING_HEIGHT = 70;
const HOLE_RADIUS = 20;

/**
 * Updates the visible design canvas based on current state
 */
export function renderCanvas(state) {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');

    // Update Page Indicator UI
    const startMonth = state.pageIndex * 4;
    const indicator = document.getElementById('pageIndicator');
    indicator.textContent = `${MONTH_NAMES[startMonth]} - ${MONTH_NAMES[startMonth + 3]} ${state.currentYear}`;

    // Draw the page
    drawPage(ctx, state.currentYear, state.pageIndex, state.customImage);
}

/**
 * Generates the hidden print container with all 6 pages (12 months)
 */
export function renderPrintView(state) {
    const container = document.getElementById('printContainer');
    container.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvas.className = 'print-page';
        
        const ctx = canvas.getContext('2d');
        drawPage(ctx, state.currentYear, i, state.customImage);
        
        container.appendChild(canvas);
    }
}

/**
 * Core drawing logic for a single page
 */
function drawPage(ctx, year, pageIndex, imageSrc) {
    // 1. Background
    ctx.fillStyle = '#ffffff'; // Standard white paper
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Artwork (Top ~45% minus binding)
    const artworkHeight = (CANVAS_HEIGHT * 0.45) - (BINDING_HEIGHT / 2);
    
    if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        // If image is cached, this draws immediately. If not, it might skip first frame.
        // For production, preloading is better, but this works for simple usage.
        if (img.complete) {
            drawImageCover(ctx, img, 0, 0, CANVAS_WIDTH, artworkHeight);
        } else {
            img.onload = () => drawImageCover(ctx, img, 0, 0, CANVAS_WIDTH, artworkHeight);
        }
    } else {
        // Placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, artworkHeight);
        ctx.fillStyle = '#999999';
        ctx.font = '70px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Area Gambar (Klik Unggah)', CANVAS_WIDTH / 2, artworkHeight / 2);
    }

    // 3. Spiral Binding & Hole
    drawBinding(ctx, artworkHeight, CANVAS_WIDTH, BINDING_HEIGHT);
    drawHole(ctx);

    // 4. Calendar Section
    const startMonth = pageIndex * 4;
    const sectionY = artworkHeight + BINDING_HEIGHT;
    const sectionHeight = CANVAS_HEIGHT - sectionY;
    
    const monthWidth = (CANVAS_WIDTH - (MARGIN * 3)) / 2;
    const monthHeight = (sectionHeight - (MARGIN * 3)) / 2;
    
    // Month 1 (Top Left)
    drawMonth(ctx, MARGIN, sectionY + MARGIN, monthWidth, monthHeight, year, startMonth);
    // Month 2 (Top Right)
    drawMonth(ctx, MARGIN * 2 + monthWidth, sectionY + MARGIN, monthWidth, monthHeight, year, startMonth + 1);
    // Month 3 (Bottom Left)
    drawMonth(ctx, MARGIN, sectionY + MARGIN * 2 + monthHeight, monthWidth, monthHeight, year, startMonth + 2);
    // Month 4 (Bottom Right)
    drawMonth(ctx, MARGIN * 2 + monthWidth, sectionY + MARGIN * 2 + monthHeight, monthWidth, monthHeight, year, startMonth + 3);
}

function drawMonth(ctx, x, y, w, h, year, monthIndex) {
    // Calculate rows needed
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDayIndex = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();
    const rowsNeeded = Math.ceil((startDayIndex + totalDays) / 7);
    const numRows = rowsNeeded === 6 ? 6 : 5;

    // Dimensions
    const headerHeight = 70;
    const daysHeaderHeight = 50;
    const gridHeight = h - headerHeight - daysHeaderHeight;
    const rowHeight = gridHeight / 6; 
    const colWidth = w / 7;
    
    const actualGridHeight = numRows * rowHeight;
    const actualTotalHeight = headerHeight + daysHeaderHeight + actualGridHeight;

    // 1. Header (Month Name)
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x, y, w, headerHeight);
    
    // Header Text
    ctx.fillStyle = '#ffffff';
    
    // Left: Year Month
    ctx.font = 'bold 40px Georgia';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${year} ${MONTH_NAMES[monthIndex]}`, x + 20, y + headerHeight / 2);

    // Right: Hijri & Javanese Date Range
    const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
    const hStartParts = hijriFormatter.formatToParts(firstDay);
    const hEndParts = hijriFormatter.formatToParts(lastDay);
    
    const getVal = (parts, type) => parts.find(p => p.type === type).value;
    
    const hStart = { d: getVal(hStartParts, 'day'), m: getVal(hStartParts, 'month'), y: getVal(hStartParts, 'year') };
    const hEnd = { d: getVal(hEndParts, 'day'), m: getVal(hEndParts, 'month'), y: getVal(hEndParts, 'year') };
    
    let hijriText = hStart.y === hEnd.y 
        ? `${hStart.d} ${hStart.m} - ${hEnd.d} ${hEnd.m} ${hStart.y}`
        : `${hStart.d} ${hStart.m} ${hStart.y} - ${hEnd.d} ${hEnd.m} ${hEnd.y}`;
    hijriText = toArabicNumerals(hijriText);

    const jStart = getJavaneseDate(firstDay);
    const jEnd = getJavaneseDate(lastDay);
    const jStartYear = `${jStart.getFullYear()} ${jStart.taun}`;
    const jEndYear = `${jEnd.getFullYear()} ${jEnd.taun}`;
    
    const javaneseText = jStartYear === jEndYear
        ? `${jStart.getDate()} ${jStart.wulan} - ${jEnd.getDate()} ${jEnd.wulan} ${jStartYear}`
        : `${jStart.getDate()} ${jStart.wulan} ${jStartYear} - ${jEnd.getDate()} ${jEnd.wulan} ${jEndYear}`;

    ctx.textAlign = 'right';
    ctx.font = '18px "Segoe UI", sans-serif';
    ctx.fillText(hijriText, x + w - 20, y + 25);
    ctx.fillText(javaneseText, x + w - 20, y + 50);

    // 2. Days Header Background
    ctx.fillStyle = '#f4e4bc';
    ctx.fillRect(x, y + headerHeight, w, daysHeaderHeight);

    // 3. Grid Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y + headerHeight + daysHeaderHeight, w, actualGridHeight);

    // 4. Grid Lines
    ctx.beginPath();
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;

    // Vertical lines
    for (let i = 1; i < 7; i++) {
        const lx = x + (i * colWidth);
        ctx.moveTo(lx, y + headerHeight);
        ctx.lineTo(lx, y + headerHeight + daysHeaderHeight + actualGridHeight);
    }

    // Horizontal lines
    // Line below Month Header
    ctx.moveTo(x, y + headerHeight);
    ctx.lineTo(x + w, y + headerHeight);
    
    // Line below Days Header
    ctx.moveTo(x, y + headerHeight + daysHeaderHeight);
    ctx.lineTo(x + w, y + headerHeight + daysHeaderHeight);

    // Row lines
    for (let i = 1; i < numRows; i++) {
        const ly = y + headerHeight + daysHeaderHeight + (i * rowHeight);
        ctx.moveTo(x, ly);
        ctx.lineTo(x + w, ly);
    }
    ctx.stroke();

    // 5. Days Text
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "Segoe UI", sans-serif';
    DAYS_HEADER.forEach((day, i) => {
        ctx.fillStyle = i === 0 ? '#d9534f' : '#4a4a4a'; // Red for Sunday
        ctx.fillText(day, x + (i * colWidth) + (colWidth / 2), y + headerHeight + (daysHeaderHeight / 2));
    });

    // 6. Dates
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    const totalCells = numRows * 7;
    const gridStartY = y + headerHeight + daysHeaderHeight;

    for (let i = 0; i < totalCells; i++) {
        const col = i % 7;
        const row = Math.floor(i / 7);
        
        const cellX = x + (col * colWidth);
        const cellY = gridStartY + (row * rowHeight);

        if (i < startDayIndex) {
            // Previous Month
            const dayNum = prevMonthLastDay - startDayIndex + 1 + i;
            ctx.fillStyle = '#cccccc';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(dayNum, cellX + (colWidth / 2), cellY + (rowHeight * 0.5));
        } else if (i >= startDayIndex + totalDays) {
            // Next Month
            const dayNum = i - (startDayIndex + totalDays) + 1;
            ctx.fillStyle = '#cccccc';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(dayNum, cellX + (colWidth / 2), cellY + (rowHeight * 0.5));
        } else {
            // Current Month
            const d = i - startDayIndex + 1;
            const dateObj = new Date(year, monthIndex, d);
            const jd = getJavaneseDate(dateObj);

            // Date Number
            ctx.fillStyle = col === 0 ? '#d9534f' : '#222222';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(d, cellX + (colWidth / 2), cellY + (rowHeight * 0.4));

            // Javanese Date (Date + Pasaran)
            ctx.fillStyle = '#8b5a2b';
            ctx.font = '18px sans-serif';
            const javaneseText = `(${jd.getDate()} ${jd.pasaran})`;
            ctx.fillText(javaneseText, cellX + (colWidth / 2), cellY + (rowHeight * 0.8));

            // Arabic Javanese Date (Top Right)
            ctx.fillStyle = '#555555';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(toArabicNumerals(jd.getDate()), cellX + colWidth - 15, cellY + 35);
            ctx.textAlign = 'center'; // Reset
        }
    }

    // 7. Outer Border
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, actualTotalHeight);
}

function drawBinding(ctx, y, w, h) {
    // Dark gap background (shadow between pages)
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, y, w, h);

    // Draw Coils
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    const step = 40;
    
    for (let i = 20; i < w; i += step) {
        const cx = i;
        
        // Back wire (darker)
        ctx.strokeStyle = '#555';
        ctx.beginPath();
        ctx.moveTo(cx - 8, y + 8);
        ctx.lineTo(cx + 8, y + h - 8);
        ctx.stroke();

        // Front wire (lighter/metallic highlight)
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.moveTo(cx + 8, y + h - 8);
        ctx.lineTo(cx + 20, y + 8);
        ctx.stroke();
    }
}

function drawHole(ctx) {
    const x = CANVAS_WIDTH / 2;
    const y = 40;
    
    // Hole shadow/depth
    ctx.beginPath();
    ctx.arc(x, y, HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    
    // Paper edge highlight around hole
    ctx.beginPath();
    ctx.arc(x, y, HOLE_RADIUS + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Helper to draw image "object-fit: cover" style
function drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let sx, sy, sWidth, sHeight;

    if (imgRatio < canvasRatio) {
        sWidth = img.width;
        sHeight = sWidth / canvasRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
    } else {
        sHeight = img.height;
        sWidth = sHeight * canvasRatio;
        sy = 0;
        sx = (img.width - sWidth) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

function toArabicNumerals(num) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/\d/g, d => arabicDigits[d]);
}