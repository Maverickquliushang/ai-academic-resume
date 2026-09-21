const defaultData = JSON.parse(JSON.stringify(window.resumeData));
const dataStorageKey = "ai-academic-resume-data-v2";
const avatarStorageKey = "ai-academic-resume-avatar";

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch (_) { return null; }
}
function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
}
function safeStorageRemove(key) {
  try { localStorage.removeItem(key); } catch (_) {}
}

function loadData() {
  const saved = safeStorageGet(dataStorageKey);
  if (!saved) return JSON.parse(JSON.stringify(defaultData));
  try {
    return Object.assign(JSON.parse(JSON.stringify(defaultData)), JSON.parse(saved));
  } catch (_) {
    return JSON.parse(JSON.stringify(defaultData));
  }
}

let data = loadData();
const text = (value) => document.createTextNode(value ?? "");

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.append(text(content));
  return element;
}

function clear(selector) {
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el) el.replaceChildren();
  return el;
}

function saveData(showStatus = true) {
  safeStorageSet(dataStorageKey, JSON.stringify(data));
  if (showStatus) {
    const status = document.getElementById("save-status");
    if (status) {
      status.textContent = "✓ 已自动保存";
      status.classList.add("saved");
      clearTimeout(saveData.timer);
      saveData.timer = setTimeout(() => status.classList.remove("saved"), 900);
    }
  }
}

function renderBasics() {
  document.getElementById("candidate-name").textContent = data.basics.name || "";
  document.getElementById("candidate-target").textContent = data.basics.intent || "";
  document.getElementById("candidate-summary").textContent = data.basics.summary || "";

  const info = [
    ["手机号码", data.basics.phone],
    ["邮箱", data.basics.email],
    ["籍贯", data.basics.hometown],
    ["出生年月", data.basics.birth],
    ["政治面貌", data.basics.political],
    ["现居地", data.basics.currentResidence]
  ];

  const container = clear(document.getElementById("personal-info"));
  info.forEach(([label, value]) => {
    const item = createElement("article", "info-item");
    item.append(createElement("strong", "", label));
    item.append(createElement("span", "", value || ""));
    container.append(item);
  });

  const honorItem = createElement("article", "info-item info-item-wide");
  honorItem.append(createElement("strong", "", "荣誉 / 奖项"));
  honorItem.append(createElement("span", "", data.honors || ""));
  container.append(honorItem);
}

function setAvatar(source) {
  const avatar = document.getElementById("candidate-avatar");
  const fallback = document.getElementById("avatar-fallback");
  if (!source) {
    avatar.hidden = true;
    avatar.removeAttribute("src");
    fallback.hidden = false;
    fallback.textContent = (data.basics.name || "简").trim().slice(0, 1) || "简";
    return;
  }
  avatar.src = source;
  avatar.hidden = false;
  fallback.hidden = true;
}

function renderAvatar() {
  setAvatar(safeStorageGet(avatarStorageKey) || data.basics.avatar || "");
}

function renderEducation() {
  const container = clear(document.querySelector('[data-list="education"]'));
  (data.education || []).forEach((item) => {
    const row = createElement("article", "education-item");
    const main = createElement("div", "education-main");
    main.append(createElement("h4", "", item.school || ""));
    main.append(createElement("span", "education-major", item.major || ""));
    row.append(main);
    const side = createElement("div", "education-side");
    side.append(createElement("strong", "", item.degree || ""));
    side.append(createElement("time", "", item.period || ""));
    row.append(side);
    container.append(row);
  });
}

function renderPublications() {
  document.getElementById("publication-summary").textContent = data.publicationSummary || "";
  const container = clear(document.querySelector('[data-list="publications"]'));
  (data.publications || []).forEach((item, index) => {
    const article = createElement("article", "publication-card");
    const head = createElement("div", "publication-head");
    const titleWrap = createElement("div", "publication-title-wrap");
    titleWrap.append(createElement("span", "publication-index", String(index + 1).padStart(2, "0")));
    titleWrap.append(createElement("h4", "", item.title || ""));
    head.append(titleWrap);
    const tags = createElement("div", "tag-row");
    [item.venue, item.level, item.role].filter(Boolean).forEach((tag) => tags.append(createElement("span", "tag", tag)));
    head.append(tags);
    article.append(head);
    article.append(createElement("p", "publication-description", item.description || ""));
    container.append(article);
  });
}

function renderOtherPublications() {
  const container = clear(document.querySelector('[data-list="otherPublications"]'));
  (data.otherPublications || []).forEach((item, index) => {
    const article = createElement("article", "other-publication");
    const meta = createElement("div", "other-publication-meta");
    meta.append(createElement("span", "small-index", String(index + 1).padStart(2, "0")));
    meta.append(createElement("strong", "", item.venue || ""));
    if (item.level) meta.append(createElement("span", "mini-tag", item.level));
    article.append(meta);
    article.append(createElement("p", "", item.title || ""));
    container.append(article);
  });
}

function renderProjects() {
  const container = clear(document.querySelector('[data-list="projects"]'));
  (data.projects || []).forEach((item) => {
    const article = createElement("article", "timeline-item");
    const header = createElement("header", "item-header");
    header.append(createElement("h4", "", item.title || ""));
    header.append(createElement("time", "", item.period || ""));
    article.append(header);
    article.append(createElement("p", "item-summary", item.summary || ""));
    container.append(article);
  });
}

function renderSkills() {
  const container = clear(document.querySelector('[data-list="skills"]'));
  (data.skills || []).forEach((item, index) => {
    const article = createElement("article", "skill-card");
    article.append(createElement("span", "skill-index", String(index + 1).padStart(2, "0")));
    article.append(createElement("p", "", item || ""));
    container.append(article);
  });
}

function renderResume() {
  renderBasics();
  renderAvatar();
  renderEducation();
  renderPublications();
  renderOtherPublications();
  renderProjects();
  renderSkills();
}

function inputField(label, value, onInput, options = {}) {
  const wrap = createElement("label", "editor-field" + (options.full ? " editor-field-full" : ""));
  wrap.append(createElement("span", "editor-label", label));
  const control = document.createElement(options.multiline ? "textarea" : "input");
  if (!options.multiline) control.type = options.type || "text";
  control.value = value ?? "";
  control.placeholder = options.placeholder || "";
  if (options.multiline) control.rows = options.rows || 3;
  control.addEventListener("input", () => {
    onInput(control.value);
    saveData();
    renderResume();
  });
  wrap.append(control);
  return wrap;
}

function editorCard(title, index, onDelete) {
  const card = createElement("article", "editor-card");
  const header = createElement("div", "editor-card-header");
  header.append(createElement("strong", "", `${String(index + 1).padStart(2, "0")} · ${title}`));
  const del = createElement("button", "editor-delete", "删除");
  del.type = "button";
  del.addEventListener("click", onDelete);
  header.append(del);
  card.append(header);
  return card;
}

function addButton(label, onClick) {
  const btn = createElement("button", "editor-add", `＋ ${label}`);
  btn.type = "button";
  btn.addEventListener("click", onClick);
  return btn;
}

function renderBasicsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="basics"]'));
  const grid = createElement("div", "editor-form-grid");
  const fields = [
    ["姓名", "name"], ["方向标题", "title"], ["手机号", "phone"], ["邮箱", "email"],
    ["籍贯", "hometown"], ["出生年月", "birth"], ["政治面貌", "political"], ["现居地", "currentResidence"]
  ];
  fields.forEach(([label, key]) => grid.append(inputField(label, data.basics[key], v => data.basics[key] = v)));
  grid.append(inputField("研究方向", data.basics.intent, v => data.basics.intent = v, {full:true, multiline:true, rows:2}));
  grid.append(inputField("个人简介", data.basics.summary, v => data.basics.summary = v, {full:true, multiline:true, rows:4}));
  grid.append(inputField("荣誉 / 奖项", data.honors, v => data.honors = v, {full:true, multiline:true, rows:2}));
  grid.append(inputField("主要论文概述", data.publicationSummary, v => data.publicationSummary = v, {full:true}));
  pane.append(grid);
}

function renderEducationEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="education"]'));
  (data.education || []).forEach((item, index) => {
    const card = editorCard("教育经历", index, () => {
      data.education.splice(index, 1); saveData(); renderResume(); renderEducationEditor();
    });
    const grid = createElement("div", "editor-form-grid");
    grid.append(inputField("学校", item.school, v => item.school = v, {full:true}));
    grid.append(inputField("专业", item.major, v => item.major = v));
    grid.append(inputField("学历", item.degree, v => item.degree = v));
    grid.append(inputField("时间", item.period, v => item.period = v, {full:true}));
    card.append(grid); pane.append(card);
  });
  pane.append(addButton("新增教育经历", () => {
    data.education.push({school:"新学校", major:"专业", degree:"学历", period:"2026.09 – 至今"});
    saveData(); renderResume(); renderEducationEditor();
  }));
}

function renderPublicationsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="publications"]'));
  (data.publications || []).forEach((item, index) => {
    const card = editorCard("主要论文", index, () => {
      data.publications.splice(index, 1); saveData(); renderResume(); renderPublicationsEditor();
    });
    const grid = createElement("div", "editor-form-grid");
    grid.append(inputField("论文标题", item.title, v => item.title = v, {full:true, multiline:true, rows:2}));
    grid.append(inputField("会议 / 期刊", item.venue, v => item.venue = v));
    grid.append(inputField("级别", item.level, v => item.level = v));
    grid.append(inputField("作者身份", item.role, v => item.role = v, {full:true}));
    grid.append(inputField("论文简介", item.description, v => item.description = v, {full:true, multiline:true, rows:5}));
    card.append(grid); pane.append(card);
  });
  pane.append(addButton("新增主要论文", () => {
    data.publications.push({title:"New Paper Title", venue:"Conference 2027", level:"Conference", role:"First Author", description:"简要描述论文问题、方法与结果。"});
    saveData(); renderResume(); renderPublicationsEditor();
  }));
}

function renderOtherPublicationsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="otherPublications"]'));
  (data.otherPublications || []).forEach((item, index) => {
    const card = editorCard("其他论文", index, () => {
      data.otherPublications.splice(index, 1); saveData(); renderResume(); renderOtherPublicationsEditor();
    });
    const grid = createElement("div", "editor-form-grid");
    grid.append(inputField("会议 / 期刊", item.venue, v => item.venue = v));
    grid.append(inputField("级别", item.level, v => item.level = v));
    grid.append(inputField("论文标题", item.title, v => item.title = v, {full:true, multiline:true, rows:2}));
    card.append(grid); pane.append(card);
  });
  pane.append(addButton("新增其他论文", () => {
    data.otherPublications.push({venue:"Conference 2027", level:"Conference", title:"New Publication Title"});
    saveData(); renderResume(); renderOtherPublicationsEditor();
  }));
}

function renderProjectsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="projects"]'));
  (data.projects || []).forEach((item, index) => {
    const card = editorCard("项目经历", index, () => {
      data.projects.splice(index, 1); saveData(); renderResume(); renderProjectsEditor();
    });
    const grid = createElement("div", "editor-form-grid");
    grid.append(inputField("项目名称", item.title, v => item.title = v, {full:true}));
    grid.append(inputField("项目时间", item.period, v => item.period = v, {full:true}));
    grid.append(inputField("项目描述", item.summary, v => item.summary = v, {full:true, multiline:true, rows:5}));
    card.append(grid); pane.append(card);
  });
  pane.append(addButton("新增项目", () => {
    data.projects.push({title:"新项目｜项目名称", period:"2026.01 – 至今", summary:"描述项目背景、负责内容、使用技术和结果。"});
    saveData(); renderResume(); renderProjectsEditor();
  }));
}

function renderSkillsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="skills"]'));
  (data.skills || []).forEach((item, index) => {
    const card = editorCard("技能", index, () => {
      data.skills.splice(index, 1); saveData(); renderResume(); renderSkillsEditor();
    });
    card.append(inputField("技能描述", item, v => data.skills[index] = v, {full:true, multiline:true, rows:3}));
    pane.append(card);
  });
  pane.append(addButton("新增技能", () => {
    data.skills.push("新增一条技能描述。");
    saveData(); renderResume(); renderSkillsEditor();
  }));
}

function renderAllEditors() {
  renderBasicsEditor();
  renderEducationEditor();
  renderPublicationsEditor();
  renderOtherPublicationsEditor();
  renderProjectsEditor();
  renderSkillsEditor();
}

function openEditor() {
  renderAllEditors();
  document.getElementById("editor-backdrop").hidden = false;
  const drawer = document.getElementById("editor-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("editor-open");
}

function closeEditor() {
  document.getElementById("editor-backdrop").hidden = true;
  const drawer = document.getElementById("editor-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("editor-open");
}

function switchEditorTab(name) {
  document.querySelectorAll(".editor-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.editorTab === name));
  document.querySelectorAll(".editor-pane").forEach(pane => pane.classList.toggle("active", pane.dataset.editorPane === name));
}

function downloadBlob(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

function downloadJson() {
  downloadBlob("resume-data.json", JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}

function downloadJs() {
  const js = `/** Generated by AI Academic Resume visual editor */\nwindow.resumeData = ${JSON.stringify(data, null, 2)};\n`;
  downloadBlob("resume-data.js", js, "text/javascript;charset=utf-8");
}

function toMarkdown() {
  const lines = [`# ${data.basics.name}`, "", data.basics.intent, "", `- 手机号码：${data.basics.phone}`, `- 邮箱：${data.basics.email}`, `- 籍贯：${data.basics.hometown}`, `- 出生年月：${data.basics.birth}`, `- 政治面貌：${data.basics.political}`, `- 现居地：${data.basics.currentResidence}`, `- 荣誉 / 奖项：${data.honors}`, "", "## 教育经历"];
  data.education.forEach(i => lines.push(`- ${i.school}｜${i.major}｜${i.degree}｜${i.period}`));
  lines.push("", "## 主要论文", "", data.publicationSummary || "");
  data.publications.forEach((i, idx) => lines.push("", `### ${idx+1}. ${i.title}`, `${i.venue} · ${i.level} · ${i.role}`, "", i.description));
  lines.push("", "## 其他论文");
  data.otherPublications.forEach((i, idx) => lines.push(`- ${idx+1}. ${i.venue} · ${i.level} — ${i.title}`));
  lines.push("", "## 项目经历");
  data.projects.forEach(i => lines.push("", `### ${i.title}`, `时间：${i.period}`, "", i.summary));
  lines.push("", "## 专业技能");
  data.skills.forEach(i => lines.push(`- ${i}`));
  return lines.join("\n");
}

function importJson(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || typeof imported !== "object" || !imported.basics) throw new Error("invalid");
      data = imported;
      saveData(); renderResume(); renderAllEditors();
      alert("数据已导入并保存到浏览器。\n如果要同步到 GitHub，请点击“下载 resume-data.js”。");
    } catch (_) {
      alert("无法读取该 JSON 文件，请确认它是本模板导出的简历数据。 ");
    }
  });
  reader.readAsText(file, "utf-8");
}

function bindActions() {
  document.getElementById("avatar-upload").addEventListener("change", (event) => {
    const [file] = event.currentTarget.files;
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      safeStorageSet(avatarStorageKey, reader.result);
      setAvatar(reader.result);
    });
    reader.readAsDataURL(file);
  });

  document.getElementById("data-import").addEventListener("change", (event) => {
    const [file] = event.currentTarget.files;
    if (file) importJson(file);
    event.currentTarget.value = "";
  });

  document.querySelectorAll('[data-action="edit"]').forEach(el => el.addEventListener("click", openEditor));
  document.querySelectorAll('[data-action="close-editor"]').forEach(el => el.addEventListener("click", closeEditor));
  document.getElementById("editor-backdrop").addEventListener("click", closeEditor);

  document.querySelectorAll(".editor-tab").forEach(btn => btn.addEventListener("click", () => switchEditorTab(btn.dataset.editorTab)));

  document.querySelectorAll('[data-action="clear-avatar"]').forEach(el => el.addEventListener("click", () => {
    safeStorageRemove(avatarStorageKey);
    document.getElementById("avatar-upload").value = "";
    setAvatar("");
  }));

  document.querySelectorAll('[data-action="print"]').forEach(el => el.addEventListener("click", () => window.print()));
  document.querySelectorAll('[data-action="download-json"]').forEach(el => el.addEventListener("click", downloadJson));
  document.querySelectorAll('[data-action="download-js"]').forEach(el => el.addEventListener("click", downloadJs));

  document.querySelectorAll('[data-action="reset-data"]').forEach(el => el.addEventListener("click", () => {
    if (!confirm("确认恢复示例数据？当前浏览器中保存的简历内容会被清除。")) return;
    data = JSON.parse(JSON.stringify(defaultData));
    safeStorageRemove(dataStorageKey);
    renderResume(); renderAllEditors();
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("editor-drawer").classList.contains("open")) closeEditor();
  });
}

renderResume();
bindActions();
