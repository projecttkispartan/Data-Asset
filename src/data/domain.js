export const STORAGE_KEYS = {
  assets: 'data-asset.assets.v1',
  borrowLogs: 'data-asset.borrow-logs.v1',
  maintenanceLogs: 'data-asset.maintenance-logs.v1',
};

export function localDateString(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getAuditActor() {
  return 'local-demo-user';
}

export function withAuditMetadata(record, existing = null) {
  const now = new Date().toISOString();
  const actor = getAuditActor();
  return {
    ...record,
    createdAt: existing?.createdAt || record.createdAt || now,
    createdBy: existing?.createdBy || record.createdBy || actor,
    updatedAt: now,
    updatedBy: actor,
  };
}

export function readStoredData(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredData(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getBorrowStatus(log, today = localDateString()) {
  if (!log || log.tanggalKembali || log.status === 'Dikembalikan') return 'Dikembalikan';
  return log.deadlineKembali && log.deadlineKembali < today ? 'Terlambat' : 'Dipinjam';
}

export function syncBorrowLogStatuses(logs, today = localDateString()) {
  return logs.map((log) => {
    const status = getBorrowStatus(log, today);
    return status === log.status ? log : { ...log, status };
  });
}

export function syncBorrowStatuses(assets, logs, today = localDateString()) {
  const activeByAsset = new Map();
  logs.forEach((log) => {
    const status = getBorrowStatus(log, today);
    if (status !== 'Dikembalikan' && !activeByAsset.has(log.assetId)) {
      activeByAsset.set(log.assetId, status);
    }
  });
  return assets.map((asset) => {
    const activeStatus = activeByAsset.get(asset.id);
    if (!activeStatus && !['Dipinjam', 'Terlambat'].includes(asset.statusPinjam)) return asset;
    const statusPinjam = activeStatus || 'Tersedia';
    return statusPinjam === asset.statusPinjam ? asset : { ...asset, statusPinjam };
  });
}

const MAINTENANCE_TRANSITIONS = {
  Normal: ['Perlu Diperbaiki'],
  'Perlu Diperbaiki': ['Dalam Perbaikan', 'Tertunda', 'Dibatalkan'],
  'Dalam Perbaikan': ['Tertunda', 'Selesai Diperbaiki'],
  Tertunda: ['Dalam Perbaikan', 'Dibatalkan'],
  'Selesai Diperbaiki': ['Perlu Diperbaiki'],
  Dibatalkan: ['Perlu Diperbaiki'],
};

export function getAllowedMaintenanceTransitions(current = 'Normal') {
  return MAINTENANCE_TRANSITIONS[current] || [];
}

export function isMaintenanceTransitionAllowed(current, next) {
  return current === next || getAllowedMaintenanceTransitions(current).includes(next);
}
