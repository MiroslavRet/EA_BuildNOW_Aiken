import { fromText } from "@lucid-evolution/lucid";

const assetName = "STATE_TOKEN";

export const STATE_TOKEN = { assetName, hex: fromText(assetName) };

// Funding cap configurations based on campaign size
export const FUNDING_CAPS = {
  starter: 40000, // ADA - for smaller audience/first campaigns
  default: 100000, // ADA - most creators
  pro: 200000, // ADA - film/animation teams with big lists
};

// Default NFT tier configurations
export const DEFAULT_TIERS = {
  common: {
    name: 'Common Supporter',
    price: 10,
    maxSupply: 1200,
    rarity: 'common' as const,
    benefits: ['Digital artwork', 'Thank you message', 'Updates access']
  },
  uncommon: {
    name: 'Uncommon Backer',
    price: 30,
    maxSupply: 900,
    rarity: 'uncommon' as const,
    benefits: ['High-res artwork', 'Behind-the-scenes content', 'Early access']
  },
  rare: {
    name: 'Rare Collector',
    price: 50,
    maxSupply: 700,
    rarity: 'rare' as const,
    benefits: ['Exclusive artwork', 'Video call with creator', 'Physical print']
  },
  epic: {
    name: 'Epic Patron',
    price: 100,
    maxSupply: 200,
    rarity: 'epic' as const,
    benefits: ['Limited edition NFT', 'Custom artwork', 'Credits mention']
  },
  legendary: {
    name: 'Legendary Sponsor',
    price: 250,
    maxSupply: 24,
    rarity: 'legendary' as const,
    benefits: ['Ultra-rare NFT', 'Collaboration opportunity', 'Lifetime access']
  }
};

// Campaign categories
export const CAMPAIGN_CATEGORIES = [
  'Digital Art',
  'Animation',
  'Photography',
  'Graphic Design',
  'Mixed Media',
  'Film & Video',
  'Illustration',
  'Game Art'
];