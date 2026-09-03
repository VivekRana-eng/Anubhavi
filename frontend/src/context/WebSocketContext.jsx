import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [userNotification, setUserNotification] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'NOT-101',
      type: 'SOS',
      title: '🚨 CRITICAL SOS ALERT',
      message: 'Rajesh Sharma (72y) triggered Emergency Panic Button',
      location: 'H.No 412, Lane 4, Model Town Phase 2',
      time: 'Just Now',
      unread: true,
      case_id: 'ANB-SOS-2026-90412'
    },
    {
      id: 'NOT-102',
      type: 'ASSISTANCE',
      title: '🤝 NEW ASSISTANCE REQUEST',
      message: 'Kamla Devi requested Medical Prescriptions & Health Check',
      location: 'House 88, Sector 17',
      time: '12 mins ago',
      unread: true
    },
    {
      id: 'NOT-103',
      type: 'CHECKIN',
      title: '⚠️ MISSED CHECK-IN ALERT',
      message: 'Gurcharan Singh (78y) missed 24h daily check-in',
      location: 'Block C, Model Town',
      time: '45 mins ago',
      unread: true
    }
  ]);

  const addNotificationItem = (notif) => {
    setNotificationsList(prev => {
      if (prev.some(item => item.id === notif.id || (item.case_id && item.case_id === notif.case_id))) {
        return prev;
      }
      return [notif, ...prev];
    });
    setNotificationsCount(prev => prev + 1);
  };

  const playEmergencyAudio = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
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

  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === 'anubhavi_local_sos_alert' && event.newValue) {
        try {
          const alert = JSON.parse(event.newValue);
          setActiveAlert(alert);
          setLastEvent(alert);
          addNotificationItem({
            id: `NOT-${Date.now()}`,
            type: 'SOS',
            title: '🚨 CRITICAL SOS ALERT',
            message: `${alert.citizen_name || 'Senior Citizen'} triggered emergency ${alert.emergency_type || 'Panic Alarm'}`,
            location: alert.location || alert.location_address || 'Model Town Ward',
            time: 'Just Now',
            unread: true,
            case_id: alert.case_id
          });
          if (audioEnabled) playEmergencyAudio();
        } catch (error) {
          console.error('Local SOS Alert Error:', error);
        }
      }
      if (event.key === 'anubhavi_local_user_notification' && event.newValue) {
        try {
          const notif = JSON.parse(event.newValue);
          setUserNotification(notif);
          setLastEvent(notif);
          addNotificationItem({
            id: `NOT-${Date.now()}`,
            type: notif.type || 'ASSISTANCE',
            title: notif.title || '🤝 NEW ASSISTANCE REQUEST',
            message: notif.message || `${notif.citizen_name || 'Senior Citizen'} submitted assistance request`,
            location: notif.location || 'Model Town Ward',
            time: 'Just Now',
            unread: true
          });
        } catch (error) {
          console.error('Local User Notif Error:', error);
        }
      }
    };

    const handleCustomSos = (e) => {
      if (e.detail) {
        const alert = e.detail;
        setActiveAlert(alert);
        setLastEvent(alert);
        addNotificationItem({
          id: `NOT-${Date.now()}`,
          type: 'SOS',
          title: '🚨 CRITICAL SOS ALERT',
          message: `${alert.citizen_name || 'Senior Citizen'} triggered emergency ${alert.emergency_type || 'Panic Alarm'}`,
          location: alert.location || alert.location_address || 'Model Town Ward',
          time: 'Just Now',
          unread: true,
          case_id: alert.case_id
        });
        if (audioEnabled) playEmergencyAudio();
      }
    };

    const handleCustomNotif = (e) => {
      if (e.detail) {
        const notif = e.detail;
        setUserNotification(notif);
        setLastEvent(notif);
        addNotificationItem({
          id: `NOT-${Date.now()}`,
          type: notif.type || 'ASSISTANCE',
          title: notif.title || '🤝 NEW ASSISTANCE REQUEST',
          message: notif.message || `${notif.citizen_name || 'Senior Citizen'} submitted assistance request`,
          location: notif.location || 'Model Town Ward',
          time: 'Just Now',
          unread: true
        });
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('anubhavi_new_sos_alert', handleCustomSos);
    window.addEventListener('anubhavi_new_notification', handleCustomNotif);

    let ws;
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001'
        ? 'localhost:8000' 
        : window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => setSocketConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEvent(data);

          if (data.event === 'NEW_SOS_ALERT') {
            setActiveAlert(data);
            addNotificationItem({
              id: `NOT-${Date.now()}`,
              type: 'SOS',
              title: '🚨 CRITICAL SOS ALERT',
              message: `${data.citizen_name || 'Senior Citizen'} triggered emergency ${data.emergency_type || 'Panic Alarm'}`,
              location: data.location || 'Model Town Ward',
              time: 'Just Now',
              unread: true,
              case_id: data.case_id
            });
            if (audioEnabled) playEmergencyAudio();
            localStorage.setItem('anubhavi_local_sos_alert', JSON.stringify(data));
          } else if (data.event === 'NEW_ASSISTANCE_REQUEST') {
            setUserNotification(data);
            addNotificationItem({
              id: `NOT-${Date.now()}`,
              type: 'ASSISTANCE',
              title: '🤝 NEW ASSISTANCE REQUEST',
              message: `${data.citizen_name || 'Senior Citizen'} submitted request: ${data.request_type || 'General Support'}`,
              location: data.location || 'Model Town Ward',
              time: 'Just Now',
              unread: true
            });
          }
        } catch (e) {
          console.error("WS Message Error:", e);
        }
      };

      ws.onclose = () => {
        setSocketConnected(false);
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('anubhavi_new_sos_alert', handleCustomSos);
      window.removeEventListener('anubhavi_new_notification', handleCustomNotif);
      if (ws) ws.close();
    };
  }, [audioEnabled]);

  return (
    <WebSocketContext.Provider value={{
      socketConnected,
      activeAlert,
      userNotification,
      lastEvent,
      dismissAlert: () => setActiveAlert(null),
      dismissUserNotification: () => setUserNotification(null),
      audioEnabled,
      toggleAudio: () => setAudioEnabled(!audioEnabled),
      notificationsCount,
      notificationsList,
      clearNotifications: () => {
        setNotificationsCount(0);
        setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
      },
      dismissNotificationItem: (id) => {
        setNotificationsList(prev => prev.filter(n => n.id !== id));
        setNotificationsCount(prev => Math.max(0, prev - 1));
      },
      triggerLocalAlert: (data) => {
        setActiveAlert(data);
        localStorage.setItem('anubhavi_local_sos_alert', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('anubhavi_new_sos_alert', { detail: data }));
        if (audioEnabled) playEmergencyAudio();
      },
      triggerUserNotification: (data) => {
        setUserNotification(data);
        localStorage.setItem('anubhavi_local_user_notification', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('anubhavi_new_notification', { detail: data }));
      }
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
