(function () {
  const CACHE_NAME = "dream-poker-20260710-asset-warmup1";
  const CONCURRENCY = 3;
  const START_DELAY_MS = 1200;
  const ASSETS = [
    "./assets/backgrounds/battle-common.jpg",
    "./assets/characters/holder-hero.jpg",
    "./assets/backgrounds/battle-boss.jpg",
    "./assets/backgrounds/layer-1-rabbit-hole.jpg",
    "./assets/backgrounds/layer-2-tea-table.jpg",
    "./assets/backgrounds/layer-3-heart-garden.jpg",
    "./assets/backgrounds/layer-4-mirror-board.jpg",
    "./assets/backgrounds/layer-5-trial-court.jpg",
    "./assets/characters/holder-avatar.jpg",
    "./assets/enemies/card-sentry.jpg",
    "./assets/enemies/armored-card-soldier.jpg",
    "./assets/enemies/card-guard-squire.jpg",
    "./assets/enemies/card-haste-jester.jpg",
    "./assets/enemies/card-hatchling.jpg",
    "./assets/enemies/card-summon-bishop.jpg",
    "./assets/enemies/coronation-knight.jpg",
    "./assets/enemies/delay-archivist.jpg",
    "./assets/enemies/echo-iron-chest.jpg",
    "./assets/enemies/envelope-warlock.jpg",
    "./assets/enemies/fast-dealer.jpg",
    "./assets/enemies/ink-draining-shadow.jpg",
    "./assets/enemies/life-archivist.jpg",
    "./assets/enemies/mirror-beetle.jpg",
    "./assets/enemies/painted-guard.jpg",
    "./assets/enemies/red-ink-medic.jpg",
    "./assets/enemies/seal-devourer.jpg",
    "./assets/enemies/slow-paper-doll.jpg",
    "./assets/enemies/split-section-bishop.jpg",
    "./assets/enemies/sweeping-butler.jpg",
    "./assets/enemies/triple-shadow.jpg",
    "./assets/enemies/two-faced-auditor.jpg",
    "./assets/enemies/war-drum-banner.jpg",
    "./assets/bosses/crown-devourer.jpg",
    "./assets/bosses/final-dealer.jpg",
    "./assets/bosses/iron-wall-warden.jpg",
    "./assets/bosses/summoning-matron.jpg",
    "./assets/bosses/swift-caster.jpg",
    "./assets/bosses/wager-judge.jpg",
    "./assets/scenes/event-table.jpg",
    "./assets/scenes/shop-counter.jpg",
    "./assets/scenes/upgrade-room.jpg",
    "./assets/packs/pack-reward.jpg",
    "./assets/packs/pack-tier-1.jpg",
    "./assets/packs/pack-tier-2.jpg",
    "./assets/packs/pack-tier-3.jpg",
    "./assets/packs/pack-tier-4.jpg",
    "./assets/packs/pack-tier-5.jpg",
    "./assets/relics/angel-kiss.jpg",
    "./assets/relics/angel-wings.jpg",
    "./assets/relics/a-power.jpg",
    "./assets/relics/armor-piercer.jpg",
    "./assets/relics/balloon.jpg",
    "./assets/relics/black-knight-contract.jpg",
    "./assets/relics/black-shield.jpg",
    "./assets/relics/blank-contract.jpg",
    "./assets/relics/bloodthirsty-saber.jpg",
    "./assets/relics/broken-beast-bone.jpg",
    "./assets/relics/broken-red-thread.jpg",
    "./assets/relics/burning-candle.jpg",
    "./assets/relics/clearance-doc.jpg",
    "./assets/relics/clock.jpg",
    "./assets/relics/cloud-ladder.jpg",
    "./assets/relics/club-crown.jpg",
    "./assets/relics/club-scepter.jpg",
    "./assets/relics/club-seal.jpg",
    "./assets/relics/compass.jpg",
    "./assets/relics/crayon.jpg",
    "./assets/relics/cursed-contract.jpg",
    "./assets/relics/curse-doll.jpg",
    "./assets/relics/dealer-chip.jpg",
    "./assets/relics/diamond-crown.jpg",
    "./assets/relics/diamond-gear.jpg",
    "./assets/relics/diamond-scepter.jpg",
    "./assets/relics/double-blades.jpg",
    "./assets/relics/echo-shield.jpg",
    "./assets/relics/five-color-stone.jpg",
    "./assets/relics/flashlight.jpg",
    "./assets/relics/gold-gourd.jpg",
    "./assets/relics/heart-crown.jpg",
    "./assets/relics/heart-scepter.jpg",
    "./assets/relics/joker-ledger.jpg",
    "./assets/relics/judgement-frame.jpg",
    "./assets/relics/knight-dagger.jpg",
    "./assets/relics/knight-lance.jpg",
    "./assets/relics/knight-medal.jpg",
    "./assets/relics/knight-sword.jpg",
    "./assets/relics/ladder.jpg",
    "./assets/relics/legendary-banknote.jpg",
    "./assets/relics/obsidian-seal.jpg",
    "./assets/relics/old-deal-box.jpg",
    "./assets/relics/pack-knife.jpg",
    "./assets/relics/paper-cup.jpg",
    "./assets/relics/paper-money.jpg",
    "./assets/relics/phonograph.jpg",
    "./assets/relics/rattan-armor.jpg",
    "./assets/relics/red-knight-contract.jpg",
    "./assets/relics/royal-coin.jpg",
    "./assets/relics/sage-heart.jpg",
    "./assets/relics/scissors.jpg",
    "./assets/relics/shield-spring.jpg",
    "./assets/relics/shuffle-gloves.jpg",
    "./assets/relics/side-card-holder.jpg",
    "./assets/relics/side-route-map.jpg",
    "./assets/relics/silencing-dagger.jpg",
    "./assets/relics/silver-gourd.jpg",
    "./assets/relics/small-mirror.jpg",
    "./assets/relics/spade-crown.jpg",
    "./assets/relics/spade-scepter.jpg",
    "./assets/relics/spartan-boots.jpg",
    "./assets/relics/sword-in-stone.jpg",
    "./assets/relics/table-trapdoor.jpg",
    "./assets/relics/tactical-hourglass.jpg",
    "./assets/relics/tail-rope.jpg",
    "./assets/relics/throne-shard.jpg",
    "./assets/relics/twins-photo.jpg",
    "./assets/relics/umbrella.jpg",
    "./assets/relics/wild-card.jpg",
    "./assets/relics/worn-backpack.jpg",
    "./assets/relics/yin-yang-charm.jpg"
  ];

  const status = {
    total: ASSETS.length,
    loaded: 0,
    cached: 0,
    failed: 0,
    done: false
  };
  window.__dreamPokerAssetWarmup = status;

  function canWarmAssets() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return !(connection && connection.saveData);
  }

  function schedule(callback) {
    window.addEventListener("load", function () {
      const start = () => window.setTimeout(callback, START_DELAY_MS);
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(start, { timeout: 3000 });
        return;
      }
      start();
    }, { once: true });
  }

  async function warmOne(asset, cache) {
    const url = new URL(asset, document.baseURI);
    const request = new Request(url.href, { method: "GET" });
    if (cache && await cache.match(request)) {
      status.cached += 1;
      return;
    }

    const response = await fetch(request, {
      cache: "force-cache",
      credentials: "same-origin"
    });
    if (!response.ok) throw new Error(`Asset warmup failed: ${url.pathname}`);
    if (cache) await cache.put(request, response.clone());
    status.loaded += 1;
  }

  async function warmAssets() {
    if (!canWarmAssets()) return;
    const queue = ASSETS.slice();
    const cache = "caches" in window ? await caches.open(CACHE_NAME) : null;

    async function worker() {
      while (queue.length) {
        const asset = queue.shift();
        try {
          await warmOne(asset, cache);
        } catch (error) {
          status.failed += 1;
        }
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    status.done = true;
  }

  schedule(() => {
    warmAssets().catch(() => {
      status.done = true;
    });
  });
})();
