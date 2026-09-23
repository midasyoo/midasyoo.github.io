# 방문 집계

홈페이지와 그 아래 **모든 프로젝트 페이지**(`/stakka/`, `/etri-3d-map/` 등)의 방문을 센다.

두 단계로 되어 있다.

| | 무엇을 보나 | 가입 | 상태 |
|---|---|---|---|
| **1단계 · 조회 수 + 국가** | 페이지별로 몇 번, 어느 나라에서 열렸는지 | 불필요 | **이미 켜져 있음** |
| **2단계 · 상세 통계** | 유입 경로·기기·시간대별 추이 | 필요 (무료, 2분) | 꺼짐 |

1단계만으로 "어느 프로젝트가 어느 나라에서 열리는지"는 바로 알 수 있다.
2단계는 "어떻게 찾아왔는지"가 궁금해질 때 켜면 된다.

---

## 먼저 알아둘 것 — "누가"는 알 수 없다

요청하신 6가지에 실제로 무엇이 답하는지.

| 질문 | 1단계 | 2단계 | 나오는 것 |
|---|:--:|:--:|---|
| **무엇을** | ✅ | ✅ | 열린 페이지. 프로젝트별로 구분됨 |
| **어디에서** | ✅ | ✅ | 국가 단위 (IP는 저장하지 않음) |
| **언제** | △ | ✅ | 1단계는 누적 숫자만, 2단계는 날짜·시각·요일 분포 |
| **어떻게** | ❌ | ✅ | 브라우저·OS·화면 크기, 모바일/PC |
| **왜** | ❌ | △ | 직접은 알 수 없고 **유입 경로**가 가장 가까운 답 —<br>검색으로 왔는지, 어느 링크를 눌렀는지, 주소를 직접 쳤는지 |
| **누가** | ❌ | ❌ | **알 수 없다** |

"누가"를 알려면 로그인을 받거나 방문자마다 식별자를 심어야 한다.
개인 홈페이지에 그러면 방문자가 떠나고, 개인정보보호법상 동의 절차도 필요해진다.

> **특정인의 방문을 확인해야 한다면** 그 사람에게 보내는 링크에 표시를 붙이면 된다.
> 2단계를 켠 상태에서 경로에 그대로 남는다.
>
> ```
> https://midasyoo.github.io/etri-3d-map/?from=kim
> ```

---

# 1단계 · 조회 수 + 국가 (설정 완료)

[abacus](https://jasoncameron.dev/abacus/) 카운터를 쓴다. 가입도 계정도 없다.
**읽기(`/get`)가 값을 증가시키지 않아** 통계를 몇 번을 봐도 숫자가 오염되지 않는다.

```
네임스페이스  midasyoo-github-io

페이지 키
  /                        →  home
  /stakka/                 →  stakka
  /etri-3d-map/            →  etri-3d-map
  /etri-3d-map/mobile.html →  etri-3d-map-mobile

국가 키
  대한민국에서의 방문        →  geo-KR
  전체 합계(기타 계산용)     →  geo-ALL
```

국가는 페이지가 열릴 때 [geojs.io](https://www.geojs.io/)에 국가 코드를 한 번 물어
`geo-<코드>` 를 올리는 방식이다. **국가 코드만 쓰고 IP는 버린다.**

## 보는 곳

- **[방문 통계 페이지](stats.html)** — 페이지별·국가별 표
- **홈페이지 바닥글** — 홈페이지 조회 수

## 국가 목록의 구조

카운터는 키를 나열해 주는 기능이 없어, 통계 페이지가 **국가 코드를 하나씩 물어본다.**
자주 나올 26개국을 먼저 확인하고, `geo-ALL` 합계와 차이가 나면 그만큼을
**"그 밖의 국가"** 로 보여준다. 버튼을 누르면 나머지 44개국도 훑는다.

목록에 없는 나라라도 **집계는 되고 있다.** 숫자가 늘어 확인하고 싶어지면
[stats.html](stats.html) 의 `COMMON` / `REST` 배열에 코드를 옮기거나 추가하면 된다.

> 카운터는 **10초당 30건**으로 제한된다(`ratelimit-policy: 30;w=10`).
> 통계 페이지는 동시 2건·0.9초 간격으로 읽어 제한 안에 들어가며,
> 그래도 걸리면 4초 쉬었다 한 번 재시도한다. 전부 읽는 데 15초쯤 걸린다.

## 프로젝트 페이지에 붙이기

프로젝트는 각자 다른 저장소라 한 줄씩 넣어야 한다. `</body>` 바로 앞에 붙인다.

```html
<script src="https://midasyoo.github.io/assets/analytics.js" defer></script>
```

| 저장소 | 넣을 파일 | 상태 |
|---|---|---|
| `etri-3d-map` | `index.html`, `mobile.html` | ✅ 적용 (빌드 스크립트가 자동 주입) |
| `baseball-pitch-trainer` | `index.html`, `index_pc.html` | ✅ 적용 |
| `stakka`, `stakka2`, `stakka3` | `index.html` | ✅ 적용 |
| `paper-magazine` | 레이아웃 파일 (Astro는 `src/layouts/` 아래) | 미적용 |

`etri-3d-map` 은 공개판을 `tools/build_public.py` 가 생성하므로, 결과물을 직접 고치면
다음 빌드에서 지워진다. 그래서 **빌드 스크립트가 단일 파일을 만든 뒤 웹 버전에만 주입**하도록
해 두었고, 빌드 종료 시 다음 문구로 확인된다.

```
검증: 내부 정보 잔여 없음 ✅
집계: 웹 버전에만 포함, 단일 파일은 외부 요청 없음 ✅
```

집계 로직은 [assets/analytics.js](assets/analytics.js) 한 곳에만 있다.
**나중에 도구를 바꾸거나 설정을 고칠 때 이 파일만 수정하면 전 프로젝트에 반영된다.**

> **단일 파일 배포본에는 넣지 않는다.**
> `etri-3d-map-standalone.html` 처럼 오프라인·사내망에서 쓰는 파일은
> 외부 요청이 나가면 안 된다. 웹으로 서비스하는 `index.html` / `mobile.html` 에만 넣는다.

## 새 프로젝트를 만들면

1. 새 저장소 `index.html` 에 위 `<script>` 한 줄
2. [stats.html](stats.html) 의 `PAGES` 배열에 한 줄
3. [tools/check-links.js](tools/check-links.js) 의 `PROJECTS` 배열에 한 줄

## 화면에 숫자 넣기

숫자를 보여줄 자리에 요소를 두면 자동으로 채워진다.

```html
<span data-visits-box hidden>
  조회 <span data-visits></span>
</span>
```

- `data-visits` 안에 배지 이미지가 들어간다
- `data-visits-box` 는 숫자를 가져오기 전까지 숨겨져 있다가, 성공하면 나타난다
  (실패했을 때 0으로 오해하지 않게 하려는 것)
- **한 페이지에 하나만 둔다.** 둘 이상이면 그만큼 중복 집계된다

## 1단계의 한계

- **조회 수이지 방문자 수가 아니다.** 같은 사람이 새로고침하면 그만큼 올라간다
- 날짜별 추이를 볼 수 없다 (누적 숫자 하나뿐)
- 국가는 **국가 단위까지만** — 지역·도시는 보지 않는다
- abacus·geojs.io 모두 외부 무료 서비스라 언제든 중단될 수 있다.
  중단되면 숫자 자리가 자동으로 숨겨지고 페이지 기능에는 영향이 없다

이 한계가 불편해지면 2단계로 간다.

---

# 2단계 · 상세 통계 (선택)

[GoatCounter](https://www.goatcounter.com/) — 무료, 쿠키 없음, 오픈소스.
쿠키를 쓰지 않아 동의 배너가 필요 없고, 나중에 직접 서버에 올려 옮길 수도 있다.

## 1) 가입 (2분)

<https://www.goatcounter.com/signup>

| 입력 | 값 |
|---|---|
| Code | `midasyoo` (원하는 이름. 대시보드 주소가 된다) |
| Site domain | `midasyoo.github.io` |

대시보드는 `https://midasyoo.goatcounter.com` 이 된다. 무료 플랜으로 월 10만 조회까지 된다.

## 2) 코드 넣기

[assets/analytics.js](assets/analytics.js) 위쪽 한 줄만 고친다.

```js
var GC_CODE = '';            // 고치기 전
var GC_CODE = 'midasyoo';    // 고친 뒤
```

```bash
git add -A && git commit -m "상세 통계 활성화" && git push origin gh-pages
```

프로젝트 페이지는 이미 `analytics.js` 를 불러오고 있으므로 **추가 작업이 없다.**

## 3) 보게 되는 화면

- **Referrers** — 어디를 거쳐 왔는지 (1단계에 없는 것)
- **Browsers / Systems / Screen sizes** — 기기 구성 (1단계에 없는 것)
- **Pages** — 경로별 조회 수와 **날짜별 추이**
- **Locations** — 국가별 (1단계와 중복되나 날짜별로 볼 수 있다)
- 기간 비교, CSV 내보내기

## 켜졌는지 확인

브라우저 개발자도구 Network 탭에서 `count.js` 요청이 200으로 나가면 된다.
30초쯤 뒤 대시보드에 잡힌다.

자기 방문이 섞이는 게 싫으면 대시보드 Settings에서 본인 IP를 제외한다.

---

## 집계하지 않는 경우

둘 다 아래 상황에서는 요청 자체를 보내지 않는다.

- 브라우저의 **Do Not Track** 또는 **Global Privacy Control** 이 켜져 있을 때
- 로컬 파일(`file://`)이나 `localhost` 로 열었을 때
- 봇·크롤러·헤드리스 브라우저로 판단될 때

방문자에게 공개하는 설명은 [privacy.html](privacy.html) 에 있다.

## 끄는 법

[assets/analytics.js](assets/analytics.js) 에서

```js
var COUNT   = false;   // 조회 수 끄기
var GEO     = false;   // 국가 집계만 끄기
var GC_CODE = '';      // 상세 통계 끄기
```

프로젝트 저장소의 `<script>` 줄은 그대로 둬도 아무 동작도 하지 않는다.
