/**
 * Zion Logo Transparent PNG Exporter
 * Extracts the embedded image from zion-logo.svg, removes the white
 * background via BFS flood-fill, crops tightly, and saves a
 * high-quality transparent PNG.
 *
 * Run: node make_transparent_logo.js
 * Requires: npm install canvas
 */

const fs   = require('fs');
const path = require('path');

const svgPath = path.resolve(__dirname, 'src/assets/zion-logo.svg');
const outPath = path.resolve(__dirname, 'src/assets/zion-logo-transparent.png');

const svgText = fs.readFileSync(svgPath, 'utf8');

const match = svgText.match(/href="data:image\/(png|jpeg|jpg);base64,([^"]+)"/);
if (!match) {
  console.error('Could not find an embedded image in the SVG.');
  process.exit(1);
}

const mimeType  = match[1];
const b64Data   = match[2];
const imgBuffer = Buffer.from(b64Data, 'base64');
console.log(`Extracted embedded ${mimeType.toUpperCase()} (${(imgBuffer.length / 1024).toFixed(1)} KB)`);

let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.error('"canvas" not found. Run: npm install canvas');
  process.exit(1);
}

const { createCanvas, loadImage } = Canvas;

loadImage(imgBuffer).then(img => {
  const W = img.width  || 900;
  const H = img.height || 900;

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);

  const imageData = ctx.getImageData(0, 0, W, H);
  const data      = imageData.data;

  // BFS Flood-Fill from edges to find background pixels
  const visited  = new Uint8Array(W * H);
  const queue    = [];
  const THRESHOLD = 230;

  function isBg(x, y) {
    const i = (y * W + x) * 4;
    return data[i] > THRESHOLD && data[i+1] > THRESHOLD && data[i+2] > THRESHOLD;
  }

  function enqueue(x, y) {
    const idx = y * W + x;
    if (!visited[idx]) { visited[idx] = 1; queue.push(x, y); }
  }

  for (let x = 0; x < W; x++) {
    if (isBg(x, 0))   enqueue(x, 0);
    if (isBg(x, H-1)) enqueue(x, H-1);
  }
  for (let y = 0; y < H; y++) {
    if (isBg(0, y))   enqueue(0, y);
    if (isBg(W-1, y)) enqueue(W-1, y);
  }

  for (let head = 0; head < queue.length; ) {
    const x = queue[head++];
    const y = queue[head++];
    const nbrs = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
    for (const [nx, ny] of nbrs) {
      if (nx >= 0 && nx < W && ny >= 0 && ny < H && isBg(nx, ny))
        enqueue(nx, ny);
    }
  }

  let bgCount = 0;
  for (let i = 0; i < W * H; i++) {
    if (visited[i]) { data[i*4+3] = 0; bgCount++; }
  }
  console.log(`Removed ${bgCount.toLocaleString()} background pixels (${(bgCount*100/(W*H)).toFixed(1)}%)`);

  ctx.putImageData(imageData, 0, 0);

  // Tight bounding-box crop
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y*W+x)*4+3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const PAD  = 4;
  minX = Math.max(0,   minX - PAD);
  minY = Math.max(0,   minY - PAD);
  maxX = Math.min(W-1, maxX + PAD);
  maxY = Math.min(H-1, maxY + PAD);

  const CW = maxX - minX + 1;
  const CH = maxY - minY + 1;
  console.log(`Cropped to: ${CW}x${CH}px (from ${W}x${H}px)`);

  const outCanvas = createCanvas(CW, CH);
  const outCtx    = outCanvas.getContext('2d');
  outCtx.drawImage(canvas, minX, minY, CW, CH, 0, 0, CW, CH);

  const pngBuffer = outCanvas.toBuffer('image/png', { compressionLevel: 6 });
  fs.writeFileSync(outPath, pngBuffer);

  const kb = (pngBuffer.length / 1024).toFixed(1);
  console.log(`\nDone! Transparent PNG saved: ${outPath}`);
  console.log(`Size: ${kb} KB | Dimensions: ${CW}x${CH}px`);

}).catch(err => {
  console.error('Error loading image:', err.message);
  process.exit(1);
});
