import React, { useState } from 'react';
import { Conversation, ChatMessage } from '../types';
import { 
  ShieldCheck, 
  Send, 
  FileCheck, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard,
  Sparkles,
  Info
} from 'lucide-react';

interface ChatViewProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSendMessage: (conversationId: string, text: string) => void;
  onSendInvoice: (conversationId: string, dailyRate: number, days: number, careTitle: string) => void;
  onSimulateEscrowPayment: (conversationId: string, messageId: string) => void;
  onStartTrackingForJob?: (jobId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversations,
  activeConversationId,
  onSendMessage,
  onSendInvoice,
  onSimulateEscrowPayment,
  onStartTrackingForJob,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    activeConversationId || conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Invoice draft state
  const [invoiceTitle, setInvoiceTitle] = useState('외래 진료 동행 및 약국 수령');
  const [invoiceDailyRate, setInvoiceDailyRate] = useState(110000);
  const [invoiceDays, setInvoiceDays] = useState(1);

  const activeConv = conversations.find((c) => c.id === selectedConvId);

  const handleSend = () => {
    if (!inputText.trim() || !selectedConvId) return;
    onSendMessage(selectedConvId, inputText.trim());
    setInputText('');
  };

  const handleQuickChip = (chipText: string) => {
    if (!selectedConvId) return;
    onSendMessage(selectedConvId, chipText);
  };

  const handleCreateInvoice = () => {
    if (!selectedConvId) return;
    onSendInvoice(selectedConvId, invoiceDailyRate, invoiceDays, invoiceTitle);
    setShowInvoiceModal(false);
  };

  return (
    <div className="pb-20">
      {!activeConv ? (
        <div className="p-8 text-center bg-white rounded-3xl mx-4 mt-4 border border-[#E5E8EB]">
          <h4 className="font-bold text-[#191F28]">진행 중인 채팅 상담이 없습니다.</h4>
          <p className="text-xs text-[#6B7684] mt-1">공고 피드에서 1:1 상담을 시작해 보세요.</p>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-130px)] max-w-2xl mx-auto bg-white sm:rounded-3xl border-x border-[#E5E8EB] overflow-hidden shadow-xs">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-[#F2F4F6] bg-white flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F8EE] text-[#0FA958] flex items-center justify-center font-bold text-sm">
                보호자
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-[#191F28]">
                    {activeConv.guardianName}
                  </h3>
                  <span className="text-[11px] px-1.5 py-0.2 bg-[#F2F4F6] text-[#6B7684] rounded-md font-medium">
                    {activeConv.guardianRelation}
                  </span>
                </div>
                <p className="text-xs text-[#8B95A1] truncate max-w-[200px] sm:max-w-xs">
                  {activeConv.careTitle}
                </p>
              </div>
            </div>

            {/* Matching Status Badge */}
            <div className="text-right">
              {activeConv.matchingStatus === 'paid' ? (
                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#E8F8EE] text-[#00A859] inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  에스크로 확정
                </span>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-[#FFF6E6] text-[#E08A00]">
                  상담 조율 중
                </span>
              )}
            </div>
          </div>

          {/* Toss Safety Notice Ribbon */}
          <div className="bg-[#F8F9FA] px-4 py-2 text-[11px] text-[#6B7684] flex items-center gap-1.5 border-b border-[#F2F4F6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C473] shrink-0" />
            <span>개인 전화번호는 전달되지 않아요. 안전하게 대화하세요.</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FAFB]">
            {activeConv.messages.map((msg) => {
              if (msg.type === 'notice') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="text-[11px] bg-[#E5E8EB] text-[#4E5968] px-3 py-1 rounded-full inline-block">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              if (msg.type === 'invoice' && msg.invoiceData) {
                const inv = msg.invoiceData;
                return (
                  <div key={msg.id} className="my-3">
                    <div className="bg-white border-2 border-[#0FA958]/30 rounded-3xl p-5 shadow-[0_4px_16px_rgba(15,169,88,0.08)] max-w-sm mx-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F6]">
                        <span className="text-xs font-bold text-[#0FA958] flex items-center gap-1">
                          <FileCheck className="w-4 h-4" />
                          최종 간병 확정서
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            inv.isPaid
                              ? 'bg-[#E8F8EE] text-[#00A859]'
                              : 'bg-[#FFF6E6] text-[#E08A00]'
                          }`}
                        >
                          {inv.isPaid ? '결제 완료' : '결제 대기'}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="font-bold text-[#191F28] text-sm">{inv.careTitle}</div>
                        <div className="flex justify-between text-[#6B7684]">
                          <span>케어 일정</span>
                          <span className="font-medium text-[#191F28]">{inv.period}</span>
                        </div>
                        <div className="flex justify-between text-[#6B7684]">
                          <span>간병비 단가 ({inv.dailyRate.toLocaleString()}원 × {inv.days}일)</span>
                          <span className="font-medium text-[#191F28]">
                            {inv.careAmount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex justify-between text-[#6B7684]">
                          <span>플랫폼 안심 이용료 (5%)</span>
                          <span className="font-medium text-[#191F28]">
                            {inv.platformFee.toLocaleString()}원
                          </span>
                        </div>
                        <div className="h-[1px] bg-[#F2F4F6] my-2" />
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#191F28] text-sm">총 결제 금액</span>
                          <span className="font-black text-base text-[#0FA958]">
                            {inv.totalAmount.toLocaleString()}원
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {inv.isPaid ? (
                          <div className="p-3 bg-[#E8F8EE] rounded-2xl text-center">
                            <div className="text-xs font-bold text-[#00A859] flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              토스페이 에스크로 안심 결제 완료
                            </div>
                            <p className="text-[11px] text-[#6B7684] mt-0.5">
                              케어가 완전히 종료될 때까지 포도당이 안전하게 보관해요.
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSimulateEscrowPayment(activeConv.id, msg.id)}
                            className="w-full py-3.5 rounded-2xl bg-[#0FA958] hover:bg-[#0C8F4A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>[보호자 모의] 토스페이 1초 결제하기</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              const isMe = msg.sender === 'caremate';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-[#0FA958] text-white rounded-br-xs'
                        : 'bg-white text-[#191F28] border border-[#E5E8EB] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#8B95A1] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Toss Quick Chips Selector */}
          <div className="bg-white border-t border-[#F2F4F6] px-3 pt-2.5 pb-1 flex gap-1.5 overflow-x-auto scrollbar-none">
            {[
              '석션 케어 능숙히 가능합니다.',
              '휠체어 안전 이승 장비 구비되어 있습니다.',
              '요양보호사 1급 인증 완료되었습니다.',
              '복약 안내 및 의사 소견 상세 전달해 드립니다.',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-[#F4F8F5] hover:bg-[#E8F8EE] hover:text-[#0FA958] text-[#4E5968] font-medium whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input & Tools */}
          <div className="p-3 bg-white border-t border-[#F2F4F6] flex items-center gap-2">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3 py-2.5 rounded-2xl bg-[#E8F8EE] text-[#0FA958] font-bold text-xs hover:bg-[#D1F2E0] transition-colors flex items-center gap-1 shrink-0"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>확정서 전송</span>
            </button>

            <input
              id="chat-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="보호자님께 메시지를 입력해 주세요..."
              className="flex-1 px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E8EB] rounded-2xl text-xs text-[#191F28] focus:outline-hidden focus:border-[#0FA958] focus:bg-white"
            />

            <button
              id="chat-send-btn"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-2xl transition-colors ${
                inputText.trim()
                  ? 'bg-[#0FA958] text-white hover:bg-[#0C8F4A]'
                  : 'bg-[#F2F4F6] text-[#B0B8C1] cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Invoice Generation Bottom Sheet */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F6]">
              <h3 className="font-extrabold text-base text-[#191F28]">간병 확정서 발행</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-[#8B95A1] text-xs hover:text-[#191F28]"
              >
                닫기
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#191F28] mb-1">케어 명칭</label>
                <input
                  type="text"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs text-[#191F28]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#191F28] mb-1">1일 단가 (원)</label>
                  <input
                    type="number"
                    step="5000"
                    value={invoiceDailyRate}
                    onChange={(e) => setInvoiceDailyRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs font-bold text-[#191F28]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#191F28] mb-1">케어 일수</label>
                  <input
                    type="number"
                    min="1"
                    value={invoiceDays}
                    onChange={(e) => setInvoiceDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E8EB] rounded-xl text-xs font-bold text-[#191F28]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-2xl space-y-1 text-[#6B7684]">
                <div className="flex justify-between">
                  <span>간병비</span>
                  <span className="font-semibold text-[#191F28]">
                    {(invoiceDailyRate * invoiceDays).toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>플랫폼 안심 이용료 (5%)</span>
                  <span className="font-semibold text-[#191F28]">
                    {Math.floor(invoiceDailyRate * invoiceDays * 0.05).toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between font-bold text-[#0FA958] text-sm pt-1 border-t border-[#E5E8EB]">
                  <span>보호자 총 결제액</span>
                  <span>
                    {Math.floor(invoiceDailyRate * invoiceDays * 1.05).toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                onClick={handleCreateInvoice}
                className="w-full py-3.5 rounded-2xl bg-[#0FA958] hover:bg-[#0C8F4A] text-white font-bold text-sm transition-colors mt-2"
              >
                채팅방으로 확정서 전송하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
