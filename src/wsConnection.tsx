import  store from "./app/store" 
import { setWsMessage } from "./app/slices/authSlice";

export const initializeWebSocket = () => {
  let ws: WebSocket | null = null;

  const connectWebSocket = () => {
    ws = new WebSocket("ws://localhost:8000/ws/data");
    ws.onopen = () => {console.log("WebSocket connection established");};
    ws.onmessage = (event) => {const message = JSON.parse(event.data);store.dispatch(setWsMessage(message));};
    ws.onclose = () => {console.log("WebSocket connection closed. Reconnecting...");reconnectWebSocket();};
    ws.onerror = (error) => {console.error("WebSocket error:", error); ws?.close();};
  };
  const reconnectWebSocket = () => {setTimeout(() => {console.log("Attempting to reconnect WebSocket...");connectWebSocket();},2000);};
  connectWebSocket();
  return ws;
};
