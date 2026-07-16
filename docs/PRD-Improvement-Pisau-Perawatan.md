# Product Requirements Document (PRD)

## Improvement: Pisau sebagai Asset & Perawatan

**Versi:** 1.0
**Tanggal:** 16 Juli 2026
**Status:** Draft

---

## 1. Ringkasan

Dokumen ini mendefinisikan kebutuhan improvement untuk dua modul utama:

1. **Pisau sebagai Asset** — Penggunaan pisau diperlakukan sebagai aset yang bisa dipinjamkan, dikembalikan, dan dilacak statusnya
2. **Perawatan** — Sistem pencatatan, penjadwalan, dan pelacakan perawatan/pemeliharaan inventaris

---

## 2. Latar Belakang

### 2.1 Pisau sebagai Asset
Sebelumnya, pisau dikelola secara terpisah dari modul aset utama. Pisau memiliki peran ganda sebagai **Aset** (bisa dipinjamkan) dan **Part** (bisa dikalkulasi sebagai sparepart). Improvement ini memastikan pisau terintegrasi penuh dengan sistem aset, termasuk alur peminjaman, pengembalian, dan pelacakan.

### 2.2 Perawatan
Sistem perawatan sebelumnya hanya berupa form pencatatan sederhana. Improvement ini menghadirkan:
- Detail view dengan 3 tab (Informasi, Jadwal & Perawatan, Riwayat Pinjam)
- Timeline visual riwayat jadwal perawatan
- Integrasi penuh dengan modul aset dan pisau

---

## 3. Pisau sebagai Asset

### 3.1 Peran Inventori
Pisau memiliki dua peran yang bisa dikombinasikan:

| Peran | Keterangan | Kemampuan |
|-------|-----------|-----------|
| **Aset** | Pisau yang dimiliki dan bisa dipinjamkan | Peminjaman, Pengembalian, Depresiasi, Pelacakan lokasi |
| **Part** | Pisau yang digunakan sebagai sparepart | Kalkulasi harga, Stok |
| **Keduanya** | Pisau berperan sebagai Aset dan Part sekaligus | Semua kemampuan di atas |

### 3.2 Fitur Peminjaman Pisau

#### Alur Peminjaman
1. Pisau dalam status **Tersedia** → bisa dipinjam
2. Klik tombol **Pinjam** → form peminjaman muncul
3. Isi data: Peminjam, Tanggal Pinjam, Deadline Kembali, Sparepart/Aksesoris (opsional)
4. Simpan → Status berubah menjadi **Dipinjam**

#### Alur Pengembalian
1. Pisau dalam status **Dipinjam** atau **Terlambat** → bisa dikembalikan
2. Klik tombol **Kembalikan** → form pengembalian muncul
3. Isi data: Tanggal Kembali (Aktual), Foto Kembali, Catatan
4. Simpan → Status berubah menjadi **Tersedia**

#### Status Pinjam
| Status | Keterangan | Aksi Tersedia |
|--------|-----------|---------------|
| `Tersedia` | Pisau bisa dipinjam | Pinjam |
| `Dipinjam` | Pisau sedang dipinjam | Kembalikan |
| `Terlambat` | Deadline sudah lewat | Kembalikan |

### 3.3 Detail View Pisau

Tab **Informasi** menampilkan:
- Foto utama + Foto hasil penggunaan
- Nama, Kode, Kondisi (badge), Status Pinjam (badge)
- Peran Inventori, Status Pinjam
- No. Seri, No. Registrasi
- Vendor, Harga Beli, Tanggal Pembelian, Masa Garansi
- Penempatan Lokasi (Gudang, Area, Rak, Box)
- Ukuran (Panjang x Lebar x Tinggi mm)
- Laminasi, Mata Pisau, Unit, Merek, Produk, Bahan Baku
- Fungsi
- Depresiasi (jika peran Aset)
- Catatan

Tab **Jadwal & Perawatan** menampilkan:
- Pengaturan jadwal perawatan berikutnya
- Timeline riwayat jadwal (kapan dijadwalkan vs kapan dilakukan)
- Riwayat perbaikan detail

Tab **Riwayat Pinjam** menampilkan:
- Tabel sirkulasi & peminjaman: No. Surat Jalan, Nama Peminjam, Tgl Dipinjam, Deadline, Tgl Kembali, Status

### 3.4 Kalkulasi Harga Pisau

Untuk pisau dengan peran **Part**:
- Harga satuan × Quantity = Total per item
- Total semua item = Grand Total
- Berguna untuk kalkulasi biaya penggunaan pisau per mesin/produksi

---

## 4. Perawatan

### 4.1 Ringkasan Modul

Modul perawatan adalah satu pintu untuk:
- Melihat daftar semua inventaris (Aset / Sparepart / Pisau) beserta status perawatannya
- Mencatat perbaikan baru
- Mengupdate status perbaikan yang sedang berjalan
- Melihat jadwal perawatan yang sudah lewat atau segera jatuh tempo
- Melihat riwayat perawatan lengkap per item

### 4.2 Daftar Perawatan (List View)

#### Statistik Cards
| Card | Keterangan |
|------|-----------|
| Perlu Diperbaiki | Jumlah item dengan status perawatan "Perlu Diperbaiki" |
| Dalam Perbaikan | Jumlah item dengan status "Dalam Perbaikan" |
| Selesai Diperbaiki | Jumlah item dengan status "Selesai Diperbaiki" |
| Jadwal Due / Terlewat | Jumlah item yang jadwal perawatannya sudah lewat atau dalam 7 hari |

#### Filter & Pencarian
- **Pencarian:** Berdasarkan kode atau nama item
- **Filter Status:** Semua, Normal, Perlu Diperbaiki, Dalam Perbaikan, Tertunda, Selesai Diperbaiki, Dibatalkan

#### Tabel Inventori
| Kolom | Keterangan |
|-------|-----------|
| Kode | Kode unik item (mono font, biru) |
| Nama | Nama item |
| Kategori | Badge warna: Aset (biru), Sparepart (ungu), Pisau (kuning) |
| PIC | Penanggung jawab terakhir |
| Status | Badge status perawatan + indikator kendala |
| Lokasi / Estimasi | Lokasi service (Internal/Eksternal) + tanggal estimasi selesai |
| Aksi | Tombol Lihat Detail, Update Perbaikan |

### 4.3 Detail View Perawatan (MaintenanceDetailModal)

Ketika user mengklik tombol **Lihat Detail** (ikon mata) pada tabel, muncul modal dengan 3 tab:

#### Tab 1: Informasi
Menampilkan data lengkap item (sama dengan detail view aset/pisau):
- Foto, Nama, Kode, Kondisi, Status Perawatan
- Peran Inventori, Status Pinjam
- Data inventori lengkap (vendor, harga, garansi, lokasi, dll)
- PIC terakhir dari log perawatan

#### Tab 2: Jadwal & Perawatan
Tiga bagian:

**a. Pengaturan Jadwal**
- Tanggal Perawatan Berikutnya (date picker)
- Interval Periodic (hari, default 90)
- Badge status: Terlewat / Segera / Terjadwal / Belum dijadwalkan
- Peringatan visual jika terlambat atau segera jatuh tempo
- Tombol **Simpan Jadwal**

**b. Riwayat Jadwal (Timeline)**
- Highlight jadwal berikutnya (orange, animated pulse)
- Timeline visual untuk setiap perawatan:
  - Titik berwarna: hijau (selesai), oranye (dalam perbaikan), abu-abu (lainnya)
  - Tanggal dijadwalkan mulai, estimasi selesai, aktual selesai
  - Indikator terlambat jika aktual > estimasi
  - PIC, lokasi, kendala

**c. Riwayat Perbaikan**
- Daftar log perawatan dalam format kartu expandable
- Setiap log menampilkan: status, PIC, lokasi, tanggal, foto, kendala, catatan, dokumen

#### Tab 3: Riwayat Pinjam
- Tabel sirkulasi & peminjaman (khusus item yang bisa dipinjam)
- Kolom: No. Surat Jalan, Nama Peminjam, Tgl Dipinjam, Deadline, Tgl Kembali, Status

### 4.4 Form Perbaikan (MaintenanceFormModal)

Ketika user mengklik tombol **Catat Perbaikan** atau **Update Perbaikan**:

#### Field Form
| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|-----------|
| Item Inventori | Select | Ya | Pilih aset/sparepart/pisau |
| PIC | Text | Ya | Penanggung jawab perbaikan |
| Status Perawatan | Select | Ya | Perlu Diperbaiki, Dalam Perbaikan, Selesai Diperbaiki, Dibatalkan |
| Lokasi / Tempat Service | Radio | Ya | Internal / Eksternal |
| Vendor (jika Eksternal) | Select | Ya | Pilih vendor dari master data |
| Tanggal Pengiriman | Date | - | Untuk service eksternal |
| Tanggal Diterima | Date | - | Untuk service eksternal |
| Tanggal Mulai | Date | Ya | Kapan perbaikan dimulai |
| Estimasi Selesai | Date | Ya | Perkiraan selesai |
| Tanggal Aktual Selesai | Date | Ya* | *Hanya jika status = Selesai |
| Lama Waktu Perbaikan | Text | Ya* | *Dihitung otomatis, bisa diedit |
| Jadwal Maintenance Berikutnya | Date | - | Diisi saat status = Selesai |
| Interval (hari) | Number | - | Default 90 hari |
| Catatan | Textarea | - | Detail pekerjaan, hasil inspeksi |
| Kendala | Textarea | - | Hambatan yang dihadapi |
| Foto Perbaikan | File | - | Dokumentasi kondisi/proses |
| Dokumen Pendukung | File (multi) | - | Surat jalan, invoice, BA |

### 4.5 Status Perawatan

| Status | Keterangan | Transisi |
|--------|-----------|----------|
| Normal | Item dalam kondisi baik | → Perlu Diperbaiki |
| Perlu Diperbaiki | Item perlu diperbaiki | → Dalam Perbaikan, Dibatalkan |
| Dalam Perbaikan | Sedang dalam proses perbaikan | → Selesai Diperbaiki |
| Selesai Diperbaiki | Perbaikan selesai | → Normal (otomatis) |
| Dibatalkan | Perbaikan dibatalkan | → Normal |

### 4.6 Penjadwalan Otomatis

Ketika perbaikan ditandai **Selesai Diperbaiki**:
1. Sistem menghitung jadwal berikutnya berdasarkan `tanggalSelesaiAktual + intervalMaintenanceHari`
2. User bisa mengubah jadwal yang diusulkan
3. Jika jadwal sudah lewat → notifikasi "Terlewat" (merah)
4. Jika jadwal dalam 7 hari → notifikasi "Segera" (kuning)

---

## 5. Integrasi Antar Modul

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│    Pisau     │────▶│   Perawatan  │◀────│    Aset      │
│             │     │              │     │              │
│ • Peminjaman│     │ • Jadwal     │     │ • Depresiasi │
│ • Pengembalian│   │ • Perbaikan  │     │ • Pelacakan  │
│ • Kalkulasi │     │ • Riwayat    │     │ • Peminjaman │
└─────────────┘     └──────────────┘     └──────────────┘
```

- **Pisau ↔ Perawatan:** Pisau bisa dicatat perawatannya di modul Perawatan. Jadwal perawatan pisau diatur dari detail view pisau (tab Jadwal & Perawatan).
- **Aset ↔ Perawatan:** Sama seperti Pisau. Semua aset bisa dicatat perawatannya.
- **Pisau ↔ Aset:** Pisau dengan peran Aset terhubung ke modul peminjaman aset. Status pinjam pisau terlihat di detail view perawatan.

---

## 6. UI/UX Specifications

### 6.1 Konsistensi Detail View
Semua detail view (Aset, Pisau, Perawatan) menggunakan struktur yang identik:
- Header: Nama item uppercase + tombol close
- Tab: Informasi, Jadwal & Perawatan, Riwayat Pinjam
- Warna aktif tab: Biru (`border-blue-600 text-blue-600`)
- Footer: Tombol "Kembali" saja (sticky bottom)
- Container: `bg-slate-50 rounded-2xl max-w-5xl`

### 6.2 Warna & Badge
| Elemen | Warna |
|--------|-------|
| Badge Kondisi Baik | Hijau |
| Badge Perlu Perbaikan | Kuning/Amber |
| Badge Dalam Perbaikan | Oranye |
| Badge Selesai | Biru langit |
| Badge Terlambat (jadwal) | Merah |
| Badge Segera (jadwal) | Kuning |
| Tombol Utama | Oranye (`bg-orange-600`) |
| Tombol Edit | Biru (`bg-blue-50 text-blue-700`) |

### 6.3 Responsive
- Modal: `max-w-5xl`, scrollable `max-h-[90vh]`
- Grid info: 2 kolom di desktop, 1 kolom di mobile
- Tabel: horizontal scroll di mobile

---

## 7. Data Model

### 7.1 Asset
```javascript
{
  id: Number,
  kode: String,          // e.g. "M-001", "P-001"
  nama: String,
  kategori: String,      // "Aset" | "Sparepart" | "Pisau"
  kondisi: String,       // "Baik" | "Perlu Perbaikan" | "Rusak"
  statusPerawatan: String, // "Normal" | "Perlu Diperbaiki" | "Dalam Perbaikan" | "Selesai Diperbaiki"
  statusPinjam: String,  // "Tersedia" | "Dipinjam" | "Terlambat"
  peranInventori: String, // "Aset" | "Part" | "Keduanya" (khusus Pisau)
  
  // Lokasi
  gudang: String,
  area: String,
  rak: String,
  box: String,
  
  // Jadwal Perawatan
  jadwalMaintenance: String,     // ISO date string
  intervalMaintenanceHari: Number, // default 90
  
  // Detail
  vendor: String,
  hargaBeli: Number,
  tanggalBeli: String,
  tanggalGaransi: String,
  noSeri: String,
  noRegistrasi: String,
  catatan: String,
  
  // Pisau-specific
  merk: String,
  produk: String,
  bahanBaku: String,
  fungsi: String[],
  panjang: Number,
  lebar: Number,
  tinggi: Number,
  laminasi: String,
  jumlahMata: Number,
  unit: String,
  depresiasiType: String,  // "Persen" | "Flat"
  depresiasiValue: Number,
  masaManfaat: Number,
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
  tanggalSelesaiAktual: String | null,
  lokasiTipe: String,      // "Internal" | "Eksternal"
  vendorId: String | null,
  vendorNama: String | null,
  vendorKontak: String | null,
  vendorAlamat: String | null,
  tanggalKirim: String | null,
  tanggalDiterima: String | null,
  status: String,
  foto: String | null,
  dokumenPendukung: Array,
  lamaWaktuPerbaikan: String | null,
  catatan: String,
  kendala: String,
  createdAt: String,        // ISO timestamp
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
  deadlineKembali: String | null,
  tanggalKembali: String | null,
  status: String,           // "Dipinjam" | "Dikembalikan" | "Terlambat"
  catatan: String,
}
```

---

## 8. Tech Stack

| Komponen | Teknologi |
|----------|----------|
| Framework | React 18+ |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State Management | React useState/useMemo |
| Data | Mock data (JSON) |

---

## 9. File Structure

```
src/
├── App.jsx                    # Main app shell, routing, modals, state
├── components/
│   ├── PisauView.jsx          # DataPisauView, PisauDetailModal, BorrowLogTable
│   ├── PisauFormPage.jsx      # Form tambah/edit pisau
│   ├── MaintenanceView.jsx    # MaintenanceView, MaintenanceDetailModal,
│   │                          # MaintenanceFormModal, JadwalPerawatanTab,
│   │                          # JadwalHistoryTimeline, MaintenanceLogList
│   ├── AssetFormPage.jsx      # Form tambah/edit aset
│   ├── PeminjamanView.jsx     # Daftar peminjaman
│   └── SharedUI.jsx           # StatusBadge, PerawatanBadge
├── data/
│   └── mockData.js            # Data constants, mock data, helper functions
└── docs/
    └── PRD-Improvement-Pisau-Perawatan.md  # Dokumen ini
```

---

## 10. Changelog

| Tanggal | Versi | Perubahan |
|---------|-------|-----------|
| 16 Jul 2026 | 1.0 | Dokumen awal — Definisikan improvement Pisau sebagai Asset dan Perawatan |

---

## 11. Catatan Teknis

### 11.1 Shared Components
- `JadwalPerawatanTab` — Digunakan di PisauDetailModal, AssetDetailModal, MaintenanceDetailModal
- `JadwalHistoryTimeline` — Digunakan di AssetDetailModal, MaintenanceDetailModal
- `MaintenanceLogList` — Digunakan di AssetDetailModal, MaintenanceDetailModal, MaintenanceFormModal
- `BorrowLogTable` — Digunakan di PisauDetailModal, MaintenanceDetailModal
- `StatusBadge` — Badge kondisi dan peminjaman
- `PerawatanBadge` — Badge status perawatan

### 11.2 Konsistensi UI
Semua detail view (Aset, Pisau, Perawatan) memiliki:
- Struktur tab yang identik (Informasi, Jadwal & Perawatan, Riwayat Pinjam)
- Field yang identik pada tab Informasi
- Warna dan styling yang konsisten
- Footer yang identik (tombol "Kembali" saja)
