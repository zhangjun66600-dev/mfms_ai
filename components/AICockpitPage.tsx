

import React, { useState, useEffect } from 'react';
import { 
    MapIcon, 
    BuildingOffice2Icon, 
    HomeIcon, 
    ChevronLeftIcon,
    ExclamationTriangleIcon,
    CurrencyYenIcon,
    TableCellsIcon,
    UserCircleIcon,
    CreditCardIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    ClockIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { MOCK_COMMUNITIES, WUHU_REGIONS, MOCK_BUILDING } from '../constants';
import { GISRegion, CommunityGIS, BuildingInfo, RoomUnit } from '../types';

const AICockpitPage: React.FC = () => {
    const [viewLevel, setViewLevel] = useState<'CITY' | 'DISTRICT' | 'COMMUNITY' | 'BUILDING'>('CITY');
    const [selectedRegion, setSelectedRegion] = useState<GISRegion | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<CommunityGIS | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<RoomUnit | null>(null);
    
    // Building Table Generator
    const generateRooms = (floors: number, units: number): RoomUnit[] => {
        const rooms: RoomUnit[] = [];
        for (let f = 1; f <= floors; f++) {
            for (let u = 1; u <= units; u++) {
                const roomNo = `${f}0${u}`;
                const isPaid = Math.random() > 0.15;
                const isSigned = Math.random() > 0.05;
                const area = 85 + Math.floor(Math.random() * 50);
                const balance = isPaid ? area * 100 : 0;
                
                rooms.push({
                    roomId: `${f}-${u}`,
                    roomNo,
                    floor: f,
                    area: area,
                    ownerName: `业主${f}${u}`,
                    ownerIdMasked: `3402**********${Math.floor(1000 + Math.random() * 9000)}`,
                    phoneMasked: `138****${Math.floor(1000 + Math.random() * 9000)}`,
                    deedNo: `WH${20230000 + Math.floor(Math.random() * 10000)}`,
                    fundStatus: isPaid ? 'PAID' : Math.random() > 0.5 ? 'PARTIAL' : 'UNPAID',
                    netSignStatus: isSigned ? 'SIGNED' : 'UNSIGNED',
                    balance: balance,
                    transactions: [
                        { id: 'TX1', date: '2023-01-15', type: 'DEPOSIT', amount: balance, summary: '首期交存' },
                        ...(Math.random() > 0.8 ? [{ id: 'TX2', date: '2023-06-20', type: 'INTEREST', amount: 45.2, summary: '季度结息' } as any] : []),
                        ...(Math.random() > 0.9 ? [{ id: 'TX3', date: '2023-10-10', type: 'USE', amount: -200, summary: '分摊：电梯维修' } as any] : [])
                    ]
                });
            }
        }
        return rooms;
    };

    // Initialize mock building rooms when entering building view
    useEffect(() => {
        if (viewLevel === 'BUILDING' && !selectedBuilding?.rooms.length) {
            const rooms = generateRooms(6, 4);
            setSelectedBuilding(prev => prev ? ({ ...prev, rooms }) : null);
        }
    }, [viewLevel]);

    const handleRegionClick = (region: GISRegion) => {
        setSelectedRegion(region);
        setViewLevel('DISTRICT');
    };

    const handleCommunityClick = (comm: CommunityGIS) => {
        setSelectedCommunity(comm);
        setViewLevel('COMMUNITY');
    };

    const handleBuildingClick = () => {
        setSelectedBuilding(MOCK_BUILDING);
        setViewLevel('BUILDING');
    };

    const goBack = () => {
        if (viewLevel === 'BUILDING') setViewLevel('COMMUNITY');
        else if (viewLevel === 'COMMUNITY') setViewLevel('DISTRICT');
        else if (viewLevel === 'DISTRICT') {
            setViewLevel('CITY');
            setSelectedRegion(null);
        }
    };

    return (
        <div className="h-full flex bg-gray-50 overflow-hidden font-sans">
            {/* Left Sidebar: Stats */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-lg flex-shrink-0">
                <div className="p-5 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold flex items-center text-slate-800">
                        <MapIcon className="w-6 h-6 mr-2 text-brand-600" />
                        AI 驾驶舱
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">芜湖市物业维修资金监管数字孪生</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {/* Stats Panels based on Level */}
                    {viewLevel === 'CITY' || viewLevel === 'DISTRICT' ? (
                        <CityStats />
                    ) : viewLevel === 'COMMUNITY' ? (
                        <CommunityStats community={selectedCommunity!} />
                    ) : (
                        <BuildingStats building={selectedBuilding!} />
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-100">
                {/* Unified Header / Navigation Bar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm z-30 flex-shrink-0">
                    <div className="flex items-center space-x-2 overflow-hidden">
                        {viewLevel !== 'CITY' && (
                            <button 
                                onClick={goBack}
                                className="mr-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                                title="返回上级"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                        )}
                        
                        {/* Breadcrumbs */}
                        <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                            <span 
                                className={`flex items-center ${viewLevel === 'CITY' ? 'font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded' : 'cursor-pointer hover:text-brand-600 transition-colors'}`} 
                                onClick={() => {if(viewLevel !== 'CITY') {setViewLevel('CITY'); setSelectedRegion(null);}}}
                            >
                                <MapIcon className="w-4 h-4 mr-1" />
                                芜湖市
                            </span>
                            
                            {selectedRegion && (
                                <>
                                    <span className="mx-1 text-gray-300">/</span>
                                    <span 
                                        className={viewLevel === 'DISTRICT' ? 'font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded' : 'cursor-pointer hover:text-brand-600 transition-colors'} 
                                        onClick={() => setViewLevel('DISTRICT')}
                                    >
                                        {selectedRegion.name}
                                    </span>
                                </>
                            )}
                            
                            {selectedCommunity && viewLevel !== 'CITY' && viewLevel !== 'DISTRICT' && (
                                <>
                                    <span className="mx-1 text-gray-300">/</span>
                                    <span 
                                        className={viewLevel === 'COMMUNITY' ? 'font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded' : 'cursor-pointer hover:text-brand-600 transition-colors'} 
                                        onClick={() => setViewLevel('COMMUNITY')}
                                    >
                                        {selectedCommunity.name}
                                    </span>
                                </>
                            )}
                            
                             {selectedBuilding && viewLevel === 'BUILDING' && (
                                <>
                                    <span className="mx-1 text-gray-300">/</span>
                                    <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                                        {selectedBuilding.name}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Tools */}
                    <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-400 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            数据更新: 刚刚
                        </span>
                    </div>
                </div>

                {/* Viewport */}
                <div className="flex-1 relative overflow-hidden">
                    {viewLevel === 'CITY' || viewLevel === 'DISTRICT' ? (
                        <MapSimulator 
                            level={viewLevel} 
                            activeRegionId={selectedRegion?.id}
                            onRegionClick={handleRegionClick}
                            onCommunityClick={handleCommunityClick}
                        />
                    ) : viewLevel === 'COMMUNITY' ? (
                        <CommunityView 
                            community={selectedCommunity!} 
                            onBuildingClick={handleBuildingClick}
                        />
                    ) : (
                        <BuildingTableView 
                            building={selectedBuilding!} 
                            onRoomClick={(room) => setSelectedRoom(room)}
                        />
                    )}
                </div>
            </div>
            
            {/* Right Panel: Details Slide-in */}
            {(viewLevel === 'COMMUNITY' || viewLevel === 'BUILDING') && (
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 shadow-lg flex-shrink-0 animate-slide-in-right">
                    <div className="p-4 border-b border-gray-100 font-semibold text-gray-800 bg-gray-50/50 flex items-center justify-between">
                        <span>{viewLevel === 'COMMUNITY' ? '小区详情概览' : '楼栋综合数据'}</span>
                        <TableCellsIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                         {viewLevel === 'COMMUNITY' ? (
                             <CommunityDetailPanel community={selectedCommunity!} />
                         ) : (
                             <BuildingDetailPanel building={selectedBuilding!} />
                         )}
                    </div>
                </div>
            )}

            {/* Room Detail Modal */}
            {selectedRoom && (
                <RoomDetailModal 
                    room={selectedRoom} 
                    onClose={() => setSelectedRoom(null)} 
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const MapSimulator: React.FC<{ 
    level: 'CITY' | 'DISTRICT'; 
    activeRegionId?: string;
    onRegionClick: (r: GISRegion) => void; 
    onCommunityClick: (c: CommunityGIS) => void;
}> = ({ level, activeRegionId, onRegionClick, onCommunityClick }) => {
    // Determine zones
    const zones = WUHU_REGIONS;
    
    // Filter communities
    const showCommunities = level === 'DISTRICT';
    const communities = showCommunities ? MOCK_COMMUNITIES.filter(c => 
        (activeRegionId === '340202' && c.district === '镜湖区') ||
        (activeRegionId === '340203' && c.district === '弋江区') ||
        (activeRegionId === '340207' && c.district === '鸠江区') ||
        (activeRegionId === '340208' && c.district === '三山经开区') ||
        (activeRegionId === '340221' && c.district === '湾沚区')
    ) : [];

    // Focus ViewBox calculation
    let viewBox = "0 0 1000 1000";
    if (level === 'DISTRICT' && activeRegionId) {
        // Zoom into the selected district roughly based on its center
        const region = zones.find(z => z.id === activeRegionId);
        if (region) {
            const [cx, cy] = region.center;
            viewBox = `${cx - 200} ${cy - 200} 400 400`;
        }
    }

    return (
        <div className="w-full h-full bg-slate-900 relative overflow-hidden group">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <svg 
                className="w-full h-full transition-all duration-1000 ease-in-out"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Render Regions */}
                {zones.map(region => {
                    const isActive = region.id === activeRegionId;
                    const isDimmed = level === 'DISTRICT' && !isActive;

                    return (
                        <g 
                            key={region.id} 
                            onClick={() => onRegionClick(region)}
                            className={`cursor-pointer transition-all duration-500 ${isDimmed ? 'opacity-20' : 'opacity-90 hover:opacity-100'}`}
                        >
                            <path 
                                d={region.path} 
                                fill={region.color} 
                                stroke="white" 
                                strokeWidth="2"
                                className="drop-shadow-lg hover:brightness-110 transition-all"
                            />
                            {/* Region Label */}
                            {(!isDimmed || isActive) && (
                                <g pointerEvents="none">
                                    <text 
                                        x={region.center[0]} 
                                        y={region.center[1]} 
                                        textAnchor="middle" 
                                        fill="white" 
                                        fontSize={level === 'DISTRICT' ? 14 : 24} 
                                        fontWeight="bold"
                                        className="drop-shadow-md select-none font-sans"
                                    >
                                        {region.name}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* Render Communities (Pins) */}
                {showCommunities && communities.map(comm => (
                    <g 
                        key={comm.id}
                        onClick={(e) => { e.stopPropagation(); onCommunityClick(comm); }}
                        className="cursor-pointer hover:scale-110 transition-transform origin-center"
                    >
                         {/* Pulse Effect */}
                        {comm.repairStatus === 'CRITICAL' && (
                             <circle cx={comm.position[0]} cy={comm.position[1]} r="25" fill="rgba(239, 68, 68, 0.5)">
                                <animate attributeName="r" from="10" to="35" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                             </circle>
                        )}
                        
                        {/* Pin Body */}
                        <path 
                            d={`M${comm.position[0]-10},${comm.position[1]-25} L${comm.position[0]+10},${comm.position[1]-25} L${comm.position[0]},${comm.position[1]} Z`} 
                            fill={comm.repairStatus === 'CRITICAL' ? '#ef4444' : comm.repairStatus === 'WARNING' ? '#f97316' : '#22c55e'}
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle cx={comm.position[0]} cy={comm.position[1]-25} r="12" fill="white" />
                        <text 
                            x={comm.position[0]} 
                            y={comm.position[1]-21} 
                            textAnchor="middle" 
                            fontSize="10" 
                            fontWeight="bold" 
                            fill="#333"
                        >
                            {comm.totalBuildings}
                        </text>
                        
                        {/* Label */}
                        <rect 
                            x={comm.position[0]-40} 
                            y={comm.position[1]+5} 
                            width="80" 
                            height="20" 
                            rx="4" 
                            fill="rgba(15, 23, 42, 0.8)" 
                            stroke="#475569" 
                            strokeWidth="0.5"
                        />
                        <text 
                            x={comm.position[0]} 
                            y={comm.position[1]+19} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="10"
                        >
                            {comm.name}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-4 rounded-lg border border-slate-700 text-xs text-white z-30 shadow-xl">
                <div className="font-bold mb-3 text-slate-300 border-b border-slate-700 pb-2">图例说明</div>
                <div className="space-y-2">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2 border border-white"></span>维修资金正常</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-500 mr-2 border border-white"></span>余额预警</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2 border border-white animate-pulse"></span>资金不足/欠缴</div>
                </div>
            </div>
        </div>
    );
};

const CommunityView: React.FC<{ community: CommunityGIS; onBuildingClick: () => void }> = ({ community, onBuildingClick }) => {
    // Generate grid of buildings with mock stats
    const buildings = Array.from({ length: community.totalBuildings }).map((_, i) => ({
        id: `B${i+1}`,
        name: `${i+1}号楼`,
        status: i === 0 ? 'ALERT' : 'NORMAL', // Mock alert on first building
        households: 24 + Math.floor(Math.random() * 20),
        balance: 500000 + Math.floor(Math.random() * 500000),
        paidCount: 20 + Math.floor(Math.random() * 10),
        pendingApps: i === 0 ? 2 : 0
    }));

    return (
        <div className="w-full h-full bg-gray-50 p-8 overflow-y-auto">
             <div className="mb-6 flex items-end">
                <h1 className="text-2xl font-bold text-slate-800 mr-4 flex items-center">
                    <BuildingOffice2Icon className="w-8 h-8 mr-2 text-brand-600" />
                    {community.name}
                </h1>
                <p className="text-slate-500 text-sm mb-1 pb-1">楼栋全景视图</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                 {buildings.map(b => (
                     <div 
                        key={b.id}
                        className="group relative"
                     >
                        {/* Hover Popover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-white text-gray-800 text-xs rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 p-3">
                            <div className="font-bold text-sm mb-2 text-brand-700 border-b border-gray-100 pb-1">{b.name} 数据概览</div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">房屋户数:</span>
                                    <span className="font-medium">{b.households} 户</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">账户余额:</span>
                                    <span className="font-medium text-green-600">¥{(b.balance/10000).toFixed(1)}万</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">缴存情况:</span>
                                    <span className="font-medium">{b.paidCount}/{b.households}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">待审申请:</span>
                                    <span className={`font-medium ${b.pendingApps > 0 ? 'text-red-500' : 'text-gray-700'}`}>{b.pendingApps} 单</span>
                                </div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></div>
                        </div>

                        {/* Card */}
                        <div
                            onClick={onBuildingClick}
                            className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center aspect-square ${
                                b.status === 'ALERT' ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-brand-300'
                            }`}
                        >
                            <div className="relative">
                                <BuildingOffice2Icon className={`w-12 h-12 mb-2 transition-colors ${b.status === 'ALERT' ? 'text-red-500' : 'text-slate-300 group-hover:text-brand-400'}`} />
                                {b.pendingApps > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                                        {b.pendingApps}
                                    </span>
                                )}
                            </div>
                            <span className="font-bold text-slate-700">{b.name}</span>
                            
                            {/* Mini Status Bar */}
                            <div className="w-full mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${(b.paidCount/b.households)*100}%` }}></div>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">缴存率 {Math.round((b.paidCount/b.households)*100)}%</div>
                        </div>
                     </div>
                 ))}
                 
                 {/* Placeholder for "More" */}
                 <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center aspect-square text-gray-400 text-sm bg-gray-50/50">
                    <span className="text-xs">二期规划中...</span>
                 </div>
             </div>
        </div>
    );
};

const BuildingTableView: React.FC<{ 
    building: BuildingInfo; 
    onRoomClick: (room: RoomUnit) => void;
}> = ({ building, onRoomClick }) => {
    const [mode, setMode] = useState<'FUND' | 'NET_SIGN'>('FUND');

    return (
        <div className="w-full h-full bg-white p-6 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <HomeIcon className="w-7 h-7 mr-2 text-brand-600" />
                        {building.name} 楼盘表
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 ml-9">
                        共 {building.totalFloors} 层 {building.rooms.length} 户 | 
                        <span className="text-green-600 ml-2 font-medium">账户余额充足</span>
                    </p>
                 </div>
                 <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                     <button 
                        onClick={() => setMode('FUND')}
                        className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center ${mode === 'FUND' ? 'bg-white shadow-sm text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        <CurrencyYenIcon className="w-4 h-4 mr-1.5" />
                        维修资金状态
                     </button>
                     <button 
                        onClick={() => setMode('NET_SIGN')}
                        className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center ${mode === 'NET_SIGN' ? 'bg-white shadow-sm text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                        网签备案状态
                     </button>
                 </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto border border-gray-200 rounded-xl bg-gray-50 p-6 shadow-inner custom-scrollbar">
                 <div className="inline-block min-w-full">
                     {Array.from({ length: building.totalFloors }).reverse().map((_, fIndex) => {
                         const floorNum = building.totalFloors - fIndex;
                         const floorRooms = building.rooms.filter(r => r.floor === floorNum);
                         
                         return (
                             <div key={floorNum} className="flex mb-3">
                                 {/* Floor Label */}
                                 <div className="w-20 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 bg-white rounded-l-lg border border-r-0 border-gray-200 mr-1 shadow-sm text-sm">
                                     {floorNum} 层
                                 </div>
                                 {/* Rooms */}
                                 <div className="flex space-x-2">
                                     {floorRooms.map(room => (
                                         <div 
                                            key={room.roomId}
                                            onClick={() => onRoomClick(room)}
                                            className={`w-32 h-20 rounded border flex flex-col items-center justify-center text-xs cursor-pointer hover:scale-105 transition-all relative shadow-sm group ${
                                                mode === 'FUND' 
                                                    ? (room.fundStatus === 'PAID' ? 'bg-green-50 border-green-200 text-green-900' 
                                                        : room.fundStatus === 'PARTIAL' ? 'bg-yellow-50 border-yellow-200 text-yellow-900' 
                                                        : 'bg-red-50 border-red-200 text-red-900')
                                                    : (room.netSignStatus === 'SIGNED' ? 'bg-blue-50 border-blue-200 text-blue-900' 
                                                        : 'bg-gray-100 border-gray-200 text-gray-400')
                                            }`}
                                         >
                                             <span className="font-bold text-sm mb-1">{room.roomNo}</span>
                                             <div className="flex items-center space-x-2 opacity-70">
                                                 <span>{room.area}㎡</span>
                                                 {/* Status Indicator Dot */}
                                                 <span className={`w-2 h-2 rounded-full ${
                                                     mode === 'FUND' 
                                                        ? (room.fundStatus === 'PAID' ? 'bg-green-500' : room.fundStatus === 'PARTIAL' ? 'bg-yellow-500' : 'bg-red-500')
                                                        : (room.netSignStatus === 'SIGNED' ? 'bg-blue-500' : 'bg-gray-400')
                                                 }`}></span>
                                             </div>
                                             
                                             {/* Hover Overlay Hint */}
                                             <div className="absolute inset-0 bg-black/5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] shadow-sm font-medium text-gray-800">查看详情</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         );
                     })}
                 </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex space-x-6 text-xs text-gray-600 flex-shrink-0 bg-gray-50 p-3 rounded-lg border border-gray-200 justify-center">
                {mode === 'FUND' ? (
                    <>
                        <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-sm mr-2"></span> 已缴清</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-sm mr-2"></span> 部分缴纳</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-sm mr-2"></span> 未缴/欠缴</div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></span> 已网签</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-gray-400 rounded-sm mr-2"></span> 未网签</div>
                    </>
                )}
            </div>
        </div>
    );
};

const RoomDetailModal: React.FC<{ room: RoomUnit; onClose: () => void }> = ({ room, onClose }) => {
    const [activeTab, setActiveTab] = useState<'INFO' | 'ACCOUNT' | 'LOGS'>('INFO');

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <HomeIcon className="w-6 h-6 mr-2 text-brand-600" />
                            {room.roomNo}室 详情档案
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 ml-8">房屋编号: {room.roomId} | 建筑面积: {room.area}㎡</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-5">
                    {[
                        { id: 'INFO', label: '房屋及业主信息', icon: UserCircleIcon },
                        { id: 'ACCOUNT', label: '资金账户信息', icon: CreditCardIcon },
                        { id: 'LOGS', label: '交易流水记录', icon: ClipboardDocumentListIcon },
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id 
                                    ? 'border-brand-600 text-brand-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-white flex-1 min-h-0">
                    {activeTab === 'INFO' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                                    <UserCircleIcon className="w-5 h-5 mr-2" />
                                    业主信息
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">业主姓名:</span> <span className="font-medium ml-2">{room.ownerName}</span></div>
                                    <div><span className="text-gray-500">联系电话:</span> <span className="font-medium ml-2">{room.phoneMasked}</span></div>
                                    <div className="col-span-2"><span className="text-gray-500">身份证号:</span> <span className="font-medium ml-2">{room.ownerIdMasked}</span></div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                                    房屋及产证信息
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">不动产权证号:</span> <span className="font-medium ml-2">{room.deedNo}</span></div>
                                    <div><span className="text-gray-500">房屋用途:</span> <span className="font-medium ml-2">住宅</span></div>
                                    <div><span className="text-gray-500">网签状态:</span> 
                                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${room.netSignStatus === 'SIGNED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>
                                            {room.netSignStatus === 'SIGNED' ? '已备案' : '未备案'}
                                        </span>
                                    </div>
                                    <div><span className="text-gray-500">建筑层数:</span> <span className="font-medium ml-2">{room.floor}层</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ACCOUNT' && (
                        <div className="space-y-6">
                             <div className="flex items-center justify-between p-6 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl text-white shadow-lg">
                                 <div>
                                     <p className="text-brand-100 text-sm mb-1">当前账户余额</p>
                                     <p className="text-3xl font-bold">¥ {room.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-brand-100 text-sm mb-1">账户状态</p>
                                     <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                         {room.fundStatus === 'PAID' ? '正常' : '异常'}
                                     </span>
                                 </div>
                             </div>

                             <div className="grid grid-cols-3 gap-4">
                                 <div className="p-4 border rounded-lg bg-gray-50 text-center">
                                     <p className="text-xs text-gray-500">应缴总额</p>
                                     <p className="font-bold text-gray-800 mt-1">¥ {(room.area * 100).toLocaleString()}</p>
                                 </div>
                                 <div className="p-4 border rounded-lg bg-gray-50 text-center">
                                     <p className="text-xs text-gray-500">已缴金额</p>
                                     <p className="font-bold text-green-600 mt-1">¥ {room.fundStatus === 'PAID' ? (room.area * 100).toLocaleString() : '0.00'}</p>
                                 </div>
                                 <div className="p-4 border rounded-lg bg-gray-50 text-center">
                                     <p className="text-xs text-gray-500">欠缴金额</p>
                                     <p className="font-bold text-red-500 mt-1">¥ {room.fundStatus === 'PAID' ? '0.00' : (room.area * 100).toLocaleString()}</p>
                                 </div>
                             </div>
                             
                             {room.fundStatus !== 'PAID' && (
                                 <div className="bg-orange-50 border border-orange-100 p-3 rounded-md text-sm text-orange-800 flex items-start">
                                     <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                     该房屋存在维修资金欠缴情况，请及时联系业主进行催缴，否则将影响后续维修申请。
                                 </div>
                             )}
                        </div>
                    )}

                    {activeTab === 'LOGS' && (
                        <div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">摘要</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">金额</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {room.transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{tx.date}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                    tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 
                                                    tx.type === 'USE' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {tx.type === 'DEPOSIT' ? '交存' : tx.type === 'USE' ? '使用' : '结息'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{tx.summary}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {room.transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                                                暂无交易记录
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

const CityStats: React.FC = () => (
    <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">全市维修资金总额</p>
            <p className="text-2xl font-bold text-brand-600 mt-2">¥ 45.2 亿</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">本月归集金额</p>
            <p className="text-xl font-bold text-green-600 mt-2">+ ¥ 1,240 万</p>
        </div>
        <div className="h-48 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
            <p className="text-xs text-gray-500 mb-2 font-semibold px-2">区域资金分布</p>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={WUHU_REGIONS.map((r, i) => ({name: r.name, value: 10 + i*5}))} innerRadius={30} outerRadius={60} fill="#8884d8" dataKey="value">
                        {WUHU_REGIONS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px'}} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const CommunityStats: React.FC<{ community: CommunityGIS }> = ({ community }) => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="p-5 bg-gradient-to-br from-brand-50 to-white rounded-lg border border-brand-100 shadow-sm">
            <h3 className="font-bold text-brand-900 text-xl">{community.name}</h3>
            <div className="flex items-center text-xs text-brand-600 mt-2">
                <MapIcon className="w-3 h-3 mr-1" />
                {community.district} · {community.street}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <p className="text-[10px] text-gray-500 uppercase font-bold">楼栋数</p>
                <p className="font-bold text-xl text-gray-800 mt-1">{community.totalBuildings}</p>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <p className="text-[10px] text-gray-500 uppercase font-bold">总户数</p>
                <p className="font-bold text-xl text-gray-800 mt-1">{community.totalHouseholds}</p>
            </div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-bold">账户余额</p>
            <p className={`text-2xl font-bold mt-2 ${community.fundBalance < 1000000 ? 'text-red-500' : 'text-green-600'}`}>
                ¥ {(community.fundBalance/10000).toFixed(1)} 万
            </p>
        </div>
    </div>
);

const BuildingStats: React.FC<{ building: BuildingInfo }> = ({ building }) => (
    <div className="space-y-6 animate-fade-in-up">
         <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
             <h3 className="font-bold text-gray-800 text-lg flex items-center">
                 <BuildingOffice2Icon className="w-5 h-5 mr-2 text-gray-400" />
                 {building.name}
             </h3>
             <div className="flex items-center space-x-2 mt-3">
                 <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-200">6层</span>
                 <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-200">砖混结构</span>
             </div>
         </div>
         {building.alerts.length > 0 && (
             <div className="bg-red-50 border border-red-100 p-4 rounded-lg shadow-sm">
                 <div className="flex items-center text-red-800 text-sm font-bold mb-3">
                     <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                     预警信息 ({building.alerts.length})
                 </div>
                 <ul className="space-y-2">
                     {building.alerts.map((alert, i) => (
                         <li key={i} className="text-xs text-red-600 bg-white/60 p-2.5 rounded border border-red-100/50 flex items-start">
                             <span className="mr-2">•</span> {alert}
                         </li>
                     ))}
                 </ul>
             </div>
         )}
    </div>
);

const CommunityDetailPanel: React.FC<{ community: CommunityGIS }> = ({ community }) => (
    <div className="space-y-8">
        <div className="space-y-3">
            <h4 className="font-bold text-gray-800 flex items-center text-sm uppercase tracking-wide">
                <CurrencyYenIcon className="w-5 h-5 mr-2 text-brand-500" />
                资金收支概况 (本年度)
            </h4>
            <div className="h-56 w-full bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                        { name: 'Q1', income: 4000, expense: 2400 },
                        { name: 'Q2', income: 3000, expense: 1398 },
                        { name: 'Q3', income: 2000, expense: 9800 },
                        { name: 'Q4', income: 2780, expense: 3908 },
                    ]} barGap={4}>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px'}} 
                            cursor={{fill: '#f8fafc'}} 
                        />
                        <Bar dataKey="income" fill="#22c55e" name="收入" radius={[4,4,0,0]} barSize={20} />
                        <Bar dataKey="expense" fill="#ef4444" name="支出" radius={[4,4,0,0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center text-sm uppercase tracking-wide">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-brand-500" />
                网签备案统计
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600">85%</div>
                    <div className="text-xs text-blue-400 font-medium mt-1">已网签</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-3xl font-bold text-gray-500">15%</div>
                    <div className="text-xs text-gray-400 font-medium mt-1">未网签</div>
                </div>
            </div>
        </div>
    </div>
);

const BuildingDetailPanel: React.FC<{ building: BuildingInfo }> = ({ building }) => (
    <div className="space-y-8">
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 shadow-sm">
             <h4 className="font-bold text-orange-800 mb-2 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2"/>
                维修资金欠缴预警
             </h4>
             <p className="text-xs text-orange-700 mb-4 leading-relaxed">
                 当前楼栋有 <strong className="text-orange-900">3</strong> 户未缴清首期维修资金，总欠缴金额约 ¥32,000。
             </p>
             <button className="w-full py-2.5 bg-white border border-orange-200 text-orange-600 text-xs font-bold rounded-lg shadow-sm hover:bg-orange-100 transition-colors">
                 查看欠缴名单
             </button>
        </div>
        
        <div>
             <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide flex items-center">
                 <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-brand-500" />
                 最近维修记录
             </h4>
             <ul className="space-y-4">
                 <li className="relative pl-4 border-l-2 border-brand-200">
                     <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white"></div>
                     <p className="font-bold text-gray-800 text-sm">楼道灯泡批量更换</p>
                     <p className="text-xs text-gray-500 mt-1 flex items-center">
                         <ClockIcon className="w-3 h-3 mr-1" /> 2023-09-15 · ¥ 245.00
                     </p>
                 </li>
                 <li className="relative pl-4 border-l-2 border-brand-200">
                     <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white"></div>
                     <p className="font-bold text-gray-800 text-sm">消防栓漏水紧急修复</p>
                     <p className="text-xs text-gray-500 mt-1 flex items-center">
                         <ClockIcon className="w-3 h-3 mr-1" /> 2023-05-20 · ¥ 1,200.00
                     </p>
                 </li>
             </ul>
        </div>
    </div>
);

export default AICockpitPage;