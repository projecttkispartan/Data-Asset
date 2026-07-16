import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  Settings, 
  Plus, 
  Download, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Clock,
  Building2,
  PackageSearch,
  Barcode,
  UploadCloud,
  CornerDownLeft,
  Eye,
  Info,
  MapPin,
  Camera,
  ShieldAlert,
  Scissors,
  Wrench,
  Bell,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  History,
} from 'lucide-react';
import { formatRp, gudangOptionsByOwner, mockAssets, mockBorrowLogs, mockMaintenanceLogs, matchesKategoriFilter, canBorrow, isAsetRole, isPartRole, getMaintenanceNotifications } from './data/mockData';
import { DataPisauView, PisauDetailModal, PisauLogModal } from './components/PisauView';
import { PisauFormPage } from './components/PisauFormPage';
import { AssetFormPage } from './components/AssetFormPage';
import { PeminjamanView } from './components/PeminjamanView';
import { MaintenanceView, MaintenanceFormModal, MaintenanceDetailModal, JadwalPerawatanTab, JadwalHistoryTimeline, MaintenanceLogList } from './components/MaintenanceView';
import { StatusBadge } from './components/SharedUI';

export default function App() {
  const [activeTab, setActiveTab] = useState('data-aset');
  const [asetPage, setAsetPage] = useState('list'); // list | form
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pisauPage, setPisauPage] = useState('list'); // list | form
  const [showPisauDetail, setShowPisauDetail] = useState(false);
  const [showPisauLog, setShowPisauLog] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showMaintenanceLog, setShowMaintenanceLog] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState(mockAssets);
  const [borrowLogs, setBorrowLogs] = useState(mockBorrowLogs);
  const [maintenanceLogs, setMaintenanceLogs] = useState(mockMaintenanceLogs);

  const handleAddAsset = (newAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleUpdateAsset = (updatedAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));
  };

  const handleDeleteAsset = (id) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setBorrowLogs((prev) => prev.filter((l) => l.assetId !== id));
    setMaintenanceLogs((prev) => prev.filter((l) => l.assetId !== id));
  };

  const handleMaintenanceSave = (log, assetPatch) => {
    setMaintenanceLogs((prev) => [log, ...prev]);
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetPatch.id
          ? {
              ...a,
              statusPerawatan: assetPatch.statusPerawatan,
              ...(assetPatch.kondisi ? { kondisi: assetPatch.kondisi } : {}),
              ...(assetPatch.jadwalMaintenance !== undefined
                ? { jadwalMaintenance: assetPatch.jadwalMaintenance }
                : {}),
              ...(assetPatch.intervalMaintenanceHari !== undefined
                ? { intervalMaintenanceHari: assetPatch.intervalMaintenanceHari }
                : {}),
            }
          : a
      )
    );
    setShowMaintenanceForm(false);
    setSelectedAsset(null);
  };

  const openMaintenanceForm = (asset = null) => {
    setSelectedAsset(asset);
    setShowMaintenanceLog(false);
    setShowMaintenanceForm(true);
  };

  const openMaintenanceLog = (asset) => {
    setSelectedAsset(asset);
    setShowMaintenanceForm(false);
    setShowMaintenanceLog(true);
  };

  const handleBorrowSave = (updatedAsset, meta = {}) => {
    const isReturning = updatedAsset.statusPinjam === 'Tersedia';
    handleUpdateAsset(updatedAsset);

    if (isReturning) {
      setBorrowLogs((prev) =>
        prev.map((log) =>
          log.assetId === updatedAsset.id && (log.status === 'Dipinjam' || log.status === 'Terlambat')
            ? {
                ...log,
                status: 'Dikembalikan',
                tanggalKembali: meta.tanggalKembali || new Date().toISOString().split('T')[0],
                catatan: meta.catatan || log.catatan,
              }
            : log
        )
      );
    } else {
      const kodeSurat = `SJ-PJM-${String(Date.now()).slice(-4)}`;
      setBorrowLogs((prev) => [
        {
          id: Date.now(),
          assetId: updatedAsset.id,
          kodeSurat,
          namaPeminjam: updatedAsset.namaPeminjam,
          tanggalPinjam: updatedAsset.tanggalPinjam,
          deadlineKembali: meta.deadlineKembali || null,
          tanggalKembali: null,
          status: 'Dipinjam',
          catatan: meta.catatan || '',
        },
        ...prev,
      ]);
    }

    setShowBorrowModal(false);
  };

  const openEdit = (asset) => {
    setSelectedAsset(asset);
    if (asset.kategori === 'Pisau') {
      setActiveTab('pisau');
      setPisauPage('form');
      setShowPisauDetail(false);
    } else {
      setActiveTab('data-aset');
      setAsetPage('form');
      setShowDetailModal(false);
    }
  };

  const openDetail = (asset) => {
    setSelectedAsset(asset);
    if (asset.kategori === 'Pisau') {
      setShowPisauDetail(true);
    } else {
      setShowDetailModal(true);
    }
  };

  const goToPisauList = () => {
    setPisauPage('list');
    setSelectedAsset(null);
  };

  const goToAsetList = () => {
    setAsetPage('list');
    setSelectedAsset(null);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab !== 'pisau') setPisauPage('list');
    if (tab !== 'data-aset') setAsetPage('list');
  };

  const isFormPage =
    (activeTab === 'pisau' && pisauPage === 'form') ||
    (activeTab === 'data-aset' && asetPage === 'form');

  const breadcrumbLabel =
    activeTab === 'data-aset'
      ? (asetPage === 'form'
        ? (selectedAsset && selectedAsset.kategori !== 'Pisau' ? 'Ubah Aset' : 'Tambah Aset')
        : 'Data Aset')
      : activeTab === 'pisau'
        ? (pisauPage === 'form' ? (selectedAsset?.kategori === 'Pisau' ? 'Ubah Pisau' : 'Tambah Pisau') : 'Pisau')
        : activeTab === 'peminjaman' ? 'Peminjaman'
          : activeTab === 'perawatan' ? 'Perawatan'
            : activeTab === 'pengaturan' ? 'Pengaturan' : 'Beranda';

  const maintenanceNotifs = getMaintenanceNotifications(assets);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`h-16 flex items-center border-b border-slate-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <span className={`font-bold text-blue-600 tracking-tight ${isSidebarCollapsed ? 'text-lg' : 'text-xl'}`}>
            {isSidebarCollapsed ? 'A' : 'Aset'}<span className="text-slate-800">{isSidebarCollapsed ? '' : 'Ku'}</span>
          </span>
        </div>
        <div className="p-2 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className="w-full flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title={isSidebarCollapsed ? 'Buka sidebar' : 'Sembunyikan sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <NavItem collapsed={isSidebarCollapsed} icon={<LayoutDashboard size={20} />} label="Beranda" active={activeTab === 'beranda'} onClick={() => switchTab('beranda')} />
          <NavItem collapsed={isSidebarCollapsed} icon={<Box size={20} />} label="Data Aset & Sparepart" active={activeTab === 'data-aset'} onClick={() => switchTab('data-aset')} />
          <NavItem collapsed={isSidebarCollapsed} icon={<Scissors size={20} />} label="Pisau" active={activeTab === 'pisau'} onClick={() => switchTab('pisau')} />
          <NavItem collapsed={isSidebarCollapsed} icon={<Wrench size={20} />} label="Perawatan" active={activeTab === 'perawatan'} onClick={() => switchTab('perawatan')} />
          <NavItem collapsed={isSidebarCollapsed} icon={<Settings size={20} />} label="Pengaturan" active={activeTab === 'pengaturan'} onClick={() => switchTab('pengaturan')} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {!isFormPage && (
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
            <div className="flex items-center text-sm text-slate-500">
              <span>Beranda</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-slate-800">{breadcrumbLabel}</span>
            </div>
            <div className="flex items-center gap-3 relative">
              <button
                type="button"
                onClick={() => setShowNotifPanel((v) => !v)}
                className="relative p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                title="Notifikasi maintenance"
              >
                <Bell size={18} />
                {maintenanceNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {maintenanceNotifs.length}
                  </span>
                )}
              </button>
              {showNotifPanel && (
                <div className="absolute right-12 top-full mt-2 w-[360px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Notifikasi Maintenance</p>
                      <p className="text-[11px] text-slate-500">Jadwal pemeliharaan yang perlu ditindaklanjuti</p>
                    </div>
                    <button type="button" onClick={() => setShowNotifPanel(false)} className="text-slate-400 text-lg leading-none hover:text-slate-600">&times;</button>
                  </div>
                  <div className="max-h-[22rem] overflow-y-auto p-2 space-y-2">
                    {maintenanceNotifs.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                        <p className="text-xs text-slate-500">Tidak ada jadwal yang jatuh tempo.</p>
                      </div>
                    ) : (
                      maintenanceNotifs.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            const asset = assets.find((a) => a.id === n.assetId);
                            setShowNotifPanel(false);
                            switchTab('perawatan');
                            if (asset) openMaintenanceForm(asset);
                          }}
                          className="w-full text-left rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-orange-200 hover:bg-orange-50/60 transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <span className={`mt-0.5 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              n.urgency === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {n.urgency === 'overdue' ? 'Terlewat' : 'Segera'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-800 truncate">{n.kode} · {n.nama}</p>
                              <p className="text-[11px] text-slate-500 mt-1">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">Jadwal: {n.jadwalMaintenance}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifPanel(false);
                      switchTab('perawatan');
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border-t border-orange-100"
                  >
                    Buka modul Perawatan
                  </button>
                </div>
              )}
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                AD
              </div>
            </div>
          </header>
        )}

        <div className={`flex-1 overflow-y-auto ${isFormPage ? 'p-0' : 'p-8'}`}>
          {activeTab === 'data-aset' && asetPage === 'list' && (
            <DataAsetView 
              assets={assets}
              onAdd={() => {
                setSelectedAsset(null);
                setAsetPage('form');
              }} 
              onEdit={openEdit}
              onBorrow={(asset) => {
                setSelectedAsset(asset);
                setShowBorrowModal(true);
              }}
              onViewDetail={openDetail}
              onDelete={handleDeleteAsset}
              onDownload={() => setShowDownloadModal(true)}
            />
          )}

          {activeTab === 'data-aset' && asetPage === 'form' && (
            <AssetFormPage
              key={selectedAsset?.id || 'new-aset'}
              assetToEdit={selectedAsset && selectedAsset.kategori !== 'Pisau' ? selectedAsset : null}
              onClose={goToAsetList}
              onSave={(saved) => {
                if (selectedAsset && selectedAsset.kategori !== 'Pisau' && selectedAsset.id === saved.id) {
                  handleUpdateAsset(saved);
                } else {
                  handleAddAsset(saved);
                }
                goToAsetList();
              }}
            />
          )}

          {activeTab === 'pisau' && pisauPage === 'list' && (
            <DataPisauView
              assets={assets}
              onAdd={() => {
                setSelectedAsset(null);
                setPisauPage('form');
              }}
              onEdit={(pisau) => {
                setSelectedAsset(pisau);
                setPisauPage('form');
              }}
              onDelete={handleDeleteAsset}
              onBorrow={(asset) => {
                setSelectedAsset(asset);
                setShowBorrowModal(true);
              }}
              onViewDetail={(pisau) => {
                setSelectedAsset(pisau);
                setShowPisauDetail(true);
              }}
              onViewLogs={(pisau) => {
                setSelectedAsset(pisau);
                setShowPisauLog(true);
              }}
            />
          )}

          {activeTab === 'pisau' && pisauPage === 'form' && (
            <PisauFormPage
              key={selectedAsset?.id || 'new'}
              pisauToEdit={selectedAsset?.kategori === 'Pisau' ? selectedAsset : null}
              onClose={goToPisauList}
              onSave={(saved) => {
                if (selectedAsset?.kategori === 'Pisau' && selectedAsset?.id === saved.id) {
                  handleUpdateAsset(saved);
                } else {
                  handleAddAsset(saved);
                }
                goToPisauList();
              }}
            />
          )}

          {activeTab === 'peminjaman' && (
            <PeminjamanView
              assets={assets}
              onBorrow={(asset) => {
                setSelectedAsset(asset);
                setShowBorrowModal(true);
              }}
              onViewDetail={openDetail}
            />
          )}

          {activeTab === 'perawatan' && (
            <MaintenanceView
              assets={assets}
              maintenanceLogs={maintenanceLogs}
              borrowLogs={borrowLogs}
              onOpenForm={openMaintenanceForm}
              onViewLog={openMaintenanceLog}
            />
          )}

          {(activeTab === 'beranda' || activeTab === 'pengaturan') && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <PackageSearch size={64} className="mb-4 text-slate-300" />
              <p className="text-lg">Modul {activeTab} sedang dalam pengembangan.</p>
            </div>
          )}
        </div>
      </main>

      {showBorrowModal && (
        <BorrowModal 
          asset={selectedAsset} 
          assets={assets} 
          onClose={() => setShowBorrowModal(false)} 
          onSave={handleBorrowSave}
        />
      )}
      
      {showDownloadModal && <DownloadModal onClose={() => setShowDownloadModal(false)} />}
      
      {showDetailModal && selectedAsset?.kategori !== 'Pisau' && (
        <AssetDetailModal
          asset={selectedAsset}
          maintenanceLogs={maintenanceLogs}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            openEdit(selectedAsset);
          }}
          onBorrow={() => {
            setShowDetailModal(false);
            setShowBorrowModal(true);
          }}
          onSaveJadwal={(updated) => {
            handleUpdateAsset(updated);
            setSelectedAsset(updated);
          }}
        />
      )}

      {showPisauDetail && (
        <PisauDetailModal
          asset={selectedAsset}
          borrowLogs={borrowLogs}
          onClose={() => setShowPisauDetail(false)}
          onEdit={() => {
            setShowPisauDetail(false);
            setPisauPage('form');
          }}
          onBorrow={() => {
            setShowPisauDetail(false);
            setShowBorrowModal(true);
          }}
          onSaveJadwal={(updated) => {
            handleUpdateAsset(updated);
            setSelectedAsset(updated);
          }}
        />
      )}

      {showPisauLog && (
        <PisauLogModal
          asset={selectedAsset}
          borrowLogs={borrowLogs}
          onClose={() => setShowPisauLog(false)}
        />
      )}

      {showMaintenanceForm && (
        <MaintenanceFormModal
          assets={assets}
          maintenanceLogs={maintenanceLogs}
          initialAsset={selectedAsset}
          onClose={() => {
            setShowMaintenanceForm(false);
            setSelectedAsset(null);
          }}
          onSave={handleMaintenanceSave}
        />
      )}

      {showMaintenanceLog && selectedAsset && (
        <MaintenanceDetailModal
          asset={selectedAsset}
          maintenanceLogs={maintenanceLogs}
          borrowLogs={borrowLogs}
          onClose={() => {
            setShowMaintenanceLog(false);
            setSelectedAsset(null);
          }}
          onEdit={() => {
            setShowMaintenanceLog(false);
            openEdit(selectedAsset);
          }}
          onUpdatePerbaikan={() => {
            setShowMaintenanceLog(false);
            openMaintenanceForm(selectedAsset);
          }}
          onSaveJadwal={(updated) => {
            handleUpdateAsset(updated);
          }}
        />
      )}
    </div>
  );
}

function DataAsetView({ assets, onAdd, onBorrow, onViewDetail, onDownload, onEdit, onDelete }) {
  const [filterKategori, setFilterKategori] = useState('Semua');

  const filteredAssets = assets.filter(asset => matchesKategoriFilter(asset, filterKategori));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Data Aset & Sparepart</h1>
      </div>

      {/* KARTU RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard title="TOTAL ITEM" value={assets.length} subtitle="Semua terdaftar" icon={<Box className="text-blue-500" />} color="blue" />
        <SummaryCard title="KONDISI BAIK" value={assets.filter(a => a.kondisi === 'Kondisi Baik').length} subtitle="Siap digunakan" icon={<CheckCircle2 className="text-green-500" />} color="green" />
        <SummaryCard title="DIPINJAM" value={assets.filter(a => a.statusPinjam === 'Dipinjam').length} subtitle="Sedang dipakai" icon={<ArrowRightLeft className="text-orange-500" />} color="orange" />
        <SummaryCard title="NILAI ASET" value="Rp 2,0 M" subtitle="Aset Utama" icon={<Building2 className="text-purple-500" />} color="purple" />
        <SummaryCard title="NILAI SPAREPART" value="Rp 400 Jt" subtitle="Total Sparepart" icon={<Box className="text-emerald-500" />} color="green" />
      </div>

      {/* FILTER & AKSI */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          
          <div className="relative w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari atau scan barcode batang..." 
              className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-slate-100 text-slate-500 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Scan Barcode">
               <Barcode size={16} />
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button onClick={() => setFilterKategori('Semua')} className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${filterKategori === 'Semua' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Semua</button>
             <button onClick={() => setFilterKategori('Aset')} className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${filterKategori === 'Aset' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`} title="Aset + Pisau berperan Aset">Aset</button>
             <button onClick={() => setFilterKategori('Sparepart')} className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${filterKategori === 'Sparepart' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`} title="Sparepart + Pisau berperan Part">Sparepart / Part</button>
             <button onClick={() => setFilterKategori('Pisau')} className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${filterKategori === 'Pisau' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Pisau</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDownload} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
            <Download size={16} /> Unduh Data
          </button>
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Plus size={16} /> Aset Baru
          </button>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-center w-12">No</th>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Pemilik Aset</th>
              <th className="px-4 py-3">Lokasi (Gudang / Rak / Box)</th>
              <th className="px-4 py-3">Status Peminjaman</th>
              <th className="px-4 py-3">Nama Peminjam</th>
              <th className="px-4 py-3">Tanggal Pinjam</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.map((asset, index) => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-center text-slate-500 font-medium">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                    {(asset.fotoUtama || asset.gambar) ? (
                      <img src={asset.fotoUtama || asset.gambar} alt={asset.tipe} className="w-full h-full object-cover animate-fade-in" />
                    ) : (
                      <Camera size={18} className="text-slate-400" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-800 font-medium">{asset.tipe}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider w-fit ${
                      asset.kategori === 'Sparepart' ? 'bg-purple-100 text-purple-700' :
                      asset.kategori === 'Pisau' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {asset.kategori}
                    </span>
                    {asset.kategori === 'Pisau' && (
                      <span className="text-[10px] text-slate-500">
                        {asset.peranInventori || 'Keduanya'}
                        {isAsetRole(asset) && isPartRole(asset) ? ' · dual link' : isAsetRole(asset) ? ' · aset' : ' · part'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600 font-bold">{asset.kode}</td>
                <td className="px-4 py-3 text-slate-700 text-sm font-semibold">{asset.pemilikAsset}</td>
                <td className="px-4 py-3 text-slate-700 text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" /> {asset.gudang}
                    </span>
                    {(asset.area || asset.rak || asset.box) && (
                      <span className="text-[10px] text-slate-500 pl-4 mt-0.5">
                        {asset.area ? `Area: ${asset.area}` : ''}
                        {asset.rak ? ` • Rak: ${asset.rak}` : ''}
                        {asset.box ? ` • Box: ${asset.box}` : ''}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge type="peminjaman" status={asset.statusPinjam} />
                </td>
                <td className="px-4 py-3 text-slate-700 text-sm">{asset.namaPeminjam || '-'}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">{asset.tanggalPinjam || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <button onClick={() => onViewDetail(asset)} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border-r border-slate-200 transition-colors" title="Lihat Detail">
                      <Eye size={16} />
                    </button>
                    {asset.statusPinjam === 'Tersedia' && canBorrow(asset) && (
                      <button onClick={() => onBorrow(asset)} className="p-2 text-blue-600 hover:bg-blue-50 border-r border-slate-200 transition-colors" title="Pinjam Aset">
                        <ArrowRightLeft size={16} />
                      </button>
                    )}
                    {(asset.statusPinjam === 'Dipinjam' || asset.statusPinjam === 'Terlambat') && canBorrow(asset) && (
                      <button onClick={() => onBorrow(asset)} className="p-2 text-orange-600 hover:bg-orange-50 border-r border-slate-200 transition-colors" title="Kembalikan Aset">
                        <CornerDownLeft size={16} />
                      </button>
                    )}
                    <button onClick={() => onEdit(asset)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 border-r border-slate-200 transition-colors" title="Edit Data">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(asset.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus Data">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssetDetailModal({ asset, maintenanceLogs, onClose, onEdit, onBorrow, onSaveJadwal }) {
  const [showDepreciation, setShowDepreciation] = useState(false);
  const [tab, setTab] = useState('info');

  const itemLogs = useMemo(() => {
    if (!asset) return [];
    return (maintenanceLogs || [])
      .filter((l) => l.assetId === asset.id)
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }, [maintenanceLogs, asset]);

  if (!asset) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-5xl my-8 flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">{asset.nama}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 text-2xl leading-none">&times;</button>
        </div>

        <div className="px-8 pt-3 bg-white border-b border-slate-200">
          <div className="flex gap-1">
            {[
              ['info', 'Informasi'],
              ['jadwal', 'Jadwal & Perawatan'],
              ['pinjam', 'Riwayat Pinjam'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-1">
          {tab === 'info' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-700">Informasi Umum & Lokasi</h3>
              <button onClick={onEdit} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                <Edit size={14} /> Ubah
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="col-span-1 md:col-span-2 flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                  <div className="w-24 h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {(asset.fotoUtama || asset.gambar) ? (
                      <img src={asset.fotoUtama || asset.gambar} alt={asset.nama} className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={32} className="text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">{asset.nama}</h4>
                    <p className="text-xs font-mono text-slate-500 mt-0.5 font-bold text-blue-700">{asset.kode}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge type="kondisi" status={asset.kondisi} />
                      {canBorrow(asset) ? (
                        <StatusBadge type="peminjaman" status={asset.statusPinjam} />
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Part-only</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Nama</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.nama}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Kondisi</span>
                  <span className="col-span-2"><StatusBadge type="kondisi" status={asset.kondisi} /></span>
                </div>
                <div className="col-span-1 md:col-span-2 rounded-xl border border-orange-100 bg-orange-50/60 px-3.5 py-2.5 text-xs text-orange-900">
                  Update perbaikan aktif di menu <span className="font-semibold">Perawatan</span>. Jadwal diatur di tab <span className="font-semibold">Jadwal & Perawatan</span>.
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Peran Inventori</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.peranInventori || asset.tipe || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Status Pinjam</span>
                  <span className="col-span-2">{canBorrow(asset) ? <StatusBadge type="peminjaman" status={asset.statusPinjam} /> : <span className="text-slate-400 text-xs">Tidak dipinjamkan (Part only)</span>}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">No. Seri</span>
                  <span className="font-mono text-slate-800 col-span-2">{asset.noSeri || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">No. Registrasi</span>
                  <span className="font-mono text-slate-800 col-span-2">{asset.noRegistrasi || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Vendor</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.vendor || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Nilai / Harga Beli</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.hargaBeli ? formatRp(asset.hargaBeli) : '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Tanggal Pembelian</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.tanggalBeli || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Masa Garansi</span>
                  <span className="font-semibold text-rose-700 col-span-2 flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded border border-rose-100 max-w-max">
                    <ShieldAlert size={14} /> {asset.tanggalGaransi || 'Tidak Ada Garansi / Expired'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3 col-span-1 md:col-span-2">
                  <span className="text-slate-500 col-span-1 font-semibold">Penempatan Lokasi</span>
                  <div className="col-span-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                      <MapPin size={16} className="text-red-500" /> {asset.gudang || '-'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium">
                        Area: <strong className="text-slate-900">{asset.area || '-'}</strong>
                      </span>
                      <span className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium">
                        Rak: <strong className="text-slate-900">{asset.rak || '-'}</strong>
                      </span>
                      <span className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium">
                        Box: <strong className="text-slate-900">{asset.box || '-'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Ukuran</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.panjang ? `${asset.panjang}×${asset.lebar}×${asset.tinggi} mm` : '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Laminasi</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.laminasi || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Mata Pisau</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.jumlahMata || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Unit</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.unit || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Merek</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.merk || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Produk</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.produk || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Bahan Baku</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.bahanBaku || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 col-span-1">Fungsi</span>
                  <span className="font-medium text-slate-800 col-span-2">{asset.fungsi?.length ? asset.fungsi.join(', ') : '-'}</span>
                </div>
                {(asset.kategori === 'Aset' || asset.kategori === 'Sparepart') && (
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Depresiasi</span>
                    <span className="font-medium text-slate-800 col-span-2 flex items-center gap-2">
                      {asset.depresiasiType === 'Persen' ? `${asset.depresiasiValue || 0}% / thn` : (asset.depresiasiValue ? formatRp(asset.depresiasiValue) : '-')}
                      <button onClick={() => setShowDepreciation(true)} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full transition-colors" title="Lihat Tabel Depresiasi">
                        <Info size={16} />
                      </button>
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3 col-span-1 md:col-span-2">
                  <span className="text-slate-500 col-span-1">Catatan</span>
                  <span className="font-medium text-slate-800 col-span-2 bg-slate-100 p-2.5 rounded-lg border">{asset.catatan || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {tab === 'jadwal' && (
            <div className="space-y-4">
              <JadwalPerawatanTab
                asset={asset}
                onSave={(updated) => {
                  onSaveJadwal?.(updated);
                }}
              />
              <JadwalHistoryTimeline asset={asset} logs={itemLogs} />
              {/* Log perawatan */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                  <History size={16} className="text-orange-600" />
                  <h3 className="text-sm font-bold text-slate-700">Riwayat Perbaikan</h3>
                </div>
                <div className="p-5">
                  <MaintenanceLogList logs={itemLogs} />
                </div>
              </div>
            </div>
          )}

          {tab === 'pinjam' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-700">Riwayat Peminjaman</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                  <HistoryIcon size={14} /> Lihat Semua
                </button>
                {asset.statusPinjam === 'Dipinjam' && (
                  <button onClick={onBorrow} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white border border-orange-600 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors">
                    Kembalikan / Koreksi Tgl Pinjam
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              {asset.statusPinjam === 'Tersedia' ? (
                <div className="text-center text-slate-500 py-8 text-sm">Belum ada riwayat peminjaman aktif saat ini.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3 items-center">
                    <span className="text-slate-500 col-span-1">Peminjam</span>
                    <span className="font-medium text-slate-800 col-span-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {asset.namaPeminjam?.substring(0,2).toUpperCase()}
                      </div>
                      {asset.namaPeminjam}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Tanggal Pinjam</span>
                    <span className="font-bold text-blue-600 col-span-2">{asset.tanggalPinjam || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 col-span-1">Status</span>
                    <span className="col-span-2"><StatusBadge type="peminjaman" status={asset.statusPinjam} /></span>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        <div className="px-8 py-4 border-t border-slate-200 flex justify-end bg-white sticky bottom-0 z-10">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            Kembali
          </button>
        </div>
      </div>

      {showDepreciation && (
        <DepreciationModal 
           hargaBeli={asset.hargaBeli} 
           jenis={asset.depresiasiType} 
           nilai={asset.depresiasiValue} 
           masa={asset.masaManfaat || 5} 
           tahunBeli={parseInt(asset.tanggalBeli?.split('-')[0]) || 2020}
           onClose={() => setShowDepreciation(false)} 
        />
      )}
    </div>
  );
}

function DepreciationModal({ hargaBeli, jenis, nilai, masa, tahunBeli, onClose }) {
  const rows = [];
  let currentHarga = hargaBeli;
  let akumulasi = 0;
  let depTahunan = jenis === 'Persen' ? (hargaBeli * nilai / 100) : nilai;

  rows.push({ no: '', tahun: `Awal (${tahunBeli})`, depTahunan: 0, akumulasi: 0, sisa: hargaBeli });

  for(let i = 1; i <= masa; i++) {
     akumulasi += depTahunan;
     currentHarga -= depTahunan;
     if(currentHarga < 0) currentHarga = 0;
     rows.push({ no: i, tahun: tahunBeli + i, depTahunan, akumulasi, sisa: currentHarga });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h3 className="text-sm font-bold text-slate-800">Detail Depresiasi</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-xl leading-none">&times;</button>
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
                    <td className="px-4 py-3 border-r border-slate-200 font-medium text-slate-700">{row.tahun}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-600">{row.depTahunan === 0 ? '-' : formatRp(row.depTahunan)}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-600">{formatRp(row.akumulasi)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {formatRp(row.sisa)} {idx === rows.length - 1 && <span className="text-[10px] text-slate-400 font-normal ml-1">(Nilai Sisa)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function BorrowModal({ asset, assets, onClose, onSave }) {
  const isReturning = asset && (asset.statusPinjam === 'Dipinjam' || asset.statusPinjam === 'Terlambat');

  const [isMainNoJadwal, setIsMainNoJadwal] = useState(false);
  const [sparepartsList, setSparepartsList] = useState([]);
  
  const [tanggalPinjam, setTanggalPinjam] = useState(
    asset?.tanggalPinjam || new Date().toISOString().split('T')[0]
  );
  const [deadlineKembali, setDeadlineKembali] = useState('');
  const [tanggalKembali, setTanggalKembali] = useState(
    isReturning ? new Date().toISOString().split('T')[0] : ''
  );
  
  const [peminjam, setPeminjam] = useState(asset?.namaPeminjam || "");
  const [catatan, setCatatan] = useState("");

  if (!asset) return null;

  const handleAddSparepart = (e) => {
    const spId = e.target.value;
    if (!spId) return;
    const spData = assets.find(a => a.id === parseInt(spId));
    if (spData && !sparepartsList.find(s => s.id === spData.id)) {
      setSparepartsList([...sparepartsList, {
        ...spData,
        tglPinjam: new Date().toISOString().split('T')[0],
        tglKembali: '',
        belumAdaJadwal: false
      }]);
    }
  };

  const handleRemoveSparepart = (id) => setSparepartsList(sparepartsList.filter(s => s.id !== id));
  const updateSparepart = (id, field, value) => setSparepartsList(sparepartsList.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleActionSubmit = () => {
    if (!peminjam && !isReturning) {
      alert("Mohon pilih karyawan/departemen peminjam.");
      return;
    }

    const updatedAsset = {
      ...asset,
      statusPinjam: isReturning ? 'Tersedia' : 'Dipinjam',
      namaPeminjam: isReturning ? null : peminjam,
      tanggalPinjam: isReturning ? null : tanggalPinjam,
      catatanPinjam: catatan
    };

    onSave(updatedAsset, {
      deadlineKembali: isMainNoJadwal ? null : deadlineKembali,
      tanggalKembali: isReturning ? tanggalKembali : null,
      catatan,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[95vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-blue-50 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            {isReturning ? <CornerDownLeft size={20}/> : <ArrowRightLeft size={20}/>} 
            {isReturning ? 'Form Pengembalian Aset (Koreksi & Kembali)' : 'Form Peminjaman Aset'}
          </h2>
          <button onClick={onClose} className="text-blue-400 hover:text-blue-600 text-2xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold">Aset yang Diproses</label>
              <div className="p-3 bg-slate-50 border rounded-lg flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl border flex items-center justify-center overflow-hidden">
                    {(asset.fotoUtama || asset.gambar) ? (
                      <img src={asset.fotoUtama || asset.gambar} alt={asset.nama} className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={16} className="text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{asset.nama}</p>
                    <p className="text-xs font-mono text-slate-500 font-bold">{asset.kode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Penyimpanan asal:</p>
                  <p className="text-xs font-semibold text-blue-700">{asset.gudang} (Area: {asset.area || '-'})</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Peminjam *</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                value={peminjam}
                onChange={(e) => setPeminjam(e.target.value)}
                disabled={isReturning}
              >
                <option value="">Pilih Karyawan/Departemen...</option>
                <option value="Ali Rafsanjani">Ali Rafsanjani (IT)</option>
                <option value="Raisa Mariee">Raisa Mariee (Marketing)</option>
                <option value="Budi (Spindel 2)">Budi (Spindel 2)</option>
                <option value="Andi (Spindel 1)">Andi (Spindel 1)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold text-blue-700">
                Tanggal Dipinjam {isReturning && '(Koreksi Jika Salah) *'}
              </label>
              <input 
                type="date" 
                className="w-full p-2.5 border border-blue-300 bg-blue-50/50 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" 
                value={tanggalPinjam}
                onChange={(e) => setTanggalPinjam(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                <span>Perkiraan Kembali *</span>
                <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={isMainNoJadwal} onChange={(e)=>setIsMainNoJadwal(e.target.checked)}/> Belum jadwal</label>
              </label>
              <input type="date" disabled={isMainNoJadwal} value={isMainNoJadwal ? '' : deadlineKembali} onChange={(e) => setDeadlineKembali(e.target.value)} className="w-full p-2.5 border rounded-lg disabled:bg-slate-100" />
            </div>

            <div className={isReturning ? "opacity-100" : "opacity-50"}>
              <label className="block text-sm font-bold text-emerald-700 mb-1">Tgl Kembali (Aktual)</label>
              <input type="date" className="w-full p-2.5 border border-emerald-300 bg-emerald-50 rounded-lg" value={tanggalKembali} onChange={(e) => setTanggalKembali(e.target.value)} disabled={!isReturning} />
            </div>

            <div className="md:col-span-3 mt-2 grid grid-cols-2 gap-6">
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center bg-slate-50"><UploadCloud className="text-slate-400 mb-2" size={28}/><p className="text-sm font-bold">Foto Pinjam</p></div>
               <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center ${isReturning?'border-emerald-300 bg-emerald-50':'border-slate-300 bg-slate-50 opacity-60'}`}><UploadCloud size={28}/><p className="text-sm font-bold">Foto Kembali</p></div>
            </div>

            <div className="md:col-span-3 mt-4 pt-4 border-t border-slate-200">
               <label className="block text-sm font-bold text-slate-800 mb-2">{isReturning ? 'Daftar Sparepart / Aksesoris' : 'Sertakan Sparepart / Aksesoris (Opsional)'}</label>
               <select 
                 className="w-full p-2.5 border border-slate-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-blue-500"
                 onChange={handleAddSparepart}
                 value=""
               >
                 <option value="">-- {isReturning ? 'Tambahkan sparepart jika ada yang ikut dikembalikan' : 'Pilih untuk menambahkan sparepart ke peminjaman'} --</option>
                 {assets.filter(a => isPartRole(a) && a.statusPinjam === 'Tersedia').map(sp => (
                   <option key={sp.id} value={sp.id}>{sp.kode} - {sp.nama}{sp.kategori === 'Pisau' ? ' [Pisau-Part]' : ''}</option>
                 ))}
               </select>

               {sparepartsList.length > 0 && (
                 <div className="space-y-3">
                   {sparepartsList.map(sp => (
                     <div key={sp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3 relative shadow-sm">
                        <button onClick={() => handleRemoveSparepart(sp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-white p-1 rounded-md shadow-sm border border-slate-200">
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="pr-10">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-purple-100 text-purple-700">{sp.kategori}</span>
                            <p className="text-sm font-bold text-slate-800 tracking-tight">{sp.kode}</p>
                          </div>
                          <p className="text-xs text-slate-700 font-medium mb-2">{sp.nama}</p>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 bg-white p-2 rounded-lg border border-slate-100">
                            <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Gudang</p><p className="text-xs text-slate-700 font-semibold">{sp.gudang}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Area</p><p className="text-xs text-slate-700 font-medium">{sp.area || '-'}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Rak/Box</p><p className="text-xs text-slate-700 font-medium">{sp.rak || '-'}/{sp.box || '-'}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Kondisi</p><p className={`text-[11px] font-medium ${sp.kondisi === 'Kondisi Baik' ? 'text-green-600' : 'text-red-600'}`}>{sp.kondisi}</p></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 pt-3 border-t border-slate-200 border-dashed">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Tgl Pinjam</label>
                            <input type="date" value={sp.tglPinjam} onChange={(e) => updateSparepart(sp.id, 'tglPinjam', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 flex justify-between">
                              <span>Tgl Kembali</span>
                              <label className="flex items-center gap-1 cursor-pointer normal-case tracking-normal">
                                <input type="checkbox" checked={sp.belumAdaJadwal} onChange={(e) => updateSparepart(sp.id, 'belumAdaJadwal', e.target.checked)} className="rounded text-blue-600 w-3 h-3" />
                                <span className="text-[10px]">Belum ada jadwal</span>
                              </label>
                            </label>
                            <input type="date" disabled={sp.belumAdaJadwal} value={sp.belumAdaJadwal ? '' : sp.tglKembali} onChange={(e) => updateSparepart(sp.id, 'tglKembali', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm disabled:bg-slate-100" />
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <div className="md:col-span-3 mt-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Tambahan</label>
               <textarea 
                 rows="2" 
                 value={catatan}
                 onChange={(e) => setCatatan(e.target.value)}
                 placeholder="Kondisi khusus, kelengkapan yang dibawa..." 
                 className="w-full p-2.5 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
               ></textarea>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t flex justify-end gap-3 rounded-b-2xl bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors bg-white border border-slate-200 rounded-lg">Batal</button>
          <button 
            onClick={handleActionSubmit} 
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors ${isReturning ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100'}`}
          >
            {isReturning ? 'Simpan & Kembalikan' : 'Simpan Peminjaman'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="bg-emerald-50 px-6 py-5 border-b border-emerald-100"><h2 className="text-lg font-bold text-emerald-900">Unduh Laporan Aset</h2></div>
        <div className="p-6">
          <p className="text-sm font-mono bg-slate-50 p-2 border rounded-md">Data_Aset_{new Date().toLocaleDateString('id-ID').replace(/\//g,'_')}.xlsx</p>
        </div>
        <div className="px-6 py-4 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg">Batal</button><button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Unduh</button></div>
      </div>
    </div>
  );
}

// --- KOMPONEN BANTUAN ---
function NavItem({ icon, label, active, onClick, collapsed = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
      title={label}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

function SummaryCard({ title, value, subtitle, icon, color }) {
  const bgColors = { blue: 'bg-blue-50', green: 'bg-emerald-50', orange: 'bg-orange-50', purple: 'bg-purple-50' };
  const borderColors = { blue: 'border-blue-100', green: 'border-emerald-100', orange: 'border-orange-100', purple: 'border-purple-100' };
  return (
    <div className={`p-4 rounded-xl border ${bgColors[color]} ${borderColors[color]}`}>
      <div className="flex justify-between items-start mb-2"><h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{title}</h3><div className="p-1.5 bg-white rounded-lg">{icon}</div></div>
      <div className="text-xl font-bold text-slate-800">{value}</div><div className="text-[10px] text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}

function HistoryIcon({ size }) {
  return <Clock size={size} />;
}
