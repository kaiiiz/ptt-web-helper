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

export { getFirstElByXPath, getIdElMap };
