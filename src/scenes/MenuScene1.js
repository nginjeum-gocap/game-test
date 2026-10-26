import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient effect via graphics
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x302b63, 0x302b63, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, height * 0.28, 'PLATFORMER', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '48px',
      color: '#e94560',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.40, 'ADVENTURE', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      stroke: '#e94560',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height * 0.52, 'Stage 1 • One Level Demo', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#a0a0c0'
    }).setOrigin(0.5);

    // Start button
    const buttonBg = this.add.rectangle(width / 2, height * 0.68, 220, 56, 0xe94560)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(3, 0xffffff);

    const buttonText = this.add.text(width / 2, height * 0.68, 'START GAME', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Hover effects
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0xff6b81);
      buttonBg.setScale(1.05);
      buttonText.setScale(1.05);
    });
    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0xe94560);
      buttonBg.setScale(1);
      buttonText.setScale(1);
    });
    buttonBg.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Controls hint
    this.add.text(width / 2, height * 0.88, 'Keyboard: ← → / A D to move  •  Space / W / ↑ to jump\nTouch: On-screen buttons appear on mobile', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#707090',
      align: 'center'
    }).setOrigin(0.5);
  }
}
