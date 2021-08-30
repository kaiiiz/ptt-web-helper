import { getHlBgColor, removeHlBgColor } from "./utils";
import { createBtn } from "./createEl";

function hlHover(
  pushes: HTMLCollectionOf<Element>,
  idElMap: Map<string, Array<Element>>
): void {
  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    const uidPushes = idElMap.get(uid);

    const mouseEnterHandler = () => {
      if (uidPushes == null) return;
      for (const uidPush of uidPushes) {
        uidPush.classList.add("pwh-hl-hover");
      }
    };
    const mouseLeaveHandler = () => {
      if (uidPushes == null) return;
      for (const uidPush of uidPushes) {
        uidPush.classList.remove("pwh-hl-hover");
      }
    };
    push.addEventListener("mouseenter", mouseEnterHandler);
    push.addEventListener("mouseleave", mouseLeaveHandler);
  }
}

const hlElSet = new Set<Element>(); // maintain in clickHlHandler
let focusModeOn = false;
let foldModeOn = false;

function clearHl(push: Element, color: string): void {
  (push as HTMLElement).style.backgroundColor = "";
  push.removeAttribute("data-color");
  hlElSet.delete(push);
  if (focusModeOn) {
    push.classList.add("pwh-dim-bg");
  }
  if (foldModeOn) {
    push.classList.add("pwh-fold-reply");
  }
  removeHlBgColor(color);
}

function addHl(push: Element, color: string): void {
  (push as HTMLElement).style.backgroundColor = color;
  push.setAttribute("data-color", color);
  hlElSet.add(push);
  if (focusModeOn) {
    push.classList.remove("pwh-dim-bg");
  }
}

function clickHlHandler(uidPushes: Array<Element>): void {
  let hasColor = false;
  const candidateColor = getHlBgColor();

  for (const uidPush of uidPushes) {
    const dataColor = uidPush.getAttribute("data-color");
    if (dataColor) {
      // remove highlight push
      clearHl(uidPush, dataColor);
      hasColor = true;
    } else {
      // highlight push
      addHl(uidPush, candidateColor);
    }
  }

  // remove candidate color if trigger remove color logic
  if (hasColor) {
    removeHlBgColor(candidateColor);
  }
}

function clickFocusBtnHandler(
  e: Event,
  pushes: HTMLCollectionOf<Element>
): void {
  const isChecked = (e.target as HTMLInputElement).checked;
  if (isChecked) {
    // dim non highlight reply
    focusModeOn = true;
    for (const push of pushes) {
      if (!hlElSet.has(push)) {
        push.classList.add("pwh-dim-bg");
      }
    }
  } else {
    // remove dim
    focusModeOn = false;
    const dimEl = document.querySelectorAll(".pwh-dim-bg");
    for (const el of dimEl) {
      el.classList.remove("pwh-dim-bg");
    }
  }
}

function clickFoldBtnHandler(
  e: Event,
  pushes: HTMLCollectionOf<Element>
): void {
  const isChecked = (e.target as HTMLInputElement).checked;
  if (isChecked) {
    // fold non highlight reply
    foldModeOn = true;
    for (const push of pushes) {
      if (!hlElSet.has(push)) {
        push.classList.add("pwh-fold-reply");
      }
    }
  } else {
    // remove fold
    foldModeOn = false;
    const dimEl = document.querySelectorAll(".pwh-fold-reply");
    for (const el of dimEl) {
      el.classList.remove("pwh-fold-reply");
    }
  }
}

function clickClearAllHlBtnHandler(): void {
  for (const push of hlElSet) {
    const color = push.getAttribute("data-color");
    clearHl(push, color!);
  }
}

function hlClick(
  pushes: HTMLCollectionOf<Element>,
  idElMap: Map<string, Array<Element>>
): void {
  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    const uidPushes = idElMap.get(uid);
    if (uidPushes == null) continue;
    push.addEventListener("dblclick", () => clickHlHandler(uidPushes!));
  }
}

function addFocusModeBtn(pushes: HTMLCollectionOf<Element>): void {
  const topbar = document.getElementById("topbar");
  if (topbar == null) return;

  const btn = createBtn("icons/focus.png", "focus");
  topbar.appendChild(btn.input);
  topbar.appendChild(btn.label);

  btn.input.addEventListener("click", (e) => clickFocusBtnHandler(e, pushes));
}

function addFoldModeBtn(pushes: HTMLCollectionOf<Element>): void {
  const topbar = document.getElementById("topbar");
  if (topbar == null) return;

  const btn = createBtn("icons/fold.png", "fold");
  topbar.appendChild(btn.input);
  topbar.appendChild(btn.label);

  btn.input.addEventListener("click", (e) => clickFoldBtnHandler(e, pushes));
}

function addClearAllHlBtn(): void {
  const topbar = document.getElementById("topbar");
  if (topbar == null) return;

  const btn = createBtn("icons/clear.png", "clear");
  topbar.appendChild(btn.label);

  btn.label.addEventListener("click", () => clickClearAllHlBtnHandler());
}

export { hlHover, hlClick, addFocusModeBtn, addFoldModeBtn, addClearAllHlBtn };
