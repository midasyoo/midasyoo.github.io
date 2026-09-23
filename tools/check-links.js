/* midasyoo.github.io 아래의 모든 페이지가 살아 있는지 점검한다.
 *
 *   node tools/check-links.js
 *
 * 홈페이지(index.html)에 적힌 링크 + 알려진 프로젝트 경로를 모두 확인하고,
 * 하나라도 200이 아니면 종료코드 1을 반환한다. 외부 의존성 없음(Node 18+).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = 'https://midasyoo.github.io';

/* 이 계정에서 운영 중인 프로젝트 페이지 — 새 프로젝트를 만들면 여기에 추가한다. */
const PROJECTS = [
  'etri-3d-map',
  'office-light-3d',
  'baseball-pitch-trainer',
  'stakka',
  'stakka2',
  'stakka3',
  'paper-magazine',
  'midasyoo2',
];

const TIMEOUT = 15000;

async function head(url) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT);
  try {
    // HEAD를 막는 호스트가 있어 GET으로 확인하되 본문은 읽지 않는다
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow' });
    return { status: r.status, url: r.url };
  } catch (e) {
    return { status: 0, err: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally {
    clearTimeout(timer);
  }
}

/* index.html에 박혀 있는 midasyoo.github.io 링크를 뽑아낸다 */
function linksInPage() {
  const file = path.join(__dirname, '..', 'index.html');
  if (!fs.existsSync(file)) return [];
  const html = fs.readFileSync(file, 'utf8');
  const found = new Set();
  const re = /href="(https:\/\/midasyoo\.github\.io\/[^"]*)"/g;
  let m;
  while ((m = re.exec(html))) found.add(m[1]);
  return [...found];
}

/* 홈페이지 자체의 하위 페이지 */
const OWN = ['/', '/stats.html', '/privacy.html',
             '/assets/analytics.js', '/assets/avatar.svg'];

(async () => {
  const targets = new Set(OWN.map(p => ROOT + p));
  PROJECTS.forEach(p => targets.add(`${ROOT}/${p}/`));
  linksInPage().forEach(u => targets.add(u));

  const list = [...targets].sort();
  console.log(`점검 대상 ${list.length}건\n`);

  const results = await Promise.all(list.map(async u => ({ u, ...(await head(u)) })));

  let bad = 0;
  for (const r of results) {
    const p = r.u.replace(ROOT, '') || '/';
    if (r.status === 200) {
      console.log(`  OK    ${p}`);
    } else {
      bad++;
      console.log(`  실패  ${p}  →  ${r.status || r.err}`);
    }
  }

  console.log(`\n${list.length}건 중 정상 ${list.length - bad} · 실패 ${bad}`);
  if (bad) {
    console.log('\n실패한 경로가 프로젝트 페이지라면 해당 저장소의');
    console.log('Settings → Pages 에서 배포 상태를 확인한다.');
  }
  // process.exit()를 쓰면 keep-alive 소켓이 닫히기 전에 종료돼 경고가 난다.
  // 종료코드만 지정하고 이벤트 루프가 비면 자연히 끝나게 둔다.
  process.exitCode = bad ? 1 : 0;
})();
