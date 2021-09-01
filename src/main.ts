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

import { getIdElMap } from "./lib/utils";

import "./scss/style.scss";

const pushes = <HTMLCollectionOf<HTMLElement>>(
  document.getElementsByClassName("push")
);
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

chrome.storage.sync.get(
  [
    "addFloor",
    "peakAuthorReply",
    "alignPush",
    "showIdPushCount",
    "hideLongReplyId",
    "highlightAuthor",
    "addReplyStat",
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

    quickCopy(pushes);

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
  }
);
