
import React, { useState } from 'react';
import { MOCK_AI_LOGS } from '../constants';
import { 
    CpuChipIcon, 
    SignalIcon, 
    BoltIcon, 
    ServerStackIcon, 
    AdjustmentsHorizontalIcon,
    CommandLineIcon,
    PlayIcon,
    PauseIcon
} from "@heroicons/react/24/outline";

const AIConsolePage: React.FC = () => {
    // Mock State for Toggles
    const [systemStatus, setSystemStatus] = useState({
        auditEnabled: true,
        riskCheckEnabled: true,
        chatEnabled: true,
        reconciliationEnabled: false,
    });

    const [activePromptTab, setActivePromptTab] = useState<'AUDIT' | 'FINANCE' | 'CHAT'>('AUDIT');

    const toggleFeature = (key: keyof typeof systemStatus) => {
        setSystemStatus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const prompts = {
        AUDIT: "你是一个专业的物业维修资金审核专家。请从上传的文档中提取关键要素（金额、日期、单位），并根据《物业管理条例》判断是否存在违规风险。输出格式为 JSON。",
        FINANCE: "你是一个财务对账系统内核。请对比系统流水与银行回单，找出差异项。如果差异金额小于 0.05 元，视为尾差自动忽略。只输出符合 Schema 定义的 JSON 数据。",
        CHAT: "你是一个乐于助人的 AI 助手。请用通俗易懂的中文回答用户的提问。如果涉及法律法规，请优先引用最新政策文件，并给出来源链接。"
    };

    return (
        <div className="h-full overflow-y-auto space-y-6 pr-1">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <SignalIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">API 状态</p>
                        <p className="text-lg font-bold text-gray-800">Online</p>
                        <p className="text-xs text-green-600">延迟 45ms</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <BoltIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">今日调用</p>
                        <p className="text-lg font-bold text-gray-800">1,245 次</p>
                        <p className="text-xs text-gray-500">成功率 99.8%</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <CpuChipIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Token 消耗</p>
                        <p className="text-lg font-bold text-gray-800">8.5M</p>
                        <p className="text-xs text-gray-500">预估成本 ¥12.5</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                        <ServerStackIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">活跃模型</p>
                        <p className="text-lg font-bold text-gray-800">Gemini 3 Pro</p>
                        <p className="text-xs text-gray-500">+ Flash 2.5 (High Speed)</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                        <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-gray-600" />
                        <h3 className="font-semibold text-gray-700">功能开关控制</h3>
                    </div>
                    <div className="p-4 space-y-6 flex-1">
                        <SwitchItem 
                            label="智能审核引擎" 
                            desc="自动分析申请材料并提取关键要素"
                            enabled={systemStatus.auditEnabled} 
                            onChange={() => toggleFeature('auditEnabled')}
                        />
                        <SwitchItem 
                            label="风险预警检测" 
                            desc="基于规则库和AI模型进行双重校验"
                            enabled={systemStatus.riskCheckEnabled} 
                            onChange={() => toggleFeature('riskCheckEnabled')}
                        />
                        <SwitchItem 
                            label="AI 智能助手 (Chat)" 
                            desc="允许用户在侧边栏使用对话功能"
                            enabled={systemStatus.chatEnabled} 
                            onChange={() => toggleFeature('chatEnabled')}
                        />
                         <SwitchItem 
                            label="夜间自动对账" 
                            desc="每日凌晨 02:00 自动执行资金核对"
                            enabled={systemStatus.reconciliationEnabled} 
                            onChange={() => toggleFeature('reconciliationEnabled')}
                        />
                    </div>
                </div>

                {/* Prompt Configuration */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center">
                            <CommandLineIcon className="w-5 h-5 mr-2 text-gray-600" />
                            <h3 className="font-semibold text-gray-700">系统提示词配置 (System Prompt)</h3>
                        </div>
                        <div className="flex space-x-2">
                             {(['AUDIT', 'FINANCE', 'CHAT'] as const).map(tab => (
                                 <button
                                    key={tab}
                                    onClick={() => setActivePromptTab(tab)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                        activePromptTab === tab 
                                        ? 'bg-brand-600 text-white' 
                                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                 >
                                    {tab === 'AUDIT' ? '审核专家' : tab === 'FINANCE' ? '财务内核' : '聊天助手'}
                                 </button>
                             ))}
                        </div>
                    </div>
                    <div className="p-4 flex-1">
                        <textarea 
                            className="w-full h-full min-h-[200px] p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                            value={prompts[activePromptTab]}
                            readOnly
                        />
                        <div className="mt-2 text-xs text-gray-500 flex justify-end">
                            *当前为只读模式，如需修改请联系系统管理员。
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Activity Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 flex items-center">
                        <ServerStackIcon className="w-5 h-5 mr-2 text-gray-600" />
                        AI 实时活动监控
                    </h3>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">模块</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">模型</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">耗时</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {MOCK_AI_LOGS.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.timestamp}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            log.module === 'AUDIT' ? 'bg-blue-100 text-blue-800' :
                                            log.module === 'CHAT' ? 'bg-purple-100 text-purple-800' :
                                            log.module === 'RISK' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{log.latency}ms</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{log.tokens}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {log.status === 'SUCCESS' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                成功
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                失败
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SwitchItem: React.FC<{ label: string; desc: string; enabled: boolean; onChange: () => void }> = ({ label, desc, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{label}</span>
            <span className="text-xs text-gray-500">{desc}</span>
        </div>
        <button
            onClick={onChange}
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                enabled ? 'bg-brand-600' : 'bg-gray-200'
            }`}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    </div>
);

export default AIConsolePage;
