import { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Bell, CheckCheck, BookOpen, UserCheck, GraduationCap, ClipboardCheck, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        setIsOpen(false);
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'ENROLLMENT':
                return <BookOpen className="h-4 w-4 text-blue-600" />;
            case 'PATH':
                return <UserCheck className="h-4 w-4 text-purple-600" />;
            case 'COMPLETION':
                return <GraduationCap className="h-4 w-4 text-green-600" />;
            case 'CERTIFICATE':
                return <GraduationCap className="h-4 w-4 text-yellow-600" />;
            case 'ASSIGNMENT':
                return <ClipboardCheck className="h-4 w-4 text-red-600" />;
            case 'SYSTEM':
                return <Settings className="h-4 w-4 text-slate-600" />;
            default:
                return <Info className="h-4 w-4 text-slate-600" />;
        }
    };

    const getBgColor = (type: Notification['type']) => {
        switch (type) {
            case 'ENROLLMENT': return 'bg-blue-100';
            case 'PATH': return 'bg-purple-100';
            case 'COMPLETION': return 'bg-green-100';
            case 'CERTIFICATE': return 'bg-yellow-100';
            case 'ASSIGNMENT': return 'bg-red-100';
            default: return 'bg-slate-100';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <Badge className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAllAsRead()}
                                className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 gap-1.5"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Mark all read
                            </Button>
                        )}
                    </div>

                    <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        {isLoading ? (
                            <div className="py-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-sm text-slate-500">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-12 text-center px-4">
                                <div className="bg-slate-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-slate-900 font-medium">No notifications yet</p>
                                <p className="text-sm text-slate-500 mt-1">We'll notify you when something important happens.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            "flex gap-4 px-4 py-4 cursor-pointer hover:bg-slate-50 transition-colors relative",
                                            !notification.isRead && "bg-indigo-50/30"
                                        )}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                                        )}
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                            getBgColor(notification.type)
                                        )}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-semibold text-slate-900 mb-0.5",
                                                !notification.isRead && "text-indigo-900"
                                            )}>
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-2 font-medium">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-top border-slate-100 bg-slate-50/50 text-center">
                        <button
                            onClick={() => { setIsOpen(false); navigate('/settings/notifications'); }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            View Notification Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
