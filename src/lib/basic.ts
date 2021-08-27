import { createFloorEl, createMetaline } from "./createEl";
import { getFirstElByXPath } from "./utils";

function addFloor(pushes: HTMLCollectionOf<Element>) {
  let floor = 1;
  let maxFloorDigits = pushes.length.toString().length;
  for (const push of pushes) {
    push.insertBefore(createFloorEl(floor, maxFloorDigits), push.firstChild);
    floor += 1;
  }
}

function alignPush(pushes: HTMLCollectionOf<Element>) {
  let maxUidLen = 0;
  for (const push of pushes) {
    let uidEl = push.querySelector(".push-userid");
    let uid = uidEl?.textContent?.trim();
    if (uidEl == null || uid == null) continue;
    maxUidLen = Math.max(maxUidLen, uid.length);
    uidEl.textContent = uid; // trim padding if possible
  }

  for (const push of pushes) {
    let uid = push.querySelector(".push-userid")?.textContent?.trim();
    let contentEl = push.querySelector(".push-content");
    if (uid == null || contentEl == null) continue;
    let padding = maxUidLen - uid.length;
    contentEl.textContent = `${" ".repeat(padding)}${contentEl.textContent}`;
  }
}

function hideLongReplyId(pushes: HTMLCollectionOf<Element>) {
  let prevUid = "";
  for (const push of pushes) {
    let uidEl = push.querySelector(".push-userid");
    if (uidEl == null) continue;
    let uid = uidEl.textContent?.trim();
    if (prevUid == uid) {
      uidEl!.classList.add("pwh-cont-user");
    }
    prevUid = uid ? uid : "";
  }
}

function highlightAuthor(pushes: HTMLCollectionOf<Element>) {
  // get author metadata
  let authorEl = getFirstElByXPath(
    "//div[@class='article-metaline']/span[text()='作者']"
  )?.parentNode?.querySelector(".article-meta-value");
  if (authorEl == null) {
    return;
  }

  // extract author id
  let author = authorEl.textContent?.split("(")[0].trim();

  // highlight author reply
  for (const push of pushes) {
    let uidEl = push.querySelector(".push-userid");
    if (uidEl == null) continue;
    let uid = uidEl.textContent?.trim();
    if (uid == author) {
      uidEl!.classList.add("pwh-author");
    }
  }
}

function addReplyStat(pushes: HTMLCollectionOf<Element>) {
  let idStat = new Map();
  for (const push of pushes) {
    let uid = push.querySelector(".push-userid")?.textContent?.trim();
    let tag = push.querySelector(".push-tag")?.textContent?.trim();
    if (uid == null || tag == null) continue;
    let score = tag == "推" ? 1 : tag == "噓" ? -1 : 0;
    if (idStat.has(uid)) {
      idStat.set(uid, idStat.get(uid) + score);
    } else {
      idStat.set(uid, score);
    }
  }

  let people = idStat.size;
  let stat = Array.from(idStat.values());
  let upvote = stat.filter((v) => v > 0).length;
  let arrow = stat.filter((v) => v == 0).length;
  let downvote = stat.filter((v) => v < 0).length;

  let peopleMetaline = createMetaline("回應", `${people}`);
  let voteMetaline = createMetaline(
    "推噓",
    `推：${upvote} →：${arrow} 噓：${downvote} 總和：${upvote - downvote}`
  );

  // insert to last metaline if possible
  let metalines = document.getElementsByClassName("article-metaline");
  let main = document.getElementById("main-content");
  if (main == null) return;

  let afterVoteMetaline =
    metalines.length > 0
      ? metalines[metalines.length - 1].nextSibling
      : main.firstChild;
  main.insertBefore(voteMetaline, afterVoteMetaline);
  main.insertBefore(peopleMetaline, voteMetaline);
}

export { addFloor, alignPush, hideLongReplyId, highlightAuthor, addReplyStat };
