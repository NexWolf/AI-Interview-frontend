
export const useLookScroll = (scrollLock: boolean) => {
    if (scrollLock) {
        window.document.body.style.overflow = "hidden";
    }

    return () => window.document.body.style.overflow = "default";
}


