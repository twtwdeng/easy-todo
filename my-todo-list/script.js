const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyHint = document.getElementById("empty-hint");

const CHECK_ICON = `<svg class="todo-item__check-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
  <path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function updateEmptyHint() {
  const hasItems = list.children.length > 0;
  emptyHint.classList.toggle("app__empty--hidden", hasItems);
}

function createTodoItem(text) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = crypto.randomUUID();

  const checkBtn = document.createElement("button");
  checkBtn.type = "button";
  checkBtn.className = "todo-item__check";
  checkBtn.setAttribute("aria-label", "标记为完成");
  checkBtn.innerHTML = CHECK_ICON;

  const span = document.createElement("span");
  span.className = "todo-item__text";
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "todo-item__delete";
  deleteBtn.setAttribute("aria-label", "删除任务");
  deleteBtn.textContent = "×";

  checkBtn.addEventListener("click", () => {
    const done = li.classList.toggle("todo-item--done");
    checkBtn.setAttribute(
      "aria-label",
      done ? "标记为未完成" : "标记为完成"
    );
    saveTodos(); // 🗑️ 彻底从网页移除后，刷新保险箱
  });

  deleteBtn.addEventListener("click", () => {
    li.style.opacity = "0";
    li.style.transform = "translateY(-6px)";
    setTimeout(() => {
      li.remove();// 🗑️ 从网页彻底移除
      updateEmptyHint();// 📋 更新空白提示
      saveTodos(); // 🗑️ 彻底从网页移除后，刷新保险箱
    }, 220);
  });

  li.append(checkBtn, span, deleteBtn);
  return li;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const item = createTodoItem(trimmed);
  list.prepend(item);
  updateEmptyHint();
  saveTodos(); // ➕ 成功保存新生成的任务
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

updateEmptyHint();

function saveTodos() {
  const todos = [];
  // 🔍 找到页面上所有的任务卡片
  document.querySelectorAll(".todo-item").forEach((li) => {
    todos.push({
      id: li.dataset.id,                                     // 🆔 它的唯一ID
      text: li.querySelector(".todo-item__text").textContent, // 📝 任务文字
      done: li.classList.contains("todo-item--done")         // ✅ 是否已完成
    });
  });
  // 📦 打包存入本地存储
  localStorage.setItem("todos", JSON.stringify(todos));
}

const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

savedTodos.forEach((todo) => {
  // 1. 🏗️ 重新创建卡片元素
  const item = createTodoItem(todo.text);
  
  // 2. 🆔 还原它的唯一 ID
  item.dataset.id = todo.id;
  
  // 3. ✅ 还原它的完成状态
  if (todo.done) {
    item.classList.add("todo-item--done");
    const checkBtn = item.querySelector(".todo-item__check");
    checkBtn.setAttribute("aria-label", "标记为未完成");
  }
  
  // 4. 📋 顺次追加到列表末尾
  list.append(item);
});

// 最后别忘了更新一次空白提示
updateEmptyHint();