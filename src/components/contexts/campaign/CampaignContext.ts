import { createContext, useContext } from 'react';
import { CampaignState, CampaignAction } from '@/types/campaign';

export const CampaignContext = createContext<
  [CampaignState, (action: CampaignAction) => void]
>([
  { campaigns: [], isLoading: false },
  () => {}
]);

export const useCampaign = () => useContext(CampaignContext);