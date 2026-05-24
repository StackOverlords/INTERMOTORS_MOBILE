import axios from 'axios';

import type { ReleaseInfo } from '../types/updater.types';

const RELEASES_URL =
  'https://api.github.com/repos/StackOverlords/INTERMOTORS_MOBILE/releases/latest';

interface GithubAsset {
  name: string;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name: string;
  body: string;
  assets: GithubAsset[];
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  const { data } = await axios.get<GithubRelease>(RELEASES_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  const apkAsset = data.assets.find((a) => a.name.endsWith('.apk'));
  if (!apkAsset) throw new Error('No APK asset found in latest release');

  return {
    version: data.tag_name.replace(/^v/, ''),
    releaseNotes: data.body ?? '',
    apkUrl: apkAsset.browser_download_url,
  };
}

export function isNewerVersion(remote: string, current: string): boolean {
  const parse = (v: string) => v.split('.').map(Number);
  const [rMaj, rMin, rPatch] = parse(remote);
  const [cMaj, cMin, cPatch] = parse(current);
  return (
    rMaj > cMaj ||
    (rMaj === cMaj && rMin > cMin) ||
    (rMaj === cMaj && rMin === cMin && rPatch > cPatch)
  );
}
