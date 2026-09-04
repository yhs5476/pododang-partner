import React, { useState } from 'react';
import { NavTab, BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { JobFeed } from './components/JobFeed';
import { ChatView } from './components/ChatView';
import { TrackingView } from './components/TrackingView';
import { CareReportView } from './components/CareReportView';
import { MyPageView } from './components/MyPageView';
import { NotificationToast } from './components/NotificationToast';
import {
  INITIAL_PARTNER,
  INITIAL_JOB_POSTS,
  INITIAL_ACTIVE_SESSION,
  INITIAL_CARE_REPORT,
  INITIAL_CONVERSATIONS,
} from './mockData';
import { JobPost, PartnerProfile, Conversation, ActiveCareSession, CareReport } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('feed');
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [partner, setPartner] = useState<PartnerProfile>(INITIAL_PARTNER);
  const [jobs, setJobs] = useState<JobPost[]>(INITIAL_JOB_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeSession, setActiveSession] = useState<ActiveCareSession>(INITIAL_ACTIVE_SESSION);
  const [careReport, setCareReport] = useState<CareReport>(INITIAL_CARE_REPORT);
  const [activeChatJobId, setActiveChatJobId] = useState<string | undefined>();
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'reward' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'reward' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Toggle receiving bids
  const handleToggleReceiving = () => {
    setPartner((prev) => {
      const nextState = !prev.isReceivingBids;
      showToast(
        nextState ? '🟢 실시간 공고 수신이 활성화되었습니다.' : '⚪ 공고 수신이 일시 중지되었습니다.',
        'info'
      );
      return { ...prev, isReceivingBids: nextState };
    });
  };

  // Submit or update reverse auction bid
  const handleSubmitBid = (
    jobId: string,
    proposedAmount: number,
    appealTags: string[],
    guardianMessage: string
  ) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          const isUpdate = Boolean(j.myBid);
          const newBid = {
            id: j.myBid?.id || `bid-${Date.now()}`,
            jobId,
            proposedAmount,
            appealTags,
            guardianMessage,
            createdAt: '방금 전',
            status: 'pending' as const,
          };
          showToast(
            isUpdate
              ? `제안 금액이 ${proposedAmount.toLocaleString()}원으로 수정되었습니다.`
              : `성공적으로 ${proposedAmount.toLocaleString()}원 입찰 제안서를 발송했습니다!`,
            'success'
          );
          return {
            ...j,
            currentBidsCount: isUpdate ? j.currentBidsCount : j.currentBidsCount + 1,
            myBid: newBid,
          };
        }
        return j;
      })
    );
  };

  // Cancel bid
  const handleCancelBid = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          showToast('입찰 제안을 안전하게 취소했습니다.', 'info');
          return {
            ...j,
            currentBidsCount: Math.max(0, j.currentBidsCount - 1),
            myBid: undefined,
          };
        }
        return j;
      })
    );
  };

  // Navigate to consultation
  const handleStartConsultation = (job: JobPost) => {
    let conv = conversations.find((c) => c.jobId === job.id);
    if (!conv) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        jobId: job.id,
        guardianName: `${job.guardianName} 보호자님`,
        guardianRelation: `${job.guardianRelation} (환자: ${job.patientName} 님)`,
        patientName: job.patientName,
        careTitle: job.title,
        lastMessage: '보호자님과의 1:1 상담이 시작되었습니다.',
        lastTime: '방금',
        unreadCount: 0,
        matchingStatus: 'consulting',
        messages: [
          {
            id: `m-init-${Date.now()}`,
            sender: 'system',
            text: '🔒 보호자님과의 1:1 안심 상담이 열렸습니다. 조건과 일정을 편하게 상의하세요.',
            timestamp: '방금',
            type: 'notice',
          },
        ],
      };
      setConversations([newConv, ...conversations]);
      conv = newConv;
    }
    setActiveChatJobId(conv.id);
    setCurrentTab('chat');
  };

  // Send message in chat
  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'caremate' as const,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...c,
            lastMessage: text,
            lastTime: '방금',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Send Invoice in chat
  const handleSendInvoice = (
    conversationId: string,
    dailyRate: number,
    days: number,
    careTitle: string
  ) => {
    const careAmount = dailyRate * days;
    const platformFee = Math.floor(careAmount * 0.05);
    const totalAmount = careAmount + platformFee;

    const invoiceMessage = {
      id: `inv-msg-${Date.now()}`,
      sender: 'system' as const,
      text: '📋 최종 간병 확정서가 채팅방에 발송되었습니다.',
      timestamp: '방금',
      type: 'invoice' as const,
      invoiceData: {
        id: `inv-${Date.now()}`,
        careTitle,
        period: '2026.09.05 ~ 09.07',
        dailyRate,
        days,
        careAmount,
        platformFee,
        totalAmount,
        isPaid: false,
      },
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: `[간병 확정서] ${totalAmount.toLocaleString()}원`,
            lastTime: '방금',
            matchingStatus: 'agreed',
            messages: [...c.messages, invoiceMessage],
          };
        }
        return c;
      })
    );
    showToast('간병 확정서가 성공적으로 전송되었습니다.', 'success');
  };

  // Simulate Guardian Escrow Payment
  const handleSimulateEscrowPayment = (conversationId: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages = c.messages.map((m) => {
            if (m.id === messageId && m.invoiceData) {
              return {
                ...m,
                invoiceData: { ...m.invoiceData, isPaid: true },
              };
            }
            return m;
          });
          return {
            ...c,
            matchingStatus: 'paid',
            messages: updatedMessages,
          };
        }
        return c;
      })
    );

    // Add to pending escrow
    setPartner((prev) => ({
      ...prev,
      settlement: {
        ...prev.settlement,
        pendingEscrowAmount: prev.settlement.pendingEscrowAmount + 115500,
      },
    }));

    showToast('토스페이 결제 완료! 금액이 에스크로에 안전히 예치되었습니다.', 'reward');
  };

  // Advance Door-to-Door 6-step Tracking
  const handleAdvanceStep = (nextStepIndex: number, memo?: string, photoUrl?: string) => {
    setActiveSession((prev) => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedSteps = prev.steps.map((step, idx) => {
        if (idx === prev.currentStepIndex) {
          return {
            ...step,
            completed: true,
            time: nowTime,
            memo: memo || step.memo,
            photoUrl: photoUrl || step.photoUrl,
          };
        }
        if (idx === nextStepIndex) {
          return {
            ...step,
            time: '진행 중',
          };
        }
        return step;
      });

      const isCompleted = updatedSteps.every((s) => s.completed);

      if (isCompleted) {
        // Boost Brix by +0.3
        setPartner((p) => ({
          ...p,
          brix: p.brix + 0.3,
          brixHistory: [
            {
              id: `bx-${Date.now()}`,
              reason: '6단계 트래킹 정시 완료 및 가족 알림',
              change: 0.3,
              date: '2026.09.04',
            },
            ...p.brixHistory,
          ],
        }));
        showToast('🎉 6단계 케어 완료! 포도 당도 +0.3 °Bx가 상승했습니다.', 'reward');
      } else {
        showToast(
          `[${updatedSteps[prev.currentStepIndex].title}] 완료! 가족 3명에게 알림톡 전송 🔔`,
          'success'
        );
      }

      return {
        ...prev,
        currentStepIndex: nextStepIndex,
        steps: updatedSteps,
      };
    });
  };

  // Update Care Report
  const handleUpdateReport = (updated: Partial<CareReport>) => {
    setCareReport((prev) => {
      const nextReport = { ...prev, ...updated };
      if (!prev.isAiGenerated && updated.isAiGenerated) {
        // Add Brix +0.2 for report generation
        setPartner((p) => ({
          ...p,
          brix: p.brix + 0.2,
          brixHistory: [
            {
              id: `bx-${Date.now()}`,
              reason: 'AI Care Report 꼼꼼한 진료 결과 작성',
              change: 0.2,
              date: '2026.09.04',
            },
            ...p.brixHistory,
          ],
        }));
        showToast('AI Care Report 생성 완료! 포도 당도 +0.2 °Bx 추가', 'reward');
      }
      return nextReport;
    });
  };

  // Share Care Report with Family
  const handleShareReport = () => {
    setCareReport((prev) => ({
      ...prev,
      isSharedWithFamily: true,
      sharedAt: '방금',
    }));
    showToast('🔗 온 가족 안심 열람 링크가 복사되었습니다.', 'success');
  };

  // Withdraw funds to bank
  const handleWithdrawFunds = () => {
    const amount = partner.settlement.withdrawableAmount;
    setPartner((prev) => ({
      ...prev,
      settlement: {
        ...prev.settlement,
        withdrawableAmount: 0,
        monthlyTotal: prev.settlement.monthlyTotal + amount,
      },
    }));
    showToast(`${amount.toLocaleString()}원이 토스뱅크 계좌로 즉시 입금되었습니다!`, 'success');
  };

  // Add new license
  const handleAddLicense = (name: string) => {
    setPartner((prev) => ({
      ...prev,
      brix: prev.brix + 0.5,
      licenses: [
        ...prev.licenses,
        {
          name,
          level: '검증 완료',
          verified: true,
          issuedDate: '2026.09.04',
        },
      ],
      brixHistory: [
        {
          id: `bx-${Date.now()}`,
          reason: `신규 자격증(${name}) 인증 승인`,
          change: 0.5,
          date: '2026.09.04',
        },
        ...prev.brixHistory,
      ],
    }));
    showToast(`자격증(${name}) 등록 승인! 포도 당도 +0.5 °Bx 상승`, 'reward');
  };

  return (
    <div className="min-h-screen bg-[#F4F8F5] text-[#191F28] flex flex-col selection:bg-[#0FA958]/20 selection:text-[#0FA958]">
      {/* Toast Notification */}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Header */}
      <Header
        partner={partner}
        selectedRadius={selectedRadius}
        onSelectRadius={(r) => setSelectedRadius(r)}
        onToggleReceiving={handleToggleReceiving}
        onOpenMyPage={() => setCurrentTab('mypage')}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto">
        {currentTab === 'feed' && (
          <JobFeed
            jobs={jobs}
            partner={partner}
            selectedRadius={selectedRadius}
            onSelectRadius={(r) => setSelectedRadius(r)}
            onSubmitBid={handleSubmitBid}
            onCancelBid={handleCancelBid}
            onStartConsultation={handleStartConsultation}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            conversations={conversations}
            activeConversationId={activeChatJobId}
            onSendMessage={handleSendMessage}
            onSendInvoice={handleSendInvoice}
            onSimulateEscrowPayment={handleSimulateEscrowPayment}
            onStartTrackingForJob={() => setCurrentTab('tracking')}
          />
        )}

        {currentTab === 'tracking' && (
          <TrackingView
            session={activeSession}
            onAdvanceStep={handleAdvanceStep}
            onNavigateToReport={() => setCurrentTab('report')}
          />
        )}

        {currentTab === 'report' && (
          <CareReportView
            report={careReport}
            partner={partner}
            onUpdateReport={handleUpdateReport}
            onShareReport={handleShareReport}
          />
        )}

        {currentTab === 'mypage' && (
          <MyPageView
            partner={partner}
            onWithdrawFunds={handleWithdrawFunds}
            onAddLicense={handleAddLicense}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        unreadChatCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
        isTrackingActive={!activeSession.steps.every((s) => s.completed)}
      />
    </div>
  );
}
