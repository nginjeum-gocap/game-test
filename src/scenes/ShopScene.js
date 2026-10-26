import Phaser from 'phaser';
import { loadData, buyItem } from '../utils/Storage.js';
import { SHOP_ITEMS } from '../data/ShopItems.js';

export default class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  create() {
    this.data = loadData();
    this.buildUI();
  }

  buildUI() {
    const { width, height } = this.scale;
    this.children.removeAll();

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x1a1a3e, 0x1a1a3e, 1);
    bg.fillRect(0, 0, width, height);

    this.add.text(width / 2, 28, 'SHOP', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '28px',
      color: '#e94560',
      stroke: '#fff',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.balanceText = this.add.text(width / 2, 58, `🪙 ${this.data.totalCoins}   💎 ${this.data.totalDiamonds}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#f0e68c'
    }).setOrigin(0.5);

    // Scrollable-ish list (simple vertical)
    let y = 95;
    SHOP_ITEMS.forEach((item) => {
      if (item.free) return; // default already owned
      this.drawItemRow(item, y);
      y += 58;
    });

    this.createButton(width / 2, height - 36, 160, 40, '← BACK', 0x3d5a80, () => {
      this.scene.start('MenuScene');
    });
  }

  drawItemRow(item, y) {
    const { width } = this.scale;
    const owned = this.data.ownedItems.includes(item.id);

    this.add.rectangle(width / 2, y, width - 40, 52, 0x222244, 0.9)
      .setStrokeStyle(1, 0x444466);

    // Color swatch for skins
    if (item.color) {
      this.add.circle(40, y, 16, item.color).setStrokeStyle(2, 0xffffff);
    }

    this.add.text(70, y - 10, item.name, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '15px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    this.add.text(70, y + 10, item.description, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#9090b0'
    }).setOrigin(0, 0.5);

    const priceLabel = item.currency === 'diamond'
      ? `💎 ${item.price}`
      : `🪙 ${item.price}`;

    if (owned) {
      this.add.text(width - 50, y, 'OWNED', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        color: '#4ecca3'
      }).setOrigin(1, 0.5);
    } else {
      const btn = this.add.rectangle(width - 70, y, 90, 32, 0xe94560)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(1, 0xffffff);
      this.add.text(width - 70, y, priceLabel, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        color: '#fff'
      }).setOrigin(0.5);

      btn.on('pointerdown', () => {
        const result = buyItem(item.id, item.price, item.currency);
        this.data = result.data;
        if (result.ok) {
          this.showToast('Purchased!');
        } else if (result.reason === 'insufficient_coins' || result.reason === 'insufficient_diamonds') {
          this.showToast('Not enough!');
        } else {
          this.showToast('Cannot buy');
        }
        this.buildUI();
      });
    }
  }

  showToast(msg) {
    const { width, height } = this.scale;
    const t = this.add.text(width / 2, height - 80, msg, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#000000aa',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({
      targets: t,
      alpha: 0,
      duration: 1200,
      delay: 600,
      onComplete: () => t.destroy()
    });
  }

  createButton(x, y, w, h, label, color, cb) {
    const bg = this.add.rectangle(x, y, w, h, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(x, y, label, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '16px',
      color: '#fff'
    }).setOrigin(0.5);
    bg.on('pointerdown', cb);
  }
}
