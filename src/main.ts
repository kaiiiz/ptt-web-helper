import {
  addFloor,
  alignPush,
  hideLongReplyId,
  highlightAuthor,
  addReplyStat,
  peakAuthorReply,
  addIdPushCount,
  quickCopy,
} from "./lib/basic";

import {
  hlHover,
  hlClick,
  addFoldModeBtn,
  addFocusModeBtn,
  addClearAllHlBtn,
  showHlStat,
} from "./lib/hl";

import { createHlStat, createElevator } from "./lib/createEl";

import { getPushes, getIdElMap } from "./lib/utils";

import {
  clickClearAllBtn,
  clickElevatorBtn,
  clickFocusModeBtn,
  clickFoldModeBtn,
} from "./lib/handler";

import "./scss/style.scss";

const pushes = getPushes();
const idElMap = getIdElMap(pushes);

const createSkeleton = (items: { [key: string]: boolean }) => {
  const main = document.getElementById("main-container")!;
  main.classList.add("pwh-main");

  const pwhNavContainer = document.createElement("div");
  pwhNavContainer.id = "pwh_navbar_container";

  // add navbar child
  if (items.addFloor && items.peakAuthorReply) {
    const pwhNavBar = document.createElement("div");
    pwhNavBar.id = "pwh_elevator_wrapper";
    const elevator = createElevator();
    pwhNavBar.appendChild(elevator);
    pwhNavContainer.appendChild(pwhNavBar);
  }

  if (items.hlClick && items.showHlStat) {
    const pwhNavBar = document.createElement("div");
    pwhNavBar.id = "pwh_hl_stat_wrapper";
    const hlStat = createHlStat();
    pwhNavBar.appendChild(hlStat);
    pwhNavContainer.appendChild(pwhNavBar);
  }
  document.body.insertBefore(pwhNavContainer, main);
};

const registShortcut = () => {
  const navBtn = document.querySelectorAll(".pwh-nav-btn");
  const elevator = <HTMLDivElement>document.getElementById("pwh_elevator");
  const shortcuts = ["q", "w", "e", "r"];
  const handlers: Array<() => void> = [];
  for (let i = 0; i < navBtn.length; i++) {
    const inputEl = <HTMLInputElement>navBtn[i].firstElementChild!;
    switch (inputEl.id) {
      case "pwh_btn_elevator_input":
        if (elevator) handlers.push(() => clickElevatorBtn(elevator, inputEl));
        break;
      case "pwh_btn_clear_input":
        handlers.push(() => clickClearAllBtn(inputEl));
        break;
      case "pwh_btn_fold_input":
        handlers.push(() => clickFoldModeBtn(inputEl, pushes));
        break;
      case "pwh_btn_focus_input":
        handlers.push(() => clickFocusModeBtn(inputEl, pushes));
        break;
    }
  }

  for (let i = 0; i < handlers.length; i++) {
    document.body.addEventListener("keydown", (e) => {
      if (e.key == shortcuts[i]) {
        handlers[i]();
      }
    });
  }
};

chrome.storage.sync.get(
  [
    "addFloor",
    "peakAuthorReply",
    "alignPush",
    "showIdPushCount",
    "hideLongReplyId",
    "highlightAuthor",
    "addReplyStat",
    "quickCopy",
    "hlHover",
    "hlClick",
    "showHlStat",
    "addClearAllHlBtn",
    "addFoldModeBtn",
    "addFocusModeBtn",
  ],
  (items) => {
    createSkeleton(items);

    if (items.addFloor) {
      addFloor(pushes);

      if (items.peakAuthorReply) {
        peakAuthorReply(pushes, idElMap);
      }
    }

    if (items.quickCopy) {
      quickCopy(pushes);
    }

    if (items.alignPush) {
      alignPush(pushes);
    }

    if (items.showIdPushCount) {
      addIdPushCount(idElMap);
    }

    if (items.hideLongReplyId) {
      hideLongReplyId(pushes);
    }

    if (items.highlightAuthor) {
      highlightAuthor(pushes);
    }

    if (items.addReplyStat) {
      addReplyStat(pushes);
    }

    if (items.hlHover) {
      hlHover(pushes, idElMap);
    }

    if (items.hlClick) {
      hlClick(pushes, idElMap);

      if (items.showHlStat) {
        showHlStat(pushes, idElMap);
      }

      if (items.addClearAllHlBtn) {
        addClearAllHlBtn(pushes, idElMap);
      }

      if (items.addFoldModeBtn) {
        addFoldModeBtn(pushes);
      }

      if (items.addFocusModeBtn) {
        addFocusModeBtn(pushes);
      }
    }

    registShortcut();
  }
);
