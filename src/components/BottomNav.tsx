import React from 'react';
import { Compass, MessageSquare, Navigation, FileText } from 'lucide-react';
import { GreenGrapeIcon } from './GreenGrapeIcon';

export type NavTab = 'feed' | 'chat' | 'tracking' | 'report' | 'mypage';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadChatCount?: number;
  isTrackingActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadChatCount = 0,
  isTrackingActive = true,
}) => {
  const tabs = [
    {
      id: 'feed' as NavTab,
      label: '공고 탐색',
      icon: Compass,
    },
    {
      id: 'chat' as NavTab,
      label: '안심 채팅',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      id: 'tracking' as NavTab,
      label: '동행 트래킹',
      icon: Navigation,
      highlight: isTrackingActive,
    },
    {
      id: 'report' as NavTab,
      label: 'AI 리포트',
      icon: FileText,
    },
    {
      id: 'mypage' as NavTab,
      label: '마이 당도',
      icon: GreenGrapeIcon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E8EB] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-transform duration-100 active:scale-95 ${
                isActive ? 'text-[#0FA958]' : 'text-[#8B95A1] hover:text-[#4E5968]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F04452] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#0FA958] rounded-full animate-ping" />
                )}
                {tab.highlight && !tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#0FA958] rounded-full" />
                )}
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  isActive ? 'font-bold text-[#0FA958]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
