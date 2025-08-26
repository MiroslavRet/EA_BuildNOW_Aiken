import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Chip } from '@nextui-org/chip';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, Target, Sparkles } from 'lucide-react';
import { useCampaign } from '../contexts/campaign/CampaignContext';
import { formatADA, formatDate, calculateDaysRemaining, calculateFundingPercentage, getRarityBadgeColor } from '../utils';
import CampaignModal from '../campaign/CampaignModal';
import { Campaign } from '@/types/cardano';

interface CampaignGridProps {
  onBack?: () => void;
  onViewAll?: () => void;
  featured?: boolean;
}

export default function CampaignGrid({ onBack, onViewAll, featured = false }: CampaignGridProps) {
  const [campaignState] = useCampaign();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { campaigns } = campaignState;

  const displayCampaigns = featured 
    ? campaigns.filter(c => c.featured).slice(0, 3)
    : campaigns;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                isIconOnly
                variant="light"
                onPress={onBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {featured ? 'Featured Campaigns' : 'All Campaigns'}
              </h2>
              <p className="text-gray-600 mt-1">
                {featured 
                  ? 'Discover trending projects from talented creators'
                  : `${campaigns.length} active campaigns waiting for your support`
                }
              </p>
            </div>
          </div>
          
          {featured && onViewAll && (
            <Button
              color="primary"
              variant="light"
              onPress={onViewAll}
            >
              View All Campaigns
            </Button>
          )}
        </div>

        {/* Campaign Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayCampaigns.map((campaign) => {
            const fundingPercentage = calculateFundingPercentage(campaign.currentFunds, campaign.goal);
            const daysRemaining = calculateDaysRemaining(campaign.deadline);
            const isExpiringSoon = daysRemaining <= 7;

            return (
              <motion.div key={campaign.id} variants={cardVariants}>
                <Card 
                  className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  isPressable
                  onPress={() => setSelectedCampaign(campaign)}
                >
                  {/* Campaign Image */}
                  <CardHeader className="p-0">
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Chip
                          size="sm"
                          variant="solid"
                          className="bg-white/90 text-gray-800"
                        >
                          {campaign.category}
                        </Chip>
                      </div>
                      <div className="absolute top-3 right-3">
                        {campaign.featured && (
                          <Chip
                            size="sm"
                            color="warning"
                            variant="solid"
                            startContent={<Sparkles className="w-3 h-3" />}
                          >
                            Featured
                          </Chip>
                        )}
                      </div>
                      {isExpiringSoon && (
                        <div className="absolute bottom-3 right-3">
                          <Chip
                            size="sm"
                            color="danger"
                            variant="solid"
                          >
                            {daysRemaining}d left
                          </Chip>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardBody className="p-6 space-y-4">
                    {/* Title and Creator */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by <span className="font-medium">{campaign.creatorName}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {campaign.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">
                          {formatADA(campaign.currentFunds)} ADA raised
                        </span>
                        <span className="text-gray-600">
                          {fundingPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={fundingPercentage}
                        color={fundingPercentage >= 100 ? "success" : "primary"}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">
                        Goal: {formatADA(campaign.goal)} ADA
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.backers} backers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{daysRemaining}d left</span>
                      </div>
                    </div>

                    {/* NFT Tiers Preview */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        NFT Rewards
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.tiers.slice(0, 3).map((tier) => (
                          <Chip
                            key={tier.id}
                            size="sm"
                            variant="flat"
                            className={getRarityBadgeColor(tier.rarity)}
                          >
                            {tier.price} ADA
                          </Chip>
                        ))}
                        {campaign.tiers.length > 3 && (
                          <Chip size="sm" variant="flat" className="bg-gray-100 text-gray-600">
                            +{campaign.tiers.length - 3} more
                          </Chip>
                        )}
                      </div>
                    </div>
                  </CardBody>

                  <CardFooter className="p-6 pt-0">
                    <Button
                      fullWidth
                      color="primary"
                      variant="solid"
                      startContent={<Target className="w-4 h-4" />}
                    >
                      Support Campaign
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {displayCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600">
              Be the first to create a campaign and start your creative journey!
            </p>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </section>
  );
}