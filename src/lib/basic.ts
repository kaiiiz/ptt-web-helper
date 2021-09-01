import {
  createFloorEl,
  createMetaline,
  createBtn,
  createPushCount,
} from "./createEl";
import { getFirstElByXPath } from "./utils";
import { updateElevator, clickElevatorBtn, keydownCopy } from "./handler";

function addFloor(pushes: Array<HTMLElement>): void {
  let floor = 1;
  const maxFloorDigits = pushes.length.toString().length;
  for (const push of pushes) {
    push.setAttribute("data-floor", `${floor}`);
    push.insertBefore(createFloorEl(floor, maxFloorDigits), push.firstChild);
    floor += 1;
  }
}

function alignPush(pushes: Array<HTMLElement>): void {
  let maxUidLen = 0;
  for (const push of pushes) {
    const uidEl = push.querySelector(".push-userid");
    const uid = uidEl?.textContent?.trim();
    if (uidEl == null || uid == null) continue;
    maxUidLen = Math.max(maxUidLen, uid.length);
    uidEl.textContent = uid; // trim padding if possible
  }

  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    const contentEl = push.querySelector(".push-content");
    if (uid == null || contentEl == null) continue;
    const padding = maxUidLen - uid.length;
    contentEl.textContent = `${" ".repeat(padding)}${contentEl.textContent}`;
  }
}

function hideLongReplyId(pushes: Array<HTMLElement>): void {
  let prevUid = "";
  for (const push of pushes) {
    const uidEl = push.querySelector(".push-userid");
    if (uidEl == null) continue;
    const uid = uidEl.textContent?.trim();
    if (prevUid == uid) {
      uidEl.classList.add("pwh-cont-user");
    }
    prevUid = uid ? uid : "";
  }
}

function highlightAuthor(pushes: Array<HTMLElement>): void {
  // get author metadata
  const authorEl = getFirstElByXPath(
    "//div[@class='article-metaline']/span[text()='作者']"
  )?.parentNode?.querySelector(".article-meta-value");
  if (authorEl == null) {
    return;
  }

  // extract author id
  const author = authorEl.textContent?.split("(")[0].trim();

  // highlight author reply
  for (const push of pushes) {
    const uidEl = push.querySelector(".push-userid");
    if (uidEl == null) continue;
    const uid = uidEl.textContent?.trim();
    if (uid == author) {
      uidEl.classList.add("pwh-author");
    }
  }
}

function addReplyStat(pushes: Array<HTMLElement>): void {
  const idStat = new Map();
  for (const push of pushes) {
    const uid = push.querySelector(".push-userid")?.textContent?.trim();
    const tag = push.querySelector(".push-tag")?.textContent?.trim();
    if (uid == null || tag == null) continue;
    const score = tag == "推" ? 1 : tag == "噓" ? -1 : 0;
    if (idStat.has(uid)) {
      idStat.set(uid, idStat.get(uid) + score);
    } else {
      idStat.set(uid, score);
    }
  }

  const people = idStat.size;
  const stat = Array.from(idStat.values());
  const upvote = stat.filter((v) => v > 0).length;
  const arrow = stat.filter((v) => v == 0).length;
  const downvote = stat.filter((v) => v < 0).length;

  const peopleMetaline = createMetaline("回應", `${people}`);
  const voteMetaline = createMetaline(
    "推噓",
    `推：${upvote} →：${arrow} 噓：${downvote} 總和：${upvote - downvote}`
  );

  // insert to last metaline if possible
  const metalines = document.getElementsByClassName("article-metaline");
  const main = document.getElementById("main-content");
  if (main == null) return;

  const afterVoteMetaline =
    metalines.length > 0
      ? metalines[metalines.length - 1].nextSibling
      : main.firstChild;
  main.insertBefore(voteMetaline, afterVoteMetaline);
  main.insertBefore(peopleMetaline, voteMetaline);
}

function peakAuthorReply(
  pushes: Array<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  const navigation = document.getElementById("navigation");
  const main = document.getElementById("main-container");
  if (navigation == null || main == null) return;

  const btn = createBtn("icons/elevator.png", "elevator");
  navigation.appendChild(btn.wrapper);

  const elevator = <HTMLDivElement>document.getElementById("pwh_elevator")!;
  const elevatorInput = <HTMLInputElement>(
    document.getElementById("pwh_btn_elevator_input")
  );

  btn.input.addEventListener("click", () =>
    clickElevatorBtn(elevator, elevatorInput)
  );
  document.body.addEventListener("keydown", (e) => {
    if (e.key == "e") {
      clickElevatorBtn(elevator, elevatorInput);
    }
  });

  for (const push of pushes) {
    const uidEl = push.querySelector<HTMLElement>(".push-userid");
    const uid = uidEl?.textContent?.trim();
    const dataFloor = push.getAttribute("data-floor");
    if (uidEl == null || uid == null || dataFloor == null) continue;
    uidEl.classList.add("pwh-peak-author");
    uidEl.addEventListener("click", () => {
      elevatorInput.checked = true;
      updateElevator(idElMap, elevator, btn.input, uid, +dataFloor);
    });
  }
}

function addIdPushCount(idElMap: Map<string, Array<HTMLElement>>): void {
  for (const uidPushes of idElMap.values()) {
    const total = uidPushes.length;
    for (let i = 0; i < total; i++) {
      const pushCount = createPushCount(i + 1, total);
      uidPushes[i].appendChild(pushCount);
      uidPushes[i].addEventListener("mouseenter", () => {
        pushCount.classList.remove("pwh-hidden");
      });
      uidPushes[i].addEventListener("mouseleave", () => {
        pushCount.classList.add("pwh-hidden");
      });
    }
  }
}

function quickCopy(pushes: Array<HTMLElement>): void {
  for (let i = 0; i < pushes.length; i++) {
    const push = pushes[i];
    push.tabIndex = 0;
    push.addEventListener("keydown", (e) => {
      if (e.key == "y") {
        keydownCopy(e.target as HTMLElement, i, pushes);
      }
    });
  }
}

export {
  addFloor,
  alignPush,
  hideLongReplyId,
  highlightAuthor,
  addReplyStat,
  peakAuthorReply,
  addIdPushCount,
  quickCopy,
};
