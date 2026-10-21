'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useI18n, type Locale } from '@/lib/i18n';
import { useProgress } from '@/lib/store/progress';
import { useCertification, type GateMode } from '@/lib/store/certification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Download, FileUp, GraduationCap, Keyboard, Languages, Palette, ShieldCheck, SlidersHorizontal, Trash2, Volume2 } from 'lucide-react';

export function SettingsView() {
  const { t, locale, setLocale } = useI18n();
  const ar = locale === 'ar';
  const settings = useProgress((s) => s.settings);
  const setSettings = useProgress((s) => s.setSettings);
  const exportProgress = useProgress((s) => s.exportProgress);
  const importProgress = useProgress((s) => s.importProgress);
  const deleteAll = useProgress((s) => s.deleteAll);
  const gateMode = useCertification((s) => s.gateMode);
  const setGateMode = useCertification((s) => s.setGateMode);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleExport = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pypath-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    const ok = importProgress(text);
    if (ok) toast.success(t('settings.importSuccess'));
    else toast.error(t('settings.importFailed'));
    if (fileRef.current) fileRef.current.value = '';
  };

  const themeValue = settings.theme;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <header className="gentle-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('settings.subtitle')}</p>
      </header>

      {/* Language */}
      <Card className="py-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Languages className="size-4" aria-hidden="true" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={locale}
            onValueChange={(v) => setLocale(v as Locale)}
            className="gap-3"
          >
            <Label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 font-normal hover:bg-muted/60">
              <RadioGroupItem value="ar" />
              {t('settings.languageAr')}
            </Label>
            <Label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 font-normal hover:bg-muted/60">
              <RadioGroupItem value="en" />
              {t('settings.languageEn')}
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="py-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="size-4" aria-hidden="true" />
            {t('settings.theme')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={themeValue}
            onValueChange={(v) => setSettings({ theme: v as typeof settings.theme })}
            className="gap-3"
          >
            {(['light', 'dark', 'sepia', 'system'] as const).map((th) => (
              <Label key={th} className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 font-normal hover:bg-muted/60">
                <RadioGroupItem value={th} />
                {th === 'light' ? t('settings.themeLight') : th === 'dark' ? t('settings.themeDark') : th === 'sepia' ? t('settings.themeSepia') : t('settings.themeSystem')}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font scale */}
      <Card className="py-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {t('settings.fontScale')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.fontScale]}
              min={100}
              max={200}
              step={5}
              onValueChange={(v) => setSettings({ fontScale: v[0] })}
              aria-label={t('settings.fontScale')}
              className="flex-1"
            />
            <span className="w-14 text-center text-sm font-semibold tabular-nums">
              {t('settings.fontScaleValue', { v: settings.fontScale })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Calm + reduced motion */}
      <Card className="py-card">
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {t('settings.calm')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t('settings.calmDesc')}</p>
            </div>
            <Switch
              checked={settings.calm}
              onCheckedChange={(v) => setSettings({ calm: v })}
              aria-label={t('settings.calm')}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{t('settings.reduceMotion')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('settings.reduceMotionDesc')}</p>
            </div>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(v) => setSettings({ reduceMotion: v })}
              aria-label={t('settings.reduceMotion')}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Volume2 className="size-4" aria-hidden="true" />
                Sound
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{locale === 'ar' ? 'المنصة صامتة بتصميم — لا أصوات.' : 'Silent by design — no sounds.'}</p>
            </div>
            <Switch checked disabled aria-label="sound off" />
          </div>
        </CardContent>
      </Card>

      {/* Certification gate (Part II unlock) */}
      <Card className="py-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="size-4" aria-hidden="true" />
            {ar ? 'بوابة الاعتماد (الجزء الثاني)' : 'Certification gate (Part II)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={gateMode}
            onValueChange={(v) => setGateMode(v as GateMode)}
            className="gap-3"
          >
            <Label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 font-normal hover:bg-muted/60">
              <RadioGroupItem value="advisory" />
              {ar ? 'استشاري (افتراضي) — الجزء الثاني يُفتح بإكمال الجزء الأول' : 'Advisory (default) — Part II opens on Part I completion'}
            </Label>
            <Label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 font-normal hover:bg-muted/60">
              <RadioGroupItem value="enforced" />
              {ar ? 'مفروض — يُشترط أيضًا اجتياز الامتحان + الكابستون' : 'Enforced — exam pass + capstone also required'}
            </Label>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            {ar
              ? 'الافتراضي الاستشاري هو القرار الموثّق (OQ): التوصية تظهر في صفحتي الامتحان والكابستون دون منع. اختيار «مفروض» يقيّد فتح الجزء الثاني حتى استيفاء بوابة الاعتماد كاملة.'
              : 'Advisory is the documented default (OQ): the recommendation is shown on the Exam and Capstone views without blocking. "Enforced" additionally restricts Part II until the certification gate is fully met.'}
          </p>
        </CardContent>
      </Card>

      {/* Data */}
      <Card className="py-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('settings.dataTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{t('settings.dataDesc')}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-11 gap-2 rounded-xl" onClick={handleExport}>
              <Download className="size-4" aria-hidden="true" />
              {t('settings.exportData')}
            </Button>
            <Button variant="outline" className="h-11 gap-2 rounded-xl" onClick={() => fileRef.current?.click()}>
              <FileUp className="size-4" aria-hidden="true" />
              {t('settings.importData')}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => void handleImportFile(e.target.files?.[0])}
              aria-hidden="true"
            />
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-danger)' }}>
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--color-danger)' }}>
              <Trash2 className="size-4" aria-hidden="true" />
              {t('settings.deleteTitle')}
            </p>
            <p className="mb-3 text-xs text-muted-foreground">{t('settings.deleteBody')}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-11 rounded-xl" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                  {t('settings.deleteTitle')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.deleteTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('settings.deleteBody')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-xl text-white"
                    style={{ background: 'var(--color-danger)' }}
                    disabled={deleting}
                      onClick={async (e) => {
                        e.preventDefault();
                        setDeleting(true);
                        await deleteAll();
                        // When signed in, also erase the cloud snapshot.
                        try {
                          const probe = await fetch('/api/account', { cache: 'no-store' });
                          if (probe.ok) {
                            const { syncWipeCloud } = await import('@/lib/sync/engine');
                            await syncWipeCloud();
                          }
                        } catch {
                          // Offline/anonymous: local deletion already done.
                        }
                        setDeleting(false);
                        toast.success(t('settings.deleteDone'));
                      }}
                  >
                    {t('settings.deleteConfirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Shortcuts */}
      <Card className="py-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Keyboard className="size-4" aria-hidden="true" />
            {t('settings.shortcutsTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><kbd className="rounded border px-1.5 py-0.5 font-mono text-xs">B</kbd> — {t('settings.shortcutB')}</p>
          <p><kbd className="rounded border px-1.5 py-0.5 font-mono text-xs">R</kbd> — {t('settings.shortcutR')}</p>
          <p><kbd className="rounded border px-1.5 py-0.5 font-mono text-xs">N</kbd> — {t('settings.shortcutN')}</p>
          <p className="text-xs text-muted-foreground">{t('settings.shortcutsNote')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsView;
