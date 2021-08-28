chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    addFloor: true,
    alignPush: true,
    hideLongReplyId: true,
    highlightAuthor: true,
    addReplyStat: true,
    hlHover: true,
    hlClick: true,
    addClearAllHlBtn: true,
    addFoldModeBtn: true,
    addFocusModeBtn: true,
  });
});
