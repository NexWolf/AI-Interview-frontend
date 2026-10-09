"use client";

import { useState } from "react";
import { Building2, Save, Bell, Globe, Shield } from "lucide-react";
import { toast } from "sonner";

export function CompanySettingsTab() {
  const [name, setName] = useState("Acme Corporation");
  const [slug] = useState("acme-corp");
  const [email, setEmail] = useState("recruiting@acmecorp.com");
  const [webhookUrl, setWebhookUrl] = useState("https://ats.acmecorp.com/webhooks/nexwolf");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Company settings updated successfully");
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-base font-bold text-foreground">Company & Workspace Settings</h3>
        <p className="text-xs text-muted-foreground">Manage organizational profile, notifications, and webhook webhooks</p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Slug Identifier</label>
          <input
            type="text"
            value={slug}
            disabled
            className="w-full px-3.5 py-2 text-sm bg-muted/60 border border-border/70 rounded-xl text-muted-foreground font-mono text-xs cursor-not-allowed"
          />
          <p className="text-[11px] text-muted-foreground">Managed by system administrators.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">HR / Primary Contact Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">ATS Webhook Callback URL</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            We will send a POST notification here whenever a candidate completes their assessment.
          </p>
        </div>

        <div className="pt-3 border-t border-border/50 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
