export function StatusBadge({ type, status }) {
  if (type === 'kondisi') {
    let badgeStyle = 'bg-slate-100 text-slate-600';
    if (status === 'Kondisi Baik') badgeStyle = 'bg-emerald-100 text-emerald-700';
    else if (status === 'Tidak Berfungsi' || status === 'Rusak') badgeStyle = 'bg-red-100 text-red-700';
    else if (status === 'Dalam Perbaikan') badgeStyle = 'bg-orange-100 text-orange-700';
    else if (status === 'Hilang') badgeStyle = 'bg-slate-200 text-slate-700';
    else if (status === 'Terjual') badgeStyle = 'bg-purple-100 text-purple-700';
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyle}`}>{status}</span>;
  }
  let style = 'bg-slate-100 text-slate-600';
  if (status === 'Tersedia') style = 'bg-blue-100 text-blue-700';
  if (status === 'Dipinjam') style = 'bg-orange-100 text-orange-700';
  if (status === 'Terlambat') style = 'bg-red-100 text-red-700 border border-red-200';
  if (status === 'Dikembalikan') style = 'bg-emerald-100 text-emerald-700';
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${style}`}>{status}</span>;
}

export function PerawatanBadge({ status }) {
  const s = status || 'Normal';
  const style =
    s === 'Normal' ? 'bg-emerald-50 text-emerald-700' :
    s === 'Perlu Diperbaiki' ? 'bg-amber-50 text-amber-700' :
    s === 'Dalam Perbaikan' ? 'bg-orange-50 text-orange-700' :
    s === 'Tertunda' ? 'bg-violet-50 text-violet-700' :
    s === 'Selesai Diperbaiki' ? 'bg-sky-50 text-sky-700' :
    s === 'Dibatalkan' ? 'bg-rose-50 text-rose-700' :
    'bg-slate-100 text-slate-600';
  return <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${style}`}>{s}</span>;
}
