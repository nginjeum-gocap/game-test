/**
 * Shop catalog. Easy to extend.
 * currency: 'coin' | 'diamond'
 * type: 'skin' | 'cosmetic' | 'boost'
 */

export const SHOP_ITEMS = [
  {
    id: 'skin_default',
    name: 'Default Runner',
    description: 'The classic teal adventurer. Free starter skin.',
    price: 0,
    currency: 'coin',
    type: 'skin',
    color: 0x4ecca3,
    free: true
  },
  {
    id: 'skin_crimson',
    name: 'Crimson Blaze',
    description: 'Fiery red skin for bold explorers.',
    price: 50,
    currency: 'coin',
    type: 'skin',
    color: 0xe94560
  },
  {
    id: 'skin_gold',
    name: 'Golden Hero',
    description: 'Shine bright on every platform.',
    price: 120,
    currency: 'coin',
    type: 'skin',
    color: 0xf4a261
  },
  {
    id: 'skin_violet',
    name: 'Violet Shadow',
    description: 'Mysterious purple glow.',
    price: 8,
    currency: 'diamond',
    type: 'skin',
    color: 0x9b5de5
  },
  {
    id: 'skin_cyan',
    name: 'Cyber Cyan',
    description: 'Neon cyberpunk look.',
    price: 15,
    currency: 'diamond',
    type: 'skin',
    color: 0x00f5d4
  },
  {
    id: 'fx_trail',
    name: 'Motion Trail',
    description: 'Leave a short visual trail while moving. Cosmetic only.',
    price: 30,
    currency: 'coin',
    type: 'cosmetic'
  },
  {
    id: 'fx_sparkle',
    name: 'Sparkle Jump',
    description: 'Sparkles when you jump. Cosmetic only.',
    price: 5,
    currency: 'diamond',
    type: 'cosmetic'
  }
];

export function getItemById(id) {
  return SHOP_ITEMS.find(i => i.id === id) || null;
}

export function getSkinColor(skinId) {
  const item = getItemById(skinId);
  return item && item.color ? item.color : 0x4ecca3;
}
