import {
  addFloor,
  alignPush,
  hideLongReplyId,
  highlightAuthor,
  addReplyStat,
} from "./lib/basic";

import {
  hlHover,
  hlClick,
  focusMode,
  foldMode,
} from "./lib/hl";

import {
  getIdElMap,
} from "./lib/utils";

let pushes = document.getElementsByClassName("push");
addFloor(pushes);
alignPush(pushes);
hideLongReplyId(pushes);
highlightAuthor(pushes);
addReplyStat(pushes);

let idElMap = getIdElMap(pushes);
hlHover(pushes, idElMap);
hlClick(pushes, idElMap);
foldMode(pushes);
focusMode(pushes);
