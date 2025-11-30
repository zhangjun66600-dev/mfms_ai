
import React, { useState, useEffect, useRef } from "react";
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { 
    ClipboardDocumentCheckIcon, 
    ChartBarIcon, 
    UserCircleIcon,
    BellIcon,
    CurrencyDollarIcon,
    CommandLineIcon,
    SparklesIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    EnvelopeOpenIcon,
    TrashIcon,
    XMarkIcon,
    MapIcon,
    CircleStackIcon
} from "@heroicons/react/24/outline";

// Components
import AuditTaskList from "./components/AuditTaskList";
import AuditTaskDetail from "./components/AuditTaskDetail";
import AuditDecisionPanel from "./components/AuditDecisionPanel";
import AIChatDrawer from "./components/AIChatDrawer";
import RiskDashboard from "./components/RiskDashboard";
import LedgerPage from "./components/LedgerPage";
import AIConsolePage from "./components/AIConsolePage";
import SmartServicesPage from "./components/SmartServicesPage";
import AICockpitPage from "./components/AICockpitPage";
import AIDataGovernancePage from "./components/AIDataGovernancePage";
import AIDocumentReviewPage from "./components/AIDocumentReviewPage";

// Data
import { MOCK_TASKS, MOCK_DETAIL, MOCK_NOTIFICATIONS } from "./constants";
import { AuditTaskItem, NotificationItem } from "./types";

// --- Context Definition ---

interface AuditContextType {
    tasks: AuditTaskItem[];
    selectedTask: AuditTaskItem | null;
    detail: any | null;
    loadingDetail: boolean;
    handleSelectTask: (task: AuditTaskItem) => void;
    handleSubmitDecision: (decision: { result: string; comment: string }) => void;
    // Draft functionality
    drafts: Record<number, { result: "PASS" | "REJECT" | "RETURN"; comment: string }>;
    updateDraft: (taskId: number, field: "result" | "comment", value: string) => void;
}

export const AuditContext = React.createContext<AuditContextType | null>(null);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<AuditTaskItem[]>(MOCK_TASKS);
    const [selectedTask, setSelectedTask] = useState<AuditTaskItem | null>(null);
    const [detail, setDetail] = useState<any | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [drafts, setDrafts] = useState<Record<number, { result: "PASS" | "REJECT" | "RETURN"; comment: string }>>({});

    // Initial load
    useEffect(() => {
        if (tasks.length > 0 && !selectedTask) {
            handleSelectTask(tasks[0]);
        }
    }, []);

    const handleSelectTask = (task: AuditTaskItem) => {
        if (selectedTask?.auditTaskId === task.auditTaskId && detail) return;

        setSelectedTask(task);
        setLoadingDetail(true);
        // Simulate API fetch
        setTimeout(() => {
            setDetail(MOCK_DETAIL[task.auditTaskId] || null);
            setLoadingDetail(false);
        }, 600);
    };

    const updateDraft = (taskId: number, field: "result" | "comment", value: string) => {
        setDrafts(prev => ({
            ...prev,
            [taskId]: {
                ...(prev[taskId] || { result: "PASS", comment: "" }),
                [field]: value
            }
        }));
    };

    const handleSubmitDecision = (decision: { result: string; comment: string }) => {
        console.log("Decision submitted:", decision);
        // Clear draft for this task
        const newDrafts = { ...drafts };
        delete newDrafts[selectedTask!.auditTaskId];
        setDrafts(newDrafts);

        // Remove task from list
        const newTasks = tasks.filter(t => t.auditTaskId !== selectedTask?.auditTaskId);
        setTasks(newTasks);
        
        // Select next
        if (newTasks.length > 0) {
            handleSelectTask(newTasks[0]);
        } else {
            setSelectedTask(null);
            setDetail(null);
        }
    };

    return (
        <AuditContext.Provider value={{
            tasks, selectedTask, detail, loadingDetail, 
            handleSelectTask, handleSubmitDecision,
            drafts, updateDraft
        }}>
            {children}
        </AuditContext.Provider>
    );
};

// --- Notifications ---

const NotificationDetailModal: React.FC<{ 
    notification: NotificationItem; 
    onClose: () => void; 
}> = ({ notification, onClose }) => {
    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className={`p-4 flex items-center justify-between border-b ${
                     notification.type === 'WARNING' ? 'bg-orange-50 border-orange-100' :
                     notification.type === 'ERROR' ? 'bg-red-50 border-red-100' :
                     notification.type === 'SUCCESS' ? 'bg-green-50 border-green-100' :
                     'bg-blue-50 border-blue-100'
                }`}>
                    <div className="flex items-center space-x-2">
                        {notification.type === 'WARNING' && <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />}
                        {notification.type === 'ERROR' && <XCircleIcon className="w-5 h-5 text-red-600" />}
                        {notification.type === 'SUCCESS' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                        {notification.type === 'INFO' && <InformationCircleIcon className="w-5 h-5 text-blue-600" />}
                        <h3 className={`font-semibold ${
                            notification.type === 'WARNING' ? 'text-orange-900' :
                            notification.type === 'ERROR' ? 'text-red-900' :
                            notification.type === 'SUCCESS' ? 'text-green-900' :
                            'text-blue-900'
                        }`}>{notification.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-700 leading-relaxed text-sm mb-4">{notification.message}</p>
                    <div className="flex items-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{notification.time}</span>
                    </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 text-gray-700">
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

const NotificationHistoryModal: React.FC<{
    notifications: NotificationItem[];
    onClose: () => void;
    onSelect: (item: NotificationItem) => void;
    onMarkAllRead: () => void;
}> = ({ notifications, onClose, onSelect, onMarkAllRead }) => {
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
    
    const filteredList = notifications.filter(n => filter === 'ALL' ? true : !n.read);

    return (
        <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <BellIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="font-bold text-gray-800">通知历史记录</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setFilter('ALL')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            全部
                        </button>
                        <button 
                            onClick={() => setFilter('UNREAD')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'UNREAD' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            未读
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={onMarkAllRead}
                            className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                            <EnvelopeOpenIcon className="w-4 h-4 mr-1.5" />
                            全部标为已读
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors">
                            <TrashIcon className="w-4 h-4 mr-1.5" />
                            清空已读
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    {filteredList.length > 0 ? (
                        <div className="space-y-3">
                            {filteredList.map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => onSelect(item)}
                                    className={`bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all flex items-start space-x-3 ${!item.read ? 'border-l-4 border-l-blue-500' : 'border-gray-200'}`}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {item.type === 'WARNING' && <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />}
                                        {item.type === 'ERROR' && <XCircleIcon className="w-5 h-5 text-red-500" />}
                                        {item.type === 'SUCCESS' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                                        {item.type === 'INFO' && <InformationCircleIcon className="w-5 h-5 text-blue-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-semibold truncate ${!item.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.message}</p>
                                    </div>
                                    {!item.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 self-center"></div>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <BellIcon className="w-12 h-12 mb-2 opacity-50" />
                            <p>暂无相关通知</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Layout ---

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const isFullScreen = location.pathname.startsWith('/review'); // Check for review page
    
    // Notification State
    const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    
    // Modal State
    const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    const handleNotificationClick = (item: NotificationItem) => {
        // Mark as read
        if (!item.read) {
            setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
        }
        setSelectedNotification(item);
        setShowNotifications(false);
    };

    const handleHistoryClick = () => {
        setShowNotifications(false);
        setIsHistoryOpen(true);
    };

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    // Render only content if in full screen mode (for review page)
    if (isFullScreen) {
        return (
            <div className="h-screen bg-white">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden relative">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-700">
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-brand-400 mr-2" />
                    <span className="font-bold text-lg tracking-tight">AI 审核中心</span>
                </div>
                <nav className="flex-1 py-6 px-3 space-y-1">
                     <Link 
                        to="/cockpit" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/cockpit') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <MapIcon className="w-5 h-5 mr-3" />
                        AI 驾驶舱
                    </Link>
                    <Link 
                        to="/audit" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/audit') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <ClipboardDocumentCheckIcon className="w-5 h-5 mr-3" />
                        审核工作台
                    </Link>
                    <Link 
                        to="/dashboard" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/dashboard') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <ChartBarIcon className="w-5 h-5 mr-3" />
                        风险驾驶舱
                    </Link>
                    <Link 
                        to="/ledger" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/ledger') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <CurrencyDollarIcon className="w-5 h-5 mr-3" />
                        资金台账
                    </Link>
                    <Link 
                        to="/services" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/services') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <SparklesIcon className="w-5 h-5 mr-3" />
                        AI 智能服务
                    </Link>
                    <Link 
                        to="/governance" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/governance') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <CircleStackIcon className="w-5 h-5 mr-3" />
                        AI 数据治理
                    </Link>
                    <Link 
                        to="/console" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive('/console') ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <CommandLineIcon className="w-5 h-5 mr-3" />
                        AI 综合控制台
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center">
                        <UserCircleIcon className="w-8 h-8 text-slate-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">王审核员</p>
                            <p className="text-xs text-slate-400">资深审批</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-gray-200 h-16 flex justify-between items-center px-6 shadow-sm z-10 flex-shrink-0">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {isActive('/dashboard') ? '风险驾驶舱' : 
                         isActive('/ledger') ? '资金台账管理' : 
                         isActive('/console') ? 'AI 综合控制台' :
                         isActive('/services') ? 'AI 智能服务中心' :
                         isActive('/cockpit') ? 'AI 驾驶舱 (GIS视图)' :
                         isActive('/governance') ? 'AI 数据治理' :
                         '物业维修资金审核系统'}
                    </h1>
                    
                    {/* Notification & User Actions */}
                    <div className="relative" ref={notificationRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-gray-400 hover:text-gray-500 relative rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <BellIcon className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            )}
                        </button>

                        {/* Dropdown Panel */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 origin-top-right">
                                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="text-sm font-semibold text-gray-700">通知中心</h3>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={handleMarkAllRead}
                                            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                                        >
                                            全部已读
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        <ul className="divide-y divide-gray-100">
                                            {notifications.map((item) => (
                                                <li 
                                                    key={item.id} 
                                                    onClick={() => handleNotificationClick(item)}
                                                    className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${!item.read ? 'bg-blue-50/40' : ''}`}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            {item.type === 'WARNING' && <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />}
                                                            {item.type === 'ERROR' && <XCircleIcon className="w-5 h-5 text-red-500" />}
                                                            {item.type === 'SUCCESS' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                                                            {item.type === 'INFO' && <InformationCircleIcon className="w-5 h-5 text-blue-500" />}
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className={`text-sm font-medium ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                                    {item.title}
                                                                </p>
                                                                {!item.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{item.message}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1.5">{item.time}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-6 text-center text-gray-500 text-sm">暂无通知</div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
                                    <button 
                                        onClick={handleHistoryClick}
                                        className="text-xs text-gray-600 hover:text-gray-800 hover:underline w-full py-1"
                                    >
                                        查看历史通知
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
                
                {/* Global Modals */}
                {selectedNotification && (
                    <NotificationDetailModal 
                        notification={selectedNotification} 
                        onClose={() => setSelectedNotification(null)} 
                    />
                )}
                {isHistoryOpen && (
                    <NotificationHistoryModal 
                        notifications={notifications}
                        onClose={() => setIsHistoryOpen(false)}
                        onSelect={(item) => {
                            handleNotificationClick(item);
                            setIsHistoryOpen(false);
                        }}
                        onMarkAllRead={handleMarkAllRead}
                    />
                )}
            </div>
        </div>
    );
};

// --- Page Components ---

const AuditPage: React.FC<{ setIsChatOpen: (v: boolean) => void }> = ({ setIsChatOpen }) => {
    // Consume Global Context for State Persistence
    const context = React.useContext(AuditContext);
    if (!context) return null;

    const { 
        tasks, selectedTask, detail, loadingDetail, 
        handleSelectTask, handleSubmitDecision,
        drafts, updateDraft
    } = context;

    // Get current draft or default
    const currentDraft = selectedTask && drafts[selectedTask.auditTaskId] 
        ? drafts[selectedTask.auditTaskId] 
        : { result: "PASS" as const, comment: "" };

    return (
        <div className="flex h-full gap-4 p-4">
            <div className="w-72 flex-shrink-0">
                <AuditTaskList 
                    tasks={tasks} 
                    selectedTaskId={selectedTask?.auditTaskId} 
                    onSelect={handleSelectTask} 
                />
            </div>
            <div className="flex-1 min-w-0">
                <AuditTaskDetail 
                    loading={loadingDetail} 
                    detail={detail} 
                    taskId={selectedTask?.auditTaskId} 
                />
            </div>
            <div className="w-80 flex-shrink-0">
                <AuditDecisionPanel 
                    selectedTask={selectedTask} 
                    aiSummary={detail?.aiSummary}
                    onSubmit={handleSubmitDecision}
                    onOpenChat={() => setIsChatOpen(true)}
                    // Controlled props
                    result={currentDraft.result}
                    comment={currentDraft.comment}
                    onResultChange={(val) => selectedTask && updateDraft(selectedTask.auditTaskId, 'result', val)}
                    onCommentChange={(val) => selectedTask && updateDraft(selectedTask.auditTaskId, 'comment', val)}
                />
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <HashRouter>
        {/* Wrap with AuditProvider for persistence */}
        <AuditProvider>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/cockpit" replace />} />
                    <Route path="/cockpit" element={<AICockpitPage />} />
                    <Route path="/audit" element={<AuditPage setIsChatOpen={setIsChatOpen} />} />
                    <Route path="/dashboard" element={<RiskDashboard />} />
                    <Route path="/ledger" element={<LedgerPage />} />
                    <Route path="/services" element={<SmartServicesPage onOpenChat={() => setIsChatOpen(true)} />} />
                    <Route path="/governance" element={<AIDataGovernancePage />} />
                    <Route path="/console" element={<AIConsolePage />} />
                    {/* Document Review Route */}
                    <Route path="/review/:taskId/:fileId" element={<AIDocumentReviewPage />} />
                </Routes>
            </MainLayout>
        </AuditProvider>

        {/* Global AI Chat Drawer */}
        {!window.location.hash.includes('/review') && (
             <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
    </HashRouter>
  );
};

export default App;
