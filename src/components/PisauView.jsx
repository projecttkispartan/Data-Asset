import { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowRightLeft,
  CornerDownLeft,
  Camera,
  History,
  ChevronLeft,
  ChevronRight,
  Scissors,
  MapPin,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { formatRp, isAsetRole, isPartRole, canBorrow, canStartBorrow } from '../data/mockData';
import { StatusBadge } from './SharedUI';
import { JadwalPerawatanTab } from './MaintenanceView';
import { DepreciationModal } from './PisauFormPage';

function getFotoUtama(p) {
  return p?.fotoUtama || p?.gambar || p?.gambarPerspektif || null;
}

function PeranBadge({ peran }) {
  const p = peran || 'Keduanya';
  const style =
    p === 'Aset' ? 'bg-blue-50 text-blue-700 ring-blue-100' :
    p === 'Part' ? 'bg-purple-50 text-purple-700 ring-purple-100' :
    'bg-sky-50 text-sky-700 ring-sky-100';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${style}`}>{p}</span>;
}

function FungsiPills({ fungsi = [] }) {
  const visible = fungsi.slice(0, 2);
  const extra = fungsi.length - visible.length;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((f) => (
        <span key={f} className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100 text-[11px] font-medium">{f}</span>
      ))}
      {extra > 0 && (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">+{extra}</span>
      )}
      {fungsi.length === 0 && <span className="text-slate-400">-</span>}
    </div>
  );
}

function PhotoThumb({ src, alt, size = 'md' }) {
  const dim = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  return (
    <div className={`${dim} rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ring-1 ring-slate-200/80 flex items-center justify-center flex-shrink-0`}>
      {src ? (
        <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
      ) : (
        <Camera size={size === 'sm' ? 14 : 18} className="text-slate-400" />
      )}
    </div>
  );
}

function ActionIconButton({ icon: Icon, title, onClick, tone = 'slate' }) {
  const tones = {
    slate: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-200',
    sky: 'text-sky-600 hover:text-sky-700 hover:bg-sky-50 border-sky-200',
    emerald: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200',
    violet: 'text-violet-600 hover:text-violet-700 hover:bg-violet-50 border-violet-200',
    orange: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200',
    red: 'text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border transition-colors ${tones[tone]}`}
    >
      <Icon size={15} />
    </button>
  );
}

export function DataPisauView({
  assets,
  onAdd,
  onEdit,
  onDelete,
  onBorrow,
  onViewDetail,
  onViewLogs
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pisauList = assets.filter((a) => a.kategori === 'Pisau');
  const filtered = pisauList.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      p.kode?.toLowerCase().includes(q) ||
      p.nama?.toLowerCase().includes(q) ||
      p.vendor?.toLowerCase().includes(q) ||
      (p.fungsi || []).some((f) => f.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * rowsPerPage;
  const pageItems = filtered.slice(start, start + rowsPerPage);

  const stats = {
    total: pisauList.length,
    sebagaiAset: pisauList.filter((p) => isAsetRole(p)).length,
    sebagaiPart: pisauList.filter((p) => isPartRole(p)).length,
    tersedia: pisauList.filter(canStartBorrow).length,
    dipinjam: pisauList.filter((p) => (p.statusPinjam === 'Dipinjam' || p.statusPinjam === 'Terlambat') && canBorrow(p)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Inventaris Cutting Tool</p>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
              <Scissors size={22} />
            </span>
            Pisau
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Satu data pisau terhubung ke modul Aset (pinjam) dan Part (kalkulasi). Perawatan dikelola di menu Perawatan.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all shadow-lg shadow-sky-200/60 hover:shadow-sky-300/70 hover:-translate-y-0.5"
        >
          <Plus size={18} /> Pisau Baru
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Pisau', value: stats.total, tone: 'from-sky-500 to-cyan-600' },
          { label: 'Sebagai Aset', value: stats.sebagaiAset, tone: 'from-blue-500 to-indigo-600' },
          { label: 'Sebagai Part', value: stats.sebagaiPart, tone: 'from-violet-500 to-purple-600' },
          { label: 'Dipinjam', value: stats.dipinjam, tone: 'from-rose-500 to-red-600' },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm">
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.tone} opacity-[0.12]`} />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white/80 backdrop-blur p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter size={16} /> Filter
        </button>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari kode, nama, vendor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 focus:bg-white outline-none transition-all"
          />
        </div>
        <span className="text-sm text-slate-500 px-2">{filtered.length} ditemukan</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-4 py-3.5 text-center w-12">#</th>
                <th className="px-4 py-3.5">Foto</th>
                <th className="px-4 py-3.5">Kode / Nama</th>
                <th className="px-4 py-3.5">Peran</th>
                <th className="px-4 py-3.5">Harga</th>
                <th className="px-4 py-3.5">Fungsi</th>
                <th className="px-4 py-3.5">Pinjam</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                    Belum ada data pisau.
                  </td>
                </tr>
              )}
              {pageItems.map((pisau, index) => (
                <tr
                  key={pisau.id}
                  onClick={() => onViewDetail(pisau)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') onViewDetail(pisau);
                  }}
                  tabIndex={0}
                  className="hover:bg-sky-50/40 transition-colors group cursor-pointer focus:outline-none focus:bg-sky-50/70"
                  title="Klik field mana pun untuk melihat detail"
                >
                  <td className="px-4 py-3 text-center text-slate-400 tabular-nums">{start + index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => onViewDetail(pisau)} title="Foto Utama">
                        <PhotoThumb src={getFotoUtama(pisau)} alt={pisau.nama} size="md" />
                      </button>
                      {pisau.gambarHasil && (
                        <div title="Hasil Penggunaan" className="opacity-80 group-hover:opacity-100 transition-opacity">
                          <PhotoThumb src={pisau.gambarHasil} alt="Hasil" size="sm" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => onViewDetail(pisau)} className="font-mono text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors">
                      {pisau.kode}
                    </button>
                    <p className="font-semibold text-slate-800 mt-0.5">{pisau.nama}</p>
                    <p className="text-[11px] text-slate-400">{pisau.merk} · {pisau.vendor || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <PeranBadge peran={pisau.peranInventori} />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {isAsetRole(pisau) && <span className="text-[9px] text-blue-600">Aset</span>}
                      {isPartRole(pisau) && <span className="text-[9px] text-purple-600">Part</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 tabular-nums">
                    {pisau.hargaBeli ? formatRp(pisau.hargaBeli) : '-'}
                  </td>
                  <td className="px-4 py-3"><FungsiPills fungsi={pisau.fungsi} /></td>
                  <td className="px-4 py-3">
                    {canBorrow(pisau) ? (
                      <StatusBadge type="peminjaman" status={pisau.statusPinjam} />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Part only</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 shadow-inner">
                      <ActionIconButton icon={Eye} title="Detail" onClick={() => onViewDetail(pisau)} tone="slate" />
                      {canBorrow(pisau) && (
                        <ActionIconButton icon={History} title="Log" onClick={() => onViewLogs(pisau)} tone="violet" />
                      )}
                      {canStartBorrow(pisau) && (
                        <ActionIconButton icon={ArrowRightLeft} title="Pinjam" onClick={() => onBorrow(pisau)} tone="sky" />
                      )}
                      {canBorrow(pisau) && (pisau.statusPinjam === 'Dipinjam' || pisau.statusPinjam === 'Terlambat') && (
                        <ActionIconButton icon={CornerDownLeft} title="Kembalikan" onClick={() => onBorrow(pisau)} tone="orange" />
                      )}
                      <ActionIconButton icon={Edit} title="Edit" onClick={() => onEdit(pisau)} tone="emerald" />
                      <ActionIconButton icon={Trash2} title="Hapus" onClick={() => onDelete(pisau.id)} tone="red" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-600 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Baris per halaman</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="min-w-[2.5rem] text-center px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-semibold">{currentPage}</span>
            <span className="text-slate-400 text-xs">/ {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PisauDetailModal({ asset, borrowLogs, onClose, onEdit, onSaveJadwal }) {
  const [tab, setTab] = useState('info');
  const [showDepreciation, setShowDepreciation] = useState(false);
  if (!asset) return null;

  const logs = borrowLogs.filter((l) => l.assetId === asset.id);
  const utama = getFotoUtama(asset);

  return (
    <>
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-5xl my-8 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">{asset.nama}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 text-2xl leading-none">&times;</button>
        </div>

        <div className="px-8 pt-3 bg-white border-b border-slate-200">
          <div className="flex gap-1">
            {[
              ['info', 'Informasi'],
              ['jadwal', 'Jadwal & Perawatan'],
              ['pinjam', 'Riwayat Pinjam'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-1">
          {tab === 'info' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-700">Informasi Umum & Lokasi</h3>
                <button onClick={onEdit} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                  <Edit size={14} /> Ubah
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div className="col-span-1 md:col-span-2 flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                    <div className="w-24 h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {utama ? (
                        <img src={utama} alt={asset.nama} className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={32} className="text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{asset.nama}</h4>
                      <p className="text-xs font-mono text-slate-500 mt-0.5 font-bold text-blue-700">{asset.kode}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge type="kondisi" status={asset.kondisi} />
                        {canBorrow(asset) ? (
                          <StatusBadge type="peminjaman" status={asset.statusPinjam} />
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Part-only</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Nama</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.nama}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Kondisi</span>
                    <span className="col-span-2"><StatusBadge type="kondisi" status={asset.kondisi} /></span>
                  </div>
                  <div className="col-span-1 md:col-span-2 rounded-xl border border-orange-100 bg-orange-50/60 px-3.5 py-2.5 text-xs text-orange-900">
                    Update perbaikan aktif di menu <span className="font-semibold">Perawatan</span>. Jadwal diatur di tab <span className="font-semibold">Jadwal & Perawatan</span>.
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Peran Inventori</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.peranInventori || asset.tipe || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Status Pinjam</span>
                    <span className="col-span-2">{canBorrow(asset) ? <StatusBadge type="peminjaman" status={asset.statusPinjam} /> : <span className="text-slate-400 text-xs">Tidak dipinjamkan (Part only)</span>}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">No. Seri</span>
                    <span className="font-mono text-slate-800 col-span-2">{asset.noSeri || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">No. Registrasi</span>
                    <span className="font-mono text-slate-800 col-span-2">{asset.noRegistrasi || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Vendor</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.vendor || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Nilai / Harga Beli</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.hargaBeli ? formatRp(asset.hargaBeli) : '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Tanggal Pembelian</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.tanggalBeli || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Masa Garansi</span>
                    <span className="font-semibold text-rose-700 col-span-2 flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded border border-rose-100 max-w-max">
                      <ShieldAlert size={14} /> {asset.tanggalGaransi || 'Tidak Ada Garansi / Expired'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3 col-span-1 md:col-span-2">
                    <span className="text-slate-500 col-span-1 font-semibold">Penempatan Lokasi</span>
                    <div className="col-span-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                        <MapPin size={16} className="text-red-500" /> {asset.gudang || '-'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium">
                          Area: <strong className="text-slate-900">{asset.area || '-'}</strong>
                        </span>
                        <span className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium">
                          Rak: <strong className="text-slate-900">{asset.rak || '-'}</strong>
                        </span>
                        <span className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium">
                          Box: <strong className="text-slate-900">{asset.box || '-'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Ukuran</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.panjang ? `${asset.panjang}×${asset.lebar}×${asset.tinggi} mm` : '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Laminasi</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.laminasi || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Mata Pisau</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.jumlahMata || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Unit</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.unit || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Merek</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.merk || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Produk</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.produk || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Bahan Baku</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.bahanBaku || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Fungsi</span>
                    <span className="font-medium text-slate-800 col-span-2">{asset.fungsi?.length ? asset.fungsi.join(', ') : '-'}</span>
                  </div>
                  {(asset.kategori === 'Aset' || asset.kategori === 'Sparepart') && (
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                      <span className="text-slate-500 col-span-1">Depresiasi</span>
                      <span className="font-medium text-slate-800 col-span-2 flex items-center gap-2">
                        {asset.depresiasiType === 'Persen' ? `${asset.depresiasiValue || 0}% / thn` : (asset.depresiasiValue ? formatRp(asset.depresiasiValue) : '-')}
                        <button onClick={() => setShowDepreciation(true)} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full transition-colors" title="Lihat Tabel Depresiasi">
                          <Info size={16} />
                        </button>
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3 col-span-1 md:col-span-2">
                    <span className="text-slate-500 col-span-1">Catatan</span>
                    <span className="font-medium text-slate-800 col-span-2 bg-slate-100 p-2.5 rounded-lg border">{asset.catatan || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'jadwal' && (
            <JadwalPerawatanTab
              asset={asset}
              onSave={(updated) => onSaveJadwal?.(updated)}
            />
          )}

          {tab === 'pinjam' && <BorrowLogTable logs={logs} />}
        </div>

        <div className="px-8 py-4 border-t border-slate-200 flex justify-end bg-white sticky bottom-0 z-10">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">Kembali</button>
        </div>
      </div>
    </div>
    {showDepreciation && (
      <DepreciationModal
        hargaBeli={Number(asset.hargaBeli) || 0}
        jenis={asset.depresiasiType || 'Persen'}
        nilai={Number(asset.depresiasiValue) || 0}
        masa={Number(asset.masaManfaat) || 5}
        tahunBeli={asset.tanggalBeli ? parseInt(asset.tanggalBeli.split('-')[0], 10) : new Date().getFullYear()}
        onClose={() => setShowDepreciation(false)}
      />
    )}
    </>
  );
}

export function BorrowLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10 text-sm bg-white rounded-2xl border border-slate-200">
        Belum ada riwayat peminjaman.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <History size={16} className="text-sky-600" />
        <h3 className="text-sm font-bold text-slate-700">Sirkulasi & Peminjaman</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2.5">No. Surat Jalan</th>
              <th className="px-3 py-2.5">Nama Peminjam</th>
              <th className="px-3 py-2.5">Tgl Dipinjam</th>
              <th className="px-3 py-2.5">Deadline Kembali</th>
              <th className="px-3 py-2.5">Tgl Kembali</th>
              <th className="px-3 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className={log.status === 'Terlambat' ? 'bg-red-50/50' : log.status === 'Dipinjam' ? 'bg-amber-50/40' : ''}>
                <td className="px-3 py-2.5 font-bold text-sky-600">{log.kodeSurat}</td>
                <td className="px-3 py-2.5">{log.namaPeminjam}</td>
                <td className="px-3 py-2.5">{log.tanggalPinjam}</td>
                <td className="px-3 py-2.5 font-medium">{log.deadlineKembali || '-'}</td>
                <td className="px-3 py-2.5">{log.tanggalKembali || '-'}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    log.status === 'Dikembalikan' ? 'bg-emerald-100 text-emerald-700' :
                    log.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
                    log.status === 'Dipinjam' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PisauLogModal({ asset, borrowLogs, onClose }) {
  if (!asset) return null;
  const logs = borrowLogs.filter((l) => l.assetId === asset.id);
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PhotoThumb src={getFotoUtama(asset)} alt={asset.nama} />
            <div>
              <h3 className="font-bold text-slate-800">Log Peminjaman</h3>
              <p className="text-xs text-slate-500 mt-0.5">{asset.kode} — {asset.nama}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <BorrowLogTable logs={logs} />
        </div>
        <div className="px-6 py-3 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-slate-100 rounded-xl hover:bg-slate-200">Tutup</button>
        </div>
      </div>
    </div>
  );
}
