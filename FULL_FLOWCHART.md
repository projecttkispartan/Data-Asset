# AsetKu — Full Flowchart Semua Kondisi

```mermaid
flowchart TD
  Start([🚀 User Buka AsetKu]) --> MainNav{📍 Pilih Menu Utama}

  %% ========================================
  %% NAVIGASI MENU UTAMA
  %% ========================================
  MainNav -->|Beranda| Beranda[🏠 Beranda\nDalam Pengembangan]
  MainNav -->|Data Aset & Sparepart| AsetList
  MainNav -->|Pisau| PisauList
  MainNav -->|Peminjaman| PinjamList
  MainNav -->|Perawatan| MaintenanceList
  MainNav -->|Pengaturan| Pengaturan[⚙️ Pengaturan\nDalam Pengembangan]

  %% ========================================
  %% NOTIFIKASI (muncul di header semua halaman)
  %% ========================================
  MainNav -.-> NotifCheck{🔔 Ada Notifikasi\nMaintenance?}
  NotifCheck -->|Ya: overdue / dueSoon| NotifBadge[Tampilkan badge angka\nwarna merah]
  NotifBadge --> KlikNotif{Klik 🔔}
  KlikNotif --> NotifPanel[📋 Panel Notifikasi\nJatuh tempo / Terlewat]
  KlikNotif --> TidakNotif[Tutup panel]
  TidakNotif -.-> MainNav
  NotifPanel --> KlikItemNotif{Klik item notif}
  KlikItemNotif -->|Navigate ke Perawatan| MaintenanceList
  KlikItemNotif -->|Tutup panel| MainNav

  %% ========================================
  %% BREADCRUMB
  %% ========================================
  MainNav -.-> Breadcrumb[Breadcrumb: Beranda / Label Halaman]

  %% ========================================
  %% DATA ASET & SPAREPART
  %% ========================================
  AsetList[List 📦 Data Aset & Sparepart]

  %% --- Filter ---
  AsetList --> FilterKategori{Filter Kategori}
  FilterKategori -->|Semua| ShowAll[Tampilkan semua aset]
  FilterKategori -->|Aset| ShowAset[kategori=Aset\natau Pisau+peranAset]
  FilterKategori -->|Sparepart / Part| ShowPart[kategori=Sparepart\natau Pisau+peranPart]
  FilterKategori -->|Pisau| ShowPisau[kategori=Pisau]

  ShowAll --> AsetTable[📋 Tabel Data]
  ShowAset --> AsetTable
  ShowPart --> AsetTable
  ShowPisau --> AsetTable

  %% --- Aksi di tabel ---
  AsetTable --> AsetAction{Pilih Aksi}

  %% --- Tambah Aset ---
  AsetAction -->|➕ Aset Baru| AsetForm[📝 Form Aset/Sparepart]
  AsetForm --> PilihTipeAset{Pilih Tipe Aset}
  PilihTipeAset -->|AC / LAPTOP / RAM / SSD| AsetFields[Isi field:\nTipe, Merk, Kode, Nama,\nPemilik, Gudang, Lokasi,\nKondisi, Vendor, Harga,\nDepresiasi, Garansi, dll]
  AsetFields --> ValAset{Validasi?}
  ValAset -->|❌ Wajib kosong| AsetForm
  ValAset -->|✅ Lolos| SaveAset[💾 Simpan ke assets\nkategori=Aset/Sparepart]
  SaveAset --> RefreshAset[Refresh Tabel]
  RefreshAset --> AsetList

  %% --- Edit Aset ---
  AsetAction -->|✏️ Edit| CheckKatEdit{kategori?}
  CheckKatEdit -->|Pisau| PisauForm
  CheckKatEdit -->|Aset / Sparepart| AsetFormEdit[📝 Form Edit Aset]
  AsetFormEdit --> SaveAsetEdit[💾 Update assets]
  SaveAsetEdit --> RefreshAset

  %% --- Detail ---
  AsetAction -->|👁️ Detail| CheckKatDetail{kategori?}
  CheckKatDetail -->|Pisau| PisauDetail
  CheckKatDetail -->|Aset / Sparepart| AsetDetail[📄 Detail Aset]

  %% --- Detail Aset ---
  AsetDetail --> DetailTab{Pilih Tab}
  DetailTab -->|📋 Informasi| InfoAset[Data Umum + Lokasi\n+ Depresiasi]
  DetailTab -->|📅 Jadwal Perawatan| JadwalTab[Jadwal Perawatan\nAtur interval jadwal]
  DetailTab -->|🔄 Riwayat Pinjam| RiwayatPinjam[Riwayat Peminjaman\nStatus + Tanggal]
  InfoAset --> AsetDetail
  JadwalTab -->|Simpan Jadwal| UpdateJadwal[Update jadwalMaintenance\n+ intervalMaintenanceHari]
  UpdateJadwal --> AsetDetail

  %% --- Hapus ---
  AsetAction -->|🗑️ Hapus| ConfirmHapus{Konfirmasi Hapus?}
  ConfirmHapus -->|Ya| DelAsset[❌ Hapus asset +\nborrowLogs + maintenanceLogs]
  DelAsset --> RefreshAset

  %% --- Pinjam / Kembali dari tabel ---
  AsetAction -->|🔄 Pinjam/Kembali| CheckPinjam{statusPinjam?}
  CheckPinjam -->|Tersedia + canBorrow| BorrowModal
  CheckPinjam -->|Dipinjam / Terlambat + canBorrow| ReturnModal
  CheckPinjam -->|Tidak bisa pinjam\n(Sparepart tanpa canBorrow)| AsetTable

  %% ========================================
  %% PISAU
  %% ========================================
  PisauList[🔪 Pisau — List Khusus]
  PisauList --> PisauFilter[Filter: peranAset / peranPart / Semua]
  PisauFilter --> PisauTable[📋 Tabel Pisau]

  PisauTable --> PisauAction{Pilih Aksi}

  %% --- Tambah Pisau ---
  PisauAction -->|➕ Pisau Baru| PisauForm
  PisauForm[📝 Form Pisau] --> PisauFields[Isi field:\nTipe, Merk, Kode, Nama,\nUnit, Dimensi, Laminasi,\nJumlah Mata, Produk, Bahan,\nFungsi, Peran Inventori,\nGambar, Files Tambahan]
  PisauFields --> ValPisau{Validasi?}
  ValPisau -->|❌ Wajib kosong| PisauForm
  ValPisau -->|✅ Lolos| SavePisau[💾 Simpan ke assets\nkategori=Pisau]
  SavePisau --> RefreshPisau[Refresh Tabel Pisau]
  RefreshPisau --> PisauList

  %% --- Edit Pisau ---
  PisauAction -->|✏️ Edit| PisauForm

  %% --- Detail Pisau ---
  PisauAction -->|👁️ Detail| PisauDetail
  PisauDetail[📄 Detail Pisau] --> PisauDetailTab{Pilih Tab}
  PisauDetailTab -->|📋 Info| InfoPisau[Data Umum + Dimensi\n+ Gambar + Files]
  PisauDetailTab -->|🔄 Riwayat Pinjam| RiwayatPinjamPisau[Riwayat Peminjaman]
  PisauDetailTab -->|📝 Log Perbaikan| LogPerbaikan[Riwayat Maintenance\ndari maintenanceLogs]

  %% --- Log Pisau ---
  PisauAction -->|📝 Log| PisauLog[📋 Log Peminjaman Pisau\nfilter by assetId]

  %% --- Hapus Pisau ---
  PisauAction -->|🗑️ Hapus| DelAsset

  %% --- Pinjam Pisau ---
  PisauAction -->|🔄 Pinjam| CheckPinjamPisau{peranInventori?}
  CheckPinjamPisau -->|Aset / Keduanya + canBorrow| BorrowModal
  CheckPinjamPisau -->|Part saja\ntidak bisa pinjam| PisauTable

  %% ========================================
  %% PEMINJAMAN
  %% ========================================
  PinjamList[📋 Peminjaman — Semua Aktif]
  PinjamList --> FilterPinjam{Filter Status}
  FilterPinjam -->|Dipinjam| ShowDipinjam[Asset dengan\nstatusPinjam=Dipinjam]
  FilterPinjam -->|Terlambat| ShowTerlambat[Asset dengan\nstatusPinjam=Terlambat]
  FilterPinjam -->|Semua Aktif| ShowAllPinjam[Dipinjam + Terlambat]

  ShowDipinjam --> PinjamTable[📋 Tabel Peminjaman]
  ShowTerlambat --> PinjamTable
  ShowAllPinjam --> PinjamTable

  PinjamTable --> PinjamAction{Aksi}
  PinjamAction -->|👁️ Detail| CheckKatDetail
  PinjamAction -->|🔄 Kembali| ReturnModal
  PinjamAction -->|📌 Pinjam Baru| BorrowModal

  %% ========================================
  %% FORM PEMINJAMAN / PENGEMBALIAN
  %% ========================================
  BorrowModal[📝 BorrowModal]

  %% --- Pinjam ---
  BorrowModal --> TxType{Jenis Transaksi?}
  TxType -->|Pinjam| InputPinjam[Isi Form:\n• Pilih Peminjam*\n• Tanggal Pinjam*\n• Deadline Kembali*\n• Foto Pinjam\n• Sertakan Sparepart?\n• Catatan]

  InputPinjam --> ValPinjam{Validasi?}
  ValPinjam -->|❌ Peminjam kosong| InputPinjam
  ValPinjam -->|✅ Lolos| ProsesPinjam[Proses Pinjam]

  ProsesPinjam --> SetDipinjam[Update assets:\nstatusPinjam=Dipinjam\nnamaPeminjam=selected\ntanggalPinjam=selected]
  SetDipinjam --> AddSparepart{Ada sparepart\nterlampir?}
  AddSparepart -->|Ya| PinjamSparepart[Update sparepart:\nstatusPinjam=Dipinjam\nnamaPeminjam=sama]
  AddSparepart -->|Tidak| SkipSparepart
  PinjamSparepart --> InsertLog
  SkipSparepart --> InsertLog

  InsertLog[INSERT borrowLogs:\nassetId, kodeSurat=SJ-PJM-xxxx,\nnamaPeminjam, tanggalPinjam,\ndeadlineKembali, status=Dipinjam,\ncatatan]
  InsertLog --> RefreshAll[Refresh UI\nassets + borrowLogs]
  RefreshAll --> MainNav

  %% --- Kembali ---
  TxType -->|Kembali| InputReturn[Isi Form:\n• Tanggal Pinjam (koreksi?)*\n• Tanggal Kembali Aktual*\n• Foto Kembali\n• Daftar Sparepart dikembalikan\n• Catatan]

  InputReturn --> ProsesReturn[Proses Kembali]

  ProsesReturn --> SetTersedia[Update assets:\nstatusPinjam=Tersedia\nkosongkan peminjam]
  SetTersedia --> ReturnSparepart{Ada sparepart\ndikembalikan?}
  ReturnSparepart -->|Ya| UpdateSparepart[Update sparepart:\nstatusPinjam=Tersedia\nkosongkan peminjam]
  ReturnSparepart -->|Tidak| SkipReturnSparepart
  UpdateSparepart --> CloseLog
  SkipReturnSparepart --> CloseLog

  CloseLog[UPDATE borrowLogs aktif:\nstatus=Dikembalikan\ntanggalKembali=selected]
  CloseLog --> RefreshAll

  %% ========================================
  %% PERAWATAN / MAINTENANCE
  %% ========================================
  MaintenanceList[🔧 Perawatan — List + Jadwal]

  MaintenanceList --> MaintTab{Pilih Tab}
  MaintTab -->|📋 Log Perawatan| MaintLog[📋 Tabel Maintenance Logs]
  MaintTab -->|📅 Jadwal Perawatan| JadwalList[📅 Daftar Jadwal\ndari semua aset]

  %% --- Filter Log ---
  MaintLog --> FilterMaint{Filter Status}
  FilterMaint -->|Semua| ShowAllMaint
  FilterMaint -->|Perlu Diperbaiki| ShowNeedFix
  FilterMaint -->|Dalam Perbaikan| ShowInProgress
  FilterMaint -->|Selesai| ShowDone

  ShowAllMaint --> MaintTable[📋 Tabel Log]
  ShowNeedFix --> MaintTable
  ShowInProgress --> MaintTable
  ShowDone --> MaintTable

  %% --- Jadwal Status ---
  JadwalList --> CheckJadwal{Status Jadwal}
  CheckJadwal -->|overdue\nterlewat| JadwalOverdue[🔴 Merah — Terlewat]
  CheckJadwal -->|dueSoon\n≤7 hari| JadwalSoon[🟡 Kuning — Segera]
  CheckJadwal -->|upcoming\n>7 hari| JadwalOK[🟢 Hijau — Aman]
  CheckJadwal -->|none\ntidak ada jadwal| JadwalNone[⚪ Tidak Ada]

  %% --- Aksi Maintenance ---
  MaintTable --> MaintAction{Pilih Aksi}
  MaintAction -->|➕ Log Baru| MaintenanceForm

  %% --- Detail Log ---
  MaintAction -->|👁️ Detail| MaintenanceLogDetail
  MaintenanceLogDetail[📄 Detail Log Perawatan] --> LogInfo[Informasi:\nPIC, Tanggal, Lokasi,\nVendor, Status, Foto,\nCatatan, Kendala]
  MaintenanceLogDetail -->|📝 Update Status| MaintenanceForm

  %% --- Form Maintenance ---
  MaintenanceForm[📝 Form Maintenance] --> PilihAssetMaint{Pilih Aset}
  PilihAssetMaint --> InputMaint[Isi Form:\n• Aset*\n• PIC*\n• Tanggal Mulai*\n• Estimasi Selesai\n• Lokasi (Internal/Eksternal)\n• Vendor (jika eksternal)\n• Status Perawatan*\n• Foto\n• Catatan\n• Kendala]

  InputMaint --> CheckLokasi{Lokasi?}
  CheckLokasi -->|Internal| InternalFields[Cukup PIC + Catatan]
  CheckLokasi -->|Eksternal| VendorFields[Pilih Vendor +\nTanggal Kirim +\nTanggal Diterima]

  InternalFields --> SaveMaint
  VendorFields --> SaveMaint

  SaveMaint[💾 Simpan Maintenance Log] --> UpdateAssetMaint[Update assets:\nstatusPerawatan = selected\nkondisi = (jika perlu)]
  UpdateAssetMaint --> RefreshMaint[Refresh Tabel Maintenance]
  RefreshMaint --> MaintenanceList

  %% --- Jadwal Perawatan dari Detail Aset ---
  JadwalTab --> AturJadwal[Atur:\n• jadwalMaintenance (tanggal)\n• intervalMaintenanceHari]
  AturJadwal --> SimpanJadwal[Simpan ke assets]
  SimpanJadwal --> RefreshAll

  %% ========================================
  %% STATUS TRANSITIONS
  %% ========================================
  subgraph StatusFlow["📊 Status Transitions"]
    direction LR
    SA[statusPinjam:\nTersedia] -->|Pinjam| SB[Dipinjam]
    SB -->|Kembali| SA
    SB -->|Deadline lewat| SC[Terlambat]
    SC -->|Kembali| SA
    SC -.->|⚠️ Overdue check| SC
  end

  subgraph KondisiFlow["🔧 Kondisi Transitions"]
    direction LR
    KA[Kondisi Baik] -->|Dalam Perbaikan| KB[Dalam Perbaikan]
    KB -->|Selesai Diperbaiki| KA
    KB -->|Rusak| KC[Rusak]
    KA -.->|Normal| KA
  end

  subgraph MaintenanceFlow["🛠️ Status Perawatan"]
    direction LR
    MA[Normal] -->|Ada masalah| MB[Perlu Diperbaiki]
    MB -->|Mulai repair| MC[Dalam Perbaikan]
    MC -->|Selesai| MD[Selesai Diperbaikan]
    MD -->|Reset| MA
    MC -->|Tunda| ME[Tertunda]
    ME -->|Lanjut| MC
    ME -->|Batal| MF[Dibatalkan]
    MF -.->|Reset| MA
  end

  %% ========================================
  %% KONDISI KHUSUS PISAU
  %% ========================================
  subgraph PisauRoles["🎭 Peran Inventori Pisau"]
    direction TB
    PR{peranInventori?}
    PR -->|Aset| PA[✅ Bisa dipinjam\n✅ Bisa diperbaiki\n✅ Muncul di tab Aset]
    PR -->|Part| PP[❌ Tidak bisa dipinjam\n✅ Bahan kalkulasi / BOM\n✅ Muncul di tab Sparepart]
    PR -->|Keduanya| PK[✅ Bisa dipinjam\n✅ Bahan kalkulasi\n✅ Muncul di kedua tab]
  end

  %% ========================================
  %% CAN BORROW LOGIC
  %% ========================================
  subgraph BorrowLogic["🔒 canBorrow Logic"]
    direction TB
    CB{kategori?}
    CB -->|Aset| CanYes[✅ Bisa Pinjam]
    CB -->|Sparepart| CanYes2[✅ Bisa Pinjam]
    CB -->|Pisau| CB2{peranInventori?}
    CB2 -->|Aset / Keduanya| CanYes3[✅ Bisa Pinjam]
    CB2 -->|Part| CanNo[❌ Tidak Bisa Pinjam]
  end

  %% ========================================
  %% DEPRESIASI
  %% ========================================
  subgraph Depresiasi["💰 Hitung Depresiasi"]
    direction TB
    DD{depresiasiType?}
    DD -->|Persen| DP[depTahunan = hargaBeli × nilai% / 100]
    DD -->|Nominal| DN[depTahunan = nilai (flat)]
    DP --> DTable[Loop 1..masaManfaat:\nsisa = hargaBeli - akumulasi]
    DN --> DTable
    DTable --> DResult[Tabel:\nTahun | Depresiasi | Akumulasi | Sisa]
  end

  %% ========================================
  %% FILTER LOGIC
  %% ========================================
  subgraph FilterLogic["🔍 Filter Logic"]
    direction TB
    FL{filter = ?}
    FL -->|Semua| FLA[Tampilkan semua]
    FL -->|Aset| FLB[kategori=Aset\natau (Pisau + peranAset)]
    FL -->|Sparepart| FLC[kategori=Sparepart\natau (Pisau + peranPart)]
    FL -->|Pisau| FLD[kategori=Pisau]
  end

  %% ========================================
  %% LOKASI GUDANG
  %% ========================================
  subgraph GudangLogic["🏢 Gudang Logic"]
    direction TB
    GL{pemilikAsset?}
    GL -->|Internal Wajib| GH1[Gudang Kantor Pusat\nGudang IT Internal\nGudang Umum]
    GL -->|TKI| GH2[Gudang Utama TKI\nGudang Logistik TKI\nGudang Transit TKI]
    GL -->|FTP| GH3[Gudang Utama FTP\nGudang Sparepart FTP\nGudang Bahan Baku FTP]
    GH1 --> GL2[Setelah pilih gudang:\nIsi Area, Rak, Box]
    GH2 --> GL2
    GH3 --> GL2
  end

  %% ========================================
  %% KEYBOARD SHORTCUTS (optional)
  %% ========================================
  Beranda -.-> MainNav
  Pengaturan -.-> MainNav

  %% ========================================
  %% STYLING
  %% ========================================
  classDef menu fill:#3b82f6,stroke:#1e40af,color:#fff,font-weight:bold
  classDef form fill:#f59e0b,stroke:#d97706,color:#000
  classDef action fill:#10b981,stroke:#059669,color:#fff
  classDef modal fill:#8b5cf6,stroke:#6d28d9,color:#fff
  classDef decision fill:#fbbf24,stroke:#f59e06,color:#000
  classDef status fill:#ef4444,stroke:#dc2626,color:#fff
  classDef info fill:#06b6d4,stroke:#0891b2,color:#fff
  classDef subgraph fill:#f8fafc,stroke:#94a3b8

  class Start,MainNav,menu menu
  class AsetForm,PisauForm,BorrowModal,ReturnModal,MaintenanceForm form
  class SaveAset,SavePisau,InsertLog,CloseLog,SetDipinjam,SetTersedia,SaveMaint action
  class BorrowModal,DownloadModal modal
  class FilterKategori,TxType,CheckKatEdit,CheckKatDetail,ValAset,ValPisau,ValPinjam,CheckLokasi,CheckJadwal,CheckPinjam,CheckPinjamPisau decision
  class StatusFlow,KondisiFlow,MaintenanceFlow,PisauRoles,BorrowLogic,Depresiasi,FilterLogic,GudangLogic subgraph
```
