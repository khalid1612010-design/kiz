/* =========================================================
 * KAIZEN — Customer Follow-up System
 * Vanilla JS + Supabase (Auth / Database / RLS / Realtime)
 * ========================================================= */
"use strict";

/* =========================================================
 * 1) CONFIGURATION
 * ======================================================= */
const CONFIG = {
  SUPABASE_URL : "https://jdydfjbfsrsfkqpwjlyo.supabase.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeWRmamJmc3JzZmtxcHdqbHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDMyODksImV4cCI6MjA5ODQ3OTI4OX0.2Yu1JP7xjKS-gT5o6N8b6KAw5lw7erCcnmO7793WDJE",
  COMPANY      : "Kaizen Adv. Agency",
  COMPANY_AR   : "كايزن للدعاية والإعلان",
  LOGO         : "https://kaizen-egypt.com/wp-content/uploads/2023/06/logo-web-1-01.png",
  TIMEZONE     : "Africa/Cairo",
  DAILY_TARGET : 50,
  ADMIN_PIN    : "2010"
};

const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON);

/* Surface unexpected runtime errors instead of failing silently */
window.addEventListener("error", e => console.error("[Kaizen] runtime:", e.message, e.filename, e.lineno));
window.addEventListener("unhandledrejection", e => console.error("[Kaizen] promise:", e.reason));

/** Follow-up result options (single source of truth) */
const RESULTS = [
  { key:"positive",  emoji:"🟢" },
  { key:"follow_up", emoji:"🟡" },
  { key:"negative",  emoji:"🔴" },
  { key:"no_answer", emoji:"⚫" }
];

/* =========================================================
 * 2) TRANSLATIONS
 * ======================================================= */
const I18N = {
  ar:{
    dir:"rtl", locale:"ar-EG",
    appName:"كايزن", appSub:"نظام متابعة العملاء",
    chooseRole:"اختر القسم", chooseRoleSub:"اختر طريقة الدخول للنظام",
    sales:"المبيعات", admin:"الإدارة",
    chooseEmployee:"اختر اسمك", chooseEmployeeSub:"اضغط على اسمك للدخول مباشرة",
    adminLogin:"دخول الإدارة", adminLoginSub:"أدخل كلمة المرور للمتابعة",
    salesLogin:"دخول المبيعات",
    email:"البريد الإلكتروني", password:"كلمة المرور", signIn:"تسجيل الدخول", back:"رجوع",
    signingIn:"جاري الدخول...", logout:"خروج",

    dashboard:"الرئيسية", customerLevels:"مستويات العملاء", overview:"نظرة عامة",
    employees:"الموظفون", customers:"العملاء", reports:"التقارير",

    dailyTarget:"الهدف اليومي", todayProgress:"إنجاز اليوم", ofTarget:"من الهدف",
    operationsToday:"العمليات المنفذة اليوم", achieved:"تم الإنجاز",
    greetingMorning:"صباح الخير", greetingEvening:"مساء الخير",

    addCustomer:"إضافة عميل", editCustomer:"تعديل بيانات العميل",
    customerName:"اسم العميل", phone:"رقم الهاتف", emailAddr:"البريد الإلكتروني",
    emailMessage:"رسالة بريد", callStatus:"مكالمة", emailSent:"تم إرسال البريد", callDone:"تمت المكالمة",
    followUpResult:"نتيجة المتابعة", level:"مستوى العميل", notes:"ملاحظات",
    notSet:"غير محدد", selectLevel:"اختر المستوى",
    save:"حفظ", saving:"جاري الحفظ...", cancel:"إلغاء", update:"تحديث", edit:"تعديل", delete:"حذف",
    confirmDelete:"هل تريد حذف هذا العميل نهائيًا؟", confirm:"تأكيد",

    r_positive:"مهتم", r_follow_up:"محتاج متابعة لاحقًا", r_negative:"غير مهتم", r_no_answer:"لم يرد",

    today:"اليوم", yesterday:"أمس", thisWeek:"هذا الأسبوع", thisMonth:"هذا الشهر",
    custom:"فترة مخصصة", from:"من تاريخ", to:"إلى تاريخ", date:"التاريخ", allTime:"كل الفترات",

    totalCustomers:"إجمالي العملاء", emailsSent:"رسائل البريد", callsMade:"المكالمات",
    interested:"عملاء مهتمون", needFollowUp:"يحتاجون متابعة", notInterested:"غير مهتمين", noAnswer:"لم يردوا",
    customersToday:"عملاء اليوم", customersWeek:"عملاء الأسبوع", customersMonth:"عملاء الشهر",
    byEmployee:"العملاء حسب الموظفة", byResult:"نتائج المتابعة", byLevel:"توزيع المستويات",
    activeEmployees:"الموظفون النشطون", avgPerEmployee:"متوسط لكل موظفة",

    noCustomers:"لا يوجد عملاء في هذه الفترة", noData:"لا توجد بيانات", noResults:"لا نتائج",
    createdAt:"وقت الإضافة", employee:"الموظفة", actions:"إجراءات", count:"العدد",
    allEmployees:"كل الموظفين", allResults:"كل النتائج", allLevels:"كل المستويات",
    filters:"الفلاتر", generateReport:"عرض التقرير", printReport:"طباعة التقرير",
    reportTitle:"تقرير متابعة العملاء", period:"الفترة", appliedFilters:"الفلاتر المطبقة",
    supervisor:"المشرف", generatedOn:"تاريخ الإصدار",
    selectEmployees:"الموظفون", selectResults:"نتائج المتابعة", selectLevels:"مستويات العملاء",
    viewDetails:"عرض التفاصيل", backToList:"رجوع للقائمة", performance:"الأداء",
    searchPlaceholder:"ابحث بالاسم أو الرقم أو البريد",

    errRequired:"هذا الحقل مطلوب", errEmail:"صيغة البريد الإلكتروني غير صحيحة",
    errPhone:"رقم الهاتف غير صحيح", errFill:"يرجى إكمال الحقول المطلوبة",
    errLogin:"البريد الإلكتروني أو كلمة المرور غير صحيحة",
    errNoProfile:"لا يوجد حساب موظف مرتبط بهذا المستخدم — تواصل مع الإدارة",
    errNoPerm:"ليس لديك صلاحية للوصول إلى هذا القسم",
    errLoad:"تعذّر تحميل البيانات — تحقق من الاتصال",
    errSave:"تعذّر حفظ البيانات — حاول مرة أخرى",
    errDelete:"تعذّر حذف السجل", errNetwork:"لا يوجد اتصال بالإنترنت",
    errSetup:"قاعدة البيانات غير مهيأة",
    setupHint:"شغّل ملف supabase-setup.sql في Supabase ثم حدّث الصفحة", retry:"إعادة المحاولة",
    hintRls:"الاتصال ناجح لكن الجدول رجع فارغًا — غالبًا RLS مفعّل بدون سياسة، أو الجدول لا يحتوي بيانات",
    okSaved:"تم الحفظ بنجاح", okUpdated:"تم التحديث بنجاح", okDeleted:"تم الحذف",
    backOnline:"عاد الاتصال بالإنترنت", offline:"أنت غير متصل بالإنترنت",
    nothingToPrint:"لا توجد بيانات للطباعة"
  },
  en:{
    dir:"ltr", locale:"en-GB",
    appName:"Kaizen", appSub:"Customer Follow-up System",
    chooseRole:"Choose Section", chooseRoleSub:"Select how you want to sign in",
    sales:"Sales", admin:"Admin",
    chooseEmployee:"Choose Your Name", chooseEmployeeSub:"Tap your name to sign in instantly",
    adminLogin:"Admin Login", adminLoginSub:"Enter your password to continue",
    salesLogin:"Sales Login",
    email:"Email", password:"Password", signIn:"Sign In", back:"Back",
    signingIn:"Signing in...", logout:"Logout",

    dashboard:"Dashboard", customerLevels:"Customer Levels", overview:"Overview",
    employees:"Employees", customers:"Customers", reports:"Reports",

    dailyTarget:"Daily Target", todayProgress:"Today's Progress", ofTarget:"of target",
    operationsToday:"Operations completed today", achieved:"Achieved",
    greetingMorning:"Good Morning", greetingEvening:"Good Evening",

    addCustomer:"Add Customer", editCustomer:"Edit Customer",
    customerName:"Customer Name", phone:"Phone Number", emailAddr:"Email",
    emailMessage:"Email Message", callStatus:"Call", emailSent:"Email Sent", callDone:"Call Made",
    followUpResult:"Follow-up Result", level:"Customer Level", notes:"Notes",
    notSet:"Not set", selectLevel:"Select level",
    save:"Save", saving:"Saving...", cancel:"Cancel", update:"Update", edit:"Edit", delete:"Delete",
    confirmDelete:"Delete this customer permanently?", confirm:"Confirm",

    r_positive:"Positive", r_follow_up:"Follow Up", r_negative:"Negative", r_no_answer:"No Answer",

    today:"Today", yesterday:"Yesterday", thisWeek:"This Week", thisMonth:"This Month",
    custom:"Custom Range", from:"From", to:"To", date:"Date", allTime:"All Time",

    totalCustomers:"Total Customers", emailsSent:"Emails Sent", callsMade:"Calls Made",
    interested:"Interested", needFollowUp:"Need Follow Up", notInterested:"Not Interested", noAnswer:"No Answer",
    customersToday:"Customers Today", customersWeek:"This Week", customersMonth:"This Month",
    byEmployee:"Customers by Employee", byResult:"Follow-up Results", byLevel:"Level Distribution",
    activeEmployees:"Active Employees", avgPerEmployee:"Avg / Employee",

    noCustomers:"No customers in this period", noData:"No data", noResults:"No results",
    createdAt:"Added At", employee:"Employee", actions:"Actions", count:"Count",
    allEmployees:"All Employees", allResults:"All Results", allLevels:"All Levels",
    filters:"Filters", generateReport:"Generate Report", printReport:"Print Report",
    reportTitle:"Customer Follow-up Report", period:"Period", appliedFilters:"Applied Filters",
    supervisor:"Supervisor", generatedOn:"Generated on",
    selectEmployees:"Employees", selectResults:"Follow-up Results", selectLevels:"Customer Levels",
    viewDetails:"View Details", backToList:"Back to list", performance:"Performance",
    searchPlaceholder:"Search by name, phone or email",

    errRequired:"This field is required", errEmail:"Invalid email format",
    errPhone:"Invalid phone number", errFill:"Please complete the required fields",
    errLogin:"Incorrect email or password",
    errNoProfile:"No employee profile linked to this account — contact admin",
    errNoPerm:"You don't have permission to access this section",
    errLoad:"Could not load data — check your connection",
    errSave:"Could not save — please try again",
    errDelete:"Could not delete record", errNetwork:"No internet connection",
    errSetup:"Database not initialised",
    setupHint:"Run supabase-setup.sql in Supabase then refresh this page", retry:"Retry",
    hintRls:"Connected but the table returned 0 rows — RLS is likely enabled without a policy, or the table is empty",
    okSaved:"Saved successfully", okUpdated:"Updated successfully", okDeleted:"Deleted",
    backOnline:"Back online", offline:"You are offline",
    nothingToPrint:"Nothing to print"
  }
};

let LANG = localStorage.getItem("kz_lang") || "ar";
const t = k => (I18N[LANG] && I18N[LANG][k]) || k;
const applyLangToDocument = () => {
  document.documentElement.lang = LANG;
  document.documentElement.dir  = I18N[LANG].dir;
};
applyLangToDocument();

/* =========================================================
 * 3) APPLICATION STATE
 * ======================================================= */
const State = {
  session   : null,   // supabase session
  profile   : null,   // row from employees table
  employees : [],     // all employees (admin) / public list (login)
  levels    : [],     // customer_levels rows
  lastError : null,   // last data-layer error message (shown on setup screen)
  view      : "dashboard",
  authStep  : "role", // role | salesPick | salesPass | adminLogin
  pickedEmp : null,
  // sales
  salesDate : null,      // yyyy-mm-dd
  levelFilter: "all",
  // admin
  adminRange : "today",
  adminEmpId : null,
  report     : { employees:[], results:[], levels:[], range:"today", from:null, to:null, rows:null }
};

/* =========================================================
 * 4) UTILITIES
 * ======================================================= */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

/* ---- Timezone-safe date helpers (company timezone) ---- */
function tzOffset(dateKey){
  try{
    const d = new Date(dateKey + "T12:00:00Z");
    const s = new Intl.DateTimeFormat("en-US",{ timeZone:CONFIG.TIMEZONE, timeZoneName:"longOffset" }).format(d);
    const m = s.match(/GMT([+-]\d{2}:\d{2})/);
    return m ? m[1] : "+02:00";
  }catch{ return "+02:00"; }
}
/** today's date key (YYYY-MM-DD) in company timezone */
function todayKey(){
  return new Intl.DateTimeFormat("en-CA",{ timeZone:CONFIG.TIMEZONE }).format(new Date());
}
function shiftKey(key, days){
  const d = new Date(key + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0,10);
}
function weekStartKey(){
  const k = todayKey();
  const dow = (new Date(k + "T12:00:00Z").getUTCDay() + 6) % 7; // Monday = 0
  return shiftKey(k, -dow);
}
function monthStartKey(){ return todayKey().slice(0,8) + "01"; }
/** Convert a local (company tz) date key to absolute UTC boundaries */
const dayStartISO = k => new Date(`${k}T00:00:00${tzOffset(k)}`).toISOString();
const dayEndISO   = k => new Date(`${k}T23:59:59.999${tzOffset(k)}`).toISOString();

function fmtDate(v){
  if(!v) return "—";
  const d = typeof v === "string" && v.length === 10 ? new Date(v+"T12:00:00Z") : new Date(v);
  return d.toLocaleDateString(I18N[LANG].locale,{ day:"numeric", month:"short", year:"numeric", timeZone:CONFIG.TIMEZONE });
}
function fmtDateLong(v){
  const d = typeof v === "string" && v.length === 10 ? new Date(v+"T12:00:00Z") : new Date(v);
  return d.toLocaleDateString(I18N[LANG].locale,{ weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:CONFIG.TIMEZONE });
}
function fmtTime(v){
  return new Date(v).toLocaleTimeString(I18N[LANG].locale,{ hour:"2-digit", minute:"2-digit", timeZone:CONFIG.TIMEZONE });
}

/* ---- Misc ---- */
const empName    = e => !e ? "—" : (LANG === "ar" ? e.name_ar : e.name_en);
const levelName  = key => { const l = State.levels.find(x=>x.key===key); return l ? (LANG==="ar"?l.name_ar:l.name_en) : null; };
const resultLabel= key => t("r_" + (key || "follow_up"));
const resultEmoji= key => (RESULTS.find(r=>r.key===key) || RESULTS[1]).emoji;
const pct = (n, d) => d ? Math.round((n / d) * 100) : 0;

function resultBadge(key){
  const k = key || "follow_up";
  return `<span class="badge b-${k}">${resultEmoji(k)} ${esc(resultLabel(k))}</span>`;
}
function levelBadge(key){
  const n = levelName(key);
  return n ? `<span class="badge b-level">${esc(n)}</span>`
           : `<span class="badge b-none">${t("notSet")}</span>`;
}
function yesNo(v){
  return v ? `<span class="badge b-yes">✓</span>` : `<span class="badge b-no">—</span>`;
}

/* ---- Validation ---- */
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = v => /^[+()\-\s\d]{6,20}$/.test(v);

/* ---- Icons ---- */
const IC = {
  dash:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  layers:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" stroke-linejoin="round"/></svg>',
  users:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.7-3.5 3.3-5.5 6.5-5.5s5.8 2 6.5 5.5" stroke-linecap="round"/><circle cx="17.5" cy="9" r="2.6"/><path d="M16 14.6c2.8.2 4.9 2 5.5 4.9" stroke-linecap="round"/></svg>',
  user:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.2 3.9-6.5 8-6.5s7.2 2.3 8 6.5" stroke-linecap="round"/></svg>',
  shield:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2l8 3.5v6c0 5-3.4 9.4-8 10.5-4.6-1.1-8-5.5-8-10.5v-6L12 2z" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chart:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3" stroke-linecap="round"/></svg>',
  doc:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke-linejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke-linecap="round"/></svg>',
  plus:'<svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
  edit:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round"/></svg>',
  print:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x:'<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>',
  mail:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6" stroke-linecap="round"/></svg>',
  phone:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.8 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  globe:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>',
  out:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H6a2 2 0 01-2-2V5a2 2 0 012-2h3M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  menu:'<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>',
  trend:'<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8M15 7h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  target:'<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  back:'<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* =========================================================
 * 5) UI PRIMITIVES — toast / modal / confirm
 * ======================================================= */
function toast(msg, type = "s"){
  const icons = { s:IC.check, e:IC.x, w:IC.trend, i:IC.doc };
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = `<div class="ti">${icons[type] || icons.i}</div><div>${esc(msg)}</div>`;
  $("#toasts").appendChild(el);
  setTimeout(()=>{ el.style.transition=".3s"; el.style.opacity="0"; el.style.transform="translateY(10px)";
    setTimeout(()=>el.remove(), 300); }, 3400);
}

function openModal(html, maxWidth = 560){
  $("#modalRoot").innerHTML =
    `<div class="modal-bg" onclick="if(event.target===this)closeModal()">
       <div class="modal" style="max-width:${maxWidth}px" role="dialog" aria-modal="true">${html}</div>
     </div>`;
  document.addEventListener("keydown", escClose);
}
function closeModal(){ $("#modalRoot").innerHTML = ""; document.removeEventListener("keydown", escClose); }
function escClose(e){ if(e.key === "Escape") closeModal(); }

function confirmModal(message, onConfirm){
  openModal(`
    <h3>${t("confirm")}<button class="x" onclick="closeModal()">${IC.x}</button></h3>
    <p style="color:var(--muted);line-height:1.7;margin-bottom:6px">${esc(message)}</p>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-danger" id="cfmYes">${t("confirm")}</button>
    </div>`, 430);
  $("#cfmYes").onclick = () => { closeModal(); onConfirm(); };
}

/** Map a Supabase error to a friendly, translated message */
function friendlyError(error, fallbackKey = "errLoad"){
  const m = (error && error.message ? error.message : "").toLowerCase();
  if(!navigator.onLine)                              return t("errNetwork");
  if(m.includes("invalid login") || m.includes("credentials")) return t("errLogin");
  if(m.includes("row-level security") || m.includes("policy")) return t("errNoPerm");
  if(m.includes("does not exist") || m.includes("schema cache") || m.includes("relation")) return t("errSetup");
  if(m.includes("failed to fetch") || m.includes("networkerror"))  return t("errNetwork");
  return t(fallbackKey);
}

/* =========================================================
 * 6) DATA ACCESS LAYER
 * ======================================================= */
const Data = {
  async loadEmployees(){
    const { data, error } = await sb.from("employees").select("*");
    if(error){
      console.error("[Kaizen] employees error:", error.message, error);
      State.lastError = error.message;
      throw error;
    }
    const rows = data || [];
    console.log("[Kaizen] raw employees from Supabase:", rows.length, rows);

    // Normalise: tolerate legacy/renamed columns so the UI never ends up empty
    State.employees = rows
      .filter(e => e.active !== false)
      .map(e => ({
        id        : e.id,
        name_ar   : e.name_ar || e.name || "—",
        name_en   : e.name_en || e.name || "—",
        role      : (e.role || "sales").toLowerCase().trim(),
        active    : e.active !== false,
        sort_order: e.sort_order ?? 0
      }))
      .sort((a,b) => a.sort_order - b.sort_order);

    State.lastError = State.employees.length ? null : "empty-table";
    console.log("[Kaizen] usable employees:", State.employees.length, State.employees);
    return State.employees;
  },

  async loadLevels(){
    const { data, error } = await sb.from("customer_levels").select("*");
    if(error){
      console.warn("[Kaizen] levels error:", error.message);
      State.levels = [];
      return State.levels;   // non-fatal: app still works without levels
    }
    State.levels = (data || []).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    console.log("[Kaizen] levels loaded:", State.levels.length);
    return State.levels;
  },

  /**
   * Fetch customers with optional filters.
   * @param {{employeeIds?:string[], from?:string, to?:string, results?:string[], levels?:string[]}} f
   */
  async customers(f = {}){
    let q = sb.from("customers").select("*").order("created_at", { ascending:false });
    if(f.employeeIds && f.employeeIds.length) q = q.in("employee_id", f.employeeIds);
    if(f.from) q = q.gte("created_at", dayStartISO(f.from));
    if(f.to)   q = q.lte("created_at", dayEndISO(f.to));
    if(f.results && f.results.length) q = q.in("follow_up_result", f.results);
    if(f.levels && f.levels.length){
      const withNull = f.levels.includes("__none__");
      const real = f.levels.filter(x => x !== "__none__");
      if(withNull && real.length)      q = q.or(`customer_level.is.null,customer_level.in.(${real.join(",")})`);
      else if(withNull)                q = q.is("customer_level", null);
      else                             q = q.in("customer_level", real);
    }
    const { data, error } = await q;
    if(error) throw error;
    return data || [];
  },

  async insertCustomer(payload){
    const { data, error } = await sb.from("customers").insert(payload).select().single();
    if(error) throw error;
    return data;
  },
  async updateCustomer(id, payload){
    const { data, error } = await sb.from("customers")
      .update({ ...payload, updated_at:new Date().toISOString() }).eq("id", id).select().single();
    if(error) throw error;
    return data;
  },
  async deleteCustomer(id){
    const { error } = await sb.from("customers").delete().eq("id", id);
    if(error) throw error;
  }
};

/* Aggregate helpers (pure functions over a customer array) */
const Stats = {
  summary(rows){
    return {
      total     : rows.length,
      emails    : rows.filter(r => r.email_sent).length,
      calls     : rows.filter(r => r.call_completed).length,
      positive  : rows.filter(r => r.follow_up_result === "positive").length,
      follow_up : rows.filter(r => r.follow_up_result === "follow_up").length,
      negative  : rows.filter(r => r.follow_up_result === "negative").length,
      no_answer : rows.filter(r => r.follow_up_result === "no_answer").length
    };
  },
  byLevel(rows){
    const map = {};
    State.levels.forEach(l => map[l.key] = 0);
    map.__none__ = 0;
    rows.forEach(r => { const k = r.customer_level || "__none__"; map[k] = (map[k] || 0) + 1; });
    return map;
  },
  byEmployee(rows){
    const map = {};
    rows.forEach(r => map[r.employee_id] = (map[r.employee_id] || 0) + 1);
    return map;
  }
};

/* =========================================================
 * 7) REALTIME
 * ======================================================= */
let rtChannel = null;
let rtTimer   = null;

function startRealtime(){
  stopRealtime();
  rtChannel = sb.channel("kz-customers")
    .on("postgres_changes", { event:"*", schema:"public", table:"customers" }, () => {
      clearTimeout(rtTimer);
      rtTimer = setTimeout(() => renderContent(), 350); // debounce bursts
    })
    .subscribe();
}
function stopRealtime(){ if(rtChannel){ sb.removeChannel(rtChannel); rtChannel = null; } }

/* =========================================================
 * 8) AUTHENTICATION
 * ======================================================= */
const SESSION_KEY = "kz_session_emp";

const Auth = {
  /** Sales: one tap, no credentials at all. */
  signInAsSales(employee){
    State.profile = employee;
    localStorage.setItem(SESSION_KEY, employee.id);
  },

  /** Admin: PIN check. */
  signInAsAdmin(pin){
    if(String(pin).trim() !== CONFIG.ADMIN_PIN) throw new Error("invalid login");
    const admin = State.employees.find(e => e.role === "admin")
      || { id:"__admin__", name_ar:"الإدارة", name_en:"Admin", role:"admin", active:true };
    State.profile = admin;
    localStorage.setItem(SESSION_KEY, admin.id);
    return admin;
  },

  signOut(){
    stopRealtime();
    localStorage.removeItem(SESSION_KEY);
    State.profile = null;
    State.authStep = "role";
    State.pickedEmp = null;
    renderAuth();
  },

  /** Restore a previous session from localStorage. */
  restore(){
    const id = localStorage.getItem(SESSION_KEY);
    if(!id) return false;
    if(id === "__admin__"){
      State.profile = State.employees.find(e => e.role === "admin")
        || { id:"__admin__", name_ar:"الإدارة", name_en:"Admin", role:"admin", active:true };
      return true;
    }
    const emp = State.employees.find(e => e.id === id && e.active);
    if(!emp){ localStorage.removeItem(SESSION_KEY); return false; }
    State.profile = emp;
    return true;
  }
};

/* =========================================================
 * 9) AUTH SCREENS
 * ======================================================= */
function renderAuth(){
  $("#appView").classList.remove("on");
  const box = $("#authView");
  box.style.display = "flex";

  const logo = `<div class="auth-logo"><img src="${CONFIG.LOGO}" alt="Kaizen"></div>`;
  const langBtn = `<button class="lang-pill" style="margin-top:22px" onclick="switchLang()">${IC.globe} ${LANG==="ar"?"English":"العربية"}</button>`;
  let inner = "";

  if(State.authStep === "role"){
    inner = `${logo}
      <h1>${t("chooseRole")}</h1>
      <div class="auth-sub">${t("chooseRoleSub")}</div>
      <div class="role-grid">
        <button class="role-btn" onclick="goAuth('salesPick')">${IC.users}<span>${t("sales")}</span></button>
        <button class="role-btn" onclick="goAuth('adminLogin')">${IC.shield}<span>${t("admin")}</span></button>
      </div>${langBtn}`;
  }

  else if(State.authStep === "salesPick"){
    const list = State.employees.filter(e => e.role === "sales");
    inner = `<span class="back-link" onclick="goAuth('role')">${IC.back} ${t("back")}</span>
      ${logo}
      <h1>${t("chooseEmployee")}</h1>
      <div class="auth-sub">${t("chooseEmployeeSub")}</div>
      <div class="emp-pick">
        ${list.length ? list.map(e => `
          <button id="emp_${e.id}" onclick="pickEmployee('${e.id}')">
            <span class="avatar" style="width:38px;height:38px;font-size:15px">${esc(empName(e)[0] || "?")}</span>
            <span style="flex:1"><b>${esc(empName(e))}</b><span>${t("sales")}</span></span>
            <span class="pick-go">${IC.back}</span>
          </button>`).join("")
        : `<div class="setup-warn">${IC.shield}<div>
             <b>${t("errSetup")}</b>
             <span>${t("setupHint")}</span>
             ${State.lastError === "empty-table"
               ? `<span style="display:block;margin-top:8px;font-size:12px;color:var(--danger-dark)">⚠️ ${t("hintRls")}</span>`
               : State.lastError
               ? `<span style="display:block;margin-top:8px;font-family:monospace;font-size:11px;color:var(--danger-dark);word-break:break-word">${esc(State.lastError)}</span>` : ""}
             <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="retryLoad()">${t("retry")}</button>
           </div></div>`}
      </div>${langBtn}`;
  }

  else { // adminLogin — PIN only
    inner = `<span class="back-link" onclick="goAuth('role')">${IC.back} ${t("back")}</span>
      ${logo}
      <h1>${t("adminLogin")}</h1>
      <div class="auth-sub">${t("adminLoginSub")}</div>
      <form class="auth-form" onsubmit="return doAdminLogin(event)">
        <div>
          <label>${t("password")}</label>
          <input type="password" id="pw" required inputmode="numeric" autocomplete="off"
                 placeholder="••••" style="text-align:center;letter-spacing:6px;font-size:20px;font-weight:800">
        </div>
        <button type="submit" class="btn btn-primary btn-block" id="loginBtn">${t("signIn")}</button>
      </form>${langBtn}`;
  }

  box.innerHTML = `<div class="auth-card">${inner}</div>`;
  setTimeout(() => { const f = $("#pw"); f && f.focus(); }, 80);
}

window.goAuth = async (step) => {
  State.authStep = step;
  renderAuth();
  // Always (re)fetch the employee list when opening the sales picker
  if(step === "salesPick"){
    try{
      await Data.loadEmployees();
      if(!State.levels.length) await Data.loadLevels();
      renderAuth();
    }catch(err){
      console.error("[goAuth]", err);
      renderAuth();
    }
  }
};

/** Reload employees/levels from Supabase and re-render the auth screen. */
window.retryLoad = async () => {
  try{
    await Data.loadEmployees();
    await Data.loadLevels();
    renderAuth();
    if(State.employees.length) toast(t("okSaved"), "s");
    else toast(t("errSetup"), "w");
  }catch(err){
    console.error(err);
    toast(friendlyError(err, "errSetup"), "e");
  }
};

/** One-tap sales login: employee only taps their name. */
window.pickEmployee = async (id) => {
  const emp = State.employees.find(e => e.id === id);
  if(!emp) return;
  const btn = $("#emp_" + id);
  if(btn){
    btn.disabled = true;
    btn.style.opacity = ".65";
    btn.querySelector(".pick-go").innerHTML =
      `<span class="spin" style="border-color:rgba(27,58,92,.25);border-top-color:var(--gold)"></span>`;
  }
  try{
    Auth.signInAsSales(emp);
    await startApp();
  }catch(err){
    console.error(err);
    toast(friendlyError(err, "errLogin"), "e");
    if(btn){ btn.disabled = false; btn.style.opacity = "1"; btn.querySelector(".pick-go").innerHTML = IC.back; }
  }
};

/** Admin login with PIN only. */
window.doAdminLogin = async (ev) => {
  ev.preventDefault();
  const btn = $("#loginBtn");
  const pin = $("#pw").value.trim();
  if(!pin){ toast(t("errFill"), "w"); return false; }

  btn.disabled = true;
  btn.innerHTML = `<span class="spin"></span> ${t("signingIn")}`;
  try{
    Auth.signInAsAdmin(pin);
    await startApp();
  }catch(err){
    toast(t("errLogin"), "e");
    btn.disabled = false;
    btn.textContent = t("signIn");
    const f = $("#pw"); if(f){ f.value = ""; f.focus(); }
  }
  return false;
};

window.switchLang = () => {
  LANG = LANG === "ar" ? "en" : "ar";
  localStorage.setItem("kz_lang", LANG);
  applyLangToDocument();
  if(State.profile) renderApp(); else renderAuth();
};

/* =========================================================
 * 10) APP SHELL
 * ======================================================= */
async function startApp(){
  $("#authView").style.display = "none";
  $("#appView").classList.add("on");
  State.view = State.profile.role === "admin" ? "overview" : "dashboard";
  State.salesDate = todayKey();
  if(!State.levels.length){ try{ await Data.loadLevels(); }catch(e){} }
  startRealtime();
  renderApp();
}

function renderApp(){ renderSidebar(); renderTopbar(); renderContent(); }

function navItems(){
  return State.profile.role === "admin"
    ? [["overview",IC.dash,"overview"], ["employees",IC.users,"employees"],
       ["customers",IC.doc,"customers"], ["reports",IC.chart,"reports"]]
    : [["dashboard",IC.dash,"dashboard"], ["levels",IC.layers,"customerLevels"]];
}

function renderSidebar(){
  const p = State.profile;
  $("#sidebar").innerHTML = `
    <div class="side-head">
      <div class="side-logo"><img src="${CONFIG.LOGO}" alt=""></div>
      <div><b>${esc(CONFIG.COMPANY)}</b><span>${LANG==="ar"?esc(CONFIG.COMPANY_AR):t("appSub")}</span></div>
    </div>
    <div class="side-user">
      <div class="av">${esc(empName(p)[0] || "?")}</div>
      <div><b>${esc(empName(p))}</b><span>${p.role === "admin" ? t("admin") : t("sales")}</span></div>
    </div>
    <nav class="side-nav">
      ${navItems().map(([v,ic,label]) => `
        <button class="nav-item ${State.view===v?"active":""}" onclick="navTo('${v}')">${ic}<span>${t(label)}</span></button>
      `).join("")}
    </nav>
    <div class="side-foot">
      <button class="logout-btn" onclick="doLogout()">${IC.out}<span>${t("logout")}</span></button>
    </div>`;
}

function renderTopbar(){
  $("#topbar").innerHTML = `
    <button class="icon-btn menu-btn" onclick="toggleSidebar(true)" aria-label="menu">${IC.menu}</button>
    <div class="top-date"><b id="tbD"></b><span id="tbT"></span></div>
    <button class="lang-pill" onclick="switchLang()">${IC.globe} ${LANG==="ar"?"English":"العربية"}</button>`;
  tickClock();
}
let clockT;
function tickClock(){
  const now = new Date();
  const d = $("#tbD"), tm = $("#tbT");
  if(d)  d.textContent  = now.toLocaleDateString(I18N[LANG].locale,{ weekday:"long", day:"numeric", month:"long", timeZone:CONFIG.TIMEZONE });
  if(tm) tm.textContent = now.toLocaleTimeString(I18N[LANG].locale,{ hour:"2-digit", minute:"2-digit", timeZone:CONFIG.TIMEZONE });
  clearTimeout(clockT); clockT = setTimeout(tickClock, 20000);
}

window.navTo = v => { State.view = v; State.adminEmpId = null; toggleSidebar(false); renderApp(); window.scrollTo({top:0}); };
window.toggleSidebar = open => {
  $("#sidebar").classList.toggle("open", open);
  $("#sideOverlay").classList.toggle("on", open);
};
window.doLogout = () => Auth.signOut();

/* ---- Content router ---- */
async function renderContent(){
  const c = $("#content");
  const skeleton = `<div class="empty">…</div>`;
  try{
    if(State.profile.role === "sales"){
      if(State.view === "levels") c.innerHTML = await viewSalesLevels();
      else                        c.innerHTML = await viewSalesDashboard();
    }else{
      if(State.adminEmpId)              c.innerHTML = await viewEmployeeDetail(State.adminEmpId);
      else if(State.view === "employees") c.innerHTML = await viewAdminEmployees();
      else if(State.view === "customers") c.innerHTML = await viewAdminCustomers();
      else if(State.view === "reports")   c.innerHTML = await viewAdminReports();
      else                                c.innerHTML = await viewAdminOverview();
    }
  }catch(err){
    console.error(err);
    c.innerHTML = `<div class="card pad"><div class="empty">${esc(friendlyError(err))}</div></div>`;
  }
}

/* =========================================================
 * 11) SALES — DASHBOARD
 * ======================================================= */
async function viewSalesDashboard(){
  const me   = State.profile;
  const date = State.salesDate || todayKey();
  const rows = await Data.customers({ employeeIds:[me.id], from:date, to:date });
  const s    = Stats.summary(rows);
  const isToday = date === todayKey();
  const done = s.total, target = CONFIG.DAILY_TARGET;
  const percent = pct(done, target);
  const ringPct = Math.min(100, percent);
  const C = 2 * Math.PI * 52;
  const hour = Number(new Intl.DateTimeFormat("en-GB",{hour:"2-digit",hour12:false,timeZone:CONFIG.TIMEZONE}).format(new Date()));

  return `
  <div class="page-head">
    <div>
      <h1 class="page-title">${hour < 12 ? t("greetingMorning") : t("greetingEvening")}, ${esc(empName(me))}</h1>
      <div class="page-sub">${fmtDateLong(date)}</div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="printSalesDay()">${IC.print} ${t("printReport")}</button>
      ${isToday ? `<button class="btn btn-primary" onclick="openCustomerModal()">${IC.plus} ${t("addCustomer")}</button>` : ""}
    </div>
  </div>

  <!-- Daily target -->
  <div class="target-hero">
    <div class="ring">
      <svg width="120" height="120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(27,58,92,.10)" stroke-width="11"/>
        <circle cx="60" cy="60" r="52" fill="none" stroke="#E8971E" stroke-width="11" stroke-linecap="round"
                stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ringPct/100)}"
                style="transition:stroke-dashoffset .7s cubic-bezier(.22,.9,.3,1)"/>
      </svg>
      <div class="mid"><b>${percent}%</b><span>${t("achieved")}</span></div>
    </div>
    <div class="target-info">
      <h2>${t("dailyTarget")}</h2>
      <div style="color:var(--muted);font-size:13.5px">${t("operationsToday")}</div>
      <div class="target-count">${done} <small>/ ${target}</small></div>
      <div class="tbar"><i style="width:${ringPct}%"></i></div>
    </div>
  </div>

  <!-- Quick stats -->
  <div class="grid g4" style="margin-bottom:20px">
    ${statCard("emailsSent",  s.emails,   IC.mail,  "#2A5082")}
    ${statCard("callsMade",   s.calls,    IC.phone, "#E8971E")}
    ${statCard("interested",  s.positive, IC.check, "#22C55E")}
    ${statCard("needFollowUp",s.follow_up,IC.trend, "#C77D12")}
  </div>

  <!-- Date filter -->
  <div class="card filter-bar">
    <div><label>${t("date")}</label><input type="date" value="${date}" max="${todayKey()}" onchange="setSalesDate(this.value)"></div>
    <div style="min-width:auto"><button class="btn btn-outline btn-sm" onclick="setSalesDate('${todayKey()}')">${t("today")}</button></div>
    ${!isToday ? `<div style="color:var(--gold-dark);font-size:13px;font-weight:700;min-width:auto">${t("noCustomers")===""?"":""}</div>` : ""}
  </div>

  <!-- Customers table -->
  <div class="card table-wrap">
    <table>
      <thead><tr>
        <th class="row-no">#</th>
        <th>${t("customerName")}</th>
        <th>${t("phone")}</th>
        <th>${t("emailAddr")}</th>
        <th>${t("emailMessage")}</th>
        <th>${t("callStatus")}</th>
        <th>${t("followUpResult")}</th>
        <th>${t("level")}</th>
        <th>${t("notes")}</th>
        <th>${t("createdAt")}</th>
        <th>${t("actions")}</th>
      </tr></thead>
      <tbody>
        ${rows.length ? rows.slice().reverse().map((r,i) => `
          <tr>
            <td class="row-no">${i+1}</td>
            <td><b>${esc(r.customer_name)}</b></td>
            <td class="ltr">${esc(r.phone || "—")}</td>
            <td class="ltr" style="font-size:13px">${esc(r.email || "—")}</td>
            <td>${yesNo(r.email_sent)}</td>
            <td>${yesNo(r.call_completed)}</td>
            <td>${resultBadge(r.follow_up_result)}</td>
            <td>${levelBadge(r.customer_level)}</td>
            <td style="max-width:190px;font-size:13px;color:var(--muted)">${esc(r.notes || "—")}</td>
            <td class="ltr" style="font-size:12.5px;color:var(--muted)">${fmtTime(r.created_at)}</td>
            <td><div class="cell-actions">
              <button class="act" title="${t("edit")}" onclick="openCustomerModal('${r.id}')">${IC.edit}</button>
              <button class="act danger" title="${t("delete")}" onclick="removeCustomer('${r.id}')">${IC.trash}</button>
            </div></td>
          </tr>`).join("")
        : `<tr><td colspan="11"><div class="empty">${t("noCustomers")}</div></td></tr>`}
      </tbody>
    </table>
  </div>`;
}

function statCard(labelKey, value, icon, color){
  return `<div class="stat">
    <div class="row"><span class="lbl">${t(labelKey)}</span>
      <span class="ic" style="background:${color}1a;color:${color}">${icon}</span></div>
    <div class="val">${value}</div>
  </div>`;
}

window.setSalesDate = v => { State.salesDate = v || todayKey(); renderContent(); };

/* =========================================================
 * 12) SALES — CUSTOMER LEVELS
 * ======================================================= */
async function viewSalesLevels(){
  const rows  = await Data.customers({ employeeIds:[State.profile.id] });
  const byLv  = Stats.byLevel(rows);
  const sel   = State.levelFilter;
  const list  = sel === "all" ? rows
              : sel === "__none__" ? rows.filter(r => !r.customer_level)
              : rows.filter(r => r.customer_level === sel);

  const cards = State.levels.map((l,i) => `
    <div class="level-card ${sel===l.key?"on":""}" style="animation-delay:${i*60}ms" onclick="setLevelFilter('${l.key}')">
      <div class="lv-top"><div class="lv-dot">${i+1}</div><div><b>${esc(LANG==="ar"?l.name_ar:l.name_en)}</b>
        <span class="lv-sub">${t("count")}</span></div></div>
      <div class="lv-count">${byLv[l.key] || 0}</div>
    </div>`).join("");

  return `
  <div class="page-head">
    <div><h1 class="page-title">${t("customerLevels")}</h1>
    <div class="page-sub">${esc(empName(State.profile))}</div></div>
  </div>

  <div class="grid g4" style="margin-bottom:8px">
    ${cards}
    <div class="level-card ${sel==="__none__"?"on":""}" onclick="setLevelFilter('__none__')">
      <div class="lv-top"><div class="lv-dot" style="background:linear-gradient(135deg,#8CA3BA,#5A7A9B)">—</div>
        <div><b>${t("notSet")}</b><span class="lv-sub">${t("count")}</span></div></div>
      <div class="lv-count">${byLv.__none__ || 0}</div>
    </div>
  </div>

  <div class="chips" style="margin:18px 0">
    <button class="chip ${sel==="all"?"on":""}" onclick="setLevelFilter('all')">${t("allLevels")} (${rows.length})</button>
    ${State.levels.map(l => `<button class="chip ${sel===l.key?"on":""}" onclick="setLevelFilter('${l.key}')">${esc(LANG==="ar"?l.name_ar:l.name_en)} (${byLv[l.key]||0})</button>`).join("")}
    <button class="chip ${sel==="__none__"?"on":""}" onclick="setLevelFilter('__none__')">${t("notSet")} (${byLv.__none__||0})</button>
  </div>

  <div class="card table-wrap">
    <table>
      <thead><tr>
        <th class="row-no">#</th><th>${t("customerName")}</th><th>${t("phone")}</th>
        <th>${t("emailAddr")}</th><th>${t("followUpResult")}</th><th>${t("level")}</th>
        <th>${t("date")}</th><th>${t("actions")}</th>
      </tr></thead>
      <tbody>${list.length ? list.map((r,i)=>`
        <tr>
          <td class="row-no">${i+1}</td>
          <td><b>${esc(r.customer_name)}</b></td>
          <td class="ltr">${esc(r.phone||"—")}</td>
          <td class="ltr" style="font-size:13px">${esc(r.email||"—")}</td>
          <td>${resultBadge(r.follow_up_result)}</td>
          <td>${levelBadge(r.customer_level)}</td>
          <td style="font-size:13px;color:var(--muted)">${fmtDate(r.created_at)}</td>
          <td><button class="act" onclick="openCustomerModal('${r.id}')">${IC.edit}</button></td>
        </tr>`).join("")
      : `<tr><td colspan="8"><div class="empty">${t("noResults")}</div></td></tr>`}</tbody>
    </table>
  </div>`;
}
window.setLevelFilter = v => { State.levelFilter = v; renderContent(); };

/* =========================================================
 * 13) CUSTOMER FORM (add / edit)
 * ======================================================= */
let editingCustomer = null;

window.openCustomerModal = async (id) => {
  editingCustomer = null;
  if(id){
    const rows = await Data.customers({ employeeIds:[State.profile.id] });
    editingCustomer = rows.find(r => r.id === id) || null;
    if(!editingCustomer){ toast(t("errLoad"), "e"); return; }
  }
  const c = editingCustomer || {
    customer_name:"", phone:"", email:"", email_sent:false, call_completed:false,
    follow_up_result:"follow_up", customer_level:"", notes:""
  };

  openModal(`
    <h3>${c.id ? t("editCustomer") : t("addCustomer")}
      <button class="x" onclick="closeModal()">${IC.x}</button></h3>

    <form id="custForm" onsubmit="return saveCustomer(event)">
      <div class="form-grid">
        <div class="full">
          <label class="req">${t("customerName")}</label>
          <input id="cName" value="${esc(c.customer_name)}" autocomplete="off">
          <div class="field-err" id="eName">${t("errRequired")}</div>
        </div>

        <div>
          <label class="req">${t("phone")}</label>
          <input id="cPhone" class="ltr" value="${esc(c.phone)}" placeholder="+20 1XX XXX XXXX" inputmode="tel">
          <div class="field-err" id="ePhone">${t("errPhone")}</div>
        </div>

        <div>
          <label>${t("emailAddr")}</label>
          <input id="cEmail" class="ltr" value="${esc(c.email||"")}" placeholder="name@company.com" inputmode="email">
          <div class="field-err" id="eEmail">${t("errEmail")}</div>
        </div>

        <div class="full">
          <div class="toggle-row">
            <label class="toggle ${c.email_sent?"on":""}" id="tgMail">
              <input type="checkbox" id="cMail" ${c.email_sent?"checked":""} onchange="syncToggle('tgMail',this)">
              ${IC.mail} ${t("emailSent")}
            </label>
            <label class="toggle ${c.call_completed?"on":""}" id="tgCall">
              <input type="checkbox" id="cCall" ${c.call_completed?"checked":""} onchange="syncToggle('tgCall',this)">
              ${IC.phone} ${t("callDone")}
            </label>
          </div>
        </div>

        <div>
          <label>${t("followUpResult")}</label>
          <select id="cResult">
            ${RESULTS.map(r => `<option value="${r.key}" ${c.follow_up_result===r.key?"selected":""}>${r.emoji} ${t("r_"+r.key)}</option>`).join("")}
          </select>
        </div>

        <div>
          <label>${t("level")}</label>
          <select id="cLevel">
            <option value="">${t("selectLevel")}</option>
            ${State.levels.map(l => `<option value="${l.key}" ${c.customer_level===l.key?"selected":""}>${esc(LANG==="ar"?l.name_ar:l.name_en)}</option>`).join("")}
          </select>
        </div>

        <div class="full">
          <label>${t("notes")}</label>
          <textarea id="cNotes" rows="3" placeholder="${t("notes")}">${esc(c.notes||"")}</textarea>
        </div>
      </div>

      <div class="modal-foot">
        <button type="button" class="btn btn-outline" onclick="closeModal()">${t("cancel")}</button>
        <button type="submit" class="btn btn-primary" id="saveBtn">${c.id ? t("update") : t("save")}</button>
      </div>
    </form>`, 620);

  setTimeout(() => $("#cName") && $("#cName").focus(), 90);
};

window.syncToggle = (wrapId, input) => $("#"+wrapId).classList.toggle("on", input.checked);

window.saveCustomer = async (ev) => {
  ev.preventDefault();
  const name  = $("#cName").value.trim();
  const phone = $("#cPhone").value.trim();
  const email = $("#cEmail").value.trim();

  // ---- validation ----
  let ok = true;
  const mark = (inp, err, bad) => {
    $(inp).classList.toggle("invalid", bad);
    $(err).classList.toggle("on", bad);
    if(bad) ok = false;
  };
  mark("#cName",  "#eName",  !name);
  mark("#cPhone", "#ePhone", !phone || !isPhone(phone));
  mark("#cEmail", "#eEmail", !!email && !isEmail(email));
  if(!ok){ toast(t("errFill"), "w"); return false; }

  const payload = {
    customer_name    : name,
    phone            : phone,
    email            : email || null,
    email_sent       : $("#cMail").checked,
    call_completed   : $("#cCall").checked,
    follow_up_result : $("#cResult").value,
    customer_level   : $("#cLevel").value || null,
    notes            : $("#cNotes").value.trim(),
    employee_id      : State.profile.id
  };

  const btn = $("#saveBtn");
  btn.disabled = true; btn.innerHTML = `<span class="spin"></span> ${t("saving")}`;
  try{
    if(editingCustomer) await Data.updateCustomer(editingCustomer.id, payload);
    else                await Data.insertCustomer(payload);
    closeModal();
    toast(editingCustomer ? t("okUpdated") : t("okSaved"), "s");
    renderContent();
  }catch(err){
    console.error(err);
    toast(friendlyError(err, "errSave"), "e");
    btn.disabled = false; btn.textContent = t("save");
  }
  return false;
};

window.removeCustomer = (id) => confirmModal(t("confirmDelete"), async () => {
  try{ await Data.deleteCustomer(id); toast(t("okDeleted"), "s"); renderContent(); }
  catch(err){ toast(friendlyError(err, "errDelete"), "e"); }
});

/* =========================================================
 * 14) ADMIN — OVERVIEW
 * ======================================================= */
function rangeToDates(range, from, to){
  const today = todayKey();
  switch(range){
    case "today":     return { from:today, to:today };
    case "yesterday": return { from:shiftKey(today,-1), to:shiftKey(today,-1) };
    case "week":      return { from:weekStartKey(), to:today };
    case "month":     return { from:monthStartKey(), to:today };
    case "custom":    return { from:from || today, to:to || today };
    default:          return { from:null, to:null }; // all
  }
}

async function viewAdminOverview(){
  const { from, to } = rangeToDates(State.adminRange);
  const rows = await Data.customers({ from, to });
  const s    = Stats.summary(rows);
  const byEmp= Stats.byEmployee(rows);
  const byLv = Stats.byLevel(rows);
  const sales= State.employees.filter(e => e.role === "sales");
  const maxEmp = Math.max(1, ...Object.values(byEmp));
  const palette = ["#E8971E","#2A5082","#22C55E","#8B5CF6","#EF4444"];

  return `
  <div class="page-head">
    <div><h1 class="page-title">${t("overview")}</h1>
    <div class="page-sub">${from ? fmtDate(from) + " → " + fmtDate(to) : t("allTime")}</div></div>
  </div>

  <div class="chips" style="margin-bottom:18px">
    ${[["today","today"],["yesterday","yesterday"],["week","thisWeek"],["month","thisMonth"],["all","allTime"]]
      .map(([k,l]) => `<button class="chip ${State.adminRange===k?"on":""}" onclick="setAdminRange('${k}')">${t(l)}</button>`).join("")}
  </div>

  <div class="grid g4" style="margin-bottom:18px">
    ${statCard("totalCustomers", s.total,     IC.users, "#1B3A5C")}
    ${statCard("emailsSent",     s.emails,    IC.mail,  "#2A5082")}
    ${statCard("callsMade",      s.calls,     IC.phone, "#E8971E")}
    ${statCard("activeEmployees",sales.length,IC.user,  "#8B5CF6")}
  </div>

  <div class="grid g4" style="margin-bottom:20px">
    ${statCard("interested",   s.positive,  IC.check, "#22C55E")}
    ${statCard("needFollowUp", s.follow_up, IC.trend, "#C77D12")}
    ${statCard("notInterested",s.negative,  IC.x,     "#EF4444")}
    ${statCard("noAnswer",     s.no_answer, IC.phone, "#5A7A9B")}
  </div>

  <div class="grid g2">
    <div class="card pad">
      <div class="section-title">${t("byEmployee")}</div>
      ${sales.length ? sales.map((e,i) => {
        const v = byEmp[e.id] || 0;
        return `<div class="bar-row"><span class="bl">${esc(empName(e))}</span>
          <span class="bt"><i style="width:${pct(v,maxEmp)}%;background:${palette[i%5]}"></i></span>
          <span class="bv">${v}</span></div>`;
      }).join("") : `<div class="empty">${t("noData")}</div>`}
    </div>

    <div class="card pad">
      <div class="section-title">${t("byResult")}</div>
      ${RESULTS.map((r,i) => {
        const v = s[r.key];
        return `<div class="bar-row"><span class="bl">${r.emoji} ${t("r_"+r.key)}</span>
          <span class="bt"><i style="width:${pct(v, Math.max(1,s.total))}%;background:${["#22C55E","#E8971E","#EF4444","#8CA3BA"][i]}"></i></span>
          <span class="bv">${v}</span></div>`;
      }).join("")}
    </div>

    <div class="card pad">
      <div class="section-title">${t("byLevel")}</div>
      ${State.levels.map((l,i) => {
        const v = byLv[l.key] || 0;
        return `<div class="bar-row"><span class="bl">${esc(LANG==="ar"?l.name_ar:l.name_en)}</span>
          <span class="bt"><i style="width:${pct(v, Math.max(1,s.total))}%;background:${palette[i%5]}"></i></span>
          <span class="bv">${v}</span></div>`;
      }).join("")}
      <div class="bar-row"><span class="bl">${t("notSet")}</span>
        <span class="bt"><i style="width:${pct(byLv.__none__||0, Math.max(1,s.total))}%;background:#C9D3DE"></i></span>
        <span class="bv">${byLv.__none__||0}</span></div>
    </div>

    <div class="card pad">
      <div class="section-title">${t("performance")}</div>
      ${sales.map(e => {
        const v = byEmp[e.id] || 0;
        const p = State.adminRange === "today" ? pct(v, CONFIG.DAILY_TARGET) : pct(v, Math.max(1, s.total));
        return `<div style="margin-bottom:14px">
          <div class="mini-row"><span>${esc(empName(e))}</span><b>${v}${State.adminRange==="today"?" / "+CONFIG.DAILY_TARGET:""} — ${p}%</b></div>
          <div class="pbar"><i style="width:${Math.min(100,p)}%"></i></div>
        </div>`;
      }).join("") || `<div class="empty">${t("noData")}</div>`}
    </div>
  </div>`;
}
window.setAdminRange = r => { State.adminRange = r; renderContent(); };

/* =========================================================
 * 15) ADMIN — EMPLOYEES
 * ======================================================= */
async function viewAdminEmployees(){
  const today = todayKey();
  const rowsToday = await Data.customers({ from:today, to:today });
  const rowsAll   = await Data.customers({});
  const byToday   = Stats.byEmployee(rowsToday);
  const byAll     = Stats.byEmployee(rowsAll);
  const sales     = State.employees.filter(e => e.role === "sales");

  return `
  <div class="page-head"><div>
    <h1 class="page-title">${t("employees")}</h1>
    <div class="page-sub">${fmtDateLong(today)}</div></div></div>

  <div class="grid g3">
    ${sales.length ? sales.map((e,i) => {
      const dt = byToday[e.id] || 0, all = byAll[e.id] || 0, p = pct(dt, CONFIG.DAILY_TARGET);
      return `<div class="emp-card" style="animation-delay:${i*60}ms" onclick="openEmployee('${e.id}')">
        <div class="emp-top">
          <div class="avatar">${esc(empName(e)[0]||"?")}</div>
          <div><b>${esc(empName(e))}</b><span>${t("sales")}</span></div>
        </div>
        <div class="mini-row"><span>${t("customersToday")}</span><b>${dt} / ${CONFIG.DAILY_TARGET}</b></div>
        <div class="pbar" style="margin-bottom:12px"><i style="width:${Math.min(100,p)}%"></i></div>
        <div class="mini-row"><span>${t("totalCustomers")}</span><b>${all}</b></div>
        <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px">${t("viewDetails")}</button>
      </div>`;
    }).join("") : `<div class="card"><div class="empty">${t("noData")}</div></div>`}
  </div>`;
}
window.openEmployee = id => { State.adminEmpId = id; renderContent(); window.scrollTo({top:0}); };
window.closeEmployee = () => { State.adminEmpId = null; renderContent(); };

async function viewEmployeeDetail(empId){
  const e = State.employees.find(x => x.id === empId);
  if(!e) { State.adminEmpId = null; return viewAdminEmployees(); }

  const today = todayKey();
  const [dayRows, weekRows, monthRows, allRows] = await Promise.all([
    Data.customers({ employeeIds:[empId], from:today,           to:today }),
    Data.customers({ employeeIds:[empId], from:weekStartKey(),  to:today }),
    Data.customers({ employeeIds:[empId], from:monthStartKey(), to:today }),
    Data.customers({ employeeIds:[empId] })
  ]);
  const s = Stats.summary(allRows);
  const byLv = Stats.byLevel(allRows);
  const p = pct(dayRows.length, CONFIG.DAILY_TARGET);

  return `
  <div class="page-head">
    <div style="display:flex;align-items:center;gap:14px">
      <button class="icon-btn" onclick="closeEmployee()">${IC.back}</button>
      <div class="avatar">${esc(empName(e)[0]||"?")}</div>
      <div><h1 class="page-title" style="font-size:24px">${esc(empName(e))}</h1>
      <div class="page-sub" style="margin:0">${t("sales")}</div></div>
    </div>
  </div>

  <div class="grid g4" style="margin-bottom:18px">
    ${statCard("customersToday", dayRows.length,   IC.target,"#E8971E")}
    ${statCard("customersWeek",  weekRows.length,  IC.dash,  "#2A5082")}
    ${statCard("customersMonth", monthRows.length, IC.chart, "#8B5CF6")}
    ${statCard("totalCustomers", allRows.length,   IC.users, "#1B3A5C")}
  </div>

  <div class="card pad" style="margin-bottom:18px">
    <div class="mini-row"><span>${t("todayProgress")}</span><b>${dayRows.length} / ${CONFIG.DAILY_TARGET} — ${p}%</b></div>
    <div class="pbar"><i style="width:${Math.min(100,p)}%"></i></div>
  </div>

  <div class="grid g4" style="margin-bottom:18px">
    ${statCard("emailsSent",   s.emails,    IC.mail,  "#2A5082")}
    ${statCard("callsMade",    s.calls,     IC.phone, "#E8971E")}
    ${statCard("interested",   s.positive,  IC.check, "#22C55E")}
    ${statCard("needFollowUp", s.follow_up, IC.trend, "#C77D12")}
  </div>
  <div class="grid g2" style="margin-bottom:18px">
    ${statCard("notInterested",s.negative,  IC.x,     "#EF4444")}
    ${statCard("noAnswer",     s.no_answer, IC.phone, "#5A7A9B")}
  </div>

  <div class="card pad" style="margin-bottom:18px">
    <div class="section-title">${t("byLevel")}</div>
    ${State.levels.map((l,i) => {
      const v = byLv[l.key] || 0;
      return `<div class="bar-row"><span class="bl">${esc(LANG==="ar"?l.name_ar:l.name_en)}</span>
        <span class="bt"><i style="width:${pct(v,Math.max(1,allRows.length))}%;background:${["#E8971E","#2A5082","#22C55E"][i%3]}"></i></span>
        <span class="bv">${v}</span></div>`;
    }).join("")}
    <div class="bar-row"><span class="bl">${t("notSet")}</span>
      <span class="bt"><i style="width:${pct(byLv.__none__||0,Math.max(1,allRows.length))}%;background:#C9D3DE"></i></span>
      <span class="bv">${byLv.__none__||0}</span></div>
  </div>

  <div class="section-title">${t("customersToday")}</div>
  ${customerTable(dayRows, true)}`;
}

/* Shared read-only customer table (admin) */
function customerTable(rows, hideEmployee = false){
  return `<div class="card table-wrap">
    <table>
      <thead><tr>
        <th class="row-no">#</th>
        <th>${t("customerName")}</th>
        ${hideEmployee ? "" : `<th>${t("employee")}</th>`}
        <th>${t("phone")}</th><th>${t("emailAddr")}</th>
        <th>${t("emailMessage")}</th><th>${t("callStatus")}</th>
        <th>${t("followUpResult")}</th><th>${t("level")}</th>
        <th>${t("notes")}</th><th>${t("date")}</th>
      </tr></thead>
      <tbody>${rows.length ? rows.map((r,i) => `
        <tr>
          <td class="row-no">${i+1}</td>
          <td><b>${esc(r.customer_name)}</b></td>
          ${hideEmployee ? "" : `<td>${esc(empName(State.employees.find(e=>e.id===r.employee_id)))}</td>`}
          <td class="ltr">${esc(r.phone||"—")}</td>
          <td class="ltr" style="font-size:13px">${esc(r.email||"—")}</td>
          <td>${yesNo(r.email_sent)}</td>
          <td>${yesNo(r.call_completed)}</td>
          <td>${resultBadge(r.follow_up_result)}</td>
          <td>${levelBadge(r.customer_level)}</td>
          <td style="max-width:180px;font-size:13px;color:var(--muted)">${esc(r.notes||"—")}</td>
          <td style="font-size:12.5px;color:var(--muted)">${fmtDate(r.created_at)}<br><span class="ltr">${fmtTime(r.created_at)}</span></td>
        </tr>`).join("")
      : `<tr><td colspan="${hideEmployee?10:11}"><div class="empty">${t("noCustomers")}</div></td></tr>`}</tbody>
    </table>
  </div>`;
}

/* =========================================================
 * 16) ADMIN — CUSTOMERS
 * ======================================================= */
async function viewAdminCustomers(){
  const { from, to } = rangeToDates(State.adminRange);
  const rows = await Data.customers({ from, to });
  return `
  <div class="page-head"><div>
    <h1 class="page-title">${t("customers")}</h1>
    <div class="page-sub">${from ? fmtDate(from)+" → "+fmtDate(to) : t("allTime")} — ${rows.length}</div>
  </div></div>

  <div class="chips" style="margin-bottom:18px">
    ${[["today","today"],["yesterday","yesterday"],["week","thisWeek"],["month","thisMonth"],["all","allTime"]]
      .map(([k,l]) => `<button class="chip ${State.adminRange===k?"on":""}" onclick="setAdminRange('${k}')">${t(l)}</button>`).join("")}
  </div>

  ${customerTable(rows)}`;
}

/* =========================================================
 * 17) ADMIN — REPORTS
 * ======================================================= */
async function viewAdminReports(){
  const R = State.report;
  const sales = State.employees.filter(e => e.role === "sales");

  const empChips = sales.map(e => `
    <label class="chk-pill ${R.employees.includes(e.id)?"on":""}">
      <input type="checkbox" value="${e.id}" ${R.employees.includes(e.id)?"checked":""} onchange="toggleRep('employees','${e.id}',this)">
      ${esc(empName(e))}</label>`).join("");

  const resChips = RESULTS.map(r => `
    <label class="chk-pill ${R.results.includes(r.key)?"on":""}">
      <input type="checkbox" ${R.results.includes(r.key)?"checked":""} onchange="toggleRep('results','${r.key}',this)">
      ${r.emoji} ${t("r_"+r.key)}</label>`).join("");

  const lvChips = State.levels.map(l => `
    <label class="chk-pill ${R.levels.includes(l.key)?"on":""}">
      <input type="checkbox" ${R.levels.includes(l.key)?"checked":""} onchange="toggleRep('levels','${l.key}',this)">
      ${esc(LANG==="ar"?l.name_ar:l.name_en)}</label>`).join("") +
    `<label class="chk-pill ${R.levels.includes("__none__")?"on":""}">
      <input type="checkbox" ${R.levels.includes("__none__")?"checked":""} onchange="toggleRep('levels','__none__',this)">
      ${t("notSet")}</label>`;

  let resultBlock = "";
  if(R.rows){
    const s = Stats.summary(R.rows);
    resultBlock = `
      <div class="page-head" style="margin-top:26px">
        <div><h2 class="section-title" style="font-size:19px;margin:0">${t("reportTitle")}</h2>
        <div class="page-sub" style="margin:4px 0 0">${reportPeriodText()} — ${R.rows.length}</div></div>
        <button class="btn btn-navy" onclick="printReport()">${IC.print} ${t("printReport")}</button>
      </div>
      <div class="grid g4" style="margin-bottom:16px">
        ${statCard("totalCustomers", s.total,    IC.users, "#1B3A5C")}
        ${statCard("emailsSent",     s.emails,   IC.mail,  "#2A5082")}
        ${statCard("callsMade",      s.calls,    IC.phone, "#E8971E")}
        ${statCard("interested",     s.positive, IC.check, "#22C55E")}
      </div>
      ${customerTable(R.rows)}`;
  }

  return `
  <div class="page-head"><div>
    <h1 class="page-title">${t("reports")}</h1>
    <div class="page-sub">${t("filters")}</div></div></div>

  <div class="card pad" style="margin-bottom:16px">
    <label style="margin-bottom:10px">${t("selectEmployees")}</label>
    <div class="chk-group" style="margin-bottom:20px">
      <button class="chip ${R.employees.length===0?"on":""}" onclick="clearRep('employees')">${t("allEmployees")}</button>
      ${empChips}
    </div>

    <label style="margin-bottom:10px">${t("selectResults")}</label>
    <div class="chk-group" style="margin-bottom:20px">
      <button class="chip ${R.results.length===0?"on":""}" onclick="clearRep('results')">${t("allResults")}</button>
      ${resChips}
    </div>

    <label style="margin-bottom:10px">${t("selectLevels")}</label>
    <div class="chk-group" style="margin-bottom:20px">
      <button class="chip ${R.levels.length===0?"on":""}" onclick="clearRep('levels')">${t("allLevels")}</button>
      ${lvChips}
    </div>

    <label style="margin-bottom:10px">${t("period")}</label>
    <div class="chips" style="margin-bottom:14px">
      ${[["today","today"],["yesterday","yesterday"],["week","thisWeek"],["month","thisMonth"],["custom","custom"],["all","allTime"]]
        .map(([k,l]) => `<button class="chip ${R.range===k?"on":""}" onclick="setRepRange('${k}')">${t(l)}</button>`).join("")}
    </div>

    ${R.range === "custom" ? `
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px">
        <div style="min-width:180px"><label>${t("from")}</label>
          <input type="date" id="rFrom" value="${R.from||todayKey()}" onchange="State.report.from=this.value"></div>
        <div style="min-width:180px"><label>${t("to")}</label>
          <input type="date" id="rTo" value="${R.to||todayKey()}" onchange="State.report.to=this.value"></div>
      </div>` : ""}

    <button class="btn btn-primary" onclick="runReport()">${IC.chart} ${t("generateReport")}</button>
  </div>

  ${resultBlock}`;
}

window.toggleRep = (group, value, input) => {
  const arr = State.report[group];
  const i = arr.indexOf(value);
  if(input.checked && i === -1) arr.push(value);
  if(!input.checked && i > -1)  arr.splice(i, 1);
  input.closest(".chk-pill").classList.toggle("on", input.checked);
};
window.clearRep   = g => { State.report[g] = []; renderContent(); };
window.setRepRange= r => { State.report.range = r; renderContent(); };

window.runReport = async () => {
  const R = State.report;
  const { from, to } = rangeToDates(R.range, R.from, R.to);
  try{
    R.rows = await Data.customers({
      employeeIds: R.employees,
      results    : R.results,
      levels     : R.levels,
      from, to
    });
    renderContent();
    if(!R.rows.length) toast(t("noCustomers"), "w");
  }catch(err){ toast(friendlyError(err), "e"); }
};

function reportPeriodText(){
  const R = State.report;
  const { from, to } = rangeToDates(R.range, R.from, R.to);
  if(!from) return t("allTime");
  return from === to ? fmtDate(from) : `${fmtDate(from)} → ${fmtDate(to)}`;
}

/* =========================================================
 * 18) PRINTING
 * ======================================================= */
function buildPrintDoc({ title, metaLines, rows, showEmployee }){
  const s = Stats.summary(rows);
  const cells = [
    [t("totalCustomers"), s.total],
    [t("emailsSent"),     s.emails],
    [t("callsMade"),      s.calls],
    ["🟢 " + t("r_positive"),  s.positive],
    ["🟡 " + t("r_follow_up"), s.follow_up],
    ["🔴 " + t("r_negative"),  s.negative],
    ["⚫ " + t("r_no_answer"), s.no_answer]
  ];

  const head = [
    ["#","30px"], [t("customerName"),"auto"],
    ...(showEmployee ? [[t("employee"),"90px"]] : []),
    [t("phone"),"105px"], [t("emailAddr"),"140px"],
    [t("emailMessage"),"42px"], [t("callStatus"),"42px"],
    [t("followUpResult"),"85px"], [t("level"),"85px"],
    [t("notes"),"auto"], [t("date"),"70px"]
  ];

  $("#printArea").setAttribute("dir", I18N[LANG].dir);
  $("#printArea").style.fontFamily = "'Tajawal',Arial,sans-serif";
  $("#printArea").innerHTML = `
    <div class="pr-head">
      <div class="pr-logo">
        <img src="${CONFIG.LOGO}" alt="">
        <div><div class="pr-title">${esc(CONFIG.COMPANY)}</div>
        <div class="pr-meta">${esc(CONFIG.COMPANY_AR)}</div></div>
      </div>
      <div style="text-align:${LANG==="ar"?"left":"right"}">
        <div class="pr-title">${esc(title)}</div>
        <div class="pr-meta">${metaLines.map(esc).join("<br>")}</div>
      </div>
    </div>

    <div class="pr-stats">
      ${cells.map(([k,v]) => `<div class="pr-stat"><b>${v}</b><span>${esc(k)}</span></div>`).join("")}
    </div>

    <table>
      <thead><tr>${head.map(([h,w]) => `<th style="width:${w};text-align:${LANG==="ar"?"right":"left"}">${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map((r,i) => `<tr>
          <td style="text-align:center;color:#666">${i+1}</td>
          <td style="font-weight:700">${esc(r.customer_name)}</td>
          ${showEmployee ? `<td>${esc(empName(State.employees.find(e=>e.id===r.employee_id)))}</td>` : ""}
          <td style="direction:ltr;text-align:left">${esc(r.phone||"—")}</td>
          <td style="direction:ltr;text-align:left;font-size:9.5px">${esc(r.email||"—")}</td>
          <td style="text-align:center">${r.email_sent?"✔":"—"}</td>
          <td style="text-align:center">${r.call_completed?"✔":"—"}</td>
          <td style="text-align:center">${esc(resultLabel(r.follow_up_result))}</td>
          <td style="text-align:center">${esc(levelName(r.customer_level) || t("notSet"))}</td>
          <td style="color:#444">${esc(r.notes||"—")}</td>
          <td style="text-align:center;font-size:9.5px">${fmtDate(r.created_at)}</td>
        </tr>`).join("")}
      </tbody>
    </table>

    <div class="pr-sign">
      <div>${t("employee")}</div>
      <div>${t("supervisor")}</div>
    </div>
    <div class="pr-foot">${esc(CONFIG.COMPANY)} — ${t("generatedOn")}: ${new Date().toLocaleString(I18N[LANG].locale,{timeZone:CONFIG.TIMEZONE})}</div>`;

  setTimeout(() => window.print(), 350);
}

window.printReport = () => {
  const R = State.report;
  if(!R.rows || !R.rows.length){ toast(t("nothingToPrint"), "w"); return; }
  const empNames = R.employees.length
    ? R.employees.map(id => empName(State.employees.find(e => e.id === id))).join(" • ")
    : t("allEmployees");
  const resNames = R.results.length ? R.results.map(k => t("r_"+k)).join(" • ") : t("allResults");
  const lvNames  = R.levels.length
    ? R.levels.map(k => k === "__none__" ? t("notSet") : levelName(k)).join(" • ")
    : t("allLevels");

  buildPrintDoc({
    title: t("reportTitle"),
    metaLines: [
      `${t("employee")}: ${empNames}`,
      `${t("period")}: ${reportPeriodText()}`,
      `${t("followUpResult")}: ${resNames}`,
      `${t("level")}: ${lvNames}`
    ],
    rows: R.rows,
    showEmployee: true
  });
};

window.printSalesDay = async () => {
  const date = State.salesDate || todayKey();
  const rows = await Data.customers({ employeeIds:[State.profile.id], from:date, to:date });
  if(!rows.length){ toast(t("nothingToPrint"), "w"); return; }
  buildPrintDoc({
    title: t("reportTitle"),
    metaLines: [
      `${t("employee")}: ${empName(State.profile)}`,
      `${t("period")}: ${fmtDateLong(date)}`,
      `${t("dailyTarget")}: ${rows.length} / ${CONFIG.DAILY_TARGET} (${pct(rows.length, CONFIG.DAILY_TARGET)}%)`
    ],
    rows: rows.slice().reverse(),
    showEmployee: false
  });
};

/* =========================================================
 * 19) NETWORK STATUS
 * ======================================================= */
function updateNet(){
  const bar = $("#netBar");
  if(navigator.onLine){
    if(bar.classList.contains("on")){ toast(t("backOnline"), "s"); }
    bar.classList.remove("on");
  }else{
    bar.textContent = t("offline");
    bar.classList.add("on");
  }
}
window.addEventListener("online",  updateNet);
window.addEventListener("offline", updateNet);

/* =========================================================
 * 20) BOOTSTRAP
 * ======================================================= */
(async function boot(){
  updateNet();

  // Never let the loader trap the user, even if the network hangs
  const hideLoader = () => {
    const l = $("#loader");
    if(l){ l.classList.add("hide"); setTimeout(() => l.remove(), 450); }
  };
  setTimeout(hideLoader, 4000);

  try{
    await Data.loadEmployees();
    await Data.loadLevels();
  }catch(err){
    console.error("[boot] load failed:", err);
    toast(friendlyError(err, "errSetup"), "e");
  }

  try{
    if(Auth.restore()) await startApp();
    else               renderAuth();
  }catch(err){
    console.error("[boot] render failed:", err);
    localStorage.removeItem(SESSION_KEY);
    State.profile = null;
    renderAuth();
  }

  setTimeout(hideLoader, 400);
})();
