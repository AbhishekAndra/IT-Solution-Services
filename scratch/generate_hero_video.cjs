const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const FFMPEG = 'C:\\Users\\91939\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const DURATION_SEC = 6;
const TOTAL_FRAMES = FPS * DURATION_SEC; // 180 frames

async function main() {
  console.log(`Decoding base datacenter image to ${WIDTH}x${HEIGHT} RGBA...`);
  
  // 1. Decode assets/real-datacenter.webp to raw RGBA at 1280x720
  const decodeProc = cp.spawnSync(FFMPEG, [
    '-y',
    '-i', 'assets/real-datacenter.webp',
    '-vf', `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`,
    '-f', 'rawvideo',
    '-pix_fmt', 'rgba',
    'pipe:1'
  ], { maxBuffer: 25 * 1024 * 1024 });

  if (decodeProc.status !== 0) {
    console.error('Failed to decode image:', decodeProc.stderr.toString());
    process.exit(1);
  }

  const baseImage = decodeProc.stdout;
  console.log(`Base image decoded successfully (${baseImage.length} bytes).`);

  // 2. Setup FFmpeg encoder process
  const outputFile = path.join(__dirname, '..', 'assets', 'hero-video.mp4');
  console.log(`Encoding looping background video to ${outputFile}...`);

  const ffmpeg = cp.spawn(FFMPEG, [
    '-y',
    '-f', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-s', `${WIDTH}x${HEIGHT}`,
    '-r', `${FPS}`,
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputFile
  ]);

  ffmpeg.stderr.on('data', (d) => {
    // optional progress logging
  });

  const frameBuffer = Buffer.alloc(WIDTH * HEIGHT * 4);

  // Network particles definition
  const NUM_PARTICLES = 45;
  const particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -0.3 - Math.random() * 0.6,
      size: 1.5 + Math.random() * 2.5,
      color: Math.random() > 0.4 ? [6, 182, 212] : [99, 102, 241], // Cyan or Indigo
      phase: Math.random() * Math.PI * 2
    });
  }

  // Cable light pulse channels (vertical server cable columns)
  const cableChannels = [
    { x: 340, width: 28, speed: 1.2, color: [6, 182, 212] },
    { x: 420, width: 34, speed: 1.5, color: [99, 102, 241] },
    { x: 490, width: 26, speed: 0.9, color: [139, 92, 246] },
    { x: 740, width: 30, speed: 1.1, color: [6, 182, 212] },
    { x: 810, width: 32, speed: 1.4, color: [16, 185, 129] },
    { x: 920, width: 25, speed: 1.0, color: [99, 102, 241] },
  ];

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const t = frame / TOTAL_FRAMES; // 0 to 1
    const angle = t * Math.PI * 2; // seamless loop angle

    // Seamless camera zoom & subtle breathing (0 to 6% zoom and back)
    const zoom = 1.0 + 0.05 * (0.5 - 0.5 * Math.cos(angle));
    const invZoom = 1.0 / zoom;
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;

    // Copy base image with smooth zoom
    for (let y = 0; y < HEIGHT; y++) {
      const srcY = Math.min(HEIGHT - 1, Math.max(0, Math.floor(cy + (y - cy) * invZoom)));
      const dstRowOffset = y * WIDTH * 4;
      const srcRowOffset = srcY * WIDTH * 4;

      for (let x = 0; x < WIDTH; x++) {
        const srcX = Math.min(WIDTH - 1, Math.max(0, Math.floor(cx + (x - cx) * invZoom)));
        const srcIdx = srcRowOffset + srcX * 4;
        const dstIdx = dstRowOffset + x * 4;

        // Apply a dark, rich, high-contrast cyber grading to the datacenter
        let r = baseImage[srcIdx];
        let g = baseImage[srcIdx + 1];
        let b = baseImage[srcIdx + 2];

        // Atmospheric vignette
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const distSq = dx * dx + dy * dy;
        const vignette = Math.max(0.2, 1.0 - distSq * 0.55);

        // Cyber color grading: deepen blacks, boost blue/cyan
        r = Math.floor(r * 0.7 * vignette);
        g = Math.floor(g * 0.85 * vignette + 8);
        b = Math.floor(b * 1.15 * vignette + 18);

        frameBuffer[dstIdx] = Math.min(255, r);
        frameBuffer[dstIdx + 1] = Math.min(255, g);
        frameBuffer[dstIdx + 2] = Math.min(255, b);
        frameBuffer[dstIdx + 3] = 255;
      }
    }

    // 1. Draw glowing fiber optic pulses along server cables
    for (const cable of cableChannels) {
      const pulseY = ((t * cable.speed + cable.x * 0.001) % 1.0) * HEIGHT;
      const pulseRadius = 60;

      for (let py = Math.max(0, Math.floor(pulseY - pulseRadius)); py < Math.min(HEIGHT, Math.floor(pulseY + pulseRadius)); py++) {
        const dy = Math.abs(py - pulseY);
        const intensity = (1 - dy / pulseRadius) * 0.45;
        const rowOffset = py * WIDTH * 4;

        for (let px = Math.max(0, cable.x - cable.width / 2); px < Math.min(WIDTH, cable.x + cable.width / 2); px++) {
          const idx = Math.floor(rowOffset + px * 4);
          frameBuffer[idx] = Math.min(255, frameBuffer[idx] + cable.color[0] * intensity);
          frameBuffer[idx + 1] = Math.min(255, frameBuffer[idx + 1] + cable.color[1] * intensity);
          frameBuffer[idx + 2] = Math.min(255, frameBuffer[idx + 2] + cable.color[2] * intensity);
        }
      }
    }

    // 2. Draw blinking server rack status LED clusters
    const serverRacks = [
      { x: 310, y: 180 }, { x: 310, y: 320 }, { x: 310, y: 460 },
      { x: 440, y: 150 }, { x: 440, y: 280 }, { x: 440, y: 420 },
      { x: 780, y: 160 }, { x: 780, y: 300 }, { x: 780, y: 440 },
      { x: 910, y: 190 }, { x: 910, y: 340 }, { x: 910, y: 480 },
    ];

    for (let rIdx = 0; rIdx < serverRacks.length; rIdx++) {
      const rack = serverRacks[rIdx];
      for (let led = 0; led < 6; led++) {
        const lx = rack.x + (led % 3) * 6;
        const ly = rack.y + Math.floor(led / 3) * 6;
        const blink = Math.sin(angle * (2 + (rIdx + led) % 3) + led * 1.5) > 0.2;
        if (blink && lx >= 0 && lx < WIDTH && ly >= 0 && ly < HEIGHT) {
          const idx = (ly * WIDTH + lx) * 4;
          const isEmerald = (rIdx + led) % 3 === 0;
          const ledColor = isEmerald ? [16, 255, 129] : [6, 220, 255];
          frameBuffer[idx] = Math.min(255, frameBuffer[idx] + ledColor[0]);
          frameBuffer[idx + 1] = Math.min(255, frameBuffer[idx + 1] + ledColor[1]);
          frameBuffer[idx + 2] = Math.min(255, frameBuffer[idx + 2] + ledColor[2]);
        }
      }
    }

    // 3. Draw floating neural / kubernetes telemetry particles
    for (let pIdx = 0; pIdx < particles.length; pIdx++) {
      const p = particles[pIdx];
      // Compute looped position
      const loopTime = (t + p.phase / (Math.PI * 2)) % 1.0;
      const px = Math.floor((p.x + p.speedX * loopTime * 150 + WIDTH) % WIDTH);
      const py = Math.floor((p.y + p.speedY * loopTime * 250 + HEIGHT) % HEIGHT);
      const glow = 0.5 + 0.5 * Math.sin(angle * 2 + p.phase);

      const rad = Math.floor(p.size);
      for (let dy = -rad; dy <= rad; dy++) {
        const curY = py + dy;
        if (curY < 0 || curY >= HEIGHT) continue;
        const row = curY * WIDTH * 4;

        for (let dx = -rad; dx <= rad; dx++) {
          const curX = px + dx;
          if (curX < 0 || curX >= WIDTH) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= rad) {
            const alpha = (1 - dist / rad) * glow;
            const idx = row + curX * 4;
            frameBuffer[idx] = Math.min(255, frameBuffer[idx] + p.color[0] * alpha * 0.8);
            frameBuffer[idx + 1] = Math.min(255, frameBuffer[idx + 1] + p.color[1] * alpha * 0.8);
            frameBuffer[idx + 2] = Math.min(255, frameBuffer[idx + 2] + p.color[2] * alpha * 0.8);
          }
        }
      }
    }

    // 4. Subtle perspective cyber data line at the base/floor
    const floorY = Math.floor(HEIGHT * 0.88);
    const wave = Math.sin(angle + Math.PI / 4) * 0.3 + 0.7;
    for (let x = 0; x < WIDTH; x++) {
      const waveX = Math.sin(x * 0.02 + angle * 3);
      if (Math.abs(waveX) > 0.85) {
        const idx = (floorY * WIDTH + x) * 4;
        frameBuffer[idx] = Math.min(255, frameBuffer[idx] + 6 * wave);
        frameBuffer[idx + 1] = Math.min(255, frameBuffer[idx + 1] + 182 * wave * 0.4);
        frameBuffer[idx + 2] = Math.min(255, frameBuffer[idx + 2] + 240 * wave * 0.6);
      }
    }

    // Write frame to ffmpeg stdin
    const ok = ffmpeg.stdin.write(frameBuffer);
    if (!ok) {
      await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
    }
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`Video generated successfully! Path: ${outputFile}`);
        const stats = fs.statSync(outputFile);
        console.log(`Output size: ${(stats.size / 1024).toFixed(1)} KB`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

main().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
