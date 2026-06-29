(function () {
  "use strict";

  const STORAGE_KEY = "todo-app.items";

  /** @type {{id:string, text:string, done:boolean}[]} */
  let todos = load();
  let filter = "all"; // all | active | completed

  // DOM 참조
  const form = document.getElementById("add-form");
  const input = document.getElementById("new-todo");
  const list = document.getElementById("todo-list");
  const filters = document.getElementById("filters");
  const empty = document.getElementById("empty");
  const footer = document.getElementById("footer");
  const count = document.getElementById("count");
  const summary = document.getElementById("summary");
  const clearBtn = document.getElementById("clear-completed");

  // ---- 저장/로드 ----
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---- 동작 ----
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.unshift({ id: uid(), text: trimmed, done: false });
    save();
    render();
  }

  function toggleTodo(id) {
    const t = todos.find((t) => t.id === id);
    if (t) {
      t.done = !t.done;
      save();
      render();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    save();
    render();
  }

  function editTodo(id, text) {
    const trimmed = text.trim();
    const t = todos.find((t) => t.id === id);
    if (!t) return;
    if (!trimmed) {
      deleteTodo(id); // 빈 값으로 수정하면 삭제
    } else {
      t.text = trimmed;
      save();
      render();
    }
  }

  function clearCompleted() {
    todos = todos.filter((t) => !t.done);
    save();
    render();
  }

  // ---- 렌더링 ----
  function getVisible() {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }

  function render() {
    const visible = getVisible();
    list.innerHTML = "";

    visible.forEach((todo) => {
      list.appendChild(createItem(todo));
    });

    empty.hidden = visible.length > 0;
    footer.hidden = todos.length === 0;

    const remaining = todos.filter((t) => !t.done).length;
    count.textContent = `${remaining}개 남음 · 전체 ${todos.length}개`;

    if (todos.length === 0) {
      summary.textContent = "오늘 할 일을 정리해 보세요.";
    } else if (remaining === 0) {
      summary.textContent = "모든 할 일을 완료했어요! 🎉";
    } else {
      summary.textContent = `${remaining}개의 할 일이 남았습니다.`;
    }
  }

  function createItem(todo) {
    const li = document.createElement("li");
    li.className = "todo" + (todo.done ? " is-done" : "");
    li.dataset.id = todo.id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "todo__check";
    check.checked = todo.done;
    check.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo__text";
    text.textContent = todo.text;
    text.title = "더블클릭하여 수정";
    text.addEventListener("dblclick", () => startEdit(li, todo));

    const del = document.createElement("button");
    del.className = "todo__delete";
    del.type = "button";
    del.textContent = "×";
    del.setAttribute("aria-label", "삭제");
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(check, text, del);
    return li;
  }

  function startEdit(li, todo) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "todo__edit";
    editInput.value = todo.text;
    editInput.maxLength = 200;

    const textEl = li.querySelector(".todo__text");
    li.replaceChild(editInput, textEl);
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);

    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      editTodo(todo.id, editInput.value);
    };

    editInput.addEventListener("blur", commit);
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        editInput.blur();
      } else if (e.key === "Escape") {
        committed = true; // 변경 취소
        render();
      }
    });
  }

  // ---- 이벤트 바인딩 ----
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo(input.value);
    input.value = "";
    input.focus();
  });

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filters__btn");
    if (!btn) return;
    filter = btn.dataset.filter;
    filters.querySelectorAll(".filters__btn").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
    });
    render();
  });

  clearBtn.addEventListener("click", clearCompleted);

  // 최초 렌더
  render();
})();
