chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    addFloor: true,
    peakAuthorReply: true,
    alignPush: true,
    showIdPushCount: true,
    hideLongReplyId: true,
    highlightAuthor: true,
    addReplyStat: true,
    hlHover: true,
    hlClick: true,
    showHlStat: true,
    addClearAllHlBtn: true,
    addFoldModeBtn: true,
    addFocusModeBtn: true,
  });
});
