const defaultData = JSON.parse(JSON.stringify(window.resumeData));
const dataStorageKey = "ai-academic-resume-data-v3";
const avatarStorageKey = "ai-academic-resume-avatar";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch (_) { return null; }
}
function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
}
function safeStorageRemove(key) {
  try { localStorage.removeItem(key); } catch (_) {}
}

function slugId(prefix = "section") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function migrateLegacyData(source) {
  if (!source || typeof source !== "object") return deepClone(defaultData);
  if (Array.isArray(source.sections)) return source;

  // Compatibility with earlier versions.
  const migrated = {
    basics: Object.assign({}, defaultData.basics, source.basics || {}),
    honors: source.honors ?? defaultData.honors,
    sections: []
  };

  if (Array.isArray(source.education)) {
    migrated.sections.push({
      id: "education",
      type: "education",
      title: "教育经历",
      subtitle: "Education",
      items: source.education
    });
  }

  if (Array.isArray(source.publications)) {
    migrated.sections.push({
      id: "selected-publications",
      type: "publication",
      title: "主要论文",
      subtitle: "Selected Publications",
      lead: source.publicationSummary || "",
      items: source.publications
    });
  }

  if (Array.isArray(source.otherPublications)) {
    migrated.sections.push({
      id: "additional-publications",
      type: "simplePublication",
      title: "其他论文",
      subtitle: "Additional Publications",
      items: source.otherPublications
    });
  }

  // New internship section is injected when migrating an older file.
  migrated.sections.push({
    id: "internships",
    type: "experience",
    title: "实习经历",
    subtitle: "Internship Experience",
    items: []
  });

  if (Array.isArray(source.projects)) {
    migrated.sections.push({
      id: "projects",
      type: "experience",
      title: "项目经历",
      subtitle: "Project Experience",
      items: source.projects
    });
  }

  if (Array.isArray(source.skills)) {
    migrated.sections.push({
      id: "skills",
      type: "skills",
      title: "专业技能",
      subtitle: "Professional Skills",
      items: source.skills
    });
  }

  return migrated;
}

function normalizeSection(section) {
  const allowedTypes = ["education", "publication", "simplePublication", "experience", "skills"];
  const normalized = Object.assign({}, section);

  normalized.id = normalized.id || slugId("section");
  normalized.type = allowedTypes.includes(normalized.type) ? normalized.type : "experience";
  normalized.title = normalized.title || "新模块";
  normalized.subtitle = normalized.subtitle || "Custom Section";
  normalized.items = Array.isArray(normalized.items) ? normalized.items : [];

  if (normalized.type === "publication") {
    normalized.lead = normalized.lead || "";
  }

  return normalized;
}

function normalizeData(source) {
  const migrated = migrateLegacyData(source);
  return {
    basics: Object.assign({}, defaultData.basics, migrated.basics || {}),
    honors: migrated.honors ?? defaultData.honors,
    sections: Array.isArray(migrated.sections)
      ? migrated.sections.map(normalizeSection)
      : deepClone(defaultData.sections)
  };
}

function loadData() {
  const saved = safeStorageGet(dataStorageKey);
  if (!saved) return normalizeData(defaultData);

  try {
    return normalizeData(JSON.parse(saved));
  } catch (_) {
    return normalizeData(defaultData);
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

function clear(target) {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (element) element.replaceChildren();
  return element;
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

function currentAvatarSource() {
  return safeStorageGet(avatarStorageKey) || data.basics.avatar || "";
}

function buildSectionHeading(section) {
  const wrapper = createElement("section", "resume-section-title");
  const heading = createElement("div", "section-heading");
  heading.append(createElement("h3", "", section.title));
  heading.append(createElement("span", "", section.subtitle));
  wrapper.append(heading);
  return wrapper;
}

/* =========================================================
   Resume block rendering
   ========================================================= */

function buildHeaderChunk() {
  const header = createElement("header", "resume-header");
  const heading = createElement("div", "resume-heading");
  heading.append(createElement("p", "resume-kicker", "Academic Resume"));
  heading.append(createElement("h2", "", data.basics.name || ""));
  heading.append(createElement("p", "candidate-target", data.basics.intent || ""));
  heading.append(createElement("p", "candidate-summary", data.basics.summary || ""));
  header.append(heading);

  const avatarBox = createElement("div", "avatar-box");
  const avatarSource = currentAvatarSource();

  if (avatarSource) {
    const image = document.createElement("img");
    image.alt = "candidate avatar";
    image.src = avatarSource;
    avatarBox.append(image);
  } else {
    avatarBox.append(
      createElement("div", "avatar-fallback",
        (data.basics.name || "简").trim().slice(0, 1) || "简")
    );
  }

  header.append(avatarBox);
  return {node: header, kind: "header"};
}

function buildInfoChunk() {
  const infoGrid = createElement("section", "info-grid");

  [
    ["手机号码", data.basics.phone],
    ["邮箱", data.basics.email],
    ["籍贯", data.basics.hometown],
    ["出生年月", data.basics.birth],
    ["政治面貌", data.basics.political],
    ["现居地", data.basics.currentResidence]
  ].forEach(([label, value]) => {
    const item = createElement("article", "info-item");
    item.append(createElement("strong", "", label));
    item.append(createElement("span", "", value || ""));
    infoGrid.append(item);
  });

  const honorItem = createElement("article", "info-item info-item-wide");
  honorItem.append(createElement("strong", "", "荣誉 / 奖项"));
  honorItem.append(createElement("span", "", data.honors || ""));
  infoGrid.append(honorItem);

  return {node: infoGrid, kind: "info"};
}

function renderEducationItem(item) {
  const row = createElement("article", "education-item");
  const main = createElement("div", "education-main");
  main.append(createElement("h4", "", item.school || ""));
  main.append(createElement("span", "education-major", item.major || ""));
  row.append(main);

  const side = createElement("div", "education-side");
  side.append(createElement("strong", "", item.degree || ""));
  side.append(createElement("time", "", item.period || ""));
  row.append(side);
  return row;
}

function renderPublicationItem(item, index) {
  const article = createElement("article", "publication-card");
  const head = createElement("div", "publication-head");
  const titleWrap = createElement("div", "publication-title-wrap");

  titleWrap.append(createElement("span", "publication-index", String(index + 1).padStart(2, "0")));
  titleWrap.append(createElement("h4", "", item.title || ""));
  head.append(titleWrap);

  const tags = createElement("div", "tag-row");
  [item.venue, item.level, item.role].filter(Boolean).forEach((tag) => {
    tags.append(createElement("span", "tag", tag));
  });

  head.append(tags);
  article.append(head);
  article.append(createElement("p", "publication-description", item.description || ""));
  return article;
}

function renderSimplePublicationItem(item, index) {
  const article = createElement("article", "other-publication");
  const meta = createElement("div", "other-publication-meta");

  meta.append(createElement("span", "small-index", String(index + 1).padStart(2, "0")));
  meta.append(createElement("strong", "", item.venue || ""));
  if (item.level) meta.append(createElement("span", "mini-tag", item.level));

  article.append(meta);
  article.append(createElement("p", "", item.title || ""));
  return article;
}

function renderExperienceItem(item) {
  const article = createElement("article", "timeline-item");
  const header = createElement("header", "item-header");

  header.append(createElement("h4", "", item.title || ""));
  header.append(createElement("time", "", item.period || ""));
  article.append(header);
  article.append(createElement("p", "item-summary", item.summary || ""));
  return article;
}

function buildResumeChunks() {
  const chunks = [buildHeaderChunk(), buildInfoChunk()];

  data.sections.forEach((section) => {
    chunks.push({
      node: buildSectionHeading(section),
      kind: "heading",
      keepWithNext: true
    });

    if (section.type === "publication" && section.lead) {
      chunks.push({
        node: createElement("p", "section-lead", section.lead),
        kind: "lead",
        keepWithNext: true
      });
    }

    if (section.type === "education") {
      section.items.forEach((item) => {
        chunks.push({node: renderEducationItem(item), kind: "education"});
      });
    }

    if (section.type === "publication") {
      section.items.forEach((item, index) => {
        chunks.push({node: renderPublicationItem(item, index), kind: "publication"});
      });
    }

    if (section.type === "simplePublication") {
      section.items.forEach((item, index) => {
        chunks.push({node: renderSimplePublicationItem(item, index), kind: "simple-publication"});
      });
    }

    if (section.type === "experience") {
      section.items.forEach((item) => {
        chunks.push({node: renderExperienceItem(item), kind: "experience"});
      });
    }

    if (section.type === "skills") {
      for (let index = 0; index < section.items.length; index += 2) {
        const row = createElement("div", "skill-list skill-page-row");

        [index, index + 1].forEach((skillIndex) => {
          if (skillIndex >= section.items.length) return;
          const article = createElement("article", "skill-card");
          article.append(createElement("span", "skill-index", String(skillIndex + 1).padStart(2, "0")));
          article.append(createElement("p", "", section.items[skillIndex] || ""));
          row.append(article);
        });

        chunks.push({node: row, kind: "skill-row"});
      }
    }
  });

  return chunks;
}

/* =========================================================
   Smart pagination
   ========================================================= */

function createResumePage() {
  const page = createElement("article", "resume-page");
  const content = createElement("div", "page-content-window");
  const flow = createElement("div", "page-flow");
  content.append(flow);
  page.append(content);

  const footer = createElement("footer", "page-footer");
  footer.append(createElement("span", "", "AI Academic Resume"));
  footer.append(createElement("span", "page-number", ""));
  page.append(footer);

  return {page, content, flow};
}

function pageOverflows(content) {
  return content.scrollHeight > content.clientHeight + 1;
}

function canFitTogether(flow, content, nodes) {
  const clones = nodes.map((node) => node.cloneNode(true));
  clones.forEach((clone) => flow.append(clone));
  const fits = !pageOverflows(content);
  clones.forEach((clone) => clone.remove());
  return fits;
}

function pageIsEmpty(flow) {
  return flow.children.length === 0;
}

let paginationFrame = null;

function renderResume() {
  if (paginationFrame) cancelAnimationFrame(paginationFrame);

  paginationFrame = requestAnimationFrame(() => {
    paginationFrame = requestAnimationFrame(() => {
      paginateResume();
      paginationFrame = null;
    });
  });
}

function paginateResume() {
  const pagesRoot = clear(document.getElementById("resume-pages"));
  if (!pagesRoot) return;

  const chunks = buildResumeChunks();
  let current = createResumePage();
  pagesRoot.append(current.page);

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];

    if (chunk.keepWithNext && chunks[index + 1]) {
      if (
        !pageIsEmpty(current.flow) &&
        !canFitTogether(current.flow, current.content, [chunk.node, chunks[index + 1].node])
      ) {
        current = createResumePage();
        pagesRoot.append(current.page);
      }
    }

    current.flow.append(chunk.node);

    if (!pageOverflows(current.content)) continue;

    chunk.node.remove();

    if (!pageIsEmpty(current.flow)) {
      current = createResumePage();
      pagesRoot.append(current.page);
    }

    current.flow.append(chunk.node);

    // If one single item is taller than an A4 body, keep it visible and warn.
    if (pageOverflows(current.content)) {
      chunk.node.classList.add("oversized-entry");
      const notice = createElement(
        "div",
        "oversized-entry-notice",
        "该单条内容超过一整页，请适当精简此条目。"
      );
      chunk.node.prepend(notice);
    }
  }

  const pages = [...pagesRoot.querySelectorAll(".resume-page")];
  while (
    pages.length > 1 &&
    pages[pages.length - 1].querySelector(".page-flow").children.length === 0
  ) {
    pages.pop().remove();
  }

  const total = Math.max(1, pages.length);
  pages.forEach((page, index) => {
    page.querySelector(".page-number").textContent =
      `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  });

  const count = document.getElementById("page-count");
  if (count) count.textContent = String(total);
}

/* =========================================================
   Editor helpers
   ========================================================= */

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

function selectField(label, value, choices, onChange) {
  const wrap = createElement("label", "editor-field");
  wrap.append(createElement("span", "editor-label", label));

  const select = document.createElement("select");
  choices.forEach(([choiceValue, choiceLabel]) => {
    const option = document.createElement("option");
    option.value = choiceValue;
    option.textContent = choiceLabel;
    option.selected = choiceValue === value;
    select.append(option);
  });

  select.addEventListener("change", () => {
    onChange(select.value);
    saveData();
    renderResume();
  });

  wrap.append(select);
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

function getTypeLabel(type) {
  return {
    education: "教育经历",
    publication: "详细论文",
    simplePublication: "简洁论文",
    experience: "经历 / 项目 / 实习",
    skills: "技能"
  }[type] || type;
}

function newItemForType(type) {
  if (type === "education") {
    return {school: "新学校", major: "专业", degree: "学历", period: "2026.09 – 至今"};
  }
  if (type === "publication") {
    return {
      title: "New Paper Title",
      venue: "Conference 2027",
      level: "Conference",
      role: "First Author",
      description: "简要描述论文问题、方法与结果。"
    };
  }
  if (type === "simplePublication") {
    return {venue: "Conference 2027", level: "Conference", title: "New Publication Title"};
  }
  if (type === "skills") {
    return "新增一条技能描述。";
  }
  return {
    title: "新经历 / 项目名称",
    period: "2026.01 – 至今",
    summary: "描述背景、职责、技术与结果。"
  };
}

/* =========================================================
   Editor: basics
   ========================================================= */

function renderBasicsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="basics"]'));
  const grid = createElement("div", "editor-form-grid");

  [
    ["姓名", "name"],
    ["方向标题", "title"],
    ["手机号", "phone"],
    ["邮箱", "email"],
    ["籍贯", "hometown"],
    ["出生年月", "birth"],
    ["政治面貌", "political"],
    ["现居地", "currentResidence"]
  ].forEach(([label, key]) => {
    grid.append(inputField(label, data.basics[key], (value) => data.basics[key] = value));
  });

  grid.append(inputField("研究方向", data.basics.intent, (value) => data.basics.intent = value, {
    full: true, multiline: true, rows: 2
  }));

  grid.append(inputField("个人简介", data.basics.summary, (value) => data.basics.summary = value, {
    full: true, multiline: true, rows: 4
  }));

  grid.append(inputField("荣誉 / 奖项", data.honors, (value) => data.honors = value, {
    full: true, multiline: true, rows: 2
  }));

  pane.append(grid);
}

/* =========================================================
   Editor: section manager
   ========================================================= */

function moveSection(index, delta) {
  const next = index + delta;
  if (next < 0 || next >= data.sections.length) return;
  [data.sections[index], data.sections[next]] = [data.sections[next], data.sections[index]];
  saveData();
  renderResume();
  renderAllEditors();
  switchEditorTab("sections");
}

function deleteSection(index) {
  const section = data.sections[index];
  if (!confirm(`确定删除整个 Section「${section.title}」及其中全部内容吗？`)) return;
  data.sections.splice(index, 1);
  saveData();
  renderResume();
  renderAllEditors();
  switchEditorTab("sections");
}

function renderSectionsEditor() {
  const pane = clear(document.querySelector('[data-editor-pane="sections"]'));

  const intro = createElement(
    "div",
    "editor-tip",
    "这里可以修改 Section 标题、删除模块、调整顺序，也可以新增一个全新的 Section。"
  );
  pane.append(intro);

  data.sections.forEach((section, index) => {
    const card = createElement("article", "section-manager-card");

    const top = createElement("div", "section-manager-top");
    const identity = createElement("div", "section-manager-identity");
    identity.append(createElement("strong", "", section.title));
    identity.append(createElement("span", "", getTypeLabel(section.type)));
    top.append(identity);

    const actions = createElement("div", "section-manager-actions");

    const up = createElement("button", "small-action", "↑");
    up.type = "button";
    up.title = "上移";
    up.disabled = index === 0;
    up.addEventListener("click", () => moveSection(index, -1));

    const down = createElement("button", "small-action", "↓");
    down.type = "button";
    down.title = "下移";
    down.disabled = index === data.sections.length - 1;
    down.addEventListener("click", () => moveSection(index, 1));

    const del = createElement("button", "small-action danger", "删除");
    del.type = "button";
    del.addEventListener("click", () => deleteSection(index));

    actions.append(up, down, del);
    top.append(actions);
    card.append(top);

    const grid = createElement("div", "editor-form-grid");
    grid.append(inputField("中文标题", section.title, (value) => {
      section.title = value;
      rebuildDynamicTabs();
    }));
    grid.append(inputField("英文副标题", section.subtitle, (value) => {
      section.subtitle = value;
    }));

    if (section.type === "publication") {
      grid.append(inputField("Section 概述", section.lead || "", (value) => {
        section.lead = value;
      }, {full: true}));
    }

    card.append(grid);

    const open = createElement("button", "editor-open-section", `编辑「${section.title}」内容`);
    open.type = "button";
    open.addEventListener("click", () => switchEditorTab(section.id));
    card.append(open);

    pane.append(card);
  });

  const creator = createElement("article", "section-create-card");
  creator.append(createElement("h3", "", "新增 Section"));

  const grid = createElement("div", "editor-form-grid");
  const titleInput = document.createElement("input");
  titleInput.placeholder = "例如：科研经历";
  const subtitleInput = document.createElement("input");
  subtitleInput.placeholder = "例如：Research Experience";
  const typeSelect = document.createElement("select");

  [
    ["experience", "经历 / 项目 / 实习"],
    ["education", "教育经历"],
    ["publication", "详细论文"],
    ["simplePublication", "简洁论文"],
    ["skills", "技能"]
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    typeSelect.append(option);
  });

  const titleWrap = createElement("label", "editor-field");
  titleWrap.append(createElement("span", "editor-label", "中文标题"), titleInput);

  const subWrap = createElement("label", "editor-field");
  subWrap.append(createElement("span", "editor-label", "英文副标题"), subtitleInput);

  const typeWrap = createElement("label", "editor-field editor-field-full");
  typeWrap.append(createElement("span", "editor-label", "Section 类型"), typeSelect);

  grid.append(titleWrap, subWrap, typeWrap);
  creator.append(grid);

  const add = addButton("新增 Section", () => {
    const title = titleInput.value.trim() || "新模块";
    const subtitle = subtitleInput.value.trim() || "Custom Section";
    const type = typeSelect.value;

    data.sections.push({
      id: slugId("section"),
      type,
      title,
      subtitle,
      lead: type === "publication" ? "" : undefined,
      items: []
    });

    saveData();
    renderResume();
    renderAllEditors();
    switchEditorTab("sections");
  });

  creator.append(add);
  pane.append(creator);
}

/* =========================================================
   Dynamic section content editors
   ========================================================= */

function renderSectionPane(section) {
  const pane = clear(document.querySelector(`[data-editor-pane="${section.id}"]`));
  if (!pane) return;

  const heading = createElement("div", "dynamic-pane-heading");
  heading.append(createElement("h3", "", section.title));
  heading.append(createElement("p", "", `${getTypeLabel(section.type)} · 可无限新增条目`));
  pane.append(heading);

  section.items.forEach((item, index) => {
    const card = editorCard(section.title, index, () => {
      section.items.splice(index, 1);
      saveData();
      renderResume();
      renderSectionPane(section);
    });

    const grid = createElement("div", "editor-form-grid");

    if (section.type === "education") {
      grid.append(inputField("学校", item.school, (v) => item.school = v, {full: true}));
      grid.append(inputField("专业", item.major, (v) => item.major = v));
      grid.append(inputField("学历", item.degree, (v) => item.degree = v));
      grid.append(inputField("时间", item.period, (v) => item.period = v, {full: true}));
    }

    if (section.type === "publication") {
      grid.append(inputField("论文标题", item.title, (v) => item.title = v, {
        full: true, multiline: true, rows: 2
      }));
      grid.append(inputField("会议 / 期刊", item.venue, (v) => item.venue = v));
      grid.append(inputField("级别", item.level, (v) => item.level = v));
      grid.append(inputField("作者身份", item.role, (v) => item.role = v, {full: true}));
      grid.append(inputField("论文简介", item.description, (v) => item.description = v, {
        full: true, multiline: true, rows: 5
      }));
    }

    if (section.type === "simplePublication") {
      grid.append(inputField("会议 / 期刊", item.venue, (v) => item.venue = v));
      grid.append(inputField("级别", item.level, (v) => item.level = v));
      grid.append(inputField("论文标题", item.title, (v) => item.title = v, {
        full: true, multiline: true, rows: 2
      }));
    }

    if (section.type === "experience") {
      grid.append(inputField("名称 / 单位 / 职位", item.title, (v) => item.title = v, {full: true}));
      grid.append(inputField("时间", item.period, (v) => item.period = v, {full: true}));
      grid.append(inputField("描述", item.summary, (v) => item.summary = v, {
        full: true, multiline: true, rows: 5
      }));
    }

    if (section.type === "skills") {
      card.append(inputField("技能描述", item, (v) => section.items[index] = v, {
        full: true, multiline: true, rows: 3
      }));
    } else {
      card.append(grid);
    }

    pane.append(card);
  });

  pane.append(addButton(`新增${section.title}条目`, () => {
    section.items.push(newItemForType(section.type));
    saveData();
    renderResume();
    renderSectionPane(section);
  }));
}

function rebuildDynamicTabs() {
  const tabs = document.getElementById("editor-tabs");
  const panes = clear(document.getElementById("dynamic-editor-panes"));

  // Remove previously generated dynamic tabs only.
  tabs.querySelectorAll(".editor-tab.dynamic-tab").forEach((tab) => tab.remove());

  data.sections.forEach((section) => {
    const tab = createElement("button", "editor-tab dynamic-tab", section.title);
    tab.type = "button";
    tab.dataset.editorTab = section.id;
    tab.addEventListener("click", () => switchEditorTab(section.id));
    tabs.append(tab);

    const pane = createElement("section", "editor-pane dynamic-pane");
    pane.dataset.editorPane = section.id;
    panes.append(pane);

    renderSectionPane(section);
  });
}

function renderAllEditors() {
  renderBasicsEditor();
  renderSectionsEditor();
  rebuildDynamicTabs();
}

function openEditor() {
  renderAllEditors();

  const backdrop = document.getElementById("editor-backdrop");
  const drawer = document.getElementById("editor-drawer");

  backdrop.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("editor-open");
}

function closeEditor() {
  const backdrop = document.getElementById("editor-backdrop");
  const drawer = document.getElementById("editor-drawer");

  backdrop.hidden = true;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("editor-open");
}

function switchEditorTab(name) {
  document.querySelectorAll(".editor-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.editorTab === name);
  });

  document.querySelectorAll(".editor-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.dataset.editorPane === name);
  });
}

/* =========================================================
   Import / export
   ========================================================= */

function downloadBlob(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

function downloadJson() {
  downloadBlob("resume-data.json", JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}

function downloadJs() {
  const js = `/** Generated by AI Academic Resume visual editor */\nwindow.resumeData = ${JSON.stringify(data, null, 2)};\n`;
  downloadBlob("resume-data.js", js, "text/javascript;charset=utf-8");
}

function importJson(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(reader.result);
      data = normalizeData(imported);
      saveData();
      renderResume();
      renderAllEditors();
      alert("数据已导入并保存到浏览器。");
    } catch (_) {
      alert("无法读取该 JSON 文件，请确认文件格式正确。");
    }
  });
  reader.readAsText(file, "utf-8");
}

/* =========================================================
   Actions
   ========================================================= */

function bindActions() {
  const avatarUpload = document.getElementById("avatar-upload");
  const dataImport = document.getElementById("data-import");
  const backdrop = document.getElementById("editor-backdrop");

  avatarUpload.addEventListener("change", (event) => {
    const [file] = event.currentTarget.files;
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      safeStorageSet(avatarStorageKey, reader.result);
      renderResume();
    });
    reader.readAsDataURL(file);
  });

  dataImport.addEventListener("change", (event) => {
    const [file] = event.currentTarget.files;
    if (file) importJson(file);
    event.currentTarget.value = "";
  });

  document.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener("click", openEditor);
  });

  document.querySelectorAll('[data-action="close-editor"]').forEach((button) => {
    button.addEventListener("click", closeEditor);
  });

  backdrop.addEventListener("click", closeEditor);

  // Base tabs are static; dynamic tabs are bound when created.
  document.querySelectorAll(".editor-tab:not(.dynamic-tab)").forEach((button) => {
    button.addEventListener("click", () => switchEditorTab(button.dataset.editorTab));
  });

  document.querySelectorAll('[data-action="clear-avatar"]').forEach((button) => {
    button.addEventListener("click", () => {
      safeStorageRemove(avatarStorageKey);
      avatarUpload.value = "";
      renderResume();
    });
  });

  document.querySelectorAll('[data-action="print"]').forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  document.querySelectorAll('[data-action="download-json"]').forEach((button) => {
    button.addEventListener("click", downloadJson);
  });

  document.querySelectorAll('[data-action="download-js"]').forEach((button) => {
    button.addEventListener("click", downloadJs);
  });

  document.querySelectorAll('[data-action="reset-data"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("确认恢复示例数据？当前浏览器保存的简历内容会被清除。")) return;
      data = normalizeData(defaultData);
      safeStorageRemove(dataStorageKey);
      renderResume();
      renderAllEditors();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("editor-drawer").classList.contains("open")) {
      closeEditor();
    }
  });

  window.addEventListener("resize", () => {
    clearTimeout(bindActions.resizeTimer);
    bindActions.resizeTimer = setTimeout(renderResume, 120);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderResume);
  }
}

renderResume();
bindActions();
