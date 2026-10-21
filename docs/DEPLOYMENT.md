# النشر العام — خطوات مجانية (Vercel + Neon)

الخطة المعتمدة، بلا أي تكلفة أو بطاقة: **Vercel Hobby** للاستضافة + **Neon Free** لقاعدة بيانات Postgres + Resend اختياريًا لرسائل البريد.

## 1) ما أُنجز داخل الكود (مؤكَّد بالاختبارات)

- مخطط Prisma (7.10.1) جاهز: `prisma/schema.prisma` + ترحيل أولي مجلد `prisma/migrations/20261020120759_init/`.
- توليد العميل في `src/generated/prisma` عبر `postinstall` (`prisma generate`).
- نقاط النهاية: `/api/auth/*` (next-auth v4، تسجيل/دخول، استعادة، توثيق بريد)، `/api/account`، `/api/progress` (GET/POST/DELETE).
- أمان مُختبر: scrypt، جلسات JWT httpOnly، سقوط نهائي 5 محاولات → قفل 15 د، rate limiting، حارس same-origin، تحقق zod، عزل حسابات (مستخدم لن يرى بيانات مستخدم آخر أبدًا).
- البناء الإنتاجي: `npm run build` ثم `npm run start` (scripts←cross-platform، `scripts/postbuild.mjs`).

## 2) الخطوات اليدوية المطلوبة منك

### أ) قاعدة البيانات (Neon)
1. أنشئ حسابًا في https://neon.tech (بلا بطاقة).
2. New Project → Postgres 16 → من لوحة Dashboard ستجد نوعين من روابط الاتصال lettreًا في Neon:
   - **Pooled connection** (يحتوي المضيف على `-pooler`، مثل `ep-xxxx-pooler...`) — للتطبيق (Vercel runtime) عبر `DATABASE_URL`.
   - **Direct connection** (بلا `-pooler`، مثل `ep-xxxx...`) — للترحيلات فقط عبر `DIRECT_URL`.
3. من جهازك طبّق الترحيل مرة واحدة:
   ```
   $env:DATABASE_URL="<رابط Neon المجمّع pooled>";     # للتوافق فقط
   $env:DIRECT_URL="<رابط Neon المباشر direct>";       # هذا فعليًا ما تستخدمه migrate
   npm run db:migrate:deploy
   ```

> لماذا رابطان؟ Prisma 7 في هذا المشروع: runtime يستخدم driver adapter `pg` مباشرة على `DATABASE_URL` (`src/lib/db.ts`) ويجيد رابط Neon المجمّع؛ محرك الترحيل في CLI يعمل بوضع جلسات لا يتوافق مع ترتيب حاوية PgBouncer، لذلك يُتّبع `DIRECT_URL` إن وُجد، وإلا `DATABASE_URL` (تمّ التحقق: `prisma.config.ts` يقرأ `DIRECT_URL ?? DATABASE_URL`، ومحليًا يبقى كل شيء على Docker بلا `DIRECT_URL`).

### ب) الاستضافة (Vercel)
1. أنشئ حسابًا في https://vercel.com (بلا بطاقة، Hobby مجاني).
2. ارفع المستودع إلى GitHub (المستودع الحالي لم يُرفع بعد — قمتُ بما تحتاجه محليًا فقط ولم أرتبط بأي remote).
3. Add Project → Import repo. لا تحتاج تعديل setings: هي أوامر npm القياسية (`build` = `next build && node scripts/postbuild.mjs`).
4. أضف Environment Variables في المشروع:
   - `DATABASE_URL` = **رابط Neon المجمّع (pooled)** من (أ) — وهو ما يستخدمه التطبيق في Vercel.
   - `DIRECT_URL` = **رابط Neon المباشر (direct، بلا `-pooler`)** من (أ) — يُستخدم فقط من أوامر الترحيل CLI ويمكن تركه بلا إعداد في `preview/development`، لكن يُفضّل إضافته لجميع البيئات.
   - `NEXTAUTH_URL` = رابط النشر `https://<app>.vercel.app`
   - `NEXTAUTH_SECRET` = قيمة عشوائية 32+ حرفًا (`npx auth secret` يولّد واحدة)
   - اختياري: `RESEND_API_KEY` و `MAIL_FROM` لتفعيل رسائل توثيق/استعادة البريد عبر https://resend.com (خطة مجانية 100 رسالة/يوم)
5. انشر. طبّق الترحيلات مرة واحدة عبر `db:migrate:deploy` من جهازك مقابل Neon (خطوة (أ)-3؛ الترحيلات لا تُشغَّل تلقائيًا في Vercel Hobby tier).

### ج) رسائل البريد (Resend) — اختياري
- بلا `RESEND_API_KEY` تعمل كل التدفقات، لكن رسائل التوثيق/الاستعادة لا تُرسل فعليًا (الواجهة تعرض تنبيهًا واضحًا «خدمة البريد غير مهيأة»). أرسل المفتاح من لوحة Resend فقط إن أردت إرسالًا حقيقيًا.

## 3) قيود وقدرات نهائية

- المفسّر وكل المحتوى يعملان كليًا من المتصفح؛ لا يمر أي كود درس عبر السيرفر.
- لا تخزَّن أي شيء سرّي داخل الكود؛ الأسرار تُدار عبر متغيرات البيئة فقط (`.env` محلي، Env vars في Vercel).
- Plan Hobby يسمح بنطاق مخصص لاحقًا؛ قيود الباندويث (100GB/شهر) كافية للاستخدام التعلّمي وتتجدد شهريًا.
