"use client";

import { Bell, MessageSquare, Menu, Search, UserPlus } from "lucide-react";

type TopbarUser = {
  name: string;
  role: string;
  avatarUrl?: string;
};

type TopbarProps = {
  onMenuClick: () => void;
  user?: TopbarUser;
};

// داتا مؤقتة، بنبدلها بالداتا الحقيقية لما نربط الـ API
const MOCK_USER: TopbarUser = {
  name: "Elena Rostova",
  role: "Lead Platform Architect",
};

export function Topbar({ onMenuClick, user = MOCK_USER }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-[#0f0d15]/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      {/* زر القائمة: بس بالموبايل */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-white/70 hover:bg-white/5 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* البحث */}
      <div className="relative min-w-0 flex-1 md:max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          placeholder="Search pipelines, candidates, telemetry..."
          className="w-full rounded-xl bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-violet-400/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* على الموبايل بس الأيقونة، وعلى الشاشات الأكبر الأيقونة مع النص */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-violet-400 px-3 py-2 text-sm font-medium text-[#0c0a12] transition hover:bg-violet-300 sm:px-4"
        >
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">New Candidate</span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-white/70 hover:bg-white/5"
        >
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500" />
        </button>

        <button
          type="button"
          aria-label="Messages"
          className="hidden rounded-lg p-2 text-white/70 hover:bg-white/5 sm:block"
        >
          <MessageSquare className="size-5" />
        </button>

        {/* الأدمن */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium leading-tight">{user.name}</p>
            <p className="text-xs text-white/50">{user.role}</p>
          </div>
          <div className="grid size-9 place-items-center overflow-hidden rounded-full bg-violet-400/20 text-sm font-semibold text-violet-300">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}