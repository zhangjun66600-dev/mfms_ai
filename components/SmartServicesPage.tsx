

import React, { useState } from 'react';
import { 
    ChatBubbleLeftRightIcon, 
    DocumentTextIcon, 
    SparklesIcon, 
    ArrowRightIcon, 
    PencilSquareIcon,
    ArrowPathIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import { extractApplicationData } from '../services/geminiService';
import { ApplicationForm } from '../types';

interface Props {
    onOpenChat: () => void;
}

const SmartServicesPage: React.FC<Props> = ({ onOpenChat }) => {
    const [view, setView] = useState<'HOME' | 'FORM'>('HOME');

    return (
        <div className="h-full bg-gray-50 p-6 overflow-y-auto">
            {view === 'HOME' ? (
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center space-y-2 mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">AI 智能服务中心</h2>
                        <p className="text-gray-500">选择您需要的智能辅助服务，提升工作效率</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Smart Q&A Card */}
                        <div 
                            onClick={onOpenChat}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ChatBubbleLeftRightIcon className="w-32 h-32 text-indigo-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4 text-indigo-600">
                                    <ChatBubbleLeftRightIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">智能问答助手</h3>
                                <p className="text-gray-500 mb-6">
                                    基于 Gemini Pro 模型的对话助手。您可以咨询政策法规、查询维修资金使用规则，或进行复杂的风险分析。
                                </p>
                                <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                                    立即咨询 <ArrowRightIcon className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* Smart Form Filling Card */}
                        <div 
                            onClick={() => setView('FORM')}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <DocumentTextIcon className="w-32 h-32 text-green-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="p-3 bg-green-100 rounded-lg w-fit mb-4 text-green-600">
                                    <PencilSquareIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">智能填单</h3>
                                <p className="text-gray-500 mb-6">
                                    上传合同文本、会议纪要或粘贴纯文本，AI 自动提取关键要素并填充申请表单，减少人工录入错误。
                                </p>
                                <div className="flex items-center text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                                    开始填单 <ArrowRightIcon className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <SmartFormFilling onBack={() => setView('HOME')} />
            )}
        </div>
    );
};

const SmartFormFilling: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [sourceText, setSourceText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState<ApplicationForm>({
        communityName: "",
        projectName: "",
        applyAmount: 0,
        constructionCompany: "",
        contactPerson: "",
        contactPhone: "",
        emergencyType: "N",
        description: ""
    });

    const handleExtract = async () => {
        if (!sourceText.trim()) return;
        setIsProcessing(true);
        try {
            const result = await extractApplicationData(sourceText);
            if (result) {
                setFormData(result);
            }
        } catch (error) {
            console.error(error);
            alert("AI 提取失败，请重试");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between flex-shrink-0">
                <button 
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowRightIcon className="w-4 h-4 mr-1 rotate-180" />
                    返回服务中心
                </button>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-green-600" />
                    智能表单填充
                </h2>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left: Input Area */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">原始资料文本 (粘贴合同/会议纪要/申请书)</label>
                    <textarea 
                        className="flex-1 w-full p-4 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                        placeholder="在此粘贴文本内容，例如：
关于阳光花园A栋电梯维修的申请说明
我小区阳光花园A栋3单元电梯故障，经业委会决议，委托上海迅达电梯有限公司进行紧急维修。
预计维修费用为 125,000 元，联系人张三，电话 13800138000。
特此申请使用维修资金..."
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={handleExtract}
                            disabled={isProcessing || !sourceText.trim()}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                        >
                            {isProcessing ? (
                                <>
                                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                    AI 分析中...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-4 h-4 mr-2" />
                                    AI 识别提取
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right: Form Area */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col p-6 overflow-y-auto">
                    <div className="mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">申请表单预览</h3>
                        {formData.communityName && !isProcessing && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                已自动填充
                            </span>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">小区名称</label>
                                <input 
                                    type="text" 
                                    value={formData.communityName}
                                    onChange={(e) => setFormData({...formData, communityName: e.target.value})}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">维修项目名称</label>
                                <input 
                                    type="text" 
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">申请金额 (元)</label>
                                <input 
                                    type="number" 
                                    value={formData.applyAmount}
                                    onChange={(e) => setFormData({...formData, applyAmount: Number(e.target.value)})}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">是否紧急维修</label>
                                <select 
                                    value={formData.emergencyType}
                                    onChange={(e) => setFormData({...formData, emergencyType: e.target.value as 'Y'|'N'})}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="N">否</option>
                                    <option value="Y">是</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">施工单位</label>
                            <input 
                                type="text" 
                                value={formData.constructionCompany}
                                onChange={(e) => setFormData({...formData, constructionCompany: e.target.value})}
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">联系人</label>
                                <input 
                                    type="text" 
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">联系电话</label>
                                <input 
                                    type="text" 
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">申请事项描述</label>
                            <textarea 
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                             <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                重置
                             </button>
                             <button className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm hover:bg-brand-700 shadow-sm">
                                提交申请
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartServicesPage;