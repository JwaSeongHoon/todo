# Todo 앱

순수 HTML/CSS/JS로 만든 클라이언트 사이드 todo 앱입니다. 빌드 단계, 의존성, 프레임워크 없이 브라우저에서 바로 실행됩니다.

## 기능

- ✅ 할 일 추가 / 완료 토글 / 삭제
- ✏️ 텍스트 더블클릭으로 수정 (빈 값으로 저장 시 삭제)
- 🔍 필터: 전체 / 진행 중 / 완료
- 🧹 완료된 항목 한 번에 비우기
- 💾 `localStorage`에 자동 저장 — 새로고침해도 유지
- 📊 남은 할 일 개수 및 요약 표시

## 실행 방법

설치할 것이 없습니다. `index.html`을 브라우저에서 열면 됩니다.

```bash
# Windows
start index.html

# macOS
open index.html
```

## 프로젝트 구조

관심사별로 세 개의 파일로 분리되어 있습니다.

| 파일 | 역할 |
| --- | --- |
| `index.html` | 정적 마크업. `id`를 통해 JS와 연결됩니다. |
| `style.css` | `:root`의 CSS 변수로 디자인 토큰(색상·radius·shadow)을 정의. 상태는 `.is-active`, `.is-done` 클래스로 표현. |
| `app.js` | 모든 동작 로직. IIFE로 감싸져 있습니다. |

## 아키텍처

상태로부터 렌더링하는(render-from-state) 단일 패턴을 따릅니다.

- **상태**: `todos`(`{id, text, done}` 배열)와 `filter`(`"all" | "active" | "completed"`)가 유일한 상태입니다.
- **변경 흐름**: 모든 변경(`addTodo`, `toggleTodo`, `deleteTodo`, `editTodo`, `clearCompleted`)은 동일한 순서를 따릅니다 — `todos` 배열 변경 → `save()` → `render()`.
- **렌더링**: 증분 DOM 패칭 없이 `render()`가 매번 목록 전체를 다시 그립니다.
- **영속성**: `save()`/`load()`가 `localStorage`의 `todo-app.items` 키로 저장·로드합니다.

## 라이선스

MIT
