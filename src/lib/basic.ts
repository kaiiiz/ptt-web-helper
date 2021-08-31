import {
  createFloorEl,
  createMetaline,
  createElevator,
  createElevatorEnt,
  createBtn,
} from "./createEl";
import { getFirstElByXPath } from "./utils";

function addFloor(pushes: HTMLCollectionOf<HTMLElement>): void {
  let floor = 1;
  const maxFloorDigits = pushes.length.toString().length;
  for (const push of pushes) {
    push.setAttribute("data-floor", `${floor}`);
    push.insertBefore(createFloorEl(floor, maxFloorDigits), push.firstChild);
    floor += 1;
  }
}

function alignPush(pushes: HTMLCollectionOf<HTMLElement>): void {
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

function hideLongReplyId(pushes: HTMLCollectionOf<HTMLElement>): void {
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

function highlightAuthor(pushes: HTMLCollectionOf<HTMLElement>): void {
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

function addReplyStat(pushes: HTMLCollectionOf<HTMLElement>): void {
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

let elevatorOn = false;

function peakAuthorReply(
  pushes: HTMLCollectionOf<HTMLElement>,
  idElMap: Map<string, Array<HTMLElement>>
): void {
  const topbar = document.getElementById("topbar");
  const main = document.getElementById("main-container");
  if (topbar == null || main == null) return;

  const btn = createBtn("icons/elevator.png", "elevator");
  topbar.appendChild(btn.wrapper);

  const elevator = createElevator();
  main.appendChild(elevator);

  btn.input.onclick = () => {
    if (elevatorOn) {
      elevator.classList.add("pwh-hidden");
    } else {
      elevator.classList.remove("pwh-hidden");
    }
    elevatorOn = !elevatorOn;
  };

  const uidClickHandler = (uid: string, targetFloor: number) => {
    // clear previous result
    while (elevator.firstChild) {
      elevator.removeChild(elevator.lastChild!);
    }

    elevator.classList.remove("pwh-hidden");
    elevatorOn = true;
    btn.input.checked = true;
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

  for (const push of pushes) {
    const uidEl = push.querySelector<HTMLElement>(".push-userid");
    const uid = uidEl?.textContent?.trim();
    const dataFloor = push.getAttribute("data-floor");
    if (uidEl == null || uid == null || dataFloor == null) continue;
    uidEl.classList.add("pwh-peak-author");
    uidEl.addEventListener("click", () => uidClickHandler(uid, +dataFloor));
  }
}

export {
  addFloor,
  alignPush,
  hideLongReplyId,
  highlightAuthor,
  addReplyStat,
  peakAuthorReply,
};
