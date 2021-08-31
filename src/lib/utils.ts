import randomColor from "randomcolor";

function getFirstElByXPath(path: string): Node | null {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function getIdElMap(
  pushes: HTMLCollectionOf<HTMLElement>
): Map<string, Array<HTMLElement>> {
  const idElMap = new Map<string, Array<HTMLElement>>();
  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;

    const idEl = idElMap.get(uid);
    if (idEl) {
      idEl.push(push);
    } else {
      idElMap.set(uid, [push]);
    }
  }
  return idElMap;
}

const hlBgColorSet = new Set();

function getHlBgColor(): string {
  const getColor = () =>
    randomColor({
      hue: "random",
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

function removeHlBgColor(color: string): void {
  hlBgColorSet.delete(color);
}

export { getFirstElByXPath, getIdElMap, getHlBgColor, removeHlBgColor };
