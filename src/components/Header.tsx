import React, { useState } from 'react';
import { PartnerProfile } from '../types';
import { MapPin, Bell, ShieldCheck, ChevronDown } from 'lucide-react';
import { GreenGrapeIcon } from './GreenGrapeIcon';

interface HeaderProps {
  partner: PartnerProfile;
  selectedRadius: number;
  onSelectRadius: (radius: number) => void;
  onToggleReceiving: () => void;
  onOpenMyPage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  partner,
  selectedRadius,
  onSelectRadius,
  onToggleReceiving,
  onOpenMyPage,
}) => {
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const radiusOptions = [3, 5, 10, 20];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2F4F6] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand & Location */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <GreenGrapeIcon className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-[#191F28]">포도당</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F8EE] text-[#0FA958] border border-[#0FA958]/20">
              파트너
            </span>
          </div>

          <div className="relative ml-2">
            <button
              id="header-location-btn"
              onClick={() => setShowRadiusDropdown(!showRadiusDropdown)}
              className="flex items-center gap-1 text-xs font-semibold text-[#4E5968] bg-[#F4F8F5] hover:bg-[#E5EBE7] px-2.5 py-1.5 rounded-full transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0FA958]" />
              <span>잠실동 · {selectedRadius}km</span>
              <ChevronDown className="w-3 h-3 text-[#8B95A1]" />
            </button>

            {showRadiusDropdown && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#E5EBE7] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-medium text-[#8B95A1] px-2 py-1">활동 탐색 반경</div>
                {radiusOptions.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSelectRadius(r);
                      setShowRadiusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedRadius === r
                        ? 'bg-[#E8F8EE] text-[#0FA958] font-bold'
                        : 'text-[#333D4B] hover:bg-[#F4F8F5]'
                    }`}
                  >
                    <span>내 주변 {r}km</span>
                    {selectedRadius === r && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Toggle & Brix Profile */}
        <div className="flex items-center gap-2">
          {/* Active status button */}
          <button
            id="header-receiving-toggle"
            onClick={onToggleReceiving}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              partner.isReceivingBids
                ? 'bg-[#E8F8EE] text-[#0FA958] border-[#0FA958]/30'
                : 'bg-[#F4F8F5] text-[#8B95A1] border-transparent'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                partner.isReceivingBids ? 'bg-[#0FA958] animate-pulse' : 'bg-[#B0B8C1]'
              }`}
            />
            <span>{partner.isReceivingBids ? '공고 수신 중' : '휴식 중'}</span>
          </button>

          {/* Partner Brix quick chip */}
          <button
            id="header-brix-chip"
            onClick={onOpenMyPage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F8F5] hover:bg-[#E8F8EE] text-[#191F28] text-xs font-semibold transition-colors"
          >
            <span>{partner.brix.toFixed(1)}°Bx</span>
            <span className="text-[10px] text-[#0FA958] bg-white px-1.5 py-0.5 rounded-full shadow-xs font-bold">
              샤인
            </span>
          </button>

          {/* Notifications button */}
          <button
            id="header-notification-btn"
            onClick={() => setShowNotificationModal(true)}
            className="p-1.5 text-[#6B7684] hover:text-[#191F28] hover:bg-[#F4F8F5] rounded-full transition-colors relative"
            aria-label="알림"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F04452] rounded-full" />
          </button>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#191F28]">새 알림</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-[#8B95A1] text-sm hover:text-[#191F28]"
              >
                닫기
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-[#E8F8EE] rounded-2xl border border-[#0FA958]/20">
                <div className="text-xs font-bold text-[#0FA958]">매칭 확정 & 에스크로 결제</div>
                <div className="text-sm font-medium text-[#191F28] mt-0.5">
                  최민수 보호자님이 제안하신 견적(115,000원)을 확정했습니다!
                </div>
                <div className="text-[11px] text-[#8B95A1] mt-1">오늘 오전 08:30</div>
              </div>
              <div className="p-3 bg-[#F8F9FA] rounded-2xl">
                <div className="text-xs font-bold text-[#0FA958]">포도 당도 상승 (+0.5 °Bx)</div>
                <div className="text-sm font-medium text-[#191F28] mt-0.5">
                  지난 서울아산병원 케어에서 별점 5점 만점 후기가 등록되었어요.
                </div>
                <div className="text-[11px] text-[#8B95A1] mt-1">어제 오후 5:20</div>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full mt-5 py-3 rounded-2xl bg-[#0FA958] text-white font-semibold text-sm hover:bg-[#0C8F4A] transition-colors"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
