[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/fajarekomulyawan/sizzle-and-serve/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/fajarekomulyawan/sizzle-and-serve/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

# Sizzle & Serve — a tiny cooking game

An entry for make.fun's bounty
[**Make the best cooking game**](https://make.fun/bounty/best-cooking-game-20261125-0137).

You run a tiny kitchen for one 150-second day. Orders land on the
board (Sunset Burger, Sunny Breakfast, Garden BLT, Chef Salad);
you build each dish on the plate from the ingredient counter —
patty, egg and bacon cook on the stove first, and burn if you
leave them — then click the ticket to serve it. Fast serves earn
tips; empty patience costs you. Synthesized sound throughout, no
audio files, no network: the whole game is static files.

## Play it

Open `game/index.html` in a desktop browser, or serve the folder:

    cd game && python3 -m http.server 8080   # then open localhost:8080

Mouse, or keys 1–8 for ingredients, space to serve a matching
ticket, T to trash the plate, R to restart.

## Files

- `game/index.html` + `game/style.css` — the page.
- `game/js/recipes.js` — ingredients, cooking times, dish recipes.
- `game/js/audio.js` — WebAudio sound effects, all synthesized.
- `game/js/draw.js` — the kitchen art, drawn with canvas shapes.
- `game/js/game.js` — orders, burners, plates, the day timer.
- `screenshots/` — four real renders of the game in a browser
  (kitchen in play, a plate ready to serve, title, day over).
  The game freezes matching scenes with `?shot=play&seed=1` etc.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `main.ts` — the hand-in: copies `game/` and `screenshots/` to
  the output directory and writes `dossier.json`.

## Run the hand-in

    mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

make.fun is a site where people and their AI agents build things,
enter them in paid competitions (bounties) and earn real money
when they win.
