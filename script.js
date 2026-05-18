const states = ["mastered", "learning", "untouched"];
const labels = {
  mastered: "已掌握",
  learning: "学习中",
  untouched: "未接触",
};

const tip = document.querySelector(".skill-tip");
const defaultTip = "悬停技能节点查看项目应用场景。";

function getState(node) {
  return states.find((state) => node.classList.contains(state)) || "untouched";
}

function setState(node, state) {
  node.classList.remove(...states, "is-open", "show-delete");
  node.classList.add(state);
  node.dataset.state = state;
  renderSkillNode(node);
}

function renderStars(node) {
  const picker = document.createElement("span");
  picker.className = "star-picker";
  picker.setAttribute("aria-label", "选择熟练度星级");

  const level = Number(node.dataset.level || 4);
  for (let index = 1; index <= 5; index += 1) {
    const star = document.createElement("button");
    star.type = "button";
    star.className = "star-button";
    star.textContent = index <= level ? "★" : "☆";
    star.setAttribute("aria-label", `设置为 ${index} 星`);
    star.addEventListener("click", (event) => {
      event.stopPropagation();
      node.dataset.level = String(index);
      renderSkillNode(node);
    });
    picker.appendChild(star);
  }

  return picker;
}

function renderSkillNode(node) {
  const name = node.dataset.name || node.textContent.trim();
  const state = getState(node);

  node.innerHTML = "";
  const content = document.createElement("span");
  content.className = "skill-main";

  const nameText = document.createElement("span");
  nameText.className = "skill-name";
  nameText.textContent = name;
  content.appendChild(nameText);

  const stateText = document.createElement("span");
  stateText.className = "skill-state";
  stateText.textContent = labels[state];
  content.appendChild(stateText);

  if (state === "mastered") {
    content.appendChild(renderStars(node));
  }

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "delete-skill";
  remove.textContent = "X";
  remove.setAttribute("aria-label", `删除 ${name}`);
  remove.addEventListener("click", (event) => {
    event.stopPropagation();
    node.remove();
    tip.textContent = `已取消技能点：${name}`;
  });

  node.append(content, remove);
}

function bindSkillNode(node) {
  node.dataset.name = node.dataset.name || node.textContent.trim();
  node.dataset.state = getState(node);
  node.dataset.level = node.dataset.level || "3";
  let hoverTimer;

  renderSkillNode(node);

  node.addEventListener("mouseenter", () => {
    tip.textContent = node.dataset.tip || defaultTip;
    hoverTimer = window.setTimeout(() => {
      node.classList.add("show-delete");
    }, 3000);
  });

  node.addEventListener("mouseleave", () => {
    window.clearTimeout(hoverTimer);
    node.classList.remove("show-delete");
    tip.textContent = defaultTip;
  });

  node.addEventListener("click", () => {
    const current = getState(node);
    const next = states[(states.indexOf(current) + 1) % states.length];
    setState(node, next);
  });

  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      node.click();
    }
  });
}

function createSkillNode(name) {
  const node = document.createElement("div");
  node.className = "skill-node untouched";
  node.setAttribute("role", "button");
  node.tabIndex = 0;
  node.dataset.name = name;
  node.dataset.level = "3";
  node.dataset.tip = "新增技能点，可继续切换状态与星级。";
  bindSkillNode(node);
  return node;
}

document.querySelectorAll(".skill-node").forEach(bindSkillNode);

document.querySelectorAll(".branch").forEach((branch) => {
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "add-skill";
  addButton.setAttribute("aria-label", "添加新的技能点");
  addButton.textContent = "+";
  addButton.addEventListener("click", () => {
    const name = window.prompt("请输入新的技能点名称");
    if (!name || !name.trim()) return;
    branch.insertBefore(createSkillNode(name.trim()), addButton);
  });
  branch.appendChild(addButton);
});
