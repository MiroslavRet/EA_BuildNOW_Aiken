import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Discord } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold gradient-text">ArtFund</h3>
            <p className="text-gray-600 text-sm">
              Empowering digital artists and creators through blockchain-powered crowdfunding with NFT rewards.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for creators</span>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Create Campaign</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Browse Projects</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Creator Guide</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">NFT Tiers</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Best Practices</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Community</h4>
            <div className="flex gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-600 hover:text-primary-600" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Discord className="w-5 h-5 text-gray-600 hover:text-primary-600" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-600 hover:text-primary-600" />
              </motion.a>
            </div>
            <p className="text-xs text-gray-500">
              Join our community of 10,000+ creators and collectors
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2024 ArtFund. Built on Cardano blockchain.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}