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
      gravity: { y: 900 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450,
    // Expand to fill available space on mobile
    expandParent: true
  },
  input: {
    activePointers: 3
  },
  audio: {
    disableWebAudio: false
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

let game = null;

function boot() {
  if (game) return;
  game = new Phaser.Game(config);
}

// Wait for splash tap if splash is still visible, otherwise boot immediately
const splash = document.getElementById('splash');
if (splash && !splash.classList.contains('hidden') && splash.style.display !== 'none') {
  window.addEventListener('splash-done', boot, { once: true });
  // Safety: boot after 8s even if splash never dismissed
  setTimeout(boot, 8000);
} else {
  boot();
}

// Prevent page scroll while touching the game
window.addEventListener('touchmove', (e) => {
  if (e.target.closest && e.target.closest('#game-container')) {
    e.preventDefault();
  }
}, { passive: false });

export default game;
