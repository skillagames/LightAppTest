import { ScanLine, Bell, Grid, ChevronRight, Package, TrendingUp, History } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (tab: 'home' | 'scan' | 'notifications') => void;
  unreadCount: number;
}

export default function HomeView({ onNavigate, unreadCount }: Props) {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 bg-white shrink-0 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Management</span>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">Dashboard</h1>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400">
            <Grid className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Efficiency</p>
            <p className="text-lg font-extrabold text-slate-800 mt-0.5">94.2%</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3">
              <Package className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Stock</p>
            <p className="text-lg font-extrabold text-slate-800 mt-0.5">1,204</p>
          </div>
        </div>

        {/* Main Action Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('scan')}
          className="w-full bg-slate-900 rounded-[2rem] p-6 text-left relative overflow-hidden shadow-xl shadow-slate-900/10 group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/20">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white leading-tight">Launch Scanner</h3>
            <p className="text-slate-400 text-xs mt-1">Scan barcodes to process inventory in real-time.</p>
            
            <div className="mt-6 flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest">
              Begin now <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </motion.button>

        {/* Section Title */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">Quick Access</h3>
        </div>

        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('notifications')}
            className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 truncate">Recent Alerts</h4>
              <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">
                {unreadCount > 0 ? `${unreadCount} new notifications` : 'System is up to date'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-left opacity-60"
          >
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 truncate">Scan History</h4>
              <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">Review previous scans</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
