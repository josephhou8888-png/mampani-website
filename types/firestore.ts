
// Base product/prize structure
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    points: number;
    image: string;
}

export interface GamePrize {
    id: string;
    name:string;
    image: string;
    inventory: number;
    weight: number;
    sponsoredBy?: string;
}

export interface Reward {
    id: number | string;
    title: string;
    cost: number;
}

// User Profile stored in Supabase `profiles` table.
// The `id` of the profile should match the `id` from the `auth.users` table.
export interface AppUser {
    id: string; // This will be the auth user ID
    email: string | null;
    
    // Custom properties
    role?: 'admin' | 'user' | 'sponsor';
    name?: string;
    // User-specific data
    impact?: { co2Offset: number; treesPlanted: number };
    goals?: { co2Offset: number; treesPlanted: number };
    impactHistory?: { month: string; co2Offset: number; treesPlanted: number }[];
    cart?: Product[];
    points?: number;
    winnings?: { prizeId: string; timestamp: number }[];
    supportedProjects?: string[];
    // Sponsor-specific data
    companyName?: string;
    companyWebsite?: string;
    contactPerson?: string;
    contactRole?: string;
    phone?: string;
    companyDescription?: string;
}

// Sponsor Application document in `sponsor_applications` table
export interface SponsorApplication {
    id: string;
    sponsor_id: string; // user's auth id
    sponsor_company: string;
    product_name: string;
    product_image: string;
    quantity: number;
    status: 'pending' | 'approved' | 'rejected';
    win_weight?: number;
}

// Structure for the main content document
export interface WebsiteSettings {
    title: string;
    metaDescription: string;
    logoUrl: string;
    primaryColor: string;
    features: {
        splashEnabled: 'true' | 'false';
        aiChatEnabled: 'true' | 'false';
    };
    socialLinks: {
        twitter: string;
        facebook: string;
        instagram: string;
        linkedin: string;
    };
    tngApiKey: string;
}

export interface Content {
    websiteSettings: WebsiteSettings;
    products: Product[];
    gamePrizes: GamePrize[];
    rewards: Reward[];
    [key: string]: any; // for hero, about, etc. to keep it flexible
}

export interface AllContent {
    en: Content;
    ms: Content;
}