/**
 * Shared runtime art generators — pure visuals, no gameplay logic.
 * All textures created once via Phaser Graphics.
 */

export function drawPlayerTexture(scene, key = 'player') {
  if (scene.textures.exists(key)) return key;
  const g = scene.make.graphics({ add: false });
  // Soft shadow under feet
  g.fillStyle(0x000000, 0.25);
  g.fillEllipse(20, 46, 22, 6);
  // Boots
  g.fillStyle(0x3d2914, 1);
  g.fillRect(8, 38, 10, 8);
  g.fillRect(22, 38, 10, 8);
  // Legs
  g.fillStyle(0x2b4c7e, 1);
  g.fillRect(10, 28, 8, 12);
  g.fillRect(22, 28, 8, 12);
  // Torso / cloak
  g.fillStyle(0x4ecca3, 1);
  g.fillRect(8, 14, 24, 18);

  // Belt
  g.fillStyle(0xf0c75e, 1);
  g.fillRect(8, 28, 24, 3);
  // Hood
  g.fillStyle(0x2a9d8f, 1);
  g.fillTriangle(8, 16, 20, 2, 32, 16);
  g.fillStyle(0x1a6b62, 1);
  g.fillTriangle(12, 16, 20, 6, 28, 16);
  // Face
  g.fillStyle(0xffe0bd, 1);
  g.fillCircle(20, 16, 7);
  // Eyes
  g.fillStyle(0x1a1a2e, 1);
  g.fillCircle(17, 15, 2);
  g.fillCircle(23, 15, 2);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(17.5, 14.5, 0.8);
  g.fillCircle(23.5, 14.5, 0.8);
  // Scarf accent
  g.fillStyle(0xe94560, 1);
  g.fillRect(14, 22, 12, 3);
  g.generateTexture(key, 40, 50);
  g.destroy();
  return key;
}

export function drawCoinTexture(scene, key = 'coin') {
  if (scene.textures.exists(key)) return key;
  const g = scene.make.graphics({ add: false });
  g.fillStyle(0xb8860b, 1);
  g.fillCircle(12, 12, 12);
  g.fillStyle(0xffd700, 1);
  g.fillCircle(12, 12, 10);
  g.fillStyle(0xfff3a0, 1);
  g.fillCircle(9, 9, 4);
  g.lineStyle(2, 0xb8860b, 0.8);
  g.strokeCircle(12, 12, 7);
  g.generateTexture(key, 24, 24);
  g.destroy();
  return key;
}

export function drawFlagTexture(scene, key = 'flag') {
  if (scene.textures.exists(key)) return key;
  const g = scene.make.graphics({ add: false });
  g.fillStyle(0x888888, 1);
  g.fillRect(2, 0, 5, 70);
  g.fillStyle(0xc0c0c0, 1);
  g.fillRect(2, 0, 2, 70);
  g.fillStyle(0xe94560, 1);
  g.fillTriangle(7, 2, 44, 14, 7, 28);
  g.fillStyle(0xff6b81, 1);
  g.fillTriangle(7, 4, 36, 14, 7, 22);
  g.generateTexture(key, 46, 70);
  g.destroy();
  return key;
}

/** Ground platform with grass top + stone body */
export function drawGroundTexture(scene, w, key) {
  if (scene.textures.exists(key)) return key;
  const h = 30;
  const g = scene.make.graphics({ add: false });
  // Body
  g.fillStyle(0x3d5a80, 1);
  g.fillRect(0, 6, w, h - 6);
  // Darker bottom edge
  g.fillStyle(0x2a4060, 1);
  g.fillRect(0, h - 6, w, 6);
  // Grass top
  g.fillStyle(0x4ecca3, 1);
  g.fillRect(0, 0, w, 8);
  g.fillStyle(0x7ee8c4, 1);
  g.fillRect(0, 0, w, 3);
  // Speckles
  for (let i = 0; i < Math.floor(w / 20); i++) {
    g.fillStyle(0x2a4060, 0.35);
    g.fillCircle(10 + i * 20 + (i % 3) * 4, 16 + (i % 2) * 5, 2);
  }
  g.generateTexture(key, w, h);
  g.destroy();
  return key;
}

/** Floating platform — coral/orange with highlight */
export function drawFloatTexture(scene, w, key) {
  if (scene.textures.exists(key)) return key;
  const h = 18;
  const g = scene.make.graphics({ add: false });
  g.fillStyle(0xc45c3e, 1);
  g.fillRect(0, 4, w, h - 4);
  g.fillStyle(0xee6c4d, 1);
  g.fillRect(0, 0, w, 10);

  g.fillStyle(0xffb4a2, 1);
  g.fillRect(2, 1, w - 4, 3);
  g.generateTexture(key, w, h);
  g.destroy();
  return key;
}

/** Draw a semi-transparent HUD panel */
export function addHudPanel(scene, x, y, w, h, depth = 49) {
  return scene.add.rectangle(x, y, w, h, 0x0a0a1a, 0.55)
    .setStrokeStyle(1, 0xffffff, 0.12)
    .setScrollFactor(0)
    .setDepth(depth)
    .setOrigin(0, 0);
}
