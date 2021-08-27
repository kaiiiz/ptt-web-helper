import randomColor from "randomcolor";

function getFirstElByXPath(path: string) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function getIdElMap(
  pushes: HTMLCollectionOf<Element>
): Map<string, Array<Element>> {
  let idElMap = new Map<string, Array<Element>>();
  for (const push of pushes) {
    let uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;

    let idEl = idElMap.get(uid);
    if (idEl) {
      idEl.push(push);
    } else {
      idElMap.set(uid, [push]);
    }
  }
  return idElMap;
}

let hlBgColorSet = new Set();

function getHlBgColor() {
  let getColor = () =>
    randomColor({
      hue: 'random',
      luminosity: "dark",
      format: "rgba",
      alpha: 0.45,
    });
  let color = getColor();
  while (hlBgColorSet.has(color)) {
    color = getColor();
  }
  hlBgColorSet.add(color);
  return color;
}

function removeHlBgColor(color: string) {
  hlBgColorSet.delete(color);
}

export { getFirstElByXPath, getIdElMap, getHlBgColor, removeHlBgColor };
