"use client";

import { useState } from "react";
import {
  X,
  Building2,
  Key,
  Users,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import {
  AdminCompany,
  useCompanyApiKeys,
  useCreateApiKeyMutation,
  useRevokeApiKeyMutation,
  useCompanyCandidates,
  useCreateCandidateMutation,
} from "@repo/shared";
import { CreateApiKeyModal } from "./CreateApiKeyModal";
import { CreateCandidateModal } from "./CreateCandidateModal";

interface CompanyDetailsModalProps {
  company: AdminCompany | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailsModal({
  company,
  isOpen,
  onClose,
}: CompanyDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"api-keys" | "candidates">("api-keys");
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [isCreateCandidateOpen, setIsCreateCandidateOpen] = useState(false);
  const [copiedPrefixId, setCopiedPrefixId] = useState<string | null>(null);

  const companyId = company?.id || null;

  const { data: apiKeys = [], isLoading: keysLoading } = useCompanyApiKeys(companyId);
  const { data: candidates = [], isLoading: candidatesLoading } = useCompanyCandidates(companyId);

  const createApiKeyMutation = useCreateApiKeyMutation();
  const revokeApiKeyMutation = useRevokeApiKeyMutation();
  const createCandidateMutation = useCreateCandidateMutation();

  if (!isOpen || !company) return null;

  const handleCopyPrefix = (prefix: string, id: string) => {
    navigator.clipboard.writeText(prefix);
    setCopiedPrefixId(id);
    setTimeout(() => setCopiedPrefixId(null), 2000);
  };

  const handleRevoke = (keyId: string) => {
    if (confirm("Are you sure you want to revoke this API key? Systems using it will lose access immediately.")) {
      revokeApiKeyMutation.mutate({ companyId: company.id, apiKeyId: keyId });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
        <div className="w-full max-w-3xl bg-card border border-border/80 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] flex flex-col animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{company.name}</h2>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      company.isActive
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}
                  >
                    {company.isActive ? "Active Enterprise" : "Suspended"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  slug: {company.slug} &bull; ID: {company.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 shrink-0">
            <button
              onClick={() => setActiveTab("api-keys")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "api-keys"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              API Keys ({apiKeys.length})
            </button>
            <button
              onClick={() => setActiveTab("candidates")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "candidates"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Candidates ({candidates.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            {activeTab === "api-keys" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Integration API Keys
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Use these keys to authenticate B2B requests via Authorization: Bearer sk_live_...
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateKeyOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Generate Key
                  </button>
                </div>

                {keysLoading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">Loading keys...</div>
                ) : apiKeys.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl space-y-2">
                    <Key className="w-8 h-8 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-medium text-foreground">No API keys generated yet</p>
                    <p className="text-[11px] text-muted-foreground">
                      Generate an API key to allow this company to create assessments via webhook or ATS.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {apiKeys.map((k) => (
                      <div
                        key={k.id}
                        className="p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{k.name}</span>
                            {k.revokedAt ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                <XCircle className="w-3 h-3" /> Revoked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <span>{k.keyPrefix}...</span>
                            <button
                              onClick={() => handleCopyPrefix(k.keyPrefix, k.id)}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy prefix"
                            >
                              {copiedPrefixId === k.id ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created {new Date(k.createdAt).toLocaleDateString()}
                            </span>
                            {k.lastUsedAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Last used {new Date(k.lastUsedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {!k.revokedAt && (
                          <button
                            onClick={() => handleRevoke(k.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all self-start sm:self-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Revoke Key
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "candidates" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Company Candidates
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Candidates mapped to this company for AI assessments
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateCandidateOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Candidate
                  </button>
                </div>

                {candidatesLoading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">Loading candidates...</div>
                ) : candidates.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl space-y-2">
                    <Users className="w-8 h-8 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-medium text-foreground">No candidates registered</p>
                    <p className="text-[11px] text-muted-foreground">
                      Candidates registered via API or manually will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/60 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">External ID</th>
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {candidates.map((c) => (
                          <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                              {c.externalId}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-foreground">
                              {c.firstName} {c.lastName || ""}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {c.email || c.phone || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateApiKeyModal
        isOpen={isCreateKeyOpen}
        onClose={() => setIsCreateKeyOpen(false)}
        onSubmit={async (data) => {
          return createApiKeyMutation.mutateAsync({ companyId: company.id, data });
        }}
        isLoading={createApiKeyMutation.isPending}
        companyName={company.name}
      />

      <CreateCandidateModal
        isOpen={isCreateCandidateOpen}
        onClose={() => setIsCreateCandidateOpen(false)}
        onSubmit={(data) => {
          createCandidateMutation.mutate(
            { companyId: company.id, data },
            {
              onSuccess: () => setIsCreateCandidateOpen(false),
            }
          );
        }}
        isLoading={createCandidateMutation.isPending}
        companyName={company.name}
      />
    </>
  );
}
