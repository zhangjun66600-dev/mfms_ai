

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuditDetailType, RuleExec, ExtractBlock, MaterialFile, ApportionmentItem } from "../types";
import { 
    BuildingOffice2Icon, 
    ScaleIcon, 
    PaperClipIcon,
    SparklesIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    TableCellsIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  loading: boolean;
  detail: AuditDetailType | null;
  taskId?: number;
}

const AuditTaskDetail: React.FC<Props> = ({ loading, detail, taskId }) => {
  const navigate = useNavigate();
  const [analyzingFileId, setAnalyzingFileId] = useState<string | null>(null);
  const [isApportionModalOpen, setIsApportionModalOpen] = useState(false);

  const handleAIAssist = (file: MaterialFile) => {
      if (!taskId) return;
      setAnalyzingFileId(file.id);
      
      // Simulate brief loading before navigation
      setTimeout(() => {
          setAnalyzingFileId(null);
          // Navigate to the Document Review Page
          navigate(`/review/${taskId}/${file.id}`);
      }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-sm border border-gray-200 text-gray-400">
        <DocumentTextIcon className="w-12 h-12 mb-2 opacity-50" />
        <p>请选择左侧任务查看详情</p>
      </div>
    );
  }

  // Calculate generic data for chart based on rules
  const ruleStats = [
      { name: '通过', value: detail.rules.filter(r => r.result === 'PASS').length, color: '#22c55e' },
      { name: '失败', value: detail.rules.filter(r => r.result === 'FAIL').length, color: '#ef4444' }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 overflow-y-auto pr-1">
      {/* Base Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                <BuildingOffice2Icon className="w-4 h-4 mr-2 text-brand-500" />
                项目概况
            </h3>
            {detail.apportionmentList && (
                <button 
                    onClick={() => setIsApportionModalOpen(true)}
                    className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
                >
                    <TableCellsIcon className="w-3.5 h-3.5 mr-1.5" />
                    查看分摊明细
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <InfoItem label="小区名称" value={detail.baseInfo.communityName} />
          <InfoItem label="项目名称" value={detail.baseInfo.projectName} />
          <InfoItem label="申请金额" value={`¥${detail.baseInfo.amount.toLocaleString()}`} />
          <InfoItem label="账户余额" value={`¥${detail.baseInfo.balance.toLocaleString()}`} />
          <InfoItem label="申请类型" value={detail.baseInfo.applyType} />
          <InfoItem 
            label="紧急程度" 
            value={detail.baseInfo.emergencyFlag === "Y" ? "紧急" : "一般"} 
            highlight={detail.baseInfo.emergencyFlag === "Y"}
          />
        </div>
      </div>

      {/* AI Extraction Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <DocumentTextIcon className="w-4 h-4 mr-2 text-brand-500" />
            AI 文档抽取结果
        </h3>
        <div className="space-y-3">
            {detail.extracts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detail.extracts.map((ex, idx) => (
                         <div key={idx} className="border border-gray-100 rounded-md overflow-hidden">
                            <div className="bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 border-b border-gray-100 uppercase tracking-wider">
                                {ex.type === 'decision' ? '决议要素' : 
                                 ex.type === 'contract' ? '合同要素' : 
                                 ex.type === 'budget' ? '预算要素' : 
                                 ex.type === 'refund' ? '退款申请要素' : '发票/支付凭证'}
                            </div>
                            <pre className="p-2 text-xs text-gray-600 bg-white overflow-x-auto font-mono">
                                {JSON.stringify(ex.json, null, 2)}
                            </pre>
                         </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">暂无抽取结果。</p>
            )}
        </div>
      </div>

      {/* Application Materials List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <PaperClipIcon className="w-4 h-4 mr-2 text-brand-500" />
            申请材料清单
        </h3>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">文件名称 / 大小</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">上传节点</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">属性</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">状态</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">AI 辅助</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {detail.materials && detail.materials.length > 0 ? detail.materials.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                        <div className="text-xs text-gray-500">{file.size}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {file.node}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                {file.isRequired && (
                                    <span className="text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">
                                        必要
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                {file.status === 'PASS' ? (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                                ) : file.status === 'FAIL' ? (
                                    <XCircleIcon className="w-5 h-5 text-red-500 mx-auto" />
                                ) : (
                                    <ExclamationCircleIcon className="w-5 h-5 text-orange-500 mx-auto" />
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                <button
                                    onClick={() => handleAIAssist(file)}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {analyzingFileId === file.id ? (
                                        <SparklesIcon className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-3 h-3 mr-1" />
                                            辅助审查
                                        </>
                                    )}
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm italic">
                                暂无上传材料
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Rules Engine & Visuals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                <ScaleIcon className="w-4 h-4 mr-2 text-brand-500" />
                规则自动校验
            </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
            {/* Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">编号</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">规则名称</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">结果</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {detail.rules.map((rule) => (
                            <tr key={rule.ruleCode}>
                                <td className="px-3 py-2 whitespace-nowrap text-gray-500">{rule.ruleCode}</td>
                                <td className="px-3 py-2 text-gray-800">{rule.ruleDesc}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {rule.result === "PASS" ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            通过
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            不通过
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-2 text-gray-500 text-xs">{rule.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Chart */}
            <div className="w-full lg:w-1/3 h-32 lg:h-auto border-l border-gray-100 pl-0 lg:pl-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ruleStats} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                            {ruleStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

        {/* Apportionment Modal */}
        {isApportionModalOpen && detail.apportionmentList && (
            <ApportionmentModal 
                isOpen={isApportionModalOpen}
                onClose={() => setIsApportionModalOpen(false)}
                data={detail.apportionmentList}
                totalAmount={detail.baseInfo.amount}
            />
        )}
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`font-medium ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
  </div>
);

const ApportionmentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    data: ApportionmentItem[];
    totalAmount: number;
}> = ({ isOpen, onClose, data, totalAmount }) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    if (!isOpen) return null;

    const filteredData = data.filter(item => 
        item.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <TableCellsIcon className="w-5 h-5 mr-2 text-brand-600" />
                        维修资金分摊明细
                    </h3>
                    <div className="flex items-center space-x-2">
                         <div className="relative">
                            <input 
                                type="text" 
                                placeholder="搜索房号或业主..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500 w-48"
                            />
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
                         </div>
                         <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md" title="导出明细">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                         </button>
                         <div className="w-px h-6 bg-gray-300 mx-2"></div>
                         <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-0">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房号</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">业主姓名</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">建筑面积 (㎡)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">分摊金额 (元)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? filteredData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{item.roomNo}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{item.ownerName}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-600">{item.area.toFixed(2)}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-800">¥ {item.amount.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        未找到匹配的分摊记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                        共 <span className="font-bold text-gray-800">{data.length}</span> 户，当前显示 <span className="font-bold text-gray-800">{filteredData.length}</span> 户
                    </div>
                    <div className="flex space-x-6">
                        <div className="text-gray-500">
                            分摊总额: <span className="font-bold text-brand-600 text-lg ml-1">¥ {totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditTaskDetail;