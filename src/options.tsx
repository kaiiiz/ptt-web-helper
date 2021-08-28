import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CSS from "csstype";

const Options = () => {
  const [addFloor, setAddFloor] = useState<boolean>(false);
  const [alignPush, setAlignPush] = useState<boolean>(false);
  const [hideLongReplyId, setHideLongReplyId] = useState<boolean>(false);
  const [highlightAuthor, setHighlightAuthor] = useState<boolean>(false);
  const [addReplyStat, setAddReplyStat] = useState<boolean>(false);
  const [hlHover, setHlHover] = useState<boolean>(false);
  const [hlClick, setHlClick] = useState<boolean>(false);
  const [addClearAllHlBtn, setAddClearAllHlBtn] = useState<boolean>(false);
  const [addFoldModeBtn, setAddFoldModeBtn] = useState<boolean>(false);
  const [addFocusModeBtn, setAddFocusModeBtn] = useState<boolean>(false);
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      [
        "addFloor",
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
        setAddFloor(items.addFloor);
        setAlignPush(items.alignPush);
        setHideLongReplyId(items.hideLongReplyId);
        setHighlightAuthor(items.highlightAuthor);
        setAddReplyStat(items.addReplyStat);
        setHlHover(items.hlHover);
        setHlClick(items.hlClick);
        setAddClearAllHlBtn(items.addClearAllHlBtn);
        setAddFoldModeBtn(items.addFoldModeBtn);
        setAddFocusModeBtn(items.addFocusModeBtn);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        addFloor: addFloor,
        alignPush: alignPush,
        hideLongReplyId: hideLongReplyId,
        highlightAuthor: highlightAuthor,
        addReplyStat: addReplyStat,
        hlHover: hlHover,
        hlClick: hlClick,
        addClearAllHlBtn: addClearAllHlBtn,
        addFoldModeBtn: addFoldModeBtn,
        addFocusModeBtn: addFocusModeBtn,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus(undefined);
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  const hlChildOptions: CSS.Properties = {
    marginLeft: "20px",
  };

  return (
    <>
      <div>
        <label>
          <input
            type="checkbox"
            checked={addFloor}
            onChange={(event) => setAddFloor(event.target.checked)}
          />
          顯示樓層
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={alignPush}
            onChange={(event) => setAlignPush(event.target.checked)}
          />
          對齊推文 ID
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={hideLongReplyId}
            onChange={(event) => setHideLongReplyId(event.target.checked)}
          />
          隱藏連續推文 ID
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={highlightAuthor}
            onChange={(event) => setHighlightAuthor(event.target.checked)}
          />
          高亮顯示作者 ID
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={addReplyStat}
            onChange={(event) => setAddReplyStat(event.target.checked)}
          />
          新增推文統計
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={hlHover}
            onChange={(event) => setHlHover(event.target.checked)}
          />
          指向推文時高亮顯示相同 ID 推文
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={hlClick}
            onChange={(event) => setHlClick(event.target.checked)}
          />
          雙擊推文時長亮顯示相同 ID 推文
        </label>

        <div style={hlChildOptions}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={addClearAllHlBtn && hlClick}
                onChange={(event) => setAddClearAllHlBtn(event.target.checked)}
                disabled={!hlClick}
              />
              新增清除所有長亮推文按鈕
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={addFocusModeBtn && hlClick}
                onChange={(event) => setAddFocusModeBtn(event.target.checked)}
                disabled={!hlClick}
              />
              新增讓非長亮推文變暗按鈕
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={addFoldModeBtn && hlClick}
                onChange={(event) => setAddFoldModeBtn(event.target.checked)}
                disabled={!hlClick}
              />
              新增折疊非長亮推文按鈕
            </label>
          </div>
        </div>
      </div>

      <div>
        <button onClick={saveOptions}>保存設定</button>
        <span>{status}</span>
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
