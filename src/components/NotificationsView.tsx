import { Bell, CheckCircle, Package, Gift, Timer, ShieldAlert, ShieldCheck, ShieldX, Smartphone } from 'lucide-react';
import { AppNotification } from '../types';
import { motion } from 'motion/react';

interface Props {
  notifications: AppNotification[];
  onTriggerTest: () => void;
  onTriggerOffer: () => void;
  onTriggerDelayed: () => void;
  onTriggerCapacitor: () => void;
  onClear: () => void;
  unreadCount: number;
  permissionStatus: NotificationPermission;
  capacitorPermission: string;
  onRequestPermission: () => void;
}

export default function NotificationsView({ 
  notifications, 
  onTriggerTest, 
  onTriggerOffer, 
  onTriggerDelayed,
  onTriggerCapacitor,
  onClear,
  permissionStatus,
  capacitorPermission,
  onRequestPermission
}: Props) {
  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="pt-10 px-4 pb-4 bg-white flex flex-col shrink-0 z-10 relative border-b border-slate-50 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            Alerts
          </h1>
          {notifications.length > 0 && (
            <button 
              onClick={onClear} 
              className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* Web Notification Status */}
          <div className="flex flex-col gap-1 ring-1 ring-slate-100 p-2 rounded-xl bg-slate-50 min-w-[100px]">
             <span className="text-[8px] font-bold text-slate-400 uppercase">Web APIs</span>
             {permissionStatus === 'default' && (
              <button 
                onClick={onRequestPermission}
                className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3" />
                Enable
              </button>
            )}
            {permissionStatus === 'granted' && (
              <div className="text-[9px] font-bold text-green-600 px-2 py-0.5 rounded-md flex items-center gap-1 bg-green-50">
                <ShieldCheck className="w-3 h-3" />
                Granted
              </div>
            )}
            {permissionStatus === 'denied' && (
              <button 
                onClick={onRequestPermission}
                className="text-[9px] font-bold text-red-500 px-2 py-0.5 rounded-md flex items-center gap-1 bg-red-50 border border-red-100"
              >
                <ShieldX className="w-3 h-3" />
                Blocked
              </button>
            )}
          </div>

          {/* Capacitor Status */}
          <div className="flex flex-col gap-1 ring-1 ring-slate-100 p-2 rounded-xl bg-slate-50 min-w-[100px]">
             <span className="text-[8px] font-bold text-slate-400 uppercase">Capacitor</span>
             {capacitorPermission === 'granted' ? (
                <div className="text-[9px] font-bold text-blue-600 px-2 py-0.5 rounded-md flex items-center gap-1 bg-blue-50">
                  <Smartphone className="w-3 h-3" />
                  Active
                </div>
             ) : capacitorPermission === 'unavailable' ? (
                <div className="text-[9px] font-bold text-slate-400 px-2 py-0.5 rounded-md flex items-center gap-1 bg-slate-100">
                  <ShieldX className="w-3 h-3" />
                  Web Mode
                </div>
             ) : (
                <button 
                  onClick={onRequestPermission}
                  className="text-[9px] font-bold text-amber-600 px-2 py-0.5 rounded-md flex items-center gap-1 bg-amber-50 border border-amber-100"
                >
                  <Smartphone className="w-3 h-3" />
                  Setup
                </button>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8 pt-4">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-4">
               <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-slate-500">No recent alerts</p>
          </div>
        ) : (
          notifications.map((n) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center p-3 border rounded-2xl gap-3 ${n.read ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-white border-blue-100 shadow-sm'}`}
            >
              <div className={`p-2 rounded-lg shadow-sm shrink-0 ${n.read ? 'bg-white text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                {n.title.toLowerCase().includes('scanned') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <p className={`text-xs font-bold truncate pr-3 ${n.read ? 'text-slate-800' : 'text-slate-900'}`}>{n.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                     {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{n.body}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shrink-0 space-y-3">
         <button
           onClick={onTriggerCapacitor}
           className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-900/20"
         >
           <Smartphone className="w-4 h-4" />
           Capacitor Native Push
         </button>
         <button
           onClick={onTriggerDelayed}
           className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 py-3.5 rounded-2xl font-bold transition-colors flex justify-center items-center gap-2 shadow-sm shadow-amber-100/50"
         >
           <Timer className="w-4 h-4" />
           Delayed (5s) Notif
         </button>
         <button
           onClick={onTriggerOffer}
           className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 py-3.5 rounded-2xl font-bold transition-colors flex justify-center items-center gap-2"
         >
           <Gift className="w-4 h-4" />
           Send Promo Push
         </button>
         <button
           onClick={onTriggerTest}
           className="w-full bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 py-3.5 rounded-2xl font-bold transition-colors flex justify-center items-center gap-2"
         >
           <Bell className="w-4 h-4" />
           System Test Push
         </button>
      </div>
    </div>
  );
}
