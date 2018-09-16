import io from "socket.io-client";

const socket = io.connect(
  redux_logger !== "production"
    ? "http://localhost:4000"
    : "http://http://52.15.253.243:4000/"
);

export { socket };
