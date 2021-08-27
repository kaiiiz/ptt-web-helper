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

export { createFloorEl, createMetaline };
