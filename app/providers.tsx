"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setNavigateFn } from "@/shared/lib/AxiosAPI";

export function Providers  ({children} : {children : React.ReactNode}) {
    const router = useRouter();
    const [queryClient] = useState(
        () => 
            new QueryClient({
                defaultOptions : {
                    queries: {
                        staleTime : 60 * 1000,
                        refetchOnWindowFocus : false,
                    }
                }
            })
    )

    // Route auth expiry redirects through the Next.js router so a session
    // expiry during an active page (e.g. interview setup with camera/mic
    // permissions open) does a soft client-side navigation instead of a
    // hard `window.location.href` reload.
    useEffect(() => {
        setNavigateFn(router.push);
        return () => setNavigateFn(null);
    }, [router.push]);

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}
