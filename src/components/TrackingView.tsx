import React, { useState } from 'react';
import { ActiveCareSession, TrackingStep } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Camera, 
  FileText, 
  MapPin, 
  Send, 
  ChevronRight, 
  Sparkles,
  Phone,
  AlertCircle
} from 'lucide-react';

interface TrackingViewProps {
  session: ActiveCareSession;
  onAdvanceStep: (stepIndex: number, memo?: string, photoUrl?: string) => void;
  onNavigateToReport: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  session,
  onAdvanceStep,
  onNavigateToReport,
}) => {
  const [activeStepInputMemo, setActiveStepInputMemo] = useState('');
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | undefined>();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);

  const currentStep = session.steps[session.currentStepIndex];
  const isAllCompleted = session.steps.every((s) => s.completed);

  const samplePhotoPresets = [
    { label: '병원 로비 도착', url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80' },
    { label: '처방전 및 약봉지', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { label: '진료비 수납 영수증', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleNextStep = () => {
    if (session.currentStepIndex < session.steps.length - 1) {
      onAdvanceStep(session.currentStepIndex + 1, activeStepInputMemo, activePhotoUrl);
      setActiveStepInputMemo('');
      setActivePhotoUrl(undefined);
    } else if (session.currentStepIndex === session.steps.length - 1 && !isAllCompleted) {
      onAdvanceStep(session.currentStepIndex, activeStepInputMemo, activePhotoUrl);
      setShowCompletionCelebration(true);
    }
  };

  return (
    <div className="pb-28 pt-2">
      {/* Session Top Header Card */}
      <div className="bg-white rounded-3xl p-5 mx-4 border border-[#E5E8EB] shadow-xs mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8EE] text-[#00A859] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A859] animate-pulse" />
              실시간 동행 중
            </span>
            <span className="text-xs text-[#8B95A1]">{session.scheduleDate}</span>
          </div>
          <a
            href={`tel:${session.guardianPhone}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#0FA958] bg-[#E8F8EE] hover:bg-[#D1F2E0] px-2.5 py-1 rounded-full transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>보호자 안심통화</span>
          </a>
        </div>

        <h2 className="font-extrabold text-lg text-[#191F28] mt-3">
          {session.patientName}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-[#4E5968] mt-1">
          <MapPin className="w-3.5 h-3.5 text-[#0FA958]" />
          <span className="font-medium text-[#191F28]">{session.hospitalName}</span>
          <span className="text-[#8B95A1]">({session.hospitalDept})</span>
        </div>

        {/* Real-time Family Notification Alert */}
        <div className="mt-3.5 p-3 bg-[#F4F8F5] rounded-2xl flex items-center justify-between text-xs text-[#4E5968] border border-[#E5EBE7]">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔔</span>
            <span>단계 업데이트 시 <strong>보호자 가족 3명</strong>에게 카카오톡 자동 전송</span>
          </div>
          <span className="text-[10px] text-[#0FA958] font-bold">동기화 100%</span>
        </div>
      </div>

      {/* 6-Step Door-to-Door Interactive Timeline */}
      <div className="bg-white rounded-3xl p-5 mx-4 border border-[#E5E8EB] shadow-xs mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-[#191F28]">
            Door-to-Door 6단계 실시간 트래킹
          </h3>
          <span className="text-xs font-bold text-[#0FA958]">
            {session.steps.filter((s) => s.completed).length} / 6 완료
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E8EB]">
          {session.steps.map((stepItem, index) => {
            const isCompleted = stepItem.completed;
            const isCurrent = session.currentStepIndex === index && !isCompleted;
            const isPending = !isCompleted && !isCurrent;

            return (
              <div key={stepItem.step} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                    isCompleted
                      ? 'bg-[#0FA958] text-white ring-4 ring-[#E8F8EE]'
                      : isCurrent
                      ? 'bg-[#0FA958] text-white ring-4 ring-[#E8F8EE] animate-pulse'
                      : 'bg-[#E5E8EB] text-[#8B95A1]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepItem.step}
                </div>

                {/* Step content */}
                <div
                  className={`p-3.5 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-[#E8F8EE]/60 border border-[#0FA958]/30'
                      : isCompleted
                      ? 'bg-[#F8F9FA]'
                      : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{stepItem.icon}</span>
                      <h4
                        className={`text-sm font-extrabold ${
                          isCompleted
                            ? 'text-[#191F28]'
                            : isCurrent
                            ? 'text-[#0FA958]'
                            : 'text-[#8B95A1]'
                        }`}
                      >
                        {stepItem.title}
                      </h4>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isCompleted
                          ? 'text-[#0FA958]'
                          : isCurrent
                          ? 'text-[#0FA958] font-bold animate-pulse'
                          : 'text-[#B0B8C1]'
                      }`}
                    >
                      {stepItem.time || (isCurrent ? '진행 중' : '대기')}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7684] mt-1">{stepItem.subTitle}</p>

                  {/* Registered memo if exists */}
                  {stepItem.memo && (
                    <div className="mt-2 text-xs bg-white p-2.5 rounded-xl border border-[#E5E8EB] text-[#333D4B]">
                      {stepItem.memo}
                    </div>
                  )}

                  {/* Registered photo if exists */}
                  {stepItem.photoUrl && (
                    <div className="mt-2">
                      <img
                        src={stepItem.photoUrl}
                        alt="증빙 사진"
                        className="w-24 h-24 object-cover rounded-xl border border-[#E5E8EB]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Action Card (Sticky Bottom Area) */}
      {!isAllCompleted && currentStep && (
        <div className="fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-[#E5E8EB] p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="max-w-2xl mx-auto space-y-2.5">
            {/* Quick memo input */}
            <div className="flex gap-2">
              <input
                id="tracking-memo-input"
                type="text"
                value={activeStepInputMemo}
                onChange={(e) => setActiveStepInputMemo(e.target.value)}
                placeholder="보호자에게 전할 짧은 메모 입력 (선택)..."
                className="flex-1 px-3.5 py-2 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs text-[#191F28] focus:outline-hidden focus:border-[#0FA958]"
              />
              <button
                onClick={() => setShowPhotoModal(true)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                  activePhotoUrl
                    ? 'bg-[#E8F8EE] text-[#0FA958] border border-[#0FA958]/30'
                    : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{activePhotoUrl ? '사진 첨부됨' : '사진'}</span>
              </button>
            </div>

            {/* One-click Next Step Button */}
            <button
              id="tracking-advance-btn"
              onClick={handleNextStep}
              className="w-full h-14 rounded-2xl bg-[#0FA958] hover:bg-[#0C8F4A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{currentStep.icon}</span>
              <span>
                다음 단계로 원클릭 업데이트: <strong>[{currentStep.title}]</strong> 완료하기
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* All Steps Completed Card */}
      {isAllCompleted && (
        <div className="bg-[#E8F8EE] border border-[#00C473]/30 rounded-3xl p-6 mx-4 text-center mb-4">
          <div className="text-3xl mb-2">🎉</div>
          <h4 className="font-extrabold text-[#191F28] text-base">
            오늘의 6단계 안심 케어가 모두 완료되었습니다!
          </h4>
          <p className="text-xs text-[#4E5968] mt-1.5 leading-relaxed">
            트래킹 정시 이행으로 <strong>포도 당도 +0.3 °Bx</strong>가 적립되었으며, 에스크로 정산금(110,000원)이 안전하게 정산 잔고로 반영됩니다.
          </p>

          <button
            id="tracking-to-report-btn"
            onClick={onNavigateToReport}
            className="w-full mt-4 py-3.5 rounded-2xl bg-[#0FA958] hover:bg-[#0C8F4A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>보호자를 위한 AI Care Report 작성하러 가기 (+0.2 °Bx 추가)</span>
          </button>
        </div>
      )}

      {/* Photo Selection Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-[#191F28] text-base mb-1">증빙 사진 첨부</h3>
            <p className="text-xs text-[#8B95A1] mb-4">현장 상황(약봉지, 영수증, 대기실)을 선택해 주세요.</p>

            <div className="space-y-2">
              {samplePhotoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePhotoUrl(preset.url);
                    setShowPhotoModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 bg-[#F8F9FA] hover:bg-[#E8F8EE] rounded-2xl transition-colors text-left"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#191F28]">{preset.label}</div>
                    <div className="text-[10px] text-[#8B95A1]">터치하여 첨부</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPhotoModal(false)}
              className="w-full mt-4 py-3 rounded-xl bg-[#F2F4F6] text-[#4E5968] font-bold text-xs hover:bg-[#E5E8EB]"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
