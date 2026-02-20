const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../pages');
const distDir = path.join(pagesDir, 'dist');
const pkgWebDir = path.resolve(__dirname, '../pkg/web');

console.log('🏗️  Building Pages...');

// 1. Ensure dist dir exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 2. Copy WASM to dist
// The bundled JS will look for the .wasm file relative to itself
console.log('📂 Copying WASM binary...');
if (fs.existsSync(path.join(pkgWebDir, 'tanggalan_bg.wasm'))) {
    fs.copyFileSync(path.join(pkgWebDir, 'tanggalan_bg.wasm'), path.join(distDir, 'tanggalan_bg.wasm'));
} else {
    console.error('❌ Error: pkg/web/tanggalan_bg.wasm not found. Run "npm run build" first.');
    process.exit(1);
}

// 3. Build JS Bundle using esbuild
console.log('🔨 Bundling JS...');
execSync(`npx esbuild ${path.join(pagesDir, 'js/app.js')} --bundle --minify --format=esm --outfile=${path.join(distDir, 'bundle.min.js')}`, { stdio: 'inherit' });
// Build Demo JS
execSync(`npx esbuild ${path.join(pagesDir, 'js/demo.js')} --bundle --minify --format=esm --outfile=${path.join(distDir, 'demo.min.js')}`, { stdio: 'inherit' });

// 4. Build CSS Bundle
console.log('🎨 Bundling CSS...');
execSync(`npx esbuild ${path.join(pagesDir, 'css/style.css')} --bundle --minify --outfile=${path.join(distDir, 'style.min.css')}`, { stdio: 'inherit' });

// 5. Copy and transform HTML files
console.log('📄 Copying HTML files...');
['index.html', 'preview.html'].forEach(file => {
    let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    // Adjust paths since files are now inside dist/
    content = content.replace(/src="dist\//g, 'src="');
    content = content.replace(/href="dist\//g, 'href="');
    fs.writeFileSync(path.join(distDir, file), content);
});

console.log('✅ Pages built successfully! Open pages/dist/index.html to view.');