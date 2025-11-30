




import { AuditTaskItem, AuditDetailType, LedgerEntry, AIActivityLog, NotificationItem, GISRegion, CommunityGIS, BuildingInfo, DataErrorItem } from "./types";

export const MOCK_TASKS: AuditTaskItem[] = [
  {
    auditTaskId: 1005,
    bizType: "TRANSFER",
    bizId: 505,
    communityName: "碧海蓝天",
    projectName: "二期外墙维修工程款划拨申请",
    amount: 320000,
    riskLevel: "HIGH",
    status: "INIT",
    submissionDate: "2023-10-28"
  },
  {
    auditTaskId: 1006,
    bizType: "REFUND",
    bizId: 506,
    communityName: "东方巴黎",
    projectName: "业主误交存退款申请",
    amount: 12500,
    riskLevel: "MEDIUM",
    status: "INIT",
    submissionDate: "2023-10-28"
  },
  {
    auditTaskId: 1001,
    bizType: "REPAIR",
    bizId: 501,
    communityName: "阳光花园",
    projectName: "A栋电梯大修工程",
    amount: 125000,
    riskLevel: "HIGH",
    status: "RUNNING",
    submissionDate: "2023-10-25"
  },
  {
    auditTaskId: 1004,
    bizType: "REPAIR",
    bizId: 504,
    communityName: "金色年代",
    projectName: "外墙瓷砖脱落修复",
    amount: 280000,
    riskLevel: "HIGH",
    status: "INIT",
    submissionDate: "2023-10-27"
  },
  {
    auditTaskId: 1002,
    bizType: "REPAIR",
    bizId: 502,
    communityName: "湖畔别墅",
    projectName: "一期屋顶防水修缮",
    amount: 45000,
    riskLevel: "MEDIUM",
    status: "INIT",
    submissionDate: "2023-10-26"
  },
  {
    auditTaskId: 1003,
    bizType: "RENEWAL",
    bizId: 503,
    communityName: "城市广场",
    projectName: "消防系统维护保养",
    amount: 8500,
    riskLevel: "LOW",
    status: "DONE",
    submissionDate: "2023-10-24"
  }
];

export const MOCK_DETAIL: Record<number, AuditDetailType> = {
  1001: {
    baseInfo: {
      communityName: "阳光花园",
      projectName: "A栋电梯大修工程",
      amount: 125000,
      balance: 450000,
      applyType: "应急维修",
      emergencyFlag: "Y",
      repairCompany: "迅达电梯服务有限公司"
    },
    apportionmentList: Array.from({ length: 48 }).map((_, i) => ({
        roomId: `1-${Math.floor(i/4)+1}-0${(i%4)+1}`,
        roomNo: `${Math.floor(i/4)+1}0${(i%4)+1}`,
        ownerName: i % 5 === 0 ? `王${i}五` : i % 3 === 0 ? `李${i}四` : `张${i}三`,
        area: [89, 105, 120, 135][i % 4],
        amount: Math.round((125000 / 48) * (1 + (Math.random() * 0.1 - 0.05))) // Simulated weighted amount
    })),
    extracts: [
      {
        type: "decision",
        json: {
          "meetingDate": "2023-10-20",
          "attendees": 45,
          "approvalRate": "68%",
          "method": "书面表决"
        }
      },
      {
        type: "budget",
        json: {
          "laborCost": 45000,
          "materialCost": 70000,
          "managementFee": 10000,
          "total": 125000
        }
      }
    ],
    materials: [
        { id: 'M01', name: '维修资金使用申请表.pdf', size: '1.2 MB', node: '业委会申请', isRequired: true, status: 'PASS', aiAnalysis: '表单要素齐全，印章检测通过。' },
        { id: 'M02', name: '电梯故障检测报告.jpg', size: '4.5 MB', node: '勘察', isRequired: true, status: 'PASS', aiAnalysis: '识别到特种设备检验机构公章，故障描述与申请一致。' },
        { id: 'M03', name: '工程预算清单.xlsx', size: '25 KB', node: '施工', isRequired: true, status: 'WARNING', aiAnalysis: '部分材料单价高于市场均价，建议复核。' },
        { id: 'M04', name: '业主签名表.pdf', size: '3.1 MB', node: '业委会申请', isRequired: false, status: 'FAIL', aiAnalysis: '检测到多处笔迹高度相似，疑似代签。' }
    ],
    rules: [
      { ruleCode: "R001", ruleDesc: "预算 > 余额 20%", result: "PASS", riskLevel: "LOW", message: "占比 27%，应急维修可接受。" },
      { ruleCode: "R002", ruleDesc: "频繁维修 (6个月内3次)", result: "FAIL", riskLevel: "HIGH", message: "该单元电梯本年度已维修4次，情况异常。" },
      { ruleCode: "R003", ruleDesc: "业主签名核验", result: "PASS", riskLevel: "NONE", message: "签名与业主档案匹配。" }
    ],
    aiSummary: "应急电梯维修申请。虽然申请金额在合理范围内，但该单元维修频率过高。建议调查是否存在维保不到位或虚假报修问题。建议聘请第三方进行技术鉴定。"
  },
  1002: {
    baseInfo: {
      communityName: "湖畔别墅",
      projectName: "一期屋顶防水修缮",
      amount: 45000,
      balance: 120000,
      applyType: "一般维修",
      emergencyFlag: "N",
      repairCompany: "顶峰防水工程有限公司"
    },
    extracts: [
      {
        type: "contract",
        json: {
          "partyA": "湖畔别墅业委会",
          "partyB": "顶峰防水工程",
          "warrantyPeriod": "5年",
          "paymentTerms": "30-30-40"
        }
      }
    ],
    materials: [
        { id: 'M05', name: '施工合同.pdf', size: '2.8 MB', node: '施工', isRequired: true, status: 'PASS', aiAnalysis: '合同条款完整，包含5年质保承诺。' },
        { id: 'M06', name: '现场勘察照片.zip', size: '15 MB', node: '勘察', isRequired: true, status: 'PASS', aiAnalysis: '照片显示屋顶明显渗漏，符合维修条件。' },
    ],
    rules: [
      { ruleCode: "R005", ruleDesc: "施工单位资质校验", result: "PASS", riskLevel: "LOW", message: "营业执照与资质证书有效。" },
      { ruleCode: "R006", ruleDesc: "材料单价核查", result: "FAIL", riskLevel: "MEDIUM", message: "防水材料单价高于区域平均价 15%。" }
    ],
    aiSummary: "屋顶防水维修申请。施工方资质齐全，但材料报价略高于市场均价。建议与施工方协商降低材料成本，或要求提供详细的品牌规格说明。"
  },
  1005: {
    baseInfo: {
      communityName: "碧海蓝天",
      projectName: "二期外墙维修工程款划拨申请",
      amount: 320000,
      balance: 1500000,
      applyType: "维修划账",
      emergencyFlag: "N",
      repairCompany: "宏达建筑工程有限公司"
    },
    extracts: [
      {
        type: "contract",
        json: {
          "contractNo": "HT-2023-098",
          "milestone": "进度款 (30%)",
          "condition": "工程进度达到 50%"
        }
      },
      {
        type: "invoice",
        json: {
          "invoiceNo": "3100223130",
          "amount": 320000,
          "payer": "碧海蓝天业委会",
          "date": "2023-10-27"
        }
      }
    ],
    materials: [
        { id: 'M07', name: '工程款支付申请表.pdf', size: '0.8 MB', node: '划账', isRequired: true, status: 'PASS', aiAnalysis: '申请金额与发票一致。' },
        { id: 'M08', name: '增值税专用发票.pdf', size: '0.5 MB', node: '划账', isRequired: true, status: 'PASS', aiAnalysis: '发票真伪核验通过，税率正确。' },
        { id: 'M09', name: '工程进度监理报告.pdf', size: '3.2 MB', node: '施工', isRequired: true, status: 'FAIL', aiAnalysis: '报告显示当前进度35%，未达到合同约定的50%付款条件。' }
    ],
    rules: [
      { ruleCode: "R010", ruleDesc: "资金余额充足性校验", result: "PASS", riskLevel: "NONE", message: "账户余额充足，扣款后不低于警戒线。" },
      { ruleCode: "R011", ruleDesc: "工程进度现场核验", result: "FAIL", riskLevel: "HIGH", message: "第三方监理报告显示当前实际进度仅为 35%，未达到合同约定的 50% 付款节点。" },
      { ruleCode: "R012", ruleDesc: "发票真伪核验", result: "PASS", riskLevel: "NONE", message: "税务接口验证一致，状态正常。" }
    ],
    aiSummary: "工程款划拨申请（进度款）。发票查验正常，但系统自动比对发现，监理报告中的工程进度（35%）与合同约定的付款条件（50%）不符。存在提前支付风险，建议驳回申请或要求施工单位补充完工证明。"
  },
  1006: {
    baseInfo: {
        communityName: "东方巴黎",
        projectName: "业主误交存退款申请",
        amount: 12500,
        balance: 12500,
        applyType: "资金退款",
        emergencyFlag: "N",
        repairCompany: "-"
    },
    extracts: [
        {
            type: "refund",
            json: {
                "applicant": "张伟",
                "roomNo": "5-2-601",
                "originalAmount": 12500,
                "reason": "重复交存",
                "bankAccount": "6222****8888"
            }
        },
        {
            type: "invoice",
            json: {
                "receiptNo": "HP20231015001",
                "date": "2023-10-15",
                "payer": "张伟",
                "amount": 12500
            }
        }
    ],
    materials: [
        { id: 'M10', name: '维修资金退款申请书.pdf', size: '0.6 MB', node: '申请', isRequired: true, status: 'PASS', aiAnalysis: '申请理由填写清晰，签字完整。' },
        { id: 'M11', name: '原始交存凭证(红联).jpg', size: '2.1 MB', node: '申请', isRequired: true, status: 'PASS', aiAnalysis: '凭证号与系统收款记录匹配。' },
        { id: 'M12', name: '申请人身份证复印件.pdf', size: '1.2 MB', node: '身份证明', isRequired: true, status: 'PASS', aiAnalysis: '身份证信息与房产证权利人一致。' }
    ],
    rules: [
        { ruleCode: "R021", ruleDesc: "退款金额 <= 原交存金额", result: "PASS", riskLevel: "NONE", message: "申请退款金额等于该笔交易实收金额。" },
        { ruleCode: "R022", ruleDesc: "申请人身份一致性校验", result: "PASS", riskLevel: "NONE", message: "申请人姓名、身份证号与原缴款人一致。" },
        { ruleCode: "R023", ruleDesc: "退款频次校验", result: "PASS", riskLevel: "LOW", message: "该房屋年度首次申请退款。" }
    ],
    aiSummary: "误交存退款申请。经系统核对，申请人提交的原始凭证真实有效，且身份信息与原缴款记录完全匹配。账户资金未被使用，符合退款条件。建议通过。"
  }
};

export const DASHBOARD_DATA = {
  riskDistribution: [
    { name: '高风险', value: 12, color: '#ef4444' },
    { name: '中风险', value: 28, color: '#f97316' },
    { name: '低风险', value: 45, color: '#22c55e' },
  ],
  monthlyTrend: [
    { name: '5月', count: 12, highRisk: 2 },
    { name: '6月', count: 19, highRisk: 3 },
    { name: '7月', count: 15, highRisk: 1 },
    { name: '8月', count: 25, highRisk: 5 },
    { name: '9月', count: 32, highRisk: 8 },
    { name: '10月', count: 28, highRisk: 4 },
  ],
  violationTypes: [
    { name: '预算超支', count: 15 },
    { name: '签名造假', count: 8 },
    { name: '频繁维修', count: 6 },
    { name: '资质过期', count: 4 },
    { name: '超范围使用', count: 3 },
  ]
};

export const DASHBOARD_KPI = {
    totalAudits: { value: 1284, trend: "+12%", label: "累计审核任务" },
    highRiskCount: { value: 45, trend: "-5%", label: "高风险拦截" },
    moneySaved: { value: 2450000, trend: "+8.5%", label: "核减金额 (元)" },
    autoPassRate: { value: "68%", trend: "+2%", label: "AI 自动通过率" }
};

export const RISK_SCATTER_DATA = [
    { x: 10, y: 500000, z: 200, name: '阳光花园', risk: 'HIGH' },
    { x: 5, y: 120000, z: 100, name: '湖畔别墅', risk: 'MEDIUM' },
    { x: 20, y: 80000, z: 50, name: '城市广场', risk: 'LOW' },
    { x: 15, y: 950000, z: 400, name: '金色年代', risk: 'HIGH' },
    { x: 8, y: 300000, z: 150, name: '碧海蓝天', risk: 'MEDIUM' },
    { x: 25, y: 60000, z: 80, name: '幸福里', risk: 'LOW' },
];

export const RECENT_ALERTS = [
    { id: 1, time: "10:23", community: "金色年代", message: "工程预算超出历史均值 45%", level: "HIGH" },
    { id: 2, time: "09:45", community: "阳光花园", message: "同一施工单位频繁中标", level: "MEDIUM" },
    { id: 3, time: "09:12", community: "湖畔别墅", message: "材料单价高于市场指导价", level: "MEDIUM" },
    { id: 4, time: "昨天", community: "老旧小区A", message: "业主签名笔迹相似度过高", level: "HIGH" },
];

export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
    { id: "L001", communityName: "阳光花园", type: "INCOME", amount: 500000, balanceSnapshot: 500000, date: "2023-01-15", description: "2023年度维修资金归集", category: "资金归集" },
    { id: "L002", communityName: "阳光花园", type: "EXPENSE", amount: 125000, balanceSnapshot: 375000, date: "2023-10-25", description: "A栋电梯大修工程支付", category: "工程款" },
    { id: "L003", communityName: "湖畔别墅", type: "INCOME", amount: 120000, balanceSnapshot: 120000, date: "2023-03-10", description: "2023年度维修资金归集", category: "资金归集" },
    { id: "L004", communityName: "城市广场", type: "INCOME", amount: 100000, balanceSnapshot: 100000, date: "2023-02-01", description: "2023年度维修资金归集", category: "资金归集" },
    { id: "L005", communityName: "城市广场", type: "EXPENSE", amount: 8500, balanceSnapshot: 91500, date: "2023-10-24", description: "消防系统维保费", category: "维保费" },
    { id: "L006", communityName: "阳光花园", type: "INCOME", amount: 3500, balanceSnapshot: 378500, date: "2023-06-30", description: "季度存款利息", category: "利息收入" },
    { id: "L007", communityName: "金色年代", type: "INCOME", amount: 800000, balanceSnapshot: 800000, date: "2023-01-20", description: "2023年度维修资金归集", category: "资金归集" },
    { id: "L008", communityName: "金色年代", type: "EXPENSE", amount: 280000, balanceSnapshot: 520000, date: "2023-10-27", description: "外墙修复预付款", category: "工程预付款" },
];

export const MOCK_AI_LOGS: AIActivityLog[] = [
    { id: "log-001", timestamp: "10:45:22", module: "AUDIT", action: "文档要素抽取", model: "gemini-2.5-flash", status: "SUCCESS", latency: 850, tokens: 450 },
    { id: "log-002", timestamp: "10:46:05", module: "RISK", action: "规则引擎校验", model: "gemini-2.5-flash", status: "SUCCESS", latency: 620, tokens: 320 },
    { id: "log-003", timestamp: "10:50:11", module: "CHAT", action: "法规咨询查询", model: "gemini-3-pro", status: "SUCCESS", latency: 1200, tokens: 890 },
    { id: "log-004", timestamp: "10:52:30", module: "RECONCILIATION", action: "日终自动对账", model: "gemini-2.5-flash", status: "SUCCESS", latency: 2100, tokens: 1500 },
    { id: "log-005", timestamp: "11:05:00", module: "AUDIT", action: "风险摘要生成", model: "gemini-3-pro", status: "FAILURE", latency: 5000, tokens: 0 },
    { id: "log-006", timestamp: "11:10:15", module: "CHAT", action: "用户多轮对话", model: "gemini-3-pro", status: "SUCCESS", latency: 980, tokens: 600 },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
    { id: 1, title: "风险预警", message: "金色年代小区工程预算超出历史均值 45%，建议重点复核。", time: "10分钟前", type: 'WARNING', read: false },
    { id: 2, title: "审核通过", message: "阳光花园电梯大修申请已自动通过AI初审。", time: "30分钟前", type: 'SUCCESS', read: false },
    { id: 3, title: "系统消息", message: "夜间自动对账任务已完成，昨日账目无异常。", time: "2小时前", type: 'INFO', read: true },
    { id: 4, title: "新任务分配", message: "您有 3 个新的待审任务请及时处理。", time: "4小时前", type: 'INFO', read: true },
    { id: 5, title: "驳回通知", message: "碧海蓝天划拨申请已被上级复核员驳回，请查看详情。", time: "昨天", type: 'ERROR', read: true },
];

// --- Mock GIS Data (Wuhu City with SVG Paths) ---
// ViewBox: 0 0 1000 1000

export const WUHU_REGIONS: GISRegion[] = [
    { 
        id: '340202', 
        name: '镜湖区', 
        level: 'DISTRICT', 
        center: [550, 475],
        path: "M 500 400 L 600 400 L 600 550 L 500 550 Z", // Central Rect
        color: "#0ea5e9" // sky-500
    },
    { 
        id: '340203', 
        name: '弋江区', 
        level: 'DISTRICT', 
        center: [525, 675],
        path: "M 500 550 L 600 550 L 600 800 L 450 800 L 450 600 Z", // South Poly
        color: "#8b5cf6" // violet-500
    },
    { 
        id: '340207', 
        name: '鸠江区', 
        level: 'DISTRICT', 
        center: [550, 250],
        path: "M 400 100 L 700 100 L 700 400 L 600 400 L 600 300 L 500 300 L 500 400 L 400 400 Z", // North Poly
        color: "#22c55e" // green-500
    },
    { 
        id: '340208', 
        name: '三山经开区', 
        level: 'DISTRICT', 
        center: [350, 450],
        path: "M 200 300 L 500 300 L 500 550 L 450 600 L 200 600 Z", // West Poly
        color: "#f97316" // orange-500
    },
    { 
        id: '340221', 
        name: '湾沚区', 
        level: 'DISTRICT', 
        center: [750, 600],
        path: "M 600 400 L 900 400 L 900 700 L 600 800 L 600 550 Z", // East Poly
        color: "#ef4444" // red-500
    },
];

export const MOCK_COMMUNITIES: CommunityGIS[] = [
    { id: 'C001', name: '阳光花园', district: '镜湖区', street: '赭山街道', position: [520, 420], totalBuildings: 12, totalHouseholds: 850, fundBalance: 4500000, repairStatus: 'NORMAL', pendingTasks: 2 },
    { id: 'C002', name: '湖畔别墅', district: '弋江区', street: '中南街道', position: [480, 620], totalBuildings: 25, totalHouseholds: 120, fundBalance: 12000000, repairStatus: 'WARNING', pendingTasks: 5 },
    { id: 'C003', name: '金色年代', district: '鸠江区', street: '官陡街道', position: [680, 320], totalBuildings: 8, totalHouseholds: 1200, fundBalance: 800000, repairStatus: 'CRITICAL', pendingTasks: 8 },
    { id: 'C004', name: '碧海蓝天', district: '三山经开区', street: '龙湖街道', position: [320, 480], totalBuildings: 15, totalHouseholds: 900, fundBalance: 6500000, repairStatus: 'NORMAL', pendingTasks: 1 },
];

export const MOCK_BUILDING: BuildingInfo = {
    buildingId: 'B01',
    name: '1号楼',
    totalFloors: 6,
    unitsPerFloor: 4,
    alerts: ['301室维修资金未缴齐', '楼顶防水层保修期即将届满'],
    rooms: [] // Generated dynamically in component
};

export const MOCK_DATA_ERRORS: DataErrorItem[] = [
    { 
        id: 'E05', 
        communityName: '伟星万象', 
        location: '101室', 
        type: 'COMMUNITY', 
        description: '房屋挂载错误', 
        originalValue: '伟星万象 101', 
        suggestedValue: '伟星银湖小区 101',
        reasoning: '经 GIS 与不动产登记中心数据比对，该房屋（单元号 340200...）实际坐落于伟星银湖小区地块范围内。',
        status: 'PENDING'
    },
    { id: 'E01', communityName: '阳光花园', location: '1幢3层301', type: 'ADDRESS', description: '房屋坐落描述不规范', originalValue: '阳光花园1幢3层301', status: 'PENDING' },
    { id: 'E02', communityName: '湖畔别墅', location: 'Ground Floor', type: 'FLOOR', description: '物理楼层与逻辑楼层不符', originalValue: 'Ground Floor', status: 'PENDING' },
    { id: 'E03', communityName: '金色年代', location: '5号楼 202室', type: 'OWNER', description: '业主姓名包含特殊字符', originalValue: '张三(1)', status: 'PENDING' },
    { id: 'E04', communityName: '碧海蓝天', location: '未知单元', type: 'DOOR_NO', description: '门牌号缺失', originalValue: '', status: 'PENDING' },
];