import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(3);

  useEffect(() => {
    const handleLocalAlert = (event) => {
      if (event.key !== 'anubhavi_local_sos_alert' || !event.newValue) return;
      try {
        const alert = JSON.parse(event.newValue);
        setActiveAlert(alert);
        setNotificationsCount(prev => prev + 1);
      } catch (error) {
        console.error('Local SOS Alert Error:', error);
      }
    };

    window.addEventListener('storage', handleLocalAlert);
    let ws;
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setSocketConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.event === 'NEW_SOS_ALERT') {
            setActiveAlert(data);
            setNotificationsCount(prev => prev + 1);
            if (audioEnabled) {
              playEmergencyAudio();
            }
          } else if (data.event === 'CASE_ESCALATED') {
            setNotificationsCount(prev => prev + 1);
          }
        } catch (e) {
          console.error("WS Message Error:", e);
        }
      };

      ws.onclose = () => {
        setSocketConnected(false);
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      window.removeEventListener('storage', handleLocalAlert);
      if (ws) ws.close();
    };
  }, [audioEnabled]);

  const playEmergencyAudio = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio play blocked or unavailable");
    }
  };

  return (
    <WebSocketContext.Provider value={{
      socketConnected,
      activeAlert,
      dismissAlert: () => setActiveAlert(null),
      audioEnabled,
      toggleAudio: () => setAudioEnabled(!audioEnabled),
      notificationsCount,
      triggerLocalAlert: (data) => {
        setActiveAlert(data);
        if (audioEnabled) playEmergencyAudio();
      }
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
