import type { RailwayGate, GateAlert, CommunityReport } from '../types/gate';

export const INITIAL_GATES: RailwayGate[] = [
  {
    id: 'gate-001',
    name: 'Koramangala 80ft Crossing',
    code: 'LC-42-SWR',
    latitude: 12.9352,
    longitude: 77.6245,
    status: 'CLOSING',
    closureProbability: 94,
    timeToClose: 3,
    expectedDuration: 12,
    confidence: 96,
    locationName: 'Koramangala 4th Block',
    district: 'Bengaluru Urban',
    railwayLine: 'Bengaluru - Hosur Main Line',
    lastUpdated: '2 mins ago',
    dailyTrainCount: 48,
    avgWaitTimeMinutes: 14,
    isFavorite: true,
    upcomingTrain: {
      trainNumber: '12677',
      name: 'Ernakulam Intercity Express',
      speedKmh: 72,
      etaMinutes: 3,
      direction: 'SOUTHBOUND'
    }
  },
  {
    id: 'gate-002',
    name: 'Whitefield Main Level Crossing',
    code: 'LC-18-SWR',
    latitude: 12.9698,
    longitude: 77.7499,
    status: 'CLOSED',
    closureProbability: 99,
    timeToClose: 0,
    expectedDuration: 18,
    confidence: 98,
    locationName: 'Whitefield Station Road',
    district: 'Bengaluru East',
    railwayLine: 'Bengaluru - Chennai Trunk Line',
    lastUpdated: 'Just now',
    dailyTrainCount: 72,
    avgWaitTimeMinutes: 22,
    isFavorite: false,
    upcomingTrain: {
      trainNumber: '12008',
      name: 'Shatabdi Express',
      speedKmh: 110,
      etaMinutes: 1,
      direction: 'EASTBOUND'
    }
  },
  {
    id: 'gate-003',
    name: 'Hebbal Flyover Grade Crossing',
    code: 'LC-09-SWR',
    latitude: 13.0358,
    longitude: 77.5970,
    status: 'OPEN',
    closureProbability: 12,
    timeToClose: 45,
    expectedDuration: 8,
    confidence: 91,
    locationName: 'Hebbal Outer Ring Road',
    district: 'Bengaluru North',
    railwayLine: 'Yelahanka - Cantonment Bypass',
    lastUpdated: '5 mins ago',
    dailyTrainCount: 36,
    avgWaitTimeMinutes: 10,
    isFavorite: true,
    upcomingTrain: {
      trainNumber: '06591',
      name: 'YPR-HUP MEMU Special',
      speedKmh: 45,
      etaMinutes: 45,
      direction: 'NORTHBOUND'
    }
  },
  {
    id: 'gate-004',
    name: 'Cantonment East Gate',
    code: 'LC-31-SWR',
    latitude: 12.9930,
    longitude: 77.6080,
    status: 'ALERT',
    closureProbability: 88,
    timeToClose: 5,
    expectedDuration: 15,
    confidence: 85,
    locationName: 'Benson Town',
    district: 'Bengaluru Central',
    railwayLine: 'Bengaluru Cantonment Branch',
    lastUpdated: '1 min ago',
    dailyTrainCount: 54,
    avgWaitTimeMinutes: 16,
    isFavorite: false,
    upcomingTrain: {
      trainNumber: '16526',
      name: 'Island Express',
      speedKmh: 65,
      etaMinutes: 5,
      direction: 'SOUTHBOUND'
    }
  },
  {
    id: 'gate-005',
    name: 'Banaswadi Ring Road Gate',
    code: 'LC-22-SWR',
    latitude: 13.0110,
    longitude: 77.6430,
    status: 'OPEN',
    closureProbability: 25,
    timeToClose: 32,
    expectedDuration: 10,
    confidence: 93,
    locationName: 'Banaswadi Main Road',
    district: 'Bengaluru East',
    railwayLine: 'Baiyappanahalli - Salem Section',
    lastUpdated: '4 mins ago',
    dailyTrainCount: 40,
    avgWaitTimeMinutes: 11,
    isFavorite: false,
    upcomingTrain: {
      trainNumber: '11014',
      name: 'Lokmanya Tilak Express',
      speedKmh: 58,
      etaMinutes: 32,
      direction: 'NORTHBOUND'
    }
  },
  {
    id: 'gate-006',
    name: 'Majestic West Approach Crossing',
    code: 'LC-03-SWR',
    latitude: 12.9780,
    longitude: 77.5680,
    status: 'CLOSED',
    closureProbability: 100,
    timeToClose: 0,
    expectedDuration: 25,
    confidence: 99,
    locationName: 'Okalipuram Junction',
    district: 'Bengaluru Central',
    railwayLine: 'KSR Bengaluru - Mysuru Line',
    lastUpdated: 'Just now',
    dailyTrainCount: 96,
    avgWaitTimeMinutes: 28,
    isFavorite: true,
    upcomingTrain: {
      trainNumber: '20607',
      name: 'Vande Bharat Express',
      speedKmh: 130,
      etaMinutes: 2,
      direction: 'WESTBOUND'
    }
  },
  {
    id: 'gate-007',
    name: 'Yeshwantpur Freight Terminal Gate',
    code: 'LC-14-SWR',
    latitude: 13.0240,
    longitude: 77.5490,
    status: 'MAINTENANCE',
    closureProbability: 0,
    timeToClose: 999,
    expectedDuration: 120,
    confidence: 100,
    locationName: 'Yeshwantpur Industrial Zone',
    district: 'Bengaluru North',
    railwayLine: 'Yeshwantpur Goods Line',
    lastUpdated: '12 mins ago',
    dailyTrainCount: 15,
    avgWaitTimeMinutes: 0,
    isFavorite: false
  },
  {
    id: 'gate-008',
    name: 'Carmelaram Suburban Gate',
    code: 'LC-52-SWR',
    latitude: 12.9120,
    longitude: 77.7010,
    status: 'CLOSING',
    closureProbability: 92,
    timeToClose: 4,
    expectedDuration: 14,
    confidence: 94,
    locationName: 'Sarjapur Outer Connection',
    district: 'Bengaluru South',
    railwayLine: 'Bengaluru - Hosur Main Line',
    lastUpdated: '1 min ago',
    dailyTrainCount: 50,
    avgWaitTimeMinutes: 15,
    isFavorite: true,
    upcomingTrain: {
      trainNumber: '06567',
      name: 'Hosur - YPR Passenger Special',
      speedKmh: 50,
      etaMinutes: 4,
      direction: 'NORTHBOUND'
    }
  }
];

export const INITIAL_ALERTS: GateAlert[] = [
  {
    id: 'alert-101',
    gateId: 'gate-002',
    gateName: 'Whitefield Main Level Crossing',
    severity: 'CRITICAL',
    title: 'Extended Gate Closure Hazard',
    message: 'High-speed Shatabdi Express passing. Gate closed for 18+ mins. Extreme traffic buildup on Whitefield Station Road.',
    timestamp: '3 mins ago',
    acknowledged: false
  },
  {
    id: 'alert-102',
    gateId: 'gate-001',
    gateName: 'Koramangala 80ft Crossing',
    severity: 'WARNING',
    title: 'Predicted Closure in 3 mins',
    message: 'AI model detects incoming Ernakulam Intercity Express (Train #12677). Reroute via Agara Flyover recommended.',
    timestamp: '5 mins ago',
    acknowledged: false
  },
  {
    id: 'alert-103',
    gateId: 'gate-004',
    gateName: 'Cantonment East Gate',
    severity: 'WARNING',
    title: 'High AI Anomaly Detected',
    message: 'Train speed variable detected. Predicted closure window shifted from 12:45 to 12:42 (Confidence: 85%).',
    timestamp: '12 mins ago',
    acknowledged: true
  },
  {
    id: 'alert-104',
    gateId: 'gate-007',
    gateName: 'Yeshwantpur Freight Terminal Gate',
    severity: 'INFO',
    title: 'Scheduled Track Maintenance',
    message: 'Manual override active for signal calibration. Expect intermittent delays until 16:00 UTC.',
    timestamp: '25 mins ago',
    acknowledged: true
  }
];

export const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-501',
    gateId: 'gate-002',
    gateName: 'Whitefield Main Level Crossing',
    reportedStatus: 'CLOSED',
    reporterName: 'Rahul M. (Commuter)',
    comment: 'Gate barrier has been down for over 15 minutes. Heavy traffic tailback up to ITPL main road!',
    timestamp: '4 mins ago',
    upvotes: 24,
    verified: true,
    hazardType: 'LONG_WAIT'
  },
  {
    id: 'rep-502',
    gateId: 'gate-001',
    gateName: 'Koramangala 80ft Crossing',
    reportedStatus: 'CLOSING',
    reporterName: 'Ananya S. (Cab Driver)',
    comment: 'Siren just started ringing. Intercity train approaching fast. Avoid this route!',
    timestamp: '8 mins ago',
    upvotes: 16,
    verified: true,
    hazardType: 'CLEAR'
  },
  {
    id: 'rep-503',
    gateId: 'gate-004',
    gateName: 'Cantonment East Gate',
    reportedStatus: 'ALERT',
    reporterName: 'Vikram R. (Delivery Partner)',
    comment: 'Auto-rickshaw temporarily stalled near safety zone. Traffic police assisting clear.',
    timestamp: '15 mins ago',
    upvotes: 9,
    verified: false,
    hazardType: 'STUCK_VEHICLE'
  }
];
