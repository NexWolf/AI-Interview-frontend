import OnBoardingComponent from "@/features/onboarding/components/OnBoardingComponent";

export default async function Page() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto">
        <OnBoardingComponent />
      </div>
    </main>
  );
}
