# AsetKu — Flowchart & Relasi Field

Dokumentasi alur bisnis dan model data modul Aset, Sparepart, dan Pisau dalam format Mermaid.

---

## 1. Flowchart alur bisnis (detail)

```mermaid
flowchart TD
  Start([User Login AsetKu]) --> Menu{Pilih Menu}

  Menu -->|Data Aset and Sparepart| AsetList[List Aset - filter Semua/Aset/Sparepart/Pisau]
  Menu -->|Pisau| PisauList[List Pisau khusus]
  Menu -->|Peminjaman| PinjamList[List Dipinjam/Terlambat + Siap Dipinjam]

  %% === CRUD PISAU ===
  PisauList -->|Pisau Baru / Edit| PisauForm[Form Pisau]
  PisauForm --> Validasi{Field wajib OK?}
  Validasi -->|Tidak| PisauForm
  Validasi -->|Ya| SavePisau[Simpan ke assets\nkategori=Pisau, tipe=PISAU]
  SavePisau --> AssetsStore[(assets state)]
  PisauList -->|Detail / Log| PisauDetail[Detail Pisau + Histori Pinjam]
  PisauDetail --> BorrowLogs[(borrowLogs)]
  PisauList -->|Hapus| DelAsset[Hapus asset + log terkait]
  DelAsset --> AssetsStore
  DelAsset --> BorrowLogs

  %% === CRUD ASET UMUM ===
  AsetList -->|Aset Baru / Edit non-Pisau| AsetForm[Form Aset/Sparepart]
  AsetForm --> AssetsStore
  AsetList -->|Edit Pisau| PisauForm
  AsetList -->|Detail| DetailRoute{kategori?}
  DetailRoute -->|Pisau| PisauDetail
  DetailRoute -->|Aset/Sparepart| AsetDetail[Detail Aset + Depresiasi]

  %% === PEMINJAMAN ===
  AsetList --> BorrowAct[Aksi Pinjam / Kembali]
  PisauList --> BorrowAct
  PinjamList --> BorrowAct
  PisauDetail -->|Pinjam / Kembali| BorrowAct

  BorrowAct --> BorrowModal[BorrowModal]
  BorrowModal --> TxType{Jenis transaksi?}

  TxType -->|Pinjam| SetDipinjam[Update assets:\nstatusPinjam=Dipinjam\nnamaPeminjam, tanggalPinjam]
  SetDipinjam --> AppendLog[INSERT borrowLogs\nstatus=Dipinjam\nkodeSurat SJ-PJM-xxxx]
  AppendLog --> BorrowLogs
  SetDipinjam --> AssetsStore

  TxType -->|Kembali| SetTersedia[Update assets:\nstatusPinjam=Tersedia\nkosongkan peminjam]
  SetTersedia --> CloseLog[UPDATE borrowLogs aktif\nstatus=Dikembalikan\ntanggalKembali]
  CloseLog --> BorrowLogs
  SetTersedia --> AssetsStore

  AssetsStore --> RefreshUI[Refresh UI semua menu]
  BorrowLogs --> RefreshUI
  RefreshUI --> Menu
```

---

## 2. ER diagram + relasi field

```mermaid
erDiagram
  ASSET_TYPES ||--o{ ASSETS : "assetTypeId = _id"
  ASSETS ||--o{ BORROW_LOGS : "assetId"
  ASSETS ||--o| PISAU_EXT : "jika kategori=Pisau"
  ASSETS ||--o| ASET_KEUANGAN : "jika kategori=Aset"
  ASSETS ||--o| SPAREPART_EXT : "jika kategori=Sparepart"
  ASSETS }o--|| OWNER_GUDANG : "pemilikAsset - gudang"

  ASSET_TYPES {
    string _id PK "ObjectId API"
    string name UK "AC | LAPTOP | RAM | SSD | PISAU"
    string description
    array merk "daftar merek per tipe"
    string companyId
    boolean isDeleted
  }

  ASSETS {
    number id PK
    string kategori "Aset | Sparepart | Pisau"
    string assetTypeId FK "→ ASSET_TYPES._id"
    string tipe "denormalized = ASSET_TYPES.name"
    string kode UK
    string nama
    string merk "harus anggota ASSET_TYPES.merk"
    string noSeri
    string noRegistrasi
    string pemilikAsset
    string gudang
    string area
    string rak
    string box
    string kondisi
    string statusPinjam "Tersedia | Dipinjam | Terlambat"
    string namaPeminjam "nullable"
    date tanggalPinjam "nullable"
    string gambar "base64 nullable"
    string vendor
    number hargaBeli
    string catatan
    datetime createdAt
  }

  PISAU_EXT {
    number assetId FK
    string unit "Pcs | Set"
    number panjang "mm"
    number lebar "mm"
    number tinggi "mm"
    string laminasi "Ya | Tidak"
    number jumlahMata
    string produk
    string bahanBaku
    array fungsi
    boolean semuaFungsi
    string gambarPerspektif
    string gambarPenampang
    string gambarProfil
    object filesTambahan
  }

  ASET_KEUANGAN {
    number assetId FK
    string depresiasiType "Persen | Nominal"
    number depresiasiValue
    number masaManfaat
    date tanggalBeli
    date tanggalGaransi
  }

  SPAREPART_EXT {
    number assetId FK
    string catatan "non-depresiasi"
  }

  BORROW_LOGS {
    number id PK
    number assetId FK
    string kodeSurat
    string namaPeminjam
    date tanggalPinjam
    date deadlineKembali "nullable"
    date tanggalKembali "nullable"
    string status "Dipinjam | Terlambat | Dikembalikan"
    string catatan
  }

  OWNER_GUDANG {
    string pemilikAsset PK
    string gudang "turunan dari pemilik"
  }
```

---

## 3. Mapping field antar entitas (alur pinjam)

```mermaid
flowchart LR
  subgraph FormPinjam[BorrowModal input]
    F1[namaPeminjam]
    F2[tanggalPinjam]
    F3[deadlineKembali]
    F4[tanggalKembali]
    F5[catatan]
  end

  subgraph AssetsUpdate[ASSETS update]
    A1[statusPinjam]
    A2[namaPeminjam]
    A3[tanggalPinjam]
  end

  subgraph LogsWrite[BORROW_LOGS write]
    L1[assetId]
    L2[kodeSurat]
    L3[namaPeminjam]
    L4[tanggalPinjam]
    L5[deadlineKembali]
    L6[tanggalKembali]
    L7[status]
    L8[catatan]
  end

  F1 -->|copy| A2
  F1 -->|copy| L3
  F2 -->|copy| A3
  F2 -->|copy| L4
  F3 -->|copy| L5
  F4 -->|saat kembali| L6
  F5 -->|copy| L8

  A1 -->|Pinjam = Dipinjam| L7
  A1 -->|Kembali = Tersedia| L7
```

---

## 4. Inheritance kategori (satu tabel assets)

```mermaid
classDiagram
  class AssetBase {
    +id
    +kategori
    +kode
    +nama
    +merk
    +pemilikAsset
    +gudang
    +area
    +rak
    +box
    +kondisi
    +statusPinjam
    +namaPeminjam
    +tanggalPinjam
    +vendor
    +hargaBeli
    +gambar
    +createdAt
  }

  class AsetTetap {
    +depresiasiType
    +depresiasiValue
    +masaManfaat
    +tanggalBeli
    +tanggalGaransi
    +noSeri
    +noRegistrasi
  }

  class Sparepart {
    +noSeri
    +catatan
  }

  class Pisau {
    +unit
    +panjang
    +lebar
    +tinggi
    +laminasi
    +jumlahMata
    +produk
    +bahanBaku
    +fungsi[]
    +semuaFungsi
    +gambarPerspektif
    +gambarPenampang
    +gambarProfil
    +filesTambahan
  }

  class BorrowLog {
    +id
    +assetId
    +kodeSurat
    +namaPeminjam
    +tanggalPinjam
    +deadlineKembali
    +tanggalKembali
    +status
    +catatan
  }

  AssetBase <|-- AsetTetap : kategori=Aset
  AssetBase <|-- Sparepart : kategori=Sparepart
  AssetBase <|-- Pisau : kategori=Pisau
  AssetBase "1" --> "*" BorrowLog : assetId
```

---

## 5. Ringkasan relasi

| Relasi | Kardinalitas | Kunci | Aturan |
|--------|--------------|-------|--------|
| `ASSET_TYPES` → `ASSETS` | 1 : N | `assets.assetTypeId = assetTypes._id` | Pilih tipe → cascade opsi `merk`; simpan `tipe` = `name` |
| `ASSETS` → `BORROW_LOGS` | 1 : N | `borrowLogs.assetId = assets.id` | Setiap pinjam INSERT; setiap kembali UPDATE log aktif |
| `pemilikAsset` → `gudang` | 1 : N | lookup `gudangOptionsByOwner` | Ganti pemilik → reset opsi gudang |
| `Pisau` ⊂ `ASSETS` | specialization | `kategori = 'Pisau'` + `assetTypeId` tipe PISAU | CRUD form khusus menu Pisau; mewarisi field ASSETS (+ ASET_KEUANGAN jika peran Aset); field PISAU_EXT tidak masuk form Aset |
| Menu Aset / Pisau / Peminjaman | share store | state `assets` + `borrowLogs` | Satu sumber kebenaran di App |

---

## 6. Tabel field lengkap

### ASSETS (field bersama)

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| id | number | Ya | Primary key |
| kategori | string | Ya | `Aset` / `Sparepart` / `Pisau` |
| assetTypeId | string | Ya | FK → master tipe (`_id` dari API) |
| tipe | string | Ya | Denormalized dari `ASSET_TYPES.name` (LAPTOP, PISAU, …) |
| kode | string | Ya | Unique code |
| nama | string | Ya | Nama item |
| merk | string | Ya* | Anggota array `merk[]` pada tipe yang dipilih |
| noSeri | string | Kondisional | Wajib untuk Aset/Sparepart |
| noRegistrasi | string | Kondisional | Bagian kode registrasi |
| pemilikAsset | string | Ya | Internal Wajib / TKI / FTP |
| gudang | string | Ya | Bergantung pemilikAsset |
| area | string | Tidak | Area lokasi |
| rak | string | Tidak | No rak |
| box | string | Tidak | No box |
| kondisi | string | Ya | Kondisi Baik, Rusak, dll |
| statusPinjam | string | Ya | Tersedia / Dipinjam / Terlambat |
| namaPeminjam | string | Tidak | Null jika tersedia |
| tanggalPinjam | date | Tidak | Null jika tersedia |
| gambar | string | Tidak | Base64 preview |
| vendor | string | Tidak | Nama/kode vendor |
| hargaBeli | number | Tidak | IDR |
| catatan | string | Tidak | Catatan bebas |
| createdAt | datetime | Ya | Waktu dibuat |

### ASSET_TYPES (master tipe — respons API inventori)

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| _id | string | Ya | Primary key API |
| name | string | Ya | Nama tipe: AC, LAPTOP, RAM, SSD, PISAU |
| description | string | Tidak | Deskripsi tipe |
| merk | string[] | Ya | Daftar merek valid untuk tipe ini |
| companyId | string | Ya | Scope perusahaan |
| isDeleted | boolean | Ya | Soft delete |

### PISAU_EXT (field khusus kategori Pisau)

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| unit | string | Ya | Pcs / Set |
| panjang | number | Ya | mm |
| lebar | number | Ya | mm |
| tinggi | number | Ya | mm |
| laminasi | string | Ya | Ya / Tidak |
| jumlahMata | number | Ya | Jumlah mata pisau |
| produk | string | Tidak | Solid Wood, MDF, dll |
| bahanBaku | string | Tidak | HSS, Carbide, dll |
| fungsi | string[] | Ya* | Multi-tag fungsi |
| semuaFungsi | boolean | Tidak | Jika true = semua opsi |
| peranInventori | string | Ya | `Aset` / `Part` / `Keduanya` |
| fotoUtama | string | Tidak | Base64 |
| gambarHasil | string | Tidak | Base64 |
| gambarPerspektif | string | Tidak | Base64 |
| gambarPenampang | string | Tidak | Base64 |
| gambarProfil | string | Tidak | Base64 |
| filesTambahan | object | Tidak | Map kategori → file[] |

**Paritas field Aset → Pisau:** record `kategori=Pisau` mewarisi seluruh field bersama `ASSETS` (`noSeri`, `noRegistrasi`, `kondisi`, `catatan`, `vendor`, `hargaBeli`, lokasi, pinjam, dll.) serta field `ASET_KEUANGAN` ketika `peranInventori` = `Aset` atau `Keduanya`. Field khusus Pisau di atas **tidak** ditambahkan ke form/modul Aset biasa.

### ASET_KEUANGAN (field khusus kategori Aset / Pisau-as-Aset)

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| depresiasiType | string | Tidak | Persen / Nominal |
| depresiasiValue | number | Tidak | Nilai depresiasi |
| masaManfaat | number | Tidak | Tahun |
| tanggalBeli | date | Tidak | Tanggal pembelian |
| tanggalGaransi | date | Tidak | Masa garansi |

### BORROW_LOGS

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| id | number | Ya | Primary key |
| assetId | number | Ya | FK → assets.id |
| kodeSurat | string | Ya | Contoh: SJ-PJM-0102 |
| namaPeminjam | string | Ya | Nama peminjam |
| tanggalPinjam | date | Ya | Tanggal dipinjam |
| deadlineKembali | date | Tidak | Perkiraan kembali |
| tanggalKembali | date | Tidak | Diisi saat kembali |
| status | string | Ya | Dipinjam / Terlambat / Dikembalikan |
| catatan | string | Tidak | Catatan transaksi |

---

*Sumber: implementasi `src/App.jsx`, `src/data/mockData.js`, `src/components/PisauView.jsx`*
