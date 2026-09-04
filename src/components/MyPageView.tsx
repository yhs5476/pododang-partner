import React, { useState } from 'react';
import { PartnerProfile } from '../types';
import { 
  Award, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  PlusCircle, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { GreenGrapeIcon } from './GreenGrapeIcon';

interface MyPageViewProps {
  partner: PartnerProfile;
  onWithdrawFunds: () => void;
  onAddLicense: (name: string) => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  partner,
  onWithdrawFunds,
  onAddLicense,
}) => {
  const [showPayoutSuccess, setShowPayoutSuccess] = useState(false);
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [newLicenseName, setNewLicenseName] = useState('');

  const handleWithdraw = () => {
    onWithdrawFunds();
    setShowPayoutSuccess(true);
    setTimeout(() => setShowPayoutSuccess(false), 3000);
  };

  const handleAddLicenseSubmit = () => {
    if (!newLicenseName.trim()) return;
    onAddLicense(newLicenseName.trim());
    setNewLicenseName('');
    setShowAddLicenseModal(false);
  };

  return (
    <div className="pb-28 pt-2 max-w-2xl mx-auto px-4 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={partner.avatarUrl}
            alt={partner.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#0FA958]"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-xl text-[#191F28]">{partner.name}</h2>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8F8EE] text-[#0FA958]">
                {partner.brixGrade}
              </span>
            </div>
            <p className="text-xs text-[#6B7684] mt-0.5">
              {partner.roleTitle} · 경력 {partner.experienceYears}년
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
              <span className="text-[#FF9800] flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                {partner.rating}
              </span>
              <span className="text-[#8B95A1]">후기 {partner.reviewCount}개</span>
              <span className="text-[#8B95A1]">·</span>
              <span className="text-[#0FA958]">매칭 {partner.totalMatches}회 완료</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grape Brix System Card (PRD 3.5 & 4) */}
      <div className="bg-gradient-to-br from-[#F4F8F5] to-[#E8F8EE] rounded-3xl p-6 border border-[#0FA958]/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GreenGrapeIcon className="w-8 h-8" />
            <div>
              <span className="text-xs font-bold text-[#0FA958]">포도당 신뢰도 시스템</span>
              <h3 className="font-extrabold text-lg text-[#191F28]">
                나의 포도 당도: {partner.brix.toFixed(1)} °Brix
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-[#0FA958] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
              최고 등급 샤인머스캣
            </span>
          </div>
        </div>

        {/* Brix Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-[#6B7684] mb-1 font-medium">
            <span>청포도 (10°Bx)</span>
            <span>캠벨 (13°Bx)</span>
            <span>머스캣 (15°Bx)</span>
            <span className="text-[#0FA958] font-bold">샤인머스캣 (18°Bx+)</span>
          </div>
          <div className="w-full h-3 bg-[#E5E8EB] rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, ((partner.brix - 10) / (24 - 10)) * 100)}%` }}
              className="bg-gradient-to-r from-[#84CC16] via-[#0FA958] to-[#047857] rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Benefits banner */}
        <div className="mt-4 p-3 bg-white/80 rounded-2xl border border-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#191F28]">
            <Sparkles className="w-4 h-4 text-[#0FA958]" />
            <span className="font-semibold">상단 공고 우선 추천 및 수수료 1% 감면 혜택 적용 중</span>
          </div>
        </div>

        {/* Brix History Accordion/List */}
        <div className="mt-4 pt-3 border-t border-[#E5E8EB]">
          <span className="text-xs font-bold text-[#4E5968] block mb-2">최근 당도 변동 내역</span>
          <div className="space-y-1.5">
            {partner.brixHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs bg-white/70 p-2.5 rounded-xl"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[#0FA958] font-bold">+{item.change.toFixed(1)}°Bx</span>
                  <span className="text-[#333D4B] truncate">{item.reason}</span>
                </div>
                <span className="text-[10px] text-[#8B95A1] shrink-0 ml-2">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settlement & Payout (Toss Style) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#0FA958]" />
            <h3 className="font-extrabold text-base text-[#191F28]">정산 및 수익 관리</h3>
          </div>
          <span className="text-xs text-[#8B95A1]">{partner.settlement.bankAccount}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#F8F9FA] rounded-2xl">
            <div className="text-xs text-[#6B7684]">출금 가능 잔고</div>
            <div className="text-lg font-black text-[#191F28] mt-1">
              {partner.settlement.withdrawableAmount.toLocaleString()}원
            </div>
          </div>
          <div className="p-4 bg-[#F8F9FA] rounded-2xl">
            <div className="text-xs text-[#6B7684]">에스크로 보관 중</div>
            <div className="text-lg font-black text-[#0FA958] mt-1">
              {partner.settlement.pendingEscrowAmount.toLocaleString()}원
            </div>
          </div>
        </div>

        {showPayoutSuccess && (
          <div className="p-3 bg-[#E8F8EE] rounded-2xl text-xs font-bold text-[#0FA958] text-center animate-in fade-in">
            ✓ 등록된 토스뱅크 계좌로 출금 신청이 즉시 완료되었습니다!
          </div>
        )}

        <button
          id="mypage-withdraw-btn"
          onClick={handleWithdraw}
          disabled={partner.settlement.withdrawableAmount <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-xs ${
            partner.settlement.withdrawableAmount > 0
              ? 'bg-[#0FA958] hover:bg-[#0C8F4A] text-white'
              : 'bg-[#F2F4F6] text-[#B0B8C1] cursor-not-allowed'
          }`}
        >
          {partner.settlement.withdrawableAmount > 0
            ? `${partner.settlement.withdrawableAmount.toLocaleString()}원 1초 만에 계좌로 출금하기`
            : '출금 가능한 잔액이 없습니다'}
        </button>
      </div>

      {/* Licenses & Insurance Management */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0FA958]" />
            <h3 className="font-extrabold text-base text-[#191F28]">자격 증명 & 안심 보험</h3>
          </div>
          <button
            onClick={() => setShowAddLicenseModal(true)}
            className="text-xs font-bold text-[#0FA958] hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>자격증 추가 등록</span>
          </button>
        </div>

        {/* Insurance Badge */}
        <div className="p-3.5 bg-[#E8F8EE] rounded-2xl border border-[#0FA958]/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#0FA958] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{partner.insurance.provider}</span>
            </div>
            <div className="text-[11px] text-[#4E5968] mt-0.5">
              보장 한도: {partner.insurance.coverageAmount} · {partner.insurance.expiryDate}
            </div>
          </div>
          <span className="text-xs font-bold text-[#0FA958]">보증 유효</span>
        </div>

        {/* Licenses list */}
        <div className="space-y-2">
          {partner.licenses.map((lic, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-2xl text-xs"
            >
              <div>
                <div className="font-bold text-[#191F28] flex items-center gap-1.5">
                  <span>{lic.name}</span>
                  <span className="text-[10px] text-[#0FA958] bg-[#E8F8EE] px-1.5 py-0.2 rounded-md font-semibold">
                    인증 완료
                  </span>
                </div>
                <div className="text-[11px] text-[#8B95A1] mt-0.5">
                  {lic.level} · 발급일: {lic.issuedDate}
                </div>
              </div>
              <span className="text-[#8B95A1] text-xs">확인됨 ✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guardian Review Tags */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs">
        <h3 className="font-extrabold text-base text-[#191F28] mb-1">
          보호자가 직접 남긴 칭찬 태그
        </h3>
        <p className="text-xs text-[#8B95A1] mb-3">
          어르신과 가족분들께 진심을 다해 신뢰를 쌓고 계세요.
        </p>

        <div className="flex flex-wrap gap-2">
          {partner.reviewTags.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2F4F6] text-xs font-medium text-[#333D4B]"
            >
              <span>{item.tag}</span>
              <span className="font-bold text-[#0FA958]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add License Modal */}
      {showAddLicenseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-base text-[#191F28] mb-1">자격증 등록 신청</h3>
            <p className="text-xs text-[#8B95A1] mb-4">
              전문 자격증을 등록하시면 포도 당도 +0.5 °Bx 상승 및 추천 노출 혜택이 주어집니다.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#191F28] mb-1">자격증 명칭</label>
                <input
                  type="text"
                  value={newLicenseName}
                  onChange={(e) => setNewLicenseName(e.target.value)}
                  placeholder="예: 사회복지사 1급, 물리치료사 등"
                  className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs text-[#191F28]"
                />
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-dashed border-[#B0B8C1] text-center text-xs text-[#8B95A1]">
                📷 자격증 사진 파일 첨부 (모의 완료)
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddLicenseModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#F2F4F6] text-[#4E5968] font-bold text-xs"
              >
                취소
              </button>
              <button
                onClick={handleAddLicenseSubmit}
                disabled={!newLicenseName.trim()}
                className="flex-1 py-3 rounded-xl bg-[#0FA958] text-white font-bold text-xs hover:bg-[#0C8F4A]"
              >
                검증 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
