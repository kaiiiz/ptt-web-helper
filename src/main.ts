import {
  addFloor,
  alignPush,
  hideLongReplyId,
  highlightAuthor,
  addReplyStat,
  peakAuthorReply,
} from "./lib/basic";

import {
  hlHover,
  hlClick,
  addFoldModeBtn,
  addFocusModeBtn,
  addClearAllHlBtn,
} from "./lib/hl";

import { getIdElMap } from "./lib/utils";

import "./scss/style.scss";

const pushes = document.getElementsByClassName("push");
const idElMap = getIdElMap(pushes);

chrome.storage.sync.get(
  [
    "addFloor",
    "peakAuthorReply",
    "alignPush",
    "hideLongReplyId",
    "highlightAuthor",
    "addReplyStat",
    "hlHover",
    "hlClick",
    "addClearAllHlBtn",
    "addFoldModeBtn",
    "addFocusModeBtn",
  ],
  (items) => {
    if (items.addFloor) {
      addFloor(pushes);

      if (items.peakAuthorReply) {
        peakAuthorReply(pushes, idElMap);
      }
    }

    if (items.alignPush) {
      alignPush(pushes);
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

      if (items.addClearAllHlBtn) {
        addClearAllHlBtn(pushes);
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
