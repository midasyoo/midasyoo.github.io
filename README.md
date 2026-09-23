# midasyoo.github.io

개인 홈페이지. <https://midasyoo.github.io/>

개발 기록을 중심으로 두고, 연구 이력은 요약과 링크로 연결한다.

## 구성

```
index.html          전체 페이지 (스타일·스크립트 인라인)
privacy.html        수집 정보 안내
404.html            없는 주소로 들어왔을 때
assets/
  avatar.svg        프로필 마크
  favicon.svg       탭 아이콘
  analytics.js      방문 집계 — 프로젝트 페이지도 이 파일 하나를 공유한다
tools/
  check-links.js    프로젝트 페이지 생존 점검
ANALYTICS.md        방문 통계 설정 안내
.nojekyll           GitHub Pages의 Jekyll 처리 비활성화
```

빌드 도구·패키지 매니저·외부 CDN을 쓰지 않는다. 파일을 그대로 올리면 그게 곧 배포본이다.
로컬에서 볼 때도 `index.html`을 더블클릭하면 된다.

## 수정하는 법

### 내용 고치기

`index.html` 하나만 열면 된다. 한국어·영어가 같은 문서 안에 들어 있고,
`<span class="ko">` / `<span class="en">` 으로 구분한다.

```html
<p>
  <span class="ko">한국어 문장</span>
  <span class="en">English sentence</span>
</p>
```

둘 중 하나만 쓰면 언어를 바꿨을 때 그 자리가 빈다. **항상 쌍으로** 적는다.

### 기본 언어 바꾸기

첫 줄의 `data-lang` 값을 바꾼다. 방문자가 한 번 전환하면 그 선택이 우선한다.

```html
<html lang="ko" data-lang="ko">   <!-- 영어를 기본으로 하려면 둘 다 en -->
```

### 프로젝트 추가하기

`<section id="projects">` 안의 `.card` 블록을 복사해 쓴다.
대표 프로젝트로 크게 넣으려면 `class="card feature"`, 보통 크기는 `class="card"`.

```html
<article class="card">
  <h3><span class="ko">이름</span><span class="en">Name</span></h3>
  <div class="meta">2026 · 기술 · 비고</div>
  <p><span class="ko">설명</span><span class="en">Description</span></p>
  <div class="tags"><span class="tag">키워드</span></div>
  <div class="acts">
    <a class="primary" href="..." target="_blank" rel="noopener">
      <span class="ko">열어보기</span><span class="en">Open</span></a>
    <a class="ghost" href="..." target="_blank" rel="noopener">
      <span class="ko">소스</span><span class="en">Source</span></a>
  </div>
</article>
```

### 학력·경력 채우기

`<section id="about">` 의 `ul.rows` 안에 줄을 추가한다.
현재는 소속·학위·지역만 있고, 연도별 이력은 비어 있다(HTML 주석으로 표시해 둠).

```html
<li><span class="k">2010</span><span>KAIST 박사 졸업</span></li>
```

### 색 바꾸기

맨 위 `:root` 의 CSS 변수만 고치면 밝은 화면·어두운 화면에 함께 반영된다.
`--accent` 가 링크·버튼·강조에 쓰이는 주 색이다.

## 배포

> **게시 브랜치는 `gh-pages` 다.** `master`가 아니다.
> 이 저장소는 2021년에 beautiful-jekyll을 fork하면서 Pages 소스가 `gh-pages`로 잡혔다.
> `master`에만 푸시하면 사이트는 바뀌지 않는다.

```bash
git add -A && git commit -m "..." && git push origin gh-pages
```

푸시하면 `pages build and deployment` 워크플로가 돌고, 보통 1분 안에 반영된다.
진행 상황은 저장소의 Actions 탭에서 볼 수 있다.

두 브랜치를 맞춰 두고 싶으면:

```bash
git push origin gh-pages:master
```

`master`를 게시 브랜치로 바꾸려면 Settings → Pages → Branch 에서 `master`를 고른다.
바꾼 뒤에는 위 명령의 브랜치 이름도 바꿔야 한다.

## 방문 통계

기본은 꺼져 있다. 켜는 방법은 [ANALYTICS.md](ANALYTICS.md) 참고.
`assets/analytics.js` 의 `CODE` 한 줄만 채우면 홈페이지와 프로젝트 페이지 전부에 적용된다.

## 확인 사항

배포 전에 확인한다.

```bash
node tools/check-links.js     # 홈 + 프로젝트 페이지 8경로 생존 확인
```

- 밝은 화면 / 어두운 화면 양쪽
- 좁은 화면(360px)에서 가로 스크롤이 생기지 않는지
- 언어 전환 후 빈 자리가 없는지

## 프로젝트 페이지와의 관계

`/stakka/`, `/etri-3d-map/` 같은 경로는 **각각 별도 저장소**의 GitHub Pages가 서비스한다.
이 저장소를 어떻게 바꾸든 영향을 주지 않는다.
다만 이 저장소에 같은 이름의 폴더를 만들면 가려지므로, 프로젝트명과 겹치는 폴더는 만들지 않는다.
