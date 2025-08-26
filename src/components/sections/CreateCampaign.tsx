import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { DatePicker } from '@nextui-org/date-picker';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Sparkles, Info } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CAMPAIGN_CATEGORIES, DEFAULT_TIERS, FUNDING_CAPS } from '@/config/crowdfunding';
import { CampaignFormData } from '@/types/campaign';
import { useCampaign } from '../contexts/campaign/CampaignContext';
import { useWallet } from '../contexts/wallet/WalletContext';
import { getRarityBadgeColor } from '../utils';

interface CreateCampaignProps {
  onBack: () => void;
}

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(1000, 'Description too long'),
  category: z.string().min(1, 'Please select a category'),
  goal: z.number().min(1000, 'Minimum goal is 1,000 ADA').max(200000, 'Maximum goal is 200,000 ADA'),
  deadline: z.date().min(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'Deadline must be at least 7 days from now'),
  image: z.string().url('Please enter a valid image URL'),
  tiers: z.array(z.object({
    name: z.string().min(1, 'Tier name required'),
    price: z.number().min(1, 'Price must be at least 1 ADA'),
    maxSupply: z.number().min(1, 'Supply must be at least 1'),
    rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
    benefits: z.array(z.string()).min(1, 'At least one benefit required'),
  })).min(1, 'At least one tier required').max(5, 'Maximum 5 tiers allowed'),
});

export default function CreateCampaign({ onBack }: CreateCampaignProps) {
  const [walletConnection] = useWallet();
  const [, processCampaign] = useCampaign();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'starter' | 'default' | 'pro'>('default');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      goal: FUNDING_CAPS.default,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      image: '',
      tiers: [
        { ...DEFAULT_TIERS.common, benefits: [...DEFAULT_TIERS.common.benefits] },
        { ...DEFAULT_TIERS.rare, benefits: [...DEFAULT_TIERS.rare.benefits] },
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tiers'
  });

  const watchedGoal = watch('goal');
  const watchedTiers = watch('tiers');

  const applyTemplate = (template: 'starter' | 'default' | 'pro') => {
    setSelectedTemplate(template);
    setValue('goal', FUNDING_CAPS[template]);
    
    // Clear existing tiers
    while (fields.length > 0) {
      remove(0);
    }
    
    // Add template tiers
    const tierKeys = Object.keys(DEFAULT_TIERS) as Array<keyof typeof DEFAULT_TIERS>;
    const numTiers = template === 'starter' ? 3 : template === 'default' ? 4 : 5;
    
    tierKeys.slice(0, numTiers).forEach(key => {
      const tier = DEFAULT_TIERS[key];
      append({
        ...tier,
        benefits: [...tier.benefits]
      });
    });
  };

  const addTier = () => {
    if (fields.length < 5) {
      append({
        name: '',
        price: 10,
        maxSupply: 100,
        rarity: 'common',
        benefits: ['']
      });
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    if (!walletConnection.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would integrate with your Cardano smart contract
      // For now, we'll simulate the campaign creation
      
      const newCampaign = {
        id: Date.now().toString(),
        ...data,
        creator: walletConnection.address,
        creatorName: 'You', // In a real app, you'd get this from user profile
        currentFunds: 0,
        backers: 0,
        status: 'active' as const,
        tiers: data.tiers.map((tier, index) => ({
          ...tier,
          id: `tier_${index}`,
          currentSupply: 0
        }))
      };

      processCampaign({ actionType: 'Create', campaign: newCampaign });
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Campaign created successfully!');
      onBack();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            isIconOnly
            variant="light"
            onPress={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Your Campaign</h1>
            <p className="text-gray-600 mt-1">
              Launch your creative project with NFT rewards for supporters
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Campaign Title"
                placeholder="Enter your campaign title"
                {...register('title')}
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
              />
              
              <Textarea
                label="Description"
                placeholder="Describe your project, goals, and what makes it special..."
                minRows={4}
                {...register('description')}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  placeholder="Select a category"
                  {...register('category')}
                  isInvalid={!!errors.category}
                  errorMessage={errors.category?.message}
                >
                  {CAMPAIGN_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
                
                <Input
                  label="Campaign Image URL"
                  placeholder="https://example.com/image.jpg"
                  {...register('image')}
                  isInvalid={!!errors.image}
                  errorMessage={errors.image?.message}
                />
              </div>
            </CardBody>
          </Card>

          {/* Funding Goal & Timeline */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Funding Goal & Timeline</h2>
              <div className="flex gap-2">
                {(['starter', 'default', 'pro'] as const).map((template) => (
                  <Button
                    key={template}
                    size="sm"
                    variant={selectedTemplate === template ? 'solid' : 'bordered'}
                    color="primary"
                    onPress={() => applyTemplate(template)}
                  >
                    {template === 'starter' ? '40K' : template === 'default' ? '100K' : '200K'} ADA
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Funding Goal (ADA)"
                  placeholder="100000"
                  {...register('goal', { valueAsNumber: true })}
                  isInvalid={!!errors.goal}
                  errorMessage={errors.goal?.message}
                />
                
                <DatePicker
                  label="Campaign Deadline"
                  {...register('deadline')}
                  isInvalid={!!errors.deadline}
                  errorMessage={errors.deadline?.message}
                />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Recommended funding caps:</p>
                    <ul className="space-y-1 text-xs">
                      <li><strong>Starter (40K ADA):</strong> First campaign or smaller audience (~300-400 backers)</li>
                      <li><strong>Default (100K ADA):</strong> Most creators (~600-900 backers at 100-150 ADA average)</li>
                      <li><strong>Pro (200K ADA):</strong> Established creators with large audiences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* NFT Reward Tiers */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">NFT Reward Tiers</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create rarity-based NFT rewards for your supporters
                </p>
              </div>
              <Button
                color="primary"
                variant="light"
                startContent={<Plus className="w-4 h-4" />}
                onPress={addTier}
                isDisabled={fields.length >= 5}
              >
                Add Tier
              </Button>
            </CardHeader>
            <CardBody className="space-y-6">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityBadgeColor(watchedTiers[index]?.rarity || 'common')}`}>
                        {watchedTiers[index]?.rarity || 'common'}
                      </span>
                      <span className="text-sm text-gray-600">Tier {index + 1}</span>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      label="Tier Name"
                      placeholder="e.g., Common Supporter"
                      {...register(`tiers.${index}.name`)}
                      isInvalid={!!errors.tiers?.[index]?.name}
                      errorMessage={errors.tiers?.[index]?.name?.message}
                    />
                    
                    <Input
                      type="number"
                      label="Price (ADA)"
                      placeholder="10"
                      {...register(`tiers.${index}.price`, { valueAsNumber: true })}
                      isInvalid={!!errors.tiers?.[index]?.price}
                      errorMessage={errors.tiers?.[index]?.price?.message}
                    />
                    
                    <Input
                      type="number"
                      label="Max Supply"
                      placeholder="100"
                      {...register(`tiers.${index}.maxSupply`, { valueAsNumber: true })}
                      isInvalid={!!errors.tiers?.[index]?.maxSupply}
                      errorMessage={errors.tiers?.[index]?.maxSupply?.message}
                    />
                    
                    <Select
                      label="Rarity"
                      {...register(`tiers.${index}.rarity`)}
                      selectedKeys={[watchedTiers[index]?.rarity || 'common']}
                      onSelectionChange={(keys) => {
                        const rarity = Array.from(keys)[0] as string;
                        setValue(`tiers.${index}.rarity`, rarity as any);
                      }}
                    >
                      <SelectItem key="common" value="common">Common</SelectItem>
                      <SelectItem key="uncommon" value="uncommon">Uncommon</SelectItem>
                      <SelectItem key="rare" value="rare">Rare</SelectItem>
                      <SelectItem key="epic" value="epic">Epic</SelectItem>
                      <SelectItem key="legendary" value="legendary">Legendary</SelectItem>
                    </Select>
                  </div>
                  
                  <Textarea
                    label="Benefits (one per line)"
                    placeholder="Digital artwork&#10;Thank you message&#10;Updates access"
                    minRows={3}
                    value={watchedTiers[index]?.benefits?.join('\n') || ''}
                    onValueChange={(value) => {
                      const benefits = value.split('\n').filter(b => b.trim());
                      setValue(`tiers.${index}.benefits`, benefits);
                    }}
                  />
                </motion.div>
              ))}
            </CardBody>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              variant="light"
              onPress={onBack}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              size="lg"
              startContent={<Sparkles className="w-5 h-5" />}
              isLoading={isSubmitting}
              loadingText="Creating Campaign..."
            >
              Create Campaign
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}