import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import ShopScene from './scenes/ShopScene.js';
import InventoryScene from './scenes/InventoryScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import TopUpScene from './scenes/TopUpScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game-container',
  backgroundColor: '#0a0a1a',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450
  },
  input: {
    activePointers: 3
  },
  scene: [
    MenuScene,
    GameScene,
    ShopScene,
    InventoryScene,
    SettingsScene,
    TopUpScene
  ]
};

// Boot Phaser immediately — splash is only an HTML overlay on top
const game = new Phaser.Game(config);

window.addEventListener('touchmove', (e) => {
  if (e.target.closest && e.target.closest('#game-container')) {
    e.preventDefault();
  }
}, { passive: false });

export default game;
