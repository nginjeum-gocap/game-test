import Phaser from 'phaser';
import { loadData, addDiamonds } from '../utils/Storage.js';

const PACKS = [
  { id: 'starter', name: 'Starter Pack', diamonds: 10, label: 'DEMO' },
  { id: 'adventure', name: 'Adventure Pack', diamonds: 50, label: 'DEMO' },
  { id: 'premium', name: 'Premium Pack', diamonds: 150, label: 'DEMO' }
];

export default class TopUpScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TopUpScene' });
  }

  create() {
    this.data = loadData();
    this.buildUI();
  }

  buildUI() {
    const { width, height } = this.scale;
    this.children.removeAll();

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x2a1a4e, 0x2a1a4e, 1);
    bg.fillRect(0, 0, width, height);

    this.add.text(width / 2, 28, 'TOP UP DIAMOND', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '24px',
      color: '#9b5de5',
      stroke: '#fff',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(width / 2, 58, `Current: 💎 ${this.data.totalDiamonds}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#f0e68c'
    }).setOrigin(0.5);

    // Warning banner
    this.add.rectangle(width / 2, 95, width - 40, 36, 0x662222, 0.9);
    this.add.text(width / 2, 95, '⚠ DEMO — PEMBAYARAN BELUM TERSEDIA', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#ffaaaa'
    }).setOrigin(0.5);

    let y = 150;
    PACKS.forEach(pack => {
      this.drawPack(pack, y);
      y += 70;
    });

    // TEST ONLY button to add demo diamonds
    this.add.text(width / 2, height - 100, 'TEST ONLY — no real payment', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#707090'
    }).setOrigin(0.5);

    this.createButton(width / 2, height - 70, 260, 40, 'TEST: +20 💎 (DEV)', 0x555577, () => {
      this.data = addDiamonds(20);
      this.showToast('+20 Diamonds (test)');
      this.buildUI();
    });

    this.createButton(width / 2, height - 28, 160, 36, '← BACK', 0x3d5a80, () => {
      this.scene.start('MenuScene');
    });
  }

  drawPack(pack, y) {
    const { width } = this.scale;
    this.add.rectangle(width / 2, y, width - 50, 58, 0x222244, 0.95)
      .setStrokeStyle(1, 0x9b5de5);

    this.add.text(60, y - 10, pack.name, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    this.add.text(60, y + 12, `💎 ${pack.diamonds}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#c9b6ff'
    }).setOrigin(0, 0.5);

    // Disabled buy button (demo)
    const btn = this.add.rectangle(width - 90, y, 110, 34, 0x444466)
      .setStrokeStyle(1, 0x888888);
    this.add.text(width - 90, y, 'SOON', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#999'
    }).setOrigin(0.5);
  }

  createButton(x, y, w, h, label, color, cb) {
    const bg = this.add.rectangle(x, y, w, h, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(x, y, label, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '14px',
      color: '#fff'
    }).setOrigin(0.5);
    bg.on('pointerdown', cb);
  }

  showToast(msg) {
    const { width, height } = this.scale;
    const t = this.add.text(width / 2, height / 2, msg, {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#000000aa',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t, alpha: 0, duration: 1000, delay: 500,
      onComplete: () => t.destroy()
    });
  }
}
