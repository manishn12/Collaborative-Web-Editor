import { v4 as uuidV4 } from "uuid";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "../../public/logo.png";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    console.log(id);
    toast.success("Created new Room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("RoomId or Username is required!!!");
      return;
    }
    navigate(`editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homeWrapper">
      <div className="formWrapper">
        <div className="logoWrapper">
          <img className="logoClass" src={Logo} />
        </div>
        <h4 className="mainLable">Paste invitation room ID</h4>
        <div className="inputGroup">
          <input type="text" className="inputBox" placeholder="Room ID" value={roomId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)} onKeyUp={handleEnterPress} />
          <input
            type="text"
            className="inputBox"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            onKeyUp={handleEnterPress}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have invite then Create{" "}
            <a href="#" className="createNewBtn" onClick={createNewRoom}>
              New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Built using Web Sockets ❤️</h4>
      </footer>
    </div>
  );
};

export default Home;
