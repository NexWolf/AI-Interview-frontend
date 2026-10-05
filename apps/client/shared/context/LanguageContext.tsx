"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export const translations = {
  en: {
    // Navbar
    "nav.features": "Features",
    "nav.benefits": "Benefits",
    "nav.howItWorks": "How it Works",
    "nav.pricing": "Pricing",
    "nav.login": "Log In",
    "nav.signup": "Sign Up",
    "nav.switchLang": "العربية",

    // Hero
    "hero.title": "Ace Your Next Tech Interview with Real-Time AI",
    "hero.desc":
      "Practice realistic technical and behavioral interviews powered by intelligent AI. Receive instant feedback, sharpen your problem-solving skills, and walk into your next interview with complete confidence.",
    "hero.cta": "Start Now",
    "hero.stats": "10,000+ Mock Interviews Conducted",
    "hero.splineLoading": "Loading 3D Experience",

    // Features
    "features.badge": "Features",
    "features.title": "Everything You Need to Master Tech Interviews",
    "features.subtitle":
      "Comprehensive tools designed to sharpen your problem-solving, elevate communication, and prepare you for real-world hiring rounds.",
    "features.f1Title": "Adaptive AI Questioning",
    "features.f1Desc":
      "Questions adapt dynamically to your answers, selected technologies, and past interview weak points to guarantee continuous learning every session.",
    "features.f2Title": "Voice & Real-Time Simulation",
    "features.f2Desc":
      "Simulate authentic interview pressure with realistic AI conversational voice interactions and video practice that feel like speaking with a senior engineering lead.",
    "features.f3Title": "Detailed Feedback & Scorecards",
    "features.f3Desc":
      "Receive immediate scoring across technical depth, problem-solving, and communication, along with a personalized, step-by-step improvement plan.",

    // How It Works
    "how.title1": "Turn Practice into",
    "how.title2": "Confidence & Offers",
    "how.subtitle":
      "A streamlined three-step journey to prepare, practice, and conquer every technical interview with precision.",
    "how.s1Title": "Configure Your Interview",
    "how.s1Desc":
      "Choose your target role, difficulty level, programming languages, or paste a real job description.",
    "how.s2Title": "Live Interactive Session",
    "how.s2Desc":
      "Engage in voice or text rounds with adaptive questions that dynamically evaluate your core technical skills.",
    "how.s3Title": "Actionable Insights & Growth",
    "how.s3Desc":
      "Review comprehensive reports highlighting strong areas, blind spots, and customized next steps to improve.",

    // Benefits
    "benefits.badge": "Benefits",
    "benefits.title1": "Turn Every Interview Into",
    "benefits.title2": "Actionable Insights",
    "benefits.subtitle":
      "Understand performance, identify strengths, and discover the areas that matter most with intelligent interview analytics.",
    "benefits.live": "Live",
    "benefits.candidateInsights": "Candidate Insights",
    "benefits.overallScore": "Overall score",
    "benefits.excellent": "Excellent",
    "benefits.scoreComment":
      "Strong performance across communication and technical responses.",
    "benefits.confidence": "Interview Confidence",
    "benefits.quality": "Response Quality",
    "benefits.performance": "Overall Performance",
    "benefits.analytics": "Performance Analytics",
    "benefits.aiPerformance": "AI Interview Performance",
    "benefits.aiInsights": "AI-powered insights",

    // Pricing
    "pricing.badge": "Flexible & Transparent Pricing",
    "pricing.title1": "Find the Perfect",
    "pricing.title2": "Plan",
    "pricing.subtitle":
      "Choose a plan that fits your career goals. Upgrade, downgrade, or cancel anytime.",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.save": "Save 20%",
    "pricing.perMo": "/mo",
    "pricing.perYr": "/yr",
    "pricing.popular": "Most Popular",
    "pricing.choose": "Choose Plan",
    "pricing.starterName": "Starter",
    "pricing.starterDesc":
      "Perfect for students and developers beginning their interview practice.",
    "pricing.starterF1": "5 Full AI Mock Interviews / month",
    "pricing.starterF2": "Text & Real-time Voice Practice",
    "pricing.starterF3": "Comprehensive Scoring Breakdown",
    "pricing.starterF4": "Core Tech Stacks (Frontend, Backend, etc.)",
    "pricing.proName": "Pro",
    "pricing.proDesc":
      "For active job seekers who want to ace technical rounds and land top offers.",
    "pricing.proF1": "Unlimited AI Mock Interviews",
    "pricing.proF2": "Voice & Camera Simulation Modes",
    "pricing.proF3": "Adaptive Weakness & Growth Tracking",
    "pricing.proF4": "Detailed Reports & Step-by-Step Improvement Plan",
    "pricing.proF5": "Custom Job Description Matching",
    "pricing.proF6": "Priority Support",
    "pricing.entName": "Enterprise",
    "pricing.entDesc":
      "For bootcamps, universities, and teams preparing cohorts at scale.",
    "pricing.entF1": "Everything in Pro",
    "pricing.entF2": "Cohort Performance Dashboards",
    "pricing.entF3": "Custom Skill Benchmarks & Rubrics",
    "pricing.entF4": "API Access & Custom Integrations",
    "pricing.entF5": "Dedicated Account Manager",

    // Footer
    "footer.title": "Your next interview could be the one",
    "footer.desc":
      "Start your first mock interview in under a minute. Get real-time AI feedback and personalized growth.",
    "footer.cta": "Start practicing free",
    "footer.rights": "All rights reserved.",

    // Dashboard & Common
    "common.theme": "Theme",
    "common.light": "Light",
    "common.dark": "Dark",
    "common.system": "System",
    "common.language": "Language",
    "common.switchLanguage": "العربية",

    // Dashboard Navigation
    "dashboard.brand": "AI Interview Coach",
    "dashboard.nav.candidate": "Candidate Dashboard",
    "dashboard.nav.dashboard": "Dashboard",
    "dashboard.nav.myInterviews": "My Interviews",
    "dashboard.nav.profile": "Profile",
    "dashboard.nav.settings": "Settings",
    "dashboard.nav.admin": "Admin Panel",
    "dashboard.nav.newInterview": "New Interview",
    "dashboard.nav.logout": "Log Out",

    // Dashboard Home
    "dashboard.welcome": "Welcome back",
    "dashboard.subtitle": "Track your progress, hone your skills, and get ready for your next big interview.",
    "dashboard.stats.total": "Total Interviews",
    "dashboard.stats.avgScore": "Average Score",
    "dashboard.stats.completed": "Completed Sessions",
    "dashboard.stats.hours": "Practice Time",
    "dashboard.recent.title": "Recent Interviews",
    "dashboard.recent.viewAll": "View All",
    "dashboard.recent.empty": "No interviews conducted yet",
    "dashboard.recent.startFirst": "Start your first AI mock interview to practice your skills and get actionable feedback.",
    "dashboard.recent.startNow": "Start Interview Now",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account security, appearance, and preferences.",
    "settings.accountInfo": "Account Information",
    "settings.appearance.title": "Appearance & Language",
    "settings.appearance.desc": "Choose your preferred theme and interface language.",
    "settings.appearance.theme": "Color Theme",
    "settings.appearance.themeDesc": "Switch between dark and light themes or match your device.",
    "settings.appearance.lang": "Display Language",
    "settings.appearance.langDesc": "Select the language used throughout the application.",
    "settings.password.title": "Change Password",
    "settings.password.desc": "Ensure your account is using a long, random password to stay secure.",
    "settings.password.current": "Current Password",
    "settings.password.new": "New Password",
    "settings.password.confirm": "Confirm New Password",
    "settings.password.update": "Update Password",
    "settings.password.updating": "Updating...",
    "settings.delete.title": "Danger Zone",
    "settings.delete.desc": "Permanently delete your account and all associated interview evaluations.",
    "settings.delete.confirm": "Are you sure? This cannot be undone.",
    "settings.delete.btn": "Delete Account",

    // Profile
    "profile.share": "Share Profile",
    "profile.shareSuccess": "Profile link copied to clipboard!",
    "profile.downloadPdf": "Download PDF",
    "profile.publicPreview": "Public View",
    "profile.readiness.title": "AI Interview Readiness",
    "profile.readiness.desc": "Based on real AI mock interviews and evaluated skill benchmarks.",
    "profile.readiness.score": "Readiness Score",
    "profile.readiness.status.ready": "Interview Ready",
    "profile.readiness.status.practicing": "In Progress",
    "profile.readiness.status.starter": "Needs Practice",
    "profile.readiness.totalInterviews": "Interviews Taken",
    "profile.readiness.assessedSkills": "Assessed Skills",
    "profile.readiness.avgScore": "Average Score",
    "profile.readiness.strengths": "Top Strengths",
    "profile.readiness.focusAreas": "Focus Areas",
    "profile.readiness.practiceCta": "Practice with AI",
    "profile.readiness.noData": "Take an AI mock interview to calculate your readiness score.",
    "profile.projects.title": "Featured Projects & Experience",
    "profile.projects.desc": "Showcase your real-world technical work, projects, and architecture.",
    "profile.projects.add": "Add Project",
    "profile.projects.edit": "Edit Project",
    "profile.projects.empty": "No projects added yet. Showcase your best technical work!",
    "profile.projects.role": "Role / Position",
    "profile.projects.period": "Timeframe",
    "profile.projects.tech": "Technologies",
    "profile.projects.liveDemo": "Live Demo",
    "profile.projects.github": "Source Code",

    // Interview Setup
    "setup.title": "Interview Setup",
    "setup.subtitle": "Customize your session, choose your AI coach voice, and verify your hardware before starting.",
    "setup.step1.title": "Interview Scope",
    "setup.step1.desc": "Language, technologies & level",
    "setup.step2.title": "AI Voice & Persona",
    "setup.step2.desc": "Interviewer tone & preview",
    "setup.step3.title": "Devices & Honor Code",
    "setup.step3.desc": "Camera, mic & integrity rules",
    "setup.presets.title": "Quick Role Presets",
    "setup.presets.desc": "Choose a preset to auto-select key technologies, or customize manually:",
    "setup.lang.title": "1. Interview Language",
    "setup.lang.desc": "Select the primary spoken and written language for the interview:",
    "setup.tech.title": "2. Select Technologies",
    "setup.tech.desc": "Choose the technologies and stacks you want to be evaluated on:",
    "setup.level.title": "3. Experience Level",
    "setup.level.desc": "Select your expected seniority for question difficulty:",
    "setup.job.toggle": "Interview for a specific Job Description (Optional)",
    "setup.job.placeholder": "Paste the job requirements and description here...",
    "setup.voice.title": "Choose AI Interviewer Voice",
    "setup.voice.desc": "Select the interviewer persona and vocal tone for your session. Click to preview audio:",
    "setup.hardware.title": "Hardware Verification",
    "setup.hardware.desc": "Ensure your camera and microphone are properly functioning:",
    "setup.rules.title": "Honor Code & Anti-Cheating Guidelines",
    "setup.rules.desc": "To ensure a fair evaluation, this session is monitored by AI proctoring. Any violation will be flagged.",
    "setup.rules.acceptAll": "Accept All",
    "setup.rules.deselectAll": "Deselect All",
    "setup.summary.title": "Interview Session Summary",
    "setup.btn.next": "Next Step",
    "setup.btn.prev": "Previous",
    "setup.btn.start": "Start Interview",
  },
  ar: {
    // Navbar
    "nav.features": "المميزات",
    "nav.benefits": "الفوائد",
    "nav.howItWorks": "كيف يعمل",
    "nav.pricing": "الأسعار",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "تسجيل حساب",
    "nav.switchLang": "English",

    // Hero
    "hero.title": "اجتز مقابلتك التقنية القادمة مع الذكاء الاصطناعي",
    "hero.desc":
      "تدرب على مقابلات تقنية وسلوكية واقعية مدعومة بنماذج ذكاء اصطناعي متطورة. احصل على تقييم فوري، وطور نقاط ضعفك، واستعد لمقابلتك بثقة تامة.",
    "hero.cta": "ابدأ الآن",
    "hero.stats": "+10,000 مقابلة تجريبية تم إجراؤها",
    "hero.splineLoading": "جاري تحميل المشهد التفاعلي",

    // Features
    "features.badge": "المميزات",
    "features.title": "كل ما تحتاجه للتميز في المقابلات التقنية",
    "features.subtitle":
      "أدوات متكاملة صُممت لتطوير مهاراتك في حل المشكلات، وتحسين التواصل، وتجهيزك لجولات التوظيف الحقيقية.",
    "features.f1Title": "أسئلة ذكية وتكيفية",
    "features.f1Desc":
      "تتغير الأسئلة وتتدرج حسب إجاباتك والتقنيات المختارة ونقاط ضعفك السابقة لضمان تطور حقيقي في كل جلسة.",
    "features.f2Title": "محاكاة واقعية بالصوت والكاميرا",
    "features.f2Desc":
      "عِش تجربة المقابلة الحقيقية عبر حوار صوتي وتدريب مرئي بالذكاء الاصطناعي كأنك تتحدث مع خبير تقني معتمد.",
    "features.f3Title": "تقارير تقييمية مفصلة",
    "features.f3Desc":
      "تقييم دقيق يقيس عمقك التقني وطريقتك في التفكير وحل المشكلات، مع خطة تحسين شخصية واضحة للخطوات القادمة.",

    // How It Works
    "how.title1": "حوّل التدريب إلى",
    "how.title2": "ثقة وعروض عمل",
    "how.subtitle":
      "مسار من 3 خطوات واضحة للتحضير والممارسة واجتياز كل مقابلة تقنية باقتدار.",
    "how.s1Title": "تخصيص المقابلة",
    "how.s1Desc":
      "اختر المسمى الوظيفي، ومستوى الصعوبة، والمهارات التقنية، أو الصق وصف الوظيفة المطلوب.",
    "how.s2Title": "جلسة محاكاة تفاعلية",
    "how.s2Desc":
      "خض جولات بالصوت أو النص بأسئلة ذكية تختبر مهاراتك البرمجية الأساسية في الوقت الفعلي.",
    "how.s3Title": "نتائج تحليلات وتطور مستمر",
    "how.s3Desc":
      "اطلع على تقارير تفصيلية تبرز نقاط القوة وفرص التحسين مع تمارين موجهة لمقابلتك القادمة.",

    // Benefits
    "benefits.badge": "الفوائد",
    "benefits.title1": "حوّل كل مقابلة إلى",
    "benefits.title2": "رؤى ونتائج عملية",
    "benefits.subtitle":
      "تعرف على مستواك الحقيقي، وعزز نقاط قوتك، واكتشف المجالات الأكثر أهمية للنجاح عبر تحليلات ذكية.",
    "benefits.live": "مباشر",
    "benefits.candidateInsights": "تحليلات المرشح",
    "benefits.overallScore": "النتيجة الإجمالية",
    "benefits.excellent": "ممتاز",
    "benefits.scoreComment": "أداء قوي ومتميز في التواصل والإجابات التقنية.",
    "benefits.confidence": "الثقة في المقابلة",
    "benefits.quality": "جودة الإجابات",
    "benefits.performance": "الأداء العام",
    "benefits.analytics": "تحليلات الأداء",
    "benefits.aiPerformance": "أداء المقابلة الذكية",
    "benefits.aiInsights": "تحليلات مدعومة بالذكاء الاصطناعي",

    // Pricing
    "pricing.badge": "خطط أسعار مرنة وواضحة",
    "pricing.title1": "اختر الخطة",
    "pricing.title2": "المناسبة لك",
    "pricing.subtitle":
      "حدد الباقة التي تتناسب مع أهدافك الوظيفية، مع إمكانية الترقية أو الإلغاء في أي وقت.",
    "pricing.monthly": "شهرياً",
    "pricing.yearly": "سنوياً",
    "pricing.save": "وفر 20%",
    "pricing.perMo": "/شهرياً",
    "pricing.perYr": "/سنوياً",
    "pricing.popular": "الأكثر طلباً",
    "pricing.choose": "اختر الخطة",
    "pricing.starterName": "البداية",
    "pricing.starterDesc":
      "مثالية للطلاب والمطورين الجدد في بداية تدريبهم على مقابلات العمل.",
    "pricing.starterF1": "5 مقابلات تجريبية ذكية كاملة شهرياً",
    "pricing.starterF2": "تدريب تفاعلي بالنص والصوت المباشر",
    "pricing.starterF3": "تقارير تقييمية أساسية وشاملة",
    "pricing.starterF4": "التقنيات الأساسية (الواجهة الأمامية، الخلفية، إلخ)",
    "pricing.proName": "المحترف",
    "pricing.proDesc":
      "للباحثين الجادين عن فرص عمل ممتازة واجتياز المقابلات التقنية المعقدة.",
    "pricing.proF1": "مقابلات تجريبية غير محدودة بالذكاء الاصطناعي",
    "pricing.proF2": "أوضاع محاكاة كاملة بالصوت والكاميرا",
    "pricing.proF3": "تتبع تكيفي لنقاط الضعف والتقدم",
    "pricing.proF4": "تقارير تفصيلية وخطة تحسين مخصصة خطوة بخطوة",
    "pricing.proF5": "مطابقة ذكية مع الوصف الوظيفي للمقابلة",
    "pricing.proF6": "دعم فني ذو أولوية",
    "pricing.entName": "المؤسسات",
    "pricing.entDesc":
      "للجامعات والمعسكرات البرمجية لتأهيل الطلاب والمجموعات بكفاءة.",
    "pricing.entF1": "كل ما تحتويه باقة المحترف",
    "pricing.entF2": "لوحات تحكم لمتابعة أداء المجموعات",
    "pricing.entF3": "معايير تقييم وتصنيف مخصصة",
    "pricing.entF4": "ربط برمجي عبر API وتكامل خاص",
    "pricing.entF5": "مدير حساب مخصص",

    // Footer
    "footer.title": "مقابلتك القادمة قد تكون خطوتك الكبرى",
    "footer.desc":
      "ابدأ أول مقابلة تجريبية في أقل من دقيقة. احصل على تقييم مباشر وتوجيه مستمر.",
    "footer.cta": "ابدأ التدريب مجاناً",
    "footer.rights": "جميع الحقوق محفوظة.",

    // Dashboard & Common
    "common.theme": "المظهر",
    "common.light": "فاتح",
    "common.dark": "داكن",
    "common.system": "تلقائي",
    "common.language": "اللغة",
    "common.switchLanguage": "English",

    // Dashboard Navigation
    "dashboard.brand": "مدرب المقابلات الذكي",
    "dashboard.nav.candidate": "لوحة تدريب المرشح",
    "dashboard.nav.dashboard": "لوحة التحكم",
    "dashboard.nav.myInterviews": "مقابلاتي",
    "dashboard.nav.profile": "الملف الشخصي",
    "dashboard.nav.settings": "الإعدادات",
    "dashboard.nav.admin": "لوحة الإدارة",
    "dashboard.nav.newInterview": "مقابلة جديدة",
    "dashboard.nav.logout": "تسجيل الخروج",

    // Dashboard Home
    "dashboard.welcome": "مرحباً بك مجدداً",
    "dashboard.subtitle": "تابع تقدمك، وطوّر مهاراتك التقنية، واستعد لمقابلتك القادمة باقتدار.",
    "dashboard.stats.total": "إجمالي المقابلات",
    "dashboard.stats.avgScore": "متوسط الدرجات",
    "dashboard.stats.completed": "الجلسات المكتملة",
    "dashboard.stats.hours": "وقت التدريب",
    "dashboard.recent.title": "أحدث المقابلات",
    "dashboard.recent.viewAll": "عرض الكل",
    "dashboard.recent.empty": "لم تجرِ أي مقابلات بعد",
    "dashboard.recent.startFirst": "ابدأ مقابلتك التجريبية الأولى بالذكاء الاصطناعي لتقييم مهاراتك وتلقي ملاحظات فورية.",
    "dashboard.recent.startNow": "ابدأ مقابلة جديدة الآن",

    // Settings
    "settings.title": "الإعدادات",
    "settings.subtitle": "إدارة أمان حسابك، مظهر الشاشة، والتفضيلات العامة.",
    "settings.accountInfo": "معلومات الحساب",
    "settings.appearance.title": "المظهر واللغة",
    "settings.appearance.desc": "اختر مظهر الألوان المفضل لديك ولغة الواجهة.",
    "settings.appearance.theme": "سمة الألوان",
    "settings.appearance.themeDesc": "التبديل بين الوضع الداكن والفاتح أو حسب إعدادات جهازك.",
    "settings.appearance.lang": "لغة الواجهة",
    "settings.appearance.langDesc": "حدد اللغة المستخدمة في كامل صفحات لوحة التحكم.",
    "settings.password.title": "تغيير كلمة المرور",
    "settings.password.desc": "تأكد من استخدام كلمة مرور قوية وغير مكررة لحماية حسابك.",
    "settings.password.current": "كلمة المرور الحالية",
    "settings.password.new": "كلمة المرور الجديدة",
    "settings.password.confirm": "تأكيد كلمة المرور الجديدة",
    "settings.password.update": "تحديث كلمة المرور",
    "settings.password.updating": "جاري التحديث...",
    "settings.delete.title": "منطقة الخطر",
    "settings.delete.desc": "حذف حسابك نهائياً مع كافة المقابلات والتقارير والبيانات المرتبطة به.",
    "settings.delete.confirm": "هل أنت متأكد تماماً؟ لا يمكن التراجع عن هذا الإجراء.",
    "settings.delete.btn": "حذف الحساب نهائياً",

    // Profile
    "profile.share": "مشاركة الملف الشخصي",
    "profile.shareSuccess": "تم نسخ رابط الملف الشخصي بنجاح!",
    "profile.downloadPdf": "تنزيل كـ PDF",
    "profile.publicPreview": "معاينة عامة",
    "profile.readiness.title": "جاهزية المقابلة بالذكاء الاصطناعي",
    "profile.readiness.desc": "محسوبة بناءً على جلسات التدريب الواقعية وتقييمات الذكاء الاصطناعي لمهاراتك.",
    "profile.readiness.score": "معدل الجاهزية",
    "profile.readiness.status.ready": "جاهز للمقابلات",
    "profile.readiness.status.practicing": "في مرحلة التدريب",
    "profile.readiness.status.starter": "بحاجة للتدريب",
    "profile.readiness.totalInterviews": "المقابلات المنجزة",
    "profile.readiness.assessedSkills": "المهارات المقيمة",
    "profile.readiness.avgScore": "متوسط الأداء",
    "profile.readiness.strengths": "أبرز نقاط القوة",
    "profile.readiness.focusAreas": "مجالات للتحسين",
    "profile.readiness.practiceCta": "تدرب الآن مع الـ AI",
    "profile.readiness.noData": "أجرِ أول مقابلة تجريبية بالذكاء الاصطناعي لحساب درجة جاهزيتك.",
    "profile.projects.title": "المشاريع والخبرات العملية",
    "profile.projects.desc": "أبرز إنجازاتك البرمجية والتقنيات التي بنيت بها مشاريعك وتطبيقاتك.",
    "profile.projects.add": "إضافة مشروع",
    "profile.projects.edit": "تعديل المشروع",
    "profile.projects.empty": "لم تتم إضافة مشاريع بعد. أضف أفضل أعمالك التقنية!",
    "profile.projects.role": "الدور البرمجي",
    "profile.projects.period": "الفترة الزمنية",
    "profile.projects.tech": "التقنيات المستخدمة",
    "profile.projects.liveDemo": "المعاينة الحية",
    "profile.projects.github": "رابط الكود",

    // Interview Setup
    "setup.title": "إعداد المقابلة التجريبية",
    "setup.subtitle": "خصص مسار مقابلتك، واختر صوت المدرب الذكي، وتأكد من جاهزية أجهزتك قبل البدء.",
    "setup.step1.title": "تخصيص المقابلة",
    "setup.step1.desc": "اللغة، التقنيات ومستوى الصعوبة",
    "setup.step2.title": "صوت المدرب الذكي",
    "setup.step2.desc": "شخصية المدرب ونبرة الصوت",
    "setup.step3.title": "العتاد وميثاق النزاهة",
    "setup.step3.desc": "الكاميرا، الميكروفون وشروط الجلسة",
    "setup.presets.title": "مسارات سريعة مسبقة الإعداد",
    "setup.presets.desc": "اختر مساراً لتحديد التقنيات تلقائياً بنقرة واحدة، أو خصص اختياراتك يدوياً:",
    "setup.lang.title": "1. لغة المقابلة",
    "setup.lang.desc": "حدد اللغة الأساسية للتحدث والكتابة والأسئلة خلال المقابلة:",
    "setup.tech.title": "2. التقنيات المستهدفة",
    "setup.tech.desc": "اختر المهارات والتقنيات التي ترغب أن يركز عليها الذكاء الاصطناعي في أسئلته:",
    "setup.level.title": "3. المستوى الوظيفي المستهدف",
    "setup.level.desc": "حدد مستوى الخبرة المتوقع لضبط درجة صعوبة وعمق الأسئلة:",
    "setup.job.toggle": "المقابلة مخصصة لوصف وظيفي معين (اختياري)",
    "setup.job.placeholder": "الصق متطلبات الوظيفة ووصفها هنا ليركز الذكاء الاصطناعي على معاييرها...",
    "setup.voice.title": "صوت ونبرة المدرب الذكي",
    "setup.voice.desc": "اختر نبرة الصوت وشخصية المدرب التي تفضلها. يمكنك الاستماع لعينة صوتية حية:",
    "setup.hardware.title": "فحص العتاد والأجهزة",
    "setup.hardware.desc": "تأكد من عمل الكاميرا والتقاط الميكروفون للصوت بوضوح:",
    "setup.rules.title": "ميثاق النزاهة والمراقبة الذكية",
    "setup.rules.desc": "لضمان تقييم حقيقي وعادل، تراقب الجلسة بنظام ذكاء اصطناعي (حركة العينين، التبديل بين النوافذ، الأصوات المحيطة).",
    "setup.rules.acceptAll": "الموافقة على الكل",
    "setup.rules.deselectAll": "إلغاء التحديد",
    "setup.summary.title": "ملخص جلسة المقابلة",
    "setup.btn.next": "الخطوة التالية",
    "setup.btn.prev": "السابق",
    "setup.btn.start": "ابدأ المقابلة الآن",
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "ai_interview_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (savedLang === "ar" || savedLang === "en") {
        setLanguageState(savedLang);
      }
    } catch {
      // localStorage may not be available
    }
    setMounted(true);
  }, []);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language, direction, mounted]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    const currentDict = translations[language];
    return currentDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        toggleLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
