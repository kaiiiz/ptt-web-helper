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

const hlBgColorSet = new Set<string>();

function getHlBgColor(): string {
  const getColor = () =>
    randomColor({
      hue: "random",
      luminosity: "dark",
      format: "rgba",
      alpha: 0.45,
    });

  const parseColor = (color: string): Array<number> => {
    return color
      .replace("rgba(", "")
      .replace(")", "")
      .split(",")
      .map((x) => parseFloat(x));
  };

  const minSimilarity = (rgba: Array<number>): number => {
    let minSim = Number.MAX_VALUE;
    for (const prevColor of hlBgColorSet) {
      let distance = 0.0;
      const prevRgba = parseColor(prevColor);
      for (let i = 0; i < 3; i++) {
        distance += Math.pow(rgba[i] - prevRgba[i], 2);
      }
      minSim = Math.min(minSim, distance);
    }
    return minSim;
  };

  let color = getColor();
  let rgba = parseColor(color);
  let retry = 0;

  while (minSimilarity(rgba) < 5000 && retry < 100) {
    color = getColor();
    rgba = parseColor(color);
    retry += 1;
  }
  hlBgColorSet.add(color);
  return color;
}

function removeHlBgColor(color: string): void {
  hlBgColorSet.delete(color);
}

export { getFirstElByXPath, getIdElMap, getHlBgColor, removeHlBgColor };
