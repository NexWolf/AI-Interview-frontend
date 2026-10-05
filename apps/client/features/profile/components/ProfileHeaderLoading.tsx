export const ProfileHeaderSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-12">
        <div className="relative  overflow-hidden rounded-3xl border border-border/70 dark:border-border/40 bg-card/80 dark:bg-card/40 backdrop-blur-2xl shadow-xl dark:shadow-2xl transition-all animate-pulse">
      {/* Cover Banner Skeleton */}
      <div className="relative h-36 sm:h-48 md:h-52 w-full bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 dark:from-muted/20 dark:via-muted/10 dark:to-muted/20" />

      <div className="p-6 sm:p-8 pt-0 relative z-10">
        {/* Avatar & Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-16 sm:-mt-20 mb-5 gap-4">
          {/* Avatar Skeleton */}
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-full border-4 border-card dark:border-card/90 bg-muted/80 dark:bg-muted/50 shadow-xl ring-2 ring-border/20" />

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="h-10 w-36 rounded-xl bg-muted/70 dark:bg-muted/40" />
            <div className="h-9 w-9 rounded-xl bg-muted/70 dark:bg-muted/40" />
          </div>
        </div>

        {/* User Details Skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            {/* Name + Verified Badge */}
            <div className="flex items-center gap-3">
              <div className="h-7 sm:h-8 w-48 sm:w-64 rounded-lg bg-muted/80 dark:bg-muted/50" />
              <div className="h-5 w-20 rounded-full bg-muted/60 dark:bg-muted/30" />
            </div>

            {/* Username */}
            <div className="h-4 w-28 rounded-md bg-muted/60 dark:bg-muted/30" />
          </div>

          {/* Bio Skeleton */}
          <div className="space-y-2 max-w-2xl pt-1">
            <div className="h-3.5 w-full rounded-md bg-muted/60 dark:bg-muted/30" />
            <div className="h-3.5 w-4/5 rounded-md bg-muted/60 dark:bg-muted/30" />
          </div>

          {/* Contact Info (Email & Phone) */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50 dark:border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-muted/80 dark:bg-muted/50" />
              <div className="h-3.5 w-36 rounded-md bg-muted/60 dark:bg-muted/30" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-muted/80 dark:bg-muted/50" />
              <div className="h-3.5 w-28 rounded-md bg-muted/60 dark:bg-muted/30" />
            </div>
          </div>

          {/* Social Links Skeleton */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="h-7 w-28 rounded-xl bg-secondary/50 dark:bg-secondary/20" />
            <div className="h-7 w-32 rounded-xl bg-secondary/50 dark:bg-secondary/20" />
            <div className="h-7 w-24 rounded-xl bg-secondary/50 dark:bg-secondary/20" />
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default ProfileHeaderSkeleton;