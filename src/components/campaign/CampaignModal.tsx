import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Chip } from '@nextui-org/chip';
import { Input } from '@nextui-org/input';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Target,
  Sparkles,
  Clock,
  Award,
  Gift,
  ExternalLink,
} from 'lucide-react';
import { Campaign, NFTTier } from '@/types/cardano';
import { useCampaign } from '../contexts/campaign/CampaignContext';
import { useWallet } from '../contexts/wallet/WalletContext';
import {
  formatADA,
  formatDate,
  calculateDaysRemaining,
  calculateFundingPercentage,
  getRarityBadgeColor,
  getRarityColor,
} from '../utils';

interface CampaignModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignModal({ campaign, isOpen, onClose }: CampaignModalProps) {
  const [walletConnection] = useWallet();
  const [, processCampaign] = useCampaign();
  const [selectedTier, setSelectedTier] = useState<NFTTier | null>(null);
  const [supportAmount, setSupportAmount] = useState<number>(0);
  const [isSupporting, setIsSupporting] = useState(false);

  const fundingPercentage = calculateFundingPercentage(campaign.currentFunds, campaign.goal);
  const daysRemaining = calculateDaysRemaining(campaign.deadline);
  const isExpired = daysRemaining <= 0;
  const isFunded = fundingPercentage >= 100;

  const handleTierSelect = (tier: NFTTier) => {
    setSelectedTier(tier);
    setSupportAmount(tier.price);
  };

  const handleSupport = async () => {
    if (!walletConnection.address || !selectedTier || supportAmount <= 0) {
      alert('Please connect wallet and select a tier');
      return;
    }

    if (selectedTier.currentSupply >= selectedTier.maxSupply) {
      alert('This tier is sold out');
      return;
    }

    setIsSupporting(true);

    try {
      // Here you would integrate with your Cardano smart contract
      // For now, we'll simulate the support transaction
      
      processCampaign({
        actionType: 'Support',
        campaign,
        tierId: selectedTier.id,
        amount: supportAmount,
      });

      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Successfully supported with ${supportAmount} ADA! You'll receive your ${selectedTier.name} NFT.`);
      onClose();
    } catch (error) {
      console.error('Error supporting campaign:', error);
      alert('Failed to support campaign. Please try again.');
    } finally {
      setIsSupporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>by {campaign.creatorName}</span>
            <Chip size="sm" variant="flat" color="primary">
              {campaign.category}
            </Chip>
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
        </ModalHeader>

        <ModalBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Campaign Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About This Project</h3>
                <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
              </div>

              {/* NFT Tiers */}
              <div>
                <h3 className="text-lg font-semibold mb-4">NFT Reward Tiers</h3>
                <div className="space-y-4">
                  {campaign.tiers.map((tier) => {
                    const isAvailable = tier.currentSupply < tier.maxSupply;
                    const availabilityPercentage = (tier.currentSupply / tier.maxSupply) * 100;

                    return (
                      <Card
                        key={tier.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedTier?.id === tier.id
                            ? 'ring-2 ring-primary-500 shadow-lg'
                            : 'hover:shadow-md'
                        } ${!isAvailable ? 'opacity-60' : ''}`}
                        isPressable={isAvailable}
                        onPress={() => isAvailable && handleTierSelect(tier)}
                      >
                        <CardBody className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <Chip
                                size="sm"
                                variant="flat"
                                className={getRarityBadgeColor(tier.rarity)}
                              >
                                {tier.rarity.toUpperCase()}
                              </Chip>
                              <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary-600">
                                {tier.price} ADA
                              </p>
                              <p className="text-xs text-gray-500">
                                {tier.currentSupply}/{tier.maxSupply} claimed
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <Progress
                              value={availabilityPercentage}
                              color={availabilityPercentage >= 90 ? "danger" : "primary"}
                              size="sm"
                              className="mb-1"
                            />
                            <p className="text-xs text-gray-600">
                              {tier.maxSupply - tier.currentSupply} remaining
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">Benefits:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {tier.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Gift className="w-3 h-3 text-primary-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {!isAvailable && (
                            <div className="mt-3 p-2 bg-red-50 rounded text-center">
                              <p className="text-sm font-medium text-red-800">Sold Out</p>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Campaign Stats & Support */}
            <div className="space-y-6">
              {/* Funding Progress */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {formatADA(campaign.currentFunds)} ADA
                    </h3>
                    <p className="text-gray-600">
                      raised of {formatADA(campaign.goal)} ADA goal
                    </p>
                  </div>

                  <Progress
                    value={fundingPercentage}
                    color={isFunded ? "success" : "primary"}
                    size="lg"
                    className="w-full"
                  />

                  <div className="text-center text-lg font-semibold text-primary-600">
                    {fundingPercentage.toFixed(1)}% funded
                  </div>
                </CardBody>
              </Card>

              {/* Campaign Stats */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">Backers</span>
                    </div>
                    <span className="font-semibold text-gray-900">{campaign.backers}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">Days Left</span>
                    </div>
                    <span className={`font-semibold ${
                      daysRemaining <= 7 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {isExpired ? 'Expired' : daysRemaining}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">Deadline</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatDate(campaign.deadline)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">NFT Tiers</span>
                    </div>
                    <span className="font-semibold text-gray-900">{campaign.tiers.length}</span>
                  </div>
                </CardBody>
              </Card>

              {/* Support Section */}
              {!isExpired && !isFunded && walletConnection.address && (
                <Card>
                  <CardBody className="p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Support This Campaign</h3>
                    
                    {selectedTier ? (
                      <div className="space-y-4">
                        <div className="p-3 bg-primary-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-primary-900">
                              {selectedTier.name}
                            </span>
                            <Chip
                              size="sm"
                              className={getRarityBadgeColor(selectedTier.rarity)}
                            >
                              {selectedTier.rarity}
                            </Chip>
                          </div>
                          <p className="text-sm text-primary-700">
                            You'll receive this NFT tier with all its benefits
                          </p>
                        </div>

                        <Input
                          type="number"
                          label="Support Amount (ADA)"
                          value={supportAmount.toString()}
                          onValueChange={(value) => setSupportAmount(Number(value))}
                          min={selectedTier.price}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">₳</span>
                            </div>
                          }
                        />

                        <Button
                          fullWidth
                          color="primary"
                          size="lg"
                          startContent={<Target className="w-5 h-5" />}
                          onPress={handleSupport}
                          isLoading={isSupporting}
                          loadingText="Processing..."
                          isDisabled={supportAmount < selectedTier.price}
                        >
                          Support with {supportAmount} ADA
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-2">Select an NFT tier above to support this campaign</p>
                        <Button
                          variant="light"
                          color="primary"
                          startContent={<Sparkles className="w-4 h-4" />}
                        >
                          Choose Your Reward
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Campaign Status Messages */}
              {isExpired && (
                <Card>
                  <CardBody className="p-6 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Campaign Ended</h3>
                    <p className="text-gray-600 text-sm">
                      This campaign has reached its deadline.
                    </p>
                  </CardBody>
                </Card>
              )}

              {isFunded && (
                <Card>
                  <CardBody className="p-6 text-center">
                    <Award className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Successfully Funded!</h3>
                    <p className="text-green-700 text-sm">
                      This campaign has reached its funding goal.
                    </p>
                  </CardBody>
                </Card>
              )}

              {!walletConnection.address && (
                <Card>
                  <CardBody className="p-6 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Connect Wallet</h3>
                    <p className="text-gray-600 text-sm">
                      Connect your Cardano wallet to support this campaign.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4">
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            variant="light"
            startContent={<ExternalLink className="w-4 h-4" />}
          >
            Share Campaign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}