import { useState, useRef, useEffect } from "react";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import Logo from "../../public/logo.png";
import ACTIONS, { JAVASCRIPT_BOILERPLATE_CODE } from "../Actions";

interface Client {
  socketId: string;
  username: string;
}

interface RouteParams extends Record<string, string | undefined> {
  roomID: string | undefined;
}

const EditorPage = () => {
  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef(JAVASCRIPT_BOILERPLATE_CODE);
  const location = useLocation();
  const { roomID } = useParams<RouteParams>();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/");
  }

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err: Error) => handleErrors(err));
      socketRef.current.on("connect_failed", (err: Error) => handleErrors(err));

      const handleErrors = (err: Error) => {
        console.log("Socket Error, ", err);
        toast.error("Getting Socket Errors");
        navigate("/");
      };
      // Trigger JOIN event to join the room
      socketRef.current.emit(ACTIONS.JOIN, { roomID, username: location?.state.username, code: codeRef.current });

      //Trigger JOINED event to include into the joined clients
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }: { clients: Client[]; username: string; socketId: string }) => {
        if (socketId !== socketRef.current?.id) {
          toast.success(`${username} has joined the room.`);
          console.log(`${username} has joined the room`);
        }
        // if (socketId === socketRef.current.id) {
        socketRef.current?.emit(ACTIONS.SYNC_CODE, { socketId, roomID });
        // }
        setClients(clients);
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }: { socketId: string; username: string }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const copyRoomID = async () => {
    try {
      await navigator.clipboard.writeText(roomID!);
      toast.success("Room Id has been copied to the clipboard");
    } catch (err) {
      toast.error("Could not copy Room ID");
      console.log(err);
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoClass" src={Logo} />
          </div>
          <h3 style={{ textAlign: "center" }}>Connected Clients</h3>
          <div className="clientList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomID}>
          Copy RoomID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomID}
          onCodeChange={(code: string) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
