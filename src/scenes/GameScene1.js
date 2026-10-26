import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.scale;

    // World bounds (one level, wider than screen)
    this.physics.world.setBounds(0, 0, 3200, height);

    // Background
    this.createBackground();

    // Ground & platforms
    this.platforms = this.physics.add.staticGroup();
    this.createLevel();

    // Generate player texture first
    this.generatePlayerTexture();

    // Player
    this.player = this.physics.add.sprite(120, 300, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(28, 46);
    this.player.body.setOffset(2, 2);
    this.player.setBounce(0.05);
    this.player.setDragX(800);
    this.player.setDepth(10);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);

    // Camera
    this.cameras.main.setBounds(0, 0, 3200, height);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 50);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Touch controls
    this.createTouchControls();

    // Level indicator (UI, fixed to camera)
    this.levelText = this.add.text(16, 16, 'Level 1', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setScrollFactor(0).setDepth(100);

    // Restart hint
    this.add.text(width - 16, 16, 'R = Restart', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#a0a0c0'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.input.keyboard.on('keydown-R', () => {
      this.scene.restart();
    });

    // Win zone (simple flag at end)
    this.createWinZone();
  }

  generatePlayerTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Body
    g.fillStyle(0x4ecca3, 1);
    g.fillRoundedRect(2, 8, 28, 36, 4);
    // Head
    g.fillStyle(0x2b2e4a, 1);
    g.fillCircle(16, 10, 10);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(12, 9, 3);
    g.fillCircle(20, 9, 3);
    g.fillStyle(0x000000, 1);
    g.fillCircle(12, 9, 1.5);
    g.fillCircle(20, 9, 1.5);
    g.generateTexture('player', 32, 48);
    g.destroy();
  }

  createBackground() {
    // Simple parallax-ish background layers using graphics
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x24243e, 0x24243e, 1);
    bg.fillRect(0, 0, 3200, this.scale.height);

    // Decorative stars / dots
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, 3200);
      const y = Phaser.Math.Between(0, this.scale.height - 80);
      const size = Phaser.Math.Between(1, 3);
      bg.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.7));
      bg.fillCircle(x, y, size);
    }

    // Distant mountains silhouette
    bg.fillStyle(0x1a1a3a, 0.6);
    bg.beginPath();
    bg.moveTo(0, 320);
    bg.lineTo(200, 220);
    bg.lineTo(450, 280);
    bg.lineTo(700, 180);
    bg.lineTo(1000, 260);
    bg.lineTo(1300, 200);
    bg.lineTo(1600, 270);
    bg.lineTo(1900, 190);
    bg.lineTo(2200, 250);
    bg.lineTo(2500, 170);
    bg.lineTo(2800, 240);
    bg.lineTo(3200, 200);
    bg.lineTo(3200, 450);
    bg.lineTo(0, 450);
    bg.closePath();
    bg.fillPath();
  }

  createLevel() {
    const groundY = 420;
    const groundH = 40;

    // Main continuous ground with gaps
    // Section 1
    this.addPlatform(0, groundY, 600, groundH, 0x3d5a80);
    // Gap
    this.addPlatform(750, groundY, 400, groundH, 0x3d5a80);
    // Gap
    this.addPlatform(1300, groundY, 500, groundH, 0x3d5a80);
    // Gap
    this.addPlatform(1950, groundY, 450, groundH, 0x3d5a80);
    // Final section
    this.addPlatform(2550, groundY, 650, groundH, 0x3d5a80);

    // Floating platforms
    this.addPlatform(300, 320, 140, 20, 0xee6c4d);
    this.addPlatform(550, 260, 120, 20, 0xee6c4d);
    this.addPlatform(900, 300, 160, 20, 0xee6c4d);
    this.addPlatform(1150, 220, 100, 20, 0xee6c4d);
    this.addPlatform(1500, 280, 180, 20, 0xee6c4d);
    this.addPlatform(1750, 200, 120, 20, 0xee6c4d);
    this.addPlatform(2100, 260, 150, 20, 0xee6c4d);
    this.addPlatform(2350, 180, 130, 20, 0xee6c4d);
    this.addPlatform(2700, 300, 160, 20, 0xee6c4d);

    // Small stepping platforms near start
    this.addPlatform(180, 360, 80, 16, 0xf4a261);
  }

  addPlatform(x, y, w, h, color) {
    // Create a simple colored rectangle as platform
    const key = `plat_${x}_${y}`;
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(color, 1);
      g.fillRect(0, 0, w, h);
      // Top highlight
      g.fillStyle(0xffffff, 0.25);
      g.fillRect(0, 0, w, 4);
      g.generateTexture(key, w, h);
      g.destroy();
    }
    const plat = this.platforms.create(x + w / 2, y + h / 2, key);
    plat.refreshBody();
    return plat;
  }

  createTouchControls() {
    const { width, height } = this.scale;
    const btnSize = 64;
    const margin = 24;
    const alpha = 0.55;

    // Only show if touch device or force for demo
    const isTouch = this.sys.game.device.input.touch;

    // Left button
    this.btnLeft = this.add.circle(margin + btnSize / 2, height - margin - btnSize / 2, btnSize / 2, 0x4ecca3, alpha)
      .setScrollFactor(0)
      .setDepth(200)
      .setInteractive();
    this.add.text(this.btnLeft.x, this.btnLeft.y, '◀', {
      fontSize: '28px', color: '#fff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    // Right button
    this.btnRight = this.add.circle(margin + btnSize * 1.7, height - margin - btnSize / 2, btnSize / 2, 0x4ecca3, alpha)
      .setScrollFactor(0)
      .setDepth(200)
      .setInteractive();
    this.add.text(this.btnRight.x, this.btnRight.y, '▶', {
      fontSize: '28px', color: '#fff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    // Jump button
    this.btnJump = this.add.circle(width - margin - btnSize / 2, height - margin - btnSize / 2, btnSize / 2, 0xe94560, alpha)
      .setScrollFactor(0)
      .setDepth(200)
      .setInteractive();
    this.add.text(this.btnJump.x, this.btnJump.y, '▲', {
      fontSize: '28px', color: '#fff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    // Touch state
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;

    this.btnLeft.on('pointerdown', () => { this.touchLeft = true; });
    this.btnLeft.on('pointerup', () => { this.touchLeft = false; });
    this.btnLeft.on('pointerout', () => { this.touchLeft = false; });

    this.btnRight.on('pointerdown', () => { this.touchRight = true; });
    this.btnRight.on('pointerup', () => { this.touchRight = false; });
    this.btnRight.on('pointerout', () => { this.touchRight = false; });

    this.btnJump.on('pointerdown', () => { this.touchJump = true; });
    this.btnJump.on('pointerup', () => { this.touchJump = false; });
    this.btnJump.on('pointerout', () => { this.touchJump = false; });

    // Hide on pure desktop if desired (keep visible for now so user can test)
    // if (!isTouch) { this.btnLeft.setVisible(false); ... }
  }

  createWinZone() {
    // Simple flag / goal at the end of the level
    const flagX = 3000;
    const flagY = 360;

    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Pole
    g.fillStyle(0xcccccc, 1);
    g.fillRect(0, 0, 6, 80);
    // Flag
    g.fillStyle(0xe94560, 1);
    g.fillTriangle(6, 0, 50, 15, 6, 30);
    g.generateTexture('flag', 50, 80);
    g.destroy();

    this.flag = this.add.image(flagX, flagY, 'flag').setOrigin(0.1, 1);

    // Invisible win trigger
    this.winZone = this.add.zone(flagX + 20, flagY - 40, 60, 80);
    this.physics.add.existing(this.winZone, true);

    this.physics.add.overlap(this.player, this.winZone, () => {
      this.reachGoal();
    }, null, this);
  }

  reachGoal() {
    if (this.goalReached) return;
    this.goalReached = true;

    this.player.setVelocity(0, 0);
    this.player.body.enable = false;

    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(300);

    this.add.text(width / 2, height / 2 - 30, 'LEVEL COMPLETE!', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '36px',
      color: '#4ecca3',
      stroke: '#000',
      strokeThickness: 5
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

    this.add.text(width / 2, height / 2 + 30, 'Press R to restart', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
  }

  update() {
    if (this.goalReached) return;

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    const speed = 220;
    const jumpForce = -420;

    let moveLeft = this.cursors.left.isDown || this.keys.a.isDown || this.touchLeft;
    let moveRight = this.cursors.right.isDown || this.keys.d.isDown || this.touchRight;
    let jump = this.cursors.up.isDown || this.keys.w.isDown || this.keys.space.isDown || this.touchJump;

    if (moveLeft) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (moveRight) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      // drag handles deceleration
    }

    if (jump && onGround) {
      this.player.setVelocityY(jumpForce);
    }

    // Fall death / restart if too low
    if (this.player.y > this.scale.height + 100) {
      this.scene.restart();
    }
  }
}
