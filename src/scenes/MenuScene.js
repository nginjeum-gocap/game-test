import Phaser from 'phaser';
import { loadData } from '../utils/Storage.js';
import { drawPlayerTexture } from '../utils/Art.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    if (!this.textures.exists('bg_menu')) this.load.image('bg_menu', 'assets/bg_menu.png');
    if (!this.textures.exists('player_img')) this.load.image('player_img', 'assets/player.png');
    if (!this.textures.exists('coin_img')) this.load.image('coin_img', 'assets/coin.png');
    if (!this.textures.exists('diamond_img')) this.load.image('diamond_img', 'assets/diamond.png');
  }

  create() {
    const { width, height } = this.scale;
    const data = loadData();
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.textures.exists('bg_menu')) {
      this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width, height);
    } else {
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x302b63, 0x24243e, 1);
      bg.fillRect(0, 0, width, height);
    }

    // Twinkling stars
    this.stars = [];
    for (let i = 0; i < 35; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.7)
      );
      this.stars.push(star);
      if (!reduceMotion) {
        this.tweens.add({
          targets: star,
          alpha: Phaser.Math.FloatBetween(0.1, 0.9),
          duration: Phaser.Math.Between(800, 2200),
          yoyo: true,
          repeat: -1,
          delay: Phaser.Math.Between(0, 1500)
        });
      }
    }

    // Floating decorative platforms
    this.createFloatingDeco(width, height, reduceMotion);

    // Title with entrance
    const title1 = this.add.text(width / 2, 42, 'PLATFORMER', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '34px',
      color: '#e94560',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);

    const title2 = this.add.text(width / 2, 80, 'ADVENTURE', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#e94560',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: title1, alpha: 1, y: 48, duration: 500, ease: 'Back.out' });
    this.tweens.add({ targets: title2, alpha: 1, y: 86, duration: 500, delay: 120, ease: 'Back.out' });

    // Idle mini character
    this.createIdleHero(width / 2, 145, reduceMotion);

    // Balances
    this.add.text(width / 2, 185, 'Coins: ' + data.totalCoins + '   DM: ' + data.totalDiamonds, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '15px',
      color: '#f0e68c'
    }).setOrigin(0.5);

    this.add.text(width / 2, 208, 'Best Score: ' + data.bestScore, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#a0a0c0'
    }).setOrigin(0.5);

    // Buttons — compact layout for landscape phones
    const buttons = [
      { label: 'PLAY', y: 255, color: 0xe94560, scene: 'GameScene' },
      { label: 'SHOP', y: 305, color: 0x3d5a80, scene: 'ShopScene' },
      { label: 'INVENTORY', y: 355, color: 0x3d5a80, scene: 'InventoryScene' },
      { label: 'TOP UP', y: 405, color: 0x7b4db8, scene: 'TopUpScene' }
    ];

    this.createButton(width - 48, 36, 64, 32, 'SET', 0x444466, () => {
      this.scene.start('SettingsScene');
    }, 13);

    buttons.forEach((b, i) => {
      const btn = this.createButton(width / 2, b.y, 220, 42, b.label, b.color, () => {
        this.scene.start(b.scene);
      });
      // Stagger entrance
      btn.bg.setAlpha(0).setScale(0.85);
      btn.txt.setAlpha(0);
      this.tweens.add({
        targets: [btn.bg, btn.txt],
        alpha: 1,
        scale: 1,
        duration: 350,
        delay: 200 + i * 80,
        ease: 'Back.out'
      });
    });
  }

  createIdleHero(x, y, reduceMotion) {
    const key = this.textures.exists('player_img') ? 'player_img' : 'player';
    if (!this.textures.exists(key)) drawPlayerTexture(this, 'player');
    const hero = this.add.image(x, y, this.textures.exists('player_img') ? 'player_img' : 'player').setScale(2.2);
    if (!reduceMotion) {
      this.tweens.add({
        targets: hero,
        y: y - 12,
        duration: 750,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createFloatingDeco(width, height, reduceMotion) {
    const platforms = [
      { x: 80, y: 320, w: 70 },
      { x: width - 90, y: 280, w: 60 },
      { x: 140, y: 200, w: 50 }
    ];
    platforms.forEach((p, i) => {
      const rect = this.add.rectangle(p.x, p.y, p.w, 12, 0xee6c4d, 0.7)
        .setStrokeStyle(1, 0xffffff, 0.3);
      if (!reduceMotion) {
        this.tweens.add({
          targets: rect,
          y: p.y - 8,
          duration: 1400 + i * 300,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: i * 200
        });
      }
    });
  }

  createButton(x, y, w, h, label, color, callback, fontSize = 18) {
    const bg = this.add.rectangle(x, y, w, h, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    const txt = this.add.text(x, y, label, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: fontSize + 'px',
      color: '#ffffff'
    }).setOrigin(0.5);

    bg.on('pointerover', () => { bg.setScale(1.06); txt.setScale(1.06); });
    bg.on('pointerout', () => { bg.setScale(1); txt.setScale(1); });
    bg.on('pointerdown', () => {
      bg.setScale(0.94);
      // Single fire — prevent double start
      bg.disableInteractive();
      this.time.delayedCall(60, () => {
        callback();
      });
    });
    return { bg, txt };
  }
}
