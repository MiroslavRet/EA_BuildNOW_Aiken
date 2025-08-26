import { Campaign, NFTTier } from './cardano';

export interface CampaignFormData {
  title: string;
  description: string;
  category: string;
  goal: number;
  deadline: Date;
  image: string;
  tiers: Omit<NFTTier, 'id' | 'currentSupply'>[];
}

export interface CampaignAction {
  actionType: 'Create' | 'Support' | 'Cancel' | 'Claim' | 'Clear';
  campaign?: Campaign;
  tierId?: string;
  amount?: number;
}

export interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign?: Campaign;
  isLoading: boolean;
  error?: string;
}