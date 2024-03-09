import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import ACTIONS from "../Actions";
import { Socket } from "socket.io-client";

// import { SocketRefInterface } from "../Pages/EditorPage";

interface EditorInterface {
  socketRef: React.RefObject<Socket | null>;
  roomId: string | undefined;
  onCodeChange: (value: string) => void;
}

const Editor = ({ socketRef, roomId, onCodeChange }: EditorInterface) => {
  const [data, setData] = useState("console.log('hello world!');");

  const onChange = React.useCallback((value: string) => {
    // console.log("From Editor ", value);
    // setData(value);
    setData(value);
    onCodeChange(value);
    // updating Data to all socket clientList
    // if (origin !== setValue) {
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, { roomId, value });
  }, []);

  useEffect(() => {
    if (socketRef) {
      socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ value }: { value: string }) => {
        // console.log("From Client ", value);
        if (value !== null) {
          // setData(value);
          setData(value);
        }
      });
    }
    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="editorPage">
      <CodeMirror theme="dark" value={data} extensions={[javascript({ jsx: true })]} onChange={onChange} />
    </div>
  );
};

export default Editor;
