// Batch processing for the image tools.
//
// A batch job takes a list of File objects, runs one processor over each of
// them one at a time, and then offers every result as a single ZIP download.
//
// Two constraints shaped the design:
//
// 1. The existing per-tool "generate" functions all read module-level state
//    (the single currently-loaded image). They cannot be reused as-is, so each
//    tool supplies its own small, pure `processFile(file)` that decodes that
//    one file and returns a Blob. The engine never touches tool state.
//
// 2. ZIP entries are stored uncompressed. Every payload here is already a
//    compressed image format (JPEG/PNG/WebP/GIF/AVIF), so deflating them would
//    burn CPU for a fraction of a percent and risk a larger file.

const BATCH_MAX_FILES = 50;

// One controller per batch-capable tool, keyed by idPrefix, so the single-file
// code in app.js can tell whether that tool currently holds a batch.
const batchControllers = {};

// ---------------------------------------------------------------------------
// CRC-32 (needed by the ZIP format)
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {

const table = new Uint32Array(256);

for (let i = 0; i < 256; i++) {

let c = i;

for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);

table[i] = c >>> 0;

}

return table;

})();

function crc32(bytes) {

let crc = 0xFFFFFFFF;

for (let i = 0; i < bytes.length; i++) {

crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);

}

return (crc ^ 0xFFFFFFFF) >>> 0;

}

// MS-DOS packed date/time, which is what ZIP headers store.
function dosDateTime(date) {

const year = Math.max(1980, date.getFullYear());

return {

time: ((date.getHours() & 0x1F) << 11) | ((date.getMinutes() & 0x3F) << 5) | ((date.getSeconds() / 2) & 0x1F),
date: (((year - 1980) & 0x7F) << 9) | (((date.getMonth() + 1) & 0x0F) << 5) | (date.getDate() & 0x1F)

};

}

// Turn "a.png" and "a.jpg" into "a.png" and "a (2).jpg" so a ZIP built from
// files that share a base name still has unique entries.
function uniqueNames(names) {

// Every emitted name must be unique in its own right, not merely unique against
// the inputs. Counting repeats of the input name alone is not enough: an input
// literally called "a (2).png" would collide with the name generated for the
// second "a.png", and two identical entries in one archive mean extraction
// silently overwrites one.
const used = new Set();

const counts = new Map();

return names.map((name) => {

const dot = name.lastIndexOf('.');

const stem = dot > 0 ? name.slice(0, dot) : name;

const ext = dot > 0 ? name.slice(dot) : '';

let n = counts.get(name) || 0;

let candidate = n === 0 ? name : `${stem} (${n + 1})${ext}`;

// Walk forward until the candidate is genuinely free, so a name that already
// looks like a generated one still gets its own distinct entry.
while (used.has(candidate)) {

n++;

candidate = `${stem} (${n + 1})${ext}`;

}

counts.set(name, n + 1);

used.add(candidate);

return candidate;

});

}

async function createZip(entries) {

const encoder = new TextEncoder();

const prepared = entries.map((entry) => {

const nameBytes = encoder.encode(entry.name);

return { nameBytes, bytes: entry.bytes, crc: crc32(entry.bytes), localOffset: 0 };

});

// Local headers: 30 + name bytes, then the payload.
let total = 0;

for (const p of prepared) total += 30 + p.nameBytes.length + p.bytes.length;

// Central records: 46 + name bytes each. Then a 22-byte EOCD.
let centralSize = 0;

for (const p of prepared) centralSize += 46 + p.nameBytes.length;

const centralStart = total;

total += centralSize + 22;

const out = new Uint8Array(total);

const view = new DataView(out.buffer);

const stamp = dosDateTime(new Date());

let offset = 0;

// Pass 1: local file headers and their data.
for (const p of prepared) {

p.localOffset = offset;

view.setUint32(offset, 0x04034B50, true); // local file header signature

offset += 4;

view.setUint16(offset, 20, true); // version needed to extract

offset += 2;

// Bit 11 (0x0800) declares the name bytes UTF-8. The site is EN/TR, so names
// like "görsel.png" are the common case, and without this flag unzip and
// Python's zipfile both decode them as CP437 and produce mojibake.
view.setUint16(offset, 0x0800, true); // general purpose flags: UTF-8 names

offset += 2;

view.setUint16(offset, 0, true); // method: store (no compression)

offset += 2;

view.setUint16(offset, stamp.time, true); // last mod time

offset += 2;

view.setUint16(offset, stamp.date, true); // last mod date

offset += 2;

view.setUint32(offset, p.crc, true);

offset += 4;

view.setUint32(offset, p.bytes.length, true); // compressed size

offset += 4;

view.setUint32(offset, p.bytes.length, true); // uncompressed size

offset += 4;

view.setUint16(offset, p.nameBytes.length, true);

offset += 2;

view.setUint16(offset, 0, true); // extra field length

offset += 2;

out.set(p.nameBytes, offset);

offset += p.nameBytes.length;

out.set(p.bytes, offset);

offset += p.bytes.length;

}

// Pass 2: the central directory, in one contiguous block.
for (const p of prepared) {

view.setUint32(offset, 0x02014B50, true); // central file header signature

offset += 4;

view.setUint16(offset, 20, true); // version made by

offset += 2;

view.setUint16(offset, 20, true); // version needed

offset += 2;

view.setUint16(offset, 0x0800, true); // flags: UTF-8 names

offset += 2;

view.setUint16(offset, 0, true); // method

offset += 2;

view.setUint16(offset, stamp.time, true);

offset += 2;

view.setUint16(offset, stamp.date, true);

offset += 2;

view.setUint32(offset, p.crc, true);

offset += 4;

view.setUint32(offset, p.bytes.length, true);

offset += 4;

view.setUint32(offset, p.bytes.length, true);

offset += 4;

view.setUint16(offset, p.nameBytes.length, true);

offset += 2;

view.setUint16(offset, 0, true); // extra field length

offset += 2;

view.setUint16(offset, 0, true); // file comment length

offset += 2;

view.setUint16(offset, 0, true); // disk number start

offset += 2;

view.setUint16(offset, 0, true); // internal file attributes

offset += 2;

view.setUint32(offset, 0, true); // external file attributes

offset += 4;

view.setUint32(offset, p.localOffset, true); // offset of the local header

offset += 4;

out.set(p.nameBytes, offset);

offset += p.nameBytes.length;

}

// Pass 3: end of central directory record.
view.setUint32(offset, 0x06054B50, true);

offset += 4;

view.setUint16(offset, 0, true); // number of this disk

offset += 2;

view.setUint16(offset, 0, true); // disk with the start of the central directory

offset += 2;

view.setUint16(offset, prepared.length, true); // entries on this disk

offset += 2;

view.setUint16(offset, prepared.length, true); // entries in total

offset += 2;

view.setUint32(offset, centralSize, true); // size of the central directory

offset += 4;

view.setUint32(offset, centralStart, true); // offset of the central directory

offset += 4;

view.setUint16(offset, 0, true); // comment length

return new Blob([out], { type: 'application/zip' });

}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Decode one File into an HTMLImageElement. The caller must call releaseImage
// when finished so the object URL is freed.
function decodeImageFile(file) {

return new Promise((resolve, reject) => {

const url = URL.createObjectURL(file);

const img = new Image();

img.onload = () => resolve({ img, url });

img.onerror = () => {

URL.revokeObjectURL(url);

reject(new Error((typeof t === 'function' ? t('error.corrupt') : 'Could not read this image.')));

};

img.src = url;

});

}

function releaseImage(handle) {

if (handle && handle.url) URL.revokeObjectURL(handle.url);

}

function canvasToBlob(canvas, mime, quality) {

return new Promise((resolve) => {

try {

canvas.toBlob((blob) => resolve(blob), mime, quality);

} catch (e) {

resolve(null);

}

});

}

// ---------------------------------------------------------------------------
// Batch UI
// ---------------------------------------------------------------------------

function buildBatchPanel(config) {

const panel = document.createElement('div');

panel.className = 'batch-panel hidden';

panel.id = `${config.idPrefix}BatchPanel`;

panel.innerHTML = `
<div class="batch-header">
<div>
<h3 class="batch-title" data-i18n="batch.title">Batch</h3>
<p class="batch-subtitle" data-i18n="batch.subtitle">These settings are applied to every image.</p>
</div>
<div class="batch-header-actions">
<button type="button" class="btn btn-secondary btn-sm" data-batch-add data-i18n="batch.add_more">Add more</button>
<button type="button" class="btn btn-secondary btn-sm" data-batch-clear data-i18n="btn.clear">Clear</button>
</div>
</div>

<div class="batch-progress hidden" data-batch-progress-wrap role="status">
<div class="batch-progress-bar"><div class="batch-progress-fill" data-batch-progress-fill></div></div>
<span class="batch-progress-text" data-batch-progress-text aria-live="polite"></span>
</div>

<ol class="batch-list" data-batch-list></ol>

<div class="batch-actions">
<button type="button" class="btn btn-primary" data-batch-run>Process all</button>
<button type="button" class="btn btn-secondary hidden" data-batch-zip>Download all (ZIP)</button>
</div>

<div class="batch-summary hidden" data-batch-summary aria-live="polite"></div>
`;

// This panel is injected after i18nApply() has already run over the page, so
// its data-i18n attributes would otherwise never be translated.
if (typeof i18nApply === 'function') i18nApply(panel);

return panel;

}

function renderBatchList(panel, state, config) {

const list = panel.querySelector('[data-batch-list]');

list.innerHTML = '';

state.items.forEach((item, index) => {

const li = document.createElement('li');

li.className = `batch-item batch-item-${item.status}`;

const thumb = document.createElement('div');

thumb.className = 'batch-thumb';

if (item.thumbUrl) {

const img = document.createElement('img');

img.src = item.thumbUrl;

img.alt = '';

thumb.appendChild(img);

}

const info = document.createElement('div');

info.className = 'batch-item-info';

const name = document.createElement('div');

name.className = 'batch-item-name';

name.textContent = item.file.name;

name.title = item.file.name;

const meta = document.createElement('div');

meta.className = 'batch-item-meta';

const sizes = [`${formatFileSize(item.file.size)} → ${item.result ? formatFileSize(item.result.blob.size) : '—'}`];

meta.textContent = item.status === 'error'
? item.error
: (item.status === 'done' ? `${t('batch.done')} · ${sizes[0]}` : sizes[0]);

info.appendChild(name);

info.appendChild(meta);

const remove = document.createElement('button');

remove.type = 'button';

remove.className = 'batch-item-remove';

remove.setAttribute('aria-label', `${t('btn.remove')}: ${item.file.name}`);

remove.textContent = '×';

// Disabled while the batch runs, so the queue cannot be edited mid-flight.
remove.disabled = !!state.running;

remove.addEventListener('click', () => config.onRemove(index));

li.appendChild(thumb);

li.appendChild(info);

li.appendChild(remove);

list.appendChild(li);

});

}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

function setupBatchTool(config) {

const input = document.getElementById(config.inputId);

const anchor = document.getElementById(config.anchorId);

if (!input || !anchor) return null;

// Allow more than one file everywhere batch is offered.
input.multiple = true;

const panel = buildBatchPanel(config);

anchor.after(panel);

const state = { items: [], running: false, aborted: false };

const ui = {

panel,

list: panel.querySelector('[data-batch-list]'),

runBtn: panel.querySelector('[data-batch-run]'),

zipBtn: panel.querySelector('[data-batch-zip]'),

clearBtn: panel.querySelector('[data-batch-clear]'),

addBtn: panel.querySelector('[data-batch-add]'),

progressWrap: panel.querySelector('[data-batch-progress-wrap]'),

progressFill: panel.querySelector('[data-batch-progress-fill]'),

progressText: panel.querySelector('[data-batch-progress-text]'),

summary: panel.querySelector('[data-batch-summary]')

};

function refresh() {

// With a single file the normal preview already does the job, and a one-row
// batch panel is just noise. Hide it until the second file arrives.
panel.classList.toggle('hidden', state.items.length < 2);

renderBatchList(panel, state, { onRemove: removeAt });

const doneCount = state.items.filter((i) => i.status === 'done').length;

ui.zipBtn.classList.toggle('hidden', doneCount === 0);

const anyDone = doneCount > 0;

ui.runBtn.textContent = anyDone ? t('batch.run_again') : t('batch.run');

// Only show the count once there is something to download; "(0)" read as a
// broken counter before the first run.
if (doneCount > 0) {

ui.zipBtn.textContent = `${t('batch.download_all')} (${doneCount})`;

} else {

ui.zipBtn.textContent = t('batch.download_all');

}

// While a run is in flight the run button turns into a cancel control. The
// abort flag existed and was tested in the loop but nothing ever set it, so a
// long queue could not be stopped at all.
ui.runBtn.disabled = false;

ui.clearBtn.disabled = state.running;

ui.runBtn.classList.toggle('is-cancelling', state.running);

if (state.running) {

ui.runBtn.textContent = t('batch.cancel');

}

// The run button stays available after a completed batch: the user may have
// changed quality/format/size and wants to apply it again. Clicking it
// re-processes everything rather than only the unfinished rows.
if (state.items.length > 0) {

ui.runBtn.classList.remove('hidden');

} else {

ui.runBtn.classList.add('hidden');

}

if (state.items.length < 2) {

ui.progressWrap.classList.add('hidden');

ui.summary.classList.add('hidden');

}

}

function removeAt(index) {

// Refuse while a run is in flight. `run()` iterates a snapshot of the list, so
// splicing an entry out mid-run left the loop writing results onto an object no
// longer in the list: the summary count and the ZIP contents then disagreed.
if (state.running) return;

const item = state.items[index];

if (item && item.thumbUrl) URL.revokeObjectURL(item.thumbUrl);

state.items.splice(index, 1);

refresh();

config.onEmpty && config.onEmpty();

}

function clearAll() {

state.items.forEach((item) => {

if (item.thumbUrl) URL.revokeObjectURL(item.thumbUrl);

});

state.items = [];

ui.summary.classList.add('hidden');

refresh();

config.onEmpty && config.onEmpty();

}

function addFiles(fileList) {

const files = Array.from(fileList || []);

if (files.length === 0) return;

const existing = new Set(state.items.map((i) => `${i.file.name}:${i.file.size}:${i.file.lastModified}`));

for (const file of files) {

const key = `${file.name}:${file.size}:${file.lastModified}`;

if (existing.has(key)) continue;

existing.add(key);

state.items.push({ file, status: 'queued', result: null, error: '', thumbUrl: URL.createObjectURL(file) });

}

if (state.items.length > BATCH_MAX_FILES) {

// Keep the first N and drop the overflow rather than silently stalling.
state.items.slice(BATCH_MAX_FILES).forEach((item) => {

if (item.thumbUrl) URL.revokeObjectURL(item.thumbUrl);

});

state.items.length = BATCH_MAX_FILES;

config.onLimit && config.onLimit(BATCH_MAX_FILES);

}

refresh();

}

async function run() {

// A second click while running means cancel, not "start again".
if (state.running) {

state.aborted = true;

refresh();

return;

}

// Re-running from scratch avoids a half-stale batch: old results are dropped
// so the ZIP can never mix outputs from two different settings.
state.items.forEach((item) => {

item.result = null;

item.error = '';

item.status = 'queued';

});

const pending = state.items.slice();

state.running = true;

state.aborted = false;

ui.summary.classList.add('hidden');

ui.progressWrap.classList.remove('hidden');

refresh();

const succeeded = [];

const failed = [];

for (let i = 0; i < pending.length; i++) {

const item = pending[i];

if (state.aborted) break;

item.status = 'working';

item.error = '';

refresh();

const done = i;

ui.progressFill.style.width = `${Math.round((done / pending.length) * 100)}%`;

controller.lastProgress = `${t('batch.progress')} ${done + 1}/${pending.length}`;

ui.progressText.textContent = controller.lastProgress;

try {

const result = await config.processFile(item.file);

if (!result || !result.blob) throw new Error(t('batch.error_generic'));

item.result = result;

item.status = 'done';

succeeded.push(result);

} catch (err) {

item.status = 'error';

item.error = (err && err.message) ? err.message : t('batch.error_generic');

failed.push(item.file.name);

}

refresh();

}

// Only claim completion when the queue actually finished; on a cancel the bar
// would otherwise read 100% for work that never ran.
if (!state.aborted) {

ui.progressFill.style.width = '100%';

}

state.running = false;

ui.progressWrap.classList.add('hidden');

// Report per-file outcomes; a batch with mixed results must not look like a
// total failure, and vice versa.
const parts = [];

if (succeeded.length) parts.push(tf('batch.summary_done', { n: succeeded.length }));

if (failed.length) parts.push(tf('batch.summary_failed', { n: failed.length }));

// Unprocessed rows after a cancel must be visible in the outcome, otherwise the
// summary implies the whole queue was handled.
if (state.aborted && pending.length > succeeded.length + failed.length) {

parts.push(tf('batch.summary_cancelled', { n: pending.length - succeeded.length - failed.length }));

}

controller.summaryCounts = {

done: succeeded.length,

failed: failed.length,

skipped: state.aborted
? pending.length - succeeded.length - failed.length
: 0

};

controller.lastSummary = controller.composeSummary();

ui.summary.textContent = controller.lastSummary;

ui.summary.classList.toggle('hidden', parts.length === 0);

ui.summary.classList.toggle('batch-summary-error', failed.length > 0);

refresh();

}

async function downloadZip() {

const done = state.items.filter((i) => i.status === 'done' && i.result);

if (done.length === 0) return;

const btn = ui.zipBtn;

btn.disabled = true;

btn.textContent = t('batch.packing');

try {

const entries = [];

const names = uniqueNames(done.map((i) => i.result.filename));

for (let i = 0; i < done.length; i++) {

const bytes = new Uint8Array(await done[i].result.blob.arrayBuffer());

entries.push({ name: names[i], bytes });

}

const zip = await createZip(entries);

const name = tf('batch.zip_name', { n: done.length });

downloadBlob(zip, name);

} catch (err) {

console.error('Batch ZIP failed:', err);

} finally {

btn.disabled = false;

refresh();

}

}

ui.runBtn.addEventListener('click', run);

ui.zipBtn.addEventListener('click', downloadZip);

ui.clearBtn.addEventListener('click', clearAll);

// "Add more" tops the queue up without discarding the files already staged.
if (ui.addBtn) {

ui.addBtn.addEventListener('click', () => input.click());

}

// A batch has to run from the tool's own primary button, not only from the
// panel. Users set their options and press the button they already know, and
// while the queue sat there that button still processed just the single
// previewed image, so every other file looked untouched. Capture phase, so the
// tool's own single-image handler does not also run.
const primaryBtn = config.primaryBtnId ? document.getElementById(config.primaryBtnId) : null;

if (primaryBtn) {

primaryBtn.addEventListener('click', (e) => {

if (state.items.length < 2 || state.running) return;

e.preventDefault();

e.stopPropagation();

e.stopImmediatePropagation();

run();

}, true);

}

input.addEventListener('change', () => {

addFiles(input.files);

// Reset so re-picking the same file still fires a change event.
input.value = '';

});

// Drag & drop onto the existing upload area.
const uploadArea = document.getElementById(config.uploadAreaId);

if (uploadArea) {

uploadArea.addEventListener('dragover', (e) => {

e.preventDefault();

uploadArea.classList.add('drag-over');

});

uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));

uploadArea.addEventListener('drop', (e) => {

e.preventDefault();

uploadArea.classList.remove('drag-over');

if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);

});

}

// Exposed so the tool code can ask whether this tool is running as a batch and
// therefore must not reset its inputs to the previewed image's dimensions.
// Remembered so a language switch can rebuild the summary and the progress
// line in the new language. Neither is a data-i18n node, so i18nApply() cannot
// touch them, and both are composed from t()/tf() at runtime.
let lastSummary = '';

let lastProgress = '';

const controller = {

state,

get lastSummary() {

return lastSummary;

},

set lastSummary(v) {

lastSummary = v;

},

// The outcome counts, kept so a language switch can compose the summary again
// in the new language. Storing the finished string would replay the old one.
summaryCounts: null,

composeSummary: () => {

const c = controller.summaryCounts;

if (!c) return '';

const parts = [];

if (c.done) parts.push(tf('batch.summary_done', { n: c.done }));

if (c.failed) parts.push(tf('batch.summary_failed', { n: c.failed }));

if (c.skipped) parts.push(tf('batch.summary_cancelled', { n: c.skipped }));

return parts.join(' · ');

},

get lastProgress() {

return lastProgress;

},

set lastProgress(v) {

lastProgress = v;

},

retag: () => {

if (lastProgress) ui.progressText.textContent = lastProgress;

if (controller.summaryCounts) {

controller.lastSummary = controller.composeSummary();

ui.summary.textContent = controller.lastSummary;

ui.summary.classList.toggle('batch-summary-error', controller.summaryCounts.failed > 0);

}

refresh();

},

addFiles,

clearAll,

run,

refresh,

panel,

isBatch: () => state.items.length >= 2

};

batchControllers[config.idPrefix] = controller;

// A language switch rewrites every data-i18n node in the page, but the progress
// line and the summary are composed at runtime and carry no such attribute, so
// they would stay in the previous language until the next run.
if (typeof i18nOnChange === 'function') {

i18nOnChange(() => controller.retag());

}

return controller;

}

if (typeof window !== 'undefined') {

window.setupBatchTool = setupBatchTool;

window.createZip = createZip;

window.decodeImageFile = decodeImageFile;

window.releaseImage = releaseImage;

window.BATCH_MAX_FILES = BATCH_MAX_FILES;

window.batchControllers = batchControllers;

window.batchIsActive = (idPrefix) => {

const c = batchControllers[idPrefix];

return !!(c && c.isBatch());

};

}