import { io } from "socket.io-client";

const socket = io('https://yarn-server-7h5y.onrender.com/');

export default socket;