function hlHover(
  pushes: HTMLCollectionOf<Element>,
  idElMap: Map<string, Array<Element>>
) {
  for (const push of pushes) {
    let uid = push.querySelector(".push-userid")?.textContent?.trim();
    if (uid == null) continue;
    let uidPushes = idElMap.get(uid);

    let mouseEnterHandler = (_: Event) => {
      if (uidPushes == null) return;
      for (const uidPush of uidPushes) {
        uidPush.classList.add("pwh-hl-hover");
      }
    };
    let mouseLeaveHandler = (_: Event) => {
      if (uidPushes == null) return;
      for (const uidPush of uidPushes) {
        uidPush.classList.remove("pwh-hl-hover");
      }
    };
    push.addEventListener("mouseenter", mouseEnterHandler);
    push.addEventListener("mouseleave", mouseLeaveHandler);
  }
}

export { hlHover };
