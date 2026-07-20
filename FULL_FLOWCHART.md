# Flowchart Data Antar Modul AsetKu — Satu Halaman

Diagram ini menunjukkan modul UI, proses bisnis, data bersama, dan dampak perubahan data dalam satu halaman penuh.

```mermaid
flowchart LR
  U([User]) --> NAV{Navigasi AsetKu}

  subgraph UI[MODUL APLIKASI]
    direction TB
    HOME[Beranda<br/>dalam pengembangan]
    ASET[Data Aset & Sparepart<br/>list · tambah · edit · detail · hapus]
    PISAU[Pisau<br/>list · tambah · edit · detail · log]
    PINJAM[Peminjaman<br/>form pinjam / kembali<br/>view tersedia tetapi menu tersembunyi]
    RAWAT[Perawatan<br/>daftar · detail · catat / update]
    NOTIF[Notifikasi Maintenance<br/>terlewat / jatuh tempo ≤ 7 hari]
  end

  NAV --> HOME
  NAV --> ASET
  NAV --> PISAU
  NAV --> RAWAT
  NAV -. route internal .-> PINJAM
  NAV --> NOTIF

  subgraph MASTER[MASTER & ATURAN DOMAIN]
    direction TB
    TYPE[Master Tipe Aset & Merek]
    VENDOR[Master Vendor Service]
    RULES{Validasi Terpusat<br/>peran · kondisi · status pinjam<br/>status perawatan · stok}
    AUDIT[Audit Metadata<br/>createdAt/by · updatedAt/by]
  end

  TYPE --> ASET
  TYPE --> PISAU
  VENDOR --> RAWAT

  subgraph PROCESS[PROSES LINTAS MODUL]
    direction TB
    ELIGIBLE{Boleh Dipinjam?<br/>peran Aset<br/>Tersedia + kondisi sehat<br/>tanpa perawatan aktif}
    BORROW[Pinjam<br/>isi peminjam · tanggal · deadline<br/>aksesoris/sparepart · catatan]
    RETURN[Kembalikan<br/>tanggal aktual · catatan]
    MAINTAIN[Perbaikan<br/>PIC · status · lokasi/vendor<br/>jadwal · dokumen · kendala]
    SCHEDULE[Jadwal Berikutnya<br/>tanggal selesai + interval]
  end

  ASET --> ELIGIBLE
  PISAU -->|hanya peran Aset / Keduanya| ELIGIBLE
  PINJAM --> ELIGIBLE
  ELIGIBLE -->|Ya| BORROW
  ELIGIBLE -->|sedang dipinjam / terlambat| RETURN
  ELIGIBLE -->|Tidak| REJECT[Transaksi Ditolak]
  ASET --> MAINTAIN
  PISAU --> MAINTAIN
  RAWAT --> MAINTAIN
  MAINTAIN --> SCHEDULE

  subgraph DATA[SHARED DATA / SINGLE SOURCE OF TRUTH]
    direction TB
    ASSETS[(assets<br/>Aset · Sparepart · Pisau<br/>lokasi · stok · jadwal<br/>3 state terpisah)]
    BLOG[(borrowLogs<br/>surat jalan · peminjam<br/>deadline · kembali · aksesoris)]
    MLOG[(maintenanceLogs<br/>PIC · vendor · status<br/>tanggal · dokumen · kendala)]
  end

  ASET <-->|CRUD kategori Aset / Sparepart| ASSETS
  PISAU <-->|CRUD kategori Pisau<br/>peran Aset / Part / Keduanya| ASSETS
  BORROW -->|statusPinjam = Dipinjam| ASSETS
  BORROW -->|buat transaksi| BLOG
  RETURN -->|statusPinjam = Tersedia| ASSETS
  RETURN -->|status = Dikembalikan| BLOG
  MAINTAIN -->|statusPerawatan + kondisi| ASSETS
  MAINTAIN -->|buat log immutable| MLOG
  SCHEDULE -->|jadwalMaintenance + interval| ASSETS
  BLOG -->|deadline lewat otomatis| LATE[status = Terlambat]
  LATE --> BLOG
  BLOG -->|sinkron status item| ASSETS
  ASSETS --> NOTIF
  NOTIF -->|klik item| RAWAT
  ASSETS --> RAWAT
  BLOG --> ASET
  BLOG --> PISAU
  BLOG --> RAWAT
  MLOG --> ASET
  MLOG --> PISAU
  MLOG --> RAWAT

  RULES --> ELIGIBLE
  RULES --> MAINTAIN
  RULES --> ASET
  RULES --> PISAU
  AUDIT --> ASSETS
  AUDIT --> BLOG
  AUDIT --> MLOG

  subgraph STATE[TRANSISI STATE UTAMA]
    direction TB
    BS1[Tersedia] -->|Pinjam| BS2[Dipinjam]
    BS2 -->|deadline lewat| BS3[Terlambat]
    BS2 -->|Kembali| BS1
    BS3 -->|Kembali| BS1

    MS1[Normal] --> MS2[Perlu Diperbaiki]
    MS2 --> MS3[Dalam Perbaikan]
    MS2 --> MS4[Tertunda]
    MS3 --> MS4
    MS4 --> MS3
    MS3 --> MS5[Selesai Diperbaiki]
    MS2 --> MS6[Dibatalkan]
    MS4 --> MS6
  end

  subgraph STORE[PERSISTENCE LOKAL]
    LS[(localStorage<br/>asetku.assets<br/>asetku.borrowLogs<br/>asetku.maintenanceLogs)]
  end

  ASSETS <--> LS
  BLOG <--> LS
  MLOG <--> LS

  classDef module fill:#dbeafe,stroke:#2563eb,color:#172554
  classDef process fill:#ffedd5,stroke:#ea580c,color:#431407
  classDef data fill:#dcfce7,stroke:#16a34a,color:#052e16
  classDef rule fill:#fef3c7,stroke:#d97706,color:#451a03
  classDef state fill:#f3e8ff,stroke:#9333ea,color:#3b0764
  classDef muted fill:#f1f5f9,stroke:#64748b,color:#0f172a

  class HOME,ASET,PISAU,PINJAM,RAWAT,NOTIF module
  class ELIGIBLE,BORROW,RETURN,MAINTAIN,SCHEDULE process
  class ASSETS,BLOG,MLOG,LS data
  class TYPE,VENDOR,RULES,AUDIT rule
  class BS1,BS2,BS3,MS1,MS2,MS3,MS4,MS5,MS6 state
  class REJECT,LATE muted
```

Catatan: `kondisi`, `statusPinjam`, dan `statusPerawatan` tetap tiga state berbeda. Sparepart biasa hanya menjadi stok/aksesoris transaksi, bukan item pinjaman utama.
