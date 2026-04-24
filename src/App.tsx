import { useState, useEffect } from 'react';
import { ScanLine, Bell, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalNotifications } from '@capacitor/local-notifications';
import Scanner from './components/Scanner';
import NotificationsView from './components/NotificationsView';
import HomeView from './components/HomeView';
import { AppNotification } from './types';

const DUMMY_BARCODES = [
  "978-0-201-63361-0",
  "UPC: 036000291452",
  "QR: https://example.com/item",
  "ASN: B08J5F3G18"
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function App() {
  const [tab, setTab] = useState<'home' | 'scan' | 'notifications'>('home');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toast, setToast] = useState<AppNotification | null>(null);

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [capacitorPermission, setCapacitorPermission] = useState<string>('unknown');

  // Request native permission on mount if supported
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
      
      // Request on first load if default
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotifPermission(permission);
        }).catch(err => console.debug(err));
      }

      // Poll slightly to catch manual overrides in browser settings
      const interval = setInterval(() => {
        if (Notification.permission !== notifPermission) {
          setNotifPermission(Notification.permission);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [notifPermission]);

  // Check Capacitor permissions
  useEffect(() => {
    const checkCapacitor = async () => {
      try {
        const status = await LocalNotifications.checkPermissions();
        setCapacitorPermission(status.display);
      } catch (e) {
        setCapacitorPermission('unavailable');
      }
    };
    checkCapacitor();
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotifPermission(permission);
        if (permission === 'granted') {
          new Notification("Notifications Enabled!", { body: "You will now receive system alerts." });
        }
      } catch (err) {
        console.warn("Permission request failed", err);
      }
    }

    // Also try Capacitor if possible
    try {
      const capStatus = await LocalNotifications.requestPermissions();
      setCapacitorPermission(capStatus.display);
    } catch (e) {
      // Ignored if not in capacitor
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const triggerPush = (notif: AppNotification) => {
    setNotifications(prev => [notif, ...prev]);
    setToast(notif);
    
    // Auto-dismiss the toast after 4s
    setTimeout(() => setToast(currentToast => {
      if (currentToast?.id === notif.id) return null;
      return currentToast;
    }), 4000);
    
    // Dispatch native system notification via Service Worker (preferred)
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notif.title, {
          body: notif.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [200, 100, 200],
          tag: 'barcode-prototype-notif'
        });
      });
    } 
    // Fallback if no SW or old browser
    else if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, { 
          body: notif.body,
          icon: '/favicon.ico'
        });
      } catch (err) {
        console.debug('Native notification failed', err);
      }
    }
  };

  const handleTriggerDelayed = () => {
    const id = generateId();
    // Show a small UI feedback that it's scheduled
    const scheduledNotif: AppNotification = {
      id,
      title: "Notification Scheduled",
      body: "Wait 5 seconds... switch tabs to test!",
      timestamp: new Date(),
      read: true
    };
    setNotifications(prev => [scheduledNotif, ...prev]);

    setTimeout(() => {
      const newNotif: AppNotification = {
        id: generateId(),
        title: "⏰ Timer Alert!",
        body: "This is your 5-second delayed local notification.",
        timestamp: new Date(),
        read: false
      };
      triggerPush(newNotif);
    }, 5000);
  };

  const handleSimulateScan = () => {
    const randomCode = DUMMY_BARCODES[Math.floor(Math.random() * DUMMY_BARCODES.length)];
    const newNotif: AppNotification = {
      id: generateId(),
      title: "Barcode Scanned",
      body: `Successfully scanned item: ${randomCode}`,
      timestamp: new Date(),
      read: false
    };
    triggerPush(newNotif);
  };

  const handleTriggerTest = () => {
    const newNotif: AppNotification = {
      id: generateId(),
      title: "System Update",
      body: "This is a simulated background push notification.",
      timestamp: new Date(),
      read: false
    };
    triggerPush(newNotif);
  };

  const handleTriggerOffer = () => {
    const newNotif: AppNotification = {
      id: generateId(),
      title: "Special Offer!",
      body: "Check out our latest deals!",
      timestamp: new Date(),
      read: false
    };
    triggerPush(newNotif);
  };

  const handleTriggerCapacitor = async () => {
    try {
      const id = Math.floor(Math.random() * 1000000);
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Capacitor Alert 📱",
            body: "This notification was sent via the Capacitor plugin!",
            id: id,
            schedule: { at: new Date(Date.now() + 1000) },
          }
        ]
      });

      const newNotif: AppNotification = {
        id: id.toString(),
        title: "Capacitor Test",
        body: "Capacitor notification successfully scheduled.",
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      console.warn("Capacitor Notifications failed. Likely not in a native app context.");
      // Fallback to web toast so the user sees SOMETHING happened
      const newNotif: AppNotification = {
        id: generateId(),
        title: "Capacitor Error",
        body: "Capacitor plugin failed. Native wrapper required.",
        timestamp: new Date(),
        read: false
      };
      triggerPush(newNotif);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Mark unseen as read upon opening the notifications tab
  useEffect(() => {
    if (tab === 'notifications') {
      markAllRead();
      setToast(null); // Clear active toast popup to avoid clutter
      
      // Sync permission state when entering this tab
      if ('Notification' in window) {
        setNotifPermission(Notification.permission);
      }
    }
  }, [tab]);

  return (
    <div className="fixed inset-0 bg-slate-200 flex sm:items-center justify-center sm:p-8 font-sans selection:bg-blue-200">
      {/* 
        This wrapper behaves like a physical phone on desktop (shadows, rounded corners, border),
        and scales to full width/height naturally on mobile devices without the borders.
      */}
      <div className="w-full h-full max-w-[360px] bg-white sm:h-[700px] sm:max-h-[700px] sm:rounded-[48px] sm:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] sm:border-[12px] sm:border-slate-900 overflow-hidden relative flex flex-col">
        {/* Notch */}
        <div className="h-6 w-32 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-50 hidden sm:block"></div>
        
        {/* App Content Area */}
        <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
          {tab === 'home' && (
            <HomeView 
              onNavigate={(newTab) => setTab(newTab)} 
              unreadCount={unreadCount} 
            />
          )}
          {tab === 'scan' && (
            <Scanner onSimulateScan={handleSimulateScan} />
          )}
          {tab === 'notifications' && (
            <NotificationsView 
              notifications={notifications} 
              onTriggerTest={handleTriggerTest}
              onTriggerOffer={handleTriggerOffer}
              onTriggerDelayed={handleTriggerDelayed}
              onTriggerCapacitor={handleTriggerCapacitor}
              onClear={() => setNotifications([])}
              unreadCount={unreadCount}
              permissionStatus={notifPermission}
              capacitorPermission={capacitorPermission}
              onRequestPermission={requestPermission}
            />
          )}
        </div>

        {/* Global In-App "Push" Toast Overlay */}
        <AnimatePresence>
          {toast && (
             <motion.div
                initial={{ y: -150, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -100, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={() => {
                  setTab('notifications');
                  setToast(null);
                }}
                className="absolute top-10 left-4 right-4 z-50 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex gap-4 items-center cursor-pointer active:scale-95 transition-transform"
             >
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-white" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate pr-2">{toast.title}</p>
                  <p className="text-xs text-slate-500 leading-snug">{toast.body}</p>
               </div>
               <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">Just now</span>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-around items-center shrink-0 z-40 relative">
           {/* Home Tab */}
           <button 
             onClick={() => setTab('home')} 
             className={`flex flex-col items-center gap-1 transition-colors ${tab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-500'}`}
           >
             <Home className="w-6 h-6" />
             <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
           </button>

           {/* Scan Tab */}
           <button 
             onClick={() => setTab('scan')} 
             className={`flex flex-col items-center gap-1 transition-colors ${tab === 'scan' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-500'}`}
           >
             <ScanLine className="w-6 h-6" />
             <span className="text-[10px] font-bold uppercase tracking-wider">Scan</span>
           </button>

           {/* Notifications Tab */}
           <button 
             onClick={() => setTab('notifications')} 
             className={`flex flex-col items-center gap-1 transition-colors relative ${tab === 'notifications' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-500'}`}
           >
             <Bell className="w-6 h-6" />
             {/* Badge */}
             <AnimatePresence>
               {unreadCount > 0 && (
                 <motion.span 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   exit={{ scale: 0 }}
                   className="absolute -top-1 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white pointer-events-none"
                 >
                   {unreadCount > 9 ? '9+' : unreadCount}
                 </motion.span>
               )}
             </AnimatePresence>
             <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
           </button>
        </div>

      </div>
    </div>
  );
}
