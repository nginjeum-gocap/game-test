import Phaser from 'phaser';
import { loadData, finalizeSession } from '../utils/Storage.js';
import { getSkinColor } from '../data/ShopItems.js';
import {
  drawPlayerTexture, drawCoinTexture, drawFlagTexture,
  drawGroundTexture, drawFloatTexture, addHudPanel
} from '../utils/Art.js';

/**
 * Gameplay scene — fixed physics/spawn so player is never stuck mid-air.
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
    this.worldWidth = 4800;
    this.seed = (Date.now() % 90000) + 1;
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.jumpBuffered = false;
    this._blurHandler = null;
    this.groundY = 390;
  }

  create() {
    try {
      this._build();
    } catch (err) {
      console.error('[GameScene] create failed:', err);
      this.scene.start('MenuScene');
    }
  }

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

    // Level platforms + coins first (no player reference yet)
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
    // Hitbox stays compact — visual sprite is larger (40x50)
    this.player.body.setSize(24, 40);
    this.player.body.setOffset(8, 8);
    this.player.body.setMaxVelocity(280, 900);
    this.player.body.setDragX(1200);
    this.player.body.allowGravity = true;
    this.player.body.setGravityY(0);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.coinsGroup, this.onCoin, null, this);

    // Win zone AFTER player exists
    this.setupWinZone();

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

    // HUD panels
    addHudPanel(this, 6, 6, 150, 52, 49);
    addHudPanel(this, W - 116, 6, 110, 28, 49);

    this.scoreText = this.add.text(14, 10, 'Score: 0', {
      fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '15px',
      color: '#ffffff', stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(50);

    this.coinText = this.add.text(14, 32, 'Coins: 0', {
      fontFamily: 'Arial, sans-serif', fontSize: '13px',
      color: '#ffd700', stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(50);

    this.add.text(W - 12, 12, 'Best: ' + this.saveData.bestScore, {
      fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#c0c0e0'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

    this.events.once('shutdown', this.cleanup, this);
  }

  cleanup() {
    if (this._blurHandler) {
      this.game.events.off('blur', this._blurHandler);
      this._blurHandler = null;
    }
    this.touchLeft = this.touchRight = this.touchJump = false;
  }

  // ---- textures (once) — visuals only ----
  ensureTextures() {
    drawPlayerTexture(this, 'player');
    drawCoinTexture(this, 'coin');
    drawFlagTexture(this, 'flag');
    const widths = [60, 80, 100, 120, 140, 160, 180, 200, 240, 280, 320, 400, 500];
    widths.forEach((w) => {
      drawGroundTexture(this, w, 'gnd_' + w);
      drawFloatTexture(this, w, 'flt_' + w);
    });
  }

  drawBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x0b0a1f, 0x0b0a1f, 0x1a1540, 0x1a1540, 1);
    g.fillRect(0, 0, this.worldWidth, this.scale.height + 60);
    g.fillStyle(0x15122e, 0.7);
    for (let mx = 0; mx < this.worldWidth; mx += 280) {
      g.fillTriangle(mx, 360, mx + 140, 200 + (mx % 90), mx + 280, 360);
    }
    for (let i = 0; i < 90; i++) {
      g.fillStyle(0xffffff, 0.15 + Math.random() * 0.5);
      g.fillCircle(Math.random() * this.worldWidth, Math.random() * (this.scale.height - 80), 1 + Math.random() * 1.2);
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
    }
    return best;
  }

  addGround(x, y, w) {
    const bw = this.pickW(w);
    const key = 'gnd_' + bw;
    const h = 30;
    const p = this.platforms.create(x + bw / 2, y + h / 2, key);
    p.refreshBody();
    return p;
  }

  addFloat(x, y, w) {
    const bw = this.pickW(w);
    const key = 'flt_' + bw;
    const h = 18;
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

      x += gap;
      if (x + len > this.worldWidth - 350) break;

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
    // win zone overlap is registered later in setupWinZone() after player exists
    this._winZoneX = this.worldWidth - 150;
    this._winZoneY = gy - 30;
  }

  setupWinZone() {
    const zone = this.add.zone(this._winZoneX, this._winZoneY, 50, 60);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.player, zone, () => {
      if (!this.gameOver) this.endGame(true);
    }, null, this);
  }

  buildTouchUI() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Only topmost interactive object receives the pointer (critical on mobile)
    this.input.setTopOnly(true);

    // Visual buttons (display only)
    const by = H - 52;
    this.add.circle(56, by, 40, 0x2a9d8f, 0.55).setScrollFactor(0).setDepth(200);
    this.add.circle(140, by, 40, 0x2a9d8f, 0.55).setScrollFactor(0).setDepth(200);
    this.add.circle(W - 56, by, 42, 0xe94560, 0.55).setScrollFactor(0).setDepth(200);
    this.add.text(56, by, '<', { fontSize: '28px', color: '#fff', fontFamily: 'Arial Black' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);
    this.add.text(140, by, '>', { fontSize: '28px', color: '#fff', fontFamily: 'Arial Black' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);
    this.add.text(W - 56, by, '^', { fontSize: '28px', color: '#fff', fontFamily: 'Arial Black' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);

    // Large invisible hit zones (easier to press on phone)
    // Left move zone
    const leftZone = this.add.zone(50, H - 50, 100, 120)
      .setScrollFactor(0).setDepth(210)
      .setInteractive();
    // Right move zone
    const rightZone = this.add.zone(150, H - 50, 100, 120)
      .setScrollFactor(0).setDepth(210)
      .setInteractive();
    // Jump zone (right side of screen)
    const jumpZone = this.add.zone(W - 60, H - 50, 130, 130)
      .setScrollFactor(0).setDepth(210)
      .setInteractive();

    // Track which pointer id is holding which control
    this._ptrLeft = null;
    this._ptrRight = null;
    this._ptrJump = null;

    const press = (flag, ptrProp, pointer) => {
      this[flag] = true;
      this[ptrProp] = pointer.id;
    };
    const release = (flag, ptrProp, pointer) => {
      if (this[ptrProp] === pointer.id || this[ptrProp] === null) {
        this[flag] = false;
        this[ptrProp] = null;
      }
    };

    leftZone.on('pointerdown', (p) => press('touchLeft', '_ptrLeft', p));
    leftZone.on('pointerup', (p) => release('touchLeft', '_ptrLeft', p));
    leftZone.on('pointerout', (p) => release('touchLeft', '_ptrLeft', p));
    leftZone.on('pointerupoutside', (p) => release('touchLeft', '_ptrLeft', p));

    rightZone.on('pointerdown', (p) => press('touchRight', '_ptrRight', p));
    rightZone.on('pointerup', (p) => release('touchRight', '_ptrRight', p));
    rightZone.on('pointerout', (p) => release('touchRight', '_ptrRight', p));
    rightZone.on('pointerupoutside', (p) => release('touchRight', '_ptrRight', p));

    jumpZone.on('pointerdown', (p) => press('touchJump', '_ptrJump', p));
    jumpZone.on('pointerup', (p) => release('touchJump', '_ptrJump', p));
    jumpZone.on('pointerout', (p) => release('touchJump', '_ptrJump', p));
    jumpZone.on('pointerupoutside', (p) => release('touchJump', '_ptrJump', p));

    // Global pointerup safety — clear all if finger lifts anywhere
    this.input.on('pointerup', (p) => {
      if (this._ptrLeft === p.id) { this.touchLeft = false; this._ptrLeft = null; }
      if (this._ptrRight === p.id) { this.touchRight = false; this._ptrRight = null; }
      if (this._ptrJump === p.id) { this.touchJump = false; this._ptrJump = null; }
    });

    this._blurHandler = () => {
      this.touchLeft = this.touchRight = this.touchJump = false;
      this._ptrLeft = this._ptrRight = this._ptrJump = null;
    };
    this.game.events.on('blur', this._blurHandler);
  }

  onCoin(player, coin) {
    if (!coin || coin.getData('got') || this.gameOver) return;
    coin.setData('got', true);
    this.sessionCoins += 1;
    this.coinText.setText('Coins: ' + this.sessionCoins);
    this.tweens.add({
      targets: coin, y: coin.y - 30, alpha: 0, scale: 1.4, duration: 200,
      onComplete: () => { if (coin.active) coin.destroy(); }
    });
  }

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
      bg.disableInteractive();
      cb();
    });
  }

  update() {
    if (this.gameOver || !this.player || !this.player.body || !this.player.body.enable) return;

    const body = this.player.body;
    const onFloor = body.blocked.down || body.touching.down;
    const speed = 220;
    const jumpV = -460;

    const left = this.cursors.left.isDown || this.keyA.isDown || this.touchLeft;
    const right = this.cursors.right.isDown || this.keyD.isDown || this.touchRight;
    const jump = this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown || this.touchJump;

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      // drag handles slowdown
    }

    if (jump && onFloor && !this.jumpBuffered) {
      this.player.setVelocityY(jumpV);
      this.jumpBuffered = true;
    }
    if (!jump) this.jumpBuffered = false;

    // Score by distance
    if (this.player.x > this.maxX) {
      this.maxX = this.player.x;
      this.score = Math.floor(this.maxX / 10);
      this.scoreText.setText('Score: ' + this.score);
    }

    // Fall death
    if (this.player.y > this.scale.height + 60) {
      this.endGame(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.scene.restart();
    }
  }
}
