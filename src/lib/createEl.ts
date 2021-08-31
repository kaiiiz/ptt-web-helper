function createFloorEl(floor: number, maxFloorDigit: number): HTMLSpanElement {
  const pad = maxFloorDigit - floor.toString().length;
  const floorSpan = document.createElement("span");
  floorSpan.textContent = `${" ".repeat(pad)}${floor}F`;
  floorSpan.classList.add("pwh-floor");

  const anchor = document.createElement("a");
  anchor.id = `pwh-f${floor}`;
  anchor.classList.add("pwh-floor-anchor");

  floorSpan.appendChild(anchor);
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
): {
  wrapper: HTMLDivElement;
  label: HTMLLabelElement;
  input: HTMLInputElement;
} {
  const wrapper = document.createElement("div");
  wrapper.classList.add("pwh-topbar-btn", "right");

  const input = document.createElement("input");
  input.id = `pwh_btn_${id}_input`;
  input.classList.add("pwh-hidden", "pwh-topbar-btn-input");
  input.type = "checkbox";

  const label = document.createElement("label");
  label.id = `pwh_btn_${id}_label`;
  label.classList.add("pwh-topbar-btn-label");
  label.setAttribute("for", `pwh_btn_${id}_input`);

  const a = document.createElement("a");
  a.classList.add("pwh-topbar-icon-wrapper");

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL(iconSrc);
  img.classList.add("pwh-topbar-icon");

  a.appendChild(img);
  label.appendChild(a);
  wrapper.appendChild(input);
  wrapper.appendChild(label);
  return {
    wrapper: wrapper,
    label: label,
    input: input,
  };
}

function createElevator(): HTMLDivElement {
  const elevator = document.createElement("div");
  elevator.id = "pwh-elevator";
  elevator.classList.add("bbs-content");
  elevator.classList.add("pwh-hidden");

  const entAnchor = document.createElement("a");

  const ent = document.createElement("div");
  ent.classList.add("pwh-elevator-ent");
  ent.textContent = "尚未選定任何 ID";

  entAnchor.appendChild(ent);
  elevator.appendChild(entAnchor);
  return elevator;
}

function createElevatorEnt(
  floor: number,
  floorPad: number,
  tag: string,
  author: string,
  content: string,
  ip: string
): HTMLAnchorElement {
  const entAnchor = document.createElement("a");
  entAnchor.href = `#pwh-f${floor}`;

  const ent = document.createElement("div");
  ent.classList.add("pwh-elevator-ent");

  const entFloor = document.createElement("span");
  entFloor.textContent = `${" ".repeat(floorPad)}${floor}F`;

  const entAuthor = document.createElement("span");
  entAuthor.classList.add("pwh-elevator-ent-author");
  entAuthor.textContent = author;

  const entTag = document.createElement("span");
  entTag.textContent = tag;
  entTag.classList.add("pwh-elevator-ent-tag");
  if (tag !== "推") {
    entTag.classList.add("pwh-downvote");
  }

  const entContent = document.createElement("span");
  entContent.textContent = content;

  const entIp = document.createElement("span");
  entIp.textContent = ip;
  entIp.classList.add("pwh-elevator-ent-ip");

  ent.appendChild(entFloor);
  ent.appendChild(entTag);
  ent.appendChild(entAuthor);
  ent.appendChild(entContent);
  ent.appendChild(entIp);
  entAnchor.appendChild(ent);
  return entAnchor;
}

export {
  createFloorEl,
  createMetaline,
  createBtn,
  createElevator,
  createElevatorEnt,
};
