// Sizzle & Serve — data: ingredients, cooking times and the dish recipes.
// Plain data only; the kitchen logic lives in game.js, the art in draw.js.

// needsCook: the raw ingredient goes on a burner first; cookSeconds until
// it is ready, then burnSeconds of grace before it is ruined.
const INGREDIENTS = {
  bun:     { name: 'Bun',     color: '#e8a856', dark: '#c07f2e' },
  patty:   { name: 'Patty',   color: '#8a4b2a', dark: '#5f3018', needsCook: true, cookSeconds: 6, burnSeconds: 5 },
  cheese:  { name: 'Cheese',  color: '#ffc93c', dark: '#e0a81e' },
  lettuce: { name: 'Lettuce', color: '#7bc950', dark: '#4f9c2e' },
  tomato:  { name: 'Tomato',  color: '#e5484d', dark: '#b02a2e' },
  egg:     { name: 'Egg',     color: '#fff3d6', dark: '#f5b942', needsCook: true, cookSeconds: 4, burnSeconds: 4 },
  bacon:   { name: 'Bacon',   color: '#c0453e', dark: '#8e2f2a', needsCook: true, cookSeconds: 5, burnSeconds: 4 },
  toast:   { name: 'Toast',   color: '#d99a4e', dark: '#a96f2c' },
};

// The order the bins sit on the counter, left to right (keys 1-8).
const COUNTER_ORDER = ['bun', 'patty', 'cheese', 'lettuce', 'tomato', 'egg', 'bacon', 'toast'];

// A plate matches a dish when it holds exactly the recipe's items;
// cookable items must be on the plate cooked, never raw or burnt.
const RECIPES = {
  burger:    { name: 'Sunset Burger',   price: 12, items: ['bun', 'patty', 'cheese', 'lettuce'] },
  breakfast: { name: 'Sunny Breakfast', price: 11, items: ['toast', 'egg', 'bacon'] },
  blt:       { name: 'Garden BLT',      price: 10, items: ['toast', 'bacon', 'lettuce', 'tomato'] },
  salad:     { name: 'Chef Salad',      price: 8,  items: ['lettuce', 'tomato', 'cheese'] },
};

const RECIPE_KEYS = Object.keys(RECIPES);
