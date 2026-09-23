/* ============================================================================
 *  방문 집계 — midasyoo.github.io 및 그 아래 모든 프로젝트 페이지 공용
 *
 *  각 프로젝트 저장소에는 아래 한 줄만 넣는다. 이 파일만 고치면 전부 반영된다.
 *
 *      <script src="https://midasyoo.github.io/assets/analytics.js" defer></script>
 *
 *  ── 두 단계로 되어 있다 ────────────────────────────────────────────────
 *   1) 조회 수 (기본 켜짐, 가입 불필요)
 *      hits.sh 배지로 경로별 조회 수를 센다. 설정할 것이 없다.
 *   2) 상세 통계 (선택, 가입 필요)
 *      GoatCounter. 유입 경로·국가·기기까지 보려면 GC_CODE 를 채운다.
 *
 *  설정과 한계는 ANALYTICS.md 참고.
 * ========================================================================== */
(function () {
  'use strict';

  /* ── 설정 ────────────────────────────────────────────────────────────── */
  var COUNT    = true;       // 조회 수 집계 (가입 불필요)
  var COLOR    = '2563c9';   // 배지 색 — 밝은 화면·어두운 화면 모두에서 읽히는 색으로
  var GC_CODE  = '';         // GoatCounter 코드. 예: 'midasyoo'  (비우면 미사용)

  var SITE = 'midasyoo.github.io';

  /* ── 집계하지 않아야 할 상황 ─────────────────────────────────────────── */
  var host = location.hostname;
  var skip =
    location.protocol === 'file:' ||                 // 로컬 파일로 연 경우
    host === 'localhost' || host === '127.0.0.1' ||
    navigator.doNotTrack === '1' ||                  // 추적 거부 설정 존중
    window.doNotTrack === '1' ||
    navigator.globalPrivacyControl === true ||
    /bot|crawl|spider|headless|lighthouse|preview/i.test(navigator.userAgent);

  /* ── 집계 키 ─────────────────────────────────────────────────────────────
     경로를 그대로 키로 쓴다. 프로젝트별로 자동 분리된다.
       /                    → midasyoo.github.io
       /stakka/             → midasyoo.github.io/stakka
       /etri-3d-map/        → midasyoo.github.io/etri-3d-map
     쿼리스트링은 뺀다. ?from=kim 같은 표시를 붙여도 같은 곳에 합산되게. */
  function key() {
    var p = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '');
    return SITE + p;
  }

  function badgeURL(k, labelled) {
    var u = 'https://hits.sh/' + k + '.svg?style=flat-square&color=' + COLOR;
    // label=%20 이면 라벨 칸 없이 숫자만 나온다. 라벨은 페이지 쪽에서 붙인다.
    return u + (labelled ? '' : '&label=%20&labelColor=' + COLOR);
  }

  if (skip || !COUNT) { setupGoat(); return; }

  /* ── 조회 수 ─────────────────────────────────────────────────────────────
     hits.sh 는 CORS 헤더를 주지 않아 숫자를 읽어올 수 없다. 이미지를 불러오는
     것 자체가 집계이므로, 화면에 보일 자리가 있으면 그 이미지를 쓰고
     없으면 보이지 않는 이미지를 하나 넣는다. 어느 쪽이든 요청은 한 번뿐이다. */
  function count() {
    var k = key();
    var slot = document.querySelector('[data-visits]');

    if (slot) {
      var img = new Image();
      img.src = badgeURL(k, false);
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.height = 18;
      img.style.cssText = 'height:18px;vertical-align:-4px;border-radius:4px;display:inline-block';
      img.onload = function () {
        var box = slot.closest('[data-visits-box]');
        if (box) box.removeAttribute('hidden');
      };
      img.onerror = function () {                    // 차단·장애 시 자리를 감춘다
        var box = slot.closest('[data-visits-box]');
        if (box) box.setAttribute('hidden', '');
      };
      slot.textContent = '';
      slot.appendChild(img);
      return;
    }

    // 보일 자리가 없는 페이지(프로젝트 등) — 집계만 한다
    var px = new Image();
    px.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px';
    px.alt = '';
    px.setAttribute('aria-hidden', 'true');
    px.src = badgeURL(k, false);
    (document.body || document.documentElement).appendChild(px);
  }

  /* ── 상세 통계 (선택) ────────────────────────────────────────────────── */
  function setupGoat() {
    if (skip || !GC_CODE) return;
    var ep = 'https://' + GC_CODE + '.goatcounter.com';
    window.goatcounter = { path: location.pathname + location.search };
    var s = document.createElement('script');
    s.async = true;
    s.src = ep + '/count.js';
    s.setAttribute('data-goatcounter', ep + '/count');
    s.onerror = function () { /* 차단·오프라인 — 무시 */ };
    document.head.appendChild(s);
  }

  function start() { count(); setupGoat(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
