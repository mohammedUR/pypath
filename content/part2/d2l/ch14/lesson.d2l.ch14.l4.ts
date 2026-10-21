import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch14.l4 — "Semantic Segmentation: Per-Pixel Labels to Fully Convolutional Networks"
 * التجزئة الدلالية: من تسميات البكسل إلى الشبكات التلافيفية الكاملة
 * Aligned with D2L ch14 s9 (Semantic Segmentation and the Dataset) + s10
 * (Transposed Convolution) + s11 (Fully Convolutional Networks). Original
 * paraphrase throughout. Runnable design: VOC color->class index mapping on a
 * small label grid, transposed convolution implemented by hand on nested lists,
 * the output-shape formula (n-1)*s - 2p + k with the k=2s/p=s/2 upsampling rule,
 * and the bilinear kernel row sums. Every literal verified under CPython 3.
 * Deterministic only.
 */
const lesson = {
  id: 'd2l.ch14.l4',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 14,
  title: {
    ar: 'التجزئة الدلالية: من تسميات البكسل إلى الشبكات التلافيفية الكاملة',
    en: 'Semantic Segmentation: Per-Pixel Labels to Fully Convolutional Networks',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch14.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الصندوق المحيط يقول «كلب هنا»، لكنه لا يرسم حدّ الكلب بذيله وأذنيه. التجزئة الدلالية تصنّف كل بكسل على حدة، فتحتاج طبقة ترجع الأبعاد المكبوسة إلى حجم الصورة الأصلي — هذه الطبقة هي الالتفاف المتبدل، وبقاياها تراكمية: صيغة شكل واحد وتهيئة ثنائية خط واحدة تفصل بين خرج خشن وخريطة دقيقة.',
        en: 'A bounding box says \u201cdog here\u201d but never traces the dog\u2019s tail or ears. Semantic segmentation classifies every pixel individually, which requires a layer that restores the squeezed dimensions back to the input size — that layer is the transposed convolution, and its leftovers are pure arithmetic: one shape formula plus one bilinear initialization separate a coarse output from a fine map.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تسميات البكسل ثم رفع الدقة', en: 'Pixel labels, then upsampling' },
      chunks: [
        {
          ar: 'التجزئة الدلالية تقسم الصورة إلى مناطق دلالية على مستوى البكسل — تختلف عن تجزئة الصورة التي لا تحتاج تسميات ولا تضمن دلالة، وعن تجزئة الأمثلة التي تميّز كل كائن عن الآخر (كلبان في الصورة = منطقتان). مجموعة Pascal VOC2012 المرجعية فيها 21 صنفًا: خلفية + 20 كائنًا، وملصقها صورة بحجم الصورة نفسه حيث لون كل بكسل يرمز لصنفه، ويحوَّل إلى رقم بالصيغة (r×256+g)×256+b. ولأن الدخل والتسمية يتطابقان بكسلًا بكسلًا، نقصّ الاثنين بالنافذة نفسها بدل إعادة التحجيم التي تفسد المطابقة.',
          en: 'Semantic segmentation divides an image into semantic regions at pixel level — unlike image segmentation, which needs no labels and guarantees no semantics, and instance segmentation, which tells objects apart (two dogs = two regions). The reference Pascal VOC2012 set has 21 classes — background plus 20 objects — and its labels are images of the same size where each pixel\u2019s color encodes its class, mapped to a number via (r×256+g)×256+b. Because input and label correspond pixel-for-pixel, both are cropped with the same window instead of being rescaled, which would corrupt the alignment.',
        },
        {
          ar: 'الالتفاف المتبدل (transposed convolution) يعكس فعل الالتفاف العادي: بدل تقليص العناصر عبر النواة يبثّ كل عنصر مدخل مضروبًا في النواة كلها. لمدخل n×n ونواة k×k تُنشأ n² نتائج وسيطة بحجم (n+k−1)×(n+k−1) توضع حسب موضع كل عنصر ثم تُجمع. مثال الكتاب: X=[[0,1],[2,3]] وK=[[0,1],[2,3]] يعطي خرج 3×3 بقيم [[0,0,1],[0,4,6],[4,12,9]] — لاحظ كيف تراكمت 4 و12 من تداخل المساهمات.',
          en: 'The transposed convolution reverses the regular one: instead of shrinking input elements through the kernel, it broadcasts each input element multiplied by the whole kernel. For an n×n input and k×k kernel, n² intermediate results of size (n+k−1)×(n+k−1) are placed according to each element\u2019s position and then summed. The book\u2019s example: X=[[0,1],[2,3]] with K=[[0,1],[2,3]] gives a 3×3 output [[0,0,1],[0,4,6],[4,12,9]] — note how 4 and 12 accumulate from overlapping contributions.',
        },
        {
          ar: 'الحشو في المتبدل يُطبق على الخرج لا الدخل (حشو 1 يحذف أول وآخر صف وعمود)، والخطوة تنطبق على النتائج الوسيطة فتُباعد طبعات النواة بخطوات s. والاسم من الجبر: الالتفاف يمثل بضرب مصفوفة W على المتجه المسطّح، والمتبدل هو الضرب بـ Wᵀ — أي يبادل دالتي الأمام والخلف للالتفاف. وصيغة الشكل الخارجة: (n−1)·s − 2p + k.',
          en: 'In the transposed convolution padding applies to the output, not the input (padding 1 strips the first and last row and column), and the stride applies to the intermediates, spacing the kernel stamps s apart. The name is algebraic: a convolution is a matrix product W over the flattened input, and the transposed convolution multiplies by Wᵀ — effectively swapping the convolution\u2019s forward and backward functions. The output shape follows (n−1)·s − 2p + k.',
        },
        {
          ar: 'الشبكة التلافيفية الكاملة (FCN) تستخدم عمودًا فقريًا مُدرَّبًا مسبقًا (ResNet-18 دون التجميع العام وطبقة الإخراج) فينكمش 320×480 إلى 10×15 (الثلث والثلاثون)، ثم التفاف 1×1 يحوّل القنوات إلى 21 صنفًا، ثم التبديل بنواة 64 وحشو 16 وخطوة 32 يعيد الحجم الأصلي — والقاعدة العامة: نواة 2s وحشو s/2 تضخم بالضبط s مرة. وتُهيأ النواة بثنائية الخط بحيث يكون مجموع أوزانها s² (لنواة 4: مجموع 4.0) فتتوسط الصورة بدل تشويهها، ويُدرَّب كل شيء بإنتروبيا متقاطعة على مستوى البكسل.',
          en: 'A fully convolutional network (FCN) uses a pretrained backbone (ResNet-18 minus the global pool and output layer) that shrinks 320×480 to 10×15 (one thirty-secondth), then a 1×1 conv maps channels to the 21 classes, then a transposed convolution with kernel 64, padding 16, stride 32 restores the input size — the general rule: kernel 2s with padding s/2 upsamples exactly s times. The kernel is initialized to bilinear interpolation, whose weights sum to s² (4.0 for k=4) so it averages rather than distorts, and training is pixel-wise cross-entropy.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'شبكة تسميات + التبديل يدويًا + صيغة الشكل وثنائية الخط',
        en: 'A label grid + transposed conv by hand + the shape formula and bilinear weights',
      },
      code: "# s9: Pascal VOC label colors -> class indices on a small label grid\nVOC5 = {'background': [0, 0, 0], 'aeroplane': [128, 0, 0], 'bicycle': [0, 128, 0],\n        'bird': [128, 128, 0], 'boat': [0, 0, 128]}\n\ndef color_index(rgb):                    # (r*256 + g)*256 + b\n    return (rgb[0] * 256 + rgb[1]) * 256 + rgb[2]\n\nlabel_map = {color_index(c): i for i, c in enumerate(VOC5.values())}\ngrid = [[[0, 0, 0], [128, 0, 0]],\n        [[0, 128, 0], [128, 128, 0]]]\nidx_grid = [[label_map[color_index(px)] for px in row] for row in grid]\nprint('class index of aeroplane color:', color_index([128, 0, 0]))\nprint('label grid -> class indices  :', idx_grid)\n\n# s10: transposed convolution by hand (stride 1, no padding)\ndef trans_conv(X, K):\n    h, w = len(K), len(K[0])\n    Y = [[0.0] * (len(X[0]) + w - 1) for _ in range(len(X) + h - 1)]\n    for i in range(len(X)):\n        for j in range(len(X[0])):\n            for ki in range(h):\n                for kj in range(w):\n                    Y[i + ki][j + kj] += X[i][j] * K[ki][kj]\n    return Y\n\nX = [[0.0, 1.0], [2.0, 3.0]]\nK = [[0.0, 1.0], [2.0, 3.0]]\nprint('trans conv 2x2:', trans_conv(X, K))\n\n# s10/s11: output-shape formula: out = (n-1)*s - 2p + k\ndef tconv_shape(n, k, p, s):\n    return (n - 1) * s - 2 * p + k\n\nprint('shape(10, k=64, p=16, s=32):', tconv_shape(10, 64, 16, 32))\nprint('shape(15, k=64, p=16, s=32):', tconv_shape(15, 64, 16, 32))\nprint('rule k=2s, p=s/2 => out=n*s:', all(tconv_shape(n, 64, 16, 32) == n * 32 for n in [10, 15, 224]))\n\n# s11: bilinear kernel for a x2 upsampler (k=4)\nk = 4\nfactor = (k + 1) // 2                     # 2\ncenter = factor - 0.5                     # 1.5 for even kernels\nfilt = [[(1 - abs(i - center) / factor) * (1 - abs(j - center) / factor)\n         for j in range(k)] for i in range(k)]\nprint('bilinear row 0:', filt[0])\nprint('bilinear sum  :', sum(sum(row) for row in filt))",
      explanation: {
        ar: 'لون الطائرة [128,0,0] يُفهرس بـ (128×256)×256 = 8388608، وشبكة التسميات 2×2 تتحول إلى أرقام أصناف [[0,1],[2,3]] — كما تفعل `voc_label_indices` في الكتاب. التبديل اليدوي لـ X وK يعطي [[0,0,1],[0,4,6],[4,12,9]] حيث تجمع الخلية الوسطى مساهمتي 2+2=4 وتحتها 6+6=12. صيغة الشكل تعيد 320 و480 لمدخلي 10 و15 بنواة 64 وحشو 16 وخطوة 32 — وقاعدة نواة 2s وحشو s/2 تعطي خرجًا = n×s لكل n من [10, 15, 224]. نواة ثنائية الخط لـ k=4 مركزها 1.5 وقيم صفّها الأول [0.0625, 0.1875, 0.1875, 0.0625] ومجموعها 4.0.',
        en: 'The aeroplane color [128,0,0] indexes to (128×256)×256 = 8388608, and the 2×2 label grid maps to class indices [[0,1],[2,3]] — just like the book\u2019s `voc_label_indices`. The hand-rolled transposed convolution over X and K yields [[0,0,1],[0,4,6],[4,12,9]]: the center cell collects 2+2=4 and the cell below 6+6=12. The shape formula returns 320 and 480 for inputs 10 and 15 with kernel 64, padding 16, stride 32 — and the kernel-2s/padding-s/2 rule gives output n×s for every n in [10, 15, 224]. The bilinear kernel for k=4 has center 1.5, first row [0.0625, 0.1875, 0.1875, 0.0625], and total mass 4.0.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trans-conv',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ trans_conv(X, K) للالتفاف المتبدل بخطوة 1 وبلا حشو على قوائم متداخلة: كل عنصر مدخل يضرب النواة كلها ويُضاف في موضعه، والخرج بحجم (n+k−1)². ثم نفّذ tconv_shape(n, k, p, s) التي تعيد (n−1)·s − 2p + k.',
        en: 'Implement trans_conv(X, K), the stride-1 padding-free transposed convolution on nested lists: each input element multiplies the whole kernel and is added at its position, with output size (n+k−1)². Then implement tconv_shape(n, k, p, s) returning (n−1)·s − 2p + k.',
      },
      starterCode: "def trans_conv(X, K):\n    # TODO: zero output of size (n+k-1); stamp X[i][j]*K at (i..i+h, j..j+w)\n    ...\n\ndef tconv_shape(n, k, p, s):\n    # TODO: (n-1)*s - 2p + k\n    ...\n",
      solution: "def trans_conv(X, K):\n    h, w = len(K), len(K[0])\n    Y = [[0.0] * (len(X[0]) + w - 1) for _ in range(len(X) + h - 1)]\n    for i in range(len(X)):\n        for j in range(len(X[0])):\n            for ki in range(h):\n                for kj in range(w):\n                    Y[i + ki][j + kj] += X[i][j] * K[ki][kj]\n    return Y\n\ndef tconv_shape(n, k, p, s):\n    return (n - 1) * s - 2 * p + k",
      tests: [
        {
          id: 't1',
          name: { ar: 'مثال الكتاب 2×2 بنواة 2×2 يعطي خرج 3×3', en: 'The book 2×2 example with a 2×2 kernel gives a 3×3 output' },
          code: "got = trans_conv([[0.0, 1.0], [2.0, 3.0]], [[0.0, 1.0], [2.0, 3.0]])\nassert got == [[0.0, 0.0, 1.0], [0.0, 4.0, 6.0], [4.0, 12.0, 9.0]], 'expected book output | got %r' % (got,)",
          expected: '[[0.0, 0.0, 1.0], [0.0, 4.0, 6.0], [4.0, 12.0, 9.0]]',
        },
        {
          id: 't2',
          name: { ar: 'صيغة الشكل تعيد 320 لمدخل 10', en: 'The shape formula returns 320 for input 10' },
          code: "got = tconv_shape(10, 64, 16, 32)\nassert got == 320, 'expected 320 | got %r' % (got,)",
          expected: '320',
        },
        {
          id: 't3',
          name: { ar: 'حالات حدية: أصغر مثال وحجم FCN للعرض', en: 'Edge cases: smallest example and the FCN width' },
          code: "assert tconv_shape(2, 2, 0, 1) == 3, '2x2 input with 2x2 kernel must give 3'\nassert tconv_shape(15, 64, 16, 32) == 480, 'FCN width 15 must restore to 480'",
          expected: '3 and 480',
        },
      ],
      hints: [
        { ar: 'ابدأ بمصفوفة أصفار 3×3 (لمدخل 2×2 ونواة 2×2) ثم اجمع المساهمات — لا تستبدل بل اجمع +=.', en: 'Start from a zero 3×3 matrix (for 2×2 input and kernel) and accumulate contributions — use +=, never assignment.' },
        { ar: 'عنصر X[i][j] يطبع النواة كلها بدءًا من (i, j): الحلقة الرباعية مباشرة.', en: 'X[i][j] stamps the whole kernel starting at (i, j): a straightforward quadruple loop.' },
        { ar: 'قيمة تحقق: الخلية الوسطى تجمع X[0][1]·K[1][0] + X[1][0]·K[0][1] = 2+2 = 4.', en: 'Sanity: the center cell gathers X[0][1]·K[1][0] + X[1][0]·K[0][1] = 2+2 = 4.' },
        { ar: 'قيمة تحقق للصيغة: (10−1)·32 − 2·16 + 64 = 288 − 32 + 64 = 320.', en: 'Formula sanity: (10−1)·32 − 2·16 + 64 = 288 − 32 + 64 = 320.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.voc-color-index',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في Pascal VOC2012 يُحوَّل لون بكسل التسمية (r, g, b) إلى فهرس بالصيغة (r×256+g)×256+b ثم يُبحث في جدول الألوان. ما فهرس لون صنف الطائرة [128, 0, 0]؟ (اكتب رقمًا)',
        en: 'In Pascal VOC2012 a label pixel (r, g, b) maps to the index (r×256+g)×256+b, looked up in the colormap. What is the index for the aeroplane class color [128, 0, 0]? (Enter a number)',
      },
      answer: '8388608',
      solution: '8388608',
      tolerance: 1,
      hints: [
        { ar: 'الصيغة: (r×256+g)×256+b — عوّض بالقيم الثلاث.', en: 'The formula: (r×256+g)×256+b — substitute the three values.' },
        { ar: '128×256 = 32768، ثم ×256.', en: '128×256 = 32768, then ×256.' },
        { ar: 'الجواب: 32768×256 = 8388608.', en: 'Answer: 32768×256 = 8388608.' },
        { ar: 'هذا الفهرس موضع القيمة 1 (الطائرة) في جدول التحويل لأنها الصنف الأول بعد الخلفية.', en: 'This index holds the value 1 (aeroplane) in the mapping table, being the first class after background.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# Transposed convolution with a stride: kernel stamps land s pixels apart.\ndef trans_conv_stride(X, K, s):\n    h, w = len(K), len(K[0])\n    H, W = (len(X) - 1) * s + h, (len(X[0]) - 1) * s + w\n    Y = [[0.0] * W for _ in range(H)]\n    for i in range(len(X)):\n        for j in range(len(X[0])):\n            for ki in range(h):\n                for kj in range(w):\n                    Y[i * s + ki][j * s + kj] += X[i][j] * K[ki][kj]\n    return Y\n\nX = [[0.0, 1.0], [2.0, 3.0]]\nK = [[0.0, 1.0], [2.0, 3.0]]\nprint('s=1:', trans_conv_stride(X, K, 1))\nprint('s=2:', trans_conv_stride(X, K, 2))\nprint('shape s=2:', (len(X) - 1) * 2 + len(K), 'x', (len(X[0]) - 1) * 2 + len(K[0]))\n\n# جرّب: بدّل K إلى المصفوفة الهوية [[1.0, 0.0], [0.0, 1.0]] واقرأ كيف يهبط كل بكسل\n# في موضع مستقل عند s=2 — هذه صورة النسخ البيني لثنائية الخط المبسطة.\n# try: swap K for the identity [[1.0, 0.0], [0.0, 1.0]] and read how at s=2 every\n# pixel lands at its own slot — a simplified picture of bilinear upsampling.\n# جرّب: احسب شكل الخرج لنواة 4 وخطوة 2 على مدخل 3 ولاحظ أنه (3-1)*2+4 = 8.\n# try: compute the output shape for kernel 4, stride 2 over input 3 and see (3-1)*2+4 = 8.\n",
      prompt: {
        ar: 'الملعب يضيف الخطوة إلى التبديل اليدوي: طبعات النواة تتباعد s بكسلًا فيخرج 2×2 بنواة 2×2 وخطوة 2 إلى 4×4 بقيم [[0,0,0,1],[0,0,2,3],[0,2,0,3],[4,6,6,9]] — نفس خرج الكتاب لخطوة 2. صيغة الشكل العامة للخطوة: (n−1)·s + k.',
        en: 'The sandbox adds strides to the hand-rolled transposed convolution: kernel stamps land s pixels apart, so a 2×2 input with a 2×2 kernel and stride 2 expands to 4×4 holding [[0,0,0,1],[0,0,2,3],[0,2,0,3],[4,6,6,9]] — the book\u2019s stride-2 output exactly. The stride-general shape formula is (n−1)·s + k.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'صورتان فيهما كلبان: ماذا تفعل تجزئة الأمثلة (instance segmentation) أكثر من التجزئة الدلالية؟',
            en: 'Two images each contain two dogs: what does instance segmentation do beyond semantic segmentation?',
          },
          options: [
            { id: 'a', text: { ar: 'تميّز بكسلات كل كلب عن الآخر مع الحفاظ على الصنف نفسه', en: 'It separates the pixels of each dog while keeping the same class' } },
            { id: 'b', text: { ar: 'تضاعف عدد الأصناف إلى أربعة', en: 'It doubles the number of classes to four' } },
            { id: 'c', text: { ar: 'تدمج الكلبين في منطقة واحدة أكبر', en: 'It merges both dogs into one larger region' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التجزئة الدلالية تعطي كل بكسل صنفه فتسقط الكلبين في منطقة واحدة؛ تجزئة الأمثلة (الكشف والتجزئة معًا) تميّز كل كائن عن نظيره — وهذا ما يضيفه فرع الأقنعة في Mask R-CNN.',
            en: 'Semantic segmentation assigns each pixel its class, collapsing both dogs into one region; instance segmentation (detection + segmentation together) tells each object apart — exactly what Mask R-CNN\u2019s mask branch adds.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أين يُطبَّق الحشو في الالتفاف المتبدل وما أثره؟',
            en: 'Where is padding applied in a transposed convolution, and what is its effect?',
          },
          options: [
            { id: 'a', text: { ar: 'على الدخل، فيضيف صفوفًا وأعمدة جديدة', en: 'On the input, adding extra rows and columns' } },
            { id: 'b', text: { ar: 'على الخرج، فحشو 1 يحذف أول وآخر صف وعمود من الناتج', en: 'On the output, where padding 1 strips the first and last row and column of the result' } },
            { id: 'c', text: { ar: 'على النواة، فيكبّرها عنصرًا إضافيًا من كل جهة', en: 'On the kernel, enlarging it by one element on each side' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الحشو في المتبدل معكوس عن العادي: يُقصّ من الخرج لا يُضاف إلى الدخل. مثال الكتاب: خرج 3×3 بنواة 2×2 وحشو 1 يبقى منه بكسل واحد فقط [[4.0]].',
            en: 'Padding in the transposed convolution is the mirror image of the regular case: it trims the output rather than padding the input. The book\u2019s example: a 3×3 output from a 2×2 kernel with padding 1 reduces to the single pixel [[4.0]].',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما دور التفاف 1×1 في بنية FCN قبل التبديل النهائي؟',
            en: 'What is the role of the 1×1 convolution in the FCN before the final transposed convolution?',
          },
          options: [
            { id: 'a', text: { ar: 'تحويل عدد القنوات إلى عدد أصناف البكسل (21 في VOC) دون لمس الأبعاد المكانية', en: 'Mapping the channel count to the pixel-class count (21 for VOC) without touching spatial dimensions' } },
            { id: 'b', text: { ar: 'تقليل ارتفاع وعرض الخرائط إلى النصف', en: 'Halving the height and width of the maps' } },
            { id: 'c', text: { ar: 'استبدال التجميع العام قبل طبقة الإخراج الخطية', en: 'Replacing global pooling before the linear output layer' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العمود الفقري يعيد 512 قناة لكل موضع؛ التفاف 1×1 يحوّلها إلى 21 قناة (صنف لكل بكسل) مع بقاء 10×15، ثم التبديل بنواة 64 وحشو 16 وخطوة 32 يعيد الارتفاع والعرض إلى 320×480.',
            en: 'The backbone leaves 512 channels per location; the 1×1 conv turns them into 21 (one class per pixel) while keeping 10×15, and the transposed conv with kernel 64, padding 16, stride 32 restores 320×480.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التجزئة الدلالية تصنّف كل بكسل، وتختلف عن تجزئة الصورة (بلا تسميات) وتجزئة الأمثلة (تمييز الكائنات)؛ VOC2012 بـ 21 صنفًا وملصقات ملونة تُفهرس بـ (r×256+g)×256+b، ويُقصّ الدخل والتسمية بالنافذة نفسها بدل إعادة التحجيم (هدف s9 التجزئة الدلالية ومجموعة البيانات).', en: 'Semantic segmentation classifies every pixel — distinct from image segmentation (no labels) and instance segmentation (object separation); VOC2012 has 21 classes with color labels indexed by (r×256+g)×256+b, and input and label are cropped with the same window instead of rescaled (goal of s9 Semantic Segmentation and the Dataset).' },
        { ar: 'الالتفاف المتبدل يبثّ كل عنصر عبر النواة ويجمع التداخلات فيخرج أكبر من الدخل: (n+k−1)² بلا خطوة، والحشو على الخرج والخطوة على الوسائط، وهو ضرب بـ Wᵀ — صيغة الشكل (n−1)·s − 2p + k (هدف s10 الالتفاف المتبدل).', en: 'The transposed convolution broadcasts each element through the kernel and sums overlaps, growing the input: (n+k−1)² without stride; padding hits the output, stride the intermediates, and algebraically it multiplies by Wᵀ — the shape formula is (n−1)·s − 2p + k (goal of s10 Transposed Convolution).' },
        { ar: 'FCN عمود فقري مُدرَّب مسبقًا ثم التفاف 1×1 إلى أصناف البكسل ثم تبديل بنواة 2s وحشو s/2 يضخّم s مرة (32 هنا)، بتهيئة ثنائية الخط مجموعها s²، وتدريب بإنتروبيا متقاطعة لكل بكسل (هدف s11 الشبكات التلافيفية الكاملة).', en: 'An FCN is a pretrained backbone, then a 1×1 conv to pixel classes, then a transposed conv with kernel 2s and padding s/2 upsampling exactly s times (32 here), bilinear-initialized with total mass s², trained with per-pixel cross-entropy (goal of s11 Fully Convolutional Networks).' },
      ],
      reflectPrompt: {
        ar: 'لماذا نقصّ زوج (صورة، تسمية) بالنافذة نفسها في التجزئة بينما نعيد تحجيم الصور في التصنيف؟ وما الذي سيكسر لو أعدنا تحجيم الصورة فقط؟',
        en: 'Why is the (image, label) pair cropped together in segmentation while classification rescales images freely? What breaks if only the image is rescaled?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch14.s9' },
        { book: 'D2L', section: 'd2l.ch14.s10' },
        { book: 'D2L', section: 'd2l.ch14.s11' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch14.s9' },
    { book: 'D2L', section: 'd2l.ch14.s10' },
    { book: 'D2L', section: 'd2l.ch14.s11' },
  ],
} satisfies Lesson;

export default lesson;
