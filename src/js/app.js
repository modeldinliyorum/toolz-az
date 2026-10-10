// Theme management

function initTheme() {

// The <head> script has already applied the stored theme before first paint;
// this re-applies it and syncs the icon.

const savedTheme = localStorage.getItem('theme');

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const themeToApply = savedTheme || (systemPrefersDark ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', themeToApply);

updateThemeIcon(themeToApply);

}

function updateThemeIcon(theme) {

const toggle = document.getElementById('themeToggle');

if (!toggle) return;

const isDark = theme === 'dark';

const glyph = toggle.querySelector('.nav-control-glyph');

const label = toggle.querySelector('.nav-control-label');

// The glyph shows the theme you would switch TO, the label names the current
// one -- so the button states both its own state and its action.

if (glyph) glyph.textContent = isDark ? '☀️' : '🌙';

if (label) label.textContent = isDark ? t('nav.theme_dark') : t('nav.theme_light');

// Expose the state, not just the action

toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');

}

function toggleTheme() {

const currentTheme = document.documentElement.getAttribute('data-theme');

const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

document.documentElement.setAttribute('data-theme', newTheme);

localStorage.setItem('theme', newTheme);

updateThemeIcon(newTheme);

}

function setupTheme() {

const toggle = document.getElementById('themeToggle');

if (!toggle) return;

toggle.addEventListener('click', toggleTheme);

initTheme();

}

// Tool definitions - easy to extend

const tools = [

{

id: 'compressor',

title: t('compressor.title'),

description: t('compressor.desc'),

icon: '🗜️',

status: 'ready',

titleKey: 'compressor.title',
descriptionKey: 'compressor.desc',},

{

id: 'resize-image',

title: t('resizer.title'),

description: t('resizer.desc'),

icon: '📐',

status: 'ready',

titleKey: 'resizer.title',
descriptionKey: 'resizer.desc',},

{

id: 'remove-bg',
title: t('bgrem.title'),
description: t('bgrem.desc'),
icon: '✂️',
status: 'ready',
beta: true,

titleKey: 'bgrem.title',
descriptionKey: 'bgrem.desc',},

{

id: 'palette',

title: t('palette.title'),

description: t('palette.desc'),

icon: '🎨',

status: 'ready',

titleKey: 'palette.title',
descriptionKey: 'palette.desc',},

{

id: 'qr-generator',

title: t('qr.title'),

description: t('qr.desc'),

icon: '📱',

status: 'ready',

titleKey: 'qr.title',
descriptionKey: 'qr.desc',},

{

id: 'convert-file',

title: t('conv.title'),

description: t('conv.desc'),

icon: '🔄',

status: 'ready',

titleKey: 'conv.title',
descriptionKey: 'conv.desc',},

{

id: 'metadata-cleaner',

title: t('meta.title'),

description: t('meta.desc'),

icon: '🧹',

status: 'ready',

titleKey: 'meta.title',
descriptionKey: 'meta.desc',},

{

id: 'base64-tool',

title: t('b64.title'),

description: t('b64.desc'),

icon: '🔤',

status: 'ready',

titleKey: 'b64.title',
descriptionKey: 'b64.desc',},

];

// tools[] holds t() results, which are fixed once the module loads. When the
// user switches language those captured strings are stale, so refresh them
// from the dictionary before re-rendering the cards.
function localizeTools() {

tools.forEach(tool => {

const titleKey = tool.titleKey;
const descKey = tool.descriptionKey;

if (titleKey) tool.title = t(titleKey);
if (descKey) tool.description = t(descKey);

});

}

// Tool status labels

function statusLabel(status) {

if (status === 'ready') return t('status.ready');

if (status === 'coming-soon') return t('status.coming_soon');

return t('status.in_development');

}

// Show exactly one section and keep the nav in sync

function showSection(id) {

document.querySelectorAll('.nav-link').forEach(l => {

const isTarget = l.dataset.target === id;

l.classList.toggle('active', isTarget);

if (isTarget) {

l.setAttribute('aria-current', 'page');

} else {

l.removeAttribute('aria-current');

}

});

document.querySelectorAll('.section').forEach(section => {

section.classList.remove('active');

});

const targetSection = document.getElementById(id);

// Guard: a nav link or card can point at a section that does not exist

if (!targetSection) return;

targetSection.classList.add('active');

// Scroll to the top of the document rather than into the content block: the
// navbar is sticky, so scrolling the block into view put the heading behind it.
window.scrollTo({ top: 0, behavior: 'smooth' });

}

// Render tool cards

// Mirror the navbar's real height into the spacer that stands in for it.
//
// The navbar is fixed, so it no longer occupies flow space and the page would
// otherwise start underneath it. It also wraps to two rows on narrow screens, so
// the offset cannot be a constant: it has to be measured.
function syncNavbarSpacer() {

const navbar = document.querySelector('.navbar');

const spacer = document.querySelector('.navbar-spacer');

if (!navbar || !spacer) return;

const height = Math.round(navbar.getBoundingClientRect().height);

if (height > 0) {

spacer.style.height = height + 'px';

// Scroll-anchored targets are offset by the same measured height, so a navbar
// that wraps on narrow screens cannot leave a heading underneath it.
document.documentElement.style.setProperty('--nav-h', height + 'px');

}

}

function renderTools() {

const grid = document.getElementById('toolsGrid');

grid.innerHTML = '';

tools.forEach(tool => {

// A real <button> is focusable and fires on Enter/Space for free, which a
// clickable <div> does not.

const card = document.createElement('button');

card.type = 'button';

card.className = 'tool-card';

card.dataset.id = tool.id;

card.setAttribute('aria-label', tool.title + ' - ' + statusLabel(tool.status) + (tool.beta ? ' (beta)' : ''));

card.innerHTML = `

<div class="tool-icon" aria-hidden="true">${tool.icon}</div>

<div class="tool-title">${tool.title}</div>

<div class="tool-desc">${tool.description}</div>

<div class="tool-status">
<span class="status-badge ${tool.status === 'ready' ? 'ready' : 'soon'}">${statusLabel(tool.status)}</span>
${tool.beta ? '<span class="status-badge beta">Beta</span>' : ''}
</div>

`;

card.addEventListener('click', () => {

if (tool.status === 'ready') {

showSection(tool.id);

} else if (tool.status === 'coming-soon') {

alert(tf('status.coming_soon_msg', { title: tool.title }));

}

});

grid.appendChild(card);

});

}

// About page: summarise the tools and wire the hero actions.
// Rendering from the same `tools` array means this list can never drift out of
// sync with the dashboard.

function renderAboutTools() {

const grid = document.getElementById('aboutToolGrid');

if (!grid) return;

grid.innerHTML = '';

tools.forEach(tool => {

const card = document.createElement('button');

card.type = 'button';

card.className = 'about-tool';

card.setAttribute('aria-label', t('about.open_tool') + ' ' + tool.title + (tool.beta ? ' (' + t('status.beta_aria') + ')' : ''));

card.innerHTML = `

<div class="about-tool-icon" aria-hidden="true">${tool.icon}</div>

<div class="about-tool-body">

<div class="about-tool-title">${tool.title}${tool.beta ? ' <span class="status-badge beta">Beta</span>' : ''}</div>

<div class="about-tool-desc">${tool.description}</div>

</div>

`;

card.addEventListener('click', () => {

if (tool.status === 'ready') showSection(tool.id);

});

grid.appendChild(card);

});

}

function setupAbout() {

// The hero no longer has call-to-action buttons, so this only renders the
// tool cards.

renderAboutTools();

refreshAboutCount();

}

// Keep the hero's count in sync with the real tool list, in the active language.
function refreshAboutCount() {
const countEl = document.getElementById('aboutToolCount');
if (!countEl) return;
const n = tools.filter(t => t.status === 'ready').length;
countEl.textContent = t('about.count_' + n, t('about.count_other'));
}

// Re-render the About tool grid (titles are translated) after a language change.
function refreshAboutTools() {
renderAboutTools();
refreshAboutCount();
}

// Navigation

function setupNavigation() {

document.querySelectorAll('.nav-link').forEach(link => {

link.addEventListener('click', (e) => {

e.preventDefault();

showSection(link.dataset.target);

});

});

// Mark the initially visible section in the nav

const currentId = document.querySelector('.section.active');

if (currentId) {

const currentLink = document.querySelector(`.nav-link[data-target="${currentId.id}"]`);

if (currentLink) currentLink.setAttribute('aria-current', 'page');

}

}

// Image Compressor functionality

let currentFile = null;

let originalImage = null;

let outputBlob = null;

let outputUrl = null;

// Color Palette Extractor functionality

let paletteCurrentFile = null;

let paletteImage = null;

let palettePalette = [];

let allColorsData = [];

let currentMode = 'dominant';

// QR Code Generator functionality

let qrGeneratedData = null;

let qrGenerated = false;

// Background Removal functionality

let bgCurrentFile = null;

let bgImage = null;

let bgOutputBlob = null;

let bgOutputUrl = null;

let bgProcessing = false;

// Load image for background removal

function loadBgImage(file) {


if (!file || !file.type.startsWith('image/')) {
    return;
}

bgCurrentFile = file;

const reader = new FileReader();

reader.onload = (e) => {

const img = new Image();

img.onload = () => {

bgImage = img;

// Update preview

document.getElementById('bgPreviewImage').src = e.target.result;

document.getElementById('bgPreviewFilename').textContent = file.name;

document.getElementById('bgPreviewSize').textContent = formatFileSize(file.size);

document.getElementById('bgPreviewDims').textContent = `${img.width} × ${img.height}`;

// Show preview and hide upload area

document.getElementById('bgImagePreview').classList.remove('hidden');

document.getElementById('bgUploadArea').classList.add('hidden');

// Hide any stale result or error while a new image loads

document.getElementById('bgOutputPreview').classList.add('hidden');

document.querySelectorAll('#remove-bg .bg-error').forEach(e => e.remove());

document.getElementById('bgProcessBtn').disabled = false;

// Background removal is started by the user via the "Remove Background" button

};

img.src = e.target.result;

};

reader.readAsDataURL(file);

}

function showCompressorError(message) {

const area = document.getElementById('uploadArea');

if (!area) return;

let box = area.parentElement.querySelector('.compressor-error');

if (!box) {

box = document.createElement('div');

box.className = 'error-message compressor-error';

area.after(box);

}

box.textContent = message;

}

function clearCompressorError() {

document.querySelectorAll('.compressor-error').forEach(e => e.remove());

}

// Clear background removal image

function clearBgImage() {

bgCurrentFile = null;

bgImage = null;

if (bgOutputUrl) {

URL.revokeObjectURL(bgOutputUrl);

bgOutputUrl = null;

}

bgOutputBlob = null;

document.getElementById('bgFileInput').value = '';

document.getElementById('bgPreviewImage').src = '';

document.getElementById('bgImagePreview').classList.add('hidden');

document.getElementById('bgUploadArea').classList.remove('hidden');

const outputPreview = document.getElementById('bgOutputPreview');

if (outputPreview) outputPreview.classList.add('hidden');

document.querySelectorAll('#remove-bg .bg-error').forEach(e => e.remove());

const processBtn = document.getElementById('bgProcessBtn');

if (processBtn) processBtn.disabled = false;

}

// Background removal module (loaded lazily on first use)
//
// The @imgly/background-removal library is fetched from the jsDelivr CDN only
// after the user clicks "Remove Background". All image segmentation runs
// locally in the browser (WASM / WebGPU); the image is never uploaded
// anywhere. The WASM + ONNX model assets are fetched from IMG.LY's CDN and
// cached by the browser on the first run.

let bgRemovalLibPromise = null;

function loadBgRemovalLib() {
// Reset the cached promise when it rejects, so a transient network failure
// does not permanently disable the tool. A rejected promise left in place
// made every later click fail instantly with no way to retry.
if (bgRemovalLibPromise === null) {
bgRemovalLibPromise = import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm').catch((err) => {
bgRemovalLibPromise = null;
throw err;
});
}
return bgRemovalLibPromise;
}

function setBgProcessing(active, status) {
const message = document.getElementById('bgProcessingMessage');
const statusEl = document.getElementById('bgProcessingStatus');
const processBtn = document.getElementById('bgProcessBtn');

if (active) {
message.classList.remove('hidden');
// Progress is reported as text, not as a bar.
//
// The bar was removed on purpose. This library reports every phase through a
// single progress callback, and only the model download carries a real byte
// total; inference fires events whose numbers are not a meaningful percentage.
// Drawing those as a fill level produced a figure that moved without meaning
// anything. A bar is also wrong for the common case, because after the first
// run the model is cached, there is no fetch to report, and the bar would sit
// empty through the whole of the work it appeared to be measuring.
if (statusEl) statusEl.textContent = status || '';
if (processBtn) processBtn.disabled = true;
} else {
message.classList.add('hidden');
// Clear the status text too: it stayed visible in the DOM after the run and
// reappeared with stale wording ("Downloading model...") on the next attempt.
if (statusEl) statusEl.textContent = '';
if (processBtn) processBtn.disabled = false;
}
}

function showBgError(message) {
document.querySelectorAll('#remove-bg .bg-error').forEach(e => e.remove());
const preview = document.getElementById('bgImagePreview');
if (!preview) return;
const err = document.createElement('div');
err.className = 'error-message bg-error';
err.textContent = message;
preview.after(err);
}

// Segmentation quality. The "large" model is markedly better on hair and
// clothing edges but costs a 176 MB download; the balanced model is 88 MB.
// Pick the balanced one by default so a first run is not dominated by a
// multi-minute download, and let the user opt into maximum quality.

const BG_MODELS = {

fast: { id: 'isnet_quint8', label: 'Fast — 44 MB, recommended' },

balanced: { id: 'isnet_fp16', label: 'Balanced — 88 MB' },

quality: { id: 'isnet', label: 'Best quality — 176 MB' }

};

// Default to the smallest model. It completes fastest and keeps a first run
// to a 44 MB download instead of 88 or 176 MB, so the tool feels responsive
// immediately. Users who want finer edges can switch to the larger models.
let bgModelChoice = 'fast';

async function processBackgroundRemoval() {
if (!bgImage || !bgCurrentFile) return;

// Reset previous output / error state
document.getElementById('bgOutputPreview').classList.add('hidden');
document.querySelectorAll('#remove-bg .bg-error').forEach(e => e.remove());

setBgProcessing(true, t('bgrem.loading_lib'));

try {
// Load the library lazily (downloads WASM/ONNX assets on the first run)
const mod = await loadBgRemovalLib();
setBgProcessing(true, t('bgrem.processing'));

// removeBackground returns a PNG Blob with a transparent background.
// A File is a Blob, so we can pass the user's image directly — it never
// leaves the browser.
//
// Model ids: isnet_quint8 = small (quantized, artifacts), isnet_fp16 =
// balanced, isnet = large (best quality, slowest and largest download).

const model = (BG_MODELS[bgModelChoice] || BG_MODELS.balanced).id;

const blob = await mod.removeBackground(bgCurrentFile, {
model: model,
output: { format: 'image/png', type: 'foreground' },
progress: (key, current, total) => {

// Only the network fetch phase carries a real byte total. Inference also fires
// events whose current/total are not a meaningful percentage, so rendering those
// as a download bar produced a figure that jumped around and never meant
// anything. Non-fetch phases are left to the spinner.
const isFetch = typeof key === 'string' && key.startsWith('fetch');

if (isFetch && total > 0) {

// Real byte progress, shown as a number because that is what it actually is.
const pct = Math.round((current / total) * 100);

setBgProcessing(true, t('bgrem.downloading_model_of') + model + ')... ' + pct + '%');

} else if (!isFetch) {

setBgProcessing(true, t('bgrem.processing'));

}

}
});

if (bgOutputUrl) URL.revokeObjectURL(bgOutputUrl);
bgOutputBlob = blob;
bgOutputUrl = URL.createObjectURL(blob);

document.getElementById('bgOutputImage').src = bgOutputUrl;
document.getElementById('bgOutputSize').textContent = formatFileSize(blob.size);
document.getElementById('bgOutputPreview').classList.remove('hidden');

} catch (err) {
console.error('Background removal error:', err);

showBgError(t('bgrem.error_failed') + ' ' + ((err && err.message) ? err.message : t('bgrem.error_network')));
} finally {
setBgProcessing(false);
}
}

// Setup background removal

function setupBackgroundRemoval() {

const uploadArea = document.getElementById('bgUploadArea');

const fileInput = document.getElementById('bgFileInput');

const browseBtn = document.getElementById('bgBrowseBtn');

const removeBtn = document.getElementById('bgRemoveBtn');

// Browse button click

browseBtn.addEventListener('click', () => fileInput.click());

// File input change

fileInput.addEventListener('change', (e) => {

if (e.target.files[0]) loadBgImage(e.target.files[0]);

});

// Drag and drop

uploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

uploadArea.classList.add('drag-over');

});

uploadArea.addEventListener('dragleave', () => {

uploadArea.classList.remove('drag-over');

});

uploadArea.addEventListener('drop', (e) => {

e.preventDefault();

uploadArea.classList.remove('drag-over');

const file = e.dataTransfer.files[0];

if (file && file.type.startsWith('image/')) loadBgImage(file);

});

// Remove button

removeBtn.addEventListener('click', clearBgImage);

// Remove Background button

const processBtn = document.getElementById('bgProcessBtn');

processBtn.addEventListener('click', () => {
if (bgImage && bgCurrentFile) processBackgroundRemoval();
});

// Model selector lets the user trade download size for edge quality

const modelSelect = document.getElementById('bgModelSelect');

if (modelSelect) {

modelSelect.addEventListener('change', () => {

if (BG_MODELS[modelSelect.value]) {

bgModelChoice = modelSelect.value;

}

});

}

// Download PNG button

const bgDownloadBtn = document.getElementById('bgDownloadBtn');

bgDownloadBtn.addEventListener('click', () => {
if (!bgOutputBlob) return;
const baseName = safeBaseName(bgCurrentFile && bgCurrentFile.name, 'image');
const url = URL.createObjectURL(bgOutputBlob);
const link = document.createElement('a');
link.href = url;
link.download = baseName + '-no-bg.png';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
setTimeout(() => URL.revokeObjectURL(url), 1000);
});

}

function formatFileSize(bytes) {

if (bytes < 1024) return bytes + ' B';

if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';

return (bytes / 1048576).toFixed(1) + ' MB';

}

// Set by the compressor's file handlers. True when the selection covers more
// than one file, in which case the preview image must not overwrite the
// dimension inputs: in a batch those inputs drive every file, not just the one
// shown in the preview.
let batchSelectedMultiple = false;

function loadImage(file) {

if (!file || !file.type.startsWith('image/')) {

showCompressorError(t('error.file_type'));

return;

}

clearCompressorError();

currentFile = file;

const reader = new FileReader();

reader.onload = (e) => {

const img = new Image();

img.onerror = () => {

showCompressorError(t('conv.error_read'));

};

img.onload = () => {

originalImage = img;

// Update preview

document.getElementById('previewImage').src = e.target.result;

document.getElementById('previewFilename').textContent = file.name;

document.getElementById('previewSize').textContent = formatFileSize(file.size);

document.getElementById('previewDims').textContent = `${img.width} × ${img.height}`;

// Adopt the image's own dimensions only when this is genuinely a single-image
// edit. When several files were picked, or the tool already holds a batch,
// resetting here silently discarded the size the user had already chosen, and
// the batch then ran with the wrong value.
if (!batchSelectedMultiple) {

document.getElementById('widthInput').value = img.width;

document.getElementById('heightInput').value = img.height;

}

// Show preview and controls, hide upload area

document.getElementById('imagePreview').classList.remove('hidden');

document.getElementById('controlsSection').classList.remove('hidden');

document.getElementById('outputPreview').classList.remove('hidden');

document.getElementById('outputControls').classList.remove('hidden');

document.getElementById('uploadArea').classList.add('hidden');

// Generate initial output preview

generateOutputPreview();

updateGenerateButtonText();

};

img.src = e.target.result;

};

reader.readAsDataURL(file);

}

function clearImage() {

currentFile = null;

originalImage = null;

outputBlob = null;

if (outputUrl) {

URL.revokeObjectURL(outputUrl);

outputUrl = null;

}

document.getElementById('fileInput').value = '';

document.getElementById('previewImage').src = '';

document.getElementById('imagePreview').classList.add('hidden');

document.getElementById('controlsSection').classList.add('hidden');

document.getElementById('outputPreview').classList.add('hidden');

document.getElementById('outputControls').classList.add('hidden');

document.getElementById('resultSection').classList.add('hidden');

document.getElementById('uploadArea').classList.remove('hidden');

clearCompressorError();

// Reset the quality readout, which otherwise stayed on "N/A" after switching
// to PNG and then removing the image.

const formatSelect = document.getElementById('formatSelect');

const qualitySlider = document.getElementById('qualitySlider');

const qualityValue = document.getElementById('qualityValue');

const formatNote = document.getElementById('formatNote');

if (qualitySlider.disabled && formatSelect.value === 'image/png') {

qualitySlider.disabled = false;

qualityValue.textContent = qualitySlider.value;

formatNote.textContent = t('compressor.quality_note');

}

}

// Generate output preview using Canvas

// The aspect ratio is read from the loaded image at the moment it is needed.
// It cannot be cached when the handlers are wired up, because no image exists
// yet at that point and a cached value would stay 1:1 forever.

function currentAspectRatio() {

return originalImage && originalImage.height > 0 ? originalImage.width / originalImage.height : 0;

}

// A canvas cannot be allocated for non-finite or absurd sizes. Browsers accept
// the assignment and then silently render nothing, which previously looked like
// a broken image rather than an invalid request, so clamp up front.
// The budget is deliberately modest: this is a browser tool, and anything
// beyond ~16 MP costs more in preview latency than it gains in utility.

const MAX_DIMENSION = 8192;

const MAX_PIXELS = 16 * 1000 * 1000;

function clampDimensions() {

let width = parseInt(document.getElementById('widthInput').value, 10);

let height = parseInt(document.getElementById('heightInput').value, 10);

if (!Number.isFinite(width) || width < 1) width = originalImage ? originalImage.width : 1;

if (!Number.isFinite(height) || height < 1) height = originalImage ? originalImage.height : 1;

width = Math.min(Math.round(width), MAX_DIMENSION);

height = Math.min(Math.round(height), MAX_DIMENSION);

// Enforce the total pixel budget while preserving the requested aspect ratio.

if (width * height > MAX_PIXELS) {

const shrink = Math.sqrt(MAX_PIXELS / (width * height));

width = Math.max(1, Math.floor(width * shrink));

height = Math.max(1, Math.floor(height * shrink));

}

return { width, height };

}

function syncDimensionInputs() {

const { width, height } = clampDimensions();

document.getElementById('widthInput').value = width;

document.getElementById('heightInput').value = height;

return { width, height };

}

// JPEG has no alpha channel, so a transparent source encodes as a black
// background. Flatten onto white first, matching the Image Converter.

function drawSourceOntoCanvas(ctx, image, width, height, mime) {

if (mime === 'image/jpeg') {

ctx.fillStyle = '#ffffff';

ctx.fillRect(0, 0, width, height);

}

ctx.drawImage(image, 0, 0, width, height);

}

// Guard against stale async estimates overwriting a newer one

let outputPreviewToken = 0;

function outputPreviewBlob(canvas, format, quality) {

return new Promise((resolve) => {

// Some browsers return null instead of a blob for formats they cannot encode.

try {

canvas.toBlob((blob) => resolve(blob), format, quality);

} catch (e) {

resolve(null);

}

});

}

function generateOutputPreview() {

if (!originalImage) return;

const { width, height } = clampDimensions();

const format = document.getElementById('formatSelect').value;

const quality = parseInt(document.getElementById('qualitySlider').value) / 100;

const canvas = document.getElementById('outputCanvas');

const ctx = canvas.getContext('2d');

canvas.width = width;

canvas.height = height;

drawSourceOntoCanvas(ctx, originalImage, width, height, format);

// Estimate with toBlob, which is async, rather than toDataURL, which
// base64-encoded the whole canvas synchronously on every keystroke and froze
// the page for seconds on large sizes.

const qualityValue = (format === 'image/jpeg' || format === 'image/webp') ? quality : undefined;

document.getElementById('outputDims').textContent = `${width} × ${height}`;

document.getElementById('outputSize').textContent = t('compressor.estimated_label');

const token = ++outputPreviewToken;

outputPreviewBlob(canvas, format, qualityValue).then((blob) => {

if (token !== outputPreviewToken) return;

document.getElementById('outputSize').textContent = blob
? `Estimated: ${formatFileSize(blob.size)}`
: t('compressor.preview_generated');

}).catch(() => {

if (token !== outputPreviewToken) return;

document.getElementById('outputSize').textContent = t('compressor.preview_generated');

});

}

// Setup resize input handlers

function setupResizeControls() {

const widthInput = document.getElementById('widthInput');

const heightInput = document.getElementById('heightInput');

const aspectRatioLock = document.getElementById('aspectRatioLock');

const resetSizeBtn = document.getElementById('resetSizeBtn');

widthInput.addEventListener('input', () => {

const aspectRatio = currentAspectRatio();

if (aspectRatioLock.checked && aspectRatio > 0 && originalImage) {

const newWidth = parseInt(widthInput.value, 10) || originalImage.width;

heightInput.value = Math.round(newWidth / aspectRatio);

}

syncDimensionInputs();

generateOutputPreview();

updateGenerateButtonText();

});

heightInput.addEventListener('input', () => {

const aspectRatio = currentAspectRatio();

if (aspectRatioLock.checked && aspectRatio > 0 && originalImage) {

const newHeight = parseInt(heightInput.value, 10) || originalImage.height;

widthInput.value = Math.round(newHeight * aspectRatio);

}

syncDimensionInputs();

generateOutputPreview();

updateGenerateButtonText();

});

resetSizeBtn.addEventListener('click', () => {

if (!originalImage) return;

widthInput.value = originalImage.width;

heightInput.value = originalImage.height;

generateOutputPreview();

updateGenerateButtonText();

});

aspectRatioLock.addEventListener('change', () => {

const aspectRatio = currentAspectRatio();

if (aspectRatioLock.checked && aspectRatio > 0 && originalImage) {

const width = parseInt(widthInput.value, 10) || originalImage.width;

heightInput.value = Math.round(width / aspectRatio);

}

generateOutputPreview();

updateGenerateButtonText();

});

}

function setupCompressor() {

const uploadArea = document.getElementById('uploadArea');

const fileInput = document.getElementById('fileInput');

const browseBtn = document.getElementById('browseBtn');

const removeBtn = document.getElementById('removeBtn');

const formatSelect = document.getElementById('formatSelect');

const qualitySlider = document.getElementById('qualitySlider');

const qualityValue = document.getElementById('qualityValue');

const formatNote = document.getElementById('formatNote');

// Browse button click

browseBtn.addEventListener('click', () => fileInput.click());

// File input change

fileInput.addEventListener('change', (e) => {

// More than one file means a batch. The preview then shows only the first
// file, and adopting that file's dimensions would throw away the size the user
// had already chosen for the whole set.
batchSelectedMultiple = e.target.files.length > 1 || batchIsActive('compress');

if (e.target.files[0]) loadImage(e.target.files[0]);

});

// Drag and drop

uploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

uploadArea.classList.add('drag-over');

});

uploadArea.addEventListener('dragleave', () => {

uploadArea.classList.remove('drag-over');

});

uploadArea.addEventListener('drop', (e) => {

e.preventDefault();

uploadArea.classList.remove('drag-over');

const file = e.dataTransfer.files[0];

batchSelectedMultiple = e.dataTransfer.files.length > 1 || batchIsActive('compress');

if (file && file.type.startsWith('image/')) loadImage(file);

});

// Remove button

removeBtn.addEventListener('click', clearImage);

// Setup resize controls

setupResizeControls();

// Format change

formatSelect.addEventListener('change', () => {

const format = formatSelect.value;

if (format === 'image/png') {

qualitySlider.disabled = true;

qualityValue.textContent = 'N/A';

formatNote.textContent = t('compressor.quality_note_png');

} else {

qualitySlider.disabled = false;

qualityValue.textContent = document.getElementById('qualitySlider').value;

formatNote.textContent = t('compressor.quality_note');

}

generateOutputPreview();

updateGenerateButtonText();

});

// Quality slider

qualitySlider.addEventListener('input', () => {

qualityValue.textContent = qualitySlider.value;

generateOutputPreview();

});

// Generate button

const generateBtn = document.getElementById('generateBtn');

generateBtn.addEventListener('click', handleGenerate);

// Download button

const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', handleDownload);

// Initialize format state (disable quality for PNG on page load)

formatSelect.dispatchEvent(new Event('change'));

}

// QR Code Generator functions

// Generate QR code using qrcodejs library

// The rendered QR plus its module matrix. Keeping the matrix lets the SVG
// export emit real vector modules instead of re-guessing geometry by scanning
// pixels, which produced malformed, undecodable SVG.

let qrMatrix = null;

let qrModuleCount = 0;

// The library's margin-less render, kept so the quiet zone can be composed
// identically for the on-screen preview and for the downloaded file.
let qrRawElement = null;

function generateQRCode(text, container, size, qrColor, bgColor, margin) {

try {

container.innerHTML = '';

const qr = new QRCode(container, {

text: text,

width: parseInt(size, 10),

height: parseInt(size, 10),

colorDark: qrColor,

colorLight: bgColor,

correctLevel: QRCode.CorrectLevel.H,

margin: parseInt(margin, 10)

});

// Capture the exact module matrix from the library's own model

qrMatrix = null;

qrModuleCount = 0;

const model = qr._oQRCode;

if (model && typeof model.getModuleCount === 'function' && typeof model.isDark === 'function') {

qrModuleCount = model.getModuleCount();

qrMatrix = [];

for (let r = 0; r < qrModuleCount; r++) {

const row = new Uint8Array(qrModuleCount);

for (let c = 0; c < qrModuleCount; c++) {

row[c] = model.isDark(r, c) ? 1 : 0;

}

qrMatrix.push(row);

}

}

// Keep the library's own output. qrcodejs 1.0.0 ignores the `margin` option,
// so this element has NO quiet zone and is the raw source for both the preview
// composition and the download.
qrRawElement = container.querySelector('img, canvas, svg') || null;

return qrRawElement ? true : false;

} catch (err) {

console.error('QR generation error:', err);

qrMatrix = null;

qrModuleCount = 0;

return false;

}

}

// Compose the quiet zone around the code.
//
// qrcodejs renders the modules edge-to-edge: its `margin` option is not
// implemented in 1.0.0. The download path already built its own padding, so the
// preview looked different from the file -- the margin was invisible on screen
// even though it was present in the export. Both paths now call this, so what
// you see is what you get.
function qrQuietPad(sourceWidth, quietModules) {

const moduleSize = qrModuleCount ? sourceWidth / qrModuleCount : 0;

return moduleSize > 0
? Math.round(moduleSize * quietModules)
: Math.round(sourceWidth * 0.04);

}

function composeQrWithMargin(sourceEl, bgColor, quietModules) {

const requested = parseInt(qrSize.value, 10) || 256;

const w = sourceEl.naturalWidth || sourceEl.width || requested;

const h = sourceEl.naturalHeight || sourceEl.height || requested;

const pad = qrQuietPad(w, quietModules);

const out = document.createElement('canvas');

out.width = w + pad * 2;

out.height = h + pad * 2;

const ctx = out.getContext('2d');

ctx.fillStyle = bgColor;

ctx.fillRect(0, 0, out.width, out.height);

// Keep module edges crisp; smoothing would blur the finder patterns.
ctx.imageSmoothingEnabled = false;

ctx.drawImage(sourceEl, 0, 0, w, h, pad, pad, w, h);

return out;

}

// Check color contrast (simplified luminance check)

function colorsTooSimilar(color1, color2) {

const getLuminance = (hex) => {

const c1 = parseInt(hex.slice(1, 3), 16) / 255;

const c2 = parseInt(hex.slice(3, 5), 16) / 255;

const c3 = parseInt(hex.slice(5, 7), 16) / 255;

const [r, g, b] = [c1, c2, c3].map(c =>

c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

);

return 0.2126 * r + 0.7152 * g + 0.0722 * b;

};

const lum1 = getLuminance(color1);

const lum2 = getLuminance(color2);

// WCAG contrast is (L1 + 0.05) / (L2 + 0.05). Without the 0.05 offset two
// black colors divide 0 by 0 and yield NaN, and `NaN < 3` is false - so
// black-on-black silently passed the check and produced an unscannable code.

const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

return ratio < 3;

}

// Validate HEX color

function isValidHex(hex) {

if (!hex || hex.length !== 7 || !hex.startsWith('#')) return false;

return /^[0-9A-Fa-f]{6}$/.test(hex.slice(1));

}

// Normalize HEX to uppercase with #

function normalizeHex(hex) {

if (!hex.startsWith('#')) hex = '#' + hex;

return hex.toUpperCase();

}

// Build a safe download name from a user-supplied file name.
//
// The browser strips path separators itself, but control characters, shell
// metacharacters and over-long names still reach the filesystem, which produces
// odd files (or none at all on Windows, where CON/PRN/AUX are reserved).
// Strip the extension, drop anything unsafe, and cap the length.
function safeBaseName(name, fallback) {

const fallbackName = fallback || 'image';

if (typeof name !== 'string' || !name) return fallbackName;

// Take the last path segment in case a name ever arrives with separators.
let base = name.split(/[\\/]/).pop().replace(/\.[^/.]+$/, '');

// Remove control characters, path/reserved characters, and shell metacharacters.
base = base.replace(/[\u0000-\u001f\u007f]/g, '')
.replace(/[<>:"|?*]/g, '')
.replace(/\s+/g, ' ')
.trim();

// Reserved device names on Windows.
if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(base)) base = '_' + base;

// Leave room for the suffix and extension appended by callers.
if (base.length > 80) base = base.slice(0, 80).trim();

return base || fallbackName;

}

// Download a blob under a given filename

function downloadBlob(blob, filename) {

if (!blob) return;

const url = URL.createObjectURL(blob);

const link = document.createElement('a');

link.href = url;

link.download = filename;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

setTimeout(() => URL.revokeObjectURL(url), 1000);

}

// Build a true vector SVG straight from the module matrix, with a proper
// quiet zone. Horizontal runs are merged to keep the path compact.

function buildQRSvg(darkColor, bgColor, quietZone) {

if (!qrMatrix || !qrModuleCount) return null;

const total = qrModuleCount + quietZone * 2;

let path = '';

for (let r = 0; r < qrModuleCount; r++) {

const row = qrMatrix[r];

let c = 0;

while (c < qrModuleCount) {

if (!row[c]) { c++; continue; }

let run = 1;

while (c + run < qrModuleCount && row[c + run]) run++;

path += `M${quietZone + c} ${quietZone + r}h${run}v1h-${run}z`;

c += run;

}

}

return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" shape-rendering="crispEdges">
<rect width="100%" height="100%" fill="${bgColor}"/>
<path d="${path}" fill="${darkColor}"/>
</svg>`;

}

// Setup QR generator

function setupQRGenerator() {

const qrInput = document.getElementById('qrInput');

const qrGenerateBtn = document.getElementById('qrGenerateBtn');

const qrClearBtn = document.getElementById('qrClearBtn');

const qrDownloadBtn = document.getElementById('qrDownloadBtn');

const qrError = document.getElementById('qrError');

const qrPreview = document.getElementById('qrPreview');

const qrContainer = document.getElementById('qrContainer');

const qrSize = document.getElementById('qrSize');

const qrMargin = document.getElementById('qrMargin');

const qrColor = document.getElementById('qrColor');

const qrBgColor = document.getElementById('qrBgColor');

const qrColorInput = document.getElementById('qrColorInput');

const qrBgColorInput = document.getElementById('qrBgColorInput');

const qrWarning = document.getElementById('qrWarning');

const qrFormat = document.getElementById('qrFormat');

const qrContainerWrapper = document.getElementById('qrContainerWrapper');

const qrDownloadSection = document.getElementById('qrDownloadSection');

// Reflect the selected margin on the wrapper for styling

qrMargin.addEventListener('change', () => {

qrContainerWrapper.setAttribute('data-margin', qrMargin.value);

refreshQrIfGenerated();

});

// Redraw at the new size instead of waiting for another Generate click.
qrSize.addEventListener('change', refreshQrIfGenerated);

qrContainerWrapper.setAttribute('data-margin', qrMargin.value);

qrColor.addEventListener('input', () => {

qrColorInput.value = qrColor.value;

qrColorInput.classList.remove('invalid');

refreshContrastWarning();

refreshQrIfGenerated();

});

qrColorInput.addEventListener('input', () => {

const hex = qrColorInput.value.trim();

if (isValidHex(hex)) {

const normalized = normalizeHex(hex);

qrColor.value = normalized;

qrColorInput.value = normalized;

qrColorInput.classList.remove('invalid');

// Redraw only while the value is valid, so a half-typed hex never renders.
refreshContrastWarning();

refreshQrIfGenerated();

} else if (hex.length > 0) {

qrColorInput.classList.add('invalid');

}

});

qrBgColor.addEventListener('input', () => {

qrBgColorInput.value = qrBgColor.value;

qrBgColorInput.classList.remove('invalid');

refreshContrastWarning();

refreshQrIfGenerated();

});

qrBgColorInput.addEventListener('input', () => {

const hex = qrBgColorInput.value.trim();

if (isValidHex(hex)) {

const normalized = normalizeHex(hex);

qrBgColor.value = normalized;

qrBgColorInput.value = normalized;

qrBgColorInput.classList.remove('invalid');

// Redraw only while the value is valid, so a half-typed hex never renders.
refreshContrastWarning();

refreshQrIfGenerated();

} else if (hex.length > 0) {

qrBgColorInput.classList.add('invalid');

}

});

// Warn immediately if the current colors are unreadable

function refreshContrastWarning() {

qrWarning.classList.toggle('hidden', !colorsTooSimilar(qrColor.value, qrBgColor.value));

}

qrColor.addEventListener('input', refreshContrastWarning);

qrBgColor.addEventListener('input', refreshContrastWarning);

refreshContrastWarning();

// Animate the QR canvas from its previous on-screen size to the new one.
//
// The canvas is a different element on every redraw, so a plain CSS transition
// has nothing to attach to. Animating explicitly from the measured old size to
// the new one is what makes a margin change read as a smooth grow or shrink.
// Holds the in-flight resize so a rapid second change can take over from
// exactly where the first one had reached, instead of restarting from the
// previous settled size and stuttering.
let qrResizeAnimation = null;

function animateQrResize(canvas, fromRect) {

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

if (typeof canvas.animate !== 'function') return;

const to = canvas.getBoundingClientRect();

if (!to.width || !to.height || !fromRect.width || !fromRect.height) return;

// Nothing actually changed, so there is nothing to animate. Running a tween to
// the size it already has produces a visible flicker on a no-op.
const moved = Math.abs(to.width - fromRect.width) > 0.5 || Math.abs(to.height - fromRect.height) > 0.5;

if (!moved) return;

// A change that lands mid-flight continues from the current interpolated size
// rather than snapping back to where the previous tween began.
if (qrResizeAnimation) {

qrResizeAnimation.cancel();

qrResizeAnimation = null;

}

const frames = [
{ width: fromRect.width + 'px', height: fromRect.height + 'px', opacity: 0.72 },
{ width: to.width + 'px', height: to.height + 'px', opacity: 1 }
];

const anim = canvas.animate(frames, {

duration: 420,

// Decelerating curve with almost no initial movement: the size change eases
// out rather than snapping, which is what reads as smooth at this duration.
easing: 'cubic-bezier(.16, 1, .3, 1)',

fill: 'none'

});

qrResizeAnimation = anim;

if (anim.finished && anim.finished.catch) {

anim.finished.then(() => {

if (qrResizeAnimation === anim) qrResizeAnimation = null;

}).catch(() => {});

}

}


// Renders the QR from the current field values. Shared by the Generate button
// and by the live update on size/margin/colour change, so those controls never
// require a second click.
function renderQrNow() {



const text = qrInput.value.trim();

if (!text) {

qrError.classList.remove('hidden');

return;

}

qrError.classList.add('hidden');

refreshContrastWarning();

// The margin is rendered inside the code by the library; the preview no
// longer adds CSS padding for the same margin, so what you see is what
// you download.

const ok = generateQRCode(text, qrContainer, qrSize.value, qrColor.value, qrBgColor.value, qrMargin.value);

if (ok) {

// Replace the raw render with the composed one so the on-screen quiet zone is
// visible and identical to the exported file.
const composed = composeQrWithMargin(qrRawElement, qrBgColor.value, Math.max(2, parseInt(qrMargin.value, 10) || 4));

// Remember the on-screen size so a re-render (margin/size/colour change) can
// grow into it instead of snapping.
const previous = qrContainer.querySelector('canvas, img');

const previousRect = previous ? previous.getBoundingClientRect() : null;

qrContainer.innerHTML = '';

qrContainer.appendChild(composed);

if (previousRect && previousRect.width > 0) {

animateQrResize(composed, previousRect);

}


qrPreview.classList.remove('hidden');

qrDownloadSection.classList.remove('hidden');

qrGenerated = true;

} else {

alert(t('qr.error_failed'));

}



}

qrGenerateBtn.addEventListener('click', renderQrNow);

// Once a code exists, changing size, margin or a colour should just redraw it.
// Before that there is nothing to redraw, so the button still does the work.
function refreshQrIfGenerated() {

if (!qrGenerated) return;

const text = qrInput.value.trim();

if (!text) return;

renderQrNow();

}


qrClearBtn.addEventListener('click', () => {

qrInput.value = '';

qrPreview.classList.add('hidden');

qrDownloadSection.classList.add('hidden');

qrError.classList.add('hidden');

qrWarning.classList.add('hidden');

qrContainer.innerHTML = '';

qrMatrix = null;

qrModuleCount = 0;

qrGenerated = false;

qrRawElement = null;

});

qrDownloadBtn.addEventListener('click', () => {

const format = qrFormat.value;

const bg = qrBgColor.value;

const dark = qrColor.value;

const quiet = Math.max(2, parseInt(qrMargin.value, 10) || 4);

if (format === 'svg') {

const svg = buildQRSvg(dark, bg, quiet);

if (!svg) {

alert(t('qr.error_no_code'));

return;

}

downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qrcode.svg');

return;

}

// Use the library's raw render: qrContainer now holds the composed preview,
// which already carries the quiet zone. Reading it here would add a second one.
const element = qrRawElement || qrContainer.querySelector('canvas, img, svg');

if (!element) {

alert(t('qr.error_no_code'));

return;

}

const requested = parseInt(qrSize.value, 10) || 256;

const source = document.createElement('canvas');

source.width = element.naturalWidth || element.width || requested;

source.height = element.naturalHeight || element.height || requested;

const sctx = source.getContext('2d');

sctx.fillStyle = bg;

sctx.fillRect(0, 0, source.width, source.height);

sctx.drawImage(element, 0, 0, source.width, source.height);

// Compose the quiet zone into a LARGER canvas. The previous code sized the
// canvas to the QR and then drew at (padding, padding), pushing the right and
// bottom edges outside the canvas and silently cropping them.

const pad = qrQuietPad(source.width, quiet);

const out = document.createElement('canvas');

out.width = source.width + pad * 2;

out.height = source.height + pad * 2;

const octx = out.getContext('2d');

octx.fillStyle = bg;

octx.fillRect(0, 0, out.width, out.height);

octx.drawImage(source, pad, pad);

if (format === 'jpg') {

out.toBlob((blob) => {

if (blob) downloadBlob(blob, 'qrcode.jpg');

}, 'image/jpeg', 0.95);

} else {

out.toBlob((blob) => {

if (blob) downloadBlob(blob, 'qrcode.png');

}, 'image/png');

}

});

}

// Image Resizer functionality

let resizeImage = null;

let resizeOriginalWidth = 0;

let resizeOriginalHeight = 0;

let resizeAspectRatio = 1;

let resizeOutputBlob = null;

let resizeOutputUrl = null;

let resizeSourceUrl = null;

let resizeOriginalFilename = '';

const RESIZE_MIN = 1;

const RESIZE_MAX = 8192;

const RESIZE_MAX_PIXELS = 16 * 1000 * 1000;

// Re-encoding a lossy source at high quality avoids compounding artifacts

const RESIZE_QUALITY = 0.92;

// Derive the download extension from the real encoded blob type

const RESIZE_EXT = {

'image/jpeg': 'jpg',

'image/png': 'png',

'image/webp': 'webp',

'image/bmp': 'bmp',

'image/gif': 'gif',

'image/avif': 'avif'

};

function clampResizeValue(v, fallback) {

let n = parseInt(v, 10);

if (!Number.isFinite(n) || n < RESIZE_MIN) n = fallback;

return Math.min(n, RESIZE_MAX);

}

function clampResizeDimensions(width, height) {

let w = clampResizeValue(width, resizeOriginalWidth || RESIZE_MIN);

let h = clampResizeValue(height, resizeOriginalHeight || RESIZE_MIN);

if (w * h > RESIZE_MAX_PIXELS) {

const shrink = Math.sqrt(RESIZE_MAX_PIXELS / (w * h));

w = Math.max(RESIZE_MIN, Math.floor(w * shrink));

h = Math.max(RESIZE_MIN, Math.floor(h * shrink));

}

return { width: w, height: h };

}

function showResizeError(message) {

const area = document.getElementById('resizeUploadArea');

if (!area) return;

let box = area.parentElement.querySelector('.resize-error');

if (!box) {

box = document.createElement('div');

box.className = 'error-message resize-error';

area.after(box);

}

box.textContent = message;

}

function clearResizeError() {

document.querySelectorAll('.resize-error').forEach(e => e.remove());

}

function resetResizeUI() {

const map = {

resizeUploadArea: 'remove',

resizeImagePreview: 'add',

resizeControls: 'add',

resizeOutputControls: 'add',

resizeOutputPreview: 'add',

resizeDownloadBtn: 'add'

};

Object.keys(map).forEach((id) => {

const el = document.getElementById(id);

if (el) el.classList[map[id]]('hidden');

});

const fileInput = document.getElementById('resizeFileInput');

if (fileInput) fileInput.value = '';

clearResizeError();

}

function setupResizeImage() {

const resizeUploadArea = document.getElementById('resizeUploadArea');

const resizeFileInput = document.getElementById('resizeFileInput');

const resizeBrowseBtn = document.getElementById('resizeBrowseBtn');

const resizeImagePreview = document.getElementById('resizeImagePreview');

const resizePreviewImage = document.getElementById('resizePreviewImage');

const resizePreviewFilename = document.getElementById('resizePreviewFilename');

const resizePreviewSize = document.getElementById('resizePreviewSize');

const resizePreviewDims = document.getElementById('resizePreviewDims');

const resizeRemoveBtn = document.getElementById('resizeRemoveBtn');

const resizeControls = document.getElementById('resizeControls');

const resizeWidthInput = document.getElementById('resizeWidthInput');

const resizeHeightInput = document.getElementById('resizeHeightInput');

const resizeAspectRatioLock = document.getElementById('resizeAspectRatioLock');

const resizeResetBtn = document.getElementById('resizeResetBtn');

const resizeScaleSlider = document.getElementById('resizeScaleSlider');

const resizeScaleValue = document.getElementById('resizeScaleValue');

// True when the resizer is handling more than one file; see the compressor's
// equivalent note for why the source dimensions must not overwrite the inputs.
let resizeBatchSelected = false;

function loadResizeImage(file) {

if (!file || !file.type || !file.type.startsWith('image/')) {

showResizeError(t('error.file_type'));

return;

}

clearResizeError();

const objectUrl = URL.createObjectURL(file);

const img = new Image();

img.onload = () => {

if (resizeSourceUrl) URL.revokeObjectURL(resizeSourceUrl);

resizeSourceUrl = objectUrl;

resizeImage = img;

resizeOriginalWidth = img.naturalWidth;

resizeOriginalHeight = img.naturalHeight;

resizeAspectRatio = resizeOriginalWidth / resizeOriginalHeight;

resizePreviewImage.src = objectUrl;

resizePreviewFilename.textContent = file.name;

resizePreviewSize.textContent = formatFileSize(file.size);

resizePreviewDims.textContent = `${resizeOriginalWidth} × ${resizeOriginalHeight}`;

// Only adopt the source dimensions for a genuine single-image edit. With a
// batch queued, or several files picked at once, resetting here discards the
// target size the user already chose, and the batch then resizes every file to
// the first file's size instead.

if (!resizeBatchSelected) {

resizeWidthInput.value = resizeOriginalWidth;

resizeHeightInput.value = resizeOriginalHeight;

resizeScaleSlider.value = 100;

resizeScaleValue.textContent = 100;

}

resizeOriginalFilename = file.name;

resizeImagePreview.classList.remove('hidden');

resizeControls.classList.remove('hidden');

document.getElementById('resizeOutputControls').classList.remove('hidden');

// The upload area is hidden while an image is loaded, matching every other
// tool. It used to stay visible underneath the preview.

resizeUploadArea.classList.add('hidden');

};

img.onerror = () => {

URL.revokeObjectURL(objectUrl);

showResizeError(t('conv.error_read'));

};

img.src = objectUrl;

}

resizeBrowseBtn.addEventListener('click', () => resizeFileInput.click());

resizeFileInput.addEventListener('change', (e) => {

resizeBatchSelected = e.target.files.length > 1 || batchIsActive('resize');

if (e.target.files[0]) loadResizeImage(e.target.files[0]);

});

resizeUploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

resizeUploadArea.classList.add('drag-over');

});

resizeUploadArea.addEventListener('dragleave', () => resizeUploadArea.classList.remove('drag-over'));

resizeUploadArea.addEventListener('drop', (e) => {

e.preventDefault();

resizeUploadArea.classList.remove('drag-over');

const file = e.dataTransfer.files[0];

if (file) loadResizeImage(file);

});

// One handler per input: previously widthInput had two competing 'input'
// listeners that both rewrote the height and the scale.

function syncScaleFromWidth() {

if (!resizeOriginalWidth) return;

const width = parseInt(resizeWidthInput.value, 10);

if (!Number.isFinite(width) || width < RESIZE_MIN) return;

const scale = Math.round((width / resizeOriginalWidth) * 100);

const clamped = Math.min(200, Math.max(10, scale));

resizeScaleSlider.value = clamped;

resizeScaleValue.textContent = clamped;

}

resizeWidthInput.addEventListener('input', () => {

if (!resizeImage) return;

const width = parseInt(resizeWidthInput.value, 10);

if (Number.isFinite(width) && width >= RESIZE_MIN && resizeAspectRatioLock.checked) {

resizeHeightInput.value = Math.round(width / resizeAspectRatio);

}

// Clamp what was typed. Without this an absurd value stayed in the field and
// the height field could be driven past any real canvas limit.
const { width: cw, height: ch } = clampResizeDimensions(
Number.isFinite(width) && width > 0 ? width : resizeOriginalWidth,
Number.isFinite(parseInt(resizeHeightInput.value, 10)) ? parseInt(resizeHeightInput.value, 10) : resizeOriginalHeight
);

if (cw !== resizeWidthInput.value) resizeWidthInput.value = cw;

if (ch !== resizeHeightInput.value) resizeHeightInput.value = ch;

syncScaleFromWidth();

});

resizeHeightInput.addEventListener('input', () => {

if (!resizeImage) return;

const height = parseInt(resizeHeightInput.value, 10);

if (Number.isFinite(height) && height >= RESIZE_MIN && resizeAspectRatioLock.checked) {

resizeWidthInput.value = Math.round(height * resizeAspectRatio);

}

const { width: cw, height: ch } = clampResizeDimensions(
Number.isFinite(parseInt(resizeWidthInput.value, 10)) ? parseInt(resizeWidthInput.value, 10) : resizeOriginalWidth,
Number.isFinite(height) && height > 0 ? height : resizeOriginalHeight
);

if (cw !== resizeWidthInput.value) resizeWidthInput.value = cw;

if (ch !== resizeHeightInput.value) resizeHeightInput.value = ch;

syncScaleFromWidth();

});

resizeResetBtn.addEventListener('click', () => {

if (!resizeImage) return;

resizeWidthInput.value = resizeOriginalWidth;

resizeHeightInput.value = resizeOriginalHeight;

resizeScaleSlider.value = 100;

resizeScaleValue.textContent = 100;

});

resizeScaleSlider.addEventListener('input', () => {

if (!resizeImage) return;

const scale = parseFloat(resizeScaleSlider.value);

resizeScaleValue.textContent = scale;

// Derive both dimensions from the ORIGINAL size so the slider is absolute.
// The old code multiplied the current height, which compounded on every drag.

const { width, height } = clampResizeDimensions(
Math.round(resizeOriginalWidth * (scale / 100)),
Math.round(resizeOriginalHeight * (scale / 100))
);

resizeWidthInput.value = width;

resizeHeightInput.value = height;

});

resizeRemoveBtn.addEventListener('click', () => {

resizeImage = null;

resizeOriginalWidth = 0;

resizeOriginalHeight = 0;

resizeOutputBlob = null;

resizeOriginalFilename = '';

if (resizeOutputUrl) {

URL.revokeObjectURL(resizeOutputUrl);

resizeOutputUrl = null;

}

if (resizeSourceUrl) {

URL.revokeObjectURL(resizeSourceUrl);

resizeSourceUrl = null;

}

const previewImg = document.getElementById('resizePreviewImage');

if (previewImg) previewImg.src = '';

resetResizeUI();

});

}

// Generate resized image

function generateResizedImage() {

if (!resizeImage) return null;

const { width, height } = clampResizeDimensions(
document.getElementById('resizeWidthInput').value,
document.getElementById('resizeHeightInput').value
);

// Encode in the source's own format and only apply quality where it applies

const type = resizeImage.type || 'image/png';

const lossy = (type === 'image/jpeg' || type === 'image/webp');

const canvas = document.createElement('canvas');

canvas.width = width;

canvas.height = height;

const ctx = canvas.getContext('2d');

// JPEG cannot store transparency, so flatten onto white first

if (type === 'image/jpeg') {

ctx.fillStyle = '#ffffff';

ctx.fillRect(0, 0, width, height);

}

ctx.drawImage(resizeImage, 0, 0, width, height);

return new Promise((resolve) => {

canvas.toBlob((blob) => {

resolve(blob ? { blob, canvas } : null);

}, type, lossy ? RESIZE_QUALITY : undefined);

});

}

// Setup the Resizer's Generate + Download buttons

function setupResizeGenerate() {

const resizeGenerateBtn = document.getElementById('resizeGenerateBtn');

const resizeDownloadBtn = document.getElementById('resizeDownloadBtn');

const resizeOutputCanvas = document.getElementById('resizeOutputCanvas');

const resizeOutputDims = document.getElementById('resizeOutputDims');

const resizeOutputPreview = document.getElementById('resizeOutputPreview');

const resizeOutputControls = document.getElementById('resizeOutputControls');

resizeDownloadBtn.addEventListener('click', () => {

if (!resizeOutputBlob) {

alert(t('resizer.error_first'));

return;

}

const base = safeBaseName(resizeOriginalFilename, 'image');

// Derive the extension from the encoded blob. Hardcoding ".jpg" produced PNG
// bytes inside a file named .jpg.

const ext = RESIZE_EXT[resizeOutputBlob.type] || 'png';

if (resizeOutputUrl) URL.revokeObjectURL(resizeOutputUrl);

const url = URL.createObjectURL(resizeOutputBlob);

const link = document.createElement('a');

link.href = url;

link.download = `${base}-resized.${ext}`;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

setTimeout(() => URL.revokeObjectURL(url), 1000);

});

resizeGenerateBtn.addEventListener('click', async () => {

if (!resizeImage) return;

const btn = resizeGenerateBtn;

btn.textContent = t('compressor.generating');

btn.disabled = true;

try {

const result = await generateResizedImage();

if (result && result.blob) {

resizeOutputBlob = result.blob;

if (resizeOutputUrl) {

URL.revokeObjectURL(resizeOutputUrl);

resizeOutputUrl = null;

}

resizeOutputUrl = URL.createObjectURL(resizeOutputBlob);

resizeOutputCanvas.width = result.canvas.width;

resizeOutputCanvas.height = result.canvas.height;

resizeOutputCanvas.getContext('2d').drawImage(result.canvas, 0, 0);

resizeOutputDims.textContent = `${result.canvas.width} × ${result.canvas.height}`;

resizeOutputPreview.classList.remove('hidden');

resizeOutputControls.classList.remove('hidden');

resizeDownloadBtn.classList.remove('hidden');

} else {

alert(t('resizer.error_failed'));

}

} catch (err) {

console.error('Resize error:', err);

alert(t('resizer.error_generate'));

} finally {

btn.textContent = t('resizer.generate');

btn.disabled = false;

}

});

}

// Generate final output blob

function generateOutput() {

if (!originalImage) return null;

const { width, height } = clampDimensions();

const format = document.getElementById('formatSelect').value;

const quality = parseInt(document.getElementById('qualitySlider').value) / 100;

try {

// Create canvas

const canvas = document.createElement('canvas');

canvas.width = width;

canvas.height = height;

const ctx = canvas.getContext('2d');

// Draw image, flattening alpha onto white for JPEG

drawSourceOntoCanvas(ctx, originalImage, width, height, format);

// Convert to blob

return new Promise((resolve, reject) => {

canvas.toBlob((blob) => {

if (blob) {

resolve(blob);

} else {

reject(new Error('Failed to generate image'));

}

}, format, quality);

});

} catch (e) {

return Promise.reject(e);

}

}

// Display result stats

function displayResult() {

if (!outputBlob || !currentFile) return;

const originalSize = currentFile.size;

const outputSize = outputBlob.size;

const sizeDiff = outputSize - originalSize;

const percentChange = (sizeDiff / originalSize * 100).toFixed(1);

let sizeChangeText = '';

if (outputSize < originalSize) {

sizeChangeText = `${t('ui.reduced_by')} ${formatFileSize(Math.abs(sizeDiff))} (${Math.abs(percentChange)}%)`;

} else if (outputSize > originalSize) {

sizeChangeText = `Increased by ${formatFileSize(sizeDiff)} (${percentChange}%)`;

} else {

sizeChangeText = t('ui.no_significant_change');

}

// Read the dimensions that were actually encoded (post-clamp) so the
// reported stats can never disagree with the download.

const { width, height } = clampDimensions();

const format = document.getElementById('formatSelect').value.split('/')[1].toUpperCase();

document.getElementById('originalSize').textContent = formatFileSize(originalSize);

document.getElementById('outputSizeFinal').textContent = formatFileSize(outputSize);

document.getElementById('sizeReduction').textContent = sizeChangeText;

document.getElementById('finalDims').textContent = `${width} × ${height}`;

document.getElementById('finalFormat').textContent = format;

// Show result section

document.getElementById('resultSection').classList.remove('hidden');

}

// Generate and display output

function handleGenerate() {

if (!originalImage) return;

const btn = document.getElementById('generateBtn');

btn.textContent = t('compressor.generating');

btn.disabled = true;

generateOutput()

.then((blob) => {

// Clean up old URL

if (outputUrl) {

URL.revokeObjectURL(outputUrl);

}

outputBlob = blob;

outputUrl = URL.createObjectURL(blob);

// Update canvas preview

const canvas = document.getElementById('outputCanvas');

const ctx = canvas.getContext('2d');

const img = new Image();

img.onload = () => {

canvas.width = img.width;

canvas.height = img.height;

ctx.drawImage(img, 0, 0);

};

img.src = outputUrl;

// Display result stats

displayResult();

btn.textContent = t('compressor.generate_output_label');

btn.disabled = false;

})

.catch((err) => {

console.error('Generation error:', err);

btn.textContent = t('compressor.generate_output_label');

btn.disabled = false;

alert(t('compressor.error_generate'));

});

}

// Download the generated image

function handleDownload() {

if (!outputBlob || !currentFile) return;

// Generate filename based on what was done

const originalName = safeBaseName(currentFile.name, 'image');

const format = document.getElementById('formatSelect').value.split('/')[1];

const ext = format === 'jpeg' ? 'jpg' : format;

const { width: currentWidth, height: currentHeight } = clampDimensions();

const isResized = currentWidth !== originalImage.width || currentHeight !== originalImage.height;

const isConverting = format !== currentFile.type.split('/')[1];

let suffix = '';

if (isResized && isConverting) {

suffix = 'resized-converted';

} else if (isResized) {

suffix = 'resized';

} else if (isConverting) {

suffix = 'converted';

} else {

suffix = 'compressed';

}

const newFilename = `${originalName}-${suffix}.${ext}`;

// Create download link

const link = document.createElement('a');

link.href = outputUrl;

link.download = newFilename;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

}

// Color Palette Extractor functions

// Convert RGB to HEX

// Clamp each channel to 0-255. The palette quantizer rounded to the nearest
// multiple of 16, which produces 256 for inputs 248-255; without this guard
// that emitted a malformed 7-digit hex like "#1008000".

function rgbToHex(r, g, b) {

const clamp = (v) => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));

return '#' + [r, g, b].map(x => {

const hex = clamp(x).toString(16);

return hex.length === 1 ? '0' + hex : hex;

}).join('');

}

// Color quantization - sample image and find dominant colors

function extractPalette(img, numColors = 5) {

const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d');

// Scale down large images for faster processing

const maxDim = 200;

let width = img.width;

let height = img.height;

if (width > maxDim || height > maxDim) {

const scale = maxDim / Math.max(width, height);

width = Math.floor(width * scale);

height = Math.floor(height * scale);

}

canvas.width = width;

canvas.height = height;

ctx.drawImage(img, 0, 0, width, height);

const imageData = ctx.getImageData(0, 0, width, height);

const data = imageData.data;

// Count colors (quantized to reduce unique colors)

const colorCount = {};

let totalPixels = 0;

for (let i = 0; i < data.length; i += 4) {

const r = data[i];

const g = data[i + 1];

const b = data[i + 2];

const a = data[i + 3];

// Skip transparent pixels

if (a < 128) continue;

totalPixels++;

// Quantize to reduce color variance. Rounding to the nearest multiple of 16
// overflows to 256 for values 248-255, so bucket with floor instead.

const qr = Math.floor(r / 16) * 16;

const qg = Math.floor(g / 16) * 16;

const qb = Math.floor(b / 16) * 16;

const key = `${qr},${qg},${qb}`;

colorCount[key] = (colorCount[key] || 0) + 1;

}

// Get top colors by count

const colors = Object.entries(colorCount)

.map(([key, count]) => {

const [r, g, b] = key.split(',').map(Number);

return {

r, g, b,

count,

percentage: (count / totalPixels * 100).toFixed(1)

};

})

.sort((a, b) => b.count - a.count)

.slice(0, numColors);

return colors;

}

// One delegated listener on the grid covers every swatch, including those
// appended by later render chunks. Binding a listener per button after the
// first chunk left every swatch past the first 50 with a dead copy button.

function setupPaletteCopyDelegation() {

const grid = document.getElementById('paletteGrid');

if (!grid || grid.dataset.copyBound === 'true') return;

grid.dataset.copyBound = 'true';

grid.addEventListener('click', (e) => {

const btn = e.target.closest('.palette-btn');

if (!btn || !grid.contains(btn)) return;

const textToCopy = btn.dataset.copy;

if (!textToCopy) return;

const originalText = btn.textContent;

navigator.clipboard.writeText(textToCopy).then(() => {

btn.textContent = t('btn.copied');

btn.classList.add('copied');

}).catch((err) => {

console.error('Failed to copy:', err);

btn.textContent = t('btn.failed');

}).then(() => {

setTimeout(() => {

btn.textContent = originalText;

btn.classList.remove('copied');

}, 1500);

});

});

}

// Display palette swatches (dominant mode)

function displayPalette() {

const grid = document.getElementById('paletteGrid');

const infoText = document.getElementById('paletteInfoText');

grid.innerHTML = '';

if (palettePalette.length === 0) {

infoText.textContent = t('palette.no_colors_msg');

return;

}

infoText.textContent = tf('palette.showing_dominant_msg', { n: palettePalette.length });

palettePalette.forEach(color => {

const hex = rgbToHex(color.r, color.g, color.b);

const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;

const percent = `${color.percentage}%`;

// Calculate luminance to determine text color

const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;

const textColor = luminance > 0.5 ? '#1e293b' : '#f1f5f9';

const swatch = document.createElement('div');

swatch.className = 'palette-swatch';

swatch.innerHTML = `

<div class="palette-color-preview" style="background-color: ${hex};"></div>

<div class="palette-info">

<div class="palette-hex" style="color: ${textColor}">${hex}</div>

<div class="palette-rgb" style="color: ${textColor}">${rgb}</div>

<div class="palette-percent">${percent}</div>

<div class="palette-actions">

<button class="palette-btn" data-copy="${hex}" data-i18n="palette.copy_hex" aria-label="Copy HEX">Copy HEX</button>

<button class="palette-btn" data-copy="${rgb}" data-i18n="palette.copy_rgb" aria-label="Copy RGB">Copy RGB</button>

</div>

</div>

`;

grid.appendChild(swatch);

});


// The swatches are built as markup, so translate them explicitly.
if (typeof i18nApply === 'function') i18nApply(grid);

}

// Display all colors with virtualized rendering

function displayAllColors() {

const grid = document.getElementById('paletteGrid');

const infoText = document.getElementById('paletteInfoText');

grid.innerHTML = '';

const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

const sortValue = document.getElementById('sortSelect').value;

// Filter colors by search

let filtered = allColorsData;

if (searchTerm) {

filtered = allColorsData.filter(color =>

color.hex.toLowerCase().includes(searchTerm)

);

}

// Sort colors

filtered = [...filtered];

if (sortValue === 'count-desc') {

filtered.sort((a, b) => b.count - a.count);

} else if (sortValue === 'count-asc') {

filtered.sort((a, b) => a.count - b.count);

} else if (sortValue === 'hex-asc') {

filtered.sort((a, b) => a.hex.localeCompare(b.hex));

}

infoText.textContent = tf('palette.showing_unique_msg', { n: filtered.length, total: allColorsData.length });

// Render in chunks to avoid freezing

const chunkSize = 50;

let index = 0;

function renderChunk() {

const end = Math.min(index + chunkSize, filtered.length);

for (; index < end; index++) {

const color = filtered[index];

const swatch = document.createElement('div');

swatch.className = 'palette-swatch';

swatch.innerHTML = `

<div class="palette-color-preview" style="background-color: ${color.hex};"></div>

<div class="palette-info">

<div class="palette-hex">${color.hex}</div>

<div class="palette-actions">

<button class="palette-btn" data-copy="${color.hex}" data-i18n="palette.copy_hex" aria-label="Copy HEX">Copy HEX</button>

</div>

</div>

`;

grid.appendChild(swatch);

}

if (index < filtered.length) {

setTimeout(renderChunk, 0);

}

}

renderChunk();
}


// Change mode between dominant and all colors

function setMode(mode) {

currentMode = mode;

document.querySelectorAll('.mode-btn').forEach(btn => {

btn.classList.toggle('active', btn.dataset.mode === mode);

});

const colorCountSelect = document.getElementById('colorCountSelect');

const allColorsControls = document.getElementById('allColorsControls');

if (mode === 'dominant') {

colorCountSelect.classList.remove('hidden');

allColorsControls.classList.add('hidden');

} else {

colorCountSelect.classList.add('hidden');

allColorsControls.classList.remove('hidden');

}

// Re-analyze the current image in the new mode

if (paletteImage) {

analyzeImage(paletteImage);

}

}

// Analyze image based on current mode

function analyzeImage(img) {

if (!img) return;

if (currentMode === 'dominant') {

const numColors = parseInt(document.getElementById('colorCountSelect').value);

palettePalette = extractPalette(img, numColors);

displayPalette();

} else {

extractAllColors(img);

}

}

// Extract all unique colors from image

function extractAllColors(img) {

const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d');

// Scale down for performance

const maxDim = 300;

let width = img.width;

let height = img.height;

const scaled = width > maxDim || height > maxDim;

if (scaled) {

const scale = maxDim / Math.max(width, height);

width = Math.floor(width * scale);

height = Math.floor(height * scale);

}

canvas.width = width;

canvas.height = height;

ctx.drawImage(img, 0, 0, width, height);

const imageData = ctx.getImageData(0, 0, width, height);

const data = imageData.data;

// Count all unique colors

const colorMap = new Map();

let totalPixels = 0;

for (let i = 0; i < data.length; i += 4) {

const r = data[i];

const g = data[i + 1];

const b = data[i + 2];

const a = data[i + 3];

// Skip transparent pixels

if (a < 128) continue;

totalPixels++;

const key = `${r},${g},${b}`;

colorMap.set(key, (colorMap.get(key) || 0) + 1);

}

// Convert to array with hex values

allColorsData = [];

for (const [key, count] of colorMap.entries()) {

const [r, g, b] = key.split(',').map(Number);

const hex = rgbToHex(r, g, b);

allColorsData.push({

r, g, b, hex,

count,

percentage: (count / totalPixels * 100).toFixed(2)

});

}

// Sort by count initially

allColorsData.sort((a, b) => b.count - a.count);

displayAllColors();

// Mention the sampling only when no search is active, so the "Showing X of Y"
// match count from displayAllColors is not silently overwritten.

const infoText = document.getElementById('paletteInfoText');

const searchInput = document.getElementById('searchInput');

if (scaled && !(searchInput && searchInput.value.trim())) {

infoText.textContent += ' (' + t('palette.analysed_at') + ' ' + width + '×' + height + ' ' + t('palette.for_performance') + ')';

}

}

// Load image for palette extraction

function loadPaletteImage(file) {

if (!file || !file.type.startsWith('image/')) {

showPaletteError(t('error.file_type'));

return;

}

clearPaletteError();

paletteCurrentFile = file;

const reader = new FileReader();

reader.onload = (e) => {

const img = new Image();

img.onerror = () => {

showPaletteError(t('conv.error_read'));

};

img.onload = () => {

paletteImage = img;

// Update preview

document.getElementById('palettePreviewImage').src = e.target.result;

document.getElementById('palettePreviewFilename').textContent = file.name;

document.getElementById('palettePreviewSize').textContent = formatFileSize(file.size);

document.getElementById('palettePreviewDims').textContent = `${img.width} × ${img.height}`;

// Analyze based on current mode

analyzeImage(img);

// Show preview and results

document.getElementById('paletteImagePreview').classList.remove('hidden');

document.getElementById('paletteResults').classList.remove('hidden');

// The controls and swatch grid sit in their own card, which is meaningless
// without an image to act on: it showed an empty mode selector and a blank
// grid. It is revealed together with the preview and hidden again on clear.
const palettePanel = document.querySelector('.palette-preview-container');

if (palettePanel) palettePanel.classList.remove('hidden');

document.getElementById('paletteUploadArea').classList.add('hidden');

};

img.src = e.target.result;

};

reader.readAsDataURL(file);

}

function showPaletteError(message) {

const area = document.getElementById('paletteUploadArea');

if (!area) return;

let box = area.parentElement.querySelector('.palette-error');

if (!box) {

box = document.createElement('div');

box.className = 'error-message palette-error';

area.after(box);

}

box.textContent = message;

}

function clearPaletteError() {

document.querySelectorAll('.palette-error').forEach(e => e.remove());

}

// Clear palette image

function clearPaletteImage() {

paletteCurrentFile = null;

paletteImage = null;

palettePalette = [];

allColorsData = [];

document.getElementById('paletteFileInput').value = '';

document.getElementById('palettePreviewImage').src = '';

document.getElementById('paletteImagePreview').classList.add('hidden');

document.getElementById('paletteResults').classList.add('hidden');

const palettePanel = document.querySelector('.palette-preview-container');

if (palettePanel) palettePanel.classList.add('hidden');

document.getElementById('paletteUploadArea').classList.remove('hidden');

document.getElementById('paletteGrid').innerHTML = '';

document.getElementById('paletteInfoText').textContent = '';

clearPaletteError();

}

// Setup palette extractor

function setupPaletteExtractor() {

setupPaletteCopyDelegation();

const uploadArea = document.getElementById('paletteUploadArea');

const fileInput = document.getElementById('paletteFileInput');

const browseBtn = document.getElementById('paletteBrowseBtn');

const removeBtn = document.getElementById('paletteRemoveBtn');

const copyPaletteBtn = document.getElementById('copyPaletteBtn');

const modeBtns = document.querySelectorAll('.mode-btn');

const colorCountSelect = document.getElementById('colorCountSelect');

const searchInput = document.getElementById('searchInput');

const sortSelect = document.getElementById('sortSelect');

browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {

if (e.target.files[0]) loadPaletteImage(e.target.files[0]);

});

uploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

uploadArea.classList.add('drag-over');

});

uploadArea.addEventListener('dragleave', () => {

uploadArea.classList.remove('drag-over');

});

uploadArea.addEventListener('drop', (e) => {

e.preventDefault();

uploadArea.classList.remove('drag-over');

const file = e.dataTransfer.files[0];

if (file && file.type.startsWith('image/')) loadPaletteImage(file);

});

removeBtn.addEventListener('click', clearPaletteImage);

// Mode switching

modeBtns.forEach(btn => {

btn.addEventListener('click', () => {

setMode(btn.dataset.mode);

});

});

// Color count change (dominant mode)

colorCountSelect.addEventListener('change', () => {

if (currentMode === 'dominant' && paletteImage) {

analyzeImage(paletteImage);

}

});

// Search input (all colors mode)
// Debounced: each keystroke previously re-filtered and re-sorted the entire
// unique-color array, which is expensive on photo-like images.

let paletteSearchTimer = null;

searchInput.addEventListener('input', () => {

clearTimeout(paletteSearchTimer);

paletteSearchTimer = setTimeout(() => {

if (currentMode === 'all' && allColorsData.length > 0) {

displayAllColors();

}

}, 180);

});

// Sort change (all colors mode)

sortSelect.addEventListener('change', () => {

if (currentMode === 'all' && allColorsData.length > 0) {

displayAllColors();

}

});

copyPaletteBtn.addEventListener('click', async () => {

if (palettePalette.length === 0 && allColorsData.length === 0) return;

const colorsToCopy = currentMode === 'dominant' ? palettePalette : allColorsData;

const paletteText = colorsToCopy.map(color =>

rgbToHex(color.r, color.g, color.b)

).join('\n');

try {

await navigator.clipboard.writeText(paletteText);

const originalText = copyPaletteBtn.textContent;

copyPaletteBtn.textContent = t('btn.copied');

copyPaletteBtn.classList.add('copied');

setTimeout(() => {

copyPaletteBtn.textContent = originalText;

copyPaletteBtn.classList.remove('copied');

}, 1500);

} catch (err) {

console.error('Failed to copy palette:', err);

alert(t('palette.copy_error'));

}

});

}

// Update generate button text based on current settings

function updateGenerateButtonText() {

if (!originalImage) return;

const btn = document.getElementById('generateBtn');

const currentFormat = document.getElementById('formatSelect').value;

const { width: currentWidth, height: currentHeight } = clampDimensions();

const isResized = currentWidth !== originalImage.width || currentHeight !== originalImage.height;

const isConverting = currentFormat !== currentFile.type;

let buttonText = t('compressor.generate_output_label');

if (isConverting) {

buttonText = isResized ? 'Resize & Convert' : 'Convert & Generate';

} else if (isResized) {

buttonText = 'Resize & Generate';

} else {

buttonText = 'Compress & Generate';

}

btn.textContent = buttonText;

}

// Base64 / Image Converter
//
// Encoding is a straight byte -> Base64 transform. Decoding is where the real
// work is: the input can arrive in several shapes (a full data URI, a raw
// payload, MIME-wrapped lines with whitespace, a URL-safe variant, missing
// padding) and a naive atob() throws on almost all of them. So the payload is
// normalised first, then validated against the actual bytes, and only then
// handed to the decoder.

const B64_MAX_INPUT = 32 * 1024 * 1024;

let b64SourceFile = null;

let b64SourceUrl = null;

let b64EncodedString = '';

let b64DataUriString = '';

let b64OutputBlob = null;

let b64OutputFormat = null;

let b64OutputUrl = null;

let b64Mode = 'to-b64';

// Split a data URI into its declared media type and payload.

function b64ParseDataUri(input) {

const match = /^data:([^,;]*)((?:;[^,;]*)*),/i.exec(input);

if (!match) return null;

const meta = match[1] || '';

const params = match[2] || '';

// Only the charset/base64 forms carry an encoded payload. A percent-encoded
// data URI is not Base64 and must not be mistaken for one.
const isBase64 = /;\s*base64\s*$/i.test(params);

return { mediaType: meta, isBase64, rest: input.slice(match[0].length) };

}

// Normalise arbitrary Base64 input into a bare, padded, standard-alphabet
// payload. Returns { ok, payload, kind, error }.

function b64NormaliseInput(raw) {

if (typeof raw !== 'string') return { ok: false, error: t('b64.error_nothing_to_convert') };

let text = raw.trim();

if (!text) return { ok: false, error: t('b64.error_empty') };

// A file:// or http URL is not something we can fetch cross-origin here.
if (/^(https?|file|blob):/i.test(text)) {

return { ok: false, error: t('b64.error_url') };

}

let kind = 'raw';

let declaredType = '';

const uri = b64ParseDataUri(text);

if (uri) {

if (!uri.isBase64) {

return { ok: false, error: t('b64.error_not_base64_uri') };

}

declaredType = uri.mediaType.trim().toLowerCase();

text = uri.rest;

kind = 'data-uri';

} else if (/^data:/i.test(text)) {

return { ok: false, error: t('b64.error_bad_uri') };

}

// Strip all whitespace, including the hard line breaks that MIME-style
// Base64 (RFC 2045) introduces every 76 characters.
text = text.replace(/\s+/g, '');

// URL-safe alphabet -> standard alphabet.
text = text.replace(/-/g, '+').replace(/_/g, '/');

// Drop any padding we are about to re-add, then re-pad to a multiple of 4.
text = text.replace(/=+$/, '');

if (!text.length) return { ok: false, error: t('b64.error_no_data') };

if (!/^[A-Za-z0-9+/]*$/.test(text)) {

const bad = text.replace(/[A-Za-z0-9+/]/g, '')[0];

return { ok: false, error: `The input contains a character that cannot appear in Base64: "${bad}".` };

}

// A length of 1 modulo 4 can never be valid, whatever the padding.
const remainder = text.length % 4;

if (remainder === 1) {

return { ok: false, error: 'The input is not valid Base64: its length is inconsistent.' };

}

if (remainder === 2) text += '==';

else if (remainder === 3) text += '=';

return { ok: true, payload: text, kind, declaredType };

}

// Decode a normalised payload to bytes, without throwing.

function b64DecodeToBytes(payload) {

const binary = atob(payload);

const bytes = new Uint8Array(binary.length);

for (let i = 0; i < binary.length; i++) {

bytes[i] = binary.charCodeAt(i);

}

return bytes;

}

// Identify an image from its leading bytes. Trusting the media type declared in
// a data URI would let arbitrary content through, so the type always comes from
// the actual signature.

function b64SniffFormat(bytes) {

if (bytes.length < 4) return null;

const b = bytes;

const starts = (arr, off) => {

for (let i = 0; i < arr.length; i++) if (b[off + i] !== arr[i]) return false;

return true;

};

if (starts([0xFF, 0xD8, 0xFF], 0)) return { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG' };

if (starts([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], 0)) return { mime: 'image/png', ext: 'png', label: 'PNG' };

if (starts([0x47, 0x49, 0x46, 0x38], 0)) return { mime: 'image/gif', ext: 'gif', label: 'GIF' };

if (starts([0x42, 0x4D], 0)) return { mime: 'image/bmp', ext: 'bmp', label: 'BMP' };

if (starts([0x52, 0x49, 0x46, 0x46], 0) && starts([0x57, 0x45, 0x42, 0x50], 8)) return { mime: 'image/webp', ext: 'webp', label: 'WebP' };

if (starts([0x66, 0x74, 0x79, 0x70], 4)) {

const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();

if (brand.startsWith('avif') || brand.startsWith('avis')) return { mime: 'image/avif', ext: 'avif', label: 'AVIF' };

if (brand.startsWith('heic') || brand.startsWith('heix') || brand.startsWith('mif1')) return { mime: 'image/heic', ext: 'heic', label: 'HEIC' };

}

if (starts([0x00, 0x00, 0x01, 0x00], 0)) return { mime: 'image/x-icon', ext: 'ico', label: 'ICO' };

// SVG is text, so it starts with markup rather than a magic number.
const head = new TextDecoder('utf-8', { fatal: false }).decode(bytes.subarray(0, 256)).trim().toLowerCase();

if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) {

return { mime: 'image/svg+xml', ext: 'svg', label: 'SVG' };

}

return null;

}

function b64ShowError(message) {

const box = document.getElementById('b64DecodeError');

if (!box) return;

box.textContent = message;

box.classList.remove('hidden');

}

function b64HideError() {

const box = document.getElementById('b64DecodeError');

if (box) box.classList.add('hidden');

}

function b64HideResults() {

const a = document.getElementById('b64ToB64Result');

if (a) a.classList.add('hidden');

const b = document.getElementById('b64ToImageResult');

if (b) b.classList.add('hidden');

}

function b64EncodeFile(file) {

b64HideError();

b64HideResults();

b64EncodedString = '';

b64DataUriString = '';

const reader = new FileReader();

reader.onload = () => {

// readAsDataURL returns a full data URI. Strip the prefix so the raw output
// really is raw Base64; storing the whole URI and prefixing it again produced
// "data:...;base64,data:...;base64," and broke every downstream consumer.
const result = String(reader.result || '');

const comma = result.indexOf(',');

b64EncodedString = comma === -1 ? result : result.slice(comma + 1);

b64DataUriString = 'data:' + (file.type || 'application/octet-stream') + ';base64,' + b64EncodedString;

const textarea = document.getElementById('b64OutputText');

const wrap = document.getElementById('b64WrapToggle');

const wrapped = wrap && wrap.checked;

textarea.value = wrapped ? b64Wrap(b64EncodedString) : b64EncodedString;

document.getElementById('b64OriginalSize').textContent = formatFileSize(file.size);

document.getElementById('b64EncodedLength').textContent = b64Readable(b64EncodedString.length);

const overhead = file.size ? ((b64EncodedString.length - file.size) / file.size * 100) : 0;

document.getElementById('b64Overhead').textContent = '+' + overhead.toFixed(1) + '%';

document.getElementById('b64DataUriLength').textContent = b64Readable(b64DataUriString.length);

document.getElementById('b64MetaLine').textContent =
b64EncodedString.length + ' characters, including ' + Math.floor(b64EncodedString.length / 76) + ' line breaks when wrapped.';

document.getElementById('b64ToB64Result').classList.remove('hidden');

};

reader.onerror = () => b64ShowError(t('b64.error_read_file'));

reader.readAsDataURL(file);

}

// MIME-style line wrapping, 76 characters per line.

function b64Wrap(text) {

const lines = [];

for (let i = 0; i < text.length; i += 76) lines.push(text.slice(i, i + 76));

return lines.join('\n');

}

function b64Readable(n) {

if (n < 1000) return n + ' chars';

if (n < 1000000) return (n / 1000).toFixed(1) + 'K chars';

return (n / 1000000).toFixed(2) + 'M chars';

}

function b64Copy(text, button, successLabel) {

if (!text) {

b64ShowError(t('b64.nothing_to_copy'));

return;

}

const done = (ok) => {

const original = button.textContent;

button.textContent = ok ? successLabel : t('b64.copy_failed');

button.classList.toggle('copied', ok);

setTimeout(() => {

button.textContent = original;

button.classList.remove('copied');

}, 1500);

};

if (navigator.clipboard && navigator.clipboard.writeText) {

navigator.clipboard.writeText(text).then(() => done(true)).catch(() => {

// Fall back for contexts where the async clipboard API is unavailable.

b64LegacyCopy(text) ? done(true) : done(false);

});

} else {

b64LegacyCopy(text) ? done(true) : done(false);

}

}

function b64LegacyCopy(text) {

try {

const area = document.createElement('textarea');

area.value = text;

area.setAttribute('readonly', '');

area.style.position = 'fixed';

area.style.opacity = '0';

document.body.appendChild(area);

area.select();

const ok = document.execCommand('copy');

document.body.removeChild(area);

return ok;

} catch (e) {

return false;

}

}

function b64Decode() {

b64HideError();

b64HideResults();

const input = document.getElementById('b64InputText').value;

const normalised = b64NormaliseInput(input);

if (!normalised.ok) {

b64ShowError(normalised.error);

return;

}

if (normalised.payload.length > B64_MAX_INPUT * 4 / 3) {

b64ShowError(t('b64.error_too_large'));

return;

}

let bytes;

try {

bytes = b64DecodeToBytes(normalised.payload);

} catch (e) {

b64ShowError(t('b64.error_decode_failed'));

return;

}

if (bytes.length === 0) {

b64ShowError(t('b64.error_zero_bytes'));

return;

}

const format = b64SniffFormat(bytes);

if (!format) {

b64ShowError(t('b64.error_not_image') + ' ' + t('b64.formats_list') + '.');

return;

}

// Warn when a data URI declared a type that disagrees with the actual bytes;
// the bytes win, because the declared type is attacker-controlled.
if (normalised.declaredType && normalised.declaredType !== format.mime) {

document.getElementById('b64InputHint').textContent =
t('b64.declared_mismatch') + ' ' + normalised.declaredType + ' ', t('b64.but_actually') + ' ' + format.label + t('b64.detected_used');

}

b64OutputFormat = format;

b64OutputBlob = new Blob([bytes], { type: format.mime });

if (b64OutputUrl) URL.revokeObjectURL(b64OutputUrl);

b64OutputUrl = URL.createObjectURL(b64OutputBlob);

const img = document.getElementById('b64OutputImage');

img.onload = () => {

document.getElementById('b64DetectedType').textContent = format.label;

document.getElementById('b64DecodedSize').textContent = formatFileSize(bytes.length);

document.getElementById('b64DecodedDims').textContent = img.naturalWidth + ' × ' + img.naturalHeight;

document.getElementById('b64InputLength').textContent = b64Readable(normalised.payload.length);

document.getElementById('b64ToImageResult').classList.remove('hidden');

};

img.onerror = () => {

b64ShowError(t('b64.error_cannot_display') + ' ' + format.label + ', ' + t('b64.error_browser_display'));

};

img.src = b64OutputUrl;

}

function setupBase64Converter() {

const tabs = document.querySelectorAll('.b64-mode-btn');

const panelToB64 = document.getElementById('b64PanelToB64');

const panelToImage = document.getElementById('b64PanelToImage');

function setMode(mode) {

b64Mode = mode;

tabs.forEach(tab => {

const active = tab.dataset.mode === mode;

tab.classList.toggle('active', active);

tab.setAttribute('aria-selected', active ? 'true' : 'false');

});

panelToB64.hidden = mode !== 'to-b64';

panelToImage.hidden = mode !== 'to-image';

b64HideError();

}

tabs.forEach(tab => {

tab.addEventListener('click', () => setMode(tab.dataset.mode));

});

// ---- Image -> Base64 ----

const uploadArea = document.getElementById('b64UploadArea');

const fileInput = document.getElementById('b64FileInput');

const browseBtn = document.getElementById('b64BrowseBtn');

const removeBtn = document.getElementById('b64RemoveBtn');

const wrapToggle = document.getElementById('b64WrapToggle');

const copyBtn = document.getElementById('b64CopyBtn');

const copyDataUriBtn = document.getElementById('b64CopyDataUriBtn');

const downloadTxtBtn = document.getElementById('b64DownloadTxtBtn');

browseBtn.addEventListener('click', () => fileInput.click());

function loadB64Image(file) {

if (!file || !file.type || !file.type.startsWith('image/')) {

b64ShowError(t('b64.error_unsupported'));

return;

}

b64HideError();

b64HideResults();

const objectUrl = URL.createObjectURL(file);

const img = new Image();

img.onload = () => {

if (b64SourceUrl) URL.revokeObjectURL(b64SourceUrl);

b64SourceUrl = objectUrl;

b64SourceFile = file;

document.getElementById('b64PreviewImage').src = objectUrl;

document.getElementById('b64PreviewFilename').textContent = file.name;

document.getElementById('b64PreviewSize').textContent = formatFileSize(file.size);

document.getElementById('b64PreviewDims').textContent = img.naturalWidth + ' × ' + img.naturalHeight;

document.getElementById('b64PreviewFormat').textContent = (file.type.split('/')[1] || 'IMG').toUpperCase();

document.getElementById('b64ImagePreview').classList.remove('hidden');

uploadArea.classList.add('hidden');

b64EncodeFile(file);

};

img.onerror = () => {

URL.revokeObjectURL(objectUrl);

b64ShowError(t('conv.error_read'));

};

img.src = objectUrl;

}

fileInput.addEventListener('change', (e) => {

if (e.target.files[0]) loadB64Image(e.target.files[0]);

});

uploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

uploadArea.classList.add('drag-over');

});

uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));

uploadArea.addEventListener('drop', (e) => {

e.preventDefault();

uploadArea.classList.remove('drag-over');

const file = e.dataTransfer.files[0];

if (file) loadB64Image(file);

});

wrapToggle.addEventListener('change', () => {

if (!b64EncodedString) return;

document.getElementById('b64OutputText').value = wrapToggle.checked
? b64Wrap(b64EncodedString)
: b64EncodedString;

});

copyBtn.addEventListener('click', () => {

// Copy the unwrapped payload; wrapping is only for display.
b64Copy(b64EncodedString, copyBtn, t('btn.copied'));

});

copyDataUriBtn.addEventListener('click', () => b64Copy(b64DataUriString, copyDataUriBtn, t('btn.copied')));

downloadTxtBtn.addEventListener('click', () => {

if (!b64EncodedString) {

b64ShowError(t('b64.nothing_to_download'));

return;

}

const base = safeBaseName(b64SourceFile && b64SourceFile.name, 'image');

const text = wrapToggle.checked ? b64Wrap(b64EncodedString) : b64EncodedString;

downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), base + '.base64.txt');

});

removeBtn.addEventListener('click', () => {

b64SourceFile = null;

b64EncodedString = '';

b64DataUriString = '';

fileInput.value = '';

if (b64SourceUrl) { URL.revokeObjectURL(b64SourceUrl); b64SourceUrl = null; }

const preview = document.getElementById('b64PreviewImage');

if (preview) preview.src = '';

document.getElementById('b64ImagePreview').classList.add('hidden');

uploadArea.classList.remove('hidden');

b64HideResults();

});

// ---- Base64 -> Image ----

const decodeBtn = document.getElementById('b64DecodeBtn');

const clearBtn = document.getElementById('b64ClearInputBtn');

const inputText = document.getElementById('b64InputText');

decodeBtn.addEventListener('click', b64Decode);

const downloadImgBtn = document.getElementById('b64DownloadImgBtn');

downloadImgBtn.addEventListener('click', () => {

if (!b64OutputBlob || !b64OutputFormat) {

b64ShowError(t('b64.convert_first'));

return;

}

// Name the file after the type that was actually detected, not the one the
// input claimed, so the extension always matches the bytes.
downloadBlob(b64OutputBlob, 'decoded-image.' + b64OutputFormat.ext);

});

clearBtn.addEventListener('click', () => {

inputText.value = '';

b64HideError();

b64HideResults();

const hint = document.getElementById('b64InputHint');

if (hint) {

hint.textContent = t('b64.input_hint');

}

if (b64OutputUrl) { URL.revokeObjectURL(b64OutputUrl); b64OutputUrl = null; }

b64OutputBlob = null;

b64OutputFormat = null;

const out = document.getElementById('b64OutputImage');

if (out) out.removeAttribute('src');

});

// Let the user drop an image straight onto the input area as a shortcut.
inputText.addEventListener('dragover', (e) => e.preventDefault());

inputText.addEventListener('drop', (e) => {

e.preventDefault();

const file = e.dataTransfer.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = () => {

inputText.value = String(reader.result || '');

b64Decode();

};

reader.readAsText(file);

});

}


// Metadata Cleaner
//
// Photos carry hidden data: EXIF (camera, timestamp, sometimes GPS), XMP, ICC
// profiles and PNG text chunks. Re-encoding through a canvas would strip them
// all, but it also re-compresses the image, which is unacceptable for a tool
// whose entire promise is "clean this, don't touch the picture".
//
// So instead of re-encoding, this walks the container and deletes only the
// metadata segments. The compressed image data is copied byte for byte, so the
// result is bit-for-bit the same picture with the private parts removed.

const META_TYPES = {

'JPEG': 'image/jpeg',

'PNG': 'image/png',

'WEBP': 'image/webp'

};

let metaCurrentFile = null;

let metaSourceUrl = null;

let metaOutputBlob = null;

let metaOutputUrl = null;

// Copy [start, end) out of a Uint8Array into a new one

function metaSlice(bytes, start, end) {

return bytes.slice(start, end);

}

function metaConcat(chunks) {

let total = 0;

for (const c of chunks) total += c.length;

const out = new Uint8Array(total);

let at = 0;

for (const c of chunks) { out.set(c, at); at += c.length; }

return out;

}

// Walk a real EXIF (TIFF) structure and describe what is actually inside it.
// The earlier heuristic searched for two loose bytes, which both missed GPS and
// produced false positives. This parses the byte order mark, the IFD chain and
// the tag table properly.

const EXIF_GPS_IFD = 0x8825;

const EXIF_TAGS = {

0x010F: 'meta.tag_camera_make',

0x0110: 'meta.tag_camera_model',

0x0112: 'meta.tag_orientation',

0x0131: 'meta.tag_software',

0x0132: 'meta.tag_file_modified',

0x829A: 'meta.tag_exposure_time',

0x829D: 'meta.tag_aperture',

0x8827: 'meta.tag_ISO_speed',

0x9003: 'meta.tag_date_taken',

0x9004: 'meta.tag_date_digitised',

0x920A: 'meta.tag_focal_length',

0xA002: 'meta.tag_pixel_dimensions',

0xA430: 'meta.tag_camera_owner_name',

0xA431: 'meta.tag_camera_serial_number',

0xA433: 'meta.tag_lens_make',

0xA434: 'lens model'

};

function metaExifSummary(payload) {

const tiff = 6; // payload starts with "Exif\0\0"

if (payload.length < tiff + 8) return 'EXIF data';

let little;

if (payload[tiff] === 0x49 && payload[tiff + 1] === 0x49) little = true;

else if (payload[tiff] === 0x4D && payload[tiff + 1] === 0x4D) little = false;

else return 'EXIF data';

const dv = (off) => little ? (payload[off] | (payload[off + 1] << 8)) : ((payload[off] << 8) | payload[off + 1]);

const d32 = (off) => little

? (payload[off] | (payload[off+1] << 8) | (payload[off+2] << 16) | (payload[off+3] << 24)) >>> 0

: ((payload[off] << 24) | (payload[off+1] << 16) | (payload[off+2] << 8) | payload[off+3]) >>> 0;

if (dv(tiff + 2) !== 42) return 'EXIF data';

const ifd0 = tiff + d32(tiff + 4);

if (ifd0 <= 0 || ifd0 + 2 > payload.length) return 'EXIF data';

const count = dv(ifd0);

const names = [];

let hasGps = false;

// IFD0
for (let e = 0; e < count; e++) {

const entry = ifd0 + 2 + e * 12;

if (entry + 12 > payload.length) break;

const tag = dv(entry);

if (tag === EXIF_GPS_IFD) hasGps = true;

const name = EXIF_TAGS[tag];

if (name && names.indexOf(name) === -1) names.push(name);

}

// EXIF sub-IFD (0x8769) usually holds the shooting tags
const next = ifd0 + 2 + count * 12;

if (next + 4 <= payload.length) {

const subOffset = d32(next);

if (subOffset > 0) {

const exifIfd = tiff + subOffset;

if (exifIfd + 2 <= payload.length) {

const subCount = dv(exifIfd);

for (let e = 0; e < subCount; e++) {

const entry = exifIfd + 2 + e * 12;

if (entry + 12 > payload.length) break;

const tag = dv(entry);

const name = EXIF_TAGS[tag];

if (name && names.indexOf(name) === -1) names.push(name);

}

}

}

}

const parts = [];

if (hasGps) parts.push(t('meta.detail_gps'));

if (names.length) parts.push(names.slice(0, 3).map((n) => t(n)).join(', '));

if (!parts.length) return 'EXIF data';

let text = t('meta.detail_contains') + ' ' + parts.join(' · ');

if (names.length > 3) text += ' · +' + (names.length - 3) + ' ' + t('meta.detail_and_more');

return text;

}

// Describe what a JPEG APPn payload actually contains

function metaDescribeJpegApp(label, payload) {

if (payload[0] === 0x45 && payload[1] === 0x78 && payload[2] === 0x69 && payload[3] === 0x66) {

const tag = new TextDecoder('latin1').decode(payload.subarray(0, 40));

let detail = 'Camera, software and timestamp data';

if (tag.includes('Exif')) {

detail = metaExifSummary(payload);

}

return { label, kind: 'EXIF', detail };

}

const ascii = new TextDecoder('latin1').decode(payload.subarray(0, 60));

if (ascii.startsWith('http://ns.adobe.com/xap') || ascii.includes('adobe.com/xap')) {

return { label, kind: 'XMP', detail: 'meta.detail_xmp' };

}

if (payload[0] === 0x49 && payload[1] === 0x43 && payload[2] === 0x43) {

return { label, kind: 'ICC', detail: 'meta.detail_icc' };

}

if (payload[0] === 0x49 && payload[1] === 0x49 && payload[2] === 0x42) {

return { label, kind: 'ICC', detail: 'meta.detail_icc' };

}

return { label, kind: 'APP', detail: 'meta.detail_app' };

}

// Strip metadata from a JPEG by removing APPn and COM segments.
// Returns { blob, found, clean } or null when the bytes are not a JPEG.

// Read the EXIF Orientation tag (0x0112) from a JPEG without decoding it.
// The cleaner needs this: browsers apply the orientation when displaying a
// photo, so if we simply delete the tag the picture appears rotated. When the
// value is anything other than 1 we bake the rotation into the pixels instead.

function metaReadJpegOrientation(bytes) {

if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return 1;

const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

let i = 2;

while (i + 4 <= bytes.length) {

if (bytes[i] !== 0xFF) { i++; continue; }

const marker = bytes[i + 1];

if (marker === 0xD8 || marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) { i += 2; continue; }

if (marker === 0xDA || marker === 0xD9) return 1;

const length = view.getUint16(i + 2, false);

const isExif = marker === 0xE1
&& bytes[i + 4] === 0x45 && bytes[i + 5] === 0x78
&& bytes[i + 6] === 0x69 && bytes[i + 7] === 0x66;

if (isExif) {

const tiff = i + 10;

const bom = (bytes[tiff] << 8) | bytes[tiff + 1];

const little = bom === 0x4949;

const dv = (off) => little ? view.getUint16(off, true) : view.getUint16(off, false);

const d32 = (off) => little ? view.getUint32(off, true) : view.getUint32(off, false);

if (dv(tiff + 2) !== 42) return 1;

const ifd0 = tiff + d32(tiff + 4);

const count = dv(ifd0);

for (let e = 0; e < count; e++) {

const entry = ifd0 + 2 + e * 12;

if (entry + 12 > bytes.length) break;

if (dv(entry) === 0x0112) return dv(entry + 8);

}

return 1;

}

i += 2 + length;

}

return 1;

}

// Re-encode a photo as-is so its pixels can be stored without the EXIF
// orientation tag.
//
// This looks like it should rotate something, but it must not. The browser
// already applies the EXIF orientation when it decodes an <img>: for a photo
// tagged "rotate 90 degrees", naturalWidth/naturalHeight are the *displayed*
// (upright) dimensions and the pixels are already the right way up. Drawing
// that image straight into a canvas therefore bakes the orientation in, which
// is exactly what we want. Rotating again here would double-rotate the picture.

function metaFlattenOrientation(img) {

const width = img.naturalWidth || img.width;

const height = img.naturalHeight || img.height;

const canvas = document.createElement('canvas');

canvas.width = width;

canvas.height = height;

const ctx = canvas.getContext('2d');

// JPEG has no alpha channel; flatten onto white rather than black.
if (img.dataset.metaFlattened !== '1') {

ctx.fillStyle = '#ffffff';

ctx.fillRect(0, 0, width, height);

img.dataset.metaFlattened = '1';

}

ctx.drawImage(img, 0, 0, width, height);

return canvas;

}

function metaStripJpeg(bytes) {

if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return null;

const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

const chunks = [metaSlice(bytes, 0, 2)];

const found = [];

const n = bytes.length;

let i = 2;

while (i < n - 1) {

if (bytes[i] !== 0xFF) { i++; continue; }

const marker = bytes[i + 1];

if (marker === 0xD9) { chunks.push(metaSlice(bytes, i, n)); break; }

// Standalone markers carry no length
if (marker === 0xD8 || (marker >= 0xD0 && marker <= 0xD7) || marker === 0x01) { i += 2; continue; }

if (i + 4 > n) break;

const length = view.getUint16(i + 2, false);

const total = 2 + length;

const isApp = marker >= 0xE0 && marker <= 0xEF;

const isCom = marker === 0xFE;

if (isApp || isCom) {

const payload = bytes.subarray(i + 4, Math.min(i + total, n));

// JFIF is structural, not private, and some decoders expect it.
const isJfif = isApp && payload[0] === 0x4A && payload[1] === 0x46
&& payload[2] === 0x49 && payload[3] === 0x46;

if (isJfif) {

chunks.push(metaSlice(bytes, i, i + total));

} else {

const label = isCom ? 'COM' : 'APP' + (marker - 0xE0);

found.push(metaDescribeJpegApp(label, payload));

}

} else {

chunks.push(metaSlice(bytes, i, i + total));

}

if (marker === 0xDA) {

// Start of scan: the entropy-coded data runs to the next real marker
// and must be copied verbatim, byte stuffing and all.

let j = i + total;

while (j < n - 1) {

if (bytes[j] === 0xFF && bytes[j + 1] !== 0x00 && !(bytes[j + 1] >= 0xD0 && bytes[j + 1] <= 0xD7)) break;

j++;

}

chunks.push(metaSlice(bytes, i + 2 + length, j));

i = j;

continue;

}

i += total;

}

const clean = metaConcat(chunks);

return { bytes: clean, found };

}

// Strip metadata chunks from a PNG (tEXt, zTXt, iTXt, eXIf, tIME, acTL).

function metaStripPng(bytes) {

const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

for (let k = 0; k < 8; k++) if (bytes[k] !== sig[k]) return null;

const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

const chunks = [metaSlice(bytes, 0, 8)];

const found = [];

const n = bytes.length;

let i = 8;

while (i + 8 <= n) {

const length = view.getUint32(i, false);

const type = String.fromCharCode(bytes[i+4], bytes[i+5], bytes[i+6], bytes[i+7]);

const end = i + 12 + length;

if (type === 'tEXt' || type === 'zTXt' || type === 'iTXt') {

found.push({ label: type, kind: 'TEXT', detail: 'meta.detail_text' });

} else if (type === 'eXIf') {

found.push({ label: 'eXIf', kind: 'EXIF', detail: 'meta.detail_exif' });

} else if (type === 'tIME') {

found.push({ label: 'tIME', kind: 'TIME', detail: 'meta.detail_time' });

} else if (type === 'acTL') {

found.push({ label: 'acTL', kind: 'ANIM', detail: 'meta.detail_anim' });

} else {

chunks.push(metaSlice(bytes, i, Math.min(end, n)));

}

if (type === 'IEND') break;

i = end;

}

return { bytes: metaConcat(chunks), found };

}

// Strip EXIF and XMP chunks from a WebP RIFF container.

function metaStripWebp(bytes) {

if (bytes[0] !== 0x52 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x46) return null;

if (bytes[8] !== 0x57 || bytes[9] !== 0x45 || bytes[10] !== 0x42 || bytes[11] !== 0x50) return null;

const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

const body = [];

const found = [];

const n = bytes.length;

let i = 12;

while (i + 8 <= n) {

const fourcc = String.fromCharCode(bytes[i], bytes[i+1], bytes[i+2], bytes[i+3]);

const size = view.getUint32(i + 4, true);

const padded = size + (size & 1);

if (fourcc === 'EXIF') {

found.push({ label: 'EXIF', kind: 'EXIF', detail: 'meta.detail_exif' });

} else if (fourcc === 'XMP ') {

found.push({ label: 'XMP', kind: 'XMP', detail: 'meta.detail_xmp' });

} else if (fourcc === 'ICCP') {

found.push({ label: 'ICCP', kind: 'ICC', detail: 'meta.detail_icc' });

} else {

body.push(metaSlice(bytes, i, Math.min(i + 8 + padded, n)));

}

i += 8 + padded;

}

const bodyBytes = metaConcat(body);

// Rewrite the RIFF size field to match the new payload.

const header = new Uint8Array(12);

header.set(bytes.subarray(0, 4), 0);

new DataView(header.buffer).setUint32(4, bodyBytes.length + 4, true);

header.set(bytes.subarray(8, 12), 8);

return { bytes: metaConcat([header, bodyBytes]), found };

}

function metaStrip(bytes, type) {

if (type === 'image/jpeg') return metaStripJpeg(bytes);

if (type === 'image/png') return metaStripPng(bytes);

if (type === 'image/webp') return metaStripWebp(bytes);

return null;

}

function metaShowError(message) {

const area = document.getElementById('metaUploadArea');

if (!area) return;

let box = area.parentElement.querySelector('.meta-error');

if (!box) {

box = document.createElement('div');

box.className = 'error-message meta-error';

area.after(box);

}

box.textContent = message;

}

function metaClearError() {

document.querySelectorAll('.meta-error').forEach(e => e.remove());

}

function metaFormatLabel(type) {

return (META_TYPES[type] || type || 'IMAGE').split('/')[1].toUpperCase();

}

function metaResetResult() {

const result = document.getElementById('metaResultSection');

if (result) result.classList.add('hidden');

const report = document.getElementById('metaReport');

if (report) report.classList.add('hidden');

}

function metaRenderReport(found, originalSize, cleanSize, reencoded, orientation, type) {

const list = document.getElementById('metaList');

const title = document.getElementById('metaReportTitle');

const verdict = document.getElementById('metaVerdict');

const note = document.getElementById('metaNote');

const report = document.getElementById('metaReport');

if (!list || !report) return;

list.innerHTML = '';

if (found.length === 0) {

title.textContent = t('meta.no_metadata');

verdict.textContent = t('meta.nothing_to_remove');

verdict.className = 'meta-verdict clean';

const checked = metaScanSummary(type);

note.textContent = t('meta.already_clean') + ' '
+ (checked.length ? checked.join(', ') + '.' : t('meta.all_containers'))
+ ' ' + t('meta.nothing_found');

// Show the scan actually ran, rather than an empty state.
checked.forEach((label) => {

const li = document.createElement('li');

li.className = 'meta-item meta-item-clear';

const kind = document.createElement('span');

kind.className = 'meta-kind';

kind.textContent = t('status.clean');

const name = document.createElement('span');

name.className = 'meta-label';

name.textContent = label;

const detail = document.createElement('span');

detail.className = 'meta-detail';

detail.textContent = t('status.not_present');

li.appendChild(kind);

li.appendChild(name);

li.appendChild(detail);

list.appendChild(li);

});

} else {

title.textContent = `${t('meta.metadata_found')} (${found.length})`;

verdict.textContent = t('meta.will_be_removed');

verdict.className = 'meta-verdict dirty';

found.forEach(item => {

const li = document.createElement('li');

li.className = 'meta-item';

const kind = document.createElement('span');

kind.className = 'meta-kind';

kind.textContent = t('meta.kind_' + item.kind.toLowerCase(), item.kind);

const label = document.createElement('span');

label.className = 'meta-label';

label.textContent = item.label;

const detail = document.createElement('span');

detail.className = 'meta-detail';

detail.textContent = t(item.detail);

li.appendChild(kind);

li.appendChild(label);

li.appendChild(detail);

list.appendChild(li);

});

const saved = originalSize - cleanSize;

if (reencoded) {

note.textContent = `${t('meta.rotation_note')} ${orientation}${t('meta.rotation_baked')}`;

} else {

note.textContent = saved > 0

? `${t('meta.saves_note')} ${formatFileSize(saved)} ${t('meta.hidden_data')}`

: 'The picture itself is not re-encoded, so there is no quality loss.';

}

}

report.classList.remove('hidden');

}

// Summarise what a scan actually looked for. A bare "nothing found" is
// indistinguishable from a broken detector, so when a file comes back clean we
// state exactly which containers were inspected. That way the user can tell
// "this file really is clean" apart from "the scan missed it".

function metaScanSummary(type) {

const map = {

'image/jpeg': ['EXIF (APP1)', 'XMP', 'ICC profile', 'IPTC / Photoshop', 'comments (COM)'],

'image/png': ['eXIf', 'tEXt / zTXt / iTXt', 'tIME'],

'image/webp': ['EXIF', 'XMP', 'ICC profile']

};

return map[type] || [];

}

function metaFinish(blob, found, reencoded, orientation) {

if (metaOutputUrl) URL.revokeObjectURL(metaOutputUrl);

metaOutputBlob = blob;

metaOutputUrl = URL.createObjectURL(blob);

const outImg = document.getElementById('metaOutputImage');

outImg.onload = () => {

metaRenderReport(found, metaCurrentFile.size, blob.size, reencoded, orientation, metaCurrentFile.type);

const diff = blob.size - metaCurrentFile.size;

const pct = metaCurrentFile.size ? Math.abs(diff / metaCurrentFile.size * 100).toFixed(1) : '0.0';

document.getElementById('metaOriginalSize').textContent = formatFileSize(metaCurrentFile.size);

document.getElementById('metaOutputSize').textContent = formatFileSize(blob.size);

document.getElementById('metaSizeChange').textContent = diff === 0
? t('ui.no_change')
: (diff < 0 ? `${t('ui.reduced_by')} ${formatFileSize(-diff)} (${pct}%)` : `${t('ui.grew_by')} ${formatFileSize(diff)} (${pct}%)`);

document.getElementById('metaDims').textContent = `${outImg.naturalWidth} × ${outImg.naturalHeight}`;

document.getElementById('metaQuality').textContent = reencoded
? 'Re-encoded to apply rotation'
: t('stat.untouched_lossless');

document.getElementById('metaResultSection').classList.remove('hidden');

};

outImg.onerror = () => {

metaShowError(t('meta.error_display'));

};

outImg.src = metaOutputUrl;

}

function metaClean() {

if (!metaCurrentFile) return;

const btn = document.getElementById('metaCleanBtn');

btn.textContent = t('meta.cleaning');

btn.disabled = true;

const done = () => { btn.textContent = t('meta.clean_btn'); btn.disabled = false; };

metaCurrentFile.arrayBuffer().then((buffer) => {

const bytes = new Uint8Array(buffer);

// A browser displays a photo using its EXIF orientation. Deleting that tag
// without baking the rotation into the pixels would leave the image sideways,
// so a rotated photo takes a re-encode path and says so in the report.

const orientation = metaCurrentFile.type === 'image/jpeg'
? metaReadJpegOrientation(bytes)
: 1;

if (orientation > 1) {

const img = document.getElementById('metaPreviewImage');

const canvas = metaFlattenOrientation(img);

// Re-encoding is only needed for rotated photos. Use a high quality so the
// single unavoidable generation costs as little visible detail as possible.

const quality = 0.95;

canvas.toBlob((blob) => {

if (!blob) { metaShowError(t('meta.error_reencode')); return; }

metaFinish(blob, [{ label: 'APP1', kind: 'EXIF', detail: 'Camera, GPS and timestamp data' }], true, orientation);

}, 'image/jpeg', quality);

return;

}

const result = metaStrip(bytes, metaCurrentFile.type);

if (!result) {

metaShowError(t('meta.error_format'));

return;

}

metaFinish(new Blob([result.bytes], { type: metaCurrentFile.type }), result.found, false, 1);

}).catch(() => {

metaShowError(t('meta.error_read_file'));

}).then(done);

}


function setupMetadataCleaner() {

const uploadArea = document.getElementById('metaUploadArea');

const fileInput = document.getElementById('metaFileInput');

const browseBtn = document.getElementById('metaBrowseBtn');

const removeBtn = document.getElementById('metaRemoveBtn');

const cleanBtn = document.getElementById('metaCleanBtn');

const downloadBtn = document.getElementById('metaDownloadBtn');

browseBtn.addEventListener('click', () => fileInput.click());

function loadMetaImage(file) {

if (!file || !file.type || !file.type.startsWith('image/')) {

metaShowError(t('meta.error_type'));

return;

}

metaClearError();

metaResetResult();

metaOutputBlob = null;

if (metaOutputUrl) { URL.revokeObjectURL(metaOutputUrl); metaOutputUrl = null; }

const objectUrl = URL.createObjectURL(file);

const img = new Image();

img.onload = () => {

if (metaSourceUrl) URL.revokeObjectURL(metaSourceUrl);

metaSourceUrl = objectUrl;

metaCurrentFile = file;

document.getElementById('metaPreviewImage').src = objectUrl;

document.getElementById('metaPreviewFilename').textContent = file.name;

document.getElementById('metaPreviewSize').textContent = formatFileSize(file.size);

document.getElementById('metaPreviewDims').textContent = `${img.naturalWidth} × ${img.naturalHeight}`;

document.getElementById('metaPreviewFormat').textContent = metaFormatLabel(file.type);

document.getElementById('metaImagePreview').classList.remove('hidden');

uploadArea.classList.add('hidden');

syncCleanButton();

};

img.onerror = () => {

URL.revokeObjectURL(objectUrl);

// Clear the preview: leaving the previous file's name and size on screen
// while showing an error for a new file is actively misleading.

metaCurrentFile = null;

const stale = document.getElementById('metaPreviewFilename');

if (stale) stale.textContent = '—';

const staleSize = document.getElementById('metaPreviewSize');

if (staleSize) staleSize.textContent = '';

const staleDims = document.getElementById('metaPreviewDims');

if (staleDims) staleDims.textContent = '';

metaShowError(t('conv.error_read'));

syncCleanButton();

};

img.src = objectUrl;

}

fileInput.addEventListener('change', (e) => {

if (e.target.files[0]) loadMetaImage(e.target.files[0]);

});

uploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

uploadArea.classList.add('drag-over');

});

uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));

uploadArea.addEventListener('drop', (e) => {

e.preventDefault();

uploadArea.classList.remove('drag-over');

const file = e.dataTransfer.files[0];

if (file) loadMetaImage(file);

});

cleanBtn.addEventListener('click', metaClean);

// Cleaning is only possible once an image has actually loaded.
const syncCleanButton = () => {

cleanBtn.disabled = !metaCurrentFile;

};

syncCleanButton();

downloadBtn.addEventListener('click', () => {

if (!metaOutputBlob) {

alert(t('meta.error_clean_first'));

return;

}

const base = safeBaseName(metaCurrentFile && metaCurrentFile.name, 'photo');

const ext = (metaCurrentFile.type || 'image/jpeg').split('/')[1].replace('jpeg', 'jpg');

const url = URL.createObjectURL(metaOutputBlob);

const link = document.createElement('a');

link.href = url;

link.download = `${base}-clean.${ext}`;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

setTimeout(() => URL.revokeObjectURL(url), 1000);

});

removeBtn.addEventListener('click', () => {

metaCurrentFile = null;

metaOutputBlob = null;

fileInput.value = '';

if (metaOutputUrl) { URL.revokeObjectURL(metaOutputUrl); metaOutputUrl = null; }

if (metaSourceUrl) { URL.revokeObjectURL(metaSourceUrl); metaSourceUrl = null; }

const preview = document.getElementById('metaPreviewImage');

if (preview) preview.src = '';

const out = document.getElementById('metaOutputImage');

if (out) out.removeAttribute('src');

document.getElementById('metaImagePreview').classList.add('hidden');

uploadArea.classList.remove('hidden');

syncCleanButton();

metaResetResult();

metaClearError();

});

}

// Image Converter functionality
//
// Supported formats: JPEG, PNG, WebP, BMP, GIF, AVIF.
// Native Canvas encode is used where the browser supports it (JPG/PNG/WebP);
// BMP is written by a small inline encoder; GIF and AVIF use lightweight
// client-side encoders (gifenc, @jsquash/avif) loaded lazily from a CDN.
// Everything runs in the browser; images are never uploaded to any server.

const CONV_FORMATS = {
'image/jpeg': { label: 'JPG / JPEG', ext: 'jpg',  lossy: true  },
'image/png':  { label: 'PNG',       ext: 'png',  lossy: false },
'image/webp': { label: 'WebP',      ext: 'webp', lossy: true  },
'image/bmp':  { label: 'BMP',       ext: 'bmp',  lossy: false },
'image/gif':  { label: 'GIF',       ext: 'gif',  lossy: false },
'image/avif': { label: 'AVIF',      ext: 'avif', lossy: true  }
};

const CONV_LOSSY_FORMATS = ['image/jpeg', 'image/webp', 'image/avif'];

let convCurrentFile = null;

let convImage = null;

let convSourceMime = 'image/png';

let convOutputBlob = null;

let convOutputUrl = null;

// The source object URL is tracked separately so it can be revoked. The old
// code created one per load and never released it, leaking one URL per image.

let convSourceUrl = null;

let convGifEncPromise = null;

let convAvifEncPromise = null;

function convNormMime(mime) {
if (mime && CONV_FORMATS[mime]) return mime;
if (mime === 'image/jpg') return 'image/jpeg';
return null;
}

function loadConvGifEnc() {
// Reset on failure so a transient network error can be retried
if (convGifEncPromise === null) {
convGifEncPromise = import('https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js').catch((err) => {
convGifEncPromise = null;
throw err;
});
}
return convGifEncPromise;
}

function loadConvAvifEnc() {
// Reset on failure so a transient network error can be retried
if (convAvifEncPromise === null) {
convAvifEncPromise = import('https://cdn.jsdelivr.net/npm/@jsquash/avif@2.1.1/+esm').catch((err) => {
convAvifEncPromise = null;
throw err;
});
}
return convAvifEncPromise;
}

function convShowError(message) {
const box = document.getElementById('convError');
box.textContent = message;
box.classList.remove('hidden');
}

function convHideError() {
document.getElementById('convError').classList.add('hidden');
}

function loadConvImage(file) {
if (!file || !file.type || !file.type.startsWith('image/')) {
convShowError(t('conv.error_unsupported'));
return;
}
convCurrentFile = file;
convImage = null;
convOutputBlob = null;
if (convOutputUrl) { URL.revokeObjectURL(convOutputUrl); convOutputUrl = null; }
if (convSourceUrl) { URL.revokeObjectURL(convSourceUrl); convSourceUrl = null; }
convHideError();

const objectUrl = URL.createObjectURL(file);
const img = new Image();
img.onload = () => {
convImage = img;
convSourceMime = convNormMime(file.type) || 'image/png';
convSourceUrl = objectUrl;

document.getElementById('convPreviewImage').src = objectUrl;
document.getElementById('convPreviewFilename').textContent = file.name;
document.getElementById('convPreviewSize').textContent = formatFileSize(file.size);
document.getElementById('convPreviewDims').textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
const previewFmt = CONV_FORMATS[convSourceMime] ? CONV_FORMATS[convSourceMime].label.split(' ')[0].toUpperCase() : 'IMG';
document.getElementById('convPreviewFormat').textContent = previewFmt;

document.getElementById('convImagePreview').classList.remove('hidden');
document.getElementById('convUploadArea').classList.add('hidden');
document.getElementById('convControls').classList.remove('hidden');
document.getElementById('convOutputPreview').classList.add('hidden');
document.getElementById('convOutputControls').classList.remove('hidden');
document.getElementById('convResultSection').classList.add('hidden');

populateConvFormats(convSourceMime);
};
img.onerror = () => {
URL.revokeObjectURL(objectUrl);
convShowError(t('conv.error_read'));
};
img.src = objectUrl;
}

function populateConvFormats(sourceMime) {
const select = document.getElementById('convFormatSelect');
select.innerHTML = '';
Object.keys(CONV_FORMATS).forEach(mime => {
if (mime === sourceMime) return;
const opt = document.createElement('option');
opt.value = mime;
opt.textContent = CONV_FORMATS[mime].label;
select.appendChild(opt);
});
select.selectedIndex = 0;
updateConvQualityUI(select.value);
updateConvGifNote(sourceMime, select.value);
}

function updateConvGifNote(sourceMime, targetMime) {
const note = document.getElementById('convGifNote');
note.classList.toggle('hidden', !(sourceMime === 'image/gif' || targetMime === 'image/gif'));
}

function updateConvQualityUI(mime) {
const row = document.getElementById('convQualityRow');
const slider = document.getElementById('convQualitySlider');
const note = document.getElementById('convQualityNote');
const lossy = CONV_LOSSY_FORMATS.indexOf(mime) !== -1;
slider.disabled = !lossy;
row.style.display = lossy ? '' : 'none';
note.classList.toggle('hidden', lossy);
}

function clearConvImage() {
convCurrentFile = null;
convImage = null;
convOutputBlob = null;
if (convOutputUrl) { URL.revokeObjectURL(convOutputUrl); convOutputUrl = null; }
if (convSourceUrl) { URL.revokeObjectURL(convSourceUrl); convSourceUrl = null; }
convHideError();
document.getElementById('convFileInput').value = '';
document.getElementById('convPreviewImage').src = '';
document.getElementById('convImagePreview').classList.add('hidden');
document.getElementById('convUploadArea').classList.remove('hidden');
document.getElementById('convControls').classList.add('hidden');
document.getElementById('convOutputPreview').classList.add('hidden');
document.getElementById('convOutputControls').classList.add('hidden');
document.getElementById('convResultSection').classList.add('hidden');
document.getElementById('convProcessingMessage').classList.add('hidden');
}

function canvasToBlobPromise(canvas, mime, quality) {
return new Promise((resolve, reject) => {
canvas.toBlob((blob) => {
if (blob) resolve(blob);
else reject(new Error('The browser could not encode this format: ' + mime));
}, mime, quality);
});
}

// Write a 32-bit BMP (BGRA) from ImageData. Canvas toBlob does not reliably
// produce a real BMP, so we generate one directly.
function encodeBMP(imageData) {
const w = imageData.width;
const h = imageData.height;
const data = imageData.data;
const rowSize = w * 4;
const pixelArraySize = rowSize * h;
const fileSize = 54 + pixelArraySize;

const buf = new ArrayBuffer(fileSize);
const v = new DataView(buf);
v.setUint8(0, 0x42); v.setUint8(1, 0x4D);
v.setUint32(2, fileSize, true);
v.setUint32(10, 54, true);
v.setUint32(14, 40, true);
v.setInt32(18, w, true);
v.setInt32(22, h, true);
v.setUint16(26, 1, true);
v.setUint16(28, 32, true);
v.setUint32(30, 0, true);
v.setUint32(34, pixelArraySize, true);
v.setInt32(38, 2835, true);
v.setInt32(42, 2835, true);
v.setUint32(46, 0, true);
v.setUint32(50, 0, true);
let offset = 54;
for (let y = h - 1; y >= 0; y--) {
for (let x = 0; x < w; x++) {
const i = (y * w + x) * 4;
v.setUint8(offset, data[i + 2]);
v.setUint8(offset + 1, data[i + 1]);
v.setUint8(offset + 2, data[i]);
v.setUint8(offset + 3, data[i + 3]);
offset += 4;
}
}
return new Blob([buf], { type: 'image/bmp' });
}

// Encode one frame as GIF (single frame) using gifenc.
// gifenc quantizes the entire ImageData, which is very slow and memory hungry
// on large images. A GIF palette holds only 256 colors, so resampling for the
// encode costs nothing in output fidelity.
async function encodeGIF(canvas, imageData) {
const mod = await loadConvGifEnc();

let data = imageData;

const GIF_MAX_EDGE = 800;

const longest = Math.max(imageData.width, imageData.height);

if (longest > GIF_MAX_EDGE) {

const scale = GIF_MAX_EDGE / longest;

const work = document.createElement('canvas');

work.width = Math.max(1, Math.floor(imageData.width * scale));

work.height = Math.max(1, Math.floor(imageData.height * scale));

const wctx = work.getContext('2d');

wctx.imageSmoothingQuality = 'high';

wctx.drawImage(canvas, 0, 0, work.width, work.height);

data = wctx.getImageData(0, 0, work.width, work.height);

}

const gif = mod.GIFEncoder();
const palette = mod.quantize(data.data, 256);
const index = mod.applyPalette(data.data, palette);
gif.writeFrame(index, data.width, data.height, { palette });
gif.finish();
return new Blob([gif.bytes()], { type: 'image/gif' });
}

// Encode as AVIF using @jsquash/avif (WASM, client-side).
async function encodeAVIF(imageData, quality) {
const mod = await loadConvAvifEnc();
// @jsquash/avif's encode() returns an ArrayBuffer of raw bytes — wrap as a Blob.
const bytes = await mod.encode(imageData, { quality: quality / 100 });
return new Blob([bytes], { type: 'image/avif' });
}

async function convertImage() {
if (!convImage || !convCurrentFile) return;
const mime = document.getElementById('convFormatSelect').value;
const fmt = CONV_FORMATS[mime];
if (!fmt) return;
const quality = parseInt(document.getElementById('convQualitySlider').value, 10) || 80;

convHideError();
document.getElementById('convResultSection').classList.add('hidden');
document.getElementById('convOutputPreview').classList.add('hidden');
document.getElementById('convProcessingMessage').classList.remove('hidden');
const btn = document.getElementById('convConvertBtn');
btn.disabled = true;

const canvas = document.createElement('canvas');
canvas.width = convImage.naturalWidth;
canvas.height = convImage.naturalHeight;
const ctx = canvas.getContext('2d');
if (mime === 'image/jpeg') {
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
}
ctx.drawImage(convImage, 0, 0);

try {
let blob;
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
if (mime === 'image/bmp') {
blob = encodeBMP(imageData);
} else if (mime === 'image/gif') {
blob = await encodeGIF(canvas, imageData);
} else if (mime === 'image/avif') {
blob = await encodeAVIF(imageData, quality);
} else {
blob = await canvasToBlobPromise(canvas, mime, mime === 'image/png' ? undefined : (quality / 100));
}
convOutputBlob = blob;
if (convOutputUrl) URL.revokeObjectURL(convOutputUrl);
convOutputUrl = URL.createObjectURL(blob);
applyConvResult(blob, mime, canvas.width, canvas.height);
} catch (err) {
console.error('Conversion error:', err);
convShowError(t('conv.error_failed') + ' ' + ((err && err.message) ? err.message : t('conv.error_unknown')));
} finally {
document.getElementById('convProcessingMessage').classList.add('hidden');
btn.disabled = false;
}
}

function applyConvResult(blob, mime, width, height) {
const fmt = CONV_FORMATS[mime];
const originalSize = convCurrentFile.size;
const outputSize = blob.size;
const sizeDiff = outputSize - originalSize;
const percent = originalSize ? ((sizeDiff / originalSize) * 100) : 0;
let changeText;
if (outputSize < originalSize) {
changeText = `Reduced by ${formatFileSize(Math.abs(sizeDiff))} (${Math.abs(percent).toFixed(1)}%)`;
} else if (outputSize > originalSize) {
changeText = `Increased by ${formatFileSize(sizeDiff)} (${percent.toFixed(1)}%)`;
} else {
changeText = t('ui.no_change');
}
const fmtShort = fmt.label.split(' ')[0].toUpperCase();

document.getElementById('convOutputImage').src = convOutputUrl;
document.getElementById('convOutputDims').textContent = `${width} × ${height}`;
document.getElementById('convOutputFormat').textContent = fmtShort;
document.getElementById('convOutputSize').textContent = formatFileSize(outputSize);
document.getElementById('convOutputPreview').classList.remove('hidden');

document.getElementById('convOriginalSize').textContent = formatFileSize(originalSize);
document.getElementById('convOutputSizeFinal').textContent = formatFileSize(outputSize);
document.getElementById('convSizeReduction').textContent = changeText;
document.getElementById('convFinalDims').textContent = `${width} × ${height}`;
document.getElementById('convFinalFormat').textContent = fmtShort;
document.getElementById('convResultSection').classList.remove('hidden');
}

function convDownload() {
if (!convOutputBlob) return;
const mime = document.getElementById('convFormatSelect').value;
const fmt = CONV_FORMATS[mime];
const baseName = safeBaseName(convCurrentFile && convCurrentFile.name, 'image');
const url = URL.createObjectURL(convOutputBlob);
const link = document.createElement('a');
link.href = url;
link.download = `${baseName}-converted.${fmt.ext}`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setupFileConverter() {
const uploadArea = document.getElementById('convUploadArea');
const fileInput = document.getElementById('convFileInput');
const browseBtn = document.getElementById('convBrowseBtn');
const removeBtn = document.getElementById('convRemoveBtn');
const convertBtn = document.getElementById('convConvertBtn');
const downloadBtn = document.getElementById('convDownloadBtn');
const formatSelect = document.getElementById('convFormatSelect');
const qualitySlider = document.getElementById('convQualitySlider');
const qualityValue = document.getElementById('convQualityValue');

browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
if (e.target.files[0]) loadConvImage(e.target.files[0]);
});

uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', (e) => {
e.preventDefault();
uploadArea.classList.remove('drag-over');
const file = e.dataTransfer.files[0];
if (file) loadConvImage(file);
});

removeBtn.addEventListener('click', clearConvImage);

formatSelect.addEventListener('change', () => {
updateConvQualityUI(formatSelect.value);
updateConvGifNote(convSourceMime, formatSelect.value);
});

qualitySlider.addEventListener('input', () => {
qualityValue.textContent = qualitySlider.value;
});

convertBtn.addEventListener('click', convertImage);
downloadBtn.addEventListener('click', convDownload);
}

// Lazy-load the QR library on first use.
// The previous version polled `typeof QRCode` every 100 ms forever, burning a
// timer indefinitely whenever the CDN was blocked or the machine offline.

let qrLibraryPromise = null;

const QR_SRI = 'sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU';

function loadQrLibrary() {

if (qrLibraryPromise === null) {

qrLibraryPromise = new Promise((resolve, reject) => {

if (typeof QRCode !== 'undefined') {

resolve(QRCode);

return;

}

const script = document.createElement('script');

script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

script.async = true;

script.integrity = QR_SRI;

script.crossOrigin = 'anonymous';

script.onload = () => {

if (typeof QRCode !== 'undefined') {

resolve(QRCode);

} else {

reject(new Error('QR library loaded but did not register'));

}

};

script.onerror = () => {

script.remove();

qrLibraryPromise = null;

reject(new Error('Could not load the QR code library'));

};

document.head.appendChild(script);

}).catch((err) => {

// Allow a retry after a failed attempt

qrLibraryPromise = null;

throw err;

});

}

return qrLibraryPromise;

}

function initQRGenerator() {

loadQrLibrary().then(() => {

setupQRGenerator();

}).catch((err) => {

console.error('QR library unavailable:', err);

const content = document.querySelector('#qr-generator .qr-content');

if (!content) return;

if (content.querySelector('.qr-load-error')) return;

const note = document.createElement('div');

note.className = 'error-message qr-load-error';

note.textContent = t('qr.lib_error');

content.prepend(note);

});

}


// ---------------------------------------------------------------------------
// Batch processing
//
// Each adapter processes exactly ONE file and returns { blob, filename }.
// They read the tool's current settings from the DOM at call time, so changing
// quality or format applies to the whole batch, but they never write to the
// single-image tool state -- that would make the single preview flicker and
// lose the user's image while a batch is running.
// ---------------------------------------------------------------------------

// Map an output MIME type to a file extension.
function batchExtFor(mime, fallback) {

const map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/bmp': 'bmp', 'image/avif': 'avif' };

return map[mime] || fallback || 'png';

}

// --- Image Compressor ------------------------------------------------------

async function batchCompressFile(file) {

const handle = await decodeImageFile(file);

try {

const img = handle.img;

const ratio = img.width && img.height ? img.width / img.height : 1;

let width = parseInt(document.getElementById('widthInput').value, 10);

let height = parseInt(document.getElementById('heightInput').value, 10);

if (!Number.isFinite(width) || width < 1) width = img.width;

if (!Number.isFinite(height) || height < 1) height = img.height;

// The aspect lock is relative to THIS file, so a batch of mixed sizes keeps
// every image's own proportions.
if (document.getElementById('aspectRatioLock').checked) {

height = Math.round(width / ratio);

}

width = Math.min(Math.round(width), MAX_DIMENSION);

height = Math.min(Math.round(height), MAX_DIMENSION);

if (width * height > MAX_PIXELS) {

const shrink = Math.sqrt(MAX_PIXELS / (width * height));

width = Math.max(1, Math.floor(width * shrink));

height = Math.max(1, Math.floor(height * shrink));

}

const format = document.getElementById('formatSelect').value;

const quality = parseInt(document.getElementById('qualitySlider').value, 10) / 100;

const canvas = document.createElement('canvas');

canvas.width = width;

canvas.height = height;

drawSourceOntoCanvas(canvas.getContext('2d'), img, width, height, format);

const blob = await new Promise((resolve, reject) => {

canvas.toBlob((b) => b ? resolve(b) : reject(new Error(t('compressor.error_generate'))), format, quality);

});

return { blob, filename: safeBaseName(file.name, 'image') + '-compressed.' + batchExtFor(blob.type, batchExtFor(format)) };

} finally {

releaseImage(handle);

}

}

// --- Image Resizer ---------------------------------------------------------

async function batchResizeFile(file) {

const handle = await decodeImageFile(file);

try {

const img = handle.img;

const type = file.type || 'image/png';

// The width field is the target width, and every file in the batch is resized
// to it -- that is what setting a width and expecting the whole queue to follow
// means. Each image then keeps its own proportions, because forcing one exact
// width/height box onto files with different shapes would distort all but the
// first. An unlocked height is honoured as given, since that is an explicit
// choice. With no usable width the scale slider is the fallback.
const widthField = parseFloat(document.getElementById('resizeWidthInput').value);

const heightField = parseFloat(document.getElementById('resizeHeightInput').value);

const lockEl = document.getElementById('resizeAspectRatioLock');

const locked = lockEl ? lockEl.checked : true;

const scale = parseFloat(document.getElementById('resizeScaleSlider').value) || 100;

let width;

let height;

if (widthField > 0) {

width = Math.round(widthField);

height = (!locked && heightField > 0)
? Math.round(heightField)
: Math.max(1, Math.round(img.height * (width / img.width)));

} else {

width = Math.round(img.width * (scale / 100));

height = Math.round(img.height * (scale / 100));

}

const final = clampResizeDimensions(width, height);

const lossy = (type === 'image/jpeg' || type === 'image/webp');

const canvas = document.createElement('canvas');

canvas.width = final.width;

canvas.height = final.height;

const ctx = canvas.getContext('2d');

if (type === 'image/jpeg') {

ctx.fillStyle = '#ffffff';

ctx.fillRect(0, 0, final.width, final.height);

}

ctx.drawImage(img, 0, 0, final.width, final.height);

const blob = await new Promise((resolve, reject) => {

canvas.toBlob((b) => b ? resolve(b) : reject(new Error(t('resizer.error_generate'))), type, lossy ? RESIZE_QUALITY : undefined);

});

return { blob, filename: safeBaseName(file.name, 'image') + '-resized.' + (RESIZE_EXT[blob.type] || 'png') };

} finally {

releaseImage(handle);

}

}

// --- Image Converter -------------------------------------------------------

async function batchConvertFile(file) {

const handle = await decodeImageFile(file);

try {

const img = handle.img;

const mime = document.getElementById('convFormatSelect').value;

const fmt = CONV_FORMATS[mime];

if (!fmt) throw new Error(t('conv.error_unsupported'));

const quality = parseInt(document.getElementById('convQualitySlider').value, 10) || 80;

const canvas = document.createElement('canvas');

canvas.width = img.naturalWidth || img.width;

canvas.height = img.naturalHeight || img.height;

const ctx = canvas.getContext('2d');

if (mime === 'image/jpeg') {

ctx.fillStyle = '#ffffff';

ctx.fillRect(0, 0, canvas.width, canvas.height);

}

ctx.drawImage(img, 0, 0);

let blob;

if (mime === 'image/bmp') {

blob = encodeBMP(ctx.getImageData(0, 0, canvas.width, canvas.height));

} else if (mime === 'image/gif') {

blob = await encodeGIF(canvas, ctx.getImageData(0, 0, canvas.width, canvas.height));

} else if (mime === 'image/avif') {

blob = await encodeAVIF(ctx.getImageData(0, 0, canvas.width, canvas.height), quality);

} else {

blob = await canvasToBlobPromise(canvas, mime, mime === 'image/png' ? undefined : (quality / 100));

}

if (!blob) throw new Error(t('conv.error_failed'));

return { blob, filename: safeBaseName(file.name, 'image') + '-converted.' + fmt.ext };

} finally {

releaseImage(handle);

}

}

// --- Metadata Cleaner ------------------------------------------------------

async function batchCleanMetaFile(file) {

const buffer = await file.arrayBuffer();

const bytes = new Uint8Array(buffer);

const type = file.type;

const orientation = type === 'image/jpeg' ? metaReadJpegOrientation(bytes) : 1;

// A rotated photo must have its rotation baked into the pixels, which requires
// a decoded image and therefore a re-encode. Everything else is lossless.
if (orientation > 1) {

const handle = await decodeImageFile(file);

try {

const canvas = metaFlattenOrientation(handle.img);

const blob = await new Promise((resolve, reject) => {

canvas.toBlob((b) => b ? resolve(b) : reject(new Error(t('meta.error_reencode'))), 'image/jpeg', 0.95);

});

return { blob, filename: safeBaseName(file.name, 'photo') + '-clean.jpg' };

} finally {

releaseImage(handle);

}

}

const result = metaStrip(bytes, type);

if (!result) throw new Error(t('meta.error_format'));

const ext = batchExtFor(type, 'png');

return { blob: new Blob([result.bytes], { type }), filename: safeBaseName(file.name, 'photo') + '-clean.' + ext };

}

// --- Background Remover ----------------------------------------------------

async function batchRemoveBgFile(file) {

const mod = await loadBgRemovalLib();

const model = (BG_MODELS[bgModelChoice] || BG_MODELS.balanced).id;

const blob = await mod.removeBackground(file, {

model,

output: { format: 'image/png', type: 'foreground' }

});

if (!blob) throw new Error(t('bgrem.error_failed'));

return { blob, filename: safeBaseName(file.name, 'image') + '-no-bg.png' };

}

// Wire the batch queue into the tools that support it. Each entry only needs to
// name the DOM ids and supply a per-file processor.
function setupBatchProcessing() {

const common = {

onLimit: (n) => console.warn('Batch limited to ' + n + ' files'),

onEmpty: () => {}

};

setupBatchTool(Object.assign({

idPrefix: 'compress',

primaryBtnId: 'generateBtn',

inputId: 'fileInput',

anchorId: 'uploadArea',

uploadAreaId: 'uploadArea',

processFile: batchCompressFile

}, common));

setupBatchTool(Object.assign({

idPrefix: 'resize',

primaryBtnId: 'resizeGenerateBtn',

inputId: 'resizeFileInput',

anchorId: 'resizeUploadArea',

uploadAreaId: 'resizeUploadArea',

processFile: batchResizeFile

}, common));

setupBatchTool(Object.assign({

idPrefix: 'bg',

primaryBtnId: 'bgProcessBtn',

inputId: 'bgFileInput',

anchorId: 'bgUploadArea',

uploadAreaId: 'bgUploadArea',

processFile: batchRemoveBgFile

}, common));

setupBatchTool(Object.assign({

idPrefix: 'conv',

primaryBtnId: 'convConvertBtn',

inputId: 'convFileInput',

anchorId: 'convUploadArea',

uploadAreaId: 'convUploadArea',

processFile: batchConvertFile

}, common));

setupBatchTool(Object.assign({

idPrefix: 'meta',

primaryBtnId: 'metaCleanBtn',

inputId: 'metaFileInput',

anchorId: 'metaUploadArea',

uploadAreaId: 'metaUploadArea',

processFile: batchCleanMetaFile

}, common));

}

// Initialize

syncNavbarSpacer();

document.addEventListener('DOMContentLoaded', () => {

// Resolve the language first: renderTools() and setupAbout() both read t().
i18nInit();

i18nSetupSwitchers();

renderTools();

setupNavigation();

setupAbout();

setupTheme();

setupCompressor();

setupPaletteExtractor();

setupResizeImage();

setupResizeGenerate();

setupBackgroundRemoval();

setupFileConverter();

setupMetadataCleaner();

setupBase64Converter();

setupBatchProcessing();

// The QR library is only needed if the user actually opens that tool

let qrReady = false;

function ensureQr() {

if (qrReady) return;

qrReady = true;

initQRGenerator();

}

document.addEventListener('click', (e) => {

if (!e.target.closest) return;

if (e.target.closest('.nav-link[data-target="qr-generator"]') ||
e.target.closest('.tool-card[data-id="qr-generator"]')) {

ensureQr();

}

});

const homeSection = document.getElementById('home');

if (homeSection && 'MutationObserver' in window) {

new MutationObserver(() => {

if (document.getElementById('qr-generator').classList.contains('active')) ensureQr();

}).observe(homeSection, { attributes: true, attributeFilter: ['class'] });

}

});


window.addEventListener('resize', syncNavbarSpacer, { passive: true });

// The navbar height can change after late-loading webfonts settle.

if (document.fonts && document.fonts.ready) {

document.fonts.ready.then(syncNavbarSpacer);

}
