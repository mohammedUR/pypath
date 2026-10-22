import type { Lesson } from './schema';
import { create } from 'zustand';

/**
 * Registry (ADR-0005): lazy loader map id → dynamic import() per lesson.
 * M5 (R-ARC-07): the 258-entry manifest no longer ships inside the JS bundle —
 * it is fetched once from /data/manifest.json and cached in a tiny zustand
 * store, so views re-render when it lands and sync helpers read store state.
 */

export interface ManifestEntry {
  id: string;
  track: string;
  part: 'I' | 'II';
  book: string;
  chapter: number;
  order: number;
  title: { ar: string; en: string };
  prerequisites: string[];
  sources: { book: string; section: string }[];
}

export const manifest: ManifestEntry[] = [];

interface ManifestState {
  ready: boolean;
  hydrate: () => Promise<void>;
}

/** One shared fetch + reactivity signal for all manifest consumers. */
export const useManifestStore = create<ManifestState & { manifest: ManifestEntry[] }>()((set, get) => ({
  manifest: [],
  ready: false,
  hydrate: async () => {
    if (get().ready) return;
    try {
      const res = await fetch('/data/manifest.json');
      const j = (await res.json()) as { lessons: ManifestEntry[] };
      manifest.length = 0;
      manifest.push(...j.lessons);
      set({ manifest: j.lessons, ready: true });
    } catch {
      // Offline/first-run failure: views render their empty states; the next
      // navigation retries (no cache poisoning).
    }
  },
}));

export type LessonResult =
  | { status: 'found'; lesson: Lesson }
  | { status: 'missing' }
  | { status: 'invalid'; reason: string };

type Loader = () => Promise<{ default: unknown }>;

export const loaders: Record<string, Loader> = {
  'py4e.ch1.l1': () => import('../../../content/part1/py4e/ch1/lesson.ch1.l1'),
  'py4e.ch1.l2': () => import('../../../content/part1/py4e/ch1/lesson.ch1.l2'),
  'py4e.ch1.l3': () => import('../../../content/part1/py4e/ch1/lesson.ch1.l3'),
  'py4e.ch1.l4': () => import('../../../content/part1/py4e/ch1/lesson.ch1.l4'),
  'py4e.ch1.l5': () => import('../../../content/part1/py4e/ch1/lesson.ch1.l5'),
  'py4e.ch1.l6': () => import('../../../content/part1/py4e/ch1/lesson.ch1.l6'),
  'py4e.ch2.l1': () => import('../../../content/part1/py4e/ch2/lesson.ch2.l1'),
  'py4e.ch2.l2': () => import('../../../content/part1/py4e/ch2/lesson.ch2.l2'),
  'py4e.ch2.l3': () => import('../../../content/part1/py4e/ch2/lesson.ch2.l3'),
  'py4e.ch2.l4': () => import('../../../content/part1/py4e/ch2/lesson.ch2.l4'),
  'py4e.ch2.l5': () => import('../../../content/part1/py4e/ch2/lesson.ch2.l5'),
  'py4e.ch2.l6': () => import('../../../content/part1/py4e/ch2/lesson.ch2.l6'),
  'py4e.ch3.l1': () => import('../../../content/part1/py4e/ch3/lesson.ch3.l1'),
  'py4e.ch3.l2': () => import('../../../content/part1/py4e/ch3/lesson.ch3.l2'),
  'py4e.ch3.l3': () => import('../../../content/part1/py4e/ch3/lesson.ch3.l3'),
  'py4e.ch3.l4': () => import('../../../content/part1/py4e/ch3/lesson.ch3.l4'),
  'py4e.ch3.l5': () => import('../../../content/part1/py4e/ch3/lesson.ch3.l5'),
  'py4e.ch3.l6': () => import('../../../content/part1/py4e/ch3/lesson.ch3.l6'),
  'py4e.ch4.l1': () => import('../../../content/part1/py4e/ch4/lesson.ch4.l1'),
  'py4e.ch4.l2': () => import('../../../content/part1/py4e/ch4/lesson.ch4.l2'),
  'py4e.ch4.l3': () => import('../../../content/part1/py4e/ch4/lesson.ch4.l3'),
  'py4e.ch4.l4': () => import('../../../content/part1/py4e/ch4/lesson.ch4.l4'),
  'py4e.ch4.l5': () => import('../../../content/part1/py4e/ch4/lesson.ch4.l5'),
  'py4e.ch4.l6': () => import('../../../content/part1/py4e/ch4/lesson.ch4.l6'),
  'py4e.ch5.l1': () => import('../../../content/part1/py4e/ch5/lesson.ch5.l1'),
  'py4e.ch5.l2': () => import('../../../content/part1/py4e/ch5/lesson.ch5.l2'),
  'py4e.ch5.l3': () => import('../../../content/part1/py4e/ch5/lesson.ch5.l3'),
  'py4e.ch5.l4': () => import('../../../content/part1/py4e/ch5/lesson.ch5.l4'),
  'py4e.ch5.l5': () => import('../../../content/part1/py4e/ch5/lesson.ch5.l5'),
  'py4e.ch5.l6': () => import('../../../content/part1/py4e/ch5/lesson.ch5.l6'),
  'py4e.ch6.l1': () => import('../../../content/part1/py4e/ch6/lesson.ch6.l1'),
  'py4e.ch6.l2': () => import('../../../content/part1/py4e/ch6/lesson.ch6.l2'),
  'py4e.ch6.l3': () => import('../../../content/part1/py4e/ch6/lesson.ch6.l3'),
  'py4e.ch6.l4': () => import('../../../content/part1/py4e/ch6/lesson.ch6.l4'),
  'py4e.ch6.l5': () => import('../../../content/part1/py4e/ch6/lesson.ch6.l5'),
  'py4e.ch6.l6': () => import('../../../content/part1/py4e/ch6/lesson.ch6.l6'),
  'py4e.ch7.l1': () => import('../../../content/part1/py4e/ch7/lesson.ch7.l1'),
  'py4e.ch7.l2': () => import('../../../content/part1/py4e/ch7/lesson.ch7.l2'),
  'py4e.ch7.l3': () => import('../../../content/part1/py4e/ch7/lesson.ch7.l3'),
  'py4e.ch7.l4': () => import('../../../content/part1/py4e/ch7/lesson.ch7.l4'),
  'py4e.ch7.l5': () => import('../../../content/part1/py4e/ch7/lesson.ch7.l5'),
  'py4e.ch7.l6': () => import('../../../content/part1/py4e/ch7/lesson.ch7.l6'),
  'py4e.ch8.l1': () => import('../../../content/part1/py4e/ch8/lesson.ch8.l1'),
  'py4e.ch8.l2': () => import('../../../content/part1/py4e/ch8/lesson.ch8.l2'),
  'py4e.ch8.l3': () => import('../../../content/part1/py4e/ch8/lesson.ch8.l3'),
  'py4e.ch8.l4': () => import('../../../content/part1/py4e/ch8/lesson.ch8.l4'),
  'py4e.ch8.l5': () => import('../../../content/part1/py4e/ch8/lesson.ch8.l5'),
  'py4e.ch8.l6': () => import('../../../content/part1/py4e/ch8/lesson.ch8.l6'),
  'py4e.ch9.l1': () => import('../../../content/part1/py4e/ch9/lesson.ch9.l1'),
  'py4e.ch9.l2': () => import('../../../content/part1/py4e/ch9/lesson.ch9.l2'),
  'py4e.ch9.l3': () => import('../../../content/part1/py4e/ch9/lesson.ch9.l3'),
  'py4e.ch9.l4': () => import('../../../content/part1/py4e/ch9/lesson.ch9.l4'),
  'py4e.ch9.l5': () => import('../../../content/part1/py4e/ch9/lesson.ch9.l5'),
  'py4e.ch9.l6': () => import('../../../content/part1/py4e/ch9/lesson.ch9.l6'),
  'py4e.ch10.l1': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l1'),
  'py4e.ch10.l2': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l2'),
  'py4e.ch10.l3': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l3'),
  'py4e.ch10.l4': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l4'),
  'py4e.ch10.l5': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l5'),
  'py4e.ch10.l6': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l6'),
  'py4e.ch11.l1': () => import('../../../content/part1/py4e/ch11/lesson.ch11.l1'),
  'py4e.ch11.l2': () => import('../../../content/part1/py4e/ch11/lesson.ch11.l2'),
  'py4e.ch11.l3': () => import('../../../content/part1/py4e/ch11/lesson.ch11.l3'),
  'py4e.ch11.l4': () => import('../../../content/part1/py4e/ch11/lesson.ch11.l4'),
  'py4e.ch11.l5': () => import('../../../content/part1/py4e/ch11/lesson.ch11.l5'),
  'py4e.ch11.l6': () => import('../../../content/part1/py4e/ch11/lesson.ch11.l6'),
  'py4e.ch12.l1': () => import('../../../content/part1/py4e/ch12/lesson.ch12.l1'),
  'py4e.ch12.l2': () => import('../../../content/part1/py4e/ch12/lesson.ch12.l2'),
  'py4e.ch12.l3': () => import('../../../content/part1/py4e/ch12/lesson.ch12.l3'),
  'py4e.ch12.l4': () => import('../../../content/part1/py4e/ch12/lesson.ch12.l4'),
  'py4e.ch12.l5': () => import('../../../content/part1/py4e/ch12/lesson.ch12.l5'),
  'py4e.ch12.l6': () => import('../../../content/part1/py4e/ch12/lesson.ch12.l6'),
  'py4e.ch13.l1': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l1'),
  'py4e.ch13.l2': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l2'),
  'py4e.ch13.l3': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l3'),
  'py4e.ch13.l4': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l4'),
  'py4e.ch13.l5': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l5'),
  'py4e.ch13.l6': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l6'),
  'py4e.ch14.l1': () => import('../../../content/part1/py4e/ch14/lesson.ch14.l1'),
  'py4e.ch14.l2': () => import('../../../content/part1/py4e/ch14/lesson.ch14.l2'),
  'py4e.ch14.l3': () => import('../../../content/part1/py4e/ch14/lesson.ch14.l3'),
  'py4e.ch14.l4': () => import('../../../content/part1/py4e/ch14/lesson.ch14.l4'),
  'py4e.ch14.l5': () => import('../../../content/part1/py4e/ch14/lesson.ch14.l5'),
  'py4e.ch14.l6': () => import('../../../content/part1/py4e/ch14/lesson.ch14.l6'),
  'py4e.ch15.l1': () => import('../../../content/part1/py4e/ch15/lesson.ch15.l1'),
  'py4e.ch15.l2': () => import('../../../content/part1/py4e/ch15/lesson.ch15.l2'),
  'py4e.ch15.l3': () => import('../../../content/part1/py4e/ch15/lesson.ch15.l3'),
  'py4e.ch15.l4': () => import('../../../content/part1/py4e/ch15/lesson.ch15.l4'),
  'py4e.ch15.l5': () => import('../../../content/part1/py4e/ch15/lesson.ch15.l5'),
  'py4e.ch15.l6': () => import('../../../content/part1/py4e/ch15/lesson.ch15.l6'),
  'py4e.ch16.l1': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l1'),
  'py4e.ch16.l2': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l2'),
  'py4e.ch16.l3': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l3'),
  'py4e.ch16.l4': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l4'),
  'py4e.ch16.l5': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l5'),
  'py4e.ch16.l6': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l6'),
  'swe.ch8.l1': () => import('../../../content/part1/swe/ch8/lesson.swe.ch8.l1'),
  'swe.ch8.l2': () => import('../../../content/part1/swe/ch8/lesson.swe.ch8.l2'),
  'swe.ch8.l3': () => import('../../../content/part1/swe/ch8/lesson.swe.ch8.l3'),
  'swe.ch8.l4': () => import('../../../content/part1/swe/ch8/lesson.swe.ch8.l4'),
  'swe.ch8.l5': () => import('../../../content/part1/swe/ch8/lesson.swe.ch8.l5'),
  'swe.ch9.l1': () => import('../../../content/part1/swe/ch9/lesson.swe.ch9.l1'),
  'swe.ch9.l2': () => import('../../../content/part1/swe/ch9/lesson.swe.ch9.l2'),
  'swe.ch9.l3': () => import('../../../content/part1/swe/ch9/lesson.swe.ch9.l3'),
  'swe.ch9.l4': () => import('../../../content/part1/swe/ch9/lesson.swe.ch9.l4'),
  'swe.ch10.l1': () => import('../../../content/part1/swe/ch10/lesson.swe.ch10.l1'),
  'swe.ch10.l2': () => import('../../../content/part1/swe/ch10/lesson.swe.ch10.l2'),
  'swe.ch10.l3': () => import('../../../content/part1/swe/ch10/lesson.swe.ch10.l3'),
  'swe.ch10.l4': () => import('../../../content/part1/swe/ch10/lesson.swe.ch10.l4'),
  'swe.ch10.l5': () => import('../../../content/part1/swe/ch10/lesson.swe.ch10.l5'),
  'swe.ch11.l1': () => import('../../../content/part1/swe/ch11/lesson.swe.ch11.l1'),
  'swe.ch11.l2': () => import('../../../content/part1/swe/ch11/lesson.swe.ch11.l2'),
  'swe.ch11.l3': () => import('../../../content/part1/swe/ch11/lesson.swe.ch11.l3'),
  'swe.ch11.l4': () => import('../../../content/part1/swe/ch11/lesson.swe.ch11.l4'),
  'swe.ch12.l1': () => import('../../../content/part1/swe/ch12/lesson.swe.ch12.l1'),
  'swe.ch12.l2': () => import('../../../content/part1/swe/ch12/lesson.swe.ch12.l2'),
  'swe.ch12.l3': () => import('../../../content/part1/swe/ch12/lesson.swe.ch12.l3'),
  'swe.ch12.l4': () => import('../../../content/part1/swe/ch12/lesson.swe.ch12.l4'),
  'swe.ch12.l5': () => import('../../../content/part1/swe/ch12/lesson.swe.ch12.l5'),
  'swe.ch12.l6': () => import('../../../content/part1/swe/ch12/lesson.swe.ch12.l6'),
  'swe.ch14.l1': () => import('../../../content/part1/swe/ch14/lesson.swe.ch14.l1'),
  'swe.ch14.l2': () => import('../../../content/part1/swe/ch14/lesson.swe.ch14.l2'),
  'swe.ch14.l3': () => import('../../../content/part1/swe/ch14/lesson.swe.ch14.l3'),
  'swe.ch14.l4': () => import('../../../content/part1/swe/ch14/lesson.swe.ch14.l4'),
  'swe.ch14.l5': () => import('../../../content/part1/swe/ch14/lesson.swe.ch14.l5'),
  'swe.ch15.l1': () => import('../../../content/part1/swe/ch15/lesson.swe.ch15.l1'),
  'swe.ch15.l2': () => import('../../../content/part1/swe/ch15/lesson.swe.ch15.l2'),
  'swe.ch15.l3': () => import('../../../content/part1/swe/ch15/lesson.swe.ch15.l3'),
  'swe.ch15.l4': () => import('../../../content/part1/swe/ch15/lesson.swe.ch15.l4'),
  'swe.ch1.l1': () => import('../../../content/part1/swe/ch1/lesson.swe.ch1.l1'),
  'swe.ch1.l2': () => import('../../../content/part1/swe/ch1/lesson.swe.ch1.l2'),
  'swe.ch1.l3': () => import('../../../content/part1/swe/ch1/lesson.swe.ch1.l3'),
  'swe.ch1.l4': () => import('../../../content/part1/swe/ch1/lesson.swe.ch1.l4'),
  'swe.ch2.l1': () => import('../../../content/part1/swe/ch2/lesson.swe.ch2.l1'),
  'swe.ch2.l2': () => import('../../../content/part1/swe/ch2/lesson.swe.ch2.l2'),
  'swe.ch2.l3': () => import('../../../content/part1/swe/ch2/lesson.swe.ch2.l3'),
  'swe.ch2.l4': () => import('../../../content/part1/swe/ch2/lesson.swe.ch2.l4'),
  'swe.ch2.l5': () => import('../../../content/part1/swe/ch2/lesson.swe.ch2.l5'),
  'swe.ch3.l1': () => import('../../../content/part1/swe/ch3/lesson.swe.ch3.l1'),
  'swe.ch3.l2': () => import('../../../content/part1/swe/ch3/lesson.swe.ch3.l2'),
  'swe.ch3.l3': () => import('../../../content/part1/swe/ch3/lesson.swe.ch3.l3'),
  'swe.ch3.l4': () => import('../../../content/part1/swe/ch3/lesson.swe.ch3.l4'),
  'swe.ch3.l5': () => import('../../../content/part1/swe/ch3/lesson.swe.ch3.l5'),
  'swe.ch4.l1': () => import('../../../content/part1/swe/ch4/lesson.swe.ch4.l1'),
  'swe.ch4.l2': () => import('../../../content/part1/swe/ch4/lesson.swe.ch4.l2'),
  'swe.ch4.l3': () => import('../../../content/part1/swe/ch4/lesson.swe.ch4.l3'),
  'swe.ch4.l4': () => import('../../../content/part1/swe/ch4/lesson.swe.ch4.l4'),
  'swe.ch5.l1': () => import('../../../content/part1/swe/ch5/lesson.swe.ch5.l1'),
  'swe.ch5.l2': () => import('../../../content/part1/swe/ch5/lesson.swe.ch5.l2'),
  'swe.ch5.l3': () => import('../../../content/part1/swe/ch5/lesson.swe.ch5.l3'),
  'swe.ch5.l4': () => import('../../../content/part1/swe/ch5/lesson.swe.ch5.l4'),
  'swe.ch6.l1': () => import('../../../content/part1/swe/ch6/lesson.swe.ch6.l1'),
  'swe.ch6.l2': () => import('../../../content/part1/swe/ch6/lesson.swe.ch6.l2'),
  'swe.ch6.l3': () => import('../../../content/part1/swe/ch6/lesson.swe.ch6.l3'),
  'swe.ch6.l4': () => import('../../../content/part1/swe/ch6/lesson.swe.ch6.l4'),
  'swe.ch7.l1': () => import('../../../content/part1/swe/ch7/lesson.swe.ch7.l1'),
  'swe.ch7.l2': () => import('../../../content/part1/swe/ch7/lesson.swe.ch7.l2'),
  'swe.ch7.l3': () => import('../../../content/part1/swe/ch7/lesson.swe.ch7.l3'),
  'swe.ch7.l4': () => import('../../../content/part1/swe/ch7/lesson.swe.ch7.l4'),
  'swe.appa.l1': () => import('../../../content/part1/swe/appa/lesson.swe.appa.l1'),
  'swe.appa.l2': () => import('../../../content/part1/swe/appa/lesson.swe.appa.l2'),
  'swe.appa.l3': () => import('../../../content/part1/swe/appa/lesson.swe.appa.l3'),
  'swe.appa.l4': () => import('../../../content/part1/swe/appa/lesson.swe.appa.l4'),
  'mls.appendix.l1': () => import('../../../content/part2/mls/appendix/lesson.mls.appendix.l1'),
  'mls.appendix.l2': () => import('../../../content/part2/mls/appendix/lesson.mls.appendix.l2'),
  'mls.appendix.l3': () => import('../../../content/part2/mls/appendix/lesson.mls.appendix.l3'),
  'd2l.ch2.l1': () => import('../../../content/part2/d2l/ch2/lesson.d2l.ch2.l1'),
  'd2l.ch2.l2': () => import('../../../content/part2/d2l/ch2/lesson.d2l.ch2.l2'),
  'd2l.ch2.l3': () => import('../../../content/part2/d2l/ch2/lesson.d2l.ch2.l3'),
  'd2l.ch1.l1': () => import('../../../content/part2/d2l/ch1/lesson.d2l.ch1.l1'),
  'd2l.ch1.l2': () => import('../../../content/part2/d2l/ch1/lesson.d2l.ch1.l2'),
  'd2l.ch1.l3': () => import('../../../content/part2/d2l/ch1/lesson.d2l.ch1.l3'),
  'mls.ch1.l1': () => import('../../../content/part2/mls/ch1/lesson.mls.ch1.l1'),
  'mls.ch1.l2': () => import('../../../content/part2/mls/ch1/lesson.mls.ch1.l2'),
  'mls.ch1.l3': () => import('../../../content/part2/mls/ch1/lesson.mls.ch1.l3'),
  'mls.ch1.l4': () => import('../../../content/part2/mls/ch1/lesson.mls.ch1.l4'),
  'mls.ch2.l1': () => import('../../../content/part2/mls/ch2/lesson.mls.ch2.l1'),
  'mls.ch2.l2': () => import('../../../content/part2/mls/ch2/lesson.mls.ch2.l2'),
  'mls.ch2.l3': () => import('../../../content/part2/mls/ch2/lesson.mls.ch2.l3'),
  'mls.ch2.l4': () => import('../../../content/part2/mls/ch2/lesson.mls.ch2.l4'),
  'mls.ch2.l5': () => import('../../../content/part2/mls/ch2/lesson.mls.ch2.l5'),
  'mls.ch3.l1': () => import('../../../content/part2/mls/ch3/lesson.mls.ch3.l1'),
  'mls.ch3.l2': () => import('../../../content/part2/mls/ch3/lesson.mls.ch3.l2'),
  'mls.ch3.l3': () => import('../../../content/part2/mls/ch3/lesson.mls.ch3.l3'),
  'mls.ch3.l4': () => import('../../../content/part2/mls/ch3/lesson.mls.ch3.l4'),
  'mls.ch3.l5': () => import('../../../content/part2/mls/ch3/lesson.mls.ch3.l5'),
  'mls.ch4.l1': () => import('../../../content/part2/mls/ch4/lesson.mls.ch4.l1'),
  'mls.ch4.l2': () => import('../../../content/part2/mls/ch4/lesson.mls.ch4.l2'),
  'mls.ch4.l3': () => import('../../../content/part2/mls/ch4/lesson.mls.ch4.l3'),
  'mls.ch4.l4': () => import('../../../content/part2/mls/ch4/lesson.mls.ch4.l4'),
  'mls.ch5.l1': () => import('../../../content/part2/mls/ch5/lesson.mls.ch5.l1'),
  'mls.ch5.l2': () => import('../../../content/part2/mls/ch5/lesson.mls.ch5.l2'),
  'mls.ch5.l3': () => import('../../../content/part2/mls/ch5/lesson.mls.ch5.l3'),
  'mls.ch5.l4': () => import('../../../content/part2/mls/ch5/lesson.mls.ch5.l4'),
  'mls.ch6.l1': () => import('../../../content/part2/mls/ch6/lesson.mls.ch6.l1'),
  'mls.ch6.l2': () => import('../../../content/part2/mls/ch6/lesson.mls.ch6.l2'),
  'mls.ch6.l3': () => import('../../../content/part2/mls/ch6/lesson.mls.ch6.l3'),
  'mls.ch6.l4': () => import('../../../content/part2/mls/ch6/lesson.mls.ch6.l4'),
  'mls.ch6.l5': () => import('../../../content/part2/mls/ch6/lesson.mls.ch6.l5'),
  'mls.ch7.l1': () => import('../../../content/part2/mls/ch7/lesson.mls.ch7.l1'),
  'mls.ch7.l2': () => import('../../../content/part2/mls/ch7/lesson.mls.ch7.l2'),
  'mls.ch7.l3': () => import('../../../content/part2/mls/ch7/lesson.mls.ch7.l3'),
  'd2l.ch3.l1': () => import('../../../content/part2/d2l/ch3/lesson.d2l.ch3.l1'),
  'd2l.ch3.l2': () => import('../../../content/part2/d2l/ch3/lesson.d2l.ch3.l2'),
  'd2l.ch3.l3': () => import('../../../content/part2/d2l/ch3/lesson.d2l.ch3.l3'),
  'd2l.ch4.l1': () => import('../../../content/part2/d2l/ch4/lesson.d2l.ch4.l1'),
  'd2l.ch4.l2': () => import('../../../content/part2/d2l/ch4/lesson.d2l.ch4.l2'),
  'd2l.ch4.l3': () => import('../../../content/part2/d2l/ch4/lesson.d2l.ch4.l3'),
  'd2l.ch5.l1': () => import('../../../content/part2/d2l/ch5/lesson.d2l.ch5.l1'),
  'd2l.ch5.l2': () => import('../../../content/part2/d2l/ch5/lesson.d2l.ch5.l2'),
  'd2l.ch5.l3': () => import('../../../content/part2/d2l/ch5/lesson.d2l.ch5.l3'),
  'd2l.ch6.l1': () => import('../../../content/part2/d2l/ch6/lesson.d2l.ch6.l1'),
  'd2l.ch6.l2': () => import('../../../content/part2/d2l/ch6/lesson.d2l.ch6.l2'),
  'd2l.ch6.l3': () => import('../../../content/part2/d2l/ch6/lesson.d2l.ch6.l3'),
  'd2l.ch7.l1': () => import('../../../content/part2/d2l/ch7/lesson.d2l.ch7.l1'),
  'd2l.ch7.l2': () => import('../../../content/part2/d2l/ch7/lesson.d2l.ch7.l2'),
  'd2l.ch7.l3': () => import('../../../content/part2/d2l/ch7/lesson.d2l.ch7.l3'),
  'd2l.ch8.l1': () => import('../../../content/part2/d2l/ch8/lesson.d2l.ch8.l1'),
  'd2l.ch8.l2': () => import('../../../content/part2/d2l/ch8/lesson.d2l.ch8.l2'),
  'd2l.ch8.l3': () => import('../../../content/part2/d2l/ch8/lesson.d2l.ch8.l3'),
  'd2l.ch14.l1': () => import('../../../content/part2/d2l/ch14/lesson.d2l.ch14.l1'),
  'd2l.ch14.l2': () => import('../../../content/part2/d2l/ch14/lesson.d2l.ch14.l2'),
  'd2l.ch14.l3': () => import('../../../content/part2/d2l/ch14/lesson.d2l.ch14.l3'),
  'd2l.ch14.l4': () => import('../../../content/part2/d2l/ch14/lesson.d2l.ch14.l4'),
  'd2l.ch14.l5': () => import('../../../content/part2/d2l/ch14/lesson.d2l.ch14.l5'),
  'd2l.ch9.l1': () => import('../../../content/part2/d2l/ch9/lesson.d2l.ch9.l1'),
  'd2l.ch9.l2': () => import('../../../content/part2/d2l/ch9/lesson.d2l.ch9.l2'),
  'd2l.ch9.l3': () => import('../../../content/part2/d2l/ch9/lesson.d2l.ch9.l3'),
  'd2l.ch10.l1': () => import('../../../content/part2/d2l/ch10/lesson.d2l.ch10.l1'),
  'd2l.ch10.l2': () => import('../../../content/part2/d2l/ch10/lesson.d2l.ch10.l2'),
  'd2l.ch10.l3': () => import('../../../content/part2/d2l/ch10/lesson.d2l.ch10.l3'),
  'd2l.ch10.l4': () => import('../../../content/part2/d2l/ch10/lesson.d2l.ch10.l4'),
  'd2l.ch15.l1': () => import('../../../content/part2/d2l/ch15/lesson.d2l.ch15.l1'),
  'd2l.ch15.l2': () => import('../../../content/part2/d2l/ch15/lesson.d2l.ch15.l2'),
  'd2l.ch15.l3': () => import('../../../content/part2/d2l/ch15/lesson.d2l.ch15.l3'),
  'd2l.ch15.l4': () => import('../../../content/part2/d2l/ch15/lesson.d2l.ch15.l4'),
  'd2l.ch16.l1': () => import('../../../content/part2/d2l/ch16/lesson.d2l.ch16.l1'),
  'd2l.ch16.l2': () => import('../../../content/part2/d2l/ch16/lesson.d2l.ch16.l2'),
  'd2l.ch16.l3': () => import('../../../content/part2/d2l/ch16/lesson.d2l.ch16.l3'),
  'd2l.ch11.l1': () => import('../../../content/part2/d2l/ch11/lesson.d2l.ch11.l1'),
  'd2l.ch11.l2': () => import('../../../content/part2/d2l/ch11/lesson.d2l.ch11.l2'),
  'd2l.ch11.l3': () => import('../../../content/part2/d2l/ch11/lesson.d2l.ch11.l3'),
  'd2l.ch12.l1': () => import('../../../content/part2/d2l/ch12/lesson.d2l.ch12.l1'),
  'd2l.ch12.l2': () => import('../../../content/part2/d2l/ch12/lesson.d2l.ch12.l2'),
  'd2l.ch12.l3': () => import('../../../content/part2/d2l/ch12/lesson.d2l.ch12.l3'),
  'd2l.ch12.l4': () => import('../../../content/part2/d2l/ch12/lesson.d2l.ch12.l4'),
  'd2l.ch13.l1': () => import('../../../content/part2/d2l/ch13/lesson.d2l.ch13.l1'),
  'd2l.ch13.l2': () => import('../../../content/part2/d2l/ch13/lesson.d2l.ch13.l2'),
  'd2l.ch19.l1': () => import('../../../content/part2/d2l/ch19/lesson.d2l.ch19.l1'),
  'd2l.ch19.l2': () => import('../../../content/part2/d2l/ch19/lesson.d2l.ch19.l2'),
  'd2l.ch17.l1': () => import('../../../content/part2/d2l/ch17/lesson.d2l.ch17.l1'),
  'd2l.ch18.l1': () => import('../../../content/part2/d2l/ch18/lesson.d2l.ch18.l1'),
  'd2l.ch20.l1': () => import('../../../content/part2/d2l/ch20/lesson.d2l.ch20.l1'),
  'd2l.ch21.l1': () => import('../../../content/part2/d2l/ch21/lesson.d2l.ch21.l1'),
  'swe.ch13.l1': () => import('../../../content/part1/swe/ch13/lesson.swe.ch13.l1'),
  'swe.ch13.l2': () => import('../../../content/part1/swe/ch13/lesson.swe.ch13.l2'),
  'swe.ch13.l3': () => import('../../../content/part1/swe/ch13/lesson.swe.ch13.l3'),
  'swe.ch13.l4': () => import('../../../content/part1/swe/ch13/lesson.swe.ch13.l4'),
};

/** All published lesson ids in curriculum order. */
export function allLessonIds(): string[] {
  return manifest.map((m) => m.id);
}

export function getManifestEntry(id: string): ManifestEntry | undefined {
  return manifest.find((m) => m.id === id);
}


/** Ordered ids unlocked given what the learner completed (prerequisite graph). */
export function isLessonUnlocked(id: string, completedLessons: string[]): boolean {
  const entry = getManifestEntry(id);
  if (!entry) return false;
  return entry.prerequisites.every((p) => completedLessons.includes(p));
}

/** Next incomplete, currently accessible lesson in curriculum order. */
export function nextLessonId(
  completedLessons: string[],
  isAccessible: (id: string) => boolean = (id) => isLessonUnlocked(id, completedLessons),
): string | undefined {
  return manifest.find((m) => !completedLessons.includes(m.id) && isAccessible(m.id))?.id;
}

/** Per-part completion totals across the full published curriculum. */
export function partProgress(part: 'I' | 'II', completedLessons: string[]) {
  const ids = manifest.filter((m) => m.part === part).map((m) => m.id);
  const done = ids.filter((id) => completedLessons.includes(id)).length;
  return { total: ids.length, done, frac: ids.length ? done / ids.length : 0 };
}
