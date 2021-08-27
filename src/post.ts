import {
  addFloor,
  alignPush,
  hideLongReplyId,
  highlightAuthor,
  addReplyStat,
} from "./lib/basic";

let pushes = document.getElementsByClassName("push");
addFloor(pushes);
alignPush(pushes);
hideLongReplyId(pushes);
highlightAuthor(pushes);
addReplyStat(pushes);
