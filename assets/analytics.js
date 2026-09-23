/* ============================================================================
 *  방문 통계 — midasyoo.github.io 및 그 아래 모든 프로젝트 페이지 공용
 *
 *  각 프로젝트 저장소에는 아래 한 줄만 넣는다. 이 파일만 고치면 전부 반영된다.
 *
 *      <script src="https://midasyoo.github.io/assets/analytics.js" defer></script>
 *
 *  수집 도구는 GoatCounter(무료·쿠키 없음·오픈소스)를 쓴다.
 *  아래 CODE 가 비어 있으면 아무 요청도 보내지 않는다(설정 전에는 완전히 비활성).
 *
 *  설정 방법은 ANALYTICS.md 참고.
 * ========================================================================== */
(function () {
  'use strict';

  /* ── 설정 ────────────────────────────────────────────────────────────── */
  var CODE = '';          // GoatCounter 계정 코드. 예: 'midasyoo'  ← 여기만 채우면 켜진다
  var SHOW_COUNTER = true; // [data-visits] 요소에 방문 수를 표시할지

  /* ── 보내지 않아야 할 상황 ───────────────────────────────────────────── */
  var host = location.hostname;
  var skip =
    !CODE ||                                   // 설정 전
    location.protocol === 'file:' ||           // 로컬 파일로 연 경우
    host === 'localhost' || host === '127.0.0.1' ||
    navigator.doNotTrack === '1' ||            // 추적 거부 설정 존중
    window.doNotTrack === '1' ||
    navigator.globalPrivacyControl === true ||
    /bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent);

  var ENDPOINT = 'https://' + CODE + '.goatcounter.com';

  /* ── 1. 집계 요청 ────────────────────────────────────────────────────── */
  if (!skip) {
    // 프로젝트별로 구분되도록 경로를 그대로 보낸다.
    //   /            → 홈페이지
    //   /stakka/     → STAKKA
    //   /etri-3d-map/ → 3D 조감도
    window.goatcounter = { path: location.pathname + location.search };
    var s = document.createElement('script');
    s.async = true;
    s.src = ENDPOINT + '/count.js';
    s.setAttribute('data-goatcounter', ENDPOINT + '/count');
    // 실패해도 페이지 동작에는 영향이 없어야 한다
    s.onerror = function () { /* 차단·오프라인 — 무시 */ };
    document.head.appendChild(s);
  }

  /* ── 2. 화면에 방문 수 표시 ──────────────────────────────────────────── */
  /* <span data-visits></span>            → 현재 페이지 방문 수
     <span data-visits="/stakka/"></span> → 특정 경로 방문 수
     <span data-visits="*"></span>        → 사이트 전체 방문 수                */
  if (!SHOW_COUNTER || !CODE) return;

  function render() {
    var nodes = document.querySelectorAll('[data-visits]');
    if (!nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      var p = el.getAttribute('data-visits') || location.pathname;
      var url = ENDPOINT + '/counter/' + encodeURIComponent(p) + '.json';

      fetch(url)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d) throw new Error('no data');
          el.textContent = d.count_unique || d.count || '0';
          el.removeAttribute('hidden');
          var box = el.closest('[data-visits-box]');
          if (box) box.removeAttribute('hidden');
        })
        .catch(function () {
          // 집계 서버에 닿지 못하면 숫자 자리를 아예 감춘다 (0으로 오해하지 않게)
          var box = el.closest('[data-visits-box]');
          if (box) box.setAttribute('hidden', '');
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
