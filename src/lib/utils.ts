import { ROPAActivity } from './types';

export function isOverdue(lastReviewed: string): boolean {
  if (!lastReviewed) return false;
  const reviewDate = new Date(lastReviewed);
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  return reviewDate < twelveMonthsAgo;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

export function exportToCSV(activities: ROPAActivity[]): void {
  const escape = (v: string) => {
    if (v.includes(',') || v.includes('"') || v.includes('\n')) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };

  const headers = [
    'Activity Name',
    'Purpose',
    'Lawful Basis',
    'Categories of Data Subjects',
    'Categories of Personal Data',
    'Recipients / Third Parties',
    'International Transfers',
    'Transfer Details',
    'Retention Period',
    'Security Measures',
    'Date Added',
    'Last Reviewed',
  ];

  const rows = activities.map(a => [
    escape(a.name),
    escape(a.purpose),
    escape(a.lawfulBasis),
    escape(a.dataSubjects),
    escape(a.personalData),
    escape(a.recipients),
    a.internationalTransfers ? 'Yes' : 'No',
    escape(a.transferDetails),
    escape(a.retentionPeriod),
    escape(a.securityMeasures),
    escape(a.dateAdded),
    escape(a.lastReviewed),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ropa-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
