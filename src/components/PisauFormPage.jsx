import { useState, useRef } from 'react';
import {
  Plus,
  UploadCloud,
  ImagePlus,
  ArrowLeft,
  Scissors,
  Package,
  Calculator,
  Wallet,
} from 'lucide-react';
import {
  FUNGSI_OPTIONS,
  FILE_TAMBAHAN_KATEGORI,
  PRODUK_OPTIONS,
  BAHAN_BAKU_OPTIONS,
  UNIT_OPTIONS,
  PERAN_INVENTORI_OPTIONS,
  gudangOptionsByOwner,
  getAssetTypeByName,
  getAssetTypeById,
  formatRp,
} from '../data/mockData';
import { localDateString } from '../data/domain';

const KONDISI_OPTIONS = [
  'Kondisi Baik',
  'Tidak Berfungsi',
  'Hilang',
  'Rusak',
  'Dalam Perbaikan',
  'Terjual',
];

export function DepreciationModal({ hargaBeli, jenis, nilai, masa, tahunBeli, onClose }) {
  const rows = [];
  let currentHarga = hargaBeli;
  let akumulasi = 0;
  const depTahunan = jenis === 'Persen' ? (hargaBeli * nilai / 100) : nilai;

  rows.push({ no: '', tahun: `Awal (${tahunBeli})`, depTahunan: 0, akumulasi: 0, sisa: hargaBeli });

  for (let i = 1; i <= masa; i++) {
    akumulasi += depTahunan;
    currentHarga -= depTahunan;
    if (currentHarga < 0) currentHarga = 0;
    rows.push({ no: i, tahun: tahunBeli + i, depTahunan, akumulasi, sisa: currentHarga });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">Detail Depresiasi</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-slate-700 mb-4">
            Harga Pembelian: <span className="font-bold text-slate-900">{formatRp(hargaBeli)}</span>
          </p>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-center text-sm whitespace-nowrap">
              <thead className="bg-slate-800 text-white text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3">Depresiasi Tahunan</th>
                  <th className="px-4 py-3">Akumulasi</th>
                  <th className="px-4 py-3">Harga Aset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{row.no}</td>
                    <td className="px-4 py-3 font-medium">{row.tahun}</td>
                    <td className="px-4 py-3">{formatRp(row.depTahunan)}</td>
                    <td className="px-4 py-3">{formatRp(row.akumulasi)}</td>
                    <td className="px-4 py-3 font-semibold">{formatRp(row.sisa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-slate-100 rounded-lg hover:bg-slate-200">Tutup</button>
        </div>
      </div>
    </div>
  );
}

function ImageDropzone({ label, hint, value, onChange, onClear, accent = 'sky' }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const accents = {
    sky: 'hover:border-sky-400/70 hover:bg-sky-50/40',
    emerald: 'hover:border-emerald-400/70 hover:bg-emerald-50/40',
    violet: 'hover:border-violet-400/70 hover:bg-violet-50/40',
  };

  return (
    <div
      className={`relative rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/40 p-3.5 transition-all duration-200 ${accents[accent]} ${dragOver ? 'scale-[1.01] border-sky-400 bg-sky-50/60 shadow-sm' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div>
          <p className="text-xs font-semibold text-slate-700">{label}</p>
          {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
        </div>
        {value && (
          <button type="button" onClick={onClear} className="text-[11px] font-medium text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">
            Hapus
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full min-h-[128px] flex flex-col items-center justify-center rounded-xl overflow-hidden cursor-pointer group"
      >
        {value ? (
          <img src={value} alt={label} className="w-full h-32 object-cover rounded-xl animate-fade-in group-hover:opacity-95 transition-opacity" />
        ) : (
          <>
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center mb-2 shadow-sm group-hover:border-sky-200 transition-colors">
              <UploadCloud className="text-slate-400 group-hover:text-sky-500 transition-colors" size={18} />
            </div>
            <p className="text-xs text-slate-500 text-center px-3">Seret atau klik untuk unggah</p>
            <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WEBP</p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

function Section({ title, hint, icon, badge, tone = 'aset', children, className = '' }) {
  const tones = {
    aset: {
      shell: 'border-slate-200/70 border-l-4 border-l-blue-500',
      head: 'bg-blue-50/40 border-b border-blue-100/60',
      iconWrap: 'bg-blue-50 border-blue-100 text-blue-600',
    },
    pisau: {
      shell: 'border-slate-200/70 border-l-4 border-l-slate-800',
      head: 'bg-slate-50 border-b border-slate-200/80',
      iconWrap: 'bg-slate-100 border-slate-200 text-slate-700',
    },
  };
  const t = tones[tone] || tones.aset;

  return (
    <section className={`bg-white rounded-2xl border shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden ${t.shell} ${className}`}>
      <div className={`px-5 py-3.5 flex items-start gap-3 ${t.head}`}>
        {icon && (
          <div className={`mt-0.5 w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${t.iconWrap}`}>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h3>
            {badge}
          </div>
          {hint && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{hint}</p>}
        </div>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function GroupIntro({ step, title, subtitle, tone = 'aset' }) {
  const tones = {
    aset: 'border-blue-200 bg-gradient-to-r from-blue-50 to-white border-l-4 border-l-blue-500',
    pisau: 'border-slate-200 bg-gradient-to-r from-slate-100 to-white border-l-4 border-l-slate-800',
  };
  const stepTone = tone === 'aset' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white';
  return (
    <div className={`rounded-2xl border px-5 py-3.5 ${tones[tone]}`}>
      <div className="flex items-start gap-3">
        <span className={`shrink-0 w-8 h-8 rounded-xl ${stepTone} text-sm font-bold flex items-center justify-center`}>{step}</span>
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = 'aset' }) {
  const cls = tone === 'aset'
    ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'
    : 'bg-slate-800 text-white ring-1 ring-slate-800';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
}

export function PisauFormPage({ pisauToEdit, onClose, onSave }) {
  const pisauType = getAssetTypeByName('PISAU');
  const [assetTypeId] = useState(pisauToEdit?.assetTypeId || pisauType?._id || '');
  const selectedType = getAssetTypeById(assetTypeId) || pisauType;
  const merkOptions = selectedType?.merk || [];

  const [nama, setNama] = useState(pisauToEdit?.nama || '');
  const [kode, setKode] = useState(pisauToEdit?.kode || '');
  const [unit, setUnit] = useState(pisauToEdit?.unit || 'Pcs');
  const [panjang, setPanjang] = useState(pisauToEdit?.panjang || '');
  const [lebar, setLebar] = useState(pisauToEdit?.lebar || '');
  const [tinggi, setTinggi] = useState(pisauToEdit?.tinggi || '');
  const [laminasi, setLaminasi] = useState(pisauToEdit?.laminasi || 'Tidak');
  const [jumlahMata, setJumlahMata] = useState(pisauToEdit?.jumlahMata || '');
  const [merk, setMerk] = useState(() => {
    const m = pisauToEdit?.merk || '';
    if (!m) return '';
    const match = merkOptions.find((opt) => opt.toUpperCase() === String(m).toUpperCase());
    return match || m.toUpperCase();
  });
  const [produk, setProduk] = useState(pisauToEdit?.produk || '');
  const [bahanBaku, setBahanBaku] = useState(pisauToEdit?.bahanBaku || '');
  const [fungsi, setFungsi] = useState(pisauToEdit?.fungsi || []);
  const [semuaFungsi, setSemuaFungsi] = useState(pisauToEdit?.semuaFungsi || false);
  const [fungsiSelect, setFungsiSelect] = useState('');
  const [vendor, setVendor] = useState(pisauToEdit?.vendor || '');
  const [hargaBeli, setHargaBeli] = useState(pisauToEdit?.hargaBeli || '');
  const [stok, setStok] = useState(pisauToEdit?.stok ?? 0);
  const [peranInventori, setPeranInventori] = useState(() => {
    const value = pisauToEdit?.peranInventori;
    if (value === 'Part') return 'Part';
    return 'Aset';
  });
  const [noSeri, setNoSeri] = useState(pisauToEdit?.noSeri || pisauToEdit?.kode || '');
  const [noRegistrasi, setNoRegistrasi] = useState(pisauToEdit?.noRegistrasi || '001');
  const [kondisi, setKondisi] = useState(pisauToEdit?.kondisi || 'Kondisi Baik');
  const [catatan, setCatatan] = useState(pisauToEdit?.catatan || '');
  const [tanggalBeli, setTanggalBeli] = useState(pisauToEdit?.tanggalBeli || '');
  const [tanggalGaransi, setTanggalGaransi] = useState(pisauToEdit?.tanggalGaransi || '');
  const [depresiasiType, setDepresiasiType] = useState(pisauToEdit?.depresiasiType || 'Persen');
  const [depresiasiValue, setDepresiasiValue] = useState(pisauToEdit?.depresiasiValue ?? '');
  const [masaManfaat, setMasaManfaat] = useState(pisauToEdit?.masaManfaat || '5');
  const [showDepreciationCalc, setShowDepreciationCalc] = useState(false);
  const [pemilikAsset, setPemilikAsset] = useState(pisauToEdit?.pemilikAsset || 'Internal Wajib');
  const [gudang, setGudang] = useState(pisauToEdit?.gudang || gudangOptionsByOwner['Internal Wajib'][0]);
  const [area, setArea] = useState(pisauToEdit?.area || '');
  const [rak, setRak] = useState(pisauToEdit?.rak || '');
  const [box, setBox] = useState(pisauToEdit?.box || '');
  const [fotoUtama, setFotoUtama] = useState(pisauToEdit?.fotoUtama || null);
  const [gambarHasil, setGambarHasil] = useState(pisauToEdit?.gambarHasil || null);
  const [gambarPerspektif, setGambarPerspektif] = useState(pisauToEdit?.gambarPerspektif || null);
  const [gambarPenampang, setGambarPenampang] = useState(pisauToEdit?.gambarPenampang || null);
  const [gambarProfil, setGambarProfil] = useState(pisauToEdit?.gambarProfil || null);
  const [filesTambahan, setFilesTambahan] = useState(
    pisauToEdit?.filesTambahan || Object.fromEntries(FILE_TAMBAHAN_KATEGORI.map((k) => [k, []]))
  );
  const showKeuangan = peranInventori === 'Aset';
  const showStok = peranInventori === 'Part';

  const addFungsi = (val) => {
    if (!val || fungsi.includes(val)) return;
    setFungsi([...fungsi, val]);
    setFungsiSelect('');
  };

  const handleSemuaFungsi = (checked) => {
    setSemuaFungsi(checked);
    if (checked) setFungsi([...FUNGSI_OPTIONS]);
  };

  const handleAddFile = (kategori) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilesTambahan((prev) => ({
          ...prev,
          [kategori]: [...(prev[kategori] || []), { name: file.name, data: reader.result, size: file.size }],
        }));
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!nama || !kode || !unit || !panjang || !lebar || !tinggi || !jumlahMata || !noSeri) {
      alert('Mohon isi field bertanda bintang (*)');
      return;
    }
    if (!semuaFungsi && fungsi.length === 0) {
      alert('Pilih minimal satu fungsi pisau');
      return;
    }

    // Part-only: keep existing keuangan on edit; else empty defaults (like Sparepart)
    const keuanganPayload = showKeuangan
      ? {
          tanggalBeli: tanggalBeli || localDateString(),
          tanggalGaransi: tanggalGaransi || '',
          depresiasiType,
          depresiasiValue: Number(depresiasiValue) || 0,
          masaManfaat: Number(masaManfaat) || 5,
        }
      : {
          tanggalBeli: pisauToEdit?.tanggalBeli || '',
          tanggalGaransi: pisauToEdit?.tanggalGaransi || '',
          depresiasiType: pisauToEdit?.depresiasiType || 'Persen',
          depresiasiValue: pisauToEdit?.depresiasiValue ?? 0,
          masaManfaat: pisauToEdit?.masaManfaat ?? 0,
        };

    onSave({
      id: pisauToEdit ? pisauToEdit.id : Date.now(),
      kategori: 'Pisau',
      assetTypeId: selectedType?._id || assetTypeId,
      tipe: selectedType?.name || 'PISAU',
      kode,
      nama,
      unit,
      panjang: Number(panjang),
      lebar: Number(lebar),
      tinggi: Number(tinggi),
      laminasi,
      jumlahMata: Number(jumlahMata),
      merk: merk || '-',
      produk: produk || '-',
      bahanBaku: bahanBaku || '-',
      fungsi: semuaFungsi ? [...FUNGSI_OPTIONS] : fungsi,
      semuaFungsi,
      vendor: vendor || '-',
      hargaBeli: Number(hargaBeli) || 0,
      stok: showStok ? Math.max(0, Number(stok) || 0) : 0,
      peranInventori,
      noSeri,
      noRegistrasi: noRegistrasi || '001',
      kondisi,
      catatan: catatan || '',
      ...keuanganPayload,
      // Maintenance & jadwal dikelola terpisah — pertahankan nilai existing saat edit
      statusPerawatan: pisauToEdit?.statusPerawatan || 'Normal',
      biayaPerbaikan: pisauToEdit?.biayaPerbaikan ?? 0,
      jadwalMaintenance: pisauToEdit?.jadwalMaintenance || null,
      intervalMaintenanceHari: pisauToEdit?.intervalMaintenanceHari ?? 0,
      pemilikAsset,
      gudang,
      area: area || '-',
      rak: rak || '-',
      box: box || '-',
      statusPinjam: pisauToEdit?.statusPinjam || 'Tersedia',
      namaPeminjam: pisauToEdit?.namaPeminjam || null,
      tanggalPinjam: pisauToEdit?.tanggalPinjam || null,
      fotoUtama,
      gambarHasil,
      gambar: fotoUtama || gambarPerspektif || gambarProfil || null,
      gambarPerspektif,
      gambarPenampang,
      gambarProfil,
      filesTambahan,
      createdAt: pisauToEdit?.createdAt || new Date().toISOString(),
    });
  };

  const fieldClass =
    'w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5';
  const isEdit = Boolean(pisauToEdit);
  const shell = 'w-full max-w-[1200px] mx-auto';

  return (
    <div className="flex flex-col min-h-full w-full bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_28%,#eef2f7_100%)]">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-8 py-4">
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${shell}`}>
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 p-2.5 rounded-xl border border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              title="Kembali ke daftar"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <nav className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <span>Beranda</span>
                <span className="opacity-40">/</span>
                <button type="button" onClick={onClose} className="hover:text-sky-600 transition-colors">Pisau</button>
                <span className="opacity-40">/</span>
                <span className="text-slate-600 font-medium">{isEdit ? 'Ubah' : 'Tambah Baru'}</span>
              </nav>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
                {isEdit ? 'Ubah Data Pisau' : 'Tambah Pisau Baru'}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {isEdit
                  ? `${pisauToEdit.kode} — ${pisauToEdit.nama}`
                  : 'Lengkapi Informasi Aset lalu Informasi Pisau.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-sm transition-colors">
              Simpan Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-6 lg:px-8 py-6 md:py-8 pb-32">
        <div className={`${shell} space-y-5`}>
          <GroupIntro
            step="1"
            tone="pisau"
            title="Informasi Pisau"
            subtitle="Spesifikasi teknis cutting tool — data produk, dimensi, dan fungsi."
          />

          <Section
            tone="pisau"
            title="Spesifikasi Pisau"
            hint="Identitas, dimensi, dan fungsi dalam satu bagian"
            icon={<Scissors size={15} />}
            badge={<Badge tone="pisau">Pisau</Badge>}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Nama Pisau *</label>
                  <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama pisau..." className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Kode Pisau *</label>
                  <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="KNF-001" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Unit *</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className={fieldClass}>
                    {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Merek</label>
                  <select value={merk} onChange={(e) => setMerk(e.target.value)} className={fieldClass}>
                    <option value="">Pilih merek...</option>
                    {merkOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Produk</label>
                  <select value={produk} onChange={(e) => setProduk(e.target.value)} className={fieldClass}>
                    <option value="">Pilih produk...</option>
                    {PRODUK_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bahan Baku</label>
                  <select value={bahanBaku} onChange={(e) => setBahanBaku(e.target.value)} className={fieldClass}>
                    <option value="">Pilih bahan...</option>
                    {BAHAN_BAKU_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Dimensi & Mata</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    ['Panjang *', panjang, setPanjang],
                    ['Lebar *', lebar, setLebar],
                    ['Tinggi *', tinggi, setTinggi],
                  ].map(([label, val, setter]) => (
                    <div key={label}>
                      <label className={labelClass}>{label}</label>
                      <div className="relative">
                        <input type="number" value={val} onChange={(e) => setter(e.target.value)} className={`${fieldClass} pr-10`} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">mm</span>
                      </div>
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Laminasi *</label>
                    <select value={laminasi} onChange={(e) => setLaminasi(e.target.value)} className={fieldClass}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Jumlah Mata *</label>
                    <input type="number" value={jumlahMata} onChange={(e) => setJumlahMata(e.target.value)} placeholder="0" className={fieldClass} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <label className="text-xs font-medium text-slate-600">Fungsi *</label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input type="checkbox" checked={semuaFungsi} onChange={(e) => handleSemuaFungsi(e.target.checked)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                    Semua fungsi
                  </label>
                </div>
                <div className="border border-slate-200 rounded-xl p-2.5 flex flex-wrap gap-2 min-h-[52px] bg-slate-50/60">
                  {fungsi.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200/80 rounded-full text-xs text-slate-700 shadow-sm">
                      {f}
                      {!semuaFungsi && (
                        <button type="button" onClick={() => setFungsi(fungsi.filter((x) => x !== f))} className="text-slate-400 hover:text-red-500 leading-none">×</button>
                      )}
                    </span>
                  ))}
                  {!semuaFungsi && (
                    <select
                      value={fungsiSelect}
                      onChange={(e) => addFungsi(e.target.value)}
                      className="flex-1 min-w-[160px] text-sm outline-none bg-transparent text-slate-600"
                    >
                      <option value="">Tambah fungsi...</option>
                      {FUNGSI_OPTIONS.filter((f) => !fungsi.includes(f)).map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </Section>

          <Section
            tone="pisau"
            title="Dokumentasi"
            hint="Foto utama, hasil, dan gambar teknis"
            icon={<ImagePlus size={15} />}
            badge={<Badge tone="pisau">Pisau</Badge>}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <ImageDropzone
                  label="Foto Utama Pisau"
                  hint="Tampil di daftar inventori"
                  value={fotoUtama}
                  onChange={setFotoUtama}
                  onClear={() => setFotoUtama(null)}
                  accent="sky"
                />
                <ImageDropzone
                  label="Hasil Penggunaan"
                  hint="Contoh hasil potongan"
                  value={gambarHasil}
                  onChange={setGambarHasil}
                  onClear={() => setGambarHasil(null)}
                  accent="emerald"
                />
              </div>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Gambar Teknis</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <ImageDropzone label="Perspektif" value={gambarPerspektif} onChange={setGambarPerspektif} onClear={() => setGambarPerspektif(null)} accent="violet" />
                  <ImageDropzone label="Penampang" value={gambarPenampang} onChange={setGambarPenampang} onClear={() => setGambarPenampang(null)} accent="violet" />
                  <ImageDropzone label="Profil Pisau" value={gambarProfil} onChange={setGambarProfil} onClear={() => setGambarProfil(null)} accent="violet" />
                </div>
              </div>
            </div>
          </Section>

          <Section
            tone="pisau"
            title="File Tambahan"
            hint="Dokumen pendukung per kategori"
            icon={<Plus size={15} />}
            badge={<Badge tone="pisau">Pisau</Badge>}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FILE_TAMBAHAN_KATEGORI.map((kat) => {
                const count = (filesTambahan[kat] || []).length;
                return (
                  <div
                    key={kat}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{kat}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{count} file</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddFile(kat)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                    >
                      <Plus size={12} /> Tambah
                    </button>
                  </div>
                );
              })}
            </div>
          </Section>

          <GroupIntro
            step="2"
            tone="aset"
            title="Kebutuhan Aset & Part"
            subtitle="Tipe inventori, identitas, lokasi gudang, dan keuangan."
          />

          <Section
            tone="aset"
            title="Inventori Aset"
            hint="Tipe, identitas inventori, dan lokasi gudang dalam satu bagian"
            icon={<Package size={15} />}
            badge={<Badge tone="aset">Aset</Badge>}
          >
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Tipe *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PERAN_INVENTORI_OPTIONS.filter((opt) => opt.value !== 'Keduanya').map((opt) => {
                    const active = peranInventori === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-150 ${
                          active
                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="peranInventori"
                          className="sr-only"
                          checked={active}
                          onChange={() => setPeranInventori(opt.value)}
                        />
                        <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-800'}`}>{opt.label}</p>
                        <p className={`text-[11px] mt-0.5 leading-snug ${active ? 'text-blue-100' : 'text-slate-500'}`}>{opt.desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1 border-t border-slate-100">
                <div className="space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Identitas</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Nomor Seri *</label>
                      <input value={noSeri} onChange={(e) => setNoSeri(e.target.value)} placeholder="Contoh: SN-KNF-001" className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass}>No. Registrasi *</label>
                      <input value={noRegistrasi} onChange={(e) => setNoRegistrasi(e.target.value)} placeholder="001" className={`${fieldClass} font-semibold`} />
                    </div>
                    <div>
                      <label className={labelClass}>Kondisi *</label>
                      <select value={kondisi} onChange={(e) => setKondisi(e.target.value)} className={fieldClass}>
                        {KONDISI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Catatan</label>
                      <input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Kelengkapan, dll." className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Vendor</label>
                      <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="CV-001" className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Harga Beli</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                        <input type="number" value={hargaBeli} onChange={(e) => setHargaBeli(e.target.value)} placeholder="0" className={`${fieldClass} pl-10`} />
                      </div>
                    </div>
                    {showStok && (
                      <div>
                        <label className={labelClass}>Stok Tersedia</label>
                        <input type="number" min="0" value={stok} onChange={(e) => setStok(e.target.value)} placeholder="0" className={fieldClass} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Lokasi Gudang</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Pemilik</label>
                      <select
                        value={pemilikAsset}
                        onChange={(e) => {
                          setPemilikAsset(e.target.value);
                          setGudang(gudangOptionsByOwner[e.target.value][0]);
                        }}
                        className={fieldClass}
                      >
                        {Object.keys(gudangOptionsByOwner).map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Gudang</label>
                      <select value={gudang} onChange={(e) => setGudang(e.target.value)} className={fieldClass}>
                        {gudangOptionsByOwner[pemilikAsset].map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Area</label>
                      <input value={area} onChange={(e) => setArea(e.target.value)} className={fieldClass} placeholder="Area C..." />
                    </div>
                    <div>
                      <label className={labelClass}>Rak / Box</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={rak} onChange={(e) => setRak(e.target.value)} className={fieldClass} placeholder="Rak" />
                        <input value={box} onChange={(e) => setBox(e.target.value)} className={fieldClass} placeholder="Box" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {showKeuangan ? (
            <Section
              tone="aset"
              title="Pembelian & Depresiasi"
              hint="Aktif karena peran Aset"
              icon={<Wallet size={15} />}
              badge={<Badge tone="aset">Keuangan</Badge>}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-3">
                    <label className={labelClass}>Tgl Pembelian</label>
                    <input type="date" value={tanggalBeli} onChange={(e) => setTanggalBeli(e.target.value)} className={fieldClass} />
                  </div>
                  <div className="md:col-span-3">
                    <label className={`${labelClass} text-rose-600`}>Tgl Masa Garansi</label>
                    <input type="date" value={tanggalGaransi} onChange={(e) => setTanggalGaransi(e.target.value)} className={`${fieldClass} border-rose-200 bg-rose-50/20`} />
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelClass}>Masa Manfaat</label>
                    <div className="relative">
                      <input type="number" value={masaManfaat} onChange={(e) => setMasaManfaat(e.target.value)} className={fieldClass} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Tahun</span>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={() => setShowDepreciationCalc(true)}
                      className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                    >
                      <Calculator size={16} /> Kalkulator
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div>
                    <label className={labelClass}>Tipe Nilai Depresiasi</label>
                    <select value={depresiasiType} onChange={(e) => setDepresiasiType(e.target.value)} className={fieldClass}>
                      <option value="Persen">Persen (%)</option>
                      <option value="Nominal">Nominal (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Nilai Depresiasi</label>
                    <div className="relative">
                      {depresiasiType === 'Nominal' && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>}
                      <input
                        type="number"
                        value={depresiasiValue}
                        onChange={(e) => setDepresiasiValue(e.target.value)}
                        placeholder="0"
                        className={`${fieldClass} ${depresiasiType === 'Nominal' ? 'pl-10' : 'pr-10'}`}
                      />
                      {depresiasiType === 'Persen' && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>}
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          ) : (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 px-5 py-3.5 text-sm text-slate-600 border-l-4 border-l-blue-400">
              Peran <span className="font-semibold text-slate-800">Part</span> — keuangan disembunyikan. Data lama tetap disimpan jika ada.
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 md:left-64 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-6 lg:px-8 py-3.5">
        <div className={`${shell} flex justify-between items-center gap-3`}>
          <p className="text-xs text-slate-400 hidden sm:block">
            * wajib · Bagian 1 Pisau · Bagian 2 Aset & Part
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="button" onClick={handleSubmit} className="px-6 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-sm transition-colors">
              {isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
            </button>
          </div>
        </div>
      </div>

      {showDepreciationCalc && (
        <DepreciationModal
          hargaBeli={Number(hargaBeli) || 0}
          jenis={depresiasiType}
          nilai={Number(depresiasiValue) || 0}
          masa={Number(masaManfaat) || 1}
          tahunBeli={tanggalBeli ? parseInt(tanggalBeli.split('-')[0], 10) : new Date().getFullYear()}
          onClose={() => setShowDepreciationCalc(false)}
        />
      )}
    </div>
  );
}
