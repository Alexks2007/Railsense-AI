export type GateStatus = 'OPEN' | 'CLOSING' | 'CLOSED' | 'ALERT' | 'MAINTENANCE';

export interface RailwayGate {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  status: GateStatus;
  closureProbability: number; // 0 - 100 percentage
  timeToClose: number; // minutes remaining before predicted closure (0 if already closed)
  expectedDuration: number; // minutes gate will remain closed
  confidence: number; // AI confidence score 0 - 100
  locationName: string;
  district: string;
  railwayLine: string;
  lastUpdated: string;
  dailyTrainCount: number;
  avgWaitTimeMinutes: number;
  isFavorite?: boolean;
  upcomingTrain?: {
    trainNumber: string;
    name: string;
    speedKmh: number;
    etaMinutes: number;
    direction: 'NORTHBOUND' | 'SOUTHBOUND' | 'EASTBOUND' | 'WESTBOUND';
  };
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface GateAlert {
  id: string;
  gateId: string;
  gateName: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  acknowledged?: boolean;
}

export interface CommunityReport {
  id: string;
  gateId: string;
  gateName: string;
  reportedStatus: GateStatus;
  reporterName: string;
  comment: string;
  timestamp: string;
  upvotes: number;
  verified: boolean;
  hazardType?: 'STUCK_VEHICLE' | 'BARRIER_FAILURE' | 'LONG_WAIT' | 'CLEAR';
}

export interface DashboardStats {
  totalGates: number;
  activeClosures: number;
  highRiskAlerts: number;
  avgWaitTime: number;
  aiModelAccuracy: number;
}
