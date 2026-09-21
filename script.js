const data = window.resumeData;
const avatarStorageKey = "ai-academic-resume-avatar";

const text = (value) => document.createTextNode(value ?? "");

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.append(text(content));
  return element;
}

function renderBasics() {
  document.getElementById("candidate-name").textContent = data.basics.name;
  document.getElementById("candidate-target").textContent = data.basics.intent;
  document.getElementById("candidate-summary").textContent = data.basics.summary;

  const info = [
    ["手机号码", data.basics.phone],
    ["邮箱", data.basics.email],
    ["籍贯", data.basics.hometown],
    ["出生年月", data.basics.birth],
    ["政治面貌", data.basics.political],
    ["现居地", data.basics.currentResidence]
  ];

  const container = document.getElementById("personal-info");

  info.forEach(([label, value]) => {
    const item = createElement("article", "info-item");
    item.append(createElement("strong", "", label));
    item.append(createElement("span", "", value));
    container.append(item);
  });

  const honorItem = createElement("article", "info-item info-item-wide");
  honorItem.append(createElement("strong", "", "荣誉 / 奖项"));
  honorItem.append(createElement("span", "", data.honors));
  container.append(honorItem);
}

function setAvatar(source) {
  const avatar = document.getElementById("candidate-avatar");
  const fallback = document.getElementById("avatar-fallback");

  if (!source) {
    avatar.hidden = true;
    avatar.removeAttribute("src");
    fallback.hidden = false;
    return;
  }

  avatar.src = source;
  avatar.hidden = false;
  fallback.hidden = true;
}

function renderAvatar() {
  setAvatar(localStorage.getItem(avatarStorageKey) || data.basics.avatar);
}

function renderEducation() {
  const container = document.querySelector('[data-list="education"]');

  data.education.forEach((item) => {
    const row = createElement("article", "education-item");

    const main = createElement("div", "education-main");
    main.append(createElement("h4", "", item.school));
    main.append(createElement("span", "education-major", item.major));
    row.append(main);

    const side = createElement("div", "education-side");
    side.append(createElement("strong", "", item.degree));
    side.append(createElement("time", "", item.period));
    row.append(side);

    container.append(row);
  });
}

function renderPublications() {
  document.getElementById("publication-summary").textContent = data.publicationSummary;
  const container = document.querySelector('[data-list="publications"]');

  data.publications.forEach((item, index) => {
    const article = createElement("article", "publication-card");

    const head = createElement("div", "publication-head");
    const titleWrap = createElement("div", "publication-title-wrap");
    titleWrap.append(createElement("span", "publication-index", String(index + 1).padStart(2, "0")));
    titleWrap.append(createElement("h4", "", item.title));
    head.append(titleWrap);

    const tags = createElement("div", "tag-row");
    [item.venue, item.level, item.role].forEach((tag) => {
      tags.append(createElement("span", "tag", tag));
    });
    head.append(tags);

    article.append(head);
    article.append(createElement("p", "publication-description", item.description));
    container.append(article);
  });
}

function renderOtherPublications() {
  const container = document.querySelector('[data-list="otherPublications"]');

  data.otherPublications.forEach((item, index) => {
    const article = createElement("article", "other-publication");

    const meta = createElement("div", "other-publication-meta");
    meta.append(createElement("span", "small-index", String(index + 1).padStart(2, "0")));
    meta.append(createElement("strong", "", item.venue));
    meta.append(createElement("span", "mini-tag", item.level));

    article.append(meta);
    article.append(createElement("p", "", item.title));
    container.append(article);
  });
}

function renderProjects() {
  const container = document.querySelector('[data-list="projects"]');

  data.projects.forEach((item) => {
    const article = createElement("article", "timeline-item");

    const header = createElement("header", "item-header");
    header.append(createElement("h4", "", item.title));
    header.append(createElement("time", "", item.period));

    article.append(header);
    article.append(createElement("p", "item-summary", item.summary));
    container.append(article);
  });
}

function renderSkills() {
  const container = document.querySelector('[data-list="skills"]');

  data.skills.forEach((item, index) => {
    const article = createElement("article", "skill-card");
    article.append(createElement("span", "skill-index", String(index + 1).padStart(2, "0")));
    article.append(createElement("p", "", item));
    container.append(article);
  });
}

function toMarkdown() {
  const lines = [
    `# ${data.basics.name}`,
    "",
    data.basics.intent,
    "",
    `- 手机号码：${data.basics.phone}`,
    `- 邮箱：${data.basics.email}`,
    `- 籍贯：${data.basics.hometown}`,
    `- 出生年月：${data.basics.birth}`,
    `- 政治面貌：${data.basics.political}`,
    `- 现居地：${data.basics.currentResidence}`,
    `- 荣誉 / 奖项：${data.honors}`,
    "",
    "## 教育经历"
  ];

  data.education.forEach((item) => {
    lines.push(`- ${item.school}｜${item.major}｜${item.degree}｜${item.period}`);
  });

  lines.push("", "## 主要论文", "", data.publicationSummary);

  data.publications.forEach((item, index) => {
    lines.push(
      "",
      `### ${index + 1}. ${item.title}`,
      `${item.venue} · ${item.level} · ${item.role}`,
      "",
      item.description
    );
  });

  lines.push("", "## 其他论文");
  data.otherPublications.forEach((item, index) => {
    lines.push(`- ${index + 1}. ${item.venue} · ${item.level} — ${item.title}`);
  });

  lines.push("", "## 项目经历");
  data.projects.forEach((item) => {
    lines.push("", `### ${item.title}`, `时间：${item.period}`, "", item.summary);
  });

  lines.push("", "## 专业技能");
  data.skills.forEach((item) => lines.push(`- ${item}`));

  return lines.join("\n");
}

async function copyToClipboard(value, button) {
  try {
    await navigator.clipboard.writeText(value);
    const original = button.textContent;
    button.textContent = "已复制";
    setTimeout(() => {
      button.textContent = original;
    }, 1400);
  } catch (error) {
    alert("浏览器未允许自动复制，请手动复制。");
  }
}

function bindActions() {
  document.getElementById("avatar-upload").addEventListener("change", (event) => {
    const [file] = event.currentTarget.files;
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      localStorage.setItem(avatarStorageKey, reader.result);
      setAvatar(reader.result);
    });
    reader.readAsDataURL(file);
  });

  document.querySelector('[data-action="clear-avatar"]').addEventListener("click", () => {
    localStorage.removeItem(avatarStorageKey);
    document.getElementById("avatar-upload").value = "";
    setAvatar("");
  });

  document.querySelector('[data-action="print"]').addEventListener("click", () => window.print());

  document.querySelector('[data-action="copy-markdown"]').addEventListener("click", (event) => {
    copyToClipboard(toMarkdown(), event.currentTarget);
  });

  document.querySelector('[data-action="copy-json"]').addEventListener("click", (event) => {
    copyToClipboard(JSON.stringify(data, null, 2), event.currentTarget);
  });
}

renderBasics();
renderAvatar();
renderEducation();
renderPublications();
renderOtherPublications();
renderProjects();
renderSkills();
bindActions();
