import { useState } from 'react';
import {
  MapPin,
  Camera,
  Calculator,
  ArrowLeft,
  Package,
  Wallet,
} from 'lucide-react';
import {
  formatRp,
  gudangOptionsByOwner,
  getActiveAssetTypes,
  getAssetTypeById,
  getAssetTypeByName,
} from '../data/mockData';

const KATEGORI_OPTIONS = [
  { value: 'Aset', label: 'Aset', desc: 'Inventori aset tetap' },
  { value: 'Sparepart', label: 'Sparepart', desc: 'Inventori sparepart' },
];

function DepreciationModal({ hargaBeli, jenis, nilai, masa, tahunBeli, onClose }) {
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
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h3 className="text-sm font-bold text-slate-800">Detail Depresiasi</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-slate-700 mb-4">
            Harga Pembelian: <span className="font-bold text-slate-900">{formatRp(hargaBeli)}</span>
          </p>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-center text-sm whitespace-nowrap">
              <thead className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-r border-blue-400/30">No</th>
                  <th className="px-4 py-3 border-r border-blue-400/30">Tahun</th>
                  <th className="px-4 py-3 border-r border-blue-400/30">Depresiasi Tahunan</th>
                  <th className="px-4 py-3 border-r border-blue-400/30">Akumulasi Depresiasi</th>
                  <th className="px-4 py-3">Harga Aset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-500">{row.no}</td>
                    <td className="px-4 py-3 border-r border-slate-200 font-medium">{row.tahun}</td>
                    <td className="px-4 py-3 border-r border-slate-200">{formatRp(row.depTahunan)}</td>
                    <td className="px-4 py-3 border-r border-slate-200">{formatRp(row.akumulasi)}</td>
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

export function AssetFormPage({ assetToEdit, onClose, onSave }) {
  const assetTypeChoices = getActiveAssetTypes().filter((t) => t.name !== 'PISAU');
  const initialType =
    getAssetTypeById(assetToEdit?.assetTypeId) ||
    getAssetTypeByName(assetToEdit?.tipe) ||
    assetTypeChoices[0];

  const initialKategori =
    assetToEdit?.kategori === 'Sparepart' ? 'Sparepart' : 'Aset';

  const [kategori, setKategori] = useState(initialKategori);
  const [pemilikAsset, setPemilikAsset] = useState(assetToEdit ? assetToEdit.pemilikAsset : 'Internal Wajib');
  const [gudang, setGudang] = useState(assetToEdit ? assetToEdit.gudang : gudangOptionsByOwner['Internal Wajib'][0]);
  const [area, setArea] = useState(assetToEdit ? assetToEdit.area : '');
  const [rak, setRak] = useState(assetToEdit ? assetToEdit.rak : '');
  const [box, setBox] = useState(assetToEdit ? assetToEdit.box : '');

  const [depresiasiJenis, setDepresiasiJenis] = useState(assetToEdit ? assetToEdit.depresiasiType : 'Persen');
  const [depresiasiNilai, setDepresiasiNilai] = useState(assetToEdit ? assetToEdit.depresiasiValue : '');
  const [hargaPembelian, setHargaPembelian] = useState(assetToEdit ? assetToEdit.hargaBeli : '');
  const [masaManfaat, setMasaManfaat] = useState(assetToEdit ? assetToEdit.masaManfaat || '5' : '5');
  const [showDepreciationCalc, setShowDepreciationCalc] = useState(false);

  const [nama, setNama] = useState(assetToEdit ? assetToEdit.nama : '');
  const [assetTypeId, setAssetTypeId] = useState(initialType?._id || '');
  const selectedType = getAssetTypeById(assetTypeId) || initialType;
  const tipe = selectedType?.name || '';
  const merkChoices = selectedType?.merk || [];
  const [merk, setMerk] = useState(() => {
    const m = assetToEdit?.merk || merkChoices[0] || '';
    const match = merkChoices.find((opt) => opt.toUpperCase() === String(m).toUpperCase());
    return match || m;
  });
  const [nomorSeri, setNomorSeri] = useState(assetToEdit ? assetToEdit.noSeri : '');
  const [tanggalBeli, setTanggalBeli] = useState(assetToEdit ? assetToEdit.tanggalBeli : '');
  const [tanggalGaransi, setTanggalGaransi] = useState(assetToEdit ? assetToEdit.tanggalGaransi : '');
  const [vendor, setVendor] = useState(assetToEdit ? assetToEdit.vendor : '');
  const [gambar, setGambar] = useState(assetToEdit ? assetToEdit.gambar : null);
  const [noRegistrasi, setNoRegistrasi] = useState(assetToEdit ? (assetToEdit.noRegistrasi || '001') : '001');
  const [kondisi, setKondisi] = useState(assetToEdit ? assetToEdit.kondisi : 'Kondisi Baik');
  const [catatan, setCatatan] = useState(assetToEdit ? assetToEdit.catatan : '');
  const [tanggalPinjam, setTanggalPinjam] = useState(assetToEdit ? (assetToEdit.tanggalPinjam || '') : '');

  const isEdit = Boolean(assetToEdit);
  const shell = 'w-full max-w-[1200px] mx-auto';
  const fieldClass = 'w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5';

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setGambar(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePemilikChange = (e) => {
    const selectedOwner = e.target.value;
    setPemilikAsset(selectedOwner);
    setGudang(gudangOptionsByOwner[selectedOwner][0]);
  };

  const handleTypeChange = (id) => {
    setAssetTypeId(id);
    const next = getAssetTypeById(id);
    setMerk((next?.merk || [])[0] || '');
  };

  const generatedCode = `${tipe} - ${merk} - ${noRegistrasi || '001'}`.toUpperCase();

  const handleFormSubmit = () => {
    if (!nama || !nomorSeri) {
      alert('Mohon isi field bertanda bintang (*)');
      return;
    }
    if (!assetTypeId || !merk) {
      alert('Pilih tipe dan merek dari master data');
      return;
    }

    onSave({
      id: assetToEdit ? assetToEdit.id : Date.now(),
      kategori,
      kode: generatedCode,
      nama,
      assetTypeId,
      tipe,
      merk,
      noSeri: nomorSeri,
      noRegistrasi: noRegistrasi || '001',
      pemilikAsset,
      gudang,
      area: area || '-',
      rak: rak || '-',
      box: box || '-',
      kondisi,
      statusPinjam: assetToEdit ? assetToEdit.statusPinjam : 'Tersedia',
      namaPeminjam: assetToEdit ? assetToEdit.namaPeminjam : null,
      tanggalPinjam: assetToEdit
        ? (assetToEdit.statusPinjam === 'Dipinjam' ? tanggalPinjam : assetToEdit.tanggalPinjam)
        : null,
      gambar,
      hargaBeli: Number(hargaPembelian) || 0,
      depresiasiType: depresiasiJenis,
      depresiasiValue: Number(depresiasiNilai) || 0,
      masaManfaat: Number(masaManfaat) || 5,
      tanggalBeli: tanggalBeli || new Date().toISOString().split('T')[0],
      tanggalGaransi: tanggalGaransi || '',
      vendor: vendor || '-',
      catatan,
      statusPerawatan: assetToEdit?.statusPerawatan || 'Normal',
      biayaPerbaikan: assetToEdit?.biayaPerbaikan ?? 0,
      // Jadwal diatur di tab Jadwal Perawatan (detail aset/part)
      jadwalMaintenance: assetToEdit?.jadwalMaintenance || null,
      intervalMaintenanceHari: assetToEdit?.intervalMaintenanceHari ?? 0,
      createdAt: assetToEdit?.createdAt || new Date().toISOString(),
    });
  };

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
                <button type="button" onClick={onClose} className="hover:text-blue-600 transition-colors">Data Aset</button>
                <span className="opacity-40">/</span>
                <span className="text-slate-600 font-medium">{isEdit ? 'Ubah' : 'Tambah Baru'}</span>
              </nav>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
                {isEdit ? 'Ubah Data Aset' : 'Tambah Aset / Sparepart'}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {isEdit
                  ? `${assetToEdit.kode} — ${assetToEdit.nama}`
                  : 'Pilih Aset atau Sparepart, lengkapi detail, lokasi, pembelian, dan foto.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="button" onClick={handleFormSubmit} className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
              Simpan Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-6 lg:px-8 py-6 md:py-8 pb-32">
        <div className={`${shell} space-y-5`}>
          <section className="bg-white rounded-2xl border border-slate-200/70 border-l-4 border-l-blue-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="px-5 py-3.5 flex items-start gap-3 bg-blue-50/40 border-b border-blue-100/60">
              <div className="mt-0.5 w-8 h-8 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin size={15} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Klasifikasi & Lokasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Kategori hanya Aset atau Sparepart · penempatan gudang</p>
              </div>
            </div>
            <div className="p-5 md:p-6 space-y-5">
              <div>
                <label className={labelClass}>Kategori *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {KATEGORI_OPTIONS.map((opt) => {
                    const active = kategori === opt.value;
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
                          name="kategori"
                          className="sr-only"
                          checked={active}
                          onChange={() => setKategori(opt.value)}
                        />
                        <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-800'}`}>{opt.label}</p>
                        <p className={`text-[11px] mt-0.5 ${active ? 'text-blue-100' : 'text-slate-500'}`}>{opt.desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                <div>
                  <label className={labelClass}>Pemilik Aset *</label>
                  <select value={pemilikAsset} onChange={handlePemilikChange} className={fieldClass}>
                    <option value="Internal Wajib">Internal Wajib</option>
                    <option value="TKI">TKI</option>
                    <option value="FTP">FTP</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Gudang Penyimpanan *</label>
                  <select value={gudang} onChange={(e) => setGudang(e.target.value)} className={fieldClass}>
                    {gudangOptionsByOwner[pemilikAsset].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Area Lokasi</label>
                  <input type="text" placeholder="Contoh: Area A1, Lt. 2" value={area} onChange={(e) => setArea(e.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Rak / Box</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Rak" value={rak} onChange={(e) => setRak(e.target.value)} className={fieldClass} />
                    <input type="text" placeholder="Box" value={box} onChange={(e) => setBox(e.target.value)} className={fieldClass} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/70 border-l-4 border-l-blue-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="px-5 py-3.5 flex items-start gap-3 bg-blue-50/40 border-b border-blue-100/60">
              <div className="mt-0.5 w-8 h-8 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Package size={15} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Detail Produk</h3>
                <p className="text-xs text-slate-500 mt-0.5">Identitas item · tipe & merek dari master</p>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nama Item *</label>
                  <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: LAPTOP GAMING ASUS ROG STRIX" className={fieldClass} />
                </div>

                <div>
                  <label className={labelClass}>Tipe Produk *</label>
                  <select value={assetTypeId} onChange={(e) => handleTypeChange(e.target.value)} className={fieldClass}>
                    {assetTypeChoices.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                  {selectedType?.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{selectedType.description}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Merk *</label>
                  <select value={merk} onChange={(e) => setMerk(e.target.value)} className={fieldClass}>
                    <option value="">Pilih merek...</option>
                    {merkChoices.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Nomor Seri *</label>
                  <input type="text" value={nomorSeri} onChange={(e) => setNomorSeri(e.target.value)} placeholder="Contoh: SN-ASUS-1234" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Nomor Registrasi *</label>
                  <input type="text" value={noRegistrasi} onChange={(e) => setNoRegistrasi(e.target.value)} placeholder="001" className={`${fieldClass} font-semibold`} />
                </div>

                <div>
                  <label className={labelClass}>Kode Terbuat</label>
                  <div className="h-11 px-3.5 flex items-center bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 font-bold select-all">
                    {generatedCode}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Kondisi *</label>
                  <select value={kondisi} onChange={(e) => setKondisi(e.target.value)} className={fieldClass}>
                    <option value="Kondisi Baik">Kondisi Baik</option>
                    <option value="Tidak Berfungsi">Tidak Berfungsi</option>
                    <option value="Hilang">Hilang</option>
                    <option value="Rusak">Rusak</option>
                    <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </div>

                {assetToEdit && assetToEdit.statusPinjam === 'Dipinjam' && (
                  <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-sm font-bold text-blue-800 mb-1">Ubah Tanggal Peminjaman</label>
                    <input type="date" value={tanggalPinjam} onChange={(e) => setTanggalPinjam(e.target.value)} className={fieldClass} />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className={labelClass}>Catatan</label>
                  <input type="text" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Spesifikasi tambahan, kelengkapan, dll." className={fieldClass} />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/70 border-l-4 border-l-blue-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="px-5 py-3.5 flex items-start gap-3 bg-blue-50/40 border-b border-blue-100/60">
              <div className="mt-0.5 w-8 h-8 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Wallet size={15} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Pembelian, Garansi & Depresiasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Data pembelian tetap diisi untuk Aset dan Sparepart</p>
              </div>
            </div>
            <div className="p-5 md:p-6 space-y-4">
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
                  <label className={labelClass}>Harga Pembelian</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                    <input type="number" value={hargaPembelian} onChange={(e) => setHargaPembelian(e.target.value)} placeholder="0" className={`${fieldClass} pl-10`} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className={labelClass}>Masa Manfaat</label>
                  <div className="relative">
                    <input type="number" value={masaManfaat} onChange={(e) => setMasaManfaat(e.target.value)} className={fieldClass} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Tahun</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Tipe Nilai Depresiasi</label>
                    <select value={depresiasiJenis} onChange={(e) => setDepresiasiJenis(e.target.value)} className={fieldClass}>
                      <option value="Persen">Persen (%)</option>
                      <option value="Nominal">Nominal (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Nilai Depresiasi</label>
                    <div className="relative">
                      {depresiasiJenis === 'Nominal' && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>}
                      <input
                        type="number"
                        value={depresiasiNilai}
                        onChange={(e) => setDepresiasiNilai(e.target.value)}
                        placeholder="0"
                        className={`${fieldClass} ${depresiasiJenis === 'Nominal' ? 'pl-10' : 'pr-10'}`}
                      />
                      {depresiasiJenis === 'Persen' && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className={labelClass}>Nama Vendor</label>
                    <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Contoh: PT Elang Jaya" className={fieldClass} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDepreciationCalc(true)}
                    className="h-11 shrink-0 inline-flex items-center gap-2 px-4 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                  >
                    <Calculator size={16} /> Kalkulator
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/70 border-l-4 border-l-blue-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="px-5 py-3.5 flex items-start gap-3 bg-blue-50/40 border-b border-blue-100/60">
              <div className="mt-0.5 w-8 h-8 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Camera size={15} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Foto Pendukung</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dokumentasi visual item inventori</p>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl hover:bg-slate-100 transition-colors relative">
                <div className="w-24 h-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {gambar ? (
                    <img src={gambar} alt="Preview" className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    <Camera className="text-slate-400" size={28} />
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-xs font-bold text-slate-700">Unggah foto item</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">JPEG, PNG, atau WEBP</p>
                  <label className="inline-block mt-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                    Pilih Berkas Foto
                    <input type="file" accept="image/*" onChange={handleGambarChange} className="hidden" />
                  </label>
                </div>
                {gambar && (
                  <button type="button" onClick={() => setGambar(null)} className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors">
                    Hapus Foto
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 md:left-64 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-6 lg:px-8 py-3.5">
        <div className={`${shell} flex justify-between items-center gap-3`}>
          <p className="text-xs text-slate-400 hidden sm:block">
            * wajib · Kategori: Aset atau Sparepart · Data pembelian selalu aktif
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="button" onClick={handleFormSubmit} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
              {isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
            </button>
          </div>
        </div>
      </div>

      {showDepreciationCalc && (
        <DepreciationModal
          hargaBeli={Number(hargaPembelian) || 0}
          jenis={depresiasiJenis}
          nilai={Number(depresiasiNilai) || 0}
          masa={Number(masaManfaat) || 1}
          tahunBeli={tanggalBeli ? parseInt(tanggalBeli.split('-')[0], 10) : new Date().getFullYear()}
          onClose={() => setShowDepreciationCalc(false)}
        />
      )}
    </div>
  );
}
