"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Phone,
  Briefcase,
  X,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/shared";
import {
  Pagination,
  usePortalCandidates,
  useCreatePortalCandidate,
  useCreatePortalInterview,
  useAllSkills,
  Skeleton,
} from "@repo/shared";

export function CompanyCandidatesTab() {
  const { t, isArabic } = useLanguage();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live queries
  const { data: candidates = [], isLoading } = usePortalCandidates();
  const { data: skillsData } = useAllSkills();
  const createCandidateMutation = useCreatePortalCandidate();
  const createInterviewMutation = useCreatePortalInterview();

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    externalId: "",
    jobDescription: "",
    difficulty: "Intermediate",
    language: "English",
    selectedSkillId: "",
  });

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.externalId.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedCandidates = filteredCandidates.slice(
    (page - 1) * limit,
    page * limit,
  );

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success(
      isArabic
        ? "تم نسخ رابط مقابلة المرشح بنجاح"
        : "Candidate interview invitation link copied!",
    );
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCandidate.name.trim();
    if (!trimmedName || !newCandidate.email.trim()) {
      toast.error(
        isArabic
          ? "يرجى إدخال اسم المرشح والبريد الإلكتروني"
          : "Candidate name and email are required",
      );
      return;
    }

    const nameParts = trimmedName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || undefined;

    setIsSubmitting(true);
    try {
      // 1. Create real candidate record
      const createdCandidate = await createCandidateMutation.mutateAsync({
        firstName,
        lastName,
        email: newCandidate.email.trim(),
        phone: newCandidate.phone.trim() || undefined,
        externalId:
          newCandidate.externalId.trim() ||
          `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      });

      // 2. Automatically generate live AI interview invitation session
      const skillIds = newCandidate.selectedSkillId
        ? [Number(newCandidate.selectedSkillId)]
        : [];

      await createInterviewMutation.mutateAsync({
        candidateId: createdCandidate.id,
        difficultyLevel: newCandidate.difficulty,
        jobDescription: newCandidate.jobDescription.trim() || undefined,
        interviewLanguage: newCandidate.language,
        skillIds,
      });

      toast.success(
        isArabic
          ? "تمت إضافة المرشح وإنشاء رابط المقابلة بنجاح!"
          : "Candidate added & AI interview invitation created!",
      );

      setIsAddModalOpen(false);
      setNewCandidate({
        name: "",
        email: "",
        phone: "",
        externalId: "",
        jobDescription: "",
        difficulty: "Intermediate",
        language: "English",
        selectedSkillId: "",
      });
    } catch {
      // handled by mutation onError
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInterviewUrl = (interviewId?: string, invitationUrl?: string) => {
    if (invitationUrl) return invitationUrl;
    if (!interviewId) return "http://localhost:3000";
    return `http://localhost:3000/interview/${interviewId}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {t("candidates.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("candidates.subtitle")}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t("candidates.addBtn")}
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-sm transition-colors duration-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("candidates.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full ps-10 pe-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <span className="text-xs text-muted-foreground self-center">
          {filteredCandidates.length} {isArabic ? "مرشح مسجل" : "registered candidates"}
        </span>
      </div>

      {/* Candidates List Table */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md overflow-hidden shadow-sm transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{t("candidates.thName")}</th>
                <th className="py-3 px-4 text-start">{t("candidates.thExternalId")}</th>
                <th className="py-3 px-4 text-start">{isArabic ? "المقابلات المنفذة" : "Sessions"}</th>
                <th className="py-3 px-4 text-start">{t("candidates.thLatestStatus")}</th>
                <th className="py-3 px-4 text-start">{t("candidates.thScore")}</th>
                <th className="py-3 px-4 text-end">{t("candidates.thActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-4 w-48 rounded" />
                          <Skeleton className="h-3 w-32 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedCandidates.length > 0 ? (
                paginatedCandidates.map((c) => {
                  const latest = c.latestInterview;
                  const invitationLink = getInterviewUrl(latest?.id, (latest as any)?.invitationUrl);

                  return (
                    <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 px-4 text-start">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground text-sm">{c.name}</p>
                          <div className="flex items-center gap-2 text-muted-foreground text-[11px] flex-wrap">
                            {c.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {c.email}
                              </span>
                            )}
                            {c.phone && (
                              <>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {c.phone}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-start font-mono font-medium text-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-muted border border-border/60 text-[11px]">
                          {c.externalId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-start text-foreground font-medium">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/70 text-xs">
                          <Briefcase className="w-3 h-3 text-muted-foreground" />
                          {c.interviewsCount} {isArabic ? "جلسة" : "sessions"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        {latest ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              latest.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {latest.status}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">
                            {isArabic ? "بانتظار الدعوة" : "No session"}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        <span className="text-sm font-bold text-foreground">
                          {latest?.score !== null && latest?.score !== undefined
                            ? `${latest.score}%`
                            : "—"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {latest && (
                            <>
                              <button
                                onClick={() => handleCopyLink(invitationLink, c.id)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-border/70 hover:bg-muted text-foreground transition-all cursor-pointer shadow-sm"
                                title={isArabic ? "نسخ رابط المقابلة" : "Copy interview link"}
                              >
                                {copiedId === c.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                                <span>
                                  {copiedId === c.id
                                    ? isArabic
                                      ? "تم النسخ"
                                      : "Copied"
                                    : isArabic
                                      ? "نسخ الرابط"
                                      : "Copy Link"}
                                </span>
                              </button>

                              <a
                                href={invitationLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-xl border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
                                title={isArabic ? "فتح غرفة المرشح" : "Open Candidate Room"}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <Users className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                      <p className="text-xs font-medium">
                        {isArabic
                          ? "لا يوجد مرشحون مسجلون حالياً."
                          : "No candidates found in the registry."}
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isArabic ? "إضافة أول مرشح الآن" : "Add your first candidate"}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length > 0 && (
          <Pagination
            page={page}
            limit={limit}
            total={filteredCandidates.length}
            onPageChange={setPage}
            onLimitChange={setLimit}
            itemLabel={isArabic ? "مرشحين" : "candidates"}
            className="border-x-0 border-b-0 rounded-none bg-card/30"
          />
        )}
      </div>

      {/* Add Candidate & Generate Live Interview Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {isArabic ? "دعوة مرشح جديد للمقابلة" : "Invite Candidate to Interview"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isArabic
                    ? "تحديد معايير التقييم والوصف الوظيفي للمقابلة"
                    : "Setup evaluation criteria and target job description"}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  {isArabic ? "اسم المرشح *" : "Candidate Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    {isArabic ? "البريد الإلكتروني *" : "Candidate Email *"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    placeholder="+966 5x xxx xxxx"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    {isArabic ? "المعرف الخارجي (ATS ID)" : "ATS External ID"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. APP-1092"
                    value={newCandidate.externalId}
                    onChange={(e) => setNewCandidate({ ...newCandidate, externalId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground placeholder:text-muted-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    {isArabic ? "مستوى الصعوبة" : "Difficulty Level"}
                  </label>
                  <select
                    value={newCandidate.difficulty}
                    onChange={(e) => setNewCandidate({ ...newCandidate, difficulty: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="Beginner">{isArabic ? "مبتدئ (Beginner)" : "Beginner"}</option>
                    <option value="Intermediate">{isArabic ? "متوسط (Intermediate)" : "Intermediate"}</option>
                    <option value="Advanced">{isArabic ? "متقدم (Advanced)" : "Advanced"}</option>
                  </select>
                </div>
              </div>

              {skillsData && skillsData.length > 0 && (
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    {isArabic ? "المهارة التقنية المستهدفة" : "Target Technical Skill"}
                  </label>
                  <select
                    value={newCandidate.selectedSkillId}
                    onChange={(e) => setNewCandidate({ ...newCandidate, selectedSkillId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground cursor-pointer"
                  >
                    <option value="">{isArabic ? "اختياري - اختر مهارة" : "Optional - Select a skill"}</option>
                    {skillsData.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {isArabic ? s.nameAr || s.nameEn : s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-foreground">
                    {isArabic ? "الوصف الوظيفي (Job Description)" : "Job Description (JD)"}
                  </label>
                  <span className="text-[10px] text-primary font-medium">
                    {isArabic ? "يوجّه أسئلة الذكاء الاصطناعي بدقة" : "Guides Gemini AI Questions"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={
                    isArabic
                      ? "الصق متطلبات الوظيفة والمهارات المطلوبة ليقوم الذكاء الاصطناعي بتخصيص الأسئلة والتقييم بدقة..."
                      : "Paste key job responsibilities, tech stack, and experience expectations to tailor questions..."
                  }
                  value={newCandidate.jobDescription}
                  onChange={(e) => setNewCandidate({ ...newCandidate, jobDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground placeholder:text-muted-foreground resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground transition-all cursor-pointer font-medium"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold cursor-pointer shadow-md shadow-primary/20 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isArabic ? "إنشاء وتوليد رابط المقابلة" : "Generate Interview Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
