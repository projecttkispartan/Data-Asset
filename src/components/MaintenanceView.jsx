import { useEffect, useMemo, useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Camera,
  Eye,
  History,
  PackageSearch,
  Paperclip,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CalendarClock,
} from 'lucide-react';
import {
  STATUS_PERAWATAN_OPTIONS,
  MAINTENANCE_STATUS_OPTIONS,
  LOKASI_PERAWATAN_OPTIONS,
  vendorsMaster,
  getVendorById,
  getLatestMaintenanceLog,
  buildAssetPatchFromMaintenance,
  calcLamaWaktuHint,
  addDaysToDate,
  getJadwalMaintenanceStatus,
  getMaintenanceNotifications,
} from '../data/mockData';
import { PerawatanBadge } from './SharedUI';

function kategoriStyle(kategori) {
  if (kategori === 'Pisau') return 'bg-amber-100 text-amber-700';
  if (kategori === 'Sparepart') return 'bg-purple-100 text-purple-700';
  return 'bg-blue-100 text-blue-700';
}

function lokasiLabel(log) {
  if (!log) return '-';
  if (log.lokasiTipe === 'Eksternal') return log.vendorNama || 'Eksternal';
  return log.lokasiTipe || 'Internal';
}

function MaintenanceLogDetailModal({ log, onClose }) {
  if (!log) return null;
  const aktual = log.tanggalSelesaiAktual || log.tanggalSelesai;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Detail Log Perbaikan</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{log.assetKode || 'Log perawatan'}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{log.assetNama || 'Item'}</p>
              <PerawatanBadge status={log.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
              <div>
                <p className="text-slate-400">PIC</p>
                <p className="font-medium text-slate-700">{log.pic || '-'}</p>
              </div>
              <div>
                <p className="text-slate-400">Lokasi</p>
                <p className="font-medium text-slate-700">{lokasiLabel(log)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-400">Mulai</p>
              <p className="font-semibold text-slate-700 mt-0.5">{log.tanggalMulai || '-'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-400">Estimasi selesai</p>
              <p className="font-semibold text-slate-700 mt-0.5">{log.estimasiSelesai || '-'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-400">Aktual selesai</p>
              <p className="font-semibold text-slate-700 mt-0.5">{aktual || '-'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-400">Lama waktu</p>
              <p className="font-semibold text-slate-700 mt-0.5">{log.lamaWaktuPerbaikan || '-'}</p>
            </div>
          </div>

          {log.kendala && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">Kendala</p>
              <p className="text-xs text-amber-950 mt-1 whitespace-pre-wrap leading-relaxed">{log.kendala}</p>
            </div>
          )}

          {log.catatan && (
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Catatan perbaikan</p>
              <p className="text-xs text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">{log.catatan}</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-slate-100 rounded-lg hover:bg-slate-200">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function JadwalBadge({ jadwal }) {
  const status = getJadwalMaintenanceStatus(jadwal);
  if (!jadwal || status === 'none') {
    return <span className="text-[11px] text-slate-400">Belum dijadwalkan</span>;
  }
  const style =
    status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
    status === 'dueSoon' ? 'bg-amber-50 text-amber-800 border-amber-200' :
    'bg-slate-50 text-slate-600 border-slate-200';
  const label =
    status === 'overdue' ? 'Terlewat' :
    status === 'dueSoon' ? 'Segera' : 'Terjadwal';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${style}`}>
      <CalendarClock size={11} /> {label} · {jadwal}
    </span>
  );
}

function MaintenanceLogList({ logs, defaultExpanded = false, onViewDetails }) {
  const [openId, setOpenId] = useState(defaultExpanded && logs?.[0] ? logs[0].id : null);

  if (!logs?.length) {
    return (
      <div className="text-center text-slate-400 py-8 text-sm border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        Belum ada log perawatan untuk item ini.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
      {logs.map((log) => {
        const docCount = (log.dokumenPendukung || []).length;
        const aktual = log.tanggalSelesaiAktual || log.tanggalSelesai;
        const expanded = openId === log.id;
        return (
          <div
            key={log.id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            <div className="flex items-start gap-2 p-3">
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : log.id)}
                className="min-w-0 flex-1 flex gap-3 text-left hover:bg-slate-50/80 transition-colors"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  {log.foto ? (
                    <img src={log.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={18} className="text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PerawatanBadge status={log.status} />
                    <span className="text-xs font-semibold text-slate-800">{log.pic}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      log.lokasiTipe === 'Eksternal' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {lokasiLabel(log)}
                    </span>
                    {log.kendala && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        <AlertTriangle size={10} /> Ada kendala
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Mulai {log.tanggalMulai || '-'}
                    {log.estimasiSelesai ? ` · Est. ${log.estimasiSelesai}` : ''}
                    {aktual ? ` · Aktual ${aktual}` : ''}
                  </p>
                  {log.kendala && !expanded && (
                    <p className="text-[11px] text-amber-800/90 mt-1 line-clamp-2">{log.kendala}</p>
                  )}
                  {!log.kendala && log.catatan && !expanded && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{log.catatan}</p>
                  )}
                </div>
                <div className="shrink-0 text-slate-400 self-center">
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              {onViewDetails && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(log);
                  }}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Detail
                </button>
              )}
            </div>

            {expanded && (
              <div className="px-3 pb-3 pt-0 border-t border-slate-100 space-y-3 bg-slate-50/40">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 text-[11px]">
                  <div><span className="text-slate-400 block">Mulai</span><span className="font-medium text-slate-800">{log.tanggalMulai || '-'}</span></div>
                  <div><span className="text-slate-400 block">Estimasi</span><span className="font-medium text-slate-800">{log.estimasiSelesai || '-'}</span></div>
                  <div><span className="text-slate-400 block">Aktual selesai</span><span className="font-medium text-slate-800">{aktual || '-'}</span></div>
                  <div><span className="text-slate-400 block">Lama waktu</span><span className="font-medium text-slate-800">{log.lamaWaktuPerbaikan || '-'}</span></div>
                </div>

                {log.lokasiTipe === 'Eksternal' && (
                  <div className="text-[11px] rounded-lg border border-violet-100 bg-violet-50/60 p-2.5 space-y-0.5">
                    <p className="font-semibold text-violet-800">{log.vendorNama || 'Vendor'}</p>
                    {log.vendorKontak && <p className="text-slate-600">{log.vendorKontak}</p>}
                    {log.vendorAlamat && <p className="text-slate-500">{log.vendorAlamat}</p>}
                    <p className="text-slate-500 pt-1">
                      {log.tanggalKirim ? `Kirim ${log.tanggalKirim}` : 'Kirim -'}
                      {' · '}
                      {log.tanggalDiterima ? `Terima ${log.tanggalDiterima}` : 'Terima -'}
                    </p>
                  </div>
                )}

                {log.kendala && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800 flex items-center gap-1 mb-1">
                      <AlertTriangle size={12} /> Kendala
                    </p>
                    <p className="text-xs text-amber-950 whitespace-pre-wrap leading-relaxed">{log.kendala}</p>
                  </div>
                )}

                {log.catatan && (
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Catatan perbaikan</p>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{log.catatan}</p>
                  </div>
                )}

                {docCount > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5 flex items-center gap-1">
                      <Paperclip size={11} /> Dokumen ({docCount})
                    </p>
                    <ul className="space-y-1">
                      {(log.dokumenPendukung || []).map((doc, idx) => (
                        <li key={`${doc.name}-${idx}`} className="text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 truncate">
                          {doc.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MaintenanceFormModal({
  assets,
  maintenanceLogs,
  initialAsset = null,
  onClose,
  onSave,
}) {
  const [assetId, setAssetId] = useState(initialAsset?.id || '');
  const selected = assets.find((a) => a.id === Number(assetId) || a.id === assetId) || null;

  const [pic, setPic] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().split('T')[0]);
  const [estimasiSelesai, setEstimasiSelesai] = useState('');
  const [tanggalSelesaiAktual, setTanggalSelesaiAktual] = useState('');
  const [lamaWaktuPerbaikan, setLamaWaktuPerbaikan] = useState('');
  const [lamaHintTouched, setLamaHintTouched] = useState(false);
  const [lokasiTipe, setLokasiTipe] = useState('Internal');
  const [vendorId, setVendorId] = useState('');
  const [tanggalKirim, setTanggalKirim] = useState('');
  const [tanggalDiterima, setTanggalDiterima] = useState('');
  const [status, setStatus] = useState(
    selected?.statusPerawatan && selected.statusPerawatan !== 'Normal'
      ? selected.statusPerawatan
      : 'Perlu Diperbaiki'
  );
  const [foto, setFoto] = useState(null);
  const [dokumenPendukung, setDokumenPendukung] = useState([]);
  const [catatan, setCatatan] = useState('');
  const [kendala, setKendala] = useState('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [nextMaintenanceInterval, setNextMaintenanceInterval] = useState('');
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  const selectedVendor = getVendorById(vendorId);
  const isEksternal = lokasiTipe === 'Eksternal';
  const isSelesai = status === 'Selesai Diperbaiki';

  const itemLogs = useMemo(() => {
    if (!selected) return [];
    return maintenanceLogs
      .filter((l) => l.assetId === selected.id)
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }, [maintenanceLogs, selected]);

  useEffect(() => {
    if (!isSelesai || lamaHintTouched) return;
    const hint = calcLamaWaktuHint(tanggalMulai, tanggalSelesaiAktual);
    if (hint) setLamaWaktuPerbaikan(hint);
  }, [tanggalMulai, tanggalSelesaiAktual, isSelesai, lamaHintTouched]);

  useEffect(() => {
    if (!selected) {
      setNextMaintenanceInterval('');
      setNextMaintenanceDate('');
      return;
    }

    const intervalValue = selected.intervalMaintenanceHari != null ? String(selected.intervalMaintenanceHari) : '90';
    setNextMaintenanceInterval(intervalValue);

    if (selected.jadwalMaintenance) {
      setNextMaintenanceDate(selected.jadwalMaintenance);
    } else if (isSelesai) {
      setNextMaintenanceDate(addDaysToDate(tanggalSelesaiAktual || tanggalMulai, Number(intervalValue) || 0) || '');
    } else {
      setNextMaintenanceDate('');
    }
  }, [selected?.id, selected?.jadwalMaintenance, selected?.intervalMaintenanceHari, tanggalMulai, tanggalSelesaiAktual, isSelesai]);

  const fieldClass =
    'w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5';

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddDokumen = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDokumenPendukung((prev) => [
          ...prev,
          { name: file.name, data: reader.result, size: file.size },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAssetChange = (id) => {
    setAssetId(id);
    const next = assets.find((a) => String(a.id) === String(id));
    if (next?.statusPerawatan && next.statusPerawatan !== 'Normal') {
      setStatus(next.statusPerawatan);
    }
  };

  const handleSubmit = () => {
    if (!selected) {
      alert('Pilih item inventori terlebih dahulu');
      return;
    }
    if (!pic || !tanggalMulai || !estimasiSelesai) {
      alert('Mohon isi PIC, tanggal mulai, dan estimasi selesai');
      return;
    }
    if (isEksternal && !vendorId) {
      alert('Pilih vendor / tempat service untuk perbaikan eksternal');
      return;
    }
    if (isSelesai && (!tanggalSelesaiAktual || !lamaWaktuPerbaikan.trim())) {
      alert('Saat selesai, isi tanggal aktual selesai dan lama waktu perbaikan');
      return;
    }

    const vendor = isEksternal ? getVendorById(vendorId) : null;
    const interval = Number(selected.intervalMaintenanceHari) || 0;
    const nextInterval = Number(nextMaintenanceInterval) || interval || 0;
    const assetPatch = {
      ...buildAssetPatchFromMaintenance(status),
      id: selected.id,
      intervalMaintenanceHari: nextInterval,
    };

    if (isSelesai) {
      const pickedDate = nextMaintenanceDate?.trim();
      const fallbackDate = addDaysToDate(tanggalSelesaiAktual || tanggalMulai, nextInterval);
      assetPatch.jadwalMaintenance = pickedDate || fallbackDate || null;
    }

    const log = {
      id: Date.now(),
      assetId: selected.id,
      assetKode: selected.kode,
      assetNama: selected.nama,
      kategori: selected.kategori,
      pic,
      tanggalMulai,
      estimasiSelesai,
      tanggalSelesaiAktual: isSelesai ? tanggalSelesaiAktual : null,
      lokasiTipe,
      vendorId: vendor?.id || null,
      vendorNama: vendor?.nama || null,
      vendorKontak: vendor ? `${vendor.nomor} · ${vendor.kontak}` : null,
      vendorAlamat: vendor?.alamat || null,
      tanggalKirim: isEksternal ? (tanggalKirim || null) : null,
      tanggalDiterima: isEksternal ? (tanggalDiterima || null) : null,
      status,
      foto,
      dokumenPendukung,
      lamaWaktuPerbaikan: isSelesai ? lamaWaktuPerbaikan.trim() : null,
      catatan: catatan || '',
      kendala: kendala || '',
      createdAt: new Date().toISOString(),
    };

    onSave(log, assetPatch);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Catat / Update Perbaikan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Timeline, lokasi service, dokumen, dan log perawatan</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <label className={labelClass}>Item Inventori *</label>
            <select
              value={assetId}
              onChange={(e) => handleAssetChange(e.target.value)}
              disabled={Boolean(initialAsset)}
              className={`${fieldClass} ${initialAsset ? 'bg-slate-50' : ''}`}
            >
              <option value="">Pilih aset / sparepart / pisau...</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.kategori}] {a.kode} — {a.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>PIC *</label>
              <input value={pic} onChange={(e) => setPic(e.target.value)} placeholder="Nama penanggung jawab" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Status Perawatan *</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
                {MAINTENANCE_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Lokasi / Tempat Service *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOKASI_PERAWATAN_OPTIONS.map((opt) => {
                const active = lokasiTipe === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      active
                        ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="lokasiTipe"
                      className="sr-only"
                      checked={active}
                      onChange={() => {
                        setLokasiTipe(opt.value);
                        if (opt.value === 'Internal') {
                          setVendorId('');
                          setTanggalKirim('');
                          setTanggalDiterima('');
                        }
                      }}
                    />
                    <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-800'}`}>{opt.label}</p>
                    <p className={`text-[11px] mt-0.5 ${active ? 'text-orange-100' : 'text-slate-500'}`}>{opt.desc}</p>
                  </label>
                );
              })}
            </div>
          </div>

          {isEksternal && (
            <div className="space-y-4 p-4 rounded-xl border border-violet-100 bg-violet-50/40">
              <div className="flex items-center gap-2 text-violet-800">
                <MapPin size={14} />
                <span className="text-xs font-bold uppercase tracking-wide">Service Eksternal</span>
              </div>
              <div>
                <label className={labelClass}>Vendor / Tempat Service *</label>
                <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className={fieldClass}>
                  <option value="">Pilih vendor...</option>
                  {vendorsMaster.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nama} ({v.nomor})
                    </option>
                  ))}
                </select>
                {selectedVendor && (
                  <div className="mt-2 text-[11px] text-slate-600 space-y-0.5 bg-white border border-slate-200 rounded-lg p-3">
                    <p><span className="text-slate-400">Nomor:</span> {selectedVendor.nomor}</p>
                    <p><span className="text-slate-400">Kontak:</span> {selectedVendor.kontak}</p>
                    <p><span className="text-slate-400">Alamat:</span> {selectedVendor.alamat}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tanggal Pengiriman</label>
                  <input type="date" value={tanggalKirim} onChange={(e) => setTanggalKirim(e.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Tanggal Diterima</label>
                  <input type="date" value={tanggalDiterima} onChange={(e) => setTanggalDiterima(e.target.value)} className={fieldClass} />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tanggal Mulai *</label>
              <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Estimasi Selesai *</label>
              <input type="date" value={estimasiSelesai} onChange={(e) => setEstimasiSelesai(e.target.value)} className={fieldClass} />
            </div>
          </div>

          {isSelesai && (
            <div className="space-y-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tanggal Aktual Selesai *</label>
                  <input
                    type="date"
                    value={tanggalSelesaiAktual}
                    onChange={(e) => setTanggalSelesaiAktual(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Lama Waktu Perbaikan *</label>
                  <input
                    value={lamaWaktuPerbaikan}
                    onChange={(e) => {
                      setLamaHintTouched(true);
                      setLamaWaktuPerbaikan(e.target.value);
                    }}
                    placeholder="Contoh: 5 hari"
                    className={fieldClass}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Dihitung otomatis dari mulai → aktual; bisa diedit</p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CalendarClock size={14} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Estimasi perbaikan berikutnya</p>
                </div>
                <p className="text-[11px] text-slate-600">Setelah perbaikan selesai, Anda bisa menetapkan jadwal pemeliharaan berikutnya dan sistem akan mengirimkan pengingat otomatis.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Jadwal maintenance berikutnya</label>
                    <input
                      type="date"
                      value={nextMaintenanceDate}
                      onChange={(e) => setNextMaintenanceDate(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Interval (hari)</label>
                    <input
                      type="number"
                      min="0"
                      value={nextMaintenanceInterval}
                      onChange={(e) => setNextMaintenanceInterval(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Catatan perbaikan</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
              placeholder="Detail pekerjaan, sparepart diganti, hasil inspeksi, dll. (boleh panjang)"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all resize-y min-h-[96px]"
            />
          </div>

          <div>
            <label className={labelClass}>Kendala / hambatan</label>
            <textarea
              value={kendala}
              onChange={(e) => setKendala(e.target.value)}
              rows={3}
              placeholder="Contoh: spare belum datang, antrian vendor, menunggu PO..."
              className="w-full px-3.5 py-2.5 border border-amber-200 rounded-xl text-sm bg-amber-50/30 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none transition-all resize-y min-h-[80px]"
            />
          </div>

          <div>
            <label className={labelClass}>Foto Perbaikan</label>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {foto ? (
                  <img src={foto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-slate-300" size={24} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600">Dokumentasi kondisi / proses perbaikan</p>
                <label className="inline-block mt-2 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-orange-700">
                  Pilih Foto
                  <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
                </label>
                {foto && (
                  <button type="button" onClick={() => setFoto(null)} className="ml-2 text-xs text-red-600 font-medium">
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Dokumen Pendukung</label>
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-600">Surat jalan, invoice, BA, atau file lain</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-100">
                  <Paperclip size={12} /> Tambah File
                  <input type="file" multiple onChange={handleAddDokumen} className="hidden" />
                </label>
              </div>
              {dokumenPendukung.length === 0 ? (
                <p className="text-[11px] text-slate-400">Belum ada dokumen.</p>
              ) : (
                <ul className="space-y-1.5">
                  {dokumenPendukung.map((doc, idx) => (
                    <li key={`${doc.name}-${idx}`} className="flex items-center justify-between gap-2 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <span className="truncate font-medium text-slate-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => setDokumenPendukung((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 font-medium shrink-0"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <History size={14} className="text-orange-600" />
              <h3 className="text-sm font-bold text-slate-700">Log Maintenance</h3>
            </div>
            <MaintenanceLogList logs={itemLogs} onViewDetails={setSelectedLogDetail} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-white">
            Batal
          </button>
          <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-semibold bg-orange-600 text-white rounded-xl hover:bg-orange-700">
            Simpan Perbaikan
          </button>
        </div>
      </div>
      {selectedLogDetail && (
        <MaintenanceLogDetailModal log={selectedLogDetail} onClose={() => setSelectedLogDetail(null)} />
      )}
    </div>
  );
}

export function MaintenanceLogModal({ asset, maintenanceLogs, onClose, onUpdate }) {
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  if (!asset) return null;
  const logs = maintenanceLogs
    .filter((l) => l.assetId === asset.id)
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Log Perawatan</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{asset.kode}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">{asset.nama}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Riwayat perbaikan dan status terkini</p>
            </div>
            <div className="flex items-center gap-2">
              <PerawatanBadge status={asset.statusPerawatan} />
              <button
                type="button"
                onClick={onUpdate}
                className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-100"
              >
                Update Perbaikan
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">Klik tombol Detail di sisi kanan setiap log untuk melihat informasi lengkap dalam popup.</p>
          <MaintenanceLogList logs={logs} defaultExpanded onViewDetails={setSelectedLogDetail} />
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-slate-100 rounded-lg hover:bg-slate-200">
            Tutup
          </button>
        </div>
      </div>
      {selectedLogDetail && (
        <MaintenanceLogDetailModal log={selectedLogDetail} onClose={() => setSelectedLogDetail(null)} />
      )}
    </div>
  );
}

export function MaintenanceView({ assets, maintenanceLogs, onOpenForm, onViewLog }) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets
      .filter((a) => {
        const status = a.statusPerawatan || 'Normal';
        if (filterStatus !== 'Semua' && status !== filterStatus) return false;
        if (!q) return true;
        return (
          String(a.kode).toLowerCase().includes(q) ||
          String(a.nama).toLowerCase().includes(q) ||
          String(a.kategori).toLowerCase().includes(q)
        );
      })
      .map((a) => {
        const latest = getLatestMaintenanceLog(maintenanceLogs, a.id);
        return { asset: a, latest };
      });
  }, [assets, maintenanceLogs, filterStatus, search]);

  const notifs = useMemo(() => getMaintenanceNotifications(assets), [assets]);

  const stats = {
    perlu: assets.filter((a) => a.statusPerawatan === 'Perlu Diperbaiki').length,
    dalam: assets.filter((a) => a.statusPerawatan === 'Dalam Perbaikan').length,
    selesai: assets.filter((a) => a.statusPerawatan === 'Selesai Diperbaiki').length,
    jadwalDue: notifs.length,
  };

  const filters = ['Semua', ...STATUS_PERAWATAN_OPTIONS];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Perawatan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Satu pintu untuk daftar, update perbaikan, dan log maintenance (Aset / Sparepart / Pisau). Jadwal diatur di detail item.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenForm(null)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 shadow-sm"
        >
          <Plus size={16} /> Catat Perbaikan
        </button>
      </div>

      {notifs.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-amber-900 shrink-0">
            <AlertTriangle size={18} className="text-amber-600" />
            <span className="text-sm font-semibold">{notifs.length} item perlu maintenance</span>
          </div>
          <p className="text-xs text-amber-800/90 flex-1">
            {notifs.slice(0, 3).map((n) => n.kode).join(', ')}
            {notifs.length > 3 ? ` +${notifs.length - 3} lainnya` : ''}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-amber-50 border-amber-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Perlu Diperbaiki</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.perlu}</p>
        </div>
        <div className="p-4 rounded-xl border bg-orange-50 border-orange-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Dalam Perbaikan</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.dalam}</p>
        </div>
        <div className="p-4 rounded-xl border bg-sky-50 border-sky-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Selesai Diperbaiki</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.selesai}</p>
        </div>
        <div className="p-4 rounded-xl border bg-red-50 border-red-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Jadwal Due / Terlewat</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.jadwalDue}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode / nama..."
            className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterStatus === f ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <Wrench size={16} className="text-orange-600" />
          <h3 className="text-sm font-bold text-slate-700">Daftar Inventori & Status Perawatan</h3>
        </div>
        {rows.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center">
            <PackageSearch size={40} className="mb-2 text-slate-300" />
            Tidak ada item yang cocok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">PIC</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lokasi / Estimasi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ asset, latest }) => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">{asset.kode}</td>
                    <td className="px-4 py-3 font-medium max-w-[180px] truncate">{asset.nama}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${kategoriStyle(asset.kategori)}`}>
                        {asset.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{latest?.pic || '-'}</td>
                    <td className="px-4 py-3">
                      <PerawatanBadge status={asset.statusPerawatan} />
                      {latest?.kendala && (
                        <span className="block mt-1 text-[10px] text-amber-700 font-medium">Ada kendala</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      <div>{lokasiLabel(latest)}</div>
                      <div className="text-slate-400">{latest?.estimasiSelesai || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onViewLog(asset)}
                          className="p-2 text-slate-500 hover:bg-slate-50 border-r"
                          title="Lihat Log"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenForm(asset)}
                          className="p-2 text-orange-600 hover:bg-orange-50"
                          title="Update Perbaikan"
                        >
                          <Wrench size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export function JadwalPerawatanTab({ asset, onSave }) {
  const [jadwalMaintenance, setJadwalMaintenance] = useState(asset?.jadwalMaintenance || '');
  const [intervalMaintenanceHari, setIntervalMaintenanceHari] = useState(
    asset?.intervalMaintenanceHari != null ? String(asset.intervalMaintenanceHari) : '90'
  );

  useEffect(() => {
    setJadwalMaintenance(asset?.jadwalMaintenance || '');
    setIntervalMaintenanceHari(
      asset?.intervalMaintenanceHari != null ? String(asset.intervalMaintenanceHari) : '90'
    );
  }, [asset?.id, asset?.jadwalMaintenance, asset?.intervalMaintenanceHari]);

  const fieldClass =
    'w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 outline-none transition-all';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5';
  const status = getJadwalMaintenanceStatus(jadwalMaintenance);

  const handleSave = () => {
    onSave({
      ...asset,
      jadwalMaintenance: jadwalMaintenance || null,
      intervalMaintenanceHari: Number(intervalMaintenanceHari) || 0,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <CalendarClock size={16} className="text-orange-600" />
        <h3 className="text-sm font-bold text-slate-800">Jadwal Perawatan</h3>
        <JadwalBadge jadwal={jadwalMaintenance} />
      </div>
      <p className="text-xs text-slate-500">
        Atur tanggal perawatan berikutnya untuk item ini. Notifikasi muncul jika terlewat atau dalam 7 hari.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tanggal Perawatan Berikutnya</label>
          <input type="date" value={jadwalMaintenance} onChange={(e) => setJadwalMaintenance(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Interval Periodic (hari)</label>
          <input
            type="number"
            min="0"
            value={intervalMaintenanceHari}
            onChange={(e) => setIntervalMaintenanceHari(e.target.value)}
            placeholder="90"
            className={fieldClass}
          />
        </div>
      </div>
      {status === 'overdue' && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">Jadwal sudah terlewat — segera lakukan perawatan.</p>
      )}
      {status === 'dueSoon' && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">Perawatan harus dilakukan dalam waktu dekat.</p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2.5 text-sm font-semibold bg-orange-600 text-white rounded-xl hover:bg-orange-700"
        >
          Simpan Jadwal
        </button>
      </div>
    </div>
  );
}

export function MaintenanceHistoryPanel({ logs, showTitle = true }) {
  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="flex items-center gap-2">
          <History size={16} className="text-orange-600" />
          <h3 className="text-sm font-bold text-slate-700">Histori Perawatan</h3>
        </div>
      )}
      <MaintenanceLogList logs={logs} />
    </div>
  );
}
