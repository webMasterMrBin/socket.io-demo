import io from "socket.io-client";

const socket = io.connect(
  NODE_ENV !== "production"
    ? "http://localhost:4000"
    : "http://18.223.227.38:4000"
);

export { socket };
