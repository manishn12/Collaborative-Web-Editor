import Avatar from "react-avatar";

const Client = ({ username }: { username: string }) => {
  return (
    <div className="client">
      <Avatar name={username} size={"60"} round="14px" />
      <span className="username">{username}</span>
      {/* {username} {socketId} */}
    </div>
  );
};

export default Client;

// useEffect(() => {
//   const init = async () => {
//     socketRef.current = await initSocket();
//     socketRef.current.on("connect_error", (err) => handleErrors(err));
//     socketRef.current.on("connect_failed", (err) => handleErrors(err));

//     function handleErrors(err) {
//       console.log("Socket error", err);
//       toast.error("Socket connection failed, try again later");
//       navigate("/");
//     }
//     socketRef.current.emit(ACTIONS.JOIN, {
//       roomID,
//       username: location.state?.username,
//     });
//     //Listening for joined event
//     socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }: { clients: Client[]; username: string; socketId: string }) => {
//       if (socketRef.current.id !== socketId) {
//         toast.success(`${username} has joined the room`);
//         console.log(`${username} has joined the room`);
//       }
//       setClients(clients);
//       console.log("******PRINTING CLIENTS*******");
//       console.log(clients);
//       console.log();
//       socketRef.current.emit(ACTIONS.SYNC_CODE, { code: codeRef.current, socketId });
//     });

//     //Listening for disconnected event
//     socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }: { socketId: string; username: string }) => {
//       toast.success(`${username} left the room`);
//       setClients((prev) => {
//         return prev.filter((client) => client.socketId !== socketId);
//       });
//     });
//   };
//   init();

//   return () => {
//     socketRef.current.disconnect();
//     socketRef.current.off(ACTIONS.JOINED);
//     socketRef.current.off(ACTIONS.DISCONNECTED);
//   };
// }, []);
