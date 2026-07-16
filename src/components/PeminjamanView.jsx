import { ArrowRightLeft, CornerDownLeft, Eye, PackageSearch } from 'lucide-react';
import { StatusBadge } from './SharedUI';
import { canBorrow } from '../data/mockData';

export function PeminjamanView({ assets, onBorrow, onViewDetail }) {
  const borrowable = assets.filter(canBorrow);
  const aktif = borrowable.filter((a) => a.statusPinjam === 'Dipinjam' || a.statusPinjam === 'Terlambat');
  const tersedia = borrowable.filter((a) => a.statusPinjam === 'Tersedia');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Peminjaman</h1>
        <p className="text-sm text-slate-500 mt-1">Pinjam &amp; kembalikan aset / pisau-aset. Pisau ber-peran Part-only tidak ikut sirkulasi pinjam.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-orange-50 border-orange-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Sedang Dipinjam</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{borrowable.filter((a) => a.statusPinjam === 'Dipinjam').length}</p>
        </div>
        <div className="p-4 rounded-xl border bg-red-50 border-red-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Terlambat</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{borrowable.filter((a) => a.statusPinjam === 'Terlambat').length}</p>
        </div>
        <div className="p-4 rounded-xl border bg-blue-50 border-blue-100">
          <p className="text-[10px] font-bold uppercase text-slate-600">Tersedia Dipinjam</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{tersedia.length}</p>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-700">Sedang Dipinjam / Terlambat</h3>
        </div>
        {aktif.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center">
            <PackageSearch size={40} className="mb-2 text-slate-300" />
            Tidak ada peminjaman aktif.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Peminjam</th>
                  <th className="px-4 py-3">Tgl Pinjam</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {aktif.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">{a.kode}</td>
                    <td className="px-4 py-3 font-medium">{a.nama}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                        a.kategori === 'Pisau' ? 'bg-amber-100 text-amber-700' :
                        a.kategori === 'Sparepart' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{a.kategori}</span>
                    </td>
                    <td className="px-4 py-3">{a.namaPeminjam || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{a.tanggalPinjam || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge type="peminjaman" status={a.statusPinjam} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden">
                        <button onClick={() => onViewDetail(a)} className="p-2 text-slate-500 hover:bg-slate-50 border-r" title="Detail"><Eye size={16} /></button>
                        <button onClick={() => onBorrow(a)} className="p-2 text-orange-600 hover:bg-orange-50" title="Kembalikan"><CornerDownLeft size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-700">Siap Dipinjam</h3>
        </div>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tersedia.slice(0, 20).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold">{a.kode}</td>
                  <td className="px-4 py-3 font-medium">{a.nama}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      a.kategori === 'Pisau' ? 'bg-amber-100 text-amber-700' :
                      a.kategori === 'Sparepart' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{a.kategori}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{a.gudang}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onBorrow(a)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <ArrowRightLeft size={14} /> Pinjam
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
