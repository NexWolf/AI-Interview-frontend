"use client";

import { useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/shared";
import {
  usePortalApiKeys,
  useCreatePortalApiKey,
  useRevokePortalApiKey,
  Skeleton,
} from "@repo/shared";

export function CompanyIntegrationsTab() {
  const { t, isArabic } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<string | null>(null);

  // Live queries & mutations
  const { data: apiKeys = [], isLoading } = usePortalApiKeys();
  const createKeyMutation = useCreatePortalApiKey();
  const revokeKeyMutation = useRevokePortalApiKey();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);

  const activeKeys = apiKeys.filter((k) => !k.isRevoked);
  const primaryKey = newlyGeneratedKey || activeKeys[0]?.keyPrefix || "";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success(isArabic ? "تم النسخ إلى الحافظة بنجاح" : "Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCurl(id);
    toast.success(isArabic ? "تم نسخ كود الربط بنجاح" : "Snippet copied to clipboard");
    setTimeout(() => setCopiedCurl(null), 2000);
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createKeyMutation.mutateAsync({
        name: newKeyName.trim() || "Default API Key",
      });

      if (result?.key) {
        setNewlyGeneratedKey(result.key);
      }
      setIsCreateModalOpen(false);
      setNewKeyName("");
      toast.success(
        isArabic
          ? "تم توليد مفتاح API جديد بنجاح!"
          : "New API key generated successfully!",
      );
    } catch {
      // handled by mutation onError
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (
      !confirm(
        isArabic
          ? "هل أنت متأكد من رغبتك في تعطيل هذا المفتاح؟ لن تتمكن الأنظمة المرتبطة به من الوصول بعد الآن."
          : "Are you sure you want to revoke this key? Integrated systems will lose access immediately.",
      )
    ) {
      return;
    }

    try {
      await revokeKeyMutation.mutateAsync(id);
      if (newlyGeneratedKey) setNewlyGeneratedKey(null);
      toast.success(isArabic ? "تم تعطيل المفتاح بنجاح" : "API key revoked");
    } catch {
      // handled
    }
  };

  const sampleKeyDisplay = newlyGeneratedKey
    ? newlyGeneratedKey
    : activeKeys[0]
      ? `${activeKeys[0].keyPrefix}••••••••••••••••••••`
      : "";

  const curlKeyPlaceholder = newlyGeneratedKey
    ? newlyGeneratedKey
    : activeKeys[0]
      ? `${activeKeys[0].keyPrefix}...`
      : "YOUR_API_KEY";

  const createInterviewSnippet = `curl -X POST http://localhost:5000/api/v1/company/interviews \\
  -H "Authorization: Bearer ${curlKeyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "candidateId": "CANDIDATE_UUID",
    "difficultyLevel": "Intermediate",
    "duration": 30,
    "interviewLanguage": "English",
    "jobDescription": "Frontend React 19 Engineer with experience in TypeScript and design systems."
  }'`;

  const getResultSnippet = `curl -X GET http://localhost:5000/api/v1/company/interviews/INTERVIEW_ID/result \\
  -H "Authorization: Bearer ${curlKeyPlaceholder}"`;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {t("integrations.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("integrations.subtitle")}
          </p>
        </div>

        <button
          onClick={() => {
            setNewlyGeneratedKey(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t("integrations.createKeyBtn")}
        </button>
      </div>

      {/* Newly Generated Secret Alert */}
      {newlyGeneratedKey && (
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {isArabic ? "مفتاح API جديد تم إنشاؤه" : "New Secret API Key Generated"}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {isArabic ? "انسخ المفتاح الآن، لن تتمكن من رؤيته كاملاً لاحقاً" : "Copy now, you won't see it again"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newlyGeneratedKey}
              readOnly
              className="w-full px-4 py-2.5 text-xs font-mono bg-background border border-emerald-500/40 rounded-xl focus:outline-none text-foreground select-all font-semibold"
            />
            <button
              onClick={() => handleCopy(newlyGeneratedKey, "secret-key")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {copiedKey === "secret-key" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === "secret-key" ? (isArabic ? "تم النسخ" : "Copied") : (isArabic ? "نسخ" : "Copy")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active API Keys List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <span>{t("integrations.apiKeysTitle")}</span>
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-2xl border border-border/60 bg-card/60 space-y-2">
                <Skeleton className="h-4 w-44 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            ))}
          </div>
        ) : apiKeys.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-foreground">{key.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted border border-border/60 text-muted-foreground">
                      {key.keyPrefix}••••••••
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        !key.isRevoked
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {!key.isRevoked ? t("integrations.active") : t("integrations.revoked")}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>
                      {t("integrations.created")}: {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                    {key.lastUsedAt && (
                      <span>
                        &bull; {t("integrations.lastUsed")}: {new Date(key.lastUsedAt).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>

                {!key.isRevoked && (
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                    disabled={revokeKeyMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t("integrations.revoke")}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3 border border-dashed border-border/60 rounded-2xl bg-card/40">
            <KeyRound className="w-8 h-8 text-muted-foreground/50 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                {isArabic ? "لم يتم إنشاء أي مفتاح API حتى الآن" : "No API keys generated yet"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isArabic
                  ? "أنشئ مفتاح API لربط نظام التوظيف الداخلي أو الـ ATS بمنصة التقييم الذكي."
                  : "Generate an API key to connect your ATS or custom pipeline to NexWolf AI."}
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("integrations.createKeyBtn")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Developer Documentation Cheat Sheet */}
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {isArabic ? "دليل الربط السريع للمؤسسات (B2B Quickstart)" : "B2B Integration Quickstart"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isArabic
              ? "استدعاء واجهات برمجة التطبيقات لتوليد مقابلات المرشحين وجلب تقارير النتائج آلياً"
              : "Directly invoke REST API endpoints to invite candidates and retrieve evaluation scorecards"}
          </p>
        </div>

        {/* Endpoint 1 */}
        <div className="p-5 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-3 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                POST
              </span>
              <span className="font-semibold text-foreground">/api/v1/company/interviews</span>
            </div>
            <button
              onClick={() => copySnippet(createInterviewSnippet, "create-interview")}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCurl === "create-interview" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {isArabic ? "نسخ cURL" : "Copy cURL"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {isArabic
              ? "يقوم بإنشاء غرفة مقابلة ذكية للمرشح ويرجع الرابط الفريد الخاص بدعوته للمقابلة (`invitationUrl`)."
              : "Creates an AI interview session for a candidate and returns their direct invitation URL (`invitationUrl`)."}
          </p>

          <pre className="p-3.5 rounded-xl bg-background border border-border/70 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
            {createInterviewSnippet}
          </pre>
        </div>

        {/* Endpoint 2 */}
        <div className="p-5 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-3 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                GET
              </span>
              <span className="font-semibold text-foreground">/api/v1/company/interviews/:id/result</span>
            </div>
            <button
              onClick={() => copySnippet(getResultSnippet, "get-result")}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCurl === "get-result" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {isArabic ? "نسخ cURL" : "Copy cURL"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {isArabic
              ? "يجلب الدرجات الكاملة، ونقاط القوة والضعف وتوصيات التوظيف الصادرة من الذكاء الاصطناعي بعد إتمام المقابلة."
              : "Fetches complete scores, strengths, weaknesses, and recommendation report after candidate finishes the interview."}
          </p>

          <pre className="p-3.5 rounded-xl bg-background border border-border/70 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
            {getResultSnippet}
          </pre>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground">
              {t("integrations.createKeyBtn")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isArabic
                ? "حدد اسماً وصفياً لمفتاح الـ API لتمييزه (مثل: Greenhouse Production Key)."
                : "Enter a descriptive name for this key to identify its usage."}
            </p>

            <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  {isArabic ? "اسم المفتاح" : "Key Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATS Production Integration"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground transition-all cursor-pointer font-medium"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={createKeyMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold cursor-pointer shadow-md shadow-primary/20 disabled:opacity-60"
                >
                  {createKeyMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isArabic ? "توليد المفتاح" : "Generate Key"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
