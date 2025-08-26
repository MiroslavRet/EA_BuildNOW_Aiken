export interface Wallet {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<any>;
}

declare global {
  interface Window {
    cardano: {
      [key: string]: Wallet;
    };
  }
}

export interface NFTTier {
  id: string;
  name: string;
  price: number; // in ADA
  maxSupply: number;
  currentSupply: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  benefits: string[];
  image?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorName: string;
  goal: number; // in ADA
  currentFunds: number;
  deadline: Date;
  image: string;
  category: string;
  tiers: NFTTier[];
  backers: number;
  status: 'active' | 'funded' | 'expired' | 'cancelled';
  featured?: boolean;
}

export interface CampaignStats {
  totalCampaigns: number;
  totalFunded: number;
  totalBackers: number;
  successRate: number;
}