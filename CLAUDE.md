# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소의 코드를 다룰 때 참고할 지침을 제공합니다.

## 문서 작성 규칙
- 이 파일(CLAUDE.md)을 포함한 프로젝트 문서는 한글로 작성한다.

## 개요

순수 HTML/CSS/JS로 만든 클라이언트 사이드 todo 앱입니다 — 빌드 단계, 의존성, 테스트 프레임워크가 없습니다. `index.html`을 브라우저에서 직접 열면 실행됩니다(Windows: `start index.html`). 설치하거나 lint하거나 컴파일할 것이 없습니다.

## 아키텍처

관심사별로 분리된 세 개의 파일:

- `index.html` — 정적 마크업. 요소들은 `id`를 통해 JS와 연결됩니다(예: `add-form`, `todo-list`, `filters`, `footer`). 요소의 `id`를 변경하면 `app.js`의 해당 `getElementById` 호출도 함께 수정해야 합니다.
- `style.css` — 디자인 토큰은 `:root`의 CSS 변수(색상, radius, shadow)에 정의됩니다. 상태는 `app.js`가 토글하는 클래스로 표현됩니다: `.is-active`(필터 버튼), `.is-done`(완료된 todo).
- `app.js` — 모든 동작을 담당하며, IIFE로 감싸져 있습니다.

### app.js의 상태 흐름

이 앱은 상태로부터 렌더링하는(render-from-state) 단일 패턴을 따릅니다:

- `todos`(`{id, text, done}` 객체의 배열)와 `filter`(`"all" | "active" | "completed"`)가 유일한 상태입니다.
- 모든 변경(`addTodo`, `toggleTodo`, `deleteTodo`, `editTodo`, `clearCompleted`)은 동일한 순서를 따릅니다: `todos` 배열을 변경 → `save()` → `render()`. 증분 DOM 패칭은 없으며, `render()`가 매번 목록 전체를 다시 그립니다.
- `save()`/`load()`는 `todos`를 `localStorage`의 `todo-app.items` 키에 저장/로드합니다. `save()`가 실행되기 전까지는 편집 내용이 어디에도 반영되지 않습니다.

todo를 변경하는 기능을 추가할 때는 DOM을 직접 건드리지 말고 동일한 변경 → save → render 계약을 따르세요.
