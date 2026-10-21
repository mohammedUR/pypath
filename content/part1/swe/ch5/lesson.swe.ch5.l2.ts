/**
 * Lesson swe.ch5.l2 — التدفقات البديلة: السلوك الشرطي / Alternative Flows: Conditional Behavior
 * Book: SWE — Chapter 5 'Use Cases', §5.2 Alternative Flows (pp.127-129)
 *   5.2.1 Specific Alternatives, 5.2.2 Extension Points, 5.2.3 Bounded Alternatives
 * Runnable design: a deterministic "flow stepper" over a fixed main-steps list
 *   plus an alternatives dict walks a fixed scenario and prints the path taken,
 *   e.g. 'step4 ALT(A1 incorrect PIN) -> ...' with resumption jumps.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch5.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 5,
  title: { ar: 'التدفقات البديلة: السلوك الشرطي', en: 'Alternative Flows: Conditional Behavior' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch5.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'خُطئ الرقم السري ثلاث مرات متتالية على الصراف الآلي. ماذا يحدث الآن؟ يحتجز الجهاز البطاقة؟ يعيد المحاولة؟ يطفئ نفسه؟ التدفق الأساسي لا يجيب — فهو كذبة بحذف: يسرد النجاح ويتجاهل الواقع. الفرق بين قصة مستخدم وحالة استخدام يظهر هنا بالضبط: القصة تخفي هذه الحالات، وحالة الاستخدام تجرّ كل واحدة إلى النور وتقرر — على الورق وبدون تردد — ماذا سيفعل النظام.',
        en: 'The PIN is mistyped three times in a row at the ATM. What now? Retain the card? Retry? Shut down? The basic flow does not say — it is a lie of omission: success narrated, reality ignored. This is exactly where use cases earn their keep over user stories: a story hides these conditions; a use case drags every one you can find into the light and decides, on the record, what the system will do.',
      },
    },
    {
      kind: 'predict',
      code: `basic = ["insert card", "enter PIN", "enter amount", "take cash"]
breaks = ["wrong PIN", "insufficient funds", "machine out of cash", "network lost"]
print("happy path:", len(basic), "steps")
print("ways it breaks:", len(breaks))
for b in breaks:
    print("-", b)`,
      question: {
        ar: 'أربع خطوات في المسار السعيد — وكم طريقة يمكن أن يتعطل بها؟ خمّن العدد قبل التشغيل، ثم قارن.',
        en: 'Four steps in the happy path — how many ways can it break? Guess the count before running, then compare.',
      },
      reveal: {
        ar: 'أربع مقابل أربع: طرق الانكسار تنافس خطوات النجاح عددًا — وهذه قاعدة لا استثناء. كل انكسار يصير في الحالة الاستخدامية لاحقة مسماة: تعرف خطتها، وشرطها، ونقطة استئنافها.',
        en: 'Four against four: the ways it can break rival the success steps in count — and that is the rule, not the exception. In a use case each break becomes a named alternative with a trigger step, a condition, and a resumption point.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تشريح اللاحقة الخاصة', en: 'Anatomy of a specific alternative' },
      chunks: [
        {
          ar: 'كل لاحقة بديلة (alternative flow) تلتصق بنقطة محددة في تدفق آخر وتجيب عن سؤال واحد: عند الخطوة N، إذا تحقق الشرط C بدلًا من المعتاد، يحدث هذا. اللاحقة الخاصة (specific alternative) مرتبطة بخطوة واحدة فقط: الشرط لا ينشأ إلا هناك، فتسكن بجوار تلك الخطوة ولا مكان آخر لها. وبنيتها أربعة أجزاء لا ينقصها شيء: خطوة الالتحاق، الشرط، خطواتها المرقّمة، ونقطة الاستئناف — رقم الخطوة الذي يعود إليه السرد.',
          en: 'An alternative flow attaches to a specific point in another flow and answers one question: at step N, if condition C holds instead, this happens. A specific alternative is tied to a single step — the condition can only arise there, so it lives beside that step and nowhere else. Its anatomy is four parts, no fewer: the trigger step, the condition, its own numbered steps, and the resumption point — the step number where control returns to the basic flow.',
        },
        {
          ar: 'نقطة الاستئناف هي الدرزة التي تمنع اللاحقة من إعادة سرد ما بعدها: «يستأنف عند الخطوة 6» وعد بأن كل ما بعد 6 يسلك كما كُتب حرفيًا. في مثال الصراف: A1 رمز خاطئ عند الخطوة 4 تعلِم بعدد المحاولات المتبقية وتعيد الطلب وتستأنف عند 4؛ وA2 ثلاثة رموز خاطئة تحتجز البطاقة وتنتهي؛ وA3 رصيد غير كافٍ عند الخطوة 8 تعلِم ثم تستأنف عند 6 حيث يُطلب مبلغ جديد.',
          en: 'The resumption point is the seam that spares the alternative from re-narrating the rest: "resume at step 6" is a promise that everything from 6 onward behaves exactly as already written. In the ATM: A1 wrong PIN at step 4 informs how many attempts remain, re-prompts, and resumes at 4; A2 three wrong PINs retains the card and ends the case; A3 insufficient funds at step 8 informs, then resumes at 6 where a new amount is prompted.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نقاط الامتداد: خطّاف لسلوك اختياري', en: 'Extension points: a hook for optional behavior' },
      chunks: [
        {
          ar: 'أحيانًا تريد أن تقول: في هذه اللحظة قد يحدث سلوك إضافي — دون أن تلتزم في التدفق الأساسي ببيان ما هو. نقطة الامتداد (extension point) موضع مسمّى في التدفق يُعلَّق عليه سلوك اختياري: خطّاف يحمل اسمًا، وتحمل عليه لاحقًا حالات استخدام ممتِدة. في الصراف نعلن نقطة AmountConfirmed بعد تأكيد المبلغ وقبل الصرف، وتحمل عليها حالة Assess Withdrawal Fee التي تخص البطاقات خارج الشبكة فقط؛ فيبقى تدفق السحب نظيفًا ومنطق الرسوم في وثيقته المستقلة.',
          en: 'Sometimes you want to say: at this moment, additional behavior may occur — without committing, in the basic flow, to what it is. An extension point is a named location in a flow where optional behavior can attach: a labeled hook that extending use cases plug into later. In the ATM we declare AmountConfirmed after the amount is confirmed and before dispensing; the Assess Withdrawal Fee case — relevant only to out-of-network cards — hooks there, keeping the withdrawal flow clean and fee logic in its own document.',
        },
        {
          ar: 'وقيمتها فصل الاهتمامات داخل المتطلبات نفسها. لحظة أن تجد نفسك تكتب «وإن كان عميلًا مميزًا نفّذ أيضًا X، إلا في يوم العطلة فيكون Y» فقد حشوت تدفقًا واحدًا بقصص متزاحمة لا تنتمي إليه. نقطة الامتداد تسمّي الخطّاف وتنقل القصة الشرطية إلى مكانها الخاص، فيبقى كل تدفق عن شيء واحد — وأسهل في القراءة والمراجعة والتعديل.',
          en: 'Its value is separation of concerns inside the requirements themselves. The moment you catch yourself writing "and if a premium customer also do X, unless it is a holiday then Y," you have stuffed one flow with crowded stories that do not belong there. An extension point names the hook and moves the conditional story to its own place, so each flow stays about one thing — easier to read, review, and change.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'اللاحقة المحدودة بمجال، وقاعدة أضيق بناء', en: 'Bounded alternatives, and the narrowest-structure rule' },
      chunks: [
        {
          ar: 'بعض الشروط لا ترتبط بخطوة واحدة — قد تضرب في أي لحظة. اللاحقة المحدودة (bounded alternative) تسري على مجال من الخطوات لا على نقطة: «من الخطوة 4 إلى 8». المثال الكلاسيكي انقطاع الاتصال بنظام Bank Authorization System أثناء السحب: خلل في الوصلة عند الخطوة 5 قد لا يُكتشف إلا عند الخطوة 8. بلا مجال ستكرر المعالجة تحت كل خطوة من الخمس: خمس نسخ تنحرف أول ما تعدّل واحدة منها. النسخة المحدودة تقول السلوك المشترك مرة واحدة وتسمّي نطاقه.',
          en: 'Some conditions are not tied to a single step — they can strike almost anywhere. A bounded alternative applies across a range of steps rather than one point: "at any step from 4 through 8." The canonical case is losing the link to the Bank Authorization System mid-withdrawal: a failure at step 5 may only be discovered at step 8. Without the bound you would copy the handling under all five steps: five copies drifting the first time someone edits one. The bounded form states the shared behavior once and names its scope.',
        },
        {
          ar: 'والقاعدة الحاكمة: اختر أضيق بناء يصلح للشرط. شرط ينشأ عند خطوة واحدة بالضبط؟ لاحقة خاصة. يمتد على عدة خطوات؟ لاحقة محدودة. سلوك اختياري مفاهيميًا مستقل تفضّل وصفه في مكان آخر؟ نقطة امتداد. مطابقة البنية للشرط تجعل كل تدفق قصيرًا، وتُبقي التكرار خارج الوثيقة، وتجعل القارئ يعرف فورًا أين يبحث.',
          en: 'The governing rule: choose the narrowest structure that fits the condition. A condition arising at exactly one step? A specific alternative. Ranging over several? A bounded one. Optional, conceptually separate behavior you would rather describe elsewhere? An extension point. Matching structure to condition keeps each flow short, keeps duplication out of the document, and tells the reader exactly where to look.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'سائس التدفق: يسير على المسار ويفرّع عند الشرط', en: 'The flow stepper: walk the path, branch on the condition' },
      code: `MAIN = ["insert card", "read card, prompt for PIN", "enter PIN",
        "validate PIN with bank", "enter amount", "dispense cash", "return card"]

ALTS = {
    (4, "pin wrong"): {"name": "A1 incorrect PIN",
                       "steps": ["show attempts left", "re-prompt PIN"],
                       "resume": 4},
    (5, "low balance"): {"name": "A3 insufficient funds",
                         "steps": ["show message"],
                         "resume": 5},
}

def walk(events):
    """events: {step_number: condition}; steps without an event are 'ok'."""
    events = dict(events)
    path = []
    i = 1
    guard = 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

print(walk({4: "pin wrong", 5: "low balance"}))`,
      explanation: {
        ar: 'الممشّي walk يستقبل أحداثًا: رقم خطوة وشرطها. عند كل خطوة إما تمضي ok، أو تفرّع إلى لاحقتها المسماة: تُطبع أسطرها، ثم يُحذف الحدث ويقفز العدّاد إلى نقطة الاستئناف فيكمل الأساسي من هناك. لاحظ أن A1 تستأنف عند خطتها نفسها (4) بعد معالجة الشرط — حذف الحدث هو ما يمنع الحلقة اللانهائية، تمامًا كما تمنع «معالجة الشرط» في الواقع إعادة اندلاعه.',
        en: 'The walker takes events: a step number and its condition. Each step either proceeds ok or branches to its named alternative: the alternative\'s lines print, the event clears, and the counter jumps to the resumption point so the basic flow continues from there. Note A1 resumes at its own trigger step (4) after handling — deleting the handled event is what prevents an infinite loop, exactly as handling the condition prevents it from re-firing in reality.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.add-alt-flow',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'في الشيفرة أدناه مسار من أربع خطوات ولاحقة A3 جاهزة. أضف لاحقة A4 machine empty عند الخطوة 4: خطواتها show message ثم offer smaller amount، وتستأنف عند 4. ثم اطبع نتيجة walk مع الحدث {4: "machine empty"}. يجب أن يظهر في خرجك سطر يبدأ بـ step4 ALT(A4 machine empty) وينتهي المسار بـ step4 ok.',
        en: 'The code below has a four-step main flow and one ready alternative. Add an A4 machine empty alternative at step 4: its steps are show message then offer smaller amount, resuming at 4. Then print the result of walk with the event {4: "machine empty"}. Your output must contain a line starting with step4 ALT(A4 machine empty) and end the path with step4 ok.',
      },
      starterCode: `MAIN = ["insert card", "enter PIN", "enter amount", "dispense cash"]
ALTS = {
    (3, "no funds"): {"name": "A3 no funds",
                      "steps": ["show message"],
                      "resume": 3},
}

def walk(events):
    events = dict(events)
    path = []
    i = 1
    guard = 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

# TODO: add A4 'machine empty' at step 4 (resume at 4),
#       steps: ['show message', 'offer smaller amount']
# then print walk({4: "machine empty"})`,
      solution: `MAIN = ["insert card", "enter PIN", "enter amount", "dispense cash"]
ALTS = {
    (3, "no funds"): {"name": "A3 no funds",
                      "steps": ["show message"],
                      "resume": 3},
}

def walk(events):
    events = dict(events)
    path = []
    i = 1
    guard = 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

ALTS[(4, "machine empty")] = {"name": "A4 machine empty",
                              "steps": ["show message", "offer smaller amount"],
                              "resume": 4}
print(walk({4: "machine empty"}))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'يتفرع إلى A4 عند الخطوة 4', en: 'branches into A4 at step 4' },
          code: `assert 'step4 ALT(A4 machine empty)' in __learner_output__, 'expected: step4 ALT(A4 machine empty) | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'يعرض خطوة العرض الأصغر ويستأنف', en: 'shows the smaller-amount step and resumes' },
          code: `assert 'step4: offer smaller amount' in __learner_output__ and 'step4 ok' in __learner_output__, 'expected: step4: offer smaller amount then step4 ok | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'لاحقة جديدة = مفتاح جديد في dict الـ ALTS بصيغة (رقم الخطوة، الشرط).', en: 'A new alternative = a new key in the ALTS dict of the form (step number, condition).' },
        { ar: 'قيمة المفتاح dict فيها ثلاثة حقول: name وsteps وresume — انسخ بنية A3 وغيّر القيم.', en: 'The key\'s value is a dict with three fields: name, steps, resume — copy A3\'s structure and change the values.' },
        { ar: 'الهيكل: ALTS[(4, "machine empty")] = {"name": "A4 machine empty", "steps": ["show message", "offer smaller amount"], "resume": 4}', en: 'Skeleton: ALTS[(4, "machine empty")] = {"name": "A4 machine empty", "steps": ["show message", "offer smaller amount"], "resume": 4}' },
        { ar: 'السطر الأخير: print(walk({4: "machine empty"})) — والخرج المتوقع يبدأ step1 ok -> step2 ok -> step3 ok -> step4 ALT(...).', en: 'Last line: print(walk({4: "machine empty"})) — expected output starts step1 ok -> step2 ok -> step3 ok -> step4 ALT(...).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-resume',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود ثم اكتب خرجه الحرفي: جدول صغير للواحق يُطبع بترتيب أسمائها مع نقطة الالتحاق والمصير.',
        en: 'Read the code and write its exact output: a small table of alternatives printed in name order, with trigger point and outcome.',
      },
      code: `alts = {"A1": (4, "resume at 4"), "A2": (4, "end use case"),
        "A3": (8, "resume at 6"), "B1": ("4-8", "end use case")}
for name in sorted(alts):
    at, outcome = alts[name]
    print(name, "at step", at, "->", outcome)`,
      answer: `A1 at step 4 -> resume at 4
A2 at step 4 -> end use case
A3 at step 8 -> resume at 6
B1 at step 4-8 -> end use case`,
      solution: `alts = {"A1": (4, "resume at 4"), "A2": (4, "end use case"),
        "A3": (8, "resume at 6"), "B1": ("4-8", "end use case")}
for name in sorted(alts):
    at, outcome = alts[name]
    print(name, "at step", at, "->", outcome)`,
      hints: [
        { ar: 'sorted(alts) يرتب المفاتيح نصيًا: A1 ثم A2 ثم A3 ثم B1.', en: 'sorted(alts) orders the keys as strings: A1, then A2, then A3, then B1.' },
        { ar: 'كل سطر ست عبارات طباعة مفصولة بمسافات: الاسم، at step، النقطة، السهم، المصير.', en: 'Each line is five print arguments joined by spaces: name, at step, point, arrow, outcome.' },
        { ar: 'B1 نقطته نص «4-8» لا رقم — لاحقة محدودة بمجال.', en: 'B1\'s point is the string "4-8", not a number — a bounded alternative.' },
        { ar: 'لاحظ أن A2 وB1 ينتهيان بـ end use case بينما A1 وA3 يستأنفان.', en: 'Note A2 and B1 end with end use case while A1 and A3 resume.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-bounded',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'شرط: «يستطيع المستخدم الإلغاء من أي شاشة أثناء العملية». أي بناء يناسبه؟',
        en: 'Condition: "the user can cancel from any screen during the operation." Which structure fits?',
      },
      options: [
        { id: 'a', text: { ar: 'لاحقة خاصة ملتحقة بالخطوة الأولى فقط', en: 'A specific alternative attached to step 1 only' } },
        { id: 'b', text: { ar: 'لاحقة محدودة تسري على مجال الخطوات كلها', en: 'A bounded alternative spanning the whole range of steps' } },
        { id: 'c', text: { ar: 'نقطة امتداد في نهاية التدفق', en: 'An extension point at the end of the flow' } },
        { id: 'd', text: { ar: 'حالة استخدام مستقلة جديدة', en: 'A brand-new standalone use case' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل أولًا: هل يمكن للشرط أن ينشأ عند أكثر من خطوة؟', en: 'First ask: can the condition arise at more than one step?' },
        { ar: 'الإلغاء ممكن في أي لحظة — فهو شرط عابر للخطوات لا حصره بواحدة.', en: 'Cancellation can happen at any moment — a cross-cutting condition, not confined to one step.' },
        { ar: 'الخيار (a) يكرر المعالجة تحت كل خطوة إن عمّمتَه؛ و(c) لسلوك اختياري مستقل لا لفشل عابر.', en: 'Option (a) would need the handling copied under every step; (c) is for optional separate behavior, not a cross-cutting failure.' },
        { ar: 'الإجابة: نسخة واحدة بمجال مسمّى من أول خطوة إلى آخرها.', en: 'The answer: one copy with a named range from the first step to the last.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-resume',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'اللاحقة A3 (رصيد غير كافٍ) تلتصق بالخطوة 8 في تدفق السحب، وتستأنف عند الخطوة التي يُطلب فيها مبلغ جديد. ما رقم خطوة الاستئناف؟',
        en: 'The A3 alternative (insufficient funds) attaches at step 8 of the withdrawal flow and resumes where a new amount is prompted. What is the resumption step number?',
      },
      answer: '6',
      solution: '6',
      hints: [
        { ar: 'في التدفق الأساسي، طلب المبلغ يأتي بعد اختيار الخدمة مباشرة.', en: 'In the basic flow, the amount prompt comes right after selecting the service.' },
        { ar: 'A3 تلاعب بالرصيد لا بالرمز — فهي تعيد مرحلة المبلغ لا مرحلة التحقق.', en: 'A3 is about the balance, not the PIN — so it re-enters the amount stage, not the validation stage.' },
        { ar: 'الخطوة 8 تؤكد الأموال؛ وبعدها لا يُطلب مبلغ جديد — فالاستئناف قبلها.', en: 'Step 8 confirms funds; no new amount is prompted after it — so the resumption is before it.' },
        { ar: 'الرقم: 6.', en: 'The number: 6.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `MAIN = ["open app", "choose item", "pay", "confirm"]
ALTS = {}
# Try: ALTS[(2, "sold out")] = {"name": "A1 sold out",
#         "steps": ["show similar items"], "resume": 2}

def walk(events):
    events = dict(events)
    path, i, guard = [], 1, 0
    while i <= len(MAIN) and guard < 30:
        guard += 1
        cond = events.get(i, "ok")
        if cond != "ok" and (i, cond) in ALTS:
            alt = ALTS[(i, cond)]
            path.append(f"step{i} ALT({alt['name']})")
            for s in alt["steps"]:
                path.append(f"step{i}: {s}")
            del events[i]
            i = alt["resume"]
        else:
            path.append(f"step{i} ok")
            i += 1
    return " -> ".join(path)

print(walk({}))
# Try: print(walk({2: "sold out"})) after uncommenting A1 above.`,
      prompt: {
        ar: 'أضف لواحقك على قائمة البيع هذه (نفاد المخزون، فشل الدفع، إلغاء المستخدم)، ثم مرّر أحداثًا مختلفة لـ walk واقرأ المسار المطبوع في كل مرة.',
        en: 'Add your own alternatives to this shopping flow (sold out, payment failed, user cancelled), then feed walk different event dicts and read the printed path each time.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1-alt-anatomy',
          question: {
            ar: 'ما الذي يجب أن تسمّيه كل لاحقة بديلة حتى يفهم القارئ أين ينحرف الواقع عن المسار السعيد وأين يعود؟',
            en: 'What must every alternative flow name so the reader sees where reality departs from the happy path and where it returns?',
          },
          options: [
            { id: 'a', text: { ar: 'اسم مبرمجها وتاريخ كتابتها', en: 'Its author and date' } },
            { id: 'b', text: { ar: 'خطوة الالتحاق وشرطها — ونقطة استئنافها أو نهايتها', en: 'Its trigger step and condition — plus its resumption point or ending' } },
            { id: 'c', text: { ar: 'رقم القسم في الوثيقة', en: 'Its section number in the document' } },
            { id: 'd', text: { ar: 'عدد أسطرها تقريبًا', en: 'Its approximate line count' } },
          ],
          answer: 'b',
          explanation: {
            ar: '«عند الخطوة N إذا تحقق C» يحدد مكان الانحراف، و«يستأنف عند الخطوة K» يحدد مكان العودة — بدون هذا القرار الضائع.',
            en: '"At step N if C holds" locates the departure; "resume at step K" locates the rejoin — without these the structure is lost.',
          },
        },
        {
          id: 'q2-revisit-ch4',
          question: {
            ar: 'قبل أن نُفصّل تدفقات الأهداف هنا، بأي مصنوع من الفصل 4 كانت الأهداف قد رُتّبت وقُدِّرت؟',
            en: 'Before detailing goal flows here, which Chapter 4 artifact had sized and ordered those goals?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة الأعمال المتراكمة المرتبة (backlog) بعد التقدير والترتيب في خطة', en: 'The prioritized backlog, sized and ordered into a plan' } },
            { id: 'b', text: { ar: 'مخطط النشر', en: 'The deployment diagram' } },
            { id: 'c', text: { ar: 'تقرير تغطية الاختبارات', en: 'The test coverage report' } },
            { id: 'd', text: { ar: 'سجل الأخطاء', en: 'The bug tracker' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفصل 4 أخذ القصص وقدّرها ورتّبها في خطة؛ وحالات الاستخدام تأتي لتفصيل ما صعد إلى مقدمة القائمة.',
            en: 'Chapter 4 sized the stories and ordered them into a plan; use cases arrive to detail whatever climbed to the top of that list.',
          },
        },
        {
          id: 'q3-extension-point',
          question: {
            ar: 'أين تُعلَن نقطة الامتداد، ومن يحمل عليها سلوكه؟',
            en: 'Where is an extension point declared, and who attaches its behavior there?',
          },
          options: [
            { id: 'a', text: { ar: 'تُعلَن في الحالة الممتدة وتحمل عليه الأساس', en: 'Declared in the extending case; the base attaches to it' } },
            { id: 'b', text: { ar: 'تُعلَن في التدفق الأساسي كخطّاف مسمّى، وتحمل عليه الحالات الممتدة', en: 'Declared in the basic flow as a named hook; extending cases attach there' } },
            { id: 'c', text: { ar: 'تُعرَّف في قاعدة البيانات', en: 'Defined in the database' } },
            { id: 'd', text: { ar: 'تُرسم في مخطط الطبقات', en: 'Drawn in the layer diagram' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الأساسي يعلن «هنا قد يتفرع شيء» دون أن يعرف ما هو؛ والسلوك الاختياري يعيش في وثيقة مستقلة يتحقق شرطها عند النقطة.',
            en: 'The base declares "something may branch here" without knowing what; the optional behavior lives in its own document, gated by its condition at that point.',
          },
        },
        {
          id: 'q4-why-bounded',
          question: {
            ar: 'لماذا نكتب انقطاع الشبكة كلاحقة محدودة (الخطوات 4-8) لا كخمس لواحق خاصة؟',
            en: 'Why write the network loss as a bounded alternative (steps 4-8) rather than five specific alternatives?',
          },
          options: [
            { id: 'a', text: { ar: 'لكي تزيد الوثيقة حجمًا وتضخّمها', en: 'To make the document bigger' } },
            { id: 'b', text: { ar: 'لأن السلوك واحد: نسخة تُقال مرة وتسمّي مجالها، فلا تنحرف النسخ', en: 'Because the behavior is one: a single copy states it and names its range, so copies cannot drift' } },
            { id: 'c', text: { ar: 'لأن الأدوات لا تدعم الخمس نسخ', en: 'Because tools cannot handle five copies' } },
            { id: 'd', text: { ar: 'لأنه خطأ نادر لا يستحق الكتابة', en: 'Because it is a rare bug not worth writing' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'خمس نسخ للمعالجة نفسها تنحرف أول ما تُعدَّل واحدة؛ النسخة المحدودة تقولها مرة وتحدد النطاق — أصدق وأضغط.',
            en: 'Five copies of the same handling drift the first time one is edited; the bounded form says it once and names the scope — more honest and more compact.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'كتابة اللواحق قبل استقرار المسار الأساسي / writing alternatives before the basic flow is stable',
          right: 'ثبّت العمود الفقري أولًا؛ كل إعادة ترتيب تحرّك لواحقه / stabilize the spine first; every reorder drags its alternatives',
          note: {
            ar: 'اللواحق موزونة على أرقام الخطوات؛ تغيّر الترقيم يجعلها كلها قديمة.',
            en: 'Alternatives are anchored to step numbers; renumbering invalidates all of them at once.',
          },
        },
        {
          wrong: 'نسخ نفس معالجة الخطأ تحت كل خطوة / copying the same error handling under every step',
          right: 'لاحقة محدودة بمجال مسمّى: نسخة واحدة لا تنحرف / a bounded alternative with a named range: one copy that cannot drift',
          note: {
            ar: 'التكرار في المتطلبات يتصرف كالتكرار في الكود: يتضخم ويتباعد.',
            en: 'Duplication in requirements behaves like duplication in code: it grows and diverges.',
          },
        },
        {
          wrong: 'حشر منطق العميل المميز والعطل داخل التدفق الأساسي / stuffing premium-customer and holiday logic into the basic flow',
          right: 'نقطة امتداد تنقل القصة الشرطية إلى وثيقتها / an extension point moves the conditional story to its own document',
          note: {
            ar: 'التدفق الذي يتكلم عن كل شيء لا يتحدث عن شيء؛ خليط الشروط يخفي المسار الأصلي.',
            en: 'A flow about everything is about nothing; mixed conditions bury the original path.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'كل لاحقة تُسمّي أربعة: خطوة الالتحاق، الشرط، خطواتها، ونقطة استئنافها.',
          en: 'Every alternative names four things: its trigger step, its condition, its steps, and its resumption point.',
        },
        {
          ar: 'اللاحقة الخاصة خطوة واحدة؛ والمحدودة مجال خطوات؛ ونقطة الامتداد سلوك اختياري في وثيقة مستقلة.',
          en: 'A specific alternative is one step; a bounded one spans a range; an extension point hosts optional behavior in its own document.',
        },
        {
          ar: '«يستأنف عند 6» وعد بعدم إعادة السرد — الدرزة التي تربط اللاحقة بالعمود الفقري.',
          en: '"Resume at 6" is a promise not to re-narrate — the seam stitching the alternative back onto the spine.',
        },
        {
          ar: 'أضيق بناء يصلح للشرط: أقل تكرارًا، وأوضح قصة.',
          en: 'The narrowest structure that fits the condition: less duplication, clearer story.',
        },
      ],
      reflectPrompt: {
        ar: 'خذ تدفقًا من مشروعك واسأل عند كل خطوة: ماذا يمكن أن يحدث بدلًا من هذا؟ صنّف كل إجابة: لاحقة خاصة، محدودة، أم سلوك اختياري عند نقطة امتداد.',
        en: 'Take a flow from your project and ask at every step: what else could happen here? Classify each answer: a specific alternative, a bounded one, or optional behavior at an extension point.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch5.s2', pages: 'ص127-129 / pp.127-129' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch5.s2', pages: 'ص127-129 / pp.127-129' },
  ],
} satisfies Lesson;

export default lesson;
