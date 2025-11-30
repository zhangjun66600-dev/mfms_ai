

import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { DASHBOARD_DATA, DASHBOARD_KPI, RISK_SCATTER_DATA, RECENT_ALERTS, MOCK_TASKS } from '../constants';
import { 
    ShieldExclamationIcon, 
    ArrowTrendingUpIcon, 
    ExclamationTriangleIcon,
    BanknotesIcon,
    DocumentCheckIcon,
    BoltIcon,
    SparklesIcon,
    BuildingOffice2Icon,
    MapIcon,
    ChevronDownIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

const RiskDashboard: React.FC = () => {
    // Hierarchy State
    const [selectedLevel, setSelectedLevel] = useState<'CITY' | 'DISTRICT' | 'STREET' | 'COMMUNITY'>('CITY');
    const [selectedDistrict, setSelectedDistrict] = useState('全市');
    
    // KPI Modal State
    const [activeKpiModal, setActiveKpiModal] = useState<'TOTAL' | 'HIGH_RISK' | null>(null);
    
    const handleLevelChange = (level: 'CITY' | 'DISTRICT' | 'STREET' | 'COMMUNITY', name: string) => {
        setSelectedLevel(level);
        setSelectedDistrict(name);
    };

    // Mock data adjustment based on level (Visual simulation only)
    const multiplier = selectedLevel === 'CITY' ? 1 : selectedLevel === 'DISTRICT' ? 0.3 : 0.05;
    
    return (
        <div className="h-full flex flex-col bg-gray-50/50 relative">
            {/* Hierarchy Filter Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center space-x-2 shadow-sm flex-shrink-0 sticky top-0 z-10">
                <MapIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">当前视图:</span>
                
                {/* Level 1: City */}
                <div className="relative group">
                    <button 
                        onClick={() => handleLevelChange('CITY', '全市')}
                        className={`flex items-center px-3 py-1.5 text-sm rounded transition-colors ${selectedLevel === 'CITY' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <span>上海市</span>
                    </button>
                </div>
                <span className="text-gray-300">/</span>

                {/* Level 2: District */}
                <div className="relative group">
                    <button 
                        className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded transition-colors ${selectedLevel === 'DISTRICT' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <span>{selectedLevel === 'CITY' ? '选择区县' : selectedDistrict}</span>
                        <ChevronDownIcon className="w-3 h-3 text-gray-400" />
                    </button>
                    {/* Mock Dropdown */}
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-20">
                        {['浦东新区', '黄浦区', '徐汇区', '静安区'].map(d => (
                            <div 
                                key={d} 
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleLevelChange('DISTRICT', d)}
                            >
                                {d}
                            </div>
                        ))}
                    </div>
                </div>
                <span className="text-gray-300">/</span>
                
                {/* Level 3: Street (Mock) */}
                <button className="px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed">选择街道</button>
                <span className="text-gray-300">/</span>
                
                {/* Level 4: Community (Mock) */}
                <button className="px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed">选择小区</button>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard 
                        icon={<DocumentCheckIcon className="w-6 h-6 text-blue-600" />}
                        title={DASHBOARD_KPI.totalAudits.label}
                        value={Math.floor(typeof DASHBOARD_KPI.totalAudits.value === 'number' ? DASHBOARD_KPI.totalAudits.value * multiplier : 0).toLocaleString()}
                        trend={DASHBOARD_KPI.totalAudits.trend}
                        trendUp={true}
                        color="blue"
                        onClick={() => setActiveKpiModal('TOTAL')}
                    />
                    <KpiCard 
                        icon={<ShieldExclamationIcon className="w-6 h-6 text-red-600" />}
                        title={DASHBOARD_KPI.highRiskCount.label}
                        value={Math.floor(typeof DASHBOARD_KPI.highRiskCount.value === 'number' ? DASHBOARD_KPI.highRiskCount.value * multiplier : 0).toLocaleString()}
                        trend={DASHBOARD_KPI.highRiskCount.trend}
                        trendUp={false}
                        color="red"
                        onClick={() => setActiveKpiModal('HIGH_RISK')}
                    />
                    <KpiCard 
                        icon={<BanknotesIcon className="w-6 h-6 text-green-600" />}
                        title={DASHBOARD_KPI.moneySaved.label}
                        value={`¥${(DASHBOARD_KPI.moneySaved.value * multiplier / 10000).toFixed(1)}万`}
                        trend={DASHBOARD_KPI.moneySaved.trend}
                        trendUp={true}
                        color="green"
                    />
                    <KpiCard 
                        icon={<BoltIcon className="w-6 h-6 text-purple-600" />}
                        title={DASHBOARD_KPI.autoPassRate.label}
                        value={DASHBOARD_KPI.autoPassRate.value}
                        trend={DASHBOARD_KPI.autoPassRate.trend}
                        trendUp={true}
                        color="purple"
                    />
                </div>

                {/* AI Insight Bar */}
                <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-lg p-4 flex items-start space-x-3 shadow-sm">
                    <SparklesIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900 mb-1">AI {selectedDistrict} 风险研判</h4>
                        <p className="text-sm text-indigo-800 leading-relaxed">
                            {selectedLevel === 'CITY' 
                                ? "今日高风险申请主要集中在电梯大修类目，其中“金色年代”小区存在报价异常聚集现象。建议重点审查该小区近期提交的所有工程预算单。" 
                                : `检测到 ${selectedDistrict} 某街道防水修缮申请量激增 20%，需关注是否存在集中套现风险。建议对该区域的施工单位进行关联性排查。`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Risk Trend (Line Chart) */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-gray-700 font-semibold flex items-center">
                                <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-brand-600" />
                                {selectedDistrict} 风险趋势 (近6个月)
                            </h3>
                            <select className="text-xs border-gray-300 rounded shadow-sm focus:ring-brand-500 focus:border-brand-500">
                                <option>最近半年</option>
                                <option>本年度</option>
                            </select>
                        </div>
                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart 
                                    data={DASHBOARD_DATA.monthlyTrend.map(d => ({...d, count: Math.floor(d.count * multiplier), highRisk: Math.floor(d.highRisk * multiplier)}))} 
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line type="monotone" dataKey="count" name="申请总数" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                    <Line type="monotone" dataKey="highRisk" name="高风险数" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Risk Distribution (Pie) */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                        <h3 className="text-gray-700 font-semibold mb-4 flex items-center w-full">
                            <ShieldExclamationIcon className="w-5 h-5 mr-2 text-brand-600" />
                            风险分布 ({selectedDistrict})
                        </h3>
                        <div className="w-full h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={DASHBOARD_DATA.riskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({percent}) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {DASHBOARD_DATA.riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-gray-800">100%</span>
                                    <span className="text-xs text-gray-500">全覆盖</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Community Risk Scatter Plot */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
                        <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                            <BuildingOffice2Icon className="w-5 h-5 mr-2 text-brand-600" />
                            重点小区风险画像
                        </h3>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" dataKey="x" name="申请次数" unit="次" tick={{fontSize: 10}} />
                                    <YAxis type="number" dataKey="y" name="涉及金额" unit="元" tick={{fontSize: 10}} tickFormatter={(val) => `${val/10000}万`} />
                                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="风险指数" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />
                                    <Scatter name="小区" data={RISK_SCATTER_DATA} fill="#8884d8">
                                        {RISK_SCATTER_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.risk === 'HIGH' ? '#ef4444' : entry.risk === 'MEDIUM' ? '#f97316' : '#22c55e'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">圆点大小代表综合风险指数，颜色代表风险等级</p>
                    </div>

                    {/* Violation Types Bar Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
                        <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-brand-600" />
                            违规类型 TOP 5
                        </h3>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={DASHBOARD_DATA.violationTypes}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb"/>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fill: '#374151', fontSize: 12}} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        cursor={{fill: '#f3f4f6'}}
                                    />
                                    <Bar dataKey="count" name="违规数量" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#6b7280' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Alerts List */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-1 flex flex-col">
                        <h3 className="text-gray-700 font-semibold mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <BoltIcon className="w-5 h-5 mr-2 text-brand-600" />
                                实时风险预警
                            </div>
                            <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {RECENT_ALERTS.map((alert) => (
                                <div key={alert.id} className="p-3 bg-gray-50 rounded border border-gray-100 flex items-start space-x-3">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${alert.level === 'HIGH' ? 'bg-red-500' : 'bg-orange-400'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-gray-700 truncate">{alert.community}</span>
                                            <span className="text-[10px] text-gray-400">{alert.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-snug">{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2 text-xs text-brand-600 bg-brand-50 hover:bg-brand-100 rounded transition-colors font-medium">
                            查看全部预警日志
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Detail Modal */}
            {activeKpiModal && (
                <KpiDetailModal 
                    type={activeKpiModal} 
                    onClose={() => setActiveKpiModal(null)} 
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const KpiCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    trend: string;
    trendUp: boolean;
    color: 'blue' | 'red' | 'green' | 'purple';
    onClick?: () => void;
}> = ({ icon, title, value, trend, trendUp, color, onClick }) => {
    const bgColors = {
        blue: 'bg-blue-50 border-blue-100',
        red: 'bg-red-50 border-red-100',
        green: 'bg-green-50 border-green-100',
        purple: 'bg-purple-50 border-purple-100',
    };

    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-lg border shadow-sm flex items-center justify-between transition-all duration-200 ${bgColors[color]} ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
        >
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                        {trend}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1">较上月</span>
                </div>
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">
                {icon}
            </div>
        </div>
    );
}

const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded text-xs">
          <p className="font-bold text-gray-800 mb-1">{data.name}</p>
          <p className="text-gray-600">申请: {data.x} 次</p>
          <p className="text-gray-600">金额: ¥{data.y.toLocaleString()}</p>
          <p className="text-gray-600">风险分: {data.z}</p>
          <span className={`mt-1 inline-block px-1.5 rounded text-[10px] text-white ${
              data.risk === 'HIGH' ? 'bg-red-500' : data.risk === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'
          }`}>
              {data.risk === 'HIGH' ? '高风险' : data.risk === 'MEDIUM' ? '中风险' : '低风险'}
          </span>
        </div>
      );
    }
    return null;
};

const KpiDetailModal: React.FC<{ type: 'TOTAL' | 'HIGH_RISK'; onClose: () => void }> = ({ type, onClose }) => {
    // Generate detail list based on type
    const title = type === 'TOTAL' ? '累计审核任务明细' : '高风险拦截明细';
    
    // Create more mock data for display purposes
    const listData = Array.from({ length: 15 }).map((_, i) => {
        const base = MOCK_TASKS[i % MOCK_TASKS.length];
        // If High Risk view, force high risk
        const riskLevel = type === 'HIGH_RISK' ? 'HIGH' : base.riskLevel;
        
        return {
            ...base,
            id: `${base.auditTaskId}-${i}`,
            submissionDate: `2023-10-${25 - i > 0 ? 25 - i : 1}`,
            amount: type === 'HIGH_RISK' ? base.amount * 1.5 : base.amount
        };
    }).filter(item => type === 'TOTAL' || item.riskLevel === 'HIGH');

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        {type === 'TOTAL' ? (
                             <DocumentCheckIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                             <ShieldExclamationIcon className="w-5 h-5 text-red-600" />
                        )}
                        <h3 className="font-bold text-gray-800">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-0 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请日期</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">小区名称</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">项目名称</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">金额</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">风险等级</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {listData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.submissionDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.communityName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{item.projectName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">¥{item.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            item.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' : 
                                            item.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {item.riskLevel === 'HIGH' ? '高风险' : item.riskLevel === 'MEDIUM' ? '中风险' : '低风险'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {item.status === 'DONE' ? '已完成' : item.status === 'RUNNING' ? '审核中' : '待审核'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-right rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RiskDashboard;
