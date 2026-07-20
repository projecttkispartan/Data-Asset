import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getBorrowStatus,
  isMaintenanceTransitionAllowed,
  localDateString,
  parseLocalDate,
  syncBorrowStatuses,
} from './domain.js';

test('local date helpers preserve calendar date', () => {
  const parsed = parseLocalDate('2026-07-16');
  assert.equal(localDateString(parsed), '2026-07-16');
});

test('active loan becomes overdue after deadline', () => {
  const log = { status: 'Dipinjam', deadlineKembali: '2026-07-15', tanggalKembali: null };
  assert.equal(getBorrowStatus(log, '2026-07-16'), 'Terlambat');
});

test('returned loan never becomes overdue', () => {
  const log = { status: 'Dikembalikan', deadlineKembali: '2026-07-15', tanggalKembali: '2026-07-16' };
  assert.equal(getBorrowStatus(log, '2026-07-20'), 'Dikembalikan');
});

test('asset borrowing status follows active log', () => {
  const assets = [{ id: 1, statusPinjam: 'Dipinjam' }];
  const logs = [{ assetId: 1, status: 'Dipinjam', deadlineKembali: '2026-07-15', tanggalKembali: null }];
  assert.equal(syncBorrowStatuses(assets, logs, '2026-07-16')[0].statusPinjam, 'Terlambat');
});

test('maintenance transition state machine rejects illegal jumps', () => {
  assert.equal(isMaintenanceTransitionAllowed('Normal', 'Perlu Diperbaiki'), true);
  assert.equal(isMaintenanceTransitionAllowed('Normal', 'Selesai Diperbaiki'), false);
  assert.equal(isMaintenanceTransitionAllowed('Dalam Perbaikan', 'Selesai Diperbaiki'), true);
});
