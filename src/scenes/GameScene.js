import Phaser from 'phaser';
import { loadData, finalizeSession } from '../utils/Storage.js';
import { getSkinColor } from '../data/ShopItems.js';

/**
<<<<<<< HEAD
 * Main gameplay scene.
 * Hardened against texture spam, event leaks, and init errors
 * that previously could freeze the game when pressing PLAY.
=======
 * Gameplay scene — fixed physics/spawn so player is never stuck mid-air.
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.gameOver = false;
    this.sessionCoins = 0;
    this.score = 0;
    this.maxX = 0;
    this.rewardGiven = false;
<<<<<<< HEAD
    this.worldWidth = 5000;
    this.seed = (Date.now() % 100000) + Math.floor(Math.random() * 999);
=======
    this.worldWidth = 4800;
    this.seed = (Date.now() % 90000) + 1;
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.jumpBuffered = false;
    this._blurHandler = null;
<<<<<<< HEAD
=======
    this.groundY = 390;
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
  }

  create() {
    try {
<<<<<<< HEAD
      this._createSafe();
    } catch (err) {
      console.error('GameScene create error:', err);
      // Fallback: return to menu instead of freezing
=======
      this._build();
    } catch (err) {
      console.error('[GameScene] create failed:', err);
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
      this.scene.start('MenuScene');
    }
  }

<<<<<<< HEAD
  _createSafe() {
    const { width, height } = this.scale;
    this.saveData = loadData();

    // World
    this.physics.world.setBounds(0, 0, this.worldWidth, height + 300);
    this.physics.world.gravity.y = 900;

    this.createBackground();

    // Groups
    this.platforms = this.physics.add.staticGroup();
    this.coinsGroup = this.physics.add.group({ allowGravity: false });

    // Ensure shared textures exist once
    this.ensureSharedTextures();
    this.generateLevel();

    // Player
    const skinColor = getSkinColor(this.saveData.equippedSkin || 'skin_default');
    this.player = this.physics.add.sprite(120, 320, 'player');
    this.player.setTint(skinColor);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(26, 44);
    this.player.body.setOffset(3, 2);
    this.player.setBounce(0.04);
    this.player.setDragX(1000);
    this.player.setDepth(10);
    this.player.setMaxVelocity(300, 900);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.coinsGroup, this.collectCoin, null, this);

    // Camera
    this.cameras.main.setBounds(0, 0, this.worldWidth, height);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(60, 50);

    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,W,SPACE,R');

    // Touch
    this.createTouchControls();

    // HUD
    this.scoreText = this.add.text(12, 10, 'Score: 0', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '17px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.coinText = this.add.text(12, 34, 'Coins: 0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '15px',
      color: '#f0e68c',
      stroke: '#000000',
      strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.bestText = this.add.text(width - 12, 10, 'Best: ' + this.saveData.bestScore, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#a0a0c0'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Cleanup on shutdown
    this.events.once('shutdown', this.onShutdown, this);
  }

  onShutdown() {
=======
  _build() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.saveData = loadData();

    // Physics world — tall enough to fall off
    this.physics.world.setBounds(0, 0, this.worldWidth, H + 400);
    this.physics.world.gravity.y = 1000;

    this.ensureTextures();
    this.drawBackground();

    this.platforms = this.physics.add.staticGroup();
    this.coinsGroup = this.physics.add.group();
    this.buildLevel();

    // --- Player: spawn ON the starting ground ---
    const spawnX = 100;
    const spawnY = this.groundY - 28;
    const skin = getSkinColor(this.saveData.equippedSkin || 'skin_default');

    this.player = this.physics.add.sprite(spawnX, spawnY, 'player');
    this.player.setTint(skin);
    this.player.setDepth(10);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(24, 40);
    this.player.body.setOffset(4, 6);
    this.player.body.setMaxVelocity(280, 900);
    this.player.body.setDragX(1200);
    this.player.body.allowGravity = true;
    this.player.body.setGravityY(0); // use world gravity only

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.coinsGroup, this.onCoin, null, this);

    // Camera
    this.cameras.main.setBounds(0, 0, this.worldWidth, H);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setDeadzone(40, 60);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.buildTouchUI();

    // HUD
    this.scoreText = this.add.text(10, 8, 'Score: 0', {
      fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '16px',
      color: '#ffffff', stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(50);

    this.coinText = this.add.text(10, 30, 'Coins: 0', {
      fontFamily: 'Arial, sans-serif', fontSize: '14px',
      color: '#f0e68c', stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(50);

    this.add.text(W - 10, 8, 'Best: ' + this.saveData.bestScore, {
      fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#a0a0c0'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

    this.events.once('shutdown', this.cleanup, this);
  }

  cleanup() {
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
    if (this._blurHandler) {
      this.game.events.off('blur', this._blurHandler);
      this._blurHandler = null;
    }
    this.touchLeft = this.touchRight = this.touchJump = false;
  }

<<<<<<< HEAD
  // ---------- Shared textures (created only once) ----------
  ensureSharedTextures() {
    if (!this.textures.exists('player')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xffffff, 1);
      g.fillRect(4, 10, 24, 34);
      g.fillStyle(0x222233, 1);
      g.fillCircle(16, 10, 9);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(12, 9, 2.5);
      g.fillCircle(20, 9, 2.5);
      g.fillStyle(0x000000, 1);
      g.fillCircle(12, 9, 1.2);
      g.fillCircle(20, 9, 1.2);
=======
  // ---- textures (once) ----
  ensureTextures() {
    if (!this.textures.exists('player')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xffffff);
      g.fillRect(6, 12, 20, 30);
      g.fillStyle(0x1a1a2e);
      g.fillCircle(16, 11, 9);
      g.fillStyle(0xffffff);
      g.fillCircle(12, 10, 2.5);
      g.fillCircle(20, 10, 2.5);
      g.fillStyle(0x000000);
      g.fillCircle(12, 10, 1.2);
      g.fillCircle(20, 10, 1.2);
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
      g.generateTexture('player', 32, 48);
      g.destroy();
    }
    if (!this.textures.exists('coin')) {
      const g = this.make.graphics({ add: false });
<<<<<<< HEAD
      g.fillStyle(0xffd700, 1);
      g.fillCircle(10, 10, 10);
      g.fillStyle(0xfff3a0, 1);
      g.fillCircle(10, 10, 6);
=======
      g.fillStyle(0xffd700);
      g.fillCircle(10, 10, 10);
      g.fillStyle(0xfff6b0);
      g.fillCircle(10, 10, 5);
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
      g.generateTexture('coin', 20, 20);
      g.destroy();
    }
    if (!this.textures.exists('flag')) {
      const g = this.make.graphics({ add: false });
<<<<<<< HEAD
      g.fillStyle(0xcccccc, 1);
      g.fillRect(0, 0, 5, 70);
      g.fillStyle(0xe94560, 1);
      g.fillTriangle(5, 0, 42, 12, 5, 24);
      g.generateTexture('flag', 44, 70);
      g.destroy();
    }
    // Platform size buckets
    [80, 100, 120, 140, 160, 180, 200, 240, 300, 350, 450].forEach(w => {
      const key = 'plat_' + w;
      if (!this.textures.exists(key)) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0x3d5a80, 1);
        g.fillRect(0, 0, w, 22);
        g.fillStyle(0xffffff, 0.22);
        g.fillRect(0, 0, w, 4);
        g.generateTexture(key, w, 22);
        g.destroy();
      }
      const keyF = 'platf_' + w;
      if (!this.textures.exists(keyF)) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xee6c4d, 1);
        g.fillRect(0, 0, w, 18);
        g.fillStyle(0xffffff, 0.22);
        g.fillRect(0, 0, w, 3);
        g.generateTexture(keyF, w, 18);
=======
      g.fillStyle(0xdddddd);
      g.fillRect(0, 0, 5, 64);
      g.fillStyle(0xe94560);
      g.fillTriangle(5, 0, 40, 11, 5, 22);
      g.generateTexture('flag', 42, 64);
      g.destroy();
    }
    // Ground / platform textures by width
    const widths = [60, 80, 100, 120, 140, 160, 180, 200, 240, 280, 320, 400, 500];
    widths.forEach((w) => {
      const gk = 'gnd_' + w;
      if (!this.textures.exists(gk)) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0x4a6fa5);
        g.fillRect(0, 0, w, 28);
        g.fillStyle(0x6b8fc5);
        g.fillRect(0, 0, w, 5);
        g.generateTexture(gk, w, 28);
        g.destroy();
      }
      const fk = 'flt_' + w;
      if (!this.textures.exists(fk)) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xe07a5f);
        g.fillRect(0, 0, w, 16);
        g.fillStyle(0xf2a68a);
        g.fillRect(0, 0, w, 4);
        g.generateTexture(fk, w, 16);
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
        g.destroy();
      }
    });
  }

<<<<<<< HEAD
  // ---------- Level ----------
  rnd(n) {
    const x = Math.sin(this.seed + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  nearestBucket(w) {
    const buckets = [80, 100, 120, 140, 160, 180, 200, 240, 300, 350, 450];
    let best = buckets[0];
    let bestDiff = Math.abs(w - best);
    for (const b of buckets) {
      const d = Math.abs(w - b);
      if (d < bestDiff) { best = b; bestDiff = d; }
=======
  drawBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x1a1a3a, 0x1a1a3a, 1);
    g.fillRect(0, 0, this.worldWidth, this.scale.height + 60);
    for (let i = 0; i < 70; i++) {
      g.fillStyle(0xffffff, 0.15 + Math.random() * 0.45);
      g.fillCircle(Math.random() * this.worldWidth, Math.random() * (this.scale.height - 60), 1 + Math.random());
    }
  }

  rnd(i) {
    const x = Math.sin(this.seed * 0.001 + i * 17.13) * 10000;
    return x - Math.floor(x);
  }

  pickW(raw) {
    const list = [60, 80, 100, 120, 140, 160, 180, 200, 240, 280, 320, 400, 500];
    let best = list[0];
    let d = Math.abs(raw - best);
    for (const v of list) {
      const nd = Math.abs(raw - v);
      if (nd < d) { best = v; d = nd; }
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
    }
    return best;
  }

<<<<<<< HEAD
  generateLevel() {
    const groundY = 400;
    let x = 0;
    let idx = 0;

    // Safe start
    this.addPlatform(0, groundY, 320, false);
    x = 320;

    while (x < this.worldWidth - 400 && idx < 55) {
      const t = Math.min(1, idx / 35);
      const gap = 55 + this.rnd(idx * 3) * (50 + t * 70);
      const rawLen = 100 + this.rnd(idx * 5) * (120 - t * 40);
      const len = this.nearestBucket(rawLen);

      let py = groundY;
      const floatChance = this.rnd(idx * 7);
      if (floatChance > 0.4) {
        py = groundY - 35 - this.rnd(idx * 11) * (70 + t * 30);
        py = Phaser.Math.Clamp(py, 170, groundY - 25);
      }
=======
  addGround(x, y, w) {
    const bw = this.pickW(w);
    const key = 'gnd_' + bw;
    const h = 28;
    const p = this.platforms.create(x + bw / 2, y + h / 2, key);
    p.refreshBody();
    return p;
  }

  addFloat(x, y, w) {
    const bw = this.pickW(w);
    const key = 'flt_' + bw;
    const h = 16;
    const p = this.platforms.create(x + bw / 2, y + h / 2, key);
    p.refreshBody();
    return p;
  }

  addCoinAt(x, y) {
    const c = this.coinsGroup.create(x, y, 'coin');
    c.body.allowGravity = false;
    c.setData('got', false);
    this.tweens.add({
      targets: c, y: y - 5, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }

  buildLevel() {
    const gy = this.groundY;
    // Long safe start runway
    this.addGround(0, gy, 500);
    let x = 500;
    let i = 0;

    while (x < this.worldWidth - 380 && i < 50) {
      const t = Math.min(1, i / 30);
      // Fair gaps: max jump distance ~180-200px at our jump force
      const gap = 50 + this.rnd(i * 3) * (40 + t * 50); // 50–140
      const len = this.pickW(90 + this.rnd(i * 5) * (100 - t * 30));
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638

      x += gap;
      if (x + len > this.worldWidth - 350) break;

<<<<<<< HEAD
      const floating = py < groundY - 15;
      this.addPlatform(x, py, len, floating);

      if (this.rnd(idx * 13) > 0.4) {
        this.addCoin(x + len * 0.5, py - 30);
      }
      if (this.rnd(idx * 17) > 0.78) {
        this.addCoin(x + len * 0.25, py - 58);
      }

      x += len;
      idx++;
    }

    // Finish ground + flag
    this.addPlatform(this.worldWidth - 420, groundY, 420, false);
    this.createWinZone(this.worldWidth - 180, groundY);
  }

  addPlatform(x, y, w, floating) {
    const bw = this.nearestBucket(w);
    const key = (floating ? 'platf_' : 'plat_') + bw;
    const h = floating ? 18 : 22;
    const plat = this.platforms.create(x + bw / 2, y + h / 2, key);
    if (plat && plat.body) plat.refreshBody();
    return plat;
  }

  addCoin(x, y) {
    const coin = this.coinsGroup.create(x, y, 'coin');
    if (!coin) return;
    coin.body.allowGravity = false;
    coin.setData('collected', false);
    this.tweens.add({
      targets: coin,
      y: y - 6,
      duration: 600 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createWinZone(x, y) {
    this.add.image(x, y, 'flag').setOrigin(0.15, 1);
    this.winZone = this.add.zone(x + 18, y - 35, 50, 70);
    this.physics.add.existing(this.winZone, true);
    this.physics.add.overlap(this.player, this.winZone, () => {
      if (!this.gameOver) this.triggerGameOver(true);
    }, null, this);
  }

  createBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x1a1a3a, 0x1a1a3a, 1);
    g.fillRect(0, 0, this.worldWidth, this.scale.height + 50);
    for (let i = 0; i < 80; i++) {
      g.fillStyle(0xffffff, 0.15 + Math.random() * 0.4);
      g.fillCircle(
        Math.random() * this.worldWidth,
        Math.random() * (this.scale.height - 80),
        1 + Math.random() * 1.5
      );
    }
  }

  // ---------- Touch ----------
  createTouchControls() {
    const { width, height } = this.scale;
    const r = 34;
    const m = 22;
    const by = height - m - r;
    const a = 0.45;

    this.btnLeft = this.add.circle(m + r, by, r, 0x4ecca3, a)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(this.btnLeft.x, this.btnLeft.y, '<', {
      fontSize: '28px', color: '#fff', fontFamily: 'Arial Black'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    this.btnRight = this.add.circle(m + r * 3.05, by, r, 0x4ecca3, a)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(this.btnRight.x, this.btnRight.y, '>', {
      fontSize: '28px', color: '#fff', fontFamily: 'Arial Black'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    this.btnJump = this.add.circle(width - m - r, by, r, 0xe94560, a)
      .setScrollFactor(0).setDepth(200).setInteractive();
    this.add.text(this.btnJump.x, this.btnJump.y, '^', {
      fontSize: '28px', color: '#fff', fontFamily: 'Arial Black'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const bind = (btn, flag) => {
      btn.on('pointerdown', (p) => { this[flag] = true; if (p.event) p.event.stopPropagation(); });
      btn.on('pointerup', () => { this[flag] = false; });
      btn.on('pointerout', () => { this[flag] = false; });
      btn.on('pointerupoutside', () => { this[flag] = false; });
    };
    bind(this.btnLeft, 'touchLeft');
    bind(this.btnRight, 'touchRight');
    bind(this.btnJump, 'touchJump');
=======
      const isFloat = this.rnd(i * 9) > 0.45;
      if (isFloat) {
        const rise = 40 + this.rnd(i * 11) * (50 + t * 20);
        const py = Math.max(200, gy - rise);
        this.addFloat(x, py, len);
        if (this.rnd(i * 13) > 0.35) this.addCoinAt(x + len * 0.5, py - 28);
      } else {
        this.addGround(x, gy, len);
        if (this.rnd(i * 13) > 0.4) this.addCoinAt(x + len * 0.5, gy - 32);
      }

      x += len;
      i++;
    }

    // Finish pad
    this.addGround(this.worldWidth - 400, gy, 400);
    this.add.image(this.worldWidth - 160, gy, 'flag').setOrigin(0.15, 1);
    const zone = this.add.zone(this.worldWidth - 150, gy - 30, 50, 60);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.player, zone, () => {
      if (!this.gameOver) this.endGame(true);
    }, null, this);
  }

  buildTouchUI() {
    const W = this.scale.width;
    const H = this.scale.height;
    const r = 36;
    const m = 18;
    const by = H - m - r;

    const mk = (cx, color, label, flag) => {
      const c = this.add.circle(cx, by, r, color, 0.5)
        .setScrollFactor(0).setDepth(80).setInteractive();
      this.add.text(cx, by, label, {
        fontSize: '26px', color: '#fff', fontFamily: 'Arial Black'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
      c.on('pointerdown', (p) => { this[flag] = true; if (p.event) p.event.stopPropagation(); });
      c.on('pointerup', () => { this[flag] = false; });
      c.on('pointerout', () => { this[flag] = false; });
      c.on('pointerupoutside', () => { this[flag] = false; });
      return c;
    };

    mk(m + r, 0x2a9d8f, '<', 'touchLeft');
    mk(m + r * 3.15, 0x2a9d8f, '>', 'touchRight');
    mk(W - m - r, 0xe94560, '^', 'touchJump');
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638

    this._blurHandler = () => {
      this.touchLeft = this.touchRight = this.touchJump = false;
    };
    this.game.events.on('blur', this._blurHandler);
  }

<<<<<<< HEAD
  collectCoin(player, coin) {
    if (!coin || coin.getData('collected') || this.gameOver) return;
    coin.setData('collected', true);
    this.sessionCoins += 1;
    this.coinText.setText('Coins: ' + this.sessionCoins);
    this.tweens.add({
      targets: coin,
      y: coin.y - 35,
      alpha: 0,
      scale: 1.3,
      duration: 220,
=======
  onCoin(player, coin) {
    if (!coin || coin.getData('got') || this.gameOver) return;
    coin.setData('got', true);
    this.sessionCoins += 1;
    this.coinText.setText('Coins: ' + this.sessionCoins);
    this.tweens.add({
      targets: coin, y: coin.y - 30, alpha: 0, scale: 1.4, duration: 200,
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
      onComplete: () => { if (coin.active) coin.destroy(); }
    });
  }

<<<<<<< HEAD
  triggerGameOver(won) {
    if (this.gameOver) return;
    this.gameOver = true;
    if (this.player && this.player.body) {
      this.player.setVelocity(0, 0);
      this.player.body.enable = false;
    }

    let finalData = this.saveData;
    if (!this.rewardGiven) {
      this.rewardGiven = true;
      finalData = finalizeSession(this.score, this.sessionCoins);
    }

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setScrollFactor(0).setDepth(300);

    const title = won ? 'LEVEL COMPLETE!' : 'GAME OVER';
    this.add.text(width / 2, height * 0.16, title, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '28px',
      color: won ? '#4ecca3' : '#e94560',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

    const isNew = this.score >= finalData.bestScore && this.score > 0;
    const lines = [
      'Score: ' + this.score,
      'Best: ' + finalData.bestScore + (isNew ? '  NEW!' : ''),
      'Coin Earned: ' + this.sessionCoins,
      'Total Coins: ' + finalData.totalCoins
    ];
    lines.forEach((line, i) => {
      this.add.text(width / 2, height * 0.30 + i * 26, line, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
    });

    this.makeUIButton(width / 2, height * 0.68, 200, 46, 'RESTART', 0xe94560, () => {
      this.scene.restart();
    });
    this.makeUIButton(width / 2, height * 0.82, 200, 42, 'MAIN MENU', 0x3d5a80, () => {
      this.scene.start('MenuScene');
    });
  }

  makeUIButton(x, y, w, h, label, color, cb) {
    const bg = this.add.rectangle(x, y, w, h, color)
      .setScrollFactor(0).setDepth(302)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(x, y, label, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '16px',
      color: '#fff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(303);

    let clicked = false;
    bg.on('pointerdown', () => {
      if (clicked) return;
      clicked = true;
=======
  endGame(won) {
    if (this.gameOver) return;
    this.gameOver = true;
    if (this.player.body) {
      this.player.body.enable = false;
      this.player.setVelocity(0, 0);
    }

    let data = this.saveData;
    if (!this.rewardGiven) {
      this.rewardGiven = true;
      data = finalizeSession(this.score, this.sessionCoins);
    }

    const W = this.scale.width;
    const H = this.scale.height;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.72)
      .setScrollFactor(0).setDepth(100);

    this.add.text(W / 2, H * 0.16, won ? 'LEVEL COMPLETE!' : 'GAME OVER', {
      fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '26px',
      color: won ? '#4ecca3' : '#e94560', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    const neu = this.score >= data.bestScore && this.score > 0;
    [
      'Score: ' + this.score,
      'Best: ' + data.bestScore + (neu ? '  NEW!' : ''),
      'Coin Earned: ' + this.sessionCoins,
      'Total Coins: ' + data.totalCoins
    ].forEach((t, i) => {
      this.add.text(W / 2, H * 0.30 + i * 26, t, {
        fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#fff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    });

    this.uiBtn(W / 2, H * 0.68, 190, 44, 'RESTART', 0xe94560, () => this.scene.restart());
    this.uiBtn(W / 2, H * 0.82, 190, 40, 'MAIN MENU', 0x3d5a80, () => this.scene.start('MenuScene'));
  }

  uiBtn(x, y, w, h, label, color, cb) {
    const bg = this.add.rectangle(x, y, w, h, color)
      .setScrollFactor(0).setDepth(102)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(x, y, label, {
      fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '15px', color: '#fff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(103);
    let done = false;
    bg.on('pointerdown', () => {
      if (done) return;
      done = true;
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
      bg.disableInteractive();
      cb();
    });
  }

  update() {
<<<<<<< HEAD
    if (this.gameOver || !this.player || !this.player.body) return;

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    const speed = 230;
    const jumpForce = -430;

    const left = (this.cursors && this.cursors.left.isDown) ||
      (this.keys && this.keys.A && this.keys.A.isDown) || this.touchLeft;
    const right = (this.cursors && this.cursors.right.isDown) ||
      (this.keys && this.keys.D && this.keys.D.isDown) || this.touchRight;
    const jumpPressed = (this.cursors && this.cursors.up.isDown) ||
      (this.keys && this.keys.W && this.keys.W.isDown) ||
      (this.keys && this.keys.SPACE && this.keys.SPACE.isDown) || this.touchJump;
=======
    if (this.gameOver || !this.player || !this.player.body || !this.player.body.enable) return;

    const body = this.player.body;
    const onFloor = body.blocked.down || body.touching.down;
    const speed = 220;
    const jumpV = -460;

    const left = this.cursors.left.isDown || this.keyA.isDown || this.touchLeft;
    const right = this.cursors.right.isDown || this.keyD.isDown || this.touchRight;
    const jump = this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown || this.touchJump;
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
<<<<<<< HEAD
    }

    if (jumpPressed && onGround && !this.jumpBuffered) {
      this.player.setVelocityY(jumpForce);
      this.jumpBuffered = true;
    }
    if (!jumpPressed) this.jumpBuffered = false;

=======
    } else {
      // drag handles slowdown
    }

    if (jump && onFloor && !this.jumpBuffered) {
      this.player.setVelocityY(jumpV);
      this.jumpBuffered = true;
    }
    if (!jump) this.jumpBuffered = false;

    // Score by distance
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
    if (this.player.x > this.maxX) {
      this.maxX = this.player.x;
      this.score = Math.floor(this.maxX / 10);
      this.scoreText.setText('Score: ' + this.score);
    }

<<<<<<< HEAD
    if (this.player.y > this.scale.height + 100) {
      this.triggerGameOver(false);
    }

    if (this.keys && this.keys.R && Phaser.Input.Keyboard.JustDown(this.keys.R) && !this.gameOver) {
=======
    // Fall death
    if (this.player.y > this.scale.height + 60) {
      this.endGame(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
      this.scene.restart();
    }
  }
}
