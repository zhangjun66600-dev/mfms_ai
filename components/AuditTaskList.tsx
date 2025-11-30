import React from "react";
import { AuditTaskItem } from "../types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
  tasks: AuditTaskItem[];
  selectedTaskId?: number;
  onSelect: (task: AuditTaskItem) => void;
}

const riskColorMap: Record<AuditTaskItem["riskLevel"], string> = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-orange-100 text-orange-700 border-orange-200",
  LOW: "bg-green-100 text-green-700 border-green-200",
};

const riskBadgeColor: Record<AuditTaskItem["riskLevel"], string> = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-orange-400",
    LOW: "bg-green-500",
  };

const AuditTaskList: React.FC<Props> = ({ tasks, selectedTaskId, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-700 text-sm">待审任务（按风险优先）</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {tasks.map((task) => {
            const isSelected = task.auditTaskId === selectedTaskId;
            return (
                <div
                    key={task.auditTaskId}
                    onClick={() => onSelect(task)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group relative ${
                        isSelected
                        ? "bg-brand-50 border-brand-200 shadow-sm"
                        : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${riskBadgeColor[task.riskLevel]}`} />
                            <span className="text-xs font-medium text-gray-600 truncate max-w-[120px]" title={task.communityName}>
                                {task.communityName}
                            </span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${riskColorMap[task.riskLevel]}`}>
                            {task.riskLevel === "HIGH" ? "高风险" : task.riskLevel === "MEDIUM" ? "中风险" : "低风险"}
                        </span>
                    </div>
                    <div className="mb-2">
                        <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-brand-700' : 'text-gray-800'}`}>
                            {task.projectName}
                        </h4>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>¥{task.amount.toLocaleString()}</span>
                        <span>ID: {task.auditTaskId}</span>
                    </div>
                    {isSelected && (
                         <ChevronRightIcon className="w-4 h-4 text-brand-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default AuditTaskList;