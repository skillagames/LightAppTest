import { Bell, CheckCircle, Package, Gift } from 'lucide-react';
import { AppNotification } from '../types';
import { motion } from 'motion/react';

interface Props {
  notifications: AppNotification[];
  onTriggerTest: () => void;
  onTriggerOffer: () => void;
  onClear: () => void;
  unreadCount: number;
}

export default function NotificationsView({ notifications, onTriggerTest, onTriggerOffer, onClear }: Props) {
  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="pt-10 px-6 pb-4 bg-white flex items-center justify-between shrink-0 z-10 relative">
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

      <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8">
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
