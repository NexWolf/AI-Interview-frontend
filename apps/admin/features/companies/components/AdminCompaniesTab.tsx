"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Key,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  AdminCompany,
  useAdminCompanies,
  useCreateCompanyMutation,
  useUpdateCompanyStatusMutation,
  useDebounce,
} from "@repo/shared";
import { CreateCompanyModal } from "./CreateCompanyModal";
import { CompanyDetailsModal } from "./CompanyDetailsModal";

export function AdminCompaniesTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<AdminCompany | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: companies = [], isLoading } = useAdminCompanies();
  const createCompanyMutation = useCreateCompanyMutation();
  const updateStatusMutation = useUpdateCompanyStatusMutation();

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.isActive).length;
  const inactiveCompanies = totalCompanies - activeCompanies;

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.slug.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? c.isActive
          : !c.isActive;

      return matchSearch && matchStatus;
    });
  }, [companies, debouncedSearch, statusFilter]);

  const handleToggleStatus = (company: AdminCompany) => {
    updateStatusMutation.mutate({
      id: company.id,
      isActive: !company.isActive,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Enterprises</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalCompanies}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Companies</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{activeCompanies}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Suspended</p>
            <p className="text-2xl font-bold text-rose-500 mt-1">{inactiveCompanies}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        </div>
      </div>

      {/* Companies List */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading registered companies...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">No companies found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search
                ? "Try searching with a different name or slug."
                : "No enterprise companies registered yet. Add your first client to start integrations."}
            </p>
            {!search && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add First Company
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Enterprise Name</th>
                  <th className="py-3 px-4">Slug Identifier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredCompanies.map((comp) => (
                  <tr
                    key={comp.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs uppercase">
                          {comp.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{comp.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">ID: {comp.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      <span className="px-2.5 py-1 rounded-lg bg-muted border border-border/60 text-xs">
                        {comp.slug}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(comp)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          comp.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
                        }`}
                        title="Click to toggle active status"
                      >
                        {comp.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCompany(comp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-background border border-border hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
                      >
                        <Key className="w-3 h-3 text-amber-500" />
                        Manage API & Candidates
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateCompanyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(data) => {
          createCompanyMutation.mutate(data, {
            onSuccess: () => setIsCreateOpen(false),
          });
        }}
        isLoading={createCompanyMutation.isPending}
      />

      <CompanyDetailsModal
        company={selectedCompany}
        isOpen={Boolean(selectedCompany)}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
}
