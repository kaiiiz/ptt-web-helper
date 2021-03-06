import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CSS from "csstype";

interface OptionProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  text: string;
  disabled?: boolean;
}

const hlChildOptions: CSS.Properties = {
  marginLeft: "20px",
};

const Option = (props: OptionProps) => {
  return (
    <>
      <div>
        <label>
          <input
            type="checkbox"
            checked={props.checked}
            onChange={props.onChange}
            disabled={props.disabled ? props.disabled : false}
          />
          {props.text}
        </label>
      </div>
    </>
  );
};

const Options = () => {
  const [addFloor, setAddFloor] = useState<boolean>(false);
  const [peakAuthorReply, setPeakAuthorReply] = useState<boolean>(false);
  const [alignPush, setAlignPush] = useState<boolean>(false);
  const [showIdPushCount, setShowIdPushCount] = useState<boolean>(false);
  const [hideLongReplyId, setHideLongReplyId] = useState<boolean>(false);
  const [highlightAuthor, setHighlightAuthor] = useState<boolean>(false);
  const [addReplyStat, setAddReplyStat] = useState<boolean>(false);
  const [quickCopy, setQuickCopy] = useState<boolean>(false);
  const [hlHover, setHlHover] = useState<boolean>(false);
  const [hlClick, setHlClick] = useState<boolean>(false);
  const [showHlStat, setShowHlStat] = useState<boolean>(false);
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
        "peakAuthorReply",
        "alignPush",
        "showIdPushCount",
        "hideLongReplyId",
        "highlightAuthor",
        "addReplyStat",
        "quickCopy",
        "hlHover",
        "hlClick",
        "showHlStat",
        "addClearAllHlBtn",
        "addFoldModeBtn",
        "addFocusModeBtn",
      ],
      (items) => {
        setAddFloor(items.addFloor);
        setPeakAuthorReply(items.peakAuthorReply);
        setAlignPush(items.alignPush);
        setShowIdPushCount(items.showIdPushCount);
        setHideLongReplyId(items.hideLongReplyId);
        setHighlightAuthor(items.highlightAuthor);
        setAddReplyStat(items.addReplyStat);
        setQuickCopy(items.quickCopy);
        setHlHover(items.hlHover);
        setHlClick(items.hlClick);
        setShowHlStat(items.showHlStat);
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
        peakAuthorReply: peakAuthorReply,
        alignPush: alignPush,
        showIdPushCount: showIdPushCount,
        hideLongReplyId: hideLongReplyId,
        highlightAuthor: highlightAuthor,
        addReplyStat: addReplyStat,
        quickCopy: quickCopy,
        hlHover: hlHover,
        hlClick: hlClick,
        showHlStat: showHlStat,
        addClearAllHlBtn: addClearAllHlBtn,
        addFoldModeBtn: addFoldModeBtn,
        addFocusModeBtn: addFocusModeBtn,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("???????????????");
        const id = setTimeout(() => {
          setStatus(undefined);
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <div>
        <Option
          checked={addFloor}
          onChange={(event) => setAddFloor(event.target.checked)}
          text="????????????"
        />

        <div style={hlChildOptions}>
          <Option
            checked={peakAuthorReply && addFloor}
            onChange={(event) => setPeakAuthorReply(event.target.checked)}
            text="?????????????????? (???????????????????????????)"
            disabled={!addFloor}
          />
        </div>
      </div>

      <Option
        checked={alignPush}
        onChange={(event) => setAlignPush(event.target.checked)}
        text="???????????? ID"
      />

      <Option
        checked={showIdPushCount}
        onChange={(event) => setShowIdPushCount(event.target.checked)}
        text="????????????????????? ID ????????????????????????????????????????????????"
      />

      <Option
        checked={hideLongReplyId}
        onChange={(event) => setHideLongReplyId(event.target.checked)}
        text="?????????????????? ID"
      />

      <Option
        checked={highlightAuthor}
        onChange={(event) => setHighlightAuthor(event.target.checked)}
        text="???????????? ID"
      />

      <Option
        checked={addReplyStat}
        onChange={(event) => setAddReplyStat(event.target.checked)}
        text="??????????????????????????????????????????/???????????????"
      />

      <Option
        checked={quickCopy}
        onChange={(event) => setQuickCopy(event.target.checked)}
        text="????????????????????????????????????????????? y ?????????????????????????????????"
      />

      <Option
        checked={hlHover}
        onChange={(event) => setHlHover(event.target.checked)}
        text="????????????????????????????????? ID ??????"
      />

      <div>
        <Option
          checked={hlClick}
          onChange={(event) => setHlClick(event.target.checked)}
          text="????????????????????????????????? ID ??????"
        />

        <div style={hlChildOptions}>
          <Option
            checked={showHlStat && hlClick}
            onChange={(event) => setShowHlStat(event.target.checked)}
            text="????????????????????????????????? ID"
            disabled={!hlClick}
          />
          <Option
            checked={addClearAllHlBtn && hlClick}
            onChange={(event) => setAddClearAllHlBtn(event.target.checked)}
            text="????????????????????????????????????"
            disabled={!hlClick}
          />
          <Option
            checked={addFocusModeBtn && hlClick}
            onChange={(event) => setAddFocusModeBtn(event.target.checked)}
            text="????????????????????????????????????"
            disabled={!hlClick}
          />
          <Option
            checked={addFoldModeBtn && hlClick}
            onChange={(event) => setAddFoldModeBtn(event.target.checked)}
            text="?????????????????????????????????"
            disabled={!hlClick}
          />
        </div>
      </div>

      <div>
        <button onClick={saveOptions}>????????????</button>
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
