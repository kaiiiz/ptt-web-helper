import { getHlBgColor, removeHlBgColor } from "./utils";

function hlHover(
  pushes: HTMLCollectionOf<Element>,
  idElMap: Map<string, Array<Element>>
) {
  for (const push of pushes) {
    let uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    let uidPushes = idElMap.get(uid);

    let mouseEnterHandler = (_: Event) => {
      if (uidPushes == null) return;
      for (const uidPush of uidPushes) {
        uidPush.classList.add("pwh-hl-hover");
      }
    };
    let mouseLeaveHandler = (_: Event) => {
      if (uidPushes == null) return;
      for (const uidPush of uidPushes) {
        uidPush.classList.remove("pwh-hl-hover");
      }
    };
    push.addEventListener("mouseenter", mouseEnterHandler);
    push.addEventListener("mouseleave", mouseLeaveHandler);
  }
}

function hlClick(
  pushes: HTMLCollectionOf<Element>,
  idElMap: Map<string, Array<Element>>
) {
  for (const push of pushes) {
    let uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    let uidPushes = idElMap.get(uid);

    let clickHandler = (_: Event) => {
      if (uidPushes == null) return;
      let hasColor = false;
      let candidateColor = getHlBgColor();

      for (const uidPush of uidPushes) {
        let dataColor = uidPush.getAttribute("data-color");
        if (dataColor) {
          (uidPush as HTMLElement).style.backgroundColor = "";
          uidPush.removeAttribute("data-color");
          removeHlBgColor(dataColor);
          hasColor = true;
        } else {
          (uidPush as HTMLElement).style.backgroundColor = candidateColor;
          uidPush.setAttribute("data-color", candidateColor);
        }
      }

      // remove candidate color if trigger remove color logic
      if (hasColor) {
        removeHlBgColor(candidateColor);
      }
    };
    push.addEventListener("click", clickHandler);
  }
}

export { hlHover, hlClick };
