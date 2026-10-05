export const skillsKey = {
    All : ["skills"] as const,
    details : () => [...skillsKey.All, "detail"] as const,
    detail : (id : string) => [...skillsKey.details() , id] as const ,
}