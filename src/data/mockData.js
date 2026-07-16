export const formatRp = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
};

export const gudangOptionsByOwner = {
  'Internal Wajib': ['Gudang Kantor Pusat', 'Gudang IT Internal', 'Gudang Umum'],
  'TKI': ['Gudang Utama TKI', 'Gudang Logistik TKI', 'Gudang Transit TKI'],
  'FTP': ['Gudang Utama FTP', 'Gudang Sparepart FTP', 'Gudang Bahan Baku FTP']
};

export const FUNGSI_OPTIONS = [
  'Membuat Profil',
  'Membuat Alur',
  'Memotong Kayu',
  'Finishing Potong',
  'Router',
  'Radial',
  'PROFIL',
  'Lain-lain'
];

export const FILE_TAMBAHAN_KATEGORI = [
  'Perencanaan',
  'JPG',
  'Pisau 3D',
  'AUTOCAD',
  'Lainnya'
];

/**
 * Master Tipe Aset — selaras respons API inventori.
 * Dipakai bersama Data Aset & Pisau agar tipe + merek terhubung.
 * Shape: { _id, name, description, merk[], companyId, createdTime, ... }
 */
export const assetTypesMaster = [
  {
    _id: '6a4c84569f780a12d152e52e',
    name: 'AC',
    description: 'DINGIN PANAS OKE',
    merk: ['DAIKIN', 'PANASONIC', 'SHARP', 'GREE', 'MIDEA', 'POLYTRON'],
    companyId: '699673be3fcbd684e737a7bb',
    createdTime: '2026-07-07T04:45:10.420000Z',
    createdBy: '6996766f3fcbd684e737a7bd',
    updatedTime: null,
    updatedBy: null,
    isDeleted: false,
  },
  {
    _id: '6a45e00185f32b34ac764a61',
    name: 'LAPTOP',
    description: 'YA LAPTOP',
    merk: ['LENOVO', 'ASUS', 'DELL', 'ACER', 'SAMSUNG', 'APPLE', 'HP', 'MSI', 'RAZER', 'LG', 'HUAWEI', 'HONOR', 'XIAOMI', 'INFINIX', 'TECNO', 'ADVAN', 'AXIOO', 'POLYTRON', 'ALIENWARE'],
    companyId: '699673be3fcbd684e737a7bb',
    createdTime: '2026-07-02T03:50:25.893000Z',
    createdBy: '6996766f3fcbd684e737a7bd',
    updatedTime: '2026-07-07T06:51:27.685000Z',
    updatedBy: '6996766f3fcbd684e737a7bd',
    isDeleted: false,
  },
  {
    _id: '6a4cc2339f780a12d152e532',
    name: 'RAM',
    description: 'LAGI MAHAL',
    merk: ['KINGSTON'],
    companyId: '699673be3fcbd684e737a7bb',
    createdTime: '2026-07-07T09:09:07.472000Z',
    createdBy: '6996766f3fcbd684e737a7bd',
    updatedTime: null,
    updatedBy: null,
    isDeleted: false,
  },
  {
    _id: '6a4da8b99f780a12d152e536',
    name: 'SSD',
    description: 'SSD (Solid State Drive) adalah perangkat penyimpanan data berbasis memori non-volatile yang tidak menggunakan komponen bergerak, sehingga lebih cepat dan tahan lama dibanding HDD.',
    merk: ['SAMSUNG', 'WD', 'KINGSTON', 'TRANSCEND', 'ADATA', 'V-GEN', 'TEAMGROUP'],
    companyId: '699673be3fcbd684e737a7bb',
    createdTime: '2026-07-08T01:32:41.762000Z',
    createdBy: '6996766f3fcbd684e737a7bd',
    updatedTime: null,
    updatedBy: null,
    isDeleted: false,
  },
  {
    _id: '6a5pisau001assettype00',
    name: 'PISAU',
    description: 'Cutting tool / pisau mesin — terhubung modul Pisau dan Data Aset/Part',
    merk: ['FESTOOL', 'MAKITA', 'BOSCH', 'LEITZ', 'FREUD', 'LEUCO', 'DIMAR', 'LAINNYA'],
    companyId: '699673be3fcbd684e737a7bb',
    createdTime: '2026-07-15T07:00:00.000000Z',
    createdBy: '6996766f3fcbd684e737a7bd',
    updatedTime: null,
    updatedBy: null,
    isDeleted: false,
  },
];

export function getActiveAssetTypes() {
  return assetTypesMaster.filter((t) => !t.isDeleted);
}

export function getAssetTypeById(id) {
  return getActiveAssetTypes().find((t) => t._id === id) || null;
}

export function getAssetTypeByName(name) {
  if (!name) return null;
  return getActiveAssetTypes().find((t) => t.name.toUpperCase() === String(name).toUpperCase()) || null;
}

export function getMerkByTypeName(typeName) {
  const t = getAssetTypeByName(typeName);
  return t?.merk || [];
}

/** @deprecated gunakan getMerkByTypeName('PISAU') — tetap diekspor untuk kompatibilitas */
export const MEREK_OPTIONS = getMerkByTypeName('PISAU');
export const PRODUK_OPTIONS = ['Solid Wood', 'MDF', 'Plywood', 'Acrylic', 'Lainnya'];
export const BAHAN_BAKU_OPTIONS = ['HSS', 'Carbide', 'Diamond', 'Steel', 'Lainnya'];
export const UNIT_OPTIONS = ['Pcs', 'Set'];

export const PERAN_INVENTORI_OPTIONS = [
  { value: 'Aset', label: 'Aset', desc: 'Bisa dipinjam & diperbaiki' },
  { value: 'Part', label: 'Part', desc: 'Bahan kalkulasi / BOM' },
  { value: 'Keduanya', label: 'Aset & Part', desc: 'Terhubung ke kedua modul' },
];

export const STATUS_PERAWATAN_OPTIONS = [
  'Normal',
  'Perlu Diperbaiki',
  'Dalam Perbaikan',
  'Tertunda',
  'Selesai Diperbaiki',
  'Dibatalkan',
];

/** Pisau dengan peran Aset / Keduanya (bisa pinjam & repair) */
export function isAsetRole(item) {
  if (!item) return false;
  if (item.kategori === 'Aset') return true;
  if (item.kategori === 'Pisau') {
    const peran = item.peranInventori || 'Keduanya';
    return peran === 'Aset' || peran === 'Keduanya';
  }
  return false;
}

/** Sparepart biasa atau Pisau dengan peran Part / Keduanya (bahan kalkulasi) */
export function isPartRole(item) {
  if (!item) return false;
  if (item.kategori === 'Sparepart') return true;
  if (item.kategori === 'Pisau') {
    const peran = item.peranInventori || 'Keduanya';
    return peran === 'Part' || peran === 'Keduanya';
  }
  return false;
}

export function canBorrow(item) {
  if (!item) return false;
  if (item.kategori === 'Sparepart') return true;
  if (item.kategori === 'Aset') return true;
  if (item.kategori === 'Pisau') return isAsetRole(item);
  return false;
}

export function matchesKategoriFilter(asset, filter) {
  if (filter === 'Semua') return true;
  if (filter === 'Pisau') return asset.kategori === 'Pisau';
  if (filter === 'Aset') {
    return asset.kategori === 'Aset' || (asset.kategori === 'Pisau' && isAsetRole(asset));
  }
  if (filter === 'Sparepart') {
    return asset.kategori === 'Sparepart' || (asset.kategori === 'Pisau' && isPartRole(asset));
  }
  return asset.kategori === filter;
}

/** Placeholder foto demo (SVG) — diganti saat user upload */
export function mockPhoto(label, bg = '#1e3a5f', accent = '#38bdf8') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g)"/>
    <circle cx="200" cy="160" r="54" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>
    <path d="M80 250 L320 250 L300 280 L100 280 Z" fill="${accent}" opacity="0.35"/>
    <path d="M110 220 L290 220 L275 248 L125 248 Z" fill="#f8fafc" opacity="0.85"/>
    <text x="200" y="330" text-anchor="middle" fill="#e2e8f0" font-family="system-ui,sans-serif" font-size="22" font-weight="600">${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const TYPE_ID = {
  AC: '6a4c84569f780a12d152e52e',
  LAPTOP: '6a45e00185f32b34ac764a61',
  RAM: '6a4cc2339f780a12d152e532',
  SSD: '6a4da8b99f780a12d152e536',
  PISAU: '6a5pisau001assettype00',
};

export const mockAssets = [
  {
    id: 1, kategori: 'Aset', kode: 'LAPTOP - ASUS - 001', nama: 'LAPTOP GAMING ASUS ROG STRIX G15', assetTypeId: TYPE_ID.LAPTOP, tipe: 'LAPTOP', merk: 'ASUS', noSeri: 'ROG-G15-2023-X9A', noRegistrasi: '001', pemilikAsset: 'Internal Wajib', gudang: 'Gudang Kantor Pusat', area: 'A1-IT', rak: 'Rak 02', box: 'Box B-09', kondisi: 'Kondisi Baik', statusPinjam: 'Dipinjam', namaPeminjam: 'Ali Rafsanjani', tanggalPinjam: '2023-10-12', tanggalGaransi: '2028-10-12', gambar: null,
    hargaBeli: 25000000, depresiasiType: 'Persen', depresiasiValue: 20, masaManfaat: 5, tanggalBeli: '2020-01-23', vendor: 'Alya Andini', catatan: 'Digunakan oleh divisi internal logistik',
    statusPerawatan: 'Normal', biayaPerbaikan: 0,
    jadwalMaintenance: '2026-08-01', intervalMaintenanceHari: 180,
    createdAt: '2023-10-01T08:00:00'
  },
  {
    id: 2, kategori: 'Aset', kode: 'LAPTOP - DELL - 002', nama: 'LAPTOP DELL LATITUDE 5420', assetTypeId: TYPE_ID.LAPTOP, tipe: 'LAPTOP', merk: 'DELL', noSeri: 'SN-DEL-00987', noRegistrasi: '002', pemilikAsset: 'TKI', gudang: 'Gudang Utama TKI', area: 'Area B3', rak: 'Rak 11', box: 'Box TKI-02', kondisi: 'Dalam Perbaikan', statusPinjam: 'Tersedia', namaPeminjam: null, tanggalPinjam: null, tanggalGaransi: '2026-05-10', gambar: null,
    hargaBeli: 15000000, depresiasiType: 'Nominal', depresiasiValue: 1500000, masaManfaat: 10, tanggalBeli: '2021-05-10', vendor: 'PT Komputer Kita', catatan: 'Sedang diganti keyboard baru',
    statusPerawatan: 'Dalam Perbaikan', biayaPerbaikan: 450000,
    jadwalMaintenance: '2026-07-10', intervalMaintenanceHari: 90,
    createdAt: '2023-09-15T10:00:00'
  },
  {
    id: 3, kategori: 'Sparepart', kode: 'RAM - KINGSTON - 045', nama: 'RAM DDR4 16GB KINGSTON', assetTypeId: TYPE_ID.RAM, tipe: 'RAM', merk: 'KINGSTON', noSeri: 'CMK16GX4', noRegistrasi: '045', pemilikAsset: 'FTP', gudang: 'Gudang Sparepart FTP', area: 'Rak Sparepart A', rak: 'Baris 3', box: 'Kotak RAM-01', kondisi: 'Kondisi Baik', statusPinjam: 'Tersedia', namaPeminjam: null, tanggalPinjam: null, tanggalGaransi: '2025-11-20', gambar: null, catatan: 'Suku cadang upgrade memori PC',
    statusPerawatan: 'Normal', biayaPerbaikan: 0,
    jadwalMaintenance: null, intervalMaintenanceHari: 0,
    createdAt: '2023-11-20T09:00:00'
  },
  {
    id: 4, kategori: 'Aset', kode: 'LAPTOP - LENOVO - 012', nama: 'LENOVO LAPTOP 14 INCH', assetTypeId: TYPE_ID.LAPTOP, tipe: 'LAPTOP', merk: 'LENOVO', noSeri: 'SN-LNV-00555', noRegistrasi: '012', pemilikAsset: 'Internal Wajib', gudang: 'Gudang Kantor Pusat', area: 'Lt. Basement', rak: 'Rak Cadangan 1', box: 'Box LNV-A', kondisi: 'Rusak', statusPinjam: 'Terlambat', namaPeminjam: 'Raisa Mariee', tanggalPinjam: '2023-09-01', tanggalGaransi: '2024-11-01', gambar: null,
    hargaBeli: 8000000, depresiasiType: 'Persen', depresiasiValue: 25, masaManfaat: 4, tanggalBeli: '2019-11-01', vendor: 'Lenovo Center', catatan: 'Layar LCD pecah sebagian',
    statusPerawatan: 'Perlu Diperbaiki', biayaPerbaikan: 0,
    jadwalMaintenance: '2026-07-14', intervalMaintenanceHari: 120,
    createdAt: '2023-08-01T07:00:00'
  },
  {
    id: 101, kategori: 'Pisau', assetTypeId: TYPE_ID.PISAU, tipe: 'PISAU', kode: 'KNF-G001', nama: 'Pisau Gergaji', merk: 'FREUD', vendor: 'CV-001', hargaBeli: 50000,
    noSeri: 'SN-FREUD-G001', noRegistrasi: '001', catatan: 'Pisau gergaji umum workshop',
    tanggalBeli: '2024-01-10', tanggalGaransi: '2027-01-10', depresiasiType: 'Persen', depresiasiValue: 20, masaManfaat: 5,
    unit: 'Pcs', panjang: 120, lebar: 30, tinggi: 25, laminasi: 'Tidak', jumlahMata: 4, produk: 'Solid Wood', bahanBaku: 'Carbide',
    fungsi: ['Membuat Profil'], semuaFungsi: false,
    peranInventori: 'Keduanya', statusPerawatan: 'Normal', biayaPerbaikan: 0,
    jadwalMaintenance: '2026-07-20', intervalMaintenanceHari: 90,
    pemilikAsset: 'Internal Wajib', gudang: 'Gudang Umum', area: 'Area C - Cutting Tools', rak: 'Rak Besi 04', box: '-',
    kondisi: 'Kondisi Baik', statusPinjam: 'Tersedia', namaPeminjam: null, tanggalPinjam: null,
    fotoUtama: mockPhoto('Pisau Utama', '#1e3a5f', '#38bdf8'),
    gambarHasil: mockPhoto('Hasil Potong', '#14532d', '#4ade80'),
    gambar: null, gambarPerspektif: null, gambarPenampang: null, gambarProfil: null,
    filesTambahan: { Perencanaan: [], JPG: [], 'Pisau 3D': [], AUTOCAD: [], Lainnya: [] },
    createdAt: '2024-04-21T04:13:00'
  },
  {
    id: 102, kategori: 'Pisau', assetTypeId: TYPE_ID.PISAU, tipe: 'PISAU', kode: 'KNF-CSL-200', nama: 'Knife Circular 200', merk: 'LEITZ', vendor: '-', hargaBeli: 300000,
    noSeri: 'SN-LEITZ-CSL200', noRegistrasi: '002', catatan: 'Circular blade Spindel 2',
    tanggalBeli: '2024-02-15', tanggalGaransi: '2026-02-15', depresiasiType: 'Persen', depresiasiValue: 15, masaManfaat: 4,
    unit: 'Pcs', panjang: 200, lebar: 40, tinggi: 3, laminasi: 'Ya', jumlahMata: 24, produk: 'MDF', bahanBaku: 'HSS',
    fungsi: ['Memotong Kayu', 'Finishing Potong'], semuaFungsi: false,
    peranInventori: 'Aset', statusPerawatan: 'Normal', biayaPerbaikan: 0,
    jadwalMaintenance: '2026-09-01', intervalMaintenanceHari: 120,
    pemilikAsset: 'TKI', gudang: 'Gudang Utama TKI', area: 'Area Cutting', rak: 'Rak 02', box: 'Box K-01',
    kondisi: 'Kondisi Baik', statusPinjam: 'Dipinjam', namaPeminjam: 'Budi (Spindel 2)', tanggalPinjam: '2026-06-11',
    fotoUtama: mockPhoto('Circular 200', '#312e81', '#a78bfa'),
    gambarHasil: mockPhoto('Hasil Panel', '#422006', '#fbbf24'),
    gambar: null, gambarPerspektif: null, gambarPenampang: null, gambarProfil: null,
    filesTambahan: { Perencanaan: [], JPG: [], 'Pisau 3D': [], AUTOCAD: [], Lainnya: [] },
    createdAt: '2024-04-18T09:20:00'
  },
  {
    id: 103, kategori: 'Pisau', assetTypeId: TYPE_ID.PISAU, tipe: 'PISAU', kode: 'KNF-LMN-150', nama: 'Pisau Multifungsi', merk: 'BOSCH', vendor: 'CSV-012', hargaBeli: 150000,
    noSeri: 'SN-BOSCH-LMN150', noRegistrasi: '003', catatan: 'Stok BOM / bahan kalkulasi',
    tanggalBeli: '', tanggalGaransi: '', depresiasiType: 'Persen', depresiasiValue: 0, masaManfaat: 0,
    unit: 'Set', panjang: 150, lebar: 25, tinggi: 20, laminasi: 'Tidak', jumlahMata: 6, produk: 'Plywood', bahanBaku: 'Carbide',
    fungsi: ['Membuat Alur', 'Membuat Profil', 'Finishing Potong'], semuaFungsi: false,
    peranInventori: 'Part', statusPerawatan: 'Normal', biayaPerbaikan: 0,
    jadwalMaintenance: null, intervalMaintenanceHari: 0,
    pemilikAsset: 'FTP', gudang: 'Gudang Sparepart FTP', area: 'Rak Pisau A', rak: 'Baris 1', box: 'Kotak P-03',
    kondisi: 'Kondisi Baik', statusPinjam: 'Tersedia', namaPeminjam: null, tanggalPinjam: null,
    fotoUtama: mockPhoto('Multifungsi', '#0c4a6e', '#22d3ee'),
    gambarHasil: mockPhoto('Hasil Alur', '#1c1917', '#a8a29e'),
    gambar: null, gambarPerspektif: null, gambarPenampang: null, gambarProfil: null,
    filesTambahan: { Perencanaan: [], JPG: [], 'Pisau 3D': [], AUTOCAD: [], Lainnya: [] },
    createdAt: '2024-03-10T11:45:00'
  },
  {
    id: 104, kategori: 'Pisau', assetTypeId: TYPE_ID.PISAU, tipe: 'PISAU', kode: 'M241', nama: 'Knife Vika', merk: 'MAKITA', vendor: '-', hargaBeli: 0,
    noSeri: 'SN-MAKITA-M241', noRegistrasi: '004', catatan: 'Perlu perbaikan mata',
    tanggalBeli: '2023-06-01', tanggalGaransi: '2025-06-01', depresiasiType: 'Nominal', depresiasiValue: 50000, masaManfaat: 3,
    unit: 'Pcs', panjang: 80, lebar: 20, tinggi: 15, laminasi: 'Tidak', jumlahMata: 2, produk: 'Acrylic', bahanBaku: 'Diamond',
    fungsi: ['Finishing Potong'], semuaFungsi: false,
    peranInventori: 'Aset', statusPerawatan: 'Perlu Diperbaiki', biayaPerbaikan: 85000,
    jadwalMaintenance: '2026-07-05', intervalMaintenanceHari: 60,
    pemilikAsset: 'Internal Wajib', gudang: 'Gudang Kantor Pusat', area: 'Lt. Produksi', rak: 'Rak Tools', box: '-',
    kondisi: 'Kondisi Baik', statusPinjam: 'Terlambat', namaPeminjam: 'Andi (Spindel 1)', tanggalPinjam: '2026-06-09',
    fotoUtama: mockPhoto('Knife Vika', '#7f1d1d', '#fb7185'),
    gambarHasil: mockPhoto('Hasil Finish', '#164e63', '#67e8f9'),
    gambar: null, gambarPerspektif: null, gambarPenampang: null, gambarProfil: null,
    filesTambahan: { Perencanaan: [], JPG: [], 'Pisau 3D': [], AUTOCAD: [], Lainnya: [] },
    createdAt: '2023-12-28T10:20:00'
  },
  {
    id: 105, kategori: 'Pisau', assetTypeId: TYPE_ID.PISAU, tipe: 'PISAU', kode: 'KNF-PK-TL', nama: 'Pisau Potong Kayu TL', merk: 'FESTOOL', vendor: 'CV-001', hargaBeli: 450000,
    noSeri: 'SN-FESTOOL-PKTL', noRegistrasi: '005', catatan: 'Dalam perbaikan workshop',
    tanggalBeli: '2023-11-20', tanggalGaransi: '2026-11-20', depresiasiType: 'Persen', depresiasiValue: 18, masaManfaat: 5,
    unit: 'Pcs', panjang: 180, lebar: 35, tinggi: 28, laminasi: 'Ya', jumlahMata: 12, produk: 'Solid Wood', bahanBaku: 'Steel',
    fungsi: ['Memotong Kayu'], semuaFungsi: false,
    peranInventori: 'Keduanya', statusPerawatan: 'Dalam Perbaikan', biayaPerbaikan: 120000,
    jadwalMaintenance: '2026-07-15', intervalMaintenanceHari: 90,
    pemilikAsset: 'Internal Wajib', gudang: 'Gudang Umum', area: 'Area C - Cutting Tools', rak: 'Rak Besi 05', box: 'Box TL-02',
    kondisi: 'Dalam Perbaikan', statusPinjam: 'Tersedia', namaPeminjam: null, tanggalPinjam: null,
    fotoUtama: mockPhoto('Potong Kayu', '#365314', '#a3e635'),
    gambarHasil: mockPhoto('Hasil Kayu', '#78350f', '#fdba74'),
    gambar: null, gambarPerspektif: null, gambarPenampang: null, gambarProfil: null,
    filesTambahan: { Perencanaan: [], JPG: [], 'Pisau 3D': [], AUTOCAD: [], Lainnya: [] },
    createdAt: '2024-01-15T14:30:00'
  },
  {
    id: 106, kategori: 'Pisau', assetTypeId: TYPE_ID.PISAU, tipe: 'PISAU', kode: 'KNF-PRF-90', nama: 'Pisau Profil 90', merk: 'LEITZ', vendor: 'CSV-012', hargaBeli: 275000,
    noSeri: 'SN-LEITZ-PRF90', noRegistrasi: '006', catatan: 'Profil router 90°',
    tanggalBeli: '2024-02-02', tanggalGaransi: '2027-02-02', depresiasiType: 'Persen', depresiasiValue: 12, masaManfaat: 6,
    unit: 'Set', panjang: 90, lebar: 22, tinggi: 18, laminasi: 'Tidak', jumlahMata: 3, produk: 'MDF', bahanBaku: 'Carbide',
    fungsi: ['Membuat Profil', 'Router'], semuaFungsi: false,
    peranInventori: 'Keduanya', statusPerawatan: 'Normal', biayaPerbaikan: 0,
    jadwalMaintenance: '2026-08-15', intervalMaintenanceHari: 90,
    pemilikAsset: 'TKI', gudang: 'Gudang Logistik TKI', area: 'Cutting Zone', rak: 'Rak 07', box: '-',
    kondisi: 'Kondisi Baik', statusPinjam: 'Tersedia', namaPeminjam: null, tanggalPinjam: null,
    fotoUtama: mockPhoto('Profil 90', '#4c1d95', '#c4b5fd'),
    gambarHasil: mockPhoto('Hasil Profil', '#134e4a', '#5eead4'),
    gambar: null, gambarPerspektif: null, gambarPenampang: null, gambarProfil: null,
    filesTambahan: { Perencanaan: [], JPG: [], 'Pisau 3D': [], AUTOCAD: [], Lainnya: [] },
    createdAt: '2024-02-02T08:10:00'
  },
];

export const mockBorrowLogs = [
  {
    id: 1001, assetId: 102, kodeSurat: 'SJ-PJM-102', namaPeminjam: 'Budi (Spindel 2)',
    tanggalPinjam: '2026-06-11', deadlineKembali: '2026-06-13', tanggalKembali: null,
    status: 'Dipinjam', catatan: 'Untuk mesin Spindel 2'
  },
  {
    id: 1002, assetId: 104, kodeSurat: 'SJ-PJM-101', namaPeminjam: 'Andi (Spindel 1)',
    tanggalPinjam: '2026-06-09', deadlineKembali: '2026-06-10', tanggalKembali: null,
    status: 'Terlambat', catatan: 'Deadline lewat'
  },
  {
    id: 1003, assetId: 102, kodeSurat: 'SJ-PJM-098', namaPeminjam: 'Andi (Spindel 1)',
    tanggalPinjam: '2026-06-01', deadlineKembali: '2026-06-03', tanggalKembali: '2026-06-02',
    status: 'Dikembalikan', catatan: 'Sirkulasi sebelumnya'
  },
  {
    id: 1004, assetId: 1, kodeSurat: 'SJ-PJM-050', namaPeminjam: 'Ali Rafsanjani',
    tanggalPinjam: '2023-10-12', deadlineKembali: '2023-11-12', tanggalKembali: null,
    status: 'Dipinjam', catatan: 'Pinjam laptop kantor'
  },
  {
    id: 1005, assetId: 4, kodeSurat: 'SJ-PJM-045', namaPeminjam: 'Raisa Mariee',
    tanggalPinjam: '2023-09-01', deadlineKembali: '2023-09-15', tanggalKembali: null,
    status: 'Terlambat', catatan: 'Belum dikembalikan'
  },
];

export const vendorsMaster = [
  {
    id: 'v-001',
    nama: 'CV Teknik Jaya Service',
    nomor: 'VND-001',
    kontak: '0812-3456-7890',
    alamat: 'Jl. Industri Raya No. 12, Jakarta',
    jenis: 'Service',
  },
  {
    id: 'v-002',
    nama: 'PT Komputer Kita',
    nomor: 'VND-002',
    kontak: '021-55667788',
    alamat: 'Jl. Gatot Subroto Kav. 8, Jakarta',
    jenis: 'Service',
  },
  {
    id: 'v-003',
    nama: 'Workshop Cutting Tools Indo',
    nomor: 'VND-003',
    kontak: '0813-9988-7766',
    alamat: 'Kawasan Industri MM2100 Blok C, Cikarang',
    jenis: 'Service',
  },
  {
    id: 'v-004',
    nama: 'Lenovo Authorized Service',
    nomor: 'VND-004',
    kontak: '1500-300',
    alamat: 'Jl. Thamrin No. 5, Jakarta Pusat',
    jenis: 'Service',
  },
];

export function getVendorById(id) {
  return vendorsMaster.find((v) => v.id === id) || null;
}

export const mockMaintenanceLogs = [
  {
    id: 2001,
    assetId: 104,
    assetKode: 'M241',
    assetNama: 'Knife Vika',
    kategori: 'Pisau',
    pic: 'Rudi Workshop',
    tanggalMulai: '2026-07-01',
    estimasiSelesai: '2026-07-10',
    tanggalSelesaiAktual: null,
    lokasiTipe: 'Internal',
    vendorId: null,
    vendorNama: null,
    vendorKontak: null,
    vendorAlamat: null,
    tanggalKirim: null,
    tanggalDiterima: null,
    status: 'Perlu Diperbaiki',
    foto: mockPhoto('Repair Mata', '#7f1d1d', '#fb7185'),
    dokumenPendukung: [],
    lamaWaktuPerbaikan: null,
    catatan: 'Inspeksi awal: mata pisau aus pada sisi kanan. Rencana asah ulang + balancing ringan sebelum dikembalikan ke produksi Spindel 1.',
    kendala: 'Stok diamond dressing stone kosong; menunggu pengadaan dari gudang tools (ETA 3 hari). Sementara pisau ditahan di rak perbaikan.',
    createdAt: '2026-07-01T09:00:00',
  },
  {
    id: 2002,
    assetId: 105,
    assetKode: 'KNF-PK-TL',
    assetNama: 'Pisau Potong Kayu TL',
    kategori: 'Pisau',
    pic: 'Sari Teknisi',
    tanggalMulai: '2026-06-20',
    estimasiSelesai: '2026-07-05',
    tanggalSelesaiAktual: null,
    lokasiTipe: 'Eksternal',
    vendorId: 'v-003',
    vendorNama: 'Workshop Cutting Tools Indo',
    vendorKontak: '0813-9988-7766',
    vendorAlamat: 'Kawasan Industri MM2100 Blok C, Cikarang',
    tanggalKirim: '2026-06-20',
    tanggalDiterima: null,
    status: 'Dalam Perbaikan',
    foto: mockPhoto('Workshop TL', '#365314', '#a3e635'),
    dokumenPendukung: [{ name: 'surat-jalan-pk-tl.pdf', data: null, size: 42000 }],
    lamaWaktuPerbaikan: null,
    catatan: 'Dikirim untuk laminasi ulang dan balancing. Vendor konfirmasi antrian workshop penuh minggu ini.',
    kendala: 'Vendor menunda 4 hari karena mesin balancing sedang maintenance. Estimasi selesai bergeser; pantau follow-up tiap 2 hari.',
    createdAt: '2026-06-20T11:30:00',
  },
  {
    id: 2003,
    assetId: 2,
    assetKode: 'LAPTOP - DELL - 002',
    assetNama: 'LAPTOP DELL LATITUDE 5420',
    kategori: 'Aset',
    pic: 'Budi IT',
    tanggalMulai: '2026-07-08',
    estimasiSelesai: '2026-07-18',
    tanggalSelesaiAktual: null,
    lokasiTipe: 'Eksternal',
    vendorId: 'v-002',
    vendorNama: 'PT Komputer Kita',
    vendorKontak: '021-55667788',
    vendorAlamat: 'Jl. Gatot Subroto Kav. 8, Jakarta',
    tanggalKirim: '2026-07-08',
    tanggalDiterima: '2026-07-09',
    status: 'Dalam Perbaikan',
    foto: mockPhoto('Keyboard Dell', '#1e3a5f', '#38bdf8'),
    dokumenPendukung: [],
    lamaWaktuPerbaikan: null,
    catatan: 'Penggantian keyboard + cleaning fan/heatsink. Unit sudah diterima vendor; menunggu spare keyboard Latitude 5420.',
    kendala: 'Spare keyboard warna hitam belum ready stock — indent 5–7 hari kerja. User sementara pakai unit cadangan.',
    createdAt: '2026-07-08T08:15:00',
  },
  {
    id: 2004,
    assetId: 4,
    assetKode: 'LAPTOP - LENOVO - 012',
    assetNama: 'LENOVO LAPTOP 14 INCH',
    kategori: 'Aset',
    pic: 'Budi IT',
    tanggalMulai: '2026-07-12',
    estimasiSelesai: '2026-07-25',
    tanggalSelesaiAktual: null,
    lokasiTipe: 'Internal',
    vendorId: null,
    vendorNama: null,
    vendorKontak: null,
    vendorAlamat: null,
    tanggalKirim: null,
    tanggalDiterima: null,
    status: 'Perlu Diperbaiki',
    foto: null,
    dokumenPendukung: [],
    lamaWaktuPerbaikan: null,
    catatan: 'Layar LCD pecah sebagian (pojok kiri bawah). Perlu panel LCD 14" compatible Lenovo. Data user sudah di-backup ke NAS.',
    kendala: 'Panel LCD belum ada di gudang sparepart IT. PO sudah diajukan; menunggu approval purchasing.',
    createdAt: '2026-07-12T10:00:00',
  },
];

/** Status perawatan untuk form update (tanpa Normal — Normal = selesai/reset) */
export const MAINTENANCE_STATUS_OPTIONS = [
  'Perlu Diperbaiki',
  'Dalam Perbaikan',
  'Tertunda',
  'Selesai Diperbaiki',
  'Dibatalkan',
];

export const LOKASI_PERAWATAN_OPTIONS = [
  { value: 'Internal', label: 'Internal', desc: 'Perbaikan di workshop sendiri — cukup PIC' },
  { value: 'Eksternal', label: 'Eksternal', desc: 'Service vendor — pilih tempat & tanggal kirim/terima' },
];

export function getLatestMaintenanceLog(logs, assetId) {
  if (!logs?.length) return null;
  return logs
    .filter((l) => l.assetId === assetId)
    .sort((a, b) => String(b.createdAt || b.tanggalMulai).localeCompare(String(a.createdAt || a.tanggalMulai)))[0] || null;
}

/** Hitung hint lama waktu (hari) dari tanggal mulai ke aktual */
export function calcLamaWaktuHint(tanggalMulai, tanggalSelesaiAktual) {
  if (!tanggalMulai || !tanggalSelesaiAktual) return '';
  const a = new Date(tanggalMulai);
  const b = new Date(tanggalSelesaiAktual);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return '';
  const days = Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24)));
  return `${days} hari`;
}

/** Tambah N hari ke tanggal YYYY-MM-DD */
export function addDaysToDate(dateStr, days) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().split('T')[0];
}

/**
 * Status jadwal: overdue | dueSoon | upcoming | none
 * dueSoon = dalam 7 hari ke depan
 */
export function getJadwalMaintenanceStatus(jadwalMaintenance, today = new Date()) {
  if (!jadwalMaintenance) return 'none';
  const due = new Date(jadwalMaintenance);
  if (Number.isNaN(due.getTime())) return 'none';
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - t) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'dueSoon';
  return 'upcoming';
}

/** Notifikasi maintenance jatuh tempo / hampir jatuh tempo */
export function getMaintenanceNotifications(assets, today = new Date()) {
  const items = [];
  (assets || []).forEach((a) => {
    const status = getJadwalMaintenanceStatus(a.jadwalMaintenance, today);
    if (status === 'overdue' || status === 'dueSoon') {
      items.push({
        id: `mnt-${a.id}`,
        assetId: a.id,
        kode: a.kode,
        nama: a.nama,
        kategori: a.kategori,
        jadwalMaintenance: a.jadwalMaintenance,
        urgency: status,
        message:
          status === 'overdue'
            ? `Jadwal maintenance terlewat (${a.jadwalMaintenance})`
            : `Maintenance harus dilakukan sebelum ${a.jadwalMaintenance}`,
      });
    }
  });
  return items.sort((a, b) => {
    if (a.urgency !== b.urgency) return a.urgency === 'overdue' ? -1 : 1;
    return String(a.jadwalMaintenance).localeCompare(String(b.jadwalMaintenance));
  });
}

export function buildAssetPatchFromMaintenance(status) {
  const patch = {
    statusPerawatan: status,
  };
  if (status === 'Dalam Perbaikan') {
    patch.kondisi = 'Dalam Perbaikan';
  } else if (status === 'Selesai Diperbaiki') {
    patch.statusPerawatan = 'Selesai Diperbaiki';
    patch.kondisi = 'Kondisi Baik';
  }
  return patch;
}
