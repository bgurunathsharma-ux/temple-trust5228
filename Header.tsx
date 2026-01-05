
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  activeView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const titles: Record<ViewType, string> = {
    dashboard: 'ముఖ్య అంశాలు',
    donations: 'విరాళాలు',
    expenses: 'ఖర్చులు',
    inventory: 'వస్తువుల నిల్వ',
    events: 'కార్యక్రమాలు',
    'ai-assistant': 'AI సహాయకుడు'
  };

  return (
    <header className="bg-red-800 p-4 pt-8 flex justify-between items-center shadow-lg border-b-2 border-yellow-500">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-yellow-400 text-red-900 rounded-full flex items-center justify-center font-black text-xl shadow-inner ring-2 ring-yellow-200">ॐ</div>
        <div>
          <h1 className="text-yellow-400 font-bold text-lg leading-tight">{titles[activeView]}</h1>
          <p className="text-red-100 text-[10px] font-medium tracking-wider uppercase">ట్రస్ట్ మేనేజర్</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
