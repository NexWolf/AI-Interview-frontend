import { redirect } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/constants/routes";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmail({ searchParams }: PageProps) {
  console.log("SEARCH PARAMS HERE : ",searchParams)
    const resolvedParams = await searchParams;
    const token = resolvedParams?.token;

  if (!token) {
    console.log("Token not found in URL");
    return (
      <div className="bg-zinc-800 p-8 w-full h-fit">
        <p className="text-xl font-bold text-center">The link is invalid</p>
        <button>Resent Email Confirm</button>
      </div>
    );
  }

  let isSuccess = false;
  let errorMessage = "An unexpected error occured";
  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/verify-email?token=${token}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const contentType = response.headers.get("content-type");
    let data = { message: "An unxpected error occurred" };

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (response.ok) {
      isSuccess = true;
      
    }else {
        errorMessage = data.message || "Internal server error";
    }
  } catch (error) {
    console.error("Fetch error : ", error);
    errorMessage = "Could not connect to the server. please try again later.";
  }

  if(isSuccess) {
    redirect(`/auth`);
  }


    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <span className="text-2xl text-red-400">!</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Confirmation Failed</h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">{errorMessage}</p>

          <Link
            href="/auth"
            className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:scale-105 hover:bg-primary/90"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );

}
