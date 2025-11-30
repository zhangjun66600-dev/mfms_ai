
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeftIcon, 
    DocumentTextIcon, 
    CheckCircleIcon, 
    ClockIcon,
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    PrinterIcon,
    ArrowDownTrayIcon,
    BookmarkIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    EllipsisHorizontalIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { MOCK_DETAIL, MOCK_TASKS } from '../constants';

const AIDocumentReviewPage: React.FC = () => {
    const { taskId, fileId } = useParams();
    const navigate = useNavigate();
    const [scale, setScale] = useState(100);
    const [input, setInput] = useState("");
    
    // Mock Data Retrieval
    const task = MOCK_TASKS.find(t => t.auditTaskId.toString() === taskId);
    const detail = taskId ? MOCK_DETAIL[Number(taskId)] : null;
    const file = detail?.materials?.find(m => m.id === fileId);

    // Mock Chat Messages
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'model',
            text: `预审意见：\n\n【智能决策链】经系统预审，重点监管项目当前账户动态资金池为 ${detail?.baseInfo.balance.toLocaleString()} 元（充足），拟通过资金流重组机制拨付 ${detail?.baseInfo.amount.toLocaleString()} 元解押在建工程，同步触发3月税款缴纳、人力成本支付的智能核销协议。操作后核心账户将维持基础流动性，风险对冲系数较高，建议执行资金释放指令。`
        }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), role: 'user', text: input }]);
        setInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: Date.now()+1, 
                role: 'model', 
                text: "收到您的反馈，已更新审核记录。" 
            }]);
        }, 1000);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Left Sidebar: Navigation & Process */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                <div className="h-14 flex items-center px-4 border-b border-gray-200">
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 text-sm">
                        <ChevronLeftIcon className="w-4 h-4 mr-1" />
                        返回工作台
                    </button>
                </div>
                
                {/* Audit Items Menu */}
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">审核事项</h3>
                    <ul className="space-y-1">
                        <li className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50 cursor-pointer">
                            <span>基本信息</span>
                            <ChevronLeftIcon className="w-3 h-3 rotate-180 text-gray-400" />
                        </li>
                        <li className="flex items-center justify-between px-3 py-2 text-sm bg-blue-50 text-brand-600 font-medium rounded cursor-pointer border-l-4 border-brand-500">
                            <span>{file?.name.split('.')[0] || '资金使用情况表'}</span>
                            <ChevronLeftIcon className="w-3 h-3 rotate-180 text-brand-500" />
                        </li>
                        <li className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50 cursor-pointer">
                            <span>资料上传</span>
                            <ChevronLeftIcon className="w-3 h-3 rotate-180 text-gray-400" />
                        </li>
                    </ul>
                </div>

                {/* Progress Timeline */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">办理进度</h3>
                        <span className="text-xs text-brand-600 cursor-pointer hover:underline">查看</span>
                    </div>
                    <div className="relative pl-4 space-y-6">
                        {/* Vertical Line */}
                        <div className="absolute left-[21px] top-2 bottom-4 w-0.5 bg-gray-200"></div>

                        <TimelineItem status="DONE" label="申请" />
                        <TimelineItem status="DONE" label="交易所接收" />
                        <TimelineItem status="DONE" label="交易所核查" />
                        <TimelineItem status="CURRENT" label="审核" />
                        <TimelineItem status="WAIT" label="业务办结" />
                    </div>
                </div>

                {/* Submission Notes */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-gray-700">业务提交备注</h3>
                        <EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <textarea 
                        className="w-full h-20 text-xs p-2 border border-gray-300 rounded resize-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        placeholder="请输入提交意见..."
                    ></textarea>
                    <div className="flex mt-2 space-x-2">
                         <button className="flex-1 py-1.5 border border-red-200 text-red-600 text-xs rounded hover:bg-red-50 bg-white">
                            退回
                         </button>
                         <button className="flex-1 py-1.5 bg-brand-600 text-white text-xs rounded hover:bg-brand-700">
                            提交
                         </button>
                    </div>
                </div>
            </div>

            {/* Center: Document Viewer */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-200">
                {/* Header/Toolbar */}
                <div className="h-14 bg-white border-b border-gray-200 flex justify-between items-center px-4 shadow-sm z-10">
                    <h2 className="text-lg font-serif font-medium text-gray-800 truncate max-w-md">
                        {file?.name || '预售商品房监管资金使用情况表'}
                    </h2>
                    <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                        <ToolBtn icon={<ArrowPathIcon className="w-4 h-4" />} title="Rotate" />
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <ToolBtn icon={<span className="text-xs font-bold">-</span>} onClick={() => setScale(s => Math.max(50, s - 10))} title="Zoom Out" />
                        <span className="text-xs w-10 text-center select-none">{scale}%</span>
                        <ToolBtn icon={<span className="text-xs font-bold">+</span>} onClick={() => setScale(s => Math.min(200, s + 10))} title="Zoom In" />
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <span className="text-xs px-2 select-none">自动缩放</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                         <PrinterIcon className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                         <ArrowDownTrayIcon className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                         <BookmarkIcon className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                    </div>
                </div>

                {/* Viewer Canvas */}
                <div className="flex-1 overflow-auto p-8 flex justify-center relative custom-scrollbar">
                    <div 
                        className="bg-white shadow-2xl transition-all duration-200 origin-top"
                        style={{ 
                            width: `${800 * (scale / 100)}px`, 
                            height: `${1131 * (scale / 100)}px` // A4 Ratio
                        }}
                    >
                        {/* Mock Document Content */}
                        <div className="w-full h-full p-12 flex flex-col items-center select-none pointer-events-none" style={{ transform: `scale(${scale/100})`, transformOrigin: 'top left', width: '800px', height: '1131px' }}>
                            <h1 className="text-3xl font-serif font-bold mb-4 text-center mt-8">预售商品房监管资金使用情况表</h1>
                            <div className="w-full text-right mb-4 text-sm font-serif">编号：WH-2023-1028-005</div>
                            
                            <table className="w-full border-collapse border border-gray-800 text-sm font-serif">
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-800 p-4 w-24 bg-gray-50 font-bold" rowSpan={3}>企业申请</td>
                                        <td className="border border-gray-800 p-3 w-32 font-bold">房地产开发企业</td>
                                        <td className="border border-gray-800 p-3" colSpan={2}>芜湖{detail?.baseInfo.communityName.substring(0,2) || "某某"}房地产开发有限公司</td>
                                        <td className="border border-gray-800 p-3 w-24 font-bold">项目名称</td>
                                        <td className="border border-gray-800 p-3">{detail?.baseInfo.projectName}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-800 p-3 font-bold">申请事由</td>
                                        <td className="border border-gray-800 p-3" colSpan={4}>提取资金用于办理在建工程解押及支付工程进度款</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-800 p-3 font-bold">申请使用金额</td>
                                        <td className="border border-gray-800 p-3 font-mono text-lg font-bold" colSpan={4}>
                                            ¥ {detail?.baseInfo.amount.toLocaleString()} 
                                            <span className="text-sm font-normal ml-2">(大写: 叁拾贰万圆整)</span>
                                        </td>
                                    </tr>

                                    {/* Mock Rows */}
                                    <tr>
                                        <td className="border border-gray-800 p-4 bg-gray-50 font-bold" rowSpan={4}>项目情况</td>
                                        <td className="border border-gray-800 p-3 text-center">监管项目数/个</td>
                                        <td className="border border-gray-800 p-3 text-center">监管楼栋数/栋</td>
                                        <td className="border border-gray-800 p-3 text-center">已售面积比率</td>
                                        <td className="border border-gray-800 p-3 text-center" colSpan={2}>企业上报目前至竣工所需资金/万元</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-800 p-3 text-center">1</td>
                                        <td className="border border-gray-800 p-3 text-center">6</td>
                                        <td className="border border-gray-800 p-3 text-center">45%</td>
                                        <td className="border border-gray-800 p-3 text-center" colSpan={2}>
                                            <div className="h-20 flex items-end justify-center space-x-2 pb-2">
                                                <div className="w-4 h-12 bg-gray-300"></div>
                                                <div className="w-4 h-8 bg-gray-300"></div>
                                                <div className="w-4 h-16 bg-gray-800"></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-800 p-3" colSpan={5}>
                                            <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400 italic">
                                                [工程进度及交付时间图表占位]
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div className="mt-12 flex justify-between w-full px-8 font-serif">
                                <div>
                                    <p>申请单位（盖章）：</p>
                                    <div className="w-32 h-32 border-2 border-red-500 rounded-full opacity-60 flex items-center justify-center text-red-500 transform -rotate-12 mt-[-20px] ml-4">
                                        <span className="text-xs">专用章</span>
                                    </div>
                                </div>
                                <div className="text-right mt-10">
                                    <p>日期：2023年10月28日</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: AI Assistant */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
                {/* AI Header */}
                <div className="h-14 flex items-center justify-between px-4 bg-brand-50 border-b border-brand-100">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-5 h-5 text-brand-600" />
                        <h2 className="font-bold text-brand-900">AI 政策助手</h2>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6 text-brand-400 cursor-pointer" />
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    <div className="text-center">
                        <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                            柳州市商品房预售资金监管平台
                        </span>
                    </div>
                    
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center mr-2 flex-shrink-0 border border-brand-200">
                                    <SparklesIcon className="w-5 h-5 text-brand-600" />
                                </div>
                            )}
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-brand-600 text-white rounded-br-none' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="请输入内容..."
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm"
                        />
                        <button 
                            onClick={handleSend}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors"
                        >
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </div>
                    
                    {/* Model Switcher / Footer */}
                    <div className="flex items-center justify-between mt-3 px-1">
                        <div className="flex space-x-2">
                            <ModelBadge label="DeepSeek-R1" active />
                            <ModelBadge label="统计模型" />
                            <ModelBadge label="统计图形模式" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shadow-md cursor-pointer hover:bg-brand-700 text-white">
                            <ArrowPathIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const TimelineItem: React.FC<{ status: 'DONE' | 'CURRENT' | 'WAIT'; label: string }> = ({ status, label }) => {
    const icon = status === 'DONE' ? <CheckCircleIcon className="w-5 h-5 text-white" /> : 
                 status === 'CURRENT' ? <ClockIcon className="w-5 h-5 text-white" /> : 
                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>;
    
    const bgColor = status === 'DONE' ? 'bg-green-500' : status === 'CURRENT' ? 'bg-blue-500' : 'bg-white border-2 border-gray-300';
    const textColor = status === 'WAIT' ? 'text-gray-400' : 'text-gray-700';

    return (
        <div className="flex items-center relative z-10">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                {icon}
            </div>
            <span className={`ml-3 text-sm font-medium ${textColor}`}>{label}</span>
        </div>
    );
}

const ToolBtn: React.FC<{ icon: React.ReactNode; onClick?: () => void; title?: string }> = ({ icon, onClick, title }) => (
    <button 
        onClick={onClick}
        title={title}
        className="p-1.5 hover:bg-white rounded hover:shadow-sm text-gray-500 hover:text-gray-800 transition-all"
    >
        {icon}
    </button>
);

const ModelBadge: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] border cursor-pointer transition-colors ${
        active 
        ? 'bg-brand-100 border-brand-200 text-brand-700 font-bold' 
        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
    }`}>
        {label}
    </span>
)

export default AIDocumentReviewPage;
