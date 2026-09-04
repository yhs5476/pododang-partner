import React, { useState } from 'react';
import { JobPost, CareType, Bid, PartnerProfile } from '../types';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface JobFeedProps {
  jobs: JobPost[];
  partner: PartnerProfile;
  selectedRadius: number;
  onSelectRadius: (r: number) => void;
  onSubmitBid: (jobId: string, proposedAmount: number, appealTags: string[], memo: string) => void;
  onCancelBid: (jobId: string) => void;
  onStartConsultation: (job: JobPost) => void;
}

export const JobFeed: React.FC<JobFeedProps> = ({
  jobs,
  partner,
  selectedRadius,
  onSelectRadius,
  onSubmitBid,
  onCancelBid,
  onStartConsultation,
}) => {
  const [selectedCareType, setSelectedCareType] = useState<'all' | CareType>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [activeJobForDetail, setActiveJobForDetail] = useState<JobPost | null>(null);
  const [activeJobForBid, setActiveJobForBid] = useState<JobPost | null>(null);

  // Bid Sheet state
  const [bidAmount, setBidAmount] = useState<number>(120000);
  const [selectedAppealTags, setSelectedAppealTags] = useState<string[]>([]);
  const [bidMemo, setBidMemo] = useState<string>('');

  const specialties = [
    '전체',
    '석션(가래흡인)',
    '와상 체위변경',
    '투석 동행',
    '치매/섬망',
    '소변줄/장루',
    '기저귀 케어',
  ];

  const appealTagOptions = [
    '석션 케어 5년차',
    '병원동행 전문 매니저',
    '응급처치·CPR 수료',
    '부드러운 휠체어 이승',
    '자차 안전 이동 가능',
    '의사 소견 상세 기록',
    '낙상 방지 집중 케어',
  ];

  const quickMemos = [
    '아산병원/세브란스 외래 동행 경험이 풍부합니다. 정성껏 모시겠습니다.',
    '휠체어 안전 이승과 필요 시 석션 케어 완벽히 지원 가능합니다.',
    '어르신 건강 상태와 복약 안내 꼼꼼히 체크하여 보고드리겠습니다.',
  ];

  const filteredJobs = jobs.filter((job) => {
    if (job.distanceKm > selectedRadius) return false;
    if (selectedCareType !== 'all' && job.careType !== selectedCareType) return false;
    if (selectedSpecialty !== 'all' && !job.specialCares.some((s) => s.includes(selectedSpecialty)))
      return false;
    return true;
  });

  const handleOpenBidModal = (job: JobPost) => {
    setActiveJobForBid(job);
    if (job.myBid) {
      setBidAmount(job.myBid.proposedAmount);
      setSelectedAppealTags(job.myBid.appealTags);
      setBidMemo(job.myBid.guardianMessage);
    } else {
      setBidAmount(job.targetBudget);
      setSelectedAppealTags(['병원동행 전문 매니저', '의사 소견 상세 기록']);
      setBidMemo('안녕하세요 보호자님! 요청하신 조건에 맞춰 세심하고 안전하게 모시겠습니다.');
    }
  };

  const handleToggleAppealTag = (tag: string) => {
    if (selectedAppealTags.includes(tag)) {
      setSelectedAppealTags(selectedAppealTags.filter((t) => t !== tag));
    } else {
      if (selectedAppealTags.length < 4) {
        setSelectedAppealTags([...selectedAppealTags, tag]);
      }
    }
  };

  const handleBidSubmit = () => {
    if (!activeJobForBid) return;
    onSubmitBid(activeJobForBid.id, bidAmount, selectedAppealTags, bidMemo);
    setActiveJobForBid(null);
  };

  const getMobilityBadge = (mobility: JobPost['mobility']) => {
    switch (mobility) {
      case 'independent':
        return { label: '스스로 보행', color: 'bg-[#E8F8EE] text-[#00A859]' };
      case 'assisted':
        return { label: '부축 보행 필요', color: 'bg-[#FFF6E6] text-[#E08A00]' };
      case 'wheelchair':
        return { label: '휠체어 탑승', color: 'bg-[#E8F8EE] text-[#0FA958]' };
      case 'bedridden':
        return { label: '와상(누워 계심)', color: 'bg-[#FEECEC] text-[#F04452]' };
    }
  };

  const getCareTypeLabel = (type: CareType) => {
    switch (type) {
      case 'hospital':
        return '병원 간병';
      case 'escort':
        return '방문 동행';
      case 'home':
        return '자택 요양';
    }
  };

  return (
    <div className="pb-24 pt-2">
      {/* Live Matching Ticker (Toss Securities style) */}
      <div className="bg-[#E8F8EE] border border-[#0FA958]/20 rounded-2xl p-3 mx-4 mb-4 flex items-center gap-2.5 shadow-xs">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FA958] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FA958]"></span>
        </span>
        <div className="text-xs font-medium text-[#191F28] truncate">
          <strong className="text-[#0FA958]">실시간 매칭 현황:</strong> 방금 잠실 서울아산병원 외래동행 매칭 완료 (11만 원)
        </div>
      </div>

      {/* Radius & Care Type Filters */}
      <div className="px-4 space-y-2.5 mb-4">
        {/* Care Type Horizontal Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: '전체 공고' },
            { id: 'escort', label: '방문 동행' },
            { id: 'hospital', label: '병원 간병' },
            { id: 'home', label: '자택 요양' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCareType(tab.id as 'all' | CareType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCareType === tab.id
                  ? 'bg-[#191F28] text-white shadow-xs'
                  : 'bg-white text-[#4E5968] border border-[#E5E8EB] hover:bg-[#F2F4F6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec === '전체' ? 'all' : spec)}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                (spec === '전체' && selectedSpecialty === 'all') || selectedSpecialty === spec
                  ? 'bg-[#0FA958] text-white shadow-xs'
                  : 'bg-white text-[#6B7684] border border-[#E5E8EB]'
              }`}
            >
              #{spec}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Summary Count */}
      <div className="px-4 mb-2 flex items-center justify-between text-xs text-[#6B7684]">
        <span>
          반경 <strong className="text-[#191F28]">{selectedRadius}km</strong> 내{' '}
          <strong className="text-[#0FA958]">{filteredJobs.length}건</strong>의 맞춤 공고
        </span>
        <span className="text-[11px] text-[#8B95A1]">역경매 실시간 입찰 지원</span>
      </div>

      {/* Job Card List */}
      <div className="px-4 space-y-3.5">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E8EB]">
            <div className="text-3xl mb-2">🔍</div>
            <h4 className="font-bold text-[#191F28] text-base">해당 조건의 공고가 없어요</h4>
            <p className="text-xs text-[#6B7684] mt-1">
              탐색 반경을 넓히거나 다른 전문 케어 필터를 선택해 보세요.
            </p>
            <button
              onClick={() => {
                onSelectRadius(10);
                setSelectedCareType('all');
                setSelectedSpecialty('all');
              }}
              className="mt-4 px-4 py-2 bg-[#0FA958] text-white text-xs font-semibold rounded-xl hover:bg-[#0C8F4A]"
            >
              반경 10km 전체 공고 보기
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const mobility = getMobilityBadge(job.mobility);
            const isMyBidActive = Boolean(job.myBid);

            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className={`bg-white rounded-3xl p-5 border transition-all duration-150 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] ${
                  isMyBidActive ? 'border-[#0FA958] ring-1 ring-[#0FA958]/30' : 'border-[#E5E8EB]'
                }`}
              >
                {/* Card Top: Tags and Distance */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#E8F8EE] text-[#0FA958]">
                      {getCareTypeLabel(job.careType)}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${mobility.color}`}>
                      {mobility.label}
                    </span>
                    {isMyBidActive && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0FA958] text-white animate-in fade-in">
                        입찰 참여 중
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs font-semibold text-[#6B7684]">
                    <MapPin className="w-3.5 h-3.5 mr-0.5 text-[#0FA958]" />
                    <span>{job.distanceKm}km</span>
                    <span className="text-[#8B95A1] mx-1">·</span>
                    <span>차량 {job.etaMinutes}분</span>
                  </div>
                </div>

                {/* Job Title */}
                <h3
                  onClick={() => setActiveJobForDetail(job)}
                  className="font-bold text-[16px] text-[#191F28] leading-snug cursor-pointer hover:text-[#0FA958] transition-colors"
                >
                  {job.title}
                </h3>

                {/* Patient & Location details */}
                <div className="mt-2.5 space-y-1 text-xs text-[#4E5968]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8B95A1]" />
                    <span className="font-semibold text-[#191F28]">
                      {job.patientName} 어르신 ({job.patientAge}세/{job.patientGender})
                    </span>
                    <span className="text-[#8B95A1]">| 보호자: {job.guardianName} ({job.guardianRelation})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8B95A1]" />
                    <span>일정: {job.scheduleDates} · {job.scheduleTime}</span>
                  </div>
                  {job.hospitalName && (
                    <div className="flex items-center gap-1.5 text-[#0FA958] font-medium">
                      <span>🏥 {job.hospitalName} {job.hospitalRoom}</span>
                    </div>
                  )}
                </div>

                {/* Specialty chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.specialCares.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#F2F4F6] text-[#4E5968] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Urgent note banner if exists */}
                {job.urgentNotice && (
                  <div className="mt-3 p-2 bg-[#FFF6E6] border border-[#FF9800]/20 rounded-xl text-[11px] text-[#A66000] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#E08A00]" />
                    <span>{job.urgentNotice}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="h-[1px] bg-[#F2F4F6] my-3.5" />

                {/* Price & Action Area */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-[#8B95A1]">
                      희망 예산 (경쟁 입찰 {job.currentBidsCount}명 참여)
                    </div>
                    <div className="text-base font-extrabold text-[#191F28]">
                      {job.targetBudget.toLocaleString()}원
                      <span className="text-xs font-normal text-[#6B7684]">
                        {' '}/ {job.durationDays > 1 ? `${job.durationDays}일` : '1일'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`job-consult-btn-${job.id}`}
                      onClick={() => onStartConsultation(job)}
                      className="px-3 py-2.5 rounded-2xl bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#333D4B] text-xs font-bold transition-colors"
                    >
                      1:1 상담
                    </button>

                    <button
                      id={`job-bid-btn-${job.id}`}
                      onClick={() => handleOpenBidModal(job)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isMyBidActive
                          ? 'bg-[#E8F8EE] text-[#0FA958] hover:bg-[#D1F2E0]'
                          : 'bg-[#0FA958] text-white hover:bg-[#0C8F4A] shadow-xs'
                      }`}
                    >
                      {isMyBidActive ? `제안금액 ${job.myBid?.proposedAmount.toLocaleString()}원 수정` : '역경매 입찰하기'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Job Detail Sheet Modal */}
      {activeJobForDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F6]">
              <span className="text-xs font-bold text-[#0FA958] px-2.5 py-1 rounded-full bg-[#E8F8EE]">
                {getCareTypeLabel(activeJobForDetail.careType)} 상세 안내
              </span>
              <button
                onClick={() => setActiveJobForDetail(null)}
                className="p-1 rounded-full text-[#8B95A1] hover:text-[#191F28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <h2 className="font-extrabold text-lg text-[#191F28] leading-tight">
                {activeJobForDetail.title}
              </h2>

              <div className="bg-[#F8F9FA] rounded-2xl p-4 space-y-2.5 text-xs text-[#333D4B]">
                <div className="flex justify-between">
                  <span className="text-[#8B95A1]">환자 정보</span>
                  <span className="font-bold text-[#191F28]">
                    {activeJobForDetail.patientName} ({activeJobForDetail.patientAge}세/{activeJobForDetail.patientGender})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B95A1]">거동 상태</span>
                  <span className="font-bold text-[#0FA958]">
                    {getMobilityBadge(activeJobForDetail.mobility).label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B95A1]">장소 및 동선</span>
                  <span className="font-semibold text-right">
                    {activeJobForDetail.hospitalName || activeJobForDetail.homeAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B95A1]">일시</span>
                  <span className="font-semibold">
                    {activeJobForDetail.scheduleDates} ({activeJobForDetail.scheduleTime})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B95A1]">보호자 예산</span>
                  <span className="font-extrabold text-[#191F28] text-sm">
                    {activeJobForDetail.targetBudget.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#191F28] mb-1.5">보호자 상세 요청 사항</h4>
                <p className="text-xs text-[#4E5968] leading-relaxed bg-[#F2F4F6] p-3.5 rounded-2xl whitespace-pre-line">
                  {activeJobForDetail.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#191F28] mb-1.5">특별 케어 항목</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeJobForDetail.specialCares.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2.5 py-1 bg-[#E8F8EE] text-[#0FA958] font-semibold rounded-lg"
                    >
                      #{c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  onClick={() => {
                    const job = activeJobForDetail;
                    setActiveJobForDetail(null);
                    onStartConsultation(job);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#F2F4F6] text-[#333D4B] font-bold text-sm hover:bg-[#E5E8EB] transition-colors"
                >
                  1:1 안심 상담하기
                </button>
                <button
                  onClick={() => {
                    const job = activeJobForDetail;
                    setActiveJobForDetail(null);
                    handleOpenBidModal(job);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#0FA958] text-white font-bold text-sm hover:bg-[#0C8F4A] transition-colors shadow-xs"
                >
                  입찰 참여하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reverse Auction Bid Bottom Sheet */}
      {activeJobForBid && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F6]">
              <div>
                <span className="text-[11px] font-bold text-[#0FA958] bg-[#E8F8EE] px-2 py-0.5 rounded-md">
                  역경매 입찰 제안
                </span>
                <h3 className="font-extrabold text-base text-[#191F28] mt-1">
                  희망 단가 및 안심 메시지 전송
                </h3>
              </div>
              <button
                onClick={() => setActiveJobForBid(null)}
                className="p-1 text-[#8B95A1] hover:text-[#191F28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Target budget comparison */}
              <div className="p-3 bg-[#F2F4F6] rounded-2xl flex items-center justify-between text-xs">
                <span className="text-[#6B7684]">보호자 희망 예산</span>
                <span className="font-bold text-[#191F28]">
                  {activeJobForBid.targetBudget.toLocaleString()}원
                </span>
              </div>

              {/* Proposed Amount Control */}
              <div>
                <label className="block text-xs font-bold text-[#191F28] mb-1.5">
                  나의 제안 금액 (1일 기준)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="bid-amount-input"
                    type="number"
                    step="5000"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="flex-1 px-4 py-3 bg-[#F8F9FA] border border-[#E5E8EB] rounded-2xl text-lg font-extrabold text-[#191F28] focus:outline-hidden focus:border-[#0FA958] focus:bg-white"
                  />
                  <span className="font-bold text-[#191F28]">원</span>
                </div>

                {/* Quick adjustment buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setBidAmount((prev) => Math.max(50000, prev - 10000))}
                    className="flex-1 py-1.5 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-xl text-xs font-semibold text-[#4E5968]"
                  >
                    -1만 원
                  </button>
                  <button
                    onClick={() => setBidAmount((prev) => prev + 10000)}
                    className="flex-1 py-1.5 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-xl text-xs font-semibold text-[#4E5968]"
                  >
                    +1만 원
                  </button>
                  <button
                    onClick={() => setBidAmount(activeJobForBid.targetBudget)}
                    className="flex-1 py-1.5 bg-[#E8F8EE] hover:bg-[#D1F2E0] rounded-xl text-xs font-semibold text-[#0FA958]"
                  >
                    희망 예산 동일
                  </button>
                </div>
              </div>

              {/* Estimated net payout */}
              <div className="p-3 bg-[#E8F8EE] rounded-2xl border border-[#00C473]/20 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#00A859] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>실 수령 정산 예정액</span>
                  </div>
                  <div className="text-[11px] text-[#4E5968] mt-0.5">
                    샤인머스캣 파트너 우대 (플랫폼 수수료 1% 감면 혜택)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#191F28]">
                    {Math.floor(bidAmount * 0.96).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Appeal tag selection */}
              <div>
                <label className="block text-xs font-bold text-[#191F28] mb-1.5">
                  나의 핵심 어필 역량 선택 (최대 4개)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {appealTagOptions.map((tag) => {
                    const isSelected = selectedAppealTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleToggleAppealTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                          isSelected
                            ? 'bg-[#0FA958] text-white font-bold shadow-xs'
                            : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
                        }`}
                      >
                        {tag} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guardian reassurance message */}
              <div>
                <label className="block text-xs font-bold text-[#191F28] mb-1.5">
                  보호자 전달 안심 메시지
                </label>
                <textarea
                  id="bid-memo-textarea"
                  rows={3}
                  value={bidMemo}
                  onChange={(e) => setBidMemo(e.target.value)}
                  placeholder="보호자님께 전할 정성 어린 메시지나 관련 케어 경험을 적어주세요."
                  className="w-full p-3 bg-[#F8F9FA] border border-[#E5E8EB] rounded-2xl text-xs text-[#191F28] focus:outline-hidden focus:border-[#0FA958] focus:bg-white resize-none"
                />

                {/* Quick memo suggestions */}
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] text-[#8B95A1]">추천 빠른 문구:</span>
                  {quickMemos.map((qm, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBidMemo(qm)}
                      className="block w-full text-left text-[11px] text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB] px-2.5 py-1.5 rounded-xl truncate"
                    >
                      "{qm}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                {activeJobForBid.myBid && (
                  <button
                    onClick={() => {
                      onCancelBid(activeJobForBid.id);
                      setActiveJobForBid(null);
                    }}
                    className="py-3.5 px-4 rounded-2xl bg-[#FEECEC] text-[#F04452] font-bold text-xs hover:bg-[#FCD8D8] transition-colors"
                  >
                    입찰 취소
                  </button>
                )}
                <button
                  id="bid-submit-btn"
                  onClick={handleBidSubmit}
                  className="flex-1 py-3.5 rounded-2xl bg-[#0FA958] text-white font-bold text-sm hover:bg-[#0C8F4A] transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{activeJobForBid.myBid ? '입찰 내용 수정하기' : '입찰 제안서 보내기'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
