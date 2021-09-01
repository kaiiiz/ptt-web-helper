import { createBtn, createHlStat } from "./createEl";
import {
  updateClearAllBtn,
  clickClearAllBtn,
  mouseEnterPush,
  mouseLeavePush,
  dblclickPush,
  clickFocusModeBtn,
  clickFoldModeBtn,
  updateHlStat,
} from "./handler";

const hlIdMap = new Map<string, { el: Set<HTMLElement>; color: string }>();

function hlHover(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    const uidPushes = idElMap.get(uid);
    if (uidPushes == null) continue;

    push.addEventListener("mouseenter", () => mouseEnterPush(uidPushes));
    push.addEventListener("mouseleave", () => mouseLeavePush(uidPushes));
  }
}

function hlClick(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    const uidPushes = idElMap.get(uid);
    if (uidPushes == null) continue;

    push.addEventListener("dblclick", () => dblclickPush(uidPushes));
  }
}

function addFocusModeBtn(pushes: HTMLCollectionOf<HTMLElement>): void {
  const navigation = document.getElementById("navigation");
  if (navigation == null) return;

  const btn = createBtn("icons/focus.png", "focus");
  navigation.appendChild(btn.wrapper);

  btn.input.addEventListener("click", (e) =>
    clickFocusModeBtn(e.target as HTMLInputElement, pushes)
  );
}

function addFoldModeBtn(pushes: HTMLCollectionOf<HTMLElement>): void {
  const navigation = document.getElementById("navigation");
  if (navigation == null) return;

  const btn = createBtn("icons/fold.png", "fold");
  navigation.appendChild(btn.wrapper);

  btn.input.addEventListener("click", (e) =>
    clickFoldModeBtn(e.target as HTMLInputElement, pushes)
  );
}

function addClearAllHlBtn(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  const navigation = document.getElementById("navigation");
  if (navigation == null) return;

  const btn = createBtn("icons/clear.png", "clear");
  navigation.appendChild(btn.wrapper);

  btn.input.addEventListener("click", () => clickClearAllBtn(btn.input));

  const hlStat = <HTMLDivElement>document.getElementById("pwh_hl_stat");
  if (hlStat) {
    btn.input.addEventListener("click", () => updateHlStat(hlStat, idElMap));
  }

  for (const push of pushes) {
    push.addEventListener("dblclick", () => updateClearAllBtn(btn.input));
  }
}

function showHlStat(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  const hlStat = <HTMLDivElement>document.getElementById("pwh_hl_stat")!;
  for (const push of pushes) {
    push.addEventListener("dblclick", () => updateHlStat(hlStat, idElMap));
  }
}

export {
  hlIdMap,
  hlHover,
  hlClick,
  addFocusModeBtn,
  addFoldModeBtn,
  addClearAllHlBtn,
  showHlStat,
};
