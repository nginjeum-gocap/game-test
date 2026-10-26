import Phaser from 'phaser';
import { loadData, equipSkin } from '../utils/Storage.js';
import { SHOP_ITEMS, getItemById } from '../data/ShopItems.js';

export default class InventoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InventoryScene' });
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

    this.add.text(width / 2, 28, 'INVENTORY', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '26px',
      color: '#4ecca3',
      stroke: '#fff',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(width / 2, 56, `Equipped: ${getItemById(this.data.equippedSkin)?.name || 'Default'}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#a0a0c0'
    }).setOrigin(0.5);

    const owned = this.data.ownedItems
      .map(id => getItemById(id))
      .filter(Boolean);

    if (owned.length === 0) {
      this.add.text(width / 2, height / 2, 'No items yet.\nVisit the Shop!', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#707090',
        align: 'center'
      }).setOrigin(0.5);
    } else {
      let y = 90;
      owned.forEach(item => {
        this.drawOwnedRow(item, y);
        y += 54;
      });
    }

    this.createButton(width / 2, height - 36, 160, 40, '← BACK', 0x3d5a80, () => {
      this.scene.start('MenuScene');
    });
  }

  drawOwnedRow(item, y) {
    const { width } = this.scale;
    const equipped = this.data.equippedSkin === item.id;

    this.add.rectangle(width / 2, y, width - 40, 48, 0x222244, 0.9)
      .setStrokeStyle(1, equipped ? 0x4ecca3 : 0x444466);

    if (item.color) {
      this.add.circle(42, y, 14, item.color).setStrokeStyle(2, 0xffffff);
    }

    this.add.text(70, y, item.name, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '15px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    if (item.type === 'skin') {
      if (equipped) {
        this.add.text(width - 50, y, 'EQUIPPED', {
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          color: '#4ecca3'
        }).setOrigin(1, 0.5);
      } else {
        const btn = this.add.rectangle(width - 70, y, 90, 30, 0x3d5a80)
          .setInteractive({ useHandCursor: true })
          .setStrokeStyle(1, 0xffffff);
        this.add.text(width - 70, y, 'EQUIP', {
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          color: '#fff'
        }).setOrigin(0.5);
        btn.on('pointerdown', () => {
          const res = equipSkin(item.id);
          this.data = res.data;
          this.buildUI();
        });
      }
    } else {
      this.add.text(width - 50, y, 'OWNED', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: '#a0a0c0'
      }).setOrigin(1, 0.5);
    }
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
