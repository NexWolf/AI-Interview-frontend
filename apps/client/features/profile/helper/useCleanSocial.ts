import { Link as LinkIcon, Globe } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter, FaLink } from "react-icons/fa6";
import type { ElementType } from "react";

type IconComponentType = ElementType;

type PlatformType =
    | "portfolio"
    | "linkedin"
    | "twitter"
    | "github"
    | "website"
    | "other";

type SocialLinksMap = {
    id: number;
    label: string;
    platform: PlatformType;
    social_url: string;
    icon: IconComponentType;
    bg_color?: string;
    text_color?: string;
};


const CleanSocialLinks = (links: string[]): SocialLinksMap[] => {
    return links.map((url, index) => {
        let platform: PlatformType = "other";
        let label = "link";
        let icon: IconComponentType = LinkIcon;


        try {
            const domain = new URL(url).hostname.toLowerCase();

            if (domain.includes("github.com")) {
                platform = "github";
                label = "GitHub";
                icon = FaGithub;
            } else if (domain.includes("linkedin.com")) {
                platform = "linkedin";
                label = "LinkedIn";
                icon = FaLinkedin;
            } else if (domain.includes("twitter.com") || domain.includes("x.com")) {
                platform = "twitter";
                label = "Twitter";
                icon = FaXTwitter;
            } else if (domain.includes("portfolio")) {
                platform = "portfolio";
                label = "Portfolio";
                icon = FaLink;
            } else {
                platform = "website";
                label = "Website";
                icon = Globe;
            }
        } catch (e) {
        } finally {
            return {
                id: index + 1, // الفهرس الديناميكي (Dynamic Index)
                label,
                platform,
                social_url: url,
                icon,
            };
        }
    });
};