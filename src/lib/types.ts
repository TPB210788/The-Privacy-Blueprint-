export interface ROPAActivity {
  id: string;
  name: string;
  purpose: string;
  lawfulBasis: string;
  dataSubjects: string;
  personalData: string;
  recipients: string;
  internationalTransfers: boolean;
  transferDetails: string;
  retentionPeriod: string;
  securityMeasures: string;
  dateAdded: string;
  lastReviewed: string;
}

export type ViewMode = 'table' | 'card';
