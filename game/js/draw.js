// Sizzle & Serve — art: the whole kitchen is drawn with canvas shapes,
// no images. Layout constants live here; game.js hit-tests against them.

const VIEW = { w: 1280, h: 800 };
const LAYOUT = {
  ticket: { x: 14, y: 14, w: 196, h: 128, gap: 12 },
  dayPanel: { x: 884, y: 14, w: 382, h: 128 },
  stove: { x: 40, y: 300, w: 390, h: 180 },
  burners: [ { x: 140, y: 392, r: 60 }, { x: 330, y: 392, r: 60 } ],
  plate: { x: 645, y: 428, r: 108 },
  pass: { x: 850, y: 300, w: 390, h: 180 },
  bins: { x: 20, y: 596, w: 116, h: 158, gap: 10 },
  trash: { x: 1032, y: 596, w: 224, h: 158 },
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawIngredientShape(ctx, id, x, y, s, cooked) {
  // One ingredient, centred at x,y, roughly s wide. Cooked items are
  // drawn richer/darker; burnt ones (cooked === 'burnt') near-black.
  const ing = INGREDIENTS[id];
  const col = cooked === 'burnt' ? '#2b2320' : ing.color;
  const dark = cooked === 'burnt' ? '#17120f' : ing.dark;
  ctx.save();
  ctx.translate(x, y);
  const u = s / 60;
  ctx.fillStyle = col; ctx.strokeStyle = dark; ctx.lineWidth = 2 * u;
  switch (id) {
    case 'bun':
      ctx.beginPath(); ctx.ellipse(0, 2 * u, 26 * u, 15 * u, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      [[-10, -3], [4, -6], [13, 0]].forEach(p => { ctx.beginPath(); ctx.ellipse(p[0] * u, p[1] * u, 2.4 * u, 1.4 * u, 0.4, 0, 7); ctx.fill(); });
      break;
    case 'patty':
      rr(ctx, -25 * u, -11 * u, 50 * u, 22 * u, 9 * u); ctx.fill(); ctx.stroke();
      break;
    case 'cheese':
      ctx.save(); ctx.rotate(0.12);
      rr(ctx, -23 * u, -13 * u, 46 * u, 26 * u, 4 * u); ctx.fill(); ctx.stroke(); ctx.restore();
      break;
    case 'lettuce':
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const px = -26 * u + i * 5.2 * u, py = Math.sin(i * 1.4) * 5 * u;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      for (let i = 10; i >= 0; i--) {
        const px = -26 * u + i * 5.2 * u, py = 12 * u + Math.sin(i * 1.4 + 2) * 4 * u;
        ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case 'tomato':
      ctx.beginPath(); ctx.ellipse(0, 0, 24 * u, 16 * u, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.ellipse(-7 * u, -4 * u, 8 * u, 5 * u, -0.4, 0, 7); ctx.fill();
      break;
    case 'egg':
      ctx.beginPath(); ctx.ellipse(0, 0, 25 * u, 17 * u, 0.2, 0, 7);
      ctx.fillStyle = cooked === 'burnt' ? '#3a3128' : '#fff6e0'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(2 * u, 0, 9 * u, 0, 7);
      ctx.fillStyle = cooked === 'burnt' ? '#241c14' : '#ffb703'; ctx.fill(); ctx.stroke();
      break;
    case 'bacon':
      [-11, 9].forEach(off => {
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
          const px = -24 * u + i * 6 * u, py = off * u + Math.sin(i * 1.6 + off) * 3.4 * u;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        for (let i = 8; i >= 0; i--) {
          const px = -24 * u + i * 6 * u, py = (off + 8) * u + Math.sin(i * 1.6 + off) * 3.4 * u;
          ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
      });
      break;
    case 'toast':
      rr(ctx, -23 * u, -16 * u, 46 * u, 32 * u, 10 * u); ctx.fill(); ctx.stroke();
      rr(ctx, -17 * u, -10 * u, 34 * u, 20 * u, 7 * u);
      ctx.fillStyle = cooked === 'burnt' ? '#2b2320' : '#f0be7d'; ctx.fill();
      break;
  }
  ctx.restore();
}

function drawPlateStack(ctx, plate) {
  const { x, y } = LAYOUT.plate;
  // table shadow + plate
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(x, y + 40, 128, 20, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#f4f1ea'; ctx.strokeStyle = '#c9c2b4'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(x, y + 26, 118, 30, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e7e2d6';
  ctx.beginPath(); ctx.ellipse(x, y + 24, 88, 21, 0, 0, 7); ctx.fill();
  // layers stack upward in the order they were added
  plate.forEach((item, i) => {
    const ly = y + 16 - i * 15;
    if (item.id === 'bun' && i === plate.length - 1 && plate.length > 1) {
      // a bun on top of a stack is the dome lid
      ctx.fillStyle = INGREDIENTS.bun.color; ctx.strokeStyle = INGREDIENTS.bun.dark; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x, ly, 52, 24, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else {
      drawIngredientShape(ctx, item.id, x, ly, 104, item.state);
    }
  });
  if (!plate.length) {
    ctx.fillStyle = '#8b8378'; ctx.font = '600 17px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('empty plate — click ingredients below', x, y + 30);
  }
}

function drawTicket(ctx, ticket, x, y, selected) {
  const { w, h } = LAYOUT.ticket;
  ctx.fillStyle = selected ? '#fff7dd' : '#fdfbf6';
  ctx.strokeStyle = selected ? '#e0a81e' : '#b9b0a0'; ctx.lineWidth = selected ? 4 : 2;
  rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2e22'; ctx.font = '700 16.5px system-ui'; ctx.textAlign = 'left';
  ctx.fillText(RECIPES[ticket.dish].name, x + 12, y + 27);
  ctx.fillStyle = '#8a6d1d'; ctx.font = '700 17px system-ui'; ctx.textAlign = 'right';
  ctx.fillText('$' + RECIPES[ticket.dish].price, x + w - 12, y + 27);
  // mini stack of the recipe, so the player sees what to build
  RECIPES[ticket.dish].items.forEach((id, i) => {
    drawIngredientShape(ctx, id, x + 34 + i * 40, y + 66, 40, INGREDIENTS[id].needsCook ? 'cooked' : undefined);
  });
  // patience bar
  const frac = Math.max(0, ticket.patience / ticket.maxPatience);
  ctx.fillStyle = '#e3ddd0'; rr(ctx, x + 12, y + h - 24, w - 24, 11, 5); ctx.fill();
  ctx.fillStyle = frac > 0.45 ? '#58b368' : frac > 0.22 ? '#f0a832' : '#e5484d';
  if (frac > 0) { rr(ctx, x + 12, y + h - 24, (w - 24) * frac, 11, 5); ctx.fill(); }
  ctx.fillStyle = '#6b6154'; ctx.font = '600 12.5px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('click ticket to serve', x + 12, y + h - 32);
}

function drawBurner(ctx, burner, spot, now) {
  ctx.fillStyle = '#23262b';
  ctx.beginPath(); ctx.arc(spot.x, spot.y, spot.r, 0, 7); ctx.fill();
  ctx.strokeStyle = '#454a52'; ctx.lineWidth = 4; ctx.stroke();
  if (!burner) {
    ctx.fillStyle = '#5a6068'; ctx.font = '600 15px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('empty burner', spot.x, spot.y + 5);
    return;
  }
  if (burner.state === 'cooking') {
    // flame + sizzle bubbles
    ctx.fillStyle = 'rgba(255,140,40,.75)';
    for (let i = 0; i < 5; i++) {
      const fx = spot.x - 34 + i * 17, fh = 12 + 6 * Math.sin(now / 90 + i * 2);
      ctx.beginPath(); ctx.ellipse(fx, spot.y + spot.r - 8, 6, fh, 0, 0, 7); ctx.fill();
    }
  }
  drawIngredientShape(ctx, burner.id, spot.x, spot.y - 4, 74,
    burner.state === 'burnt' ? 'burnt' : burner.state === 'ready' ? 'cooked' : undefined);
  // progress: cooking fills yellow, ready pulses green, burnt is red-full
  const frac = burner.state === 'cooking' ? burner.t / burner.cookTime : 1;
  ctx.fillStyle = '#17181c'; rr(ctx, spot.x - 46, spot.y + spot.r + 12, 92, 12, 6); ctx.fill();
  ctx.fillStyle = burner.state === 'ready' ? '#58b368' : burner.state === 'burnt' ? '#e5484d' : '#f0a832';
  rr(ctx, spot.x - 46, spot.y + spot.r + 12, 92 * Math.min(1, frac), 12, 6); ctx.fill();
  ctx.font = '700 15px system-ui'; ctx.textAlign = 'center';
  ctx.fillStyle = burner.state === 'ready' ? '#2e7d43' : burner.state === 'burnt' ? '#e5484d' : '#6b6154';
  const label = burner.state === 'cooking' ? 'cooking…' : burner.state === 'ready' ? 'READY — click to take!' : 'BURNT — click to toss';
  ctx.fillText(label, spot.x, spot.y + spot.r + 44);
}

function drawKitchen(ctx, state, now) {
  // wall, tiles and shelf
  ctx.fillStyle = '#f3e3c2'; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  ctx.fillStyle = '#ecd9ae'; ctx.fillRect(0, 150, VIEW.w, 130);
  ctx.strokeStyle = 'rgba(160,125,70,.25)'; ctx.lineWidth = 2;
  for (let x = 0; x < VIEW.w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 150); ctx.lineTo(x, 280); ctx.stroke(); }
  ctx.fillStyle = '#a96f2c'; ctx.fillRect(0, 268, VIEW.w, 14);
  // jars on the shelf
  ['#e5484d', '#7bc950', '#ffc93c', '#7ae0ff'].forEach((c, i) => {
    const jx = 470 + i * 62;
    ctx.fillStyle = c; rr(ctx, jx, 216, 40, 52, 7); ctx.fill();
    ctx.fillStyle = '#6b4a22'; ctx.fillRect(jx + 4, 206, 32, 10);
  });
  ctx.fillStyle = '#6b4a22'; ctx.font = '700 21px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('— the pantry shelf —', 880, 246);

  // order board backing
  ctx.fillStyle = '#7a4a21'; rr(ctx, 6, 6, 866, 144, 12); ctx.fill();
  ctx.fillStyle = '#fff8ea'; ctx.font = '700 15px system-ui'; ctx.textAlign = 'left';
  if (!state.tickets.length) ctx.fillText('ORDER BOARD — waiting for customers…', 22, 84);

  // day panel
  const dp = LAYOUT.dayPanel;
  ctx.fillStyle = '#3a2e22'; rr(ctx, dp.x, dp.y, dp.w, dp.h, 12); ctx.fill();
  ctx.fillStyle = '#ffd94a'; ctx.font = '800 30px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('DAY ' + state.day, dp.x + 18, dp.y + 42);
  ctx.fillStyle = '#f4f1ea'; ctx.font = '700 22px system-ui';
  ctx.fillText('⏱ ' + state.clockText, dp.x + 18, dp.y + 78);
  ctx.fillText('🪙 ' + state.coins + ' coins', dp.x + 190, dp.y + 78);
  ctx.font = '600 17px system-ui'; ctx.fillStyle = '#cbbfa8';
  ctx.fillText('served ' + state.served + ' · streak x' + state.streak, dp.x + 18, dp.y + 108);
  // day timer bar
  ctx.fillStyle = '#241c14'; rr(ctx, dp.x + 190, dp.y + 92, 174, 13, 6); ctx.fill();
  ctx.fillStyle = '#58b368'; rr(ctx, dp.x + 190, dp.y + 92, 174 * state.dayFrac, 13, 6); ctx.fill();

  // stove block
  const st = LAYOUT.stove;
  ctx.fillStyle = '#33373d'; rr(ctx, st.x, st.y, st.w, st.h, 14); ctx.fill();
  ctx.fillStyle = '#f4f1ea'; ctx.font = '700 18px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('STOVE — cook raw items here', st.x + 14, st.y + 26);

  // pass window
  const ps = LAYOUT.pass;
  ctx.fillStyle = '#8a5a30'; rr(ctx, ps.x, ps.y, ps.w, ps.h, 14); ctx.fill();
  ctx.fillStyle = '#fdf6e3'; rr(ctx, ps.x + 14, ps.y + 36, ps.w - 28, ps.h - 60, 10); ctx.fill();
  ctx.fillStyle = '#6b4a22'; ctx.font = '700 18px system-ui';
  ctx.fillText('THE PASS — finished plates', ps.x + 14, ps.y + 26);
  ctx.font = '600 16.5px system-ui'; ctx.fillStyle = '#7a6a52';
  ctx.fillText(state.passNote, ps.x + 28, ps.y + 84);
  ctx.fillText('Tip grows while patience is high.', ps.x + 28, ps.y + 110);
  // service bell
  ctx.fillStyle = '#d9d4c8'; ctx.beginPath(); ctx.ellipse(ps.x + ps.w - 62, ps.y + ps.h - 44, 26, 15, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8f8a7d'; ctx.fillRect(ps.x + ps.w - 84, ps.y + ps.h - 44, 44, 6);

  // plate zone label
  ctx.fillStyle = '#6b4a22'; ctx.font = '700 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('YOUR PLATE', LAYOUT.plate.x, 330);

  // counter (wood) + bins
  ctx.fillStyle = '#b07a3f'; ctx.fillRect(0, 580, VIEW.w, 220);
  ctx.fillStyle = '#96652f'; ctx.fillRect(0, 580, VIEW.w, 10);
  const bn = LAYOUT.bins;
  COUNTER_ORDER.forEach((id, i) => {
    const bx = bn.x + i * (bn.w + bn.gap);
    ctx.fillStyle = '#fdf6e3'; rr(ctx, bx, bn.y, bn.w, bn.h, 10); ctx.fill();
    ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 2; rr(ctx, bx, bn.y, bn.w, bn.h, 10); ctx.stroke();
    drawIngredientShape(ctx, id, bx + bn.w / 2, bn.y + 56, 62);
    ctx.fillStyle = '#3a2e22'; ctx.font = '700 16.5px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(INGREDIENTS[id].name, bx + bn.w / 2, bn.y + 112);
    ctx.fillStyle = '#8a7a5f'; ctx.font = '600 13px system-ui';
    ctx.fillText(INGREDIENTS[id].needsCook ? 'cook it! · key ' + (i + 1) : 'ready · key ' + (i + 1), bx + bn.w / 2, bn.y + 134);
  });
  // trash
  const tr = LAYOUT.trash;
  ctx.fillStyle = '#8e2f2a'; rr(ctx, tr.x, tr.y, tr.w, tr.h, 10); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '800 24px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('🗑 TRASH', tr.x + tr.w / 2, tr.y + 70);
  ctx.font = '600 14.5px system-ui';
  ctx.fillText('clear the plate · key T', tr.x + tr.w / 2, tr.y + 98);
}
