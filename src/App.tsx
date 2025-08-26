import { useState } from 'react'
import { motion } from 'framer-motion'
import WalletProvider from './components/contexts/wallet/WalletProvider'
import CampaignProvider from './components/contexts/campaign/CampaignProvider'
import LucidProvider from './components/contexts/lucid/LucidProvider'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import CampaignGrid from './components/sections/CampaignGrid'
import CreateCampaign from './components/sections/CreateCampaign'
import Footer from './components/layout/Footer'
import './App.css'

type AppView = 'home' | 'create' | 'campaigns'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home')

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return <CreateCampaign onBack={() => setCurrentView('home')} />
      case 'campaigns':
        return <CampaignGrid onBack={() => setCurrentView('home')} />
      default:
        return (
          <>
            <Hero onCreateCampaign={() => setCurrentView('create')} />
            <CampaignGrid onViewAll={() => setCurrentView('campaigns')} featured />
          </>
        )
    }
  }

  return (
    <LucidProvider>
      <WalletProvider>
        <CampaignProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
            <Header 
              currentView={currentView} 
              onNavigate={setCurrentView} 
            />
            <motion.main
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 py-8"
            >
              {renderView()}
            </motion.main>
            <Footer />
          </div>
        </CampaignProvider>
      </WalletProvider>
    </LucidProvider>
  )
}

export default App