import React, { useState, useEffect } from 'react';
import { Donation, Expense, Event, InventoryItem, ViewType } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DonationManager from './components/DonationManager';
import ExpenseManager from './components/ExpenseManager';
import InventoryManager from './components/InventoryManager';
import EventManager from './components/EventManager';
import AIAssistant from './components/AIAssistant';
import InstallGuideModal from './components/InstallGuideModal';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    try {
      const d = localStorage.getItem('donations');
      if (d) setDonations(JSON.parse(d));
      const e = localStorage.getItem('expenses');
      if (e) setExpenses(JSON.parse(e));
      const ev = localStorage.getItem('events');
      if (ev) setEvents(JSON.parse(ev));
      const i = localStorage.getItem('inventory');
      if (i) setInventory(JSON.parse(i));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [donations, expenses, events, inventory]);

  const navItems = [
    { id: 'dashboard', label: 'హోమ్', icon: 'fa-home' },
    { id: 'donations', label: 'విరాళాలు', icon: 'fa-hand-holding-heart' },
    { id: 'ai-assistant', label: 'AI', icon: 'fa-robot', center: true },
    { id: 'expenses', label: 'ఖర్చులు', icon: 'fa-file-invoice-dollar' },
    { id: 'inventory', label: 'నిల్వ', icon: 'fa-boxes-stacked' },
  ];

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col pb-24">
      <Header activeView={activeView} onInstallClick={() => setShowInstallGuide(true)} />
      
      <main className="p-4 flex-1 overflow-y-auto max-w-lg mx-auto w-full">
        {activeView === 'dashboard' && <Dashboard donations={donations} expenses={expenses} events={events} />}
        {activeView === 'donations' && <DonationManager donations={donations} setDonations={setDonations} />}
        {activeView === 'expenses' && <ExpenseManager expenses={expenses} setExpenses={setExpenses} />}
        {activeView === 'inventory' && <InventoryManager inventory={inventory} setInventory={setInventory} />}
        {activeView === 'events' && <EventManager events={events} setEvents={setEvents} />}
        {activeView === 'ai-assistant' && <AIAssistant donations={donations} expenses={expenses} />}
      </main>

      {showInstallGuide && <InstallGuideModal onClose={() => setShowInstallGuide(false)} />}

      <nav className="fixed bottom-0 left-0 right-0 bg-red-900 flex justify-around items-end p-3 border-t-4 border-yellow-500 shadow-2xl rounded-t-[40px] z-50">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id as ViewType)}
            className={`flex flex-col items-center py-2 transition-all ${item.center ? '-mt-10' : ''}`}
          >
            {item.center ? (
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-red-900 shadow-xl transition-all ${activeView === item.id ? 'bg-yellow-400 text-red-900 scale-110' : 'bg-red-700 text-white'}`}>
                <i className={`fas ${item.icon} text-xl`}></i>
              </div>
            ) : (
              <>
                <i className={`fas ${item.icon} text-lg mb-1 transition-colors ${activeView === item.id ? 'text-yellow-400' : 'text-red-300'}`}></i>
                <span className={`text-[9px] font-bold transition-colors ${activeView === item.id ? 'text-yellow-400' : 'text-red-300'}`}>{item.label}</span>
              </>
            )}
            {item.center && <span className={`text-[9px] mt-1 font-bold ${activeView === item.id ? 'text-yellow-400' : 'text-red-300'}`}>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
