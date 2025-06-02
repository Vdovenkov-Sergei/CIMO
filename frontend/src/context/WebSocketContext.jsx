import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const websocketRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [latestMessage, setLatestMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();

  const getSessionIdFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('id');
  };

  const getWebSocketURL = (sessionId) => {
    const protocol = import.meta.env.VITE_WS_PROTOCOL || 'ws';
    const host = import.meta.env.VITE_WS_HOST || 'localhost:8000';
    return `${protocol}://${host}/movies/session/ws/${sessionId}`;
  };

  const connect = (id) => {
    if (!id) return;
    if (websocketRef.current) disconnect();

    try {
      const ws = new WebSocket(getWebSocketURL(id));
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLatestMessage(data);
          console.log('📨 WebSocket message:', data);
        } catch (e) {
          console.error('❌ Failed to parse WebSocket message', e);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket closed');
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('⚠️ WebSocket error:', error);
        setIsConnected(false);
      };

      setSessionId(id);
    } catch (error) {
      console.error('⚠️ WebSocket initialization error:', error);
    }
  };

  const disconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    setSessionId(null);
    setLatestMessage(null);
    setIsConnected(false);
  };

  useEffect(() => {
    const idFromUrl = getSessionIdFromUrl();
    if (idFromUrl) {
      connect(idFromUrl);
    }

    return () => {
      disconnect();
    };
  }, [location.search]);

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        disconnect,
        websocket: websocketRef.current,
        sessionId,
        latestMessage,
        isConnected
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};