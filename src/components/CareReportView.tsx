import React, { useState } from 'react';
import { CareReport, PartnerProfile } from '../types';
import { 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  Pill, 
  HeartPulse, 
  FileText, 
  Copy,
  Check,
  Send
} from 'lucide-react';
import { GreenGrapeIcon } from './GreenGrapeIcon';

interface CareReportViewProps {
  report: CareReport;
  partner: PartnerProfile;
  onUpdateReport: (updated: Partial<CareReport>) => void;
  onShareReport: () => void;
}

export const CareReportView: React.FC<CareReportViewProps> = ({
  report,
  partner,
  onUpdateReport,
  onShareReport,
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [doctorFeedback, setDoctorFeedback] = useState(report.doctorFeedback);
  const [medicationInstructions, setMedicationInstructions] = useState(report.medicationInstructions);
  const [temp, setTemp] = useState(report.vitalSigns.temp);
  const [bloodPressure, setBloodPressure] = useState(report.vitalSigns.bloodPressure);
  const [mealIntake, setMealIntake] = useState(report.vitalSigns.mealIntake);
  const [bowelMovement, setBowelMovement] = useState(report.vitalSigns.bowelMovement);
  const [conditionNote, setConditionNote] = useState(report.vitalSigns.conditionNote);
  const [nextAppointment, setNextAppointment] = useState(report.nextAppointment || '2026.12.04 (금) 10:30');

  const handleGenerateAiReport = () => {
    setIsGeneratingAi(true);

    setTimeout(() => {
      const summaryText = `🌿 [포도당 청포도 AI 안심 Care Report]
환자분: ${report.patientName} | 담당: ${partner.name} 케어메이트

1. 🩺 주치의 핵심 진료 소견
${doctorFeedback || '심전도 검사 결과 기존 대비 안정적이며, 호흡곤란은 일시적인 현상으로 진단되었습니다.'}

2. 💊 약국 수령 및 복약 지침
${medicationInstructions || '처방약 90일 치 수령 완료. 아침 식후 30분 복용하며 이뇨제 성분이 포함되어 저녁 복용은 피해야 합니다.'}

3. 🏃 활력징후 및 당일 컨디션
• 체온: ${temp} | 혈압: ${bloodPressure}
• 식사량: ${mealIntake} | 대소변: ${bowelMovement}
• 특이사항: ${conditionNote || '어르신 기분 안정적이며 이동 간 낙상 위험 없이 무사히 귀가 침상 안치하셨습니다.'}

4. 🗓️ 다음 외래 예약일
${nextAppointment}`;

      onUpdateReport({
        doctorFeedback,
        medicationInstructions,
        vitalSigns: {
          temp,
          bloodPressure,
          mealIntake,
          bowelMovement,
          conditionNote,
        },
        aiGeneratedSummary: summaryText,
        nextAppointment,
        isAiGenerated: true,
      });

      setIsGeneratingAi(false);
    }, 700);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://pododang.care/report/${report.id}?token=family_safe_access`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShareReport();
  };

  return (
    <div className="pb-28 pt-2 max-w-2xl mx-auto px-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E8EB] shadow-xs mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h2 className="font-extrabold text-base text-[#191F28]">
                AI Care Report 간편 작성
              </h2>
              <p className="text-xs text-[#8B95A1]">
                {report.patientName} 어르신 · {report.hospitalName}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0FA958] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
            작성 시 +0.2 °Bx
          </span>
        </div>
        <p className="text-xs text-[#6B7684] mt-2.5 leading-relaxed">
          진료 중 의사 선생님의 전달사항과 환자분의 컨디션을 간단히 메모하시면, AI가 보호자와 온 가족이 한눈에 알아보기 쉬운 안심 리포트로 정돈해 드립니다.
        </p>
      </div>

      {/* Input Module Form */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E8EB] shadow-xs space-y-4 mb-4">
        {/* 1. Doctor Remarks */}
        <div>
          <label className="block text-xs font-bold text-[#191F28] mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0FA958]" />
            <span>주치의 진료 소견 및 전달사항</span>
          </label>
          <textarea
            id="report-doctor-feedback"
            rows={3}
            value={doctorFeedback}
            onChange={(e) => setDoctorFeedback(e.target.value)}
            placeholder="예: 심전도 검사 결과 안정적. 3개월 후 재검사 필요..."
            className="w-full p-3 bg-[#F8F9FA] border border-[#E5E8EB] rounded-2xl text-xs text-[#191F28] focus:outline-hidden focus:border-[#0FA958] focus:bg-white resize-none"
          />
        </div>

        {/* 2. Medication Instructions */}
        <div>
          <label className="block text-xs font-bold text-[#191F28] mb-1 flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-[#0FA958]" />
            <span>약국 복약 지도 및 주의점</span>
          </label>
          <textarea
            id="report-medication"
            rows={2}
            value={medicationInstructions}
            onChange={(e) => setMedicationInstructions(e.target.value)}
            placeholder="예: 아침 식후 30분 복용. 이뇨제 성분 있어 저녁 복용 금지..."
            className="w-full p-3 bg-[#F8F9FA] border border-[#E5E8EB] rounded-2xl text-xs text-[#191F28] focus:outline-hidden focus:border-[#0FA958] focus:bg-white resize-none"
          />
        </div>

        {/* 3. Vital Signs & Condition Grid */}
        <div className="pt-2 border-t border-[#F2F4F6]">
          <h4 className="text-xs font-bold text-[#191F28] mb-2 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-[#F04452]" />
            <span>환자 활력징후 및 식사/배변 상태</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span className="text-[11px] text-[#6B7684]">체온</span>
              <input
                id="report-temp-input"
                type="text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full p-2 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs font-bold text-[#191F28]"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#6B7684]">혈압</span>
              <input
                id="report-bp-input"
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full p-2 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs font-bold text-[#191F28]"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[11px] text-[#6B7684] block mb-1">식사 섭취량</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['전부 드심', '절반 드심', '거의 못 드심'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMealIntake(m)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      mealIntake === m
                        ? 'bg-[#0FA958] text-white'
                        : 'bg-[#F2F4F6] text-[#4E5968]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#6B7684] block mb-1">배변 / 소변 상태</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['정상 배변', '미배변', '소변줄 정상'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBowelMovement(b)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      bowelMovement === b
                        ? 'bg-[#0FA958] text-white'
                        : 'bg-[#F2F4F6] text-[#4E5968]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#6B7684] block mb-1">다음 진료 예약일</span>
              <div className="flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl px-3 py-2">
                <Calendar className="w-3.5 h-3.5 text-[#8B95A1]" />
                <input
                  type="text"
                  value={nextAppointment}
                  onChange={(e) => setNextAppointment(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#191F28] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Generate AI Button */}
        <button
          id="report-generate-ai-btn"
          onClick={handleGenerateAiReport}
          disabled={isGeneratingAi}
          className="w-full py-4 rounded-2xl bg-[#0FA958] hover:bg-[#0C8F4A] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>
            {isGeneratingAi
              ? '포도당 AI가 리포트를 정돈하고 있어요...'
              : 'AI Care Report 완성하기 (원클릭 자동 구성)'}
          </span>
        </button>
      </div>

      {/* Generated AI Care Report Card */}
      {report.isAiGenerated && (
        <div className="bg-white rounded-3xl p-5 border-2 border-[#0FA958]/30 shadow-lg mb-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F6]">
            <div className="flex items-center gap-1.5">
              <GreenGrapeIcon className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-[#191F28]">
                포도당 안심 AI Care Report
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8EE] text-[#0FA958]">
              작성 완료
            </span>
          </div>

          <div className="mt-4 space-y-3.5 text-xs text-[#333D4B]">
            <div className="bg-[#F8F9FA] p-4 rounded-2xl whitespace-pre-line leading-relaxed font-sans text-xs">
              {report.aiGeneratedSummary}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8B95A1] pt-1">
              <span>작성일시: {report.date}</span>
              <span>작성자: {partner.name} 케어메이트</span>
            </div>
          </div>

          {/* Family Share CTA */}
          <div className="mt-4 pt-3 border-t border-[#F2F4F6]">
            <button
              id="report-family-share-btn"
              onClick={() => setShowShareModal(true)}
              className="w-full py-3.5 rounded-2xl bg-[#0FA958] hover:bg-[#0C8F4A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>카카오톡 / 링크로 온 가족 공유하기 🔗</span>
            </button>
          </div>
        </div>
      )}

      {/* Family Sharing Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E8F8EE] text-[#0FA958] flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-base text-[#191F28]">온 가족 안심 공유</h3>
            <p className="text-xs text-[#6B7684] mt-1 mb-4 leading-relaxed">
              보호자뿐만 아니라 다른 가족분들도 실시간으로 진료 결과 및 복약 주의점을 열람할 수 있는 안심 링크입니다.
            </p>

            <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-[#E5E8EB] flex items-center justify-between text-xs text-[#4E5968] mb-4">
              <span className="truncate max-w-[200px]">
                https://pododang.care/report/{report.id}
              </span>
              <button
                onClick={handleCopyLink}
                className="text-[#0FA958] font-bold text-xs flex items-center gap-1 hover:underline shrink-0 ml-2"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleCopyLink();
                  setShowShareModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-[#FEE500] text-[#191919] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FADA0A]"
              >
                <span>💬 카카오톡으로 가족들에게 보내기</span>
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 rounded-2xl text-xs font-semibold text-[#8B95A1] hover:text-[#191F28]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
