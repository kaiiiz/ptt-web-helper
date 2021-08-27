import { getHlBgColor, removeHlBgColor } from "./utils";
import { createBtn } from "./createEl";

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

let hlElSet = new Set<Element>(); // maintain in clickHlHandler
let focusModeOn = false;
let foldModeOn = false;

function clickHlHandler(uidPushes: Array<Element>) {
  let hasColor = false;
  let candidateColor = getHlBgColor();

  for (const uidPush of uidPushes) {
    let dataColor = uidPush.getAttribute("data-color");
    if (dataColor) {
      // remove highlight push
      (uidPush as HTMLElement).style.backgroundColor = "";
      uidPush.removeAttribute("data-color");
      hlElSet.delete(uidPush);
      removeHlBgColor(dataColor);
      hasColor = true;
      if (focusModeOn) {
        uidPush.classList.add("pwh-dim-bg");
      }
    } else {
      // highlight push
      (uidPush as HTMLElement).style.backgroundColor = candidateColor;
      uidPush.setAttribute("data-color", candidateColor);
      hlElSet.add(uidPush);
      if (focusModeOn) {
        uidPush.classList.remove("pwh-dim-bg");
      }
    }
  }

  // remove candidate color if trigger remove color logic
  if (hasColor) {
    removeHlBgColor(candidateColor);
  }
}

function clickFocusBtnHandler(e: Event, pushes: HTMLCollectionOf<Element>) {
  let isChecked = (e.target as HTMLInputElement).checked;
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
    let dimEl = document.querySelectorAll(".pwh-dim-bg");
    for (const el of dimEl) {
      el.classList.remove("pwh-dim-bg");
    }
  }
}

function clickFoldBtnHandler(e: Event, pushes: HTMLCollectionOf<Element>) {
  let isChecked = (e.target as HTMLInputElement).checked;
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
    let dimEl = document.querySelectorAll(".pwh-fold-reply");
    for (const el of dimEl) {
      el.classList.remove("pwh-fold-reply");
    }
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
    if (uidPushes == null) continue;
    push.addEventListener("dblclick", () => clickHlHandler(uidPushes!));
  }
}

function focusMode(pushes: HTMLCollectionOf<Element>) {
  let topbar = document.getElementById("topbar");
  if (topbar == null) return;

  let [label, input] = createBtn("focus.png", "focus");
  topbar.appendChild(input);
  topbar.appendChild(label);

  input.addEventListener("click", (e) => clickFocusBtnHandler(e, pushes));
}

function foldMode(pushes: HTMLCollectionOf<Element>) {
  let topbar = document.getElementById("topbar");
  if (topbar == null) return;

  let [label, input] = createBtn("fold.png", "fold");
  topbar.appendChild(input);
  topbar.appendChild(label);

  input.addEventListener("click", (e) => clickFoldBtnHandler(e, pushes));
}

export { hlHover, hlClick, focusMode, foldMode };
