# 방문자 통계 설정

홈페이지와 그 아래 **모든 프로젝트 페이지**(`/stakka/`, `/etri-3d-map/` 등)의 방문을
한 대시보드에서 본다. 경로가 전부 `midasyoo.github.io` 아래라서 사이트 하나로 전부 잡힌다.

지금은 **꺼져 있다.** 아래 1단계에서 코드를 넣어야 켜진다.
넣기 전에는 어떤 요청도 나가지 않는다.

---

## 먼저 알아둘 것 — "누가"는 알 수 없다

요청하신 6가지를 실제로 무엇이 답해 주는지 정리한다.

| 질문 | 볼 수 있는가 | 실제로 나오는 것 |
|---|---|---|
| **언제** | ✅ | 날짜·시각, 시간대별·요일별 분포 |
| **무엇을** | ✅ | 열린 페이지 경로. 프로젝트별로 구분됨 |
| **어디에서** | ✅ | 국가 단위 (IP는 저장하지 않음) |
| **어떻게** | ✅ | 브라우저·OS·화면 크기, 모바일/PC |
| **왜** | △ | 직접적으로는 알 수 없고, **유입 경로**가 가장 가까운 답이다.<br>구글 검색으로 왔는지, 어느 사이트 링크를 눌렀는지, 주소를 직접 쳤는지 |
| **누가** | ❌ | **알 수 없다** |

"누가"를 알려면 로그인을 받거나 방문자마다 식별자를 심어야 한다.
개인 홈페이지에 그걸 넣으면 방문자가 떠나고, 국내 개인정보보호법상 동의 절차도 필요해진다.
그래서 **쿠키 없는 집계**로 간다. 대신 다음은 구분된다.

- 새 방문 / 재방문 (브라우저 지문이 아니라 당일 단위 근사치)
- 기업·학교 네트워크에서 온 트래픽인지 (국가·유입 경로로 간접 추정)
- 어떤 프로젝트가 실제로 열리는지

> 특정인의 방문을 확인해야 하는 경우라면, 그 사람에게 보내는 링크에
> `?from=이름` 같은 표시를 붙이면 된다. 집계에 경로가 그대로 남는다.
> 예: `https://midasyoo.github.io/etri-3d-map/?from=kim`

---

## 1단계 · GoatCounter 계정 만들기 (2분, 무료)

<https://www.goatcounter.com/signup> 에서 가입한다.

| 입력 | 값 |
|---|---|
| Code | `midasyoo` (원하는 이름. 대시보드 주소가 된다) |
| Site domain | `midasyoo.github.io` |
| Email | 본인 이메일 |

가입하면 대시보드 주소는 `https://midasyoo.goatcounter.com` 이 된다.

무료 플랜으로 월 10만 조회까지 충분하다. 쿠키를 쓰지 않아 동의 배너가 필요 없고,
오픈소스라 나중에 직접 서버에 올려 옮길 수도 있다.

## 2단계 · 코드 넣기

[assets/analytics.js](assets/analytics.js) 맨 위 한 줄만 고친다.

```js
var CODE = '';            // 고치기 전
var CODE = 'midasyoo';    // 고친 뒤 — 1단계에서 정한 Code
```

커밋하고 푸시하면 끝이다. **홈페이지는 이 한 번으로 켜진다.**

```bash
git add -A && git commit -m "방문 통계 활성화" && git push origin gh-pages
```

## 3단계 · 프로젝트 페이지에 붙이기

프로젝트는 각자 다른 저장소라서 한 줄씩 넣어야 한다.
각 저장소의 HTML에서 `</body>` 바로 앞에 붙인다.

```html
<script src="https://midasyoo.github.io/assets/analytics.js" defer></script>
```

| 저장소 | 넣을 파일 |
|---|---|
| `etri-3d-map` | `index.html`, `mobile.html` |
| `baseball-pitch-trainer` | `index.html` |
| `stakka`, `stakka2`, `stakka3` | `index.html` |
| `paper-magazine` | 레이아웃 파일 (Astro는 `src/layouts/` 아래) |

집계 로직은 이 파일 하나에만 있으므로, **나중에 도구를 바꾸거나 설정을 고칠 때
`analytics.js` 한 곳만 수정하면 전 프로젝트에 반영된다.**

> **단일 파일 배포본에는 넣지 않는다.**
> `etri-3d-map-standalone.html` 처럼 오프라인·사내망에서 쓰는 파일은
> 외부 요청이 나가면 안 된다. 웹으로 서비스하는 `index.html` / `mobile.html` 에만 넣는다.

## 4단계 · 화면에 방문 수 표시하기 (선택)

숫자를 보여주고 싶은 자리에 요소를 두면 자동으로 채워진다.
현재 홈페이지 바닥글에 사이트 전체 방문 수가 들어가 있다.

```html
<span data-visits></span>              <!-- 현재 페이지 방문 수 -->
<span data-visits="/stakka/"></span>   <!-- 특정 경로 -->
<span data-visits="*"></span>          <!-- 사이트 전체 -->
```

집계 서버에 닿지 못하면 `data-visits-box` 로 감싼 영역을 통째로 숨긴다.
0으로 잘못 보이지 않게 하기 위해서다.

---

## 보게 되는 화면

`https://midasyoo.goatcounter.com` 에 로그인하면

- **Pages** — 경로별 조회 수. `/etri-3d-map/` 과 `/stakka3/` 중 무엇이 더 열리는지
- **Referrers** — 어디를 거쳐 왔는지. 검색엔진·SNS·특정 사이트 링크
- **Locations** — 국가별
- **Browsers / Systems / Screen sizes** — 기기 구성
- 기간을 나눠 비교하거나 CSV로 내보낼 수 있다

## 켜졌는지 확인

```bash
node tools/check-links.js          # 페이지 생존 확인
```

집계가 실제로 도는지는 브라우저 개발자도구 Network 탭에서
`count.js` 요청이 200으로 나가는지 보면 된다. 30초 정도 뒤 대시보드에 잡힌다.

자기 방문이 섞이는 게 싫으면 대시보드 Settings에서 본인 IP를 제외하거나,
브라우저에 Do Not Track을 켜 두면 된다(이 스크립트는 DNT를 존중한다).

## 꺼야 할 때

`CODE` 를 다시 빈 문자열로 되돌리면 모든 요청이 멈춘다.
프로젝트 저장소의 `<script>` 줄은 그대로 둬도 아무 동작도 하지 않는다.
