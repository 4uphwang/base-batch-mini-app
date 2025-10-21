/**
 * Card Generator Utility
 * Generates custom BaseCard SVG with profile information
 */

export interface CardProfile {
    nickname: string;
    basename: string;
    role: string;
    profileImage?: string; // Base64 encoded image or URL
    skills?: string[];
    bio?: string;
}

export interface CardGeneratorOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

/**
 * Generates a custom BaseCard SVG with profile information
 */
export function generateCardSVG(
    profile: CardProfile,
    options: CardGeneratorOptions = {}
): string {
    const {
        width = 400,
        height = 600,
        backgroundColor = "#ffffff",
        textColor = "#000000",
        accentColor = "#0066ff",
    } = options;

    // Default profile image if none provided
    const defaultProfileImage =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS42NDA2IDMxLjY0MDYgNTQgNDYgNTRINTRDNjguMzU5NCA1NCA4MCA2NS42NDA2IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+";

    // BaseCard background image - import from public assets
    const baseCardBackground = "/assets/basecard-base.svg";

    const profileImage = profile.profileImage || defaultProfileImage;

    // Truncate text to fit within card bounds
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    const truncatedNickname = truncateText(profile.nickname, 20);
    const truncatedBasename = truncateText(profile.basename, 25);
    const truncatedRole = truncateText(profile.role, 30);

    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .card-text { 
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-weight: 600; 
        fill: ${textColor}; 
      }
      .card-title { 
        font-size: 24px; 
        font-weight: 700; 
        text-anchor: middle; 
      }
      .card-subtitle { 
        font-size: 18px; 
        font-weight: 500; 
        text-anchor: middle; 
      }
      .card-role { 
        font-size: 16px; 
        font-weight: 400; 
        text-anchor: middle; 
        fill: ${accentColor}; 
      }
      .card-bg { 
        fill: ${backgroundColor}; 
      }
    </style>
  </defs>
  
  <!-- Card Background with BaseCard SVG -->
  <rect width="${width}" height="${height}" rx="16" ry="16" fill="url(${baseCardBackground})" stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Header Section -->
  <rect x="20" y="20" width="${
      width - 40
  }" height="120" rx="12" ry="12" fill="${accentColor}" opacity="0.1"/>
  
  <!-- Profile Image -->
  <circle cx="${
      width / 2
  }" cy="80" r="40" fill="white" stroke="${accentColor}" stroke-width="3"/>
  <image href="${profileImage}" x="${
        width / 2 - 35
    }" y="45" width="70" height="70" clip-path="circle(35px at 35px 35px)"/>
  
  <!-- Profile Information -->
  <text x="${
      width / 2
  }" y="160" class="card-text card-title">${truncatedNickname}</text>
  <text x="${
      width / 2
  }" y="185" class="card-text card-subtitle">${truncatedBasename}</text>
  <text x="${
      width / 2
  }" y="210" class="card-text card-role">${truncatedRole}</text>
  
  <!-- Skills Section -->
  ${
      profile.skills && profile.skills.length > 0
          ? `
    <rect x="20" y="240" width="${
        width - 40
    }" height="120" rx="8" ry="8" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
    <text x="30" y="265" class="card-text" font-size="14" font-weight="600">Skills</text>
    ${profile.skills
        .slice(0, 4)
        .map(
            (skill, index) => `
      <rect x="${30 + (index % 2) * 150}" y="${
                280 + Math.floor(index / 2) * 25
            }" width="140" height="20" rx="10" ry="10" fill="${accentColor}" opacity="0.2"/>
      <text x="${
          30 + (index % 2) * 150 + 70
      }" y="${292}" class="card-text" font-size="12" text-anchor="middle">${truncateText(
                skill,
                15
            )}</text>
    `
        )
        .join("")}
  `
          : ""
  }
  
  <!-- Bio Section -->
  ${
      profile.bio
          ? `
    <rect x="20" y="${
        profile.skills && profile.skills.length > 0 ? "380" : "240"
    }" width="${
                width - 40
            }" height="120" rx="8" ry="8" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
    <text x="30" y="${
        (profile.skills && profile.skills.length > 0 ? "380" : "240") + 25
    }" class="card-text" font-size="14" font-weight="600">About</text>
    <text x="30" y="${
        (profile.skills && profile.skills.length > 0 ? "380" : "240") + 50
    }" class="card-text" font-size="12" font-weight="400">${truncateText(
                profile.bio,
                80
            )}</text>
  `
          : ""
  }
  
  <!-- Footer -->
  <rect x="20" y="${height - 60}" width="${
        width - 40
    }" height="40" rx="8" ry="8" fill="${accentColor}" opacity="0.1"/>
  <text x="${width / 2}" y="${
        height - 35
    }" class="card-text" font-size="12" text-anchor="middle" fill="${accentColor}">BaseCard NFT</text>
</svg>`.trim();
}

/**
 * Generates a data URL for the SVG that can be used in img src
 */
export function generateCardDataURL(
    profile: CardProfile,
    options: CardGeneratorOptions = {}
): string {
    const svg = generateCardSVG(profile, options);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Downloads the generated card as an SVG file
 */
export function downloadCardSVG(
    profile: CardProfile,
    filename: string = "basecard.svg",
    options: CardGeneratorOptions = {}
): void {
    const svg = generateCardSVG(profile, options);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generates a card with default mock data for testing
 */
export function generateMockCard(): CardProfile {
    return {
        nickname: "John Doe",
        basename: "johndoe.base",
        role: "Web3 Developer",
        skills: ["React", "TypeScript", "Solidity", "Next.js"],
        bio: "Passionate about building the future of the internet with blockchain technology and decentralized applications.",
    };
}
