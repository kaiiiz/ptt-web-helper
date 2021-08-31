import { getHlBgColor, removeHlBgColor } from "./utils";
import { createBtn } from "./createEl";

function hlHover(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
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

const hlElSet = new Set<HTMLElement>(); // maintain in clickHlHandler
let focusModeOn = false;
let foldModeOn = false;

function clearHl(push: HTMLElement, color: string): void {
  push.style.backgroundColor = "";
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

function addHl(push: HTMLElement, color: string): void {
  push.style.backgroundColor = color;
  push.setAttribute("data-color", color);
  hlElSet.add(push);
  if (focusModeOn) {
    push.classList.remove("pwh-dim-bg");
  }
}

function hlClick(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  const clickHlHandler = (uidPushes: Array<HTMLElement>): void => {
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
  };

  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    const uidPushes = idElMap.get(uid);
    if (uidPushes == null) continue;
    push.addEventListener("dblclick", () => clickHlHandler(uidPushes!));
  }
}

function addFocusModeBtn(pushes: HTMLCollectionOf<HTMLElement>): void {
  const topbar = document.getElementById("topbar");
  if (topbar == null) return;

  const btn = createBtn("icons/focus.png", "focus");
  topbar.appendChild(btn.wrapper);

  btn.input.addEventListener("click", (e) => {
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
  });
}

function addFoldModeBtn(pushes: HTMLCollectionOf<HTMLElement>): void {
  const topbar = document.getElementById("topbar");
  if (topbar == null) return;

  const btn = createBtn("icons/fold.png", "fold");
  topbar.appendChild(btn.wrapper);

  btn.input.addEventListener("click", (e) => {
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
  });
}

function addClearAllHlBtn(pushes: HTMLCollectionOf<HTMLElement>): void {
  const topbar = document.getElementById("topbar");
  if (topbar == null) return;

  const btn = createBtn("icons/clear.png", "clear");
  topbar.appendChild(btn.wrapper);

  btn.input.onclick = () => {
    for (const push of hlElSet) {
      const color = push.getAttribute("data-color");
      clearHl(push, color!);
    }
    btn.input.checked = hlElSet.size > 0;
  };

  for (const push of pushes) {
    push.addEventListener("dblclick", () => {
      btn.input.checked = hlElSet.size > 0;
    });
  }
}

export { hlHover, hlClick, addFocusModeBtn, addFoldModeBtn, addClearAllHlBtn };
