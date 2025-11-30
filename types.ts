

export interface AuditTaskItem {
  auditTaskId: number;
  bizType: string;
  bizId: number;
  communityName: string;
  projectName: string;
  amount: number;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  status: "INIT" | "RUNNING" | "DONE";
  submissionDate: string;
}

export interface RuleExec {
  ruleCode: string;
  ruleDesc: string;
  result: "PASS" | "FAIL";
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  message: string;
}

export interface ExtractBlock {
  type: "decision" | "contract" | "budget" | "invoice" | "refund";
  json: any;
}

export interface MaterialFile {
  id: string;
  name: string;
  size: string;
  node: string; // e.g. "业委会申请", "施工", "勘察", "分摊", "划账"
  isRequired: boolean;
  status: 'PENDING' | 'PASS' | 'FAIL' | 'WARNING';
  aiAnalysis?: string; // Pre-computed mock analysis
}

export interface ApportionmentItem {
  roomId: string;
  roomNo: string;
  ownerName: string;
  area: number;
  amount: number;
}

export interface AuditDetailType {
  baseInfo: {
    communityName: string;
    projectName: string;
    amount: number;
    balance: number;
    applyType: string;
    emergencyFlag: "Y" | "N";
    repairCompany: string;
  };
  extracts: ExtractBlock[];
  materials?: MaterialFile[]; // New field for file list
  apportionmentList?: ApportionmentItem[]; // New field for apportionment details
  rules: RuleExec[];
  aiSummary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingSources?: { uri: string; title: string }[];
}

export interface LedgerEntry {
  id: string;
  communityName: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  balanceSnapshot: number;
  date: string;
  description: string;
  category: string;
}

export enum TabType {
    AUDIT = 'audit',
    DASHBOARD = 'dashboard',
    LEDGER = 'ledger',
    CONSOLE = 'console',
    SERVICES = 'services',
    COCKPIT = 'cockpit',
    GOVERNANCE = 'governance'
}

export type ReconciliationFrequency = 'DAILY' | 'MONTHLY' | 'YEARLY';

export interface ReconciliationConfig {
    frequency: ReconciliationFrequency;
    date: string;
    scope: string[]; // e.g., ["DEPOSIT", "USAGE", "REFUND", "INTEREST", "BANK_STATEMENT"]
}

export interface ReconciliationDetailItem {
    category: string;
    systemAmount: number;
    bankAmount: number;
    diff: number;
    status: "MATCH" | "MISMATCH";
    note?: string;
    resolution?: {
        type: string;
        comment: string;
        timestamp: string;
        user: string;
    };
}

export interface ReconciliationReport {
    summary: {
        totalCount: number;
        totalSystemAmount: number;
        totalBankAmount: number;
        status: "BALANCED" | "UNBALANCED";
        generatedAt: string;
    };
    details: ReconciliationDetailItem[];
    analysis: {
        issueDescription: string;
        suggestion: string;
    };
}

export interface AIActivityLog {
    id: string;
    timestamp: string;
    module: 'AUDIT' | 'CHAT' | 'RECONCILIATION' | 'RISK';
    action: string;
    model: string;
    status: 'SUCCESS' | 'FAILURE';
    latency: number;
    tokens: number;
}

export interface ApplicationForm {
    communityName: string;
    projectName: string;
    applyAmount: number;
    constructionCompany: string;
    contactPerson: string;
    contactPhone: string;
    emergencyType: 'Y' | 'N';
    description: string;
}

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    read: boolean;
}

// --- GIS / Cockpit Types ---

export interface GISRegion {
    id: string;
    name: string;
    level: 'CITY' | 'DISTRICT' | 'STREET';
    center: [number, number]; // Simulated x, y percentage
    path: string; // SVG Path Data
    color: string; // Fill color
    children?: GISRegion[];
}

export interface CommunityGIS {
    id: string;
    name: string;
    district: string;
    street: string;
    position: [number, number];
    totalBuildings: number;
    totalHouseholds: number;
    fundBalance: number;
    repairStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
    pendingTasks: number;
}

export interface RoomTransaction {
    id: string;
    date: string;
    type: 'DEPOSIT' | 'USE' | 'INTEREST';
    amount: number;
    summary: string;
}

export interface RoomUnit {
    roomId: string;
    roomNo: string; // e.g., "101"
    floor: number;
    area: number;
    ownerName: string;
    ownerIdMasked: string; // e.g. 3402**********1234
    phoneMasked: string; // e.g. 138****8888
    deedNo: string; // 产证号
    fundStatus: 'PAID' | 'UNPAID' | 'PARTIAL'; // 维修资金缴纳状态
    netSignStatus: 'SIGNED' | 'UNSIGNED'; // 网签状态
    balance: number; // 房屋账户余额
    transactions: RoomTransaction[]; // 交易流水
}

export interface BuildingInfo {
    buildingId: string;
    name: string;
    totalFloors: number;
    unitsPerFloor: number;
    rooms: RoomUnit[];
    alerts: string[]; // 预警信息
}

export interface DataErrorItem {
    id: string;
    communityName: string;
    location: string; // e.g. "1号楼 301室"
    type: 'COMMUNITY' | 'ADDRESS' | 'FLOOR' | 'OWNER' | 'DOOR_NO';
    description: string;
    originalValue: string;
    suggestedValue?: string;
    confidence?: number;
    reasoning?: string;
    status: 'PENDING' | 'ANALYZED' | 'FIXED' | 'IGNORED';
}