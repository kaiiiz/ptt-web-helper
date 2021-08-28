function createFloorEl(floor: number, maxFloorDigit: number): HTMLSpanElement {
  const pad = maxFloorDigit - floor.toString().length;
  const floorSpan = document.createElement("span");
  floorSpan.textContent = `${" ".repeat(pad)}${floor}F`;
  floorSpan.classList.add("pwh-floor");
  return floorSpan;
}

function createMetaline(tag: string, value: string): HTMLDivElement {
  const metaline = document.createElement("div");
  metaline.classList.add("article-metaline");
  const metatag = document.createElement("span");
  metatag.classList.add("article-meta-tag");
  metatag.textContent = tag;
  const metaval = document.createElement("span");
  metaval.classList.add("article-meta-value");
  metaval.textContent = value;
  metaline.appendChild(metatag);
  metaline.appendChild(metaval);
  return metaline;
}

function createBtn(
  iconSrc: string,
  id: string
): { label: HTMLLabelElement; input: HTMLInputElement } {
  const input = document.createElement("input");
  input.id = `pwh_btn_${id}_input`;
  input.classList.add("pwh-hidden", "pwh-topbar-btn-input");
  input.type = "checkbox";

  const label = document.createElement("label");
  label.id = `pwh_btn_${id}_label`;
  label.classList.add("pwh-topbar-btn", "right");
  label.setAttribute("for", `pwh_btn_${id}_input`);

  const a = document.createElement("a");
  a.classList.add("pwh-topbar-icon-wrapper");

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL(iconSrc);
  img.classList.add("pwh-topbar-icon");

  a.appendChild(img);
  label.appendChild(a);
  return {
    label: label,
    input: input,
  };
}

export { createFloorEl, createMetaline, createBtn };
