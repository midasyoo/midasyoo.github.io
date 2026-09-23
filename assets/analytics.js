/* ============================================================================
 *  방문 집계 — midasyoo.github.io 및 그 아래 모든 프로젝트 페이지 공용
 *
 *  각 프로젝트 저장소에는 아래 한 줄만 넣는다. 이 파일만 고치면 전부 반영된다.
 *
 *      <script src="https://midasyoo.github.io/assets/analytics.js" defer></script>
 *
 *  ── 구조 ───────────────────────────────────────────────────────────────
 *   1) 조회 수 (기본 켜짐, 가입 불필요)
 *      abacus 카운터. 페이지별 + 국가별로 센다.
 *      읽기(/get)가 값을 증가시키지 않아 통계 페이지를 봐도 숫자가 오염되지 않는다.
 *   2) 상세 통계 (선택, 가입 필요)
 *      GoatCounter. 유입 경로·시간대·기기까지 보려면 GC_CODE 를 채운다.
 *
 *  설정과 한계는 ANALYTICS.md 참고.
 * ========================================================================== */
(function () {
  'use strict';

  /* ── 설정 ────────────────────────────────────────────────────────────── */
  var COUNT   = true;       // 조회 수 집계
  var GEO     = true;       // 국가 집계 (방문자 IP를 geojs.io가 국가로 변환)
  var GC_CODE = '';         // GoatCounter 코드. 예: 'midasyoo'  (비우면 미사용)

  var NS  = 'midasyoo-github-io';                       // 카운터 네임스페이스
  var API = 'https://abacus.jasoncameron.dev';
  var GEOAPI = 'https://get.geojs.io/v1/ip/country.json';

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
     경로를 키로 바꾼다. 카운터 키에는 / 를 쓸 수 없어 - 로 바꾼다.
       /                        → home
       /stakka/                 → stakka
       /etri-3d-map/            → etri-3d-map
       /etri-3d-map/mobile.html → etri-3d-map-mobile
     쿼리스트링은 뺀다. ?from=kim 같은 표시를 붙여도 같은 곳에 합산되게. */
  function pageKey() {
    var p = location.pathname
      .replace(/index\.html$/i, '')
      .replace(/\.html?$/i, '')
      .replace(/^\/+|\/+$/g, '');
    if (!p) return 'home';
    return p.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }

  function hit(k)  { return fetch(API + '/hit/' + NS + '/' + k).then(function (r) { return r.json(); }); }

  /* ── 화면에 숫자 표시 ───────────────────────────────────────────────── */
  function show(n) {
    var slot = document.querySelector('[data-visits]');
    if (!slot) return;
    slot.textContent = (typeof n === 'number' ? n : 0).toLocaleString();
    var box = slot.closest('[data-visits-box]');
    if (box) box.removeAttribute('hidden');
  }
  function hide() {
    var slot = document.querySelector('[data-visits]');
    var box = slot && slot.closest('[data-visits-box]');
    if (box) box.setAttribute('hidden', '');   // 실패 시 0으로 오해하지 않게 감춘다
  }

  /* ── 실행 ────────────────────────────────────────────────────────────── */
  function count() {
    hit(pageKey())
      .then(function (d) { show(d && d.value); })
      .catch(hide);

    if (!GEO) return;
    // 국가는 방문자 IP로 판별한다. IP는 우리가 저장하지 않고, 남는 것은
    // "그 국가에서 몇 번 열렸는가" 숫자 하나뿐이다.
    fetch(GEOAPI)
      .then(function (r) { return r.json(); })
      .then(function (g) {
        var cc = (g && g.country || '').toUpperCase();
        if (!/^[A-Z]{2}$/.test(cc)) return;
        hit('geo-' + cc);
        hit('geo-ALL');        // 목록에 없는 국가까지 합한 총계 — "기타" 계산용
      })
      .catch(function () { /* 차단·오프라인 — 페이지 동작에는 영향 없음 */ });
  }

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

  function start() {
    if (!skip && COUNT) count(); else hide();
    setupGoat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
