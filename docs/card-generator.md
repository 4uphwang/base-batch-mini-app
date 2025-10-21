# BaseCard Generator

A utility for generating personalized BaseCard SVG images with custom profile information.

## Features

-   Generate SVG cards with custom profile data
-   Support for profile images, skills, bio, and role information
-   Customizable styling options (colors, dimensions)
-   Download cards as SVG files
-   React components for easy integration
-   TypeScript support

## Usage

### Basic Usage

```typescript
import {
    generateCardSVG,
    generateCardDataURL,
    CardProfile,
} from "@/lib/cardGenerator";

const profile: CardProfile = {
    nickname: "John Doe",
    basename: "johndoe.base",
    role: "Web3 Developer",
    skills: ["React", "TypeScript", "Solidity"],
    bio: "Passionate about building the future of the internet with blockchain technology.",
};

// Generate SVG string
const svgString = generateCardSVG(profile);

// Generate data URL for use in img src
const dataURL = generateCardDataURL(profile);
```

### Using the React Component

```tsx
import CardGenerator from "@/components/main/CardGenerator";

function MyComponent() {
    const profile = {
        nickname: "Alice Johnson",
        basename: "alice.base",
        role: "Blockchain Developer",
        skills: ["Solidity", "React", "Node.js"],
        bio: "Building the future of decentralized applications.",
    };

    return (
        <CardGenerator
            profile={profile}
            showDownloadButton={true}
            options={{
                width: 400,
                height: 600,
                backgroundColor: "#ffffff",
                textColor: "#1f2937",
                accentColor: "#3b82f6",
            }}
        />
    );
}
```

### Using the Hook

```tsx
import { useCardGenerator } from "@/components/main/CardGenerator";

function MyComponent() {
    const { cardDataURL, isLoading } = useCardGenerator(profile, options);

    if (isLoading) return <div>Loading...</div>;

    return <img src={cardDataURL} alt="BaseCard" />;
}
```

## API Reference

### CardProfile Interface

```typescript
interface CardProfile {
    nickname: string; // Display name
    basename: string; // Base name (e.g., "johndoe.base")
    role: string; // Professional role
    profileImage?: string; // Base64 encoded image or URL
    skills?: string[]; // Array of skills
    bio?: string; // Bio/description
}
```

### CardGeneratorOptions Interface

```typescript
interface CardGeneratorOptions {
    width?: number; // Card width (default: 400)
    height?: number; // Card height (default: 600)
    backgroundColor?: string; // Background color (default: "#ffffff")
    textColor?: string; // Text color (default: "#000000")
    accentColor?: string; // Accent color (default: "#0066ff")
}
```

### Functions

#### `generateCardSVG(profile, options?)`

Generates an SVG string for the card.

#### `generateCardDataURL(profile, options?)`

Generates a data URL that can be used in img src attributes.

#### `downloadCardSVG(profile, filename?, options?)`

Downloads the card as an SVG file.

#### `generateMockCard()`

Generates a mock profile for testing purposes.

## Examples

### Custom Styling

```typescript
const customOptions = {
    width: 350,
    height: 525,
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    accentColor: "#8b5cf6",
};

const dataURL = generateCardDataURL(profile, customOptions);
```

### With Profile Image

```typescript
const profileWithImage = {
    ...profile,
    profileImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
};
```

### Download Card

```typescript
import { downloadCardSVG } from "@/lib/cardGenerator";

const handleDownload = () => {
    downloadCardSVG(profile, "my_basecard.svg");
};
```

## Demo

Visit `/card-demo` to see the interactive card generator demo with:

-   Random card generation
-   Custom card creation
-   Real-time preview
-   Download functionality

## Integration with MintPromptSection

The `MintPromptSection` component now includes a preview of the generated card:

```tsx
import MintPromptSection from "@/components/main/MintPromptSection";

function MintPage() {
    const handleMint = () => {
        // Handle minting logic
    };

    return <MintPromptSection onMintClick={handleMint} />;
}
```

The component automatically generates a mock card preview and displays it in the mint prompt section.
