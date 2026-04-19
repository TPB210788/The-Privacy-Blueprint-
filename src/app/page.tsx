'use client';

import { useState, useEffect, useCallback } from 'react';
import { ROPAActivity, ViewMode } from '@/lib/types';
import { initialActivities } from '@/lib/initialData';
import { exportToCSV } from '@/lib/utils';
import ActivityModal from '@/components/ActivityModal';
import ROPATable from '@/components/ROPATable';
import ROPACards from '@/components/ROPACards';
import ComingSoon from '@/components/ComingSoon';

const STORAGE_KEY = 'tpb-ropa-v1';

const TABS = [
  { id: 'ropa', label: 'ROPA', description: 'Record of Processing Activities' },
  { id: 'dpias', label: 'DPIAs', description: 'Data Protection Impact Assessments' },
  { id: 'dsars', label: 'DSARs', description: 'Data Subject Access Request log and response tracker' },
  { id: 'breach-log', label: 'Breach Log', description: 'Data breach and near-miss incident log' },
  { id: 'vendor-dpa', label: 'Vendor / DPA Register', description: 'Third-party processor register and DPA status tracker' },
  { id: 'lia', label: 'Legitimate Interests Assessments', description: 'LIA documentation for legitimate interests processing' },
  { id: 'consent-log', label: 'Consent Log', description: 'Consent records, source, and withdrawal tracker' },
  { id: 'ico-correspondence', label: 'ICO Correspondence', description: 'ICO registration details and correspondence log' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function Home() {
  const [activities, setActivities] = useState<ROPAActivity[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('ropa');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [editingActivity, setEditingActivity] = useState<ROPAActivity | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActivities(JSON.parse(stored));
      } catch {
        setActivities(initialActivities);
      }
    } else {
      setActivities(initialActivities);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialActivities));
    }
    setMounted(true);
  }, []);

  // Persist whenever activities change (after mount)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities, mounted]);

  const handleSave = useCallback((activity: ROPAActivity) => {
    setActivities(prev =>
      editingActivity
        ? prev.map(a => (a.id === activity.id ? activity : a))
        : [...prev, activity]
    );
    setEditingActivity(null);
    setIsAdding(false);
  }, [editingActivity]);

  const handleDelete = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  }, []);

  const handleMarkReviewed = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setActivities(prev => prev.map(a => a.id === id ? { ...a, lastReviewed: today } : a));
  }, []);

  const openEdit = useCallback((activity: ROPAActivity) => {
    setEditingActivity(activity);
    setIsAdding(false);
  }, []);

  const openAdd = useCallback(() => {
    setEditingActivity(null);
    setIsAdding(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingActivity(null);
    setIsAdding(false);
  }, []);

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0EB', color: '#2C2C2C' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(139,115,85,0.15)' }}
      >
        <div className="max-w-screen-2xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="font-playfair text-lg font-semibold tracking-tight"
              style={{ color: '#8B7355' }}
            >
              The Privacy Blueprint
            </span>
            <span className="hidden sm:block text-charcoal/25 text-sm">|</span>
            <span className="hidden sm:block text-xs text-charcoal/45 uppercase tracking-wider">
              Internal Tool
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Record count */}
            {activeTab === 'ropa' && mounted && (
              <span className="hidden sm:block text-xs text-charcoal/50">
                {activities.length} {activities.length === 1 ? 'record' : 'records'}
              </span>
            )}

            {/* View toggle — only on ROPA tab */}
            {activeTab === 'ropa' && (
              <div
                className="flex items-center rounded border text-xs overflow-hidden"
                style={{ borderColor: 'rgba(139,115,85,0.25)' }}
              >
                <button
                  onClick={() => setViewMode('table')}
                  className="px-3 py-1.5 flex items-center gap-1.5 transition-colors"
                  style={{
                    backgroundColor: viewMode === 'table' ? '#8B7355' : 'transparent',
                    color: viewMode === 'table' ? '#fff' : 'rgba(44,44,44,0.6)',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                    <rect x="0" y="0" width="13" height="3" rx="0.5" />
                    <rect x="0" y="5" width="13" height="3" rx="0.5" />
                    <rect x="0" y="10" width="13" height="3" rx="0.5" />
                  </svg>
                  Table
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className="px-3 py-1.5 flex items-center gap-1.5 transition-colors"
                  style={{
                    backgroundColor: viewMode === 'card' ? '#8B7355' : 'transparent',
                    color: viewMode === 'card' ? '#fff' : 'rgba(44,44,44,0.6)',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                    <rect x="0" y="0" width="5.5" height="5.5" rx="0.75" />
                    <rect x="7.5" y="0" width="5.5" height="5.5" rx="0.75" />
                    <rect x="0" y="7.5" width="5.5" height="5.5" rx="0.75" />
                    <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="0.75" />
                  </svg>
                  Cards
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <nav
        className="border-b overflow-x-auto"
        style={{ borderColor: 'rgba(139,115,85,0.12)', backgroundColor: '#F5F0EB' }}
      >
        <div className="max-w-screen-2xl mx-auto px-5 md:px-8">
          <div className="flex items-end gap-0 whitespace-nowrap">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-4 py-3 text-sm transition-colors border-b-2 -mb-px"
                style={{
                  borderBottomColor: activeTab === tab.id ? '#8B7355' : 'transparent',
                  color: activeTab === tab.id ? '#8B7355' : 'rgba(44,44,44,0.5)',
                  fontWeight: activeTab === tab.id ? 500 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-5 md:px-8 py-6">
        {activeTab === 'ropa' ? (
          <div>
            {/* Actions bar */}
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-playfair text-xl text-charcoal">
                Record of Processing Activities
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportToCSV(activities)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border transition-colors"
                  style={{
                    borderColor: 'rgba(139,115,85,0.25)',
                    color: 'rgba(44,44,44,0.65)',
                  }}
                  title="Export all records as CSV"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                    <path d="M6.5 1v7.5m0 0L4 6m2.5 2.5L9 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none" />
                    <path d="M1 10h11v1.5H1z" rx="0.5" />
                  </svg>
                  Export CSV
                </button>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded transition-colors font-medium"
                  style={{ backgroundColor: '#8B7355', color: '#fff' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M5.25 5.25V1h1.5v4.25H11v1.5H6.75V11h-1.5V6.75H1v-1.5h4.25Z" />
                  </svg>
                  Add Activity
                </button>
              </div>
            </div>

            {/* ROPA view */}
            {!mounted ? (
              <div className="text-center py-16 text-charcoal/35 text-sm">Loading...</div>
            ) : viewMode === 'table' ? (
              <ROPATable
                activities={activities}
                onEdit={openEdit}
                onDelete={setDeletingId}
                onMarkReviewed={handleMarkReviewed}
              />
            ) : (
              <ROPACards
                activities={activities}
                onEdit={openEdit}
                onDelete={setDeletingId}
                onMarkReviewed={handleMarkReviewed}
              />
            )}
          </div>
        ) : (
          <ComingSoon label={activeTabData.label} description={activeTabData.description} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-4 px-5 md:px-8 text-center text-xs"
        style={{
          borderColor: 'rgba(139,115,85,0.12)',
          color: 'rgba(44,44,44,0.4)',
          backgroundColor: '#F5F0EB',
        }}
      >
        The Privacy Blueprint &nbsp;|&nbsp; Internal ROPA &nbsp;|&nbsp; UK GDPR Article 30 &nbsp;|&nbsp; Not for distribution
      </footer>

      {/* ── Modals ── */}
      {(isAdding || editingActivity !== null) && (
        <ActivityModal
          activity={editingActivity}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {deletingId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,44,44,0.4)' }}
          onClick={e => e.target === e.currentTarget && setDeletingId(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg border p-6"
            style={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(139,115,85,0.2)' }}
          >
            <h3 className="font-playfair text-lg text-charcoal mb-2">Delete activity?</h3>
            <p className="text-sm text-charcoal/60 mb-6 leading-relaxed">
              This will permanently remove the record from your ROPA. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm rounded border transition-colors"
                style={{ borderColor: 'rgba(139,115,85,0.25)', color: 'rgba(44,44,44,0.65)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 text-sm rounded font-medium transition-colors"
                style={{ backgroundColor: '#dc2626', color: '#fff' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
