import React from 'react';
import { X, Bell, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { AppNotification } from '../lib/supabase';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll?: () => void;
}

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAsRead, onClearAll }: NotificationDrawerProps) {
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBgForType = (type: string) => {
    switch(type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 glass-panel border-l border-slate-800 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-200" />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-100">Notificaciones</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <Bell className="w-12 h-12 opacity-20" />
              <p className="text-sm">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => {
                  if (!notif.read) onMarkAsRead(notif.id);
                }}
                className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all ${
                  notif.read 
                    ? 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100' 
                    : `${getBgForType(notif.type)} shadow-lg`
                }`}
              >
                <div className="shrink-0 mt-1">
                  {getIconForType(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-semibold ${notif.read ? 'text-slate-300' : 'text-slate-100'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {notif.source}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
