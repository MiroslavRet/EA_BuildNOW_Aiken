import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';

interface HeroProps {
  onCreateCampaign: () => void;
}

export default function Hero({ onCreateCampaign }: HeroProps) {
  const stats = [
    { icon: TrendingUp, label: 'Total Funded', value: '2.4M ADA', color: 'text-green-600' },
    { icon: Users, label: 'Active Creators', value: '1,247', color: 'text-blue-600' },
    { icon: Award, label: 'Success Rate', value: '87%', color: 'text-purple-600' },
    { icon: Sparkles, label: 'NFTs Minted', value: '45,892', color: 'text-yellow-600' },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display">
              Fund Your{' '}
              <span className="gradient-text">Creative Vision</span>
              <br />
              with NFT Rewards
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The first blockchain-powered crowdfunding platform designed specifically for 
              <span className="font-semibold text-primary-600"> digital artists</span> and 
              <span className="font-semibold text-secondary-600"> multimedia creators</span>. 
              Raise funds with rarity-based NFT tiers that reward your supporters.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Button
              size="lg"
              color="primary"
              variant="shadow"
              className="text-lg px-8 py-6 font-semibold"
              onPress={onCreateCampaign}
              startContent={<Sparkles className="w-5 h-5" />}
            >
              Launch Your Campaign
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="text-lg px-8 py-6 font-semibold border-2"
            >
              Explore Projects
            </Button>
          </motion.div>

          {/* Target Audience Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Perfect for
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Digital Artists', 'Graphic Designers', 'Animators', 
                'Photographers', 'Mixed Media Creators', 'Film Makers'
              ].map((role, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardBody className="text-center p-6">
                  <div className={`inline-flex p-3 rounded-full bg-gray-50 mb-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Choose ArtFund?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Rarity-Based NFTs</h3>
              <p className="text-gray-600">
                Reward supporters with unique NFTs across 5 rarity tiers, creating genuine scarcity and value.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Smart Funding Caps</h3>
              <p className="text-gray-600">
                Data-driven funding targets (40K-200K ADA) based on successful creative campaigns.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Creator-First</h3>
              <p className="text-gray-600">
                Built specifically for artists aged 28-42 with families, focusing on sustainable creative careers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}