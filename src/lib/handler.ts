import { hlIdMap } from "./hl";
import { getHlBgColor, removeHlBgColor } from "./utils";
import { createHlStatEnt, createElevatorEnt } from "./createEl";

let enableFocusMode = false;
let enableFoldMode = false;
let enableElevator = false;

const updateClearAllBtn = (btnInput: HTMLInputElement): void => {
  btnInput.checked = hlIdMap.size > 0;
};

const clickClearAllBtn = (btnInput: HTMLInputElement): void => {
  // clear all highlight
  for (const [uid, hlId] of hlIdMap) {
    for (const push of hlId.el) {
      clearHl(push, uid, hlId.color);
    }
  }

  // update hl stat modal
  const hlStat = <HTMLDivElement>document.getElementById("pwh_hl_stat");
  if (hlStat) {
    updateHlStat(hlStat);
  }

  // update clear all button status
  updateClearAllBtn(btnInput);
};

const mouseEnterPush = (uidPushes: Array<HTMLElement>): void => {
  for (const uidPush of uidPushes) {
    uidPush.classList.add("pwh-hl-hover");
  }
};

const mouseLeavePush = (uidPushes: Array<HTMLElement>): void => {
  for (const uidPush of uidPushes) {
    uidPush.classList.remove("pwh-hl-hover");
  }
};

const dblclickPush = (uidPushes: Array<HTMLElement>): void => {
  let hasColor = false;
  const candidateColor = getHlBgColor();

  for (const uidPush of uidPushes) {
    const dataColor = uidPush.getAttribute("data-color");
    const uid = uidPush.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    if (dataColor) {
      // remove highlight push
      clearHl(uidPush, uid, dataColor);
      hasColor = true;
    } else {
      // highlight push
      addHl(uidPush, uid, candidateColor);
    }
  }

  // remove candidate color if trigger remove color logic
  if (hasColor) {
    removeHlBgColor(candidateColor);
  }
};

const clickFocusModeBtn = (
  btnInput: HTMLInputElement,
  pushes: HTMLCollectionOf<HTMLElement>
): void => {
  if (btnInput.checked) {
    // dim non highlight reply
    enableFocusMode = true;
    for (const push of pushes) {
      const uid = push.querySelector(".push-userid")?.textContent?.trim();
      if (uid == null) continue;
      if (!hlIdMap.has(uid)) {
        push.classList.add("pwh-dim-bg");
      }
    }
  } else {
    // remove dim
    enableFocusMode = false;
    const dimEl = document.querySelectorAll(".pwh-dim-bg");
    for (const el of dimEl) {
      el.classList.remove("pwh-dim-bg");
    }
  }
};

const clickFoldModeBtn = (
  btnInput: HTMLInputElement,
  pushes: HTMLCollectionOf<HTMLElement>
): void => {
  if (btnInput.checked) {
    // fold non highlight reply
    enableFoldMode = true;
    for (const push of pushes) {
      const uid = push.querySelector(".push-userid")?.textContent?.trim();
      if (uid == null) continue;
      if (!hlIdMap.has(uid)) {
        push.classList.add("pwh-fold-reply");
      }
    }
  } else {
    // remove fold
    enableFoldMode = false;
    const dimEl = document.querySelectorAll(".pwh-fold-reply");
    for (const el of dimEl) {
      el.classList.remove("pwh-fold-reply");
    }
  }
};

const clickElevatorBtn = (elevator: HTMLDivElement): void => {
  if (enableElevator) {
    elevator.classList.add("pwh-hidden");
  } else {
    elevator.classList.remove("pwh-hidden");
  }
  enableElevator = !enableElevator;
};

const updateHlStat = (hlStat: HTMLDivElement): void => {
  // clear previous result
  while (hlStat.firstChild) {
    hlStat.removeChild(hlStat.lastChild!);
  }

  for (const [uid, hlId] of hlIdMap.entries()) {
    hlStat.appendChild(createHlStatEnt(uid, hlId.color));
  }
};

const updatePeak = (
  idElMap: Map<string, Array<HTMLElement>>,
  elevator: HTMLDivElement,
  elevatorInput: HTMLInputElement,
  uid: string,
  targetFloor: number
): void => {
  // clear previous result
  while (elevator.firstChild) {
    elevator.removeChild(elevator.lastChild!);
  }

  elevator.classList.remove("pwh-hidden");
  enableElevator = true;
  elevatorInput.checked = true;
  const uidPushes = idElMap.get(uid)!;

  // calculate floor padding
  let uidMaxFloorDigits = 0;
  for (const uidPush of uidPushes) {
    const dataFloor = uidPush.getAttribute("data-floor");
    if (dataFloor == null) continue;
    uidMaxFloorDigits = Math.max(uidMaxFloorDigits, dataFloor.length);
  }

  let targetScrollPos = 0;
  for (const uidPush of uidPushes) {
    const dataFloor = uidPush.getAttribute("data-floor");
    const tag = uidPush.querySelector(".push-tag")?.textContent?.trim();
    const text = uidPush.querySelector(".push-content")?.textContent?.trim();
    const ip = uidPush.querySelector(".push-ipdatetime")?.textContent?.trim();
    if (dataFloor == null || tag == null || text == null || ip == null) {
      continue;
    }

    const ent = createElevatorEnt(
      +dataFloor,
      uidMaxFloorDigits - dataFloor.length,
      tag,
      uid,
      text,
      ip
    );
    elevator.appendChild(ent);

    if (+dataFloor == targetFloor) {
      targetScrollPos = ent.offsetTop;
    }
  }
  elevator.scrollTop = targetScrollPos;
};

export {
  updateClearAllBtn,
  clickClearAllBtn,
  mouseEnterPush,
  mouseLeavePush,
  dblclickPush,
  clickFocusModeBtn,
  clickFoldModeBtn,
  clickElevatorBtn,
  updateHlStat,
  updatePeak,
};

// helper function

function clearHl(push: HTMLElement, uid: string, color: string): void {
  push.style.backgroundColor = "";
  push.removeAttribute("data-color");
  hlIdMap.delete(uid);
  if (enableFocusMode) {
    push.classList.add("pwh-dim-bg");
  }
  if (enableFoldMode) {
    push.classList.add("pwh-fold-reply");
  }
  removeHlBgColor(color);
}

function addHl(push: HTMLElement, uid: string, color: string): void {
  push.style.backgroundColor = color;
  push.setAttribute("data-color", color);

  const hlId = hlIdMap.get(uid);
  if (hlId) {
    hlId.el.add(push);
  } else {
    hlIdMap.set(uid, { el: new Set([push]), color: color });
  }

  if (enableFocusMode) {
    push.classList.remove("pwh-dim-bg");
  }
}
