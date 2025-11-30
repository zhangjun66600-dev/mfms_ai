

import React, { useState } from 'react';
import { MOCK_LEDGER_ENTRIES } from '../constants';
import { generateReconciliationReport } from '../services/geminiService';
import { ReconciliationConfig, ReconciliationFrequency, ReconciliationReport, ReconciliationDetailItem } from '../types';
import { 
    ArrowDownCircleIcon, 
    ArrowUpCircleIcon, 
    FunnelIcon, 
    CpuChipIcon,
    XMarkIcon,
    CheckBadgeIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ScaleIcon,
    EyeIcon,
    WrenchScrewdriverIcon,
    DocumentMagnifyingGlassIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

const SCOPE_OPTIONS = [
    { id: 'DEPOSIT', label: '网点交存' },
    { id: 'USAGE', label: '资金使用' },
    { id: 'REFUND', label: '退款' },
    { id: 'INTEREST', label: '季度结息' },
    { id: 'BANK_STMT', label: '银行账户流水' },
];

const LedgerPage: React.FC = () => {
    const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
    
    return (
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
             {/* Header / Filter Toolbar */}
             <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-800">资金台账明细</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                        共 {MOCK_LEDGER_ENTRIES.length} 条记录
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsReconcileModalOpen(true)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                    >
                        <CpuChipIcon className="w-4 h-4 mr-2" />
                        AI 智能对账
                    </button>
                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">
                        <FunnelIcon className="w-4 h-4 mr-2" />
                        筛选
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 rounded hover:bg-brand-700 shadow-sm">
                        导出报表
                    </button>
                </div>
             </div>

             {/* Table */}
             <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                日期
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                小区名称
                            </th>
                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                业务类型
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                发生金额 (元)
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                结余 (元)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                摘要
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {MOCK_LEDGER_ENTRIES.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {entry.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {entry.communityName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        entry.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {entry.type === 'INCOME' ? (
                                             <ArrowUpCircleIcon className="w-3 h-3 mr-1" />
                                        ) : (
                                             <ArrowDownCircleIcon className="w-3 h-3 mr-1" />
                                        )}
                                        {entry.category}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                    entry.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {entry.type === 'INCOME' ? '+' : '-'}{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                    {entry.balanceSnapshot.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={entry.description}>
                                    {entry.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             {/* Reconciliation Modal */}
             {isReconcileModalOpen && (
                 <ReconciliationModal onClose={() => setIsReconcileModalOpen(false)} />
             )}
        </div>
    );
};

// --- Sub-Components ---

const ReconciliationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [step, setStep] = useState<'CONFIG' | 'PROCESSING' | 'RESULT'>('CONFIG');
    const [config, setConfig] = useState<ReconciliationConfig>({
        frequency: 'DAILY',
        date: new Date().toISOString().split('T')[0],
        scope: SCOPE_OPTIONS.map(o => o.label)
    });
    const [report, setReport] = useState<ReconciliationReport | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    
    // For Detail Interaction
    const [selectedDetailItem, setSelectedDetailItem] = useState<ReconciliationDetailItem | null>(null);
    const [detailAction, setDetailAction] = useState<'VIEW' | 'HANDLE' | null>(null);

    const handleScopeChange = (label: string) => {
        setConfig(prev => {
            if (prev.scope.includes(label)) {
                return { ...prev, scope: prev.scope.filter(s => s !== label) };
            } else {
                return { ...prev, scope: [...prev.scope, label] };
            }
        });
    };

    const startReconciliation = async () => {
        setStep('PROCESSING');
        setErrorMsg("");
        try {
            const result = await generateReconciliationReport(
                config.frequency === 'DAILY' ? '日对账' : config.frequency === 'MONTHLY' ? '月对账' : '年对账',
                config.date,
                config.scope
            );
            if (result) {
                setReport(result);
                setStep('RESULT');
            } else {
                throw new Error("Empty report");
            }
        } catch (e) {
            setErrorMsg("对账过程中发生错误，请重试。");
            setStep('RESULT');
        }
    };

    const handleAction = (item: ReconciliationDetailItem, action: 'VIEW' | 'HANDLE') => {
        setSelectedDetailItem(item);
        setDetailAction(action);
    };

    const closeDetailModal = () => {
        setSelectedDetailItem(null);
        setDetailAction(null);
    };

    const submitResolution = (resolution: { type: string; comment: string }) => {
        if (!report || !selectedDetailItem) return;
        
        const updatedDetails = report.details.map(item => {
            if (item.category === selectedDetailItem.category && item.diff === selectedDetailItem.diff) {
                return {
                    ...item,
                    resolution: {
                        ...resolution,
                        timestamp: new Date().toISOString(),
                        user: '王审核员'
                    },
                };
            }
            return item;
        });

        setReport({
            ...report,
            details: updatedDetails
        });
        closeDetailModal();
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-indigo-600 text-white flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <CpuChipIcon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">AI 智能对账助手</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    {step === 'CONFIG' && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto space-y-6">
                            {/* Frequency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">对账周期</label>
                                <div className="flex space-x-4">
                                    {(['DAILY', 'MONTHLY', 'YEARLY'] as ReconciliationFrequency[]).map(freq => (
                                        <label key={freq} className={`flex-1 border rounded-md p-3 flex items-center justify-center cursor-pointer transition-all ${
                                            config.frequency === freq ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                        }`}>
                                            <input 
                                                type="radio" 
                                                name="frequency" 
                                                className="hidden" 
                                                checked={config.frequency === freq} 
                                                onChange={() => setConfig({...config, frequency: freq})}
                                            />
                                            <span className="font-medium">
                                                {freq === 'DAILY' ? '日对账' : freq === 'MONTHLY' ? '月对账' : '年对账'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">对账时间</label>
                                <input 
                                    type={config.frequency === 'YEARLY' ? 'number' : config.frequency === 'MONTHLY' ? 'month' : 'date'}
                                    value={config.date}
                                    onChange={(e) => setConfig({...config, date: e.target.value})}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder={config.frequency === 'YEARLY' ? 'YYYY' : ''}
                                />
                            </div>

                            {/* Scope */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">对账范围（多选）</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SCOPE_OPTIONS.map(option => (
                                        <label key={option.id} className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={config.scope.includes(option.label)}
                                                onChange={() => handleScopeChange(option.label)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-700 text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                         <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <CpuChipIcon className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-medium text-gray-800 animate-pulse">AI 正在核对海量账目数据...</p>
                                <p className="text-sm text-gray-500">正在分析系统流水与银行回单 ({config.date})</p>
                            </div>
                         </div>
                    )}

                    {step === 'RESULT' && report && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className={`p-4 rounded-lg border shadow-sm flex flex-col justify-between ${
                                    report.summary.status === 'BALANCED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                }`}>
                                    <div className="text-xs font-medium uppercase tracking-wider mb-1 text-gray-500">对账状态</div>
                                    <div className={`text-xl font-bold flex items-center ${
                                        report.summary.status === 'BALANCED' ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                        {report.summary.status === 'BALANCED' ? <CheckBadgeIcon className="w-6 h-6 mr-2" /> : <ExclamationTriangleIcon className="w-6 h-6 mr-2" />}
                                        {report.summary.status === 'BALANCED' ? '平账' : '发现差异'}
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="text-xs font-medium text-gray-500 mb-1">总笔数</div>
                                    <div className="text-2xl font-bold text-gray-800">{report.summary.totalCount}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="text-xs font-medium text-gray-500 mb-1">系统总额</div>
                                    <div className="text-2xl font-bold text-gray-800">¥{report.summary.totalSystemAmount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="text-xs font-medium text-gray-500 mb-1">银行总额</div>
                                    <div className="text-2xl font-bold text-gray-800">¥{report.summary.totalBankAmount.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* AI Analysis Section */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-indigo-100 rounded-full blur-xl opacity-50"></div>
                                <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center relative z-10">
                                    <SparklesIcon className="w-5 h-5 mr-2 text-indigo-600" />
                                    AI 对账分析报告
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div>
                                        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">主要差异描述</span>
                                        <p className="mt-1 text-sm text-gray-800 leading-relaxed bg-white/50 p-2 rounded border border-indigo-50/50">
                                            {report.analysis.issueDescription}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">智能处理建议</span>
                                        <p className="mt-1 text-sm text-gray-800 leading-relaxed bg-white/50 p-2 rounded border border-indigo-50/50">
                                            {report.analysis.suggestion}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Table */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center">
                                    <ScaleIcon className="w-4 h-4 mr-2 text-gray-500" />
                                    <h4 className="text-sm font-semibold text-gray-700">分项核对详情</h4>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">业务类型</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">系统金额</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">银行金额</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">差异</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {report.details.map((item, idx) => (
                                            <tr key={idx} className={item.status === 'MISMATCH' && !item.resolution ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">¥{item.systemAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">¥{item.bankAmount.toLocaleString()}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                                                    item.diff !== 0 ? 'text-red-600' : 'text-gray-400'
                                                }`}>
                                                    {item.diff !== 0 ? `${item.diff > 0 ? '+' : ''}${item.diff.toLocaleString()}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {item.status === 'MATCH' ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            匹配
                                                        </span>
                                                    ) : item.resolution ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            已处理
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            异常
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.resolution ? (
                                                        <span className="text-blue-600 font-medium text-xs">原因: {item.resolution.type}</span>
                                                    ) : (
                                                        item.note || '-'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-2">
                                                        <button 
                                                            onClick={() => handleAction(item, 'VIEW')}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                                                            title="查看详情"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        {item.status === 'MISMATCH' && !item.resolution && (
                                                            <button 
                                                                onClick={() => handleAction(item, 'HANDLE')}
                                                                className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                                                                title="差异处理"
                                                            >
                                                                <WrenchScrewdriverIcon className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === 'RESULT' && !report && errorMsg && (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <ExclamationTriangleIcon className="w-12 h-12 mb-2" />
                            <p>{errorMsg}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 flex-shrink-0">
                    {step === 'CONFIG' && (
                        <>
                            <button 
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                取消
                            </button>
                            <button 
                                onClick={startReconciliation}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                开始对账
                            </button>
                        </>
                    )}
                    {step === 'RESULT' && (
                        <button 
                            onClick={() => setStep('CONFIG')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                        >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            重新对账
                        </button>
                    )}
                </div>

                {/* Nested Detail/Handle Modal */}
                {selectedDetailItem && detailAction && (
                    <ItemDetailModal 
                        item={selectedDetailItem} 
                        action={detailAction} 
                        onClose={closeDetailModal}
                        onSubmitResolution={submitResolution}
                    />
                )}
            </div>
        </div>
    );
};

const ItemDetailModal: React.FC<{
    item: ReconciliationDetailItem;
    action: 'VIEW' | 'HANDLE';
    onClose: () => void;
    onSubmitResolution: (data: { type: string; comment: string }) => void;
}> = ({ item, action, onClose, onSubmitResolution }) => {
    const [resolutionType, setResolutionType] = useState('银行未达账');
    const [comment, setComment] = useState('');

    // Generate mock transaction logs for view mode
    const mockLogs = Array.from({ length: 5 }).map((_, i) => ({
        id: `TRX-${Date.now()}-${i}`,
        time: `10:${30 + i}:00`,
        desc: `${item.category} - 交易流水 ${i + 1}`,
        sysAmt: (item.systemAmount / 5).toFixed(2),
        bankAmt: action === 'VIEW' && i === 4 && item.diff !== 0 
            ? ((item.systemAmount / 5) - item.diff).toFixed(2) // Simulate diff in last item
            : (item.systemAmount / 5).toFixed(2),
    }));

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-8">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl flex flex-col max-h-full">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                        {action === 'VIEW' ? <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2 text-indigo-600" /> : <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-orange-600" />}
                        {action === 'VIEW' ? `明细查看 - ${item.category}` : `差异处理 - ${item.category}`}
                    </h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {action === 'VIEW' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                <div className="p-3 bg-gray-50 rounded border">
                                    <div className="text-xs text-gray-500">系统金额</div>
                                    <div className="font-bold">¥{item.systemAmount.toLocaleString()}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border">
                                    <div className="text-xs text-gray-500">银行金额</div>
                                    <div className="font-bold">¥{item.bankAmount.toLocaleString()}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border">
                                    <div className="text-xs text-gray-500">差异</div>
                                    <div className={`font-bold ${item.diff !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ¥{item.diff.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-gray-500">流水号</th>
                                        <th className="px-3 py-2 text-left text-gray-500">摘要</th>
                                        <th className="px-3 py-2 text-right text-gray-500">系统记录</th>
                                        <th className="px-3 py-2 text-right text-gray-500">银行记录</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {mockLogs.map(log => (
                                        <tr key={log.id}>
                                            <td className="px-3 py-2 text-gray-600 font-mono text-xs">{log.id}</td>
                                            <td className="px-3 py-2 text-gray-800">{log.desc}</td>
                                            <td className="px-3 py-2 text-right text-gray-600">{log.sysAmt}</td>
                                            <td className={`px-3 py-2 text-right ${log.sysAmt !== log.bankAmt ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                                {log.bankAmt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {item.diff !== 0 && (
                                <p className="text-xs text-gray-500 italic mt-2">* 仅展示主要流水，模拟数据。</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                             <div className="bg-orange-50 border border-orange-100 p-3 rounded text-sm text-orange-800 mb-4">
                                当前存在差异 <strong>¥{item.diff.toLocaleString()}</strong>，请选择原因进行平账处理。
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">差异原因</label>
                                <select 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    value={resolutionType}
                                    onChange={(e) => setResolutionType(e.target.value)}
                                >
                                    <option>银行未达账</option>
                                    <option>系统录入错误</option>
                                    <option>手续费差异</option>
                                    <option>重复记账</option>
                                    <option>其他原因</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">处理备注</label>
                                <textarea 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    rows={4}
                                    placeholder="请详细描述处理意见..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white"
                    >
                        关闭
                    </button>
                    {action === 'HANDLE' && (
                        <button 
                            onClick={() => onSubmitResolution({ type: resolutionType, comment })}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm"
                        >
                            确认处理
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LedgerPage;
