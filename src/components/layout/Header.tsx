import { Button } from '@nextui-org/button';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import { motion } from 'framer-motion';
import { Palette, Wallet, User } from 'lucide-react';
import { useWallet } from '../contexts/wallet/WalletContext';
import WalletConnectors from '../wallet/WalletConnectors';
import DisconnectButton from '../wallet/DisconnectButton';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: 'home' | 'create' | 'campaigns') => void;
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const [walletConnection] = useWallet();
  const { wallet, address } = walletConnection;

  return (
    <Navbar className="bg-white/80 backdrop-blur-md border-b border-gray-200" maxWidth="full">
      <NavbarBrand>
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">ArtFund</h1>
            <p className="text-xs text-gray-500">NFT Crowdfunding</p>
          </div>
        </motion.div>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Button
            variant={currentView === 'home' ? 'solid' : 'light'}
            color="primary"
            onPress={() => onNavigate('home')}
          >
            Home
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant={currentView === 'campaigns' ? 'solid' : 'light'}
            color="primary"
            onPress={() => onNavigate('campaigns')}
          >
            Campaigns
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant={currentView === 'create' ? 'solid' : 'light'}
            color="primary"
            onPress={() => onNavigate('create')}
          >
            Create
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {wallet && address ? (
            <div className="relative flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {wallet.name}
                </span>
                <span className="text-xs text-green-600">
                  {address.slice(0, 8)}...{address.slice(-6)}
                </span>
              </div>
              <DisconnectButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-gray-500" />
              <WalletConnectors />
            </div>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}