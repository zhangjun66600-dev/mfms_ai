
import React, { useState } from 'react';
import { 
    SparklesIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ExclamationTriangleIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    TableCellsIcon,
    BuildingOffice2Icon
} from "@heroicons/react/24/outline";
import { DataErrorItem } from '../types';
import { MOCK_DATA_ERRORS } from '../constants';
import { repairPropertyData } from '../services/geminiService';

const AIDataGovernancePage: React.FC = () => {
    const [dataErrors, setDataErrors] = useState<DataErrorItem[]>(MOCK_DATA_ERRORS);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [filterType, setFilterType] = useState<string>('ALL');

    // Filter Logic
    const filteredErrors = dataErrors.filter(err => filterType === 'ALL' || err.type === filterType);

    // Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(filteredErrors.map(err => err.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(i => i !== id));
        } else {
            setSelectedItems(prev => [...prev, id]);
        }
    };

    const handleAnalyze = async () => {
        const itemsToProcess = dataErrors.filter(err => selectedItems.includes(err.id) && err.status === 'PENDING');
        if (itemsToProcess.length === 0) return;

        setIsAnalyzing(true);
        try {
            const processed = await repairPropertyData(itemsToProcess);
            setDataErrors(prev => prev.map(p => {
                const updated = processed.find(u => u.id === p.id);
                return updated || p;
            }));
        } catch (e) {
            console.error("Analysis failed", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApprove = (id: string) => {
        setDataErrors(prev => prev.map(item => item.id === id ? { ...item, status: 'FIXED' } : item));
        setSelectedItems(prev => prev.filter(i => i !== id));
    };

    const handleReject = (id: string) => {
        setDataErrors(prev => prev.map(item => item.id === id ? { ...item, status: 'IGNORED' } : item));
        setSelectedItems(prev => prev.filter(i => i !== id));
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 p-6 overflow-hidden">
             {/* Header */}
             <div className="mb-6 flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <SparklesIcon className="w-8 h-8 mr-3 text-brand-600" />
                        AI 数据治理中心
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 ml-11">
                        智能识别并修复基础数据错误，需人工确认后生效。
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <FunnelIcon className="w-4 h-4 mr-2" />
                        筛选
                    </button>
                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || selectedItems.length === 0}
                        className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isAnalyzing ? (
                            <>
                                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                正在分析...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                批量 AI 修复 ({selectedItems.length})
                            </>
                        )}
                    </button>
                </div>
             </div>

             {/* Stats Cards */}
             <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
                 <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                     <div>
                         <p className="text-xs text-gray-500 uppercase font-bold">待处理异常</p>
                         <p className="text-2xl font-bold text-gray-800">{dataErrors.filter(e => e.status === 'PENDING').length}</p>
                     </div>
                     <div className="p-2 bg-orange-50 rounded-full text-orange-500"><ExclamationTriangleIcon className="w-6 h-6" /></div>
                 </div>
                 <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                     <div>
                         <p className="text-xs text-gray-500 uppercase font-bold">待人工审核</p>
                         <p className="text-2xl font-bold text-brand-600">{dataErrors.filter(e => e.status === 'ANALYZED').length}</p>
                     </div>
                     <div className="p-2 bg-brand-50 rounded-full text-brand-500"><MagnifyingGlassIcon className="w-6 h-6" /></div>
                 </div>
                 <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                     <div>
                         <p className="text-xs text-gray-500 uppercase font-bold">已修复数据</p>
                         <p className="text-2xl font-bold text-green-600">{dataErrors.filter(e => e.status === 'FIXED').length}</p>
                     </div>
                     <div className="p-2 bg-green-50 rounded-full text-green-500"><CheckCircleIcon className="w-6 h-6" /></div>
                 </div>
                 <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                     <div>
                         <p className="text-xs text-gray-500 uppercase font-bold">总扫描量</p>
                         <p className="text-2xl font-bold text-gray-800">12,450</p>
                     </div>
                     <div className="p-2 bg-gray-100 rounded-full text-gray-500"><TableCellsIcon className="w-6 h-6" /></div>
                 </div>
             </div>

             {/* Main Table */}
             <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                 <div className="flex border-b border-gray-200">
                     {['ALL', 'COMMUNITY', 'ADDRESS', 'FLOOR', 'OWNER', 'DOOR_NO'].map(type => (
                         <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                filterType === type 
                                ? 'border-brand-600 text-brand-600 bg-brand-50' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                         >
                            {type === 'ALL' ? '全部' : 
                             type === 'COMMUNITY' ? '所属小区' :
                             type === 'ADDRESS' ? '房屋坐落' : 
                             type === 'FLOOR' ? '楼层信息' : 
                             type === 'OWNER' ? '业主信息' : '门牌缺失'}
                         </button>
                     ))}
                 </div>
                 
                 <div className="flex-1 overflow-y-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50 sticky top-0 z-10">
                             <tr>
                                 <th className="px-6 py-3 text-left">
                                     <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === filteredErrors.length && filteredErrors.length > 0}
                                     />
                                 </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">异常类型</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关联对象</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">原始数据</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI 建议修复值</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI 分析理由</th>
                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                             </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {filteredErrors.map((item) => (
                                 <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        {item.status !== 'FIXED' && item.status !== 'IGNORED' && (
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        )}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                             item.type === 'COMMUNITY' ? 'bg-red-100 text-red-800' :
                                             item.type === 'ADDRESS' ? 'bg-purple-100 text-purple-800' :
                                             item.type === 'FLOOR' ? 'bg-blue-100 text-blue-800' :
                                             'bg-orange-100 text-orange-800'
                                         }`}>
                                             {item.type === 'COMMUNITY' ? '所属小区错误' :
                                              item.type === 'ADDRESS' ? '坐落错误' : 
                                              item.type === 'FLOOR' ? '楼层错误' : 
                                              item.type === 'OWNER' ? '业主信息' : '门牌缺失'}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         <div className="text-sm font-medium text-gray-900">{item.communityName}</div>
                                         <div className="text-xs text-gray-500">{item.location}</div>
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 line-through decoration-red-300">
                                         {item.originalValue}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         {item.suggestedValue ? (
                                             <div className="flex flex-col">
                                                 <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 w-fit">
                                                     {item.suggestedValue}
                                                 </span>
                                                 {item.confidence && (
                                                     <span className="text-[10px] text-gray-400 mt-1">
                                                         置信度: {(item.confidence * 100).toFixed(0)}%
                                                     </span>
                                                 )}
                                             </div>
                                         ) : (
                                             <span className="text-xs text-gray-400 italic">等待分析...</span>
                                         )}
                                     </td>
                                     <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                         {item.reasoning ? (
                                             <p className="truncate hover:whitespace-normal hover:bg-white hover:absolute hover:z-20 hover:shadow-lg hover:border hover:p-2 hover:rounded">
                                                 {item.reasoning}
                                             </p>
                                         ) : (
                                             <span className="text-gray-300">-</span>
                                         )}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-center">
                                         {item.status === 'ANALYZED' ? (
                                             <div className="flex justify-center space-x-2">
                                                 <button 
                                                    onClick={() => handleApprove(item.id)}
                                                    className="p-1 text-green-600 hover:bg-green-100 rounded-full" 
                                                    title="确认修复"
                                                 >
                                                     <CheckCircleIcon className="w-6 h-6" />
                                                 </button>
                                                 <button 
                                                    onClick={() => handleReject(item.id)}
                                                    className="p-1 text-red-500 hover:bg-red-100 rounded-full" 
                                                    title="驳回"
                                                 >
                                                     <XCircleIcon className="w-6 h-6" />
                                                 </button>
                                             </div>
                                         ) : item.status === 'FIXED' ? (
                                             <span className="text-xs font-bold text-green-600 flex items-center justify-center">
                                                 <CheckCircleIcon className="w-4 h-4 mr-1" /> 已修复
                                             </span>
                                         ) : item.status === 'IGNORED' ? (
                                             <span className="text-xs font-bold text-gray-400">已忽略</span>
                                         ) : (
                                            <button 
                                                onClick={() => {
                                                    if(!selectedItems.includes(item.id)) setSelectedItems(prev => [...prev, item.id]);
                                                    handleAnalyze();
                                                }}
                                                className="text-xs text-brand-600 hover:underline"
                                            >
                                                立即分析
                                            </button>
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

export default AIDataGovernancePage;
