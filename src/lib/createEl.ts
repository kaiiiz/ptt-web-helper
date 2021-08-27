function createFloorEl(floor: number, maxFloorDigit: number) {
  let pad = maxFloorDigit - floor.toString().length;
  let floorSpan = document.createElement("span");
  floorSpan.textContent = `${" ".repeat(pad)}${floor}F`;
  floorSpan.classList.add("pwh-floor");
  return floorSpan;
}

function createMetaline(tag: string, value: string) {
  let metaline = document.createElement("div");
  metaline.classList.add("article-metaline");
  let metatag = document.createElement("span");
  metatag.classList.add("article-meta-tag");
  metatag.textContent = tag;
  let metaval = document.createElement("span");
  metaval.classList.add("article-meta-value");
  metaval.textContent = value;
  metaline.appendChild(metatag);
  metaline.appendChild(metaval);
  return metaline;
}

function createBtn(iconSrc: string, id: string) {
  let input = document.createElement("input");
  input.id = `pwh_btn_${id}_input`
  input.classList.add("pwh-hidden", "pwh-topbar-btn-input");
  input.type = "checkbox";

  let label = document.createElement("label");
  label.id = `pwh_btn_${id}_label`
  label.classList.add("pwh-topbar-btn", "right");
  label.setAttribute("for", `pwh_btn_${id}_input`);

  let a = document.createElement("a");
  a.classList.add("pwh-topbar-icon-wrapper");

  let img = document.createElement("img");
  img.src = chrome.extension.getURL(iconSrc);
  img.classList.add("pwh-topbar-icon");

  a.appendChild(img);
  label.appendChild(a);
  return [label, input];
}

export { createFloorEl, createMetaline, createBtn };
