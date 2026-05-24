export interface ReleaseInfo {
  version: string;
  releaseNotes: string;
  apkUrl: string;
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'up_to_date'
  | 'downloading'
  | 'ready_to_install'
  | 'error';
