import type { RailwayGate, GateAlert, CommunityReport, DashboardStats, GateStatus } from '../types/gate';
import { INITIAL_GATES, INITIAL_ALERTS, INITIAL_REPORTS } from '../data/mockGates';

const GATES_KEY = 'railsense_gates';
const ALERTS_KEY = 'railsense_alerts';
const REPORTS_KEY = 'railsense_reports';

export class GateService {
  private static getStored<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private static setStored<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  static getGates(): RailwayGate[] {
    return this.getStored<RailwayGate[]>(GATES_KEY, INITIAL_GATES);
  }

  static getGateById(id: string): RailwayGate | undefined {
    const gates = this.getGates();
    return gates.find((g) => g.id === id);
  }

  static toggleFavorite(gateId: string): RailwayGate[] {
    const gates = this.getGates();
    const updated = gates.map((g) => {
      if (g.id === gateId) {
        return { ...g, isFavorite: !g.isFavorite };
      }
      return g;
    });
    this.setStored(GATES_KEY, updated);
    return updated;
  }

  static updateGateStatus(gateId: string, newStatus: GateStatus): RailwayGate[] {
    const gates = this.getGates();
    const updated = gates.map((g) => {
      if (g.id === gateId) {
        return {
          ...g,
          status: newStatus,
          lastUpdated: 'Just now',
          timeToClose: newStatus === 'CLOSED' ? 0 : newStatus === 'CLOSING' ? 2 : g.timeToClose
        };
      }
      return g;
    });
    this.setStored(GATES_KEY, updated);
    return updated;
  }

  static getAlerts(): GateAlert[] {
    return this.getStored<GateAlert[]>(ALERTS_KEY, INITIAL_ALERTS);
  }

  static acknowledgeAlert(alertId: string): GateAlert[] {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => {
      if (a.id === alertId) {
        return { ...a, acknowledged: true };
      }
      return a;
    });
    this.setStored(ALERTS_KEY, updated);
    return updated;
  }

  static getReports(): CommunityReport[] {
    return this.getStored<CommunityReport[]>(REPORTS_KEY, INITIAL_REPORTS);
  }

  static addReport(report: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'verified'>): CommunityReport {
    const reports = this.getReports();
    const newReport: CommunityReport = {
      ...report,
      id: `rep-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      upvotes: 1,
      verified: true
    };
    const updated = [newReport, ...reports];
    this.setStored(REPORTS_KEY, updated);

    // Also update gate status if report indicates change
    this.updateGateStatus(report.gateId, report.reportedStatus);

    return newReport;
  }

  static upvoteReport(reportId: string): CommunityReport[] {
    const reports = this.getReports();
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        return { ...r, upvotes: r.upvotes + 1 };
      }
      return r;
    });
    this.setStored(REPORTS_KEY, updated);
    return updated;
  }

  static getDashboardStats(): DashboardStats {
    const gates = this.getGates();
    const activeClosures = gates.filter((g) => g.status === 'CLOSED' || g.status === 'CLOSING').length;
    const highRiskAlerts = gates.filter((g) => g.closureProbability >= 85).length;
    const avgWaitTime = Math.round(
      gates.reduce((sum, g) => sum + g.avgWaitTimeMinutes, 0) / (gates.length || 1)
    );

    return {
      totalGates: gates.length,
      activeClosures,
      highRiskAlerts,
      avgWaitTime,
      aiModelAccuracy: 96.4
    };
  }
}
