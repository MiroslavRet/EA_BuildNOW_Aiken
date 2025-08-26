import { useReducer } from 'react';
import { CampaignContext } from './CampaignContext';
import { CampaignState, CampaignAction } from '@/types/campaign';
import { Campaign } from '@/types/cardano';

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Digital Dreams: Abstract Art Collection',
    description: 'A stunning collection of abstract digital artworks exploring the intersection of technology and emotion.',
    creator: 'addr_test1...',
    creatorName: 'Sarah Chen',
    goal: 50000,
    currentFunds: 32500,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    category: 'Digital Art',
    backers: 287,
    status: 'active',
    featured: true,
    tiers: [
      {
        id: 't1',
        name: 'Digital Supporter',
        price: 25,
        maxSupply: 500,
        currentSupply: 234,
        rarity: 'common',
        benefits: ['High-res digital artwork', 'Thank you message']
      },
      {
        id: 't2',
        name: 'Art Collector',
        price: 75,
        maxSupply: 200,
        currentSupply: 89,
        rarity: 'rare',
        benefits: ['Exclusive NFT', 'Behind-the-scenes content', 'Physical print']
      }
    ]
  },
  {
    id: '2',
    title: 'Animated Worlds: Short Film Series',
    description: 'An ambitious animated short film series featuring original characters and immersive storytelling.',
    creator: 'addr_test2...',
    creatorName: 'Marcus Rodriguez',
    goal: 85000,
    currentFunds: 67200,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'Animation',
    backers: 412,
    status: 'active',
    featured: true,
    tiers: [
      {
        id: 't3',
        name: 'Animation Fan',
        price: 35,
        maxSupply: 800,
        currentSupply: 456,
        rarity: 'common',
        benefits: ['Early access to episodes', 'Character sketches']
      },
      {
        id: 't4',
        name: 'Producer Credit',
        price: 150,
        maxSupply: 50,
        currentSupply: 23,
        rarity: 'legendary',
        benefits: ['Producer credit', 'Custom character design', 'Meet the team']
      }
    ]
  }
];

const initialState: CampaignState = {
  campaigns: mockCampaigns,
  isLoading: false,
};

function campaignReducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.actionType) {
    case 'Create':
      if (!action.campaign) return state;
      return {
        ...state,
        campaigns: [...state.campaigns, action.campaign],
      };
    
    case 'Support':
      if (!action.campaign || !action.tierId || !action.amount) return state;
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.campaign!.id
            ? {
                ...campaign,
                currentFunds: campaign.currentFunds + action.amount!,
                backers: campaign.backers + 1,
                tiers: campaign.tiers.map(tier =>
                  tier.id === action.tierId
                    ? { ...tier, currentSupply: tier.currentSupply + 1 }
                    : tier
                )
              }
            : campaign
        ),
      };
    
    case 'Clear':
      return {
        ...state,
        selectedCampaign: undefined,
        error: undefined,
      };
    
    default:
      return state;
  }
}

export default function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  return (
    <CampaignContext.Provider value={[state, dispatch]}>
      {children}
    </CampaignContext.Provider>
  );
}