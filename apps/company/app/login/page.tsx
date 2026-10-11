import { CompanyLoginForm } from "../../features/auth/components/CompanyLoginForm";
import { ThemeToggle, LanguageToggle } from "@/shared";

export default function CompanyLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Top Bar with Language and Theme Controls */}
      <div className="absolute top-4 sm:top-6 end-4 sm:end-6 z-20 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <CompanyLoginForm />
    </div>
  );
}
