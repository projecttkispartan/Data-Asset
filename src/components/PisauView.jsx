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
} from 'lucide-react';
import { formatRp, isAsetRole, isPartRole, canBorrow } from '../data/mockData';
import { StatusBadge } from './SharedUI';
import { JadwalPerawatanTab } from './MaintenanceView';

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

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
  const [calcItems, setCalcItems] = useState([]);

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
    tersedia: pisauList.filter((p) => p.statusPinjam === 'Tersedia' && canBorrow(p)).length,
    dipinjam: pisauList.filter((p) => (p.statusPinjam === 'Dipinjam' || p.statusPinjam === 'Terlambat') && canBorrow(p)).length,
  };

  const partOptions = pisauList.filter((p) => isPartRole(p));

  const addCalcPart = (id) => {
    const part = partOptions.find((p) => String(p.id) === String(id));
    if (!part || calcItems.find((c) => c.id === part.id)) return;
    setCalcItems([...calcItems, { id: part.id, kode: part.kode, nama: part.nama, harga: part.hargaBeli || 0, qty: 1 }]);
  };

  const updateCalcQty = (id, qty) => {
    setCalcItems(calcItems.map((c) => (c.id === id ? { ...c, qty: Math.max(1, Number(qty) || 1) } : c)));
  };

  const removeCalc = (id) => setCalcItems(calcItems.filter((c) => c.id !== id));
  const calcTotal = calcItems.reduce((sum, c) => sum + c.harga * c.qty, 0);

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

      {/* Kalkulasi Part — dari pisau yang berperan Part */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-purple-50 to-white">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Kalkulasi Part (Pisau)</h3>
            <p className="text-xs text-slate-500">Pakai pisau dengan peran Part / Keduanya sebagai bahan hitung biaya.</p>
          </div>
          <select
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white max-w-xs"
            value=""
            onChange={(e) => { addCalcPart(e.target.value); e.target.value = ''; }}
          >
            <option value="">+ Tambah part ke kalkulasi...</option>
            {partOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.kode} — {p.nama} ({formatRp(p.hargaBeli || 0)})</option>
            ))}
          </select>
        </div>
        {calcItems.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400 text-center">Belum ada part dipilih. Pisau ber-peran Part muncul di sini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 text-left">Kode</th>
                  <th className="px-4 py-2.5 text-left">Nama</th>
                  <th className="px-4 py-2.5 text-right">Harga</th>
                  <th className="px-4 py-2.5 text-center">Qty</th>
                  <th className="px-4 py-2.5 text-right">Subtotal</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calcItems.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-purple-700">{c.kode}</td>
                    <td className="px-4 py-2.5">{c.nama}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatRp(c.harga)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <input type="number" min={1} value={c.qty} onChange={(e) => updateCalcQty(c.id, e.target.value)} className="w-16 text-center border border-slate-200 rounded-lg py-1" />
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{formatRp(c.harga * c.qty)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button type="button" onClick={() => removeCalc(c.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-purple-50/50">
                  <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Total Kalkulasi</td>
                  <td className="px-4 py-3 text-right text-base font-bold text-purple-800 tabular-nums">{formatRp(calcTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

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
                <tr key={pisau.id} className="hover:bg-sky-50/40 transition-colors group">
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
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                      <button onClick={() => onViewDetail(pisau)} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border-r border-slate-100" title="Detail">
                        <Eye size={15} />
                      </button>
                      {canBorrow(pisau) && (
                        <button onClick={() => onViewLogs(pisau)} className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 border-r border-slate-100" title="Log">
                          <History size={15} />
                        </button>
                      )}
                      {canBorrow(pisau) && pisau.statusPinjam === 'Tersedia' && (
                        <button onClick={() => onBorrow(pisau)} className="p-2 text-sky-600 hover:bg-sky-50 border-r border-slate-100" title="Pinjam">
                          <ArrowRightLeft size={15} />
                        </button>
                      )}
                      {canBorrow(pisau) && (pisau.statusPinjam === 'Dipinjam' || pisau.statusPinjam === 'Terlambat') && (
                        <button onClick={() => onBorrow(pisau)} className="p-2 text-orange-600 hover:bg-orange-50 border-r border-slate-100" title="Kembalikan">
                          <CornerDownLeft size={15} />
                        </button>
                      )}
                      <button onClick={() => onEdit(pisau)} className="p-2 text-emerald-600 hover:bg-emerald-50 border-r border-slate-100" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => onDelete(pisau.id)} className="p-2 text-red-500 hover:bg-red-50" title="Hapus">
                        <Trash2 size={15} />
                      </button>
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

export function PisauDetailModal({ asset, borrowLogs, onClose, onEdit, onBorrow, onSaveJadwal }) {
  const [tab, setTab] = useState('info');
  if (!asset) return null;

  const logs = borrowLogs.filter((l) => l.assetId === asset.id);
  const utama = getFotoUtama(asset);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#f4f7fb] rounded-3xl shadow-2xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{asset.nama}</h2>
            <p className="text-xs font-mono text-sky-600 font-bold mt-0.5">{asset.kode}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-xl leading-none">&times;</button>
        </div>

        <div className="px-6 pt-3 bg-white border-b border-slate-200">
          <div className="flex gap-1">
            {[
              ['info', 'Informasi'],
              ['jadwal', 'Jadwal Perawatan'],
              ['pinjam', 'Histori Pinjam'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === id ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Foto Utama Pisau</div>
                  <div className="aspect-square bg-slate-100 flex items-center justify-center">
                    {utama ? (
                      <img src={utama} alt="Foto Utama" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={40} className="text-slate-300" />
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Hasil Penggunaan</div>
                  <div className="aspect-square bg-slate-100 flex items-center justify-center">
                    {asset.gambarHasil ? (
                      <img src={asset.gambarHasil} alt="Hasil Penggunaan" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={40} className="text-slate-300" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-sm shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-slate-500 text-xs">Peran Inventori</span><div className="mt-1"><PeranBadge peran={asset.peranInventori} /></div></div>
                  <div><span className="text-slate-500 text-xs">Status Pinjam</span><div className="mt-1">{canBorrow(asset) ? <StatusBadge type="peminjaman" status={asset.statusPinjam} /> : <span className="text-slate-400 text-xs">Tidak dipinjamkan (Part only)</span>}</div></div>
                  <div><span className="text-slate-500 text-xs">Kondisi</span><div className="mt-1"><StatusBadge type="kondisi" status={asset.kondisi} /></div></div>
                  <div><span className="text-slate-500 text-xs">No. Seri</span><p className="font-mono font-medium mt-0.5 text-slate-800">{asset.noSeri || '-'}</p></div>
                  <div><span className="text-slate-500 text-xs">No. Registrasi</span><p className="font-mono font-medium mt-0.5 text-slate-800">{asset.noRegistrasi || '-'}</p></div>
                  <div><span className="text-slate-500 text-xs">Vendor</span><p className="font-medium mt-0.5">{asset.vendor || '-'}</p></div>
                  <div><span className="text-slate-500 text-xs">Harga</span><p className="font-medium mt-0.5">{asset.hargaBeli ? formatRp(asset.hargaBeli) : '-'}</p></div>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/60 px-3.5 py-2.5 text-xs text-orange-900">
                  Update perbaikan di menu <span className="font-semibold">Perawatan</span>. Jadwal di tab <span className="font-semibold">Jadwal Perawatan</span>.
                </div>
                {asset.catatan && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 text-xs">Catatan</span>
                    <p className="mt-1 text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5">{asset.catatan}</p>
                  </div>
                )}
                {isAsetRole(asset) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                    <div><span className="text-slate-500 text-xs">Tgl Beli</span><p className="font-medium mt-0.5">{asset.tanggalBeli || '-'}</p></div>
                    <div><span className="text-slate-500 text-xs">Garansi</span><p className="font-medium mt-0.5">{asset.tanggalGaransi || '-'}</p></div>
                    <div><span className="text-slate-500 text-xs">Depresiasi</span><p className="font-medium mt-0.5">{asset.depresiasiType === 'Persen' ? `${asset.depresiasiValue || 0}% / thn` : (asset.depresiasiValue ? formatRp(asset.depresiasiValue) : '-')}</p></div>
                    <div><span className="text-slate-500 text-xs">Masa Manfaat</span><p className="font-medium mt-0.5">{asset.masaManfaat ? `${asset.masaManfaat} tahun` : '-'}</p></div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {isAsetRole(asset) && <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">Terhubung Data Aset · Pinjam</span>}
                  {isPartRole(asset) && <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">Terhubung Part · Bahan Kalkulasi</span>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                  <div><span className="text-slate-500 text-xs">Ukuran</span><p className="font-medium">{asset.panjang}×{asset.lebar}×{asset.tinggi} mm</p></div>
                  <div><span className="text-slate-500 text-xs">Laminasi</span><p className="font-medium">{asset.laminasi}</p></div>
                  <div><span className="text-slate-500 text-xs">Mata Pisau</span><p className="font-medium">{asset.jumlahMata}</p></div>
                  <div><span className="text-slate-500 text-xs">Unit</span><p className="font-medium">{asset.unit}</p></div>
                  <div><span className="text-slate-500 text-xs">Merek</span><p className="font-medium">{asset.merk}</p></div>
                  <div><span className="text-slate-500 text-xs">Produk</span><p className="font-medium">{asset.produk}</p></div>
                  <div><span className="text-slate-500 text-xs">Bahan Baku</span><p className="font-medium">{asset.bahanBaku}</p></div>
                  <div><span className="text-slate-500 text-xs">Gudang</span><p className="font-medium">{asset.gudang}</p></div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Fungsi</span>
                  <div className="mt-1.5"><FungsiPills fungsi={asset.fungsi} /></div>
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

        <div className="px-6 py-4 border-t border-slate-200 flex justify-between bg-white">
          <div className="flex gap-2">
            <button onClick={onEdit} className="px-4 py-2 text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100 rounded-xl hover:bg-sky-100 flex items-center gap-1.5">
              <Edit size={14} /> Ubah
            </button>
            {(canBorrow(asset) && (asset.statusPinjam === 'Tersedia' || asset.statusPinjam === 'Dipinjam' || asset.statusPinjam === 'Terlambat')) && (
              <button onClick={onBorrow} className={`px-4 py-2 text-sm font-semibold rounded-xl flex items-center gap-1.5 ${asset.statusPinjam === 'Tersedia' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                {asset.statusPinjam === 'Tersedia' ? <><ArrowRightLeft size={14} /> Pinjam</> : <><CornerDownLeft size={14} /> Kembalikan</>}
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Kembali</button>
        </div>
      </div>
    </div>
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
