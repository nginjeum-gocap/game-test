import Phaser from 'phaser';
import { loadData, updateSettings, resetAllData } from '../utils/Storage.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  create() {
    this.data = loadData();
    this.confirmReset = false;
    this.buildUI();
  }

  buildUI() {
    const { width, height } = this.scale;
    this.children.removeAll();

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x1a1a3e, 0x1a1a3e, 1);
    bg.fillRect(0, 0, width, height);

    this.add.text(width / 2, 36, 'SETTINGS', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#e94560',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Music toggle
    this.add.text(80, 110, 'Music', { fontSize: '18px', color: '#ccc' });
    this.createToggle(width - 100, 110, this.data.settings.music, (val) => {
      this.data = updateSettings({ music: val });
      this.buildUI();
    });

    // SFX toggle
    this.add.text(80, 160, 'Sound Effects', { fontSize: '18px', color: '#ccc' });
    this.createToggle(width - 100, 160, this.data.settings.sfx, (val) => {
      this.data = updateSettings({ sfx: val });
      this.buildUI();
    });

    // Controls hint
    this.add.text(width / 2, 230, 'Controls', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#e94560'
    }).setOrigin(0.5);

    this.add.text(width / 2, 265, 'Keyboard: ←→ / A D  •  Space / W / ↑ jump\nTouch: buttons on left (move) & right (jump)', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#9090b0',
      align: 'center'
    }).setOrigin(0.5);

    // Reset data
    if (!this.confirmReset) {
      this.createButton(width / 2, 340, 220, 42, 'RESET ALL DATA', 0x882222, () => {
        this.confirmReset = true;
        this.buildUI();
      });
    } else {
      this.add.text(width / 2, 310, 'Delete Best Score, Coins, Diamonds,\nInventory & history?', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#ff8888',
        align: 'center'
      }).setOrigin(0.5);

      this.createButton(width / 2 - 90, 360, 140, 40, 'YES, RESET', 0xcc2222, () => {
        resetAllData();
        this.data = loadData();
        this.confirmReset = false;
        this.showToast('Data reset');
        this.buildUI();
      });
      this.createButton(width / 2 + 90, 360, 140, 40, 'CANCEL', 0x3d5a80, () => {
        this.confirmReset = false;
        this.buildUI();
      });
    }

    this.createButton(width / 2, height - 36, 160, 40, '← BACK', 0x3d5a80, () => {
      this.scene.start('MenuScene');
    });
  }

  createToggle(x, y, value, onChange) {
    const bg = this.add.rectangle(x, y, 70, 30, value ? 0x4ecca3 : 0x555566)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(1, 0xffffff);
    this.add.text(x, y, value ? 'ON' : 'OFF', {
      fontSize: '14px',
      color: '#fff',
      fontFamily: 'Arial Black, Arial, sans-serif'
    }).setOrigin(0.5);
    bg.on('pointerdown', () => onChange(!value));
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
    const t = this.add.text(width / 2, height - 90, msg, {
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
