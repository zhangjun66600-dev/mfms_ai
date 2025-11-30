import React from "react";
import { AuditTaskItem } from "../types";
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ArrowUturnLeftIcon, 
    SparklesIcon 
} from "@heroicons/react/24/outline";

interface Props {
  selectedTask: AuditTaskItem | null;
  aiSummary?: string;
  onOpenChat: () => void;
  // Controlled props for persistence
  result: "PASS" | "REJECT" | "RETURN";
  comment: string;
  onResultChange: (val: "PASS" | "REJECT" | "RETURN") => void;
  onCommentChange: (val: string) => void;
  onSubmit: (decision: {
    result: "PASS" | "REJECT" | "RETURN";
    comment: string;
  }) => void;
}

const AuditDecisionPanel: React.FC<Props> = ({ 
    selectedTask, 
    aiSummary, 
    onSubmit, 
    onOpenChat,
    result,
    comment,
    onResultChange,
    onCommentChange
}) => {

  const handleSubmit = () => {
    if (!selectedTask) return;
    onSubmit({ result, comment });
    // Resetting is handled by parent context if needed, or we just rely on task switch
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-700 text-sm">人工审核</h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto">
         {/* AI Insight Box */}
         <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 relative">
            <div className="flex items-center mb-2">
                <SparklesIcon className="w-4 h-4 text-indigo-600 mr-1" />
                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide">AI 洞察</h4>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
                {aiSummary || "请选择任务以生成 AI 分析..."}
            </p>
            <button 
                onClick={onOpenChat}
                className="mt-3 w-full text-xs bg-white border border-indigo-200 text-indigo-700 py-1.5 rounded shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center"
            >
                <SparklesIcon className="w-3 h-3 mr-1" />
                询问助手 / 检索法规
            </button>
         </div>

         {/* Form */}
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审核结论</label>
                <div className="grid grid-cols-3 gap-2">
                    <DecisionButton 
                        type="PASS" 
                        current={result} 
                        onClick={() => onResultChange("PASS")} 
                        icon={<CheckCircleIcon className="w-4 h-4"/>} 
                        label="通过" 
                        color="green"
                    />
                    <DecisionButton 
                        type="REJECT" 
                        current={result} 
                        onClick={() => onResultChange("REJECT")} 
                        icon={<XCircleIcon className="w-4 h-4"/>} 
                        label="驳回" 
                        color="red"
                    />
                    <DecisionButton 
                        type="RETURN" 
                        current={result} 
                        onClick={() => onResultChange("RETURN")} 
                        icon={<ArrowUturnLeftIcon className="w-4 h-4"/>} 
                        label="退回补正" 
                        color="yellow"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审核意见</label>
                <textarea 
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                    placeholder="请输入最终审核意见，可参考上方的 AI 分析..."
                />
            </div>
         </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button 
            disabled={!selectedTask}
            onClick={handleSubmit}
            className="w-full bg-brand-600 text-white py-2 rounded-md font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
            提交审核
        </button>
      </div>
    </div>
  );
};

const DecisionButton: React.FC<{
    type: string; 
    current: string; 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string;
    color: 'green' | 'red' | 'yellow';
}> = ({ type, current, onClick, icon, label, color }) => {
    const isSelected = type === current;
    
    // Tailwind specific color mappings
    const activeClasses = {
        green: "bg-green-600 text-white ring-green-600",
        red: "bg-red-600 text-white ring-red-600",
        yellow: "bg-yellow-500 text-white ring-yellow-500",
    };

    const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-md border text-xs font-medium transition-all duration-200 ${
                isSelected ? `border-transparent ring-2 ring-offset-1 ${activeClasses[color]}` : inactiveClasses
            }`}
        >
            <div className="mb-1">{icon}</div>
            {label}
        </button>
    );
}

export default AuditDecisionPanel;