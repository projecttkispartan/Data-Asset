# Product Requirements Document (PRD)

## Improvement: Pisau sebagai Asset, Fitur Perawatan, & Detail View Baru

**Versi:** 2.0
**Tanggal:** 20 Juli 2026
**Status:** Active

---

## 1. Ringkasan

Dokumen ini mendefinisikan 3 area improvement utama:

1. **Pisau sebagai Asset** — Form input pisau dengan 2 tipe (Part & Aset), urutan form pisau dulu baru kebutuhan aset
2. **Fitur Perawatan** — Pencatatan sparepart yang digunakan saat perbaikan (dari inventory atau input manual)
3. **Tampilan Detail Baru Asset** — Detail view konsisten dengan 3 tab (Informasi, Jadwal & Perawatan, Riwayat Pinjam)

---

## 2. Latar Belakang

### 2.1 Pisau sebagai Asset
Pisau dikelola dalam modul terpisah dengan kemampuan ganda: sebagai **Aset** (bisa dipinjamkan) dan **Part** (bisa dikalkulasi sebagai sparepart). Form input pisau perlu disederhanakan dan diurutkan berdasarkan prioritas pengguna.

### 2.2 Fitur Perawatan
Sistem perawatan memerlukan pelacakan sparepart yang digunakan saat perbaikan. Sebelumnya, sparepart hanya bisa dicatat dalam catatan bebas (free text). Improvement ini menghadirkan pencatatan sparepart terstruktur.

### 2.3 Tampilan Detail Baru Asset
Semua detail view (Aset, Pisau, Perawatan) perlu menggunakan struktur yang identik dan konsisten.

---

## 3. Pisau sebagai Asset

### 3.1 Peran Inventori — 2 Tipe Saja

| Tipe | Keterangan | Kemampuan |
|------|-----------|-----------|
| **Aset** | Pisau yang dimiliki dan bisa dipinjamkan | Peminjaman, Pengembalian, Depresiasi, Pelacakan lokasi, Jadwal perawatan |
| **Part** | Pisau yang digunakan sebagai sparepart | Kalkulasi harga, Stok |

> **Catatan:** Opsi "Keduanya" dihapus dari form. Pisau hanya bisa berperan sebagai Aset ATAU Part.

### 3.2 Urutan Form Input Pisau

Form input pisau diurutkan berdasarkan prioritas:

#### Step 1: Informasi Pisau (dahulukan)
1. **Spesifikasi Pisau**
   - Nama Pisau *
   - Kode Pisau *
   - Unit * (Pcs / Set)
   - Merek (dropdown dari master tipe)
   - Produk (Solid Wood, MDF, Plywood, Acrylic, Lainnya)
   - Bahan Baku (HSS, Carbide, Diamond, Steel, Lainnya)
   - Dimensi: Panjang *, Lebar *, Tinggi * (mm)
   - Laminasi * (Ya / Tidak)
   - Jumlah Mata *
   - Fungsi * (multi-select: Membuat Profil, Membuat Alur, Memotong Kayu, Finishing Potong, Router, Radial, PROFIL, Lain-lain)

2. **Dokumentasi**
   - Foto Utama Pisau
   - Hasil Penggunaan
   - Gambar Teknis: Perspektif, Penampang, Profil Pisau

3. **File Tambahan**
   - Perencanaan, JPG, Pisau 3D, AUTOCAD, Lainnya

#### Step 2: Kebutuhan Aset & Part (kedua)
1. **Tipe** * — Pilih antara Aset atau Part (radio button)

2. **Jika Tipe = Aset:**
   - Identitas: Nomor Seri *, No. Registrasi *, Kondisi *, Catatan, Vendor, Harga Beli
   - Lokasi Gudang: Pemilik, Gudang, Area, Rak/Box
   - Pembelian & Depresiasi: Tgl Pembelian, Tgl Masa Garansi, Masa Manfaat, Kalkulator Depresiasi, Tipe Nilai Depresiasi, Nilai Depresiasi

3. **Jika Tipe = Part:**
   - Identitas: Nomor Seri *, No. Registrasi *, Kondisi *, Catatan, Vendor, Harga Beli, Stok Tersedia
   - Lokasi Gudang: Pemilik, Gudang, Area, Rak/Box
   - Keuangan disembunyikan (data lama tetap disimpan jika ada)

### 3.3 Peminjaman Pisau

Hanya pisau dengan tipe **Aset** yang bisa dipinjamkan.

#### Status Pinjam
| Status | Keterangan | Aksi |
|--------|-----------|------|
| `Tersedia` | Bisa dipinjam | Pinjam |
| `Dipinjam` | Sedang dipinjam | Kembalikan |
| `Terlambat` | Deadline lewat | Kembalikan |

#### Validasi Peminjaman
- Pisau harus berstatus `Tersedia`
- Pisau tidak boleh sedang/perlu/tertunda perawatan
- Pisau tidak boleh dalam kondisi `Rusak` atau `Dalam Perbaikan`

### 3.4 Sample Data Pisau

| ID | Kode | Nama | Merek | Tipe | Status | Produk |
|----|------|------|-------|------|--------|--------|
| 101 | KNF-G001 | Pisau Gergaji | FREUD | Aset | Normal | Solid Wood |
| 102 | KNF-CSL-200 | Knife Circular 200 | LEITZ | Aset | Normal (Dipinjam) | MDF |
| 103 | KNF-LMN-150 | Pisau Multifungsi | BOSCH | Part | Normal | Plywood |
| 104 | M241 | Knife Vika | MAKITA | Aset | Perlu Diperbaiki | Acrylic |
| 105 | KNF-PK-TL | Pisau Potong Kayu TL | FESTOOL | Aset | Dalam Perbaikan | Solid Wood |
| 106 | KNF-PRF-90 | Pisau Profil 90 | LEITZ | Aset | Normal | MDF |
| 107 | KNF-RTR-60 | Router Bit 60° | FREUD | Aset | Normal | Acrylic |
| 108 | KNF-SAW-300 | Circular Saw 300mm | LEITZ | Aset | Normal (Dipinjam) | Plywood |
| 109 | KNF-BT-50 | Boring Tool 50mm | BOSCH | Part | Normal | MDF |
| 110 | KNF-GRP-120 | Pisau Greedy 120 | FESTOOL | Aset | Perlu Diperbaiki | Lainnya |

---

## 4. Fitur Perawatan

### 4.1 Ringkasan

Modul perawatan adalah satu pintu untuk:
- Melihat daftar semua inventaris beserta status perawatannya
- Mencatat perbaikan baru dengan **sparepart yang digunakan**
- Mengupdate status perbaikan yang sedang berjalan
- Melihat jadwal perawatan yang sudah lewat atau segera jatuh tempo
- Melihat riwayat perawatan lengkap per item

### 4.2 Form Perbaikan — Sparepart yang Digunakan

#### Fitur Baru: Pencatatan Sparepart Terstruktur

Form perbaikan sekarang memiliki section **"Sparepart yang Digunakan"** dengan 2 cara input:

##### Cara 1: Pilih dari Inventory
- Dropdown menampilkan semua sparepart dan pisau berperan Part
- Pilih item → otomatis ambil kode, nama, satuan, dan stok
- Input quantity (dibatasi stok tersedia)
- Item yang sudah dipilih tidak muncul lagi di dropdown

##### Cara 2: Input Manual
- Nama sparepart (text)
- Quantity (number)
- Satuan (dropdown: Pcs, Set, Botol, Tube, Liter)
- Tombol "Tambah"

##### Tampilan List Sparepart
Setiap item sparepart ditampilkan dengan:
- Badge tipe: `INV` (biru) untuk dari inventory, `TXT` (ungu) untuk manual
- Nama sparepart
- Kode (jika dari inventory)
- Catatan (jika input manual)
- Quantity & Satuan
- Tombol hapus

#### Data Model Sparepart di Maintenance Log
```javascript
spareparts: [
  {
    type: 'asset' | 'manual',
    assetId: Number,       // hanya jika type = 'asset'
    kode: String,          // hanya jika type = 'asset'
    nama: String,
    qty: Number,
    maxQty: Number,        // hanya jika type = 'asset' (stok)
    satuan: String,        // 'Pcs' | 'Set' | 'Botol' | 'Tube' | 'Liter'
    catatan: String,       // hanya jika type = 'manual'
  }
]
```

#### Tampilan di Detail Log
Sparepart ditampilkan di detail log perawatan dengan:
- Header: "Sparepart yang Digunakan" dengan ikon Package
- List item dengan badge tipe, nama, kode, quantity × satuan

### 4.3 Status Perawatan

| Status | Keterangan | Transisi |
|--------|-----------|----------|
| Normal | Item dalam kondisi baik | → Perlu Diperbaiki |
| Perlu Diperbaiki | Item perlu diperbaiki | → Dalam Perbaikan, Tertunda, Dibatalkan |
| Dalam Perbaikan | Sedang dalam proses perbaikan | → Tertunda, Selesai Diperbaiki |
| Tertunda | Perbaikan ditunda | → Dalam Perbaikan, Dibatalkan |
| Selesai Diperbaiki | Perbaikan selesai | → Perlu Diperbaiki |
| Dibatalkan | Perbaikan dibatalkan | → Perlu Diperbaiki |

### 4.4 Auto Status Asset

Ketika status perawatan berubah menjadi **"Dalam Perbaikan"**:
- `kondisi` asset otomatis berubah menjadi `"Dalam Perbaikan"`
- Validasi: item harus dikembalikan terlebih dahulu jika sedang dipinjam

### 4.5 Field Form Perbaikan

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|-----------|
| Item Inventori | Select | Ya | Pilih aset/sparepart/pisau |
| PIC | Text | Ya | Penanggung jawab perbaikan |
| Status Perawatan | Select | Ya | Transisi valid |
| Lokasi / Tempat Service | Radio | Ya | Internal / Eksternal |
| Vendor (jika Eksternal) | Select | Ya | Pilih vendor dari master data |
| Tanggal Pengiriman | Date | - | Untuk service eksternal |
| Tanggal Diterima | Date | - | Untuk service eksternal |
| Tanggal Mulai | Date | Ya | Kapan perbaikan dimulai |
| Estimasi Selesai | Date | Ya | Perkiraan selesai |
| Tanggal Aktual Selesai | Date | Ya* | *Hanya jika status = Selesai |
| Lama Waktu Perbaikan | Text | Ya* | Dihitung otomatis, bisa diedit |
| Jadwal Maintenance Berikutnya | Date | - | Diisi saat status = Selesai |
| Interval (hari) | Number | - | Default 90 hari |
| Catatan | Textarea | - | Detail pekerjaan, hasil inspeksi |
| Kendala | Textarea | - | Hambatan yang dihadapi |
| **Sparepart yang Digunakan** | Section | - | Pilih dari inventory atau input manual |
| Foto Perbaikan | File | - | Dokumentasi kondisi/proses |
| Dokumen Pendukung | File (multi) | - | Surat jalan, invoice, BA |

---

## 5. Tampilan Detail Baru Asset

### 5.1 Struktur Tab Konsisten

Semua detail view (Aset, Pisau, Perawatan) menggunakan struktur tab yang identik:

| Tab | Icon | Keterangan |
|-----|------|-----------|
| **Informasi** | - | Data lengkap item |
| **Jadwal & Perawatan** | - | Timeline + log perawatan |
| **Riwayat Pinjam** | - | Tabel sirkulasi peminjaman |

### 5.2 Tab Informasi

#### Header
- Foto utama + Foto hasil penggunaan
- Nama item (bold, besar)
- Kode item (mono font, biru)
- Badge: Kondisi + Status Pinjam

#### Grid Informasi (2 kolom di desktop)
- Nama, Kondisi
- Peran Inventori
- Status Pinjam
- No. Seri, No. Registrasi
- Vendor, Harga Beli
- Tanggal Pembelian, Masa Garansi
- Penempatan Lokasi (Gudang, Area, Rak, Box)
- Ukuran (Panjang × Lebar × Tinggi mm)
- Laminasi, Mata Pisau, Unit
- Merek, Produk, Bahan Baku
- Fungsi
- Depresiasi (jika peran Aset)
- Catatan

### 5.3 Tab Jadwal & Perawatan

#### a. Pengaturan Jadwal
- Tanggal Perawatan Berikutnya (date picker)
- Interval Periodic (hari, default 90)
- Badge status: Terlewat / Segera / Terjadwal / Belum dijadwalkan
- Tombol **Simpan Jadwal**

#### b. Riwayat Jadwal (Timeline)
- Timeline visual untuk setiap perawatan
- Titik berwarna: hijau (selesai), oranye (dalam perbaikan), abu-abu (lainnya)
- Indikator terlambat jika aktual > estimasi
- PIC, lokasi, kendala

#### c. Riwayat Perbaikan
- Daftar log perawatan dalam format kartu expandable
- Setiap log menampilkan: status, PIC, lokasi, tanggal, foto, kendala, catatan, dokumen
- **Sparepart yang digunakan** (jika ada)

### 5.4 Tab Riwayat Pinjam

Tabel sirkulasi & peminjaman:
- No. Surat Jalan
- Nama Peminjam
- Tgl Dipinjam
- Deadline Kembali
- Tgl Kembali
- Status

---

## 6. Integrasi Antar Modul

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│    Pisau     │────▶│   Perawatan  │◀────│    Aset      │
│             │     │              │     │              │
│ • Peminjaman│     │ • Jadwal     │     │ • Depresiasi │
│ • Sparepart │     │ • Sparepart  │     │ • Pelacakan  │
│ • Kalkulasi │     │ • Riwayat    │     │ • Peminjaman │
└─────────────┘     └──────────────┘     └──────────────┘
```

- **Pisau ↔ Perawatan:** Pisau bisa dicatat perawatannya. Sparepart pisau bisa digunakan saat perbaikan.
- **Aset ↔ Perawatan:** Semua aset bisa dicatat perawatannya dengan sparepart terstruktur.
- **Pisau ↔ Aset:** Pisau dengan tipe Aset terhubung ke modul peminjaman.

---

## 7. Data Model

### 7.1 Asset
```javascript
{
  id: Number,
  kategori: String,          // "Aset" | "Sparepart" | "Pisau"
  kode: String,
  nama: String,
  assetTypeId: String,
  tipe: String,
  merk: String,
  noSeri: String,
  noRegistrasi: String,
  pemilikAsset: String,
  gudang: String,
  area: String,
  rak: String,
  box: String,
  kondisi: String,           // "Kondisi Baik" | "Dalam Perbaikan" | "Rusak" | "Tidak Berfungsi" | "Hilang" | "Terjual"
  statusPinjam: String,      // "Tersedia" | "Dipinjam" | "Terlambat"
  namaPeminjam: String,
  tanggalPinjam: String,
  tanggalGaransi: String,
  gambar: String,
  hargaBeli: Number,
  depresiasiType: String,    // "Persen" | "Nominal"
  depresiasiValue: Number,
  masaManfaat: Number,
  tanggalBeli: String,
  vendor: String,
  catatan: String,
  statusPerawatan: String,   // "Normal" | "Perlu Diperbaiki" | "Dalam Perbaikan" | "Tertunda" | "Selesai Diperbaiki" | "Dibatalkan"
  biayaPerbaikan: Number,
  jadwalMaintenance: String,
  intervalMaintenanceHari: Number,

  // Pisau-specific
  unit: String,
  panjang: Number,
  lebar: Number,
  tinggi: Number,
  laminasi: String,
  jumlahMata: Number,
  produk: String,
  bahanBaku: String,
  fungsi: String[],
  semuaFungsi: Boolean,
  peranInventori: String,    // "Aset" | "Part" (Keduanya dihapus dari form)
  stok: Number,
  fotoUtama: String,
  gambarHasil: String,
  gambarPerspektif: String,
  gambarPenampang: String,
  gambarProfil: String,
  filesTambahan: Object,

  createdAt: String,
  createdBy: String,
  updatedAt: String,
  updatedBy: String,
}
```

### 7.2 MaintenanceLog
```javascript
{
  id: Number,
  assetId: Number,
  assetKode: String,
  assetNama: String,
  kategori: String,
  pic: String,
  tanggalMulai: String,
  estimasiSelesai: String,
  tanggalSelesaiAktual: String,
  lokasiTipe: String,
  vendorId: String,
  vendorNama: String,
  vendorKontak: String,
  vendorAlamat: String,
  tanggalKirim: String,
  tanggalDiterima: String,
  status: String,
  foto: String,
  dokumenPendukung: Array,
  lamaWaktuPerbaikan: String,
  catatan: String,
  kendala: String,
  spareparts: Array,          // [{type, assetId, kode, nama, qty, maxQty, satuan, catatan}]
  createdAt: String,
  createdBy: String,
  updatedAt: String,
  updatedBy: String,
}
```

### 7.3 BorrowLog
```javascript
{
  id: Number,
  assetId: Number,
  kodeSurat: String,
  namaPeminjam: String,
  tanggalPinjam: String,
  deadlineKembali: String,
  tanggalKembali: String,
  status: String,
  catatan: String,
  createdAt: String,
  createdBy: String,
  updatedAt: String,
  updatedBy: String,
}
```

---

## 8. Transisi Status

### 8.1 Status Perawatan

| Dari | Transisi yang Diizinkan |
|------|--------------------------|
| Normal | Perlu Diperbaiki |
| Perlu Diperbaiki | Dalam Perbaikan, Tertunda, Dibatalkan |
| Dalam Perbaikan | Tertunda, Selesai Diperbaiki |
| Tertunda | Dalam Perbaikan, Dibatalkan |
| Selesai Diperbaiki | Perlu Diperbaiki |
| Dibatalkan | Perlu Diperbaiki |

### 8.2 Auto Status Asset

| Status Perawatan | Kondisi Asset |
|------------------|---------------|
| Dalam Perbaikan | Dalam Perbaikan |
| Selesai Diperbaiki | Kondisi Baik |
| Dibatalkan | (tidak berubah) |

---

## 9. UI/UX Specifications

### 9.1 Warna & Badge

| Elemen | Warna |
|--------|-------|
| Badge Kondisi Baik | Hijau |
| Badge Dalam Perbaikan | Oranye |
| Badge Rusak | Merah |
| Badge Tersedia | Hijau |
| Badge Dipinjam | Kuning/Amber |
| Badge Terlambat | Merah |
| Tab Aktif | Biru (`border-blue-600 text-blue-600`) |
| Tombol Utama | Oranye / Sky |
| Tombol Edit | Biru |
| Section Pisau | Slate/Hitam |
| Section Aset | Biru |

### 9.2 Responsive

- Modal: `max-w-5xl`, scrollable `max-h-[90vh]`
- Grid info: 2 kolom di desktop, 1 kolom di mobile
- Tabel: horizontal scroll di mobile
- Form: stack di mobile, grid di desktop

---

## 10. Tech Stack

| Komponen | Teknologi |
|----------|----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| State Management | React useState/useMemo |
| Persistence | localStorage |
| Testing | Vitest |

---

## 11. File Structure

```
src/
├── App.jsx                    # Main app shell, routing, modals, state
├── components/
│   ├── PisauView.jsx          # DataPisauView, PisauDetailModal, BorrowLogTable
│   ├── PisauFormPage.jsx      # Form tambah/edit pisau (Pisau dulu → Aset & Part)
│   ├── MaintenanceView.jsx    # MaintenanceView, MaintenanceFormModal (sparepart section)
│   ├── AssetFormPage.jsx      # Form tambah/edit aset
│   ├── PeminjamanView.jsx     # Daftar peminjaman
│   └── SharedUI.jsx           # StatusBadge, PerawatanBadge
├── data/
│   ├── mockData.js            # Data mock, helper functions, sample pisau (10 item)
│   ├── domain.js              # Persistence, date utils, transisi status
│   └── domain.test.js         # Test untuk domain functions
└── docs/
    └── PRD-Improvement-Pisau-Perawatan.md  # Dokumen ini
```

---

## 12. Acceptance Criteria

### 12.1 Pisau

1. Form input pisau menampilkan Spesifikasi Pisau (Step 1) sebelum Kebutuhan Aset & Part (Step 2).
2. Tipe hanya menampilkan 2 opsi: Aset dan Part (tidak ada Keduanya).
3. Jika tipe = Aset, field keuangan (depresiasi) ditampilkan.
4. Jika tipe = Part, field stok ditampilkan dan keuangan disembunyikan.
5. Pisau dengan tipe Aset bisa dipinjamkan.
6. Pisau dengan tipe Part tidak bisa dipinjamkan.

### 12.2 Sparepart di Perawatan

1. Form perawatan menampilkan section "Sparepart yang Digunakan".
2. User bisa memilih sparepart dari inventory (dropdown).
3. User bisa input sparepart manual (nama, qty, satuan).
4. Quantity dari inventory dibatasi oleh stok tersedia.
5. Sparepart tersimpan di maintenance log.
6. Sparepart ditampilkan di detail log perawatan.
7. Item yang sudah dipilih tidak muncul lagi di dropdown.

### 12.3 Auto Status

1. Ketika status perawatan = "Dalam Perbaikan", kondisi asset otomatis berubah.
2. Validasi: item harus dikembalikan jika sedang dipinjam sebelum masuk perbaikan.

### 12.4 Detail View

1. Semua detail view (Aset, Pisau) memiliki 3 tab: Informasi, Jadwal & Perawatan, Riwayat Pinjam.
2. Tab Informasi menampilkan data lengkap item.
3. Tab Jadwal menampilkan timeline + log perawatan.
4. Tab Riwayat Pinjam menampilkan tabel sirkulasi.

---

## 13. Changelog

| Tanggal | Versi | Perubahan |
|---------|-------|-----------|
| 16 Jul 2026 | 1.0 | Dokumen awal |
| 16 Jul 2026 | 1.1 | Tambah aturan domain, audit, transisi status |
| 20 Jul 2026 | 2.0 | **Major update:** Form pisau 2 tipe (Part/Aset), reorder form (pisau dulu), sparepart di perawatan, auto status asset, 10 sample pisau |
