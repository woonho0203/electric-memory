/**
 * ⚡ SparkMemory - 전기기사 실기 암기 최적화 시스템
 * [수정사항: 2-Button(안다/모른다) + 회차(Session) 기반 복습 주기로 전면 교체]
 * [기능 유지: 2003-2025 그리드, 갤럭시 Fix 100% 유지, 이미지 축소 유지, 연도 정규화 유지]
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BookOpen, Brain, Moon, Sun, Save, PlusCircle, ChevronLeft, Calendar, X, ArrowLeft, 
  BarChart3, CheckCircle, Clock, Timer, AlertCircle, RotateCcw, ImageIcon, ChevronRight
} from 'lucide-react';

import { ALL_EXAM_DATA } from './data'; 

type QuestionStat = {
  know: number;
  dontknow: number;
};

type LogEntry = {
  total: number;
  unknown: number;
  scores: Record<string, number>;
  totalTime?: number;
  lastStudyTime?: string;
  questionStats?: Record<string, QuestionStat>; // key: "문제번호" e.g. "1", "2"
};

// 회차 기반 리포트 항목
type ReportItem = {
  id: any;
  question_no: number;
  question: string;
  result: 'know' | 'dontknow';
  next_review_session: number;
};

const App: React.FC = () => {
  // -------------------------------------------------------------------------
  // 1. 데이터 로드
  // -------------------------------------------------------------------------
  const [questions, setQuestions] = useState<any[]>(() => {
    let loadedData: any[] = [];
    try {
      const saved = localStorage.getItem('spark-memory-data-new');
      if (saved) loadedData = JSON.parse(saved);
    } catch (e) { 
      console.error("데이터 로드 실패, 초기화합니다.", e);
      localStorage.removeItem('spark-memory-data-new'); 
    }
    const sourceData = (loadedData && loadedData.length > 0) ? loadedData : (ALL_EXAM_DATA as any[]);
    
    return sourceData.map((q: any, index: number): any => {
      const safeId = q.id ? q.id : Date.now() + index;
      
      // 연도 데이터 형식 정규화
      let formattedYear = String(q.year || "연도 미상");
      if (formattedYear.includes('-')) {
        const parts = formattedYear.split('-');
        const y = parts[0].trim();
        const r = parseInt(parts[1], 10);
        formattedYear = `${y}년 ${r}회`;
      }

      let extractedNo = 0;
      if (q.question_no) {
        extractedNo = q.question_no;
      } else if (typeof safeId === 'string' && safeId.includes('-')) {
        const parts = safeId.split('-');
        extractedNo = parseInt(parts[parts.length - 1], 10);
      } else {
        extractedNo = index + 1;
      }

      return {
        ...q,
        id: safeId,
        subject: q.subject || "기타 과목",
        year: formattedYear,
        question_no: extractedNo,
        question: q.question || q.content || "문제 내용 없음",
        answer: q.answer || "정답 없음",
        image_url: q.image_url || null, 
        answer_image_url: q.answer_image_url || null, 
        // 회차 기반 필드
        interval: (typeof q.interval === 'number') ? q.interval : 0,
        next_review_session: (typeof q.next_review_session === 'number') ? q.next_review_session : 1,
        // 하위 호환: 기존 SM-2 필드 제거 안 함 (데이터 안전)
        repetition: (typeof q.repetition === 'number') ? q.repetition : 0,
        ef: (typeof q.ef === 'number') ? q.ef : 2.5,
        next_review_date: (typeof q.next_review_date === 'number') ? q.next_review_date : Date.now() 
      };
    });
  });

  // 연도별 현재 회차 세션 번호
  const [sessionMap, setSessionMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('spark-memory-session-map');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [studyLogs, setStudyLogs] = useState<Record<string, Record<string, LogEntry>>>(() => {
    try {
      const savedLogs = localStorage.getItem('spark-memory-logs-v3');
      return savedLogs ? JSON.parse(savedLogs) : {};
    } catch (e) {
      return {};
    }
  });

  const [view, setView] = useState<'list' | 'detail' | 'study' | 'report' | 'add' | 'stats'>('list');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [studyQueue, setStudyQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCard = studyQueue[currentIndex] || null;
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // 최종 리포트 데이터
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);

  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [newAImg, setNewAImg] = useState(''); 

  const [sessionSeconds, setSessionSeconds] = useState(0);
  const lastInteractionRef = useRef<number>(Date.now());

  const yearList = Array.from({ length: 2024 - 2003 + 1 }, (_, i) => 2024 - i);

  // 현재 선택된 연도의 session 번호
  const getCurrentSession = useCallback((yearKey: string) => {
    return sessionMap[yearKey] || 1;
  }, [sessionMap]);

  // -------------------------------------------------------------------------
  // 이미지 렌더링 헬퍼
  // -------------------------------------------------------------------------
  const renderImages = (urls: string | string[] | null) => {
    if (!urls) return null;
    const urlArray = Array.isArray(urls) ? urls : [urls];
    return urlArray.map((url, idx) => (
      <img 
        key={idx} 
        src={url} 
        alt="Exam Content" 
        className="w-full max-h-[200px] md:max-h-[350px] lg:max-h-[450px] object-contain mt-4 first:mt-0" 
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
    ));
  };

  // -------------------------------------------------------------------------
  // 2. Effect Hooks
  // -------------------------------------------------------------------------
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('spark-memory-data-new', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('spark-memory-logs-v3', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('spark-memory-session-map', JSON.stringify(sessionMap));
  }, [sessionMap]);

  useEffect(() => {
    let interval: any;
    if (view === 'study') {
      lastInteractionRef.current = Date.now();
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setSessionSeconds(0);
    }
    return () => clearInterval(interval);
  }, [view]);

  // -------------------------------------------------------------------------
  // 3. 핸들러
  // -------------------------------------------------------------------------
  const handleResetData = () => {
    if (window.confirm("데이터가 꼬였을 때 사용하는 기능입니다.\n모든 학습 기록을 초기화하시겠습니까?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const startStudy = () => {
    if (!selectedYear) return;
    const currentSession = getCurrentSession(selectedYear);
    // next_review_session <= currentSession 인 문제들만
    const dueList = questions.filter(q => q.year === selectedYear && (q.next_review_session || 1) <= currentSession);
    if (dueList.length > 0) {
      setStudyQueue(dueList);
      setCurrentIndex(0);
      setShowAnswer(false);
      setReportItems([]);
      setView('study');
    } else {
      alert(`✅ 현재 ${currentSession}회차에 복습할 문제가 없습니다.\n다음 회차로 넘어가거나 새 문제를 추가해주세요.`);
    }
  };

  const handlePrevCard = useCallback(() => { 
    if (currentIndex > 0) { 
      setCurrentIndex(prev => prev - 1); 
      setShowAnswer(false); 
    } 
  }, [currentIndex]);

  // ✅ 2-Button 핵심 로직: 회차 기반 복습 주기 계산
  const processReview = useCallback((result: 'know' | 'dontknow') => {
    if (!currentCard || !selectedYear) return;

    const currentSession = getCurrentSession(selectedYear);
    
    // 회차 기반 interval 계산
    // 모른다: interval = 1 (다음 회차에 즉시 재등장)
    // 안다:   interval = 2 (다다음 회차에 등장)
    const interval = result === 'dontknow' ? 1 : 2;
    const next_review_session = currentSession + interval;

    // 문제 데이터 업데이트 (메모리 + localStorage)
    const updatedQuestions = questions.map((q) => 
      q.id === currentCard.id 
        ? { ...q, interval, next_review_session } 
        : q
    );
    setQuestions(updatedQuestions);

    // 리포트 항목 수집
    const newReportItem: ReportItem = {
      id: currentCard.id,
      question_no: currentCard.question_no,
      question: currentCard.question,
      result,
      next_review_session
    };

    const now = Date.now();
    const timeDelta = Math.min((now - lastInteractionRef.current) / 1000, 300);
    lastInteractionRef.current = now;

    const todayStr = new Date().toISOString().split('T')[0];
    const currentTimeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const yearKey = `${selectedYear} [${currentSession}회차]`;

    const qNoKey = String(currentCard.question_no || 0);
    setStudyLogs(prev => {
      const dayLogs = prev[todayStr] || {};
      const sessionLog = dayLogs[yearKey] || { total: 0, unknown: 0, scores: { know: 0, dontknow: 0 }, totalTime: 0, lastStudyTime: '', questionStats: {} };
      const prevQStats = sessionLog.questionStats || {};
      const prevQ = prevQStats[qNoKey] || { know: 0, dontknow: 0 };
      return {
        ...prev,
        [todayStr]: {
          ...dayLogs,
          [yearKey]: {
            total: sessionLog.total + 1,
            unknown: result === 'dontknow' ? sessionLog.unknown + 1 : sessionLog.unknown,
            scores: { 
              ...sessionLog.scores, 
              [result]: ((sessionLog.scores[result] as number) || 0) + 1 
            },
            totalTime: (sessionLog.totalTime || 0) + timeDelta,
            lastStudyTime: currentTimeStr,
            questionStats: {
              ...prevQStats,
              [qNoKey]: {
                know: result === 'know' ? prevQ.know + 1 : prevQ.know,
                dontknow: result === 'dontknow' ? prevQ.dontknow + 1 : prevQ.dontknow,
              }
            }
          }
        }
      };
    });

    if (currentIndex < studyQueue.length - 1) {
      // 다음 문제로
      setReportItems(prev => [...prev, newReportItem]);
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // 회차 완료 → 회차 증가 + 학습 종료 화면
      const finalReport = [...reportItems, newReportItem];
      setReportItems(finalReport);
      if (selectedYear) {
        const nextSession = currentSession + 1;
        setSessionMap((prev: Record<string, number>) => ({ ...prev, [selectedYear]: nextSession }));
      }
      setView('report');
    }
  }, [currentCard, questions, currentIndex, studyQueue, selectedYear, getCurrentSession, reportItems]);

  // 회차 증가 공통 함수
  const incrementSession = (yearKey: string) => {
    setSessionMap((prev: Record<string, number>) => ({
      ...prev,
      [yearKey]: (prev[yearKey] || 1) + 1
    }));
  };

  // 다음 회차 시작 버튼
  const handleNextSession = () => {
    if (!selectedYear) return;
    incrementSession(selectedYear);
    setView('detail');
  };

  // 리포트에서 목록으로 → 회차 자동 증가
  const handleReportToList = () => {
    if (selectedYear) incrementSession(selectedYear);
    setView('list');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'study') return;
      if (!showAnswer) { 
        if (['Space', 'Enter', '1', '2'].includes(e.key) || e.code === 'Space') { 
          e.preventDefault(); 
          setShowAnswer(true); 
        } 
      } else { 
        if (e.key === '1') { e.preventDefault(); processReview('dontknow'); }
        if (e.key === '2') { e.preventDefault(); processReview('know'); }
      } 
      if (e.key === 'ArrowLeft') handlePrevCard();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, showAnswer, processReview, handlePrevCard]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0분';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}시간 ${m}분`;
    return `${m}분`;
  };

  const handleAddQuestion = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const newQuestion = { 
      id: Date.now(), 
      subject: "개인 노트", 
      year: "오답노트", 
      question_no: 0, 
      question: newQ, 
      answer: newA, 
      image_url: null, 
      answer_image_url: newAImg.trim() || null, 
      interval: 0,
      next_review_session: 1,
      repetition: 0, ef: 2.5, next_review_date: Date.now() 
    };
    setQuestions([...questions, newQuestion]); setNewQ(''); setNewA(''); setNewAImg(''); setSelectedYear("오답노트"); setView('detail');
  };

  // -------------------------------------------------------------------------
  // 4. UI 렌더링
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-[100dvh] bg-black text-white p-4 font-sans flex flex-col items-center">
      <nav className="w-full max-w-md md:max-w-6xl flex justify-between items-center mb-6 transition-all duration-300">
        <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => setView('list')}>
          <BookOpen className="w-5 h-5 text-blue-500" /> <span className="text-sm md:text-base">전기기사실기기출문제풀이</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('stats')} className="p-2 rounded-full bg-gray-900 text-gray-400 border border-gray-800" title="학습 통계">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button onClick={handleResetData} className="p-2 rounded-full bg-gray-900 text-gray-400 border border-gray-800" title="데이터 초기화">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-900 text-gray-400 border border-gray-800">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <div className={`w-full transition-all duration-300 ${view === 'study' ? 'max-w-md md:max-w-6xl' : 'max-w-md md:max-w-2xl'}`}>
        
        {/* ===== LIST VIEW ===== */}
        {view === 'list' && (
          <div className="space-y-6 animate-in fade-in duration-300 pb-20">
            <header className="flex justify-between items-end">
              <h1 className="text-xl font-bold">기출 회차 선택</h1>
            </header>

            <div className="space-y-6">
              {yearList.map(year => (
                <div key={year} className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-lg font-bold">{year}년</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(round => {
                      const yearKey = `${year}년 ${round}회`;
                      const hasData = questions.some(q => q.year === yearKey);
                      const currentSession = getCurrentSession(yearKey);
                      const due = questions.filter(q => q.year === yearKey && (q.next_review_session || 1) <= currentSession).length;

                      return (
                        <button 
                          key={round}
                          disabled={!hasData}
                          onClick={() => { setSelectedYear(yearKey); setView('detail'); }}
                          className={`relative p-4 rounded-xl text-center border transition-all active:scale-95 ${
                            hasData 
                              ? 'bg-gray-900 border-gray-800 hover:border-blue-600' 
                              : 'bg-gray-900/30 border-gray-900 opacity-40 grayscale cursor-not-allowed'
                          }`}
                        >
                          <p className="text-sm font-bold">{round}회</p>
                          {hasData && due > 0 && (
                            <div className="mt-1 flex items-center justify-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-[10px] text-red-400 font-bold">{due}개</span>
                            </div>
                          )}
                          {hasData && due === 0 && (
                            <p className="text-[10px] text-green-500 mt-1">완료</p>
                          )}
                          {!hasData && <p className="text-[10px] text-gray-600 mt-1">미입력</p>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setView('add')} className="w-full py-4 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
              <PlusCircle className="w-5 h-5" /> 새 문제 추가하기
            </button>

          </div>
        )}

        {/* ===== DETAIL VIEW ===== */}
        {view === 'detail' && selectedYear && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('list')} className="flex items-center text-gray-400 text-sm hover:text-white"><ChevronLeft className="w-4 h-4 mr-1" /> 목록으로</button>
            <h1 className="text-2xl font-bold text-white">{selectedYear}</h1>
            
            {/* 현재 회차 정보 */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300 font-bold">현재 학습 회차</span>
                <span className="text-2xl font-black text-blue-400">{getCurrentSession(selectedYear)}회차</span>
              </div>
              <p className="text-xs text-blue-500/70 mt-1">학습 완료 후 '다음 회차 시작'을 눌러야 회차가 증가합니다.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">TOTAL</p>
                <p className="text-3xl font-bold">{questions.filter(q => q.year === selectedYear).length}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl text-center">
                <p className="text-[10px] text-red-500 font-bold uppercase mb-1">이번 회차</p>
                <p className="text-3xl font-bold text-red-500">
                  {questions.filter(q => q.year === selectedYear && (q.next_review_session || 1) <= getCurrentSession(selectedYear)).length}
                </p>
              </div>
            </div>
            <button onClick={startStudy} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
              <Brain className="w-5 h-5" /> 학습 시작
            </button>
          </div>
        )}

        {/* ===== STUDY VIEW ===== */}
        {view === 'study' && currentCard && selectedYear && (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-300">
            {/* 헤더: 회차 + 진행 표시 */}
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                <button onClick={handlePrevCard} disabled={currentIndex === 0} className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-700' : 'text-gray-300 hover:bg-gray-800'}`}><ArrowLeft className="w-5 h-5" /></button>
                <div className="text-sm font-bold text-white">
                  <span className="text-blue-400">{getCurrentSession(selectedYear)}회차</span>
                  <span className="mx-2 text-gray-600">|</span>
                  <span className="text-yellow-400">{currentCard.year} {currentCard.question_no > 0 ? `${currentCard.question_no}번` : ''}</span>
                  <span className="mx-2 text-gray-600">|</span>
                  <span>{currentIndex + 1} <span className="text-gray-500">/ {studyQueue.length}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
                <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className="text-sm font-mono font-bold text-blue-400">{formatTime(sessionSeconds)}</span>
              </div>
              <button onClick={() => setView('detail')} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            {/* 문제 카드 */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 md:p-12 lg:p-16 xl:p-16 mb-6 shadow-sm relative min-h-[30vh] md:min-h-[30vh] flex flex-col justify-center max-w-9xl mx-auto w-full"> 
              <div className="absolute top-5 left-5 text-blue-500 font-black text-xl md:text-3xl lg:text-4xl">Q.</div>
              <div className="pl-6 md:pl-16 lg:pl-20">
                <h3 className="text-[18px] md:text-xs lg:text-2xl xl:text-2xl font-medium text-gray-100 leading-relaxed md:leading-snug lg:leading-tight whitespace-pre-wrap break-keep">
                  {currentCard?.question?.replace(/([.?])/g, '$1\n') || "문제를 불러올 수 없습니다."}
                </h3>
              </div>
              
              {currentCard.image_url && (
                <div className="mt-8 border border-gray-700 rounded-lg overflow-hidden bg-white mx-auto w-full lg:max-w-4xl p-2">
                  {renderImages(currentCard.image_url)}
                </div>
              )}
            </div>

            {/* 답안 + 2-Button 평가 */}
            {showAnswer ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col justify-end">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 md:p-8 mb-4">
                  <div className="flex items-center gap-2 mb-2 text-green-400 font-bold text-sm md:text-lg"><CheckCircle className="w-4 h-4" /> 답안</div>
                  <p className="text-[15px] md:text-xl text-gray-200 whitespace-pre-line leading-relaxed mb-4">{currentCard.answer}</p>
                  
                  {currentCard.answer_image_url && (
                    <div className="mt-4 border border-gray-600 rounded-lg overflow-hidden bg-white mx-auto p-2">
                      {renderImages(currentCard.answer_image_url)}
                    </div>
                  )}
                </div>

                {/* ✅ 2-Button 평가 */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => processReview('dontknow')} 
                    className="h-20 md:h-24 rounded-xl font-bold text-xl md:text-2xl border-2 border-red-700 bg-red-900/30 text-red-400 active:scale-95 transition-all hover:bg-red-900/50 flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-2xl">🔴</span>
                    <span>모른다</span>
                    <span className="text-[10px] opacity-60 font-normal">다음 회차 재등장</span>
                  </button>
                  <button 
                    onClick={() => processReview('know')} 
                    className="h-20 md:h-24 rounded-xl font-bold text-xl md:text-2xl border-2 border-blue-700 bg-blue-900/30 text-blue-400 active:scale-95 transition-all hover:bg-blue-900/50 flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-2xl">🔵</span>
                    <span>안다</span>
                    <span className="text-[10px] opacity-60 font-normal">다다음 회차 등장</span>
                  </button>
                </div>
                <p className="text-center text-xs text-gray-600 mt-2">키보드: 1 = 모른다 &nbsp;|&nbsp; 2 = 안다</p>
              </div>
            ) : (
              <div className="mt-auto">
                <button onClick={() => setShowAnswer(true)} className="w-full h-14 md:h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg md:text-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                  답안 확인 <span className="text-sm opacity-60">(Space / Enter / 1 / 2)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== REPORT VIEW (학습 종료창) ===== */}
        {view === 'report' && selectedYear && (
          <div className="space-y-6 animate-in fade-in duration-300 pb-20">
            {/* 완료 헤더 */}
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🎉</div>
              <h1 className="text-2xl font-bold">학습 완료!</h1>
              <p className="text-blue-400 font-bold mt-1">{selectedYear}</p>
              <p className="text-gray-500 text-sm mt-1">
                {getCurrentSession(selectedYear) - 1}회차 종료 → 다음은 {getCurrentSession(selectedYear)}회차
              </p>
            </div>

            {/* 이번 회차 요약 */}
            {(() => {
              const knowCount = reportItems.filter(r => r.result === 'know').length;
              const dontknowCount = reportItems.filter(r => r.result === 'dontknow').length;
              const total = reportItems.length;
              const rate = total > 0 ? Math.round((knowCount / total) * 100) : 0;
              return (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-3">이번 회차 결과</p>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden flex mb-3">
                    <div style={{ width: `${total > 0 ? (dontknowCount/total)*100 : 0}%` }} className="bg-red-500 transition-all" />
                    <div style={{ width: `${total > 0 ? (knowCount/total)*100 : 0}%` }} className="bg-blue-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-3">
                      <p className="text-[10px] text-red-400 font-bold mb-1">🔴 모른다</p>
                      <p className="text-3xl font-black text-red-400">{dontknowCount}</p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-3">
                      <p className="text-[10px] text-blue-400 font-bold mb-1">🔵 안다</p>
                      <p className="text-3xl font-black text-blue-400">{knowCount}</p>
                    </div>
                    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 font-bold mb-1">정답률</p>
                      <p className="text-3xl font-black text-white">{rate}%</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 문제별 결과 테이블 */}
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" /> 문제별 결과
              </h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800/40">
                      <th className="py-2.5 px-4 text-left text-gray-500 font-bold text-xs">문제</th>
                      <th className="py-2.5 px-4 text-center text-gray-500 font-bold text-xs">결과</th>
                      <th className="py-2.5 px-4 text-right text-gray-500 font-bold text-xs">다음 등장</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportItems.map((item, idx) => (
                      <tr key={idx} className={`border-b border-gray-800/50 last:border-0 ${item.result === 'dontknow' ? 'bg-red-950/10' : ''}`}>
                        <td className="py-2.5 px-4 text-gray-300">
                          <span className="font-bold">{item.question_no > 0 ? `${item.question_no}번` : `문제 ${idx + 1}`}</span>
                          <span className="block text-[10px] text-gray-600 truncate max-w-[140px]">
                            {item.question.substring(0, 28)}{item.question.length > 28 ? '...' : ''}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {item.result === 'dontknow'
                            ? <span className="text-red-400 font-bold text-xs bg-red-900/30 px-2 py-1 rounded-full">🔴 모른다</span>
                            : <span className="text-blue-400 font-bold text-xs bg-blue-900/30 px-2 py-1 rounded-full">🔵 안다</span>
                          }
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-yellow-400 text-xs">
                          {item.next_review_session}회차
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 버튼 */}
            <div className="space-y-3">
              <button
                onClick={() => { setView('detail'); }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Brain className="w-5 h-5" /> {getCurrentSession(selectedYear)}회차 바로 시작
              </button>
              <button onClick={handleReportToList} className="w-full py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-sm hover:bg-gray-800 transition-all">
                목록으로 돌아가기
              </button>
            </div>
          </div>
        )}


        {/* ===== STATS VIEW ===== */}
        {view === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-300 pb-20">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setView('list')} className="flex items-center text-gray-400 text-sm hover:text-white">
                <ChevronLeft className="w-4 h-4 mr-1" /> 목록으로
              </button>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold">학습 통계</h1>
            </div>

            {/* 전체 누적 요약 */}
            {(() => {
              // 연도별 회독수 집계: "2024년 1회 [3회차]" 에서 최대 회차 추출
              const yearSessionMax: Record<string, number> = {};
              Object.values(studyLogs).forEach((dayLog: any) => {
                Object.keys(dayLog).forEach(key => {
                  const match = key.match(/^(.+) \[(\d+)회차\]$/);
                  if (match) {
                    const yKey = match[1];
                    const sNum = parseInt(match[2]);
                    if (!yearSessionMax[yKey] || sNum > yearSessionMax[yKey]) {
                      yearSessionMax[yKey] = sNum;
                    }
                  }
                });
              });

              const allEntries = Object.values(studyLogs).flatMap(day => Object.values(day));
              const totalTime = allEntries.reduce((s: number, d: any) => s + (d.totalTime || 0), 0);

              // 총 공부 시간 포맷 (시간:분:초)
              const totalSec = Math.round(totalTime);
              const hh = Math.floor(totalSec / 3600);
              const mm = Math.floor((totalSec % 3600) / 60);
              const ss = totalSec % 60;
              const timeStr = hh > 0
                ? `${hh}시간 ${mm}분 ${ss}초`
                : mm > 0
                ? `${mm}분 ${ss}초`
                : `${ss}초`;

              const sortedYears = Object.entries(yearSessionMax).sort((a, b) => b[0].localeCompare(a[0]));

              return (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                  <p className="text-xs text-gray-500 font-bold uppercase">전체 누적 통계</p>

                  {/* 총 공부 시간 */}
                  <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-bold text-blue-300">총 공부 시간</span>
                    </div>
                    <span className="text-xl font-black text-blue-400">{timeStr}</span>
                  </div>

                  {/* 회차별 회독수 테이블 */}
                  {sortedYears.length === 0 ? (
                    <p className="text-sm text-gray-600 text-center py-2">학습 기록 없음</p>
                  ) : (
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">회차별 회독 현황</p>
                      <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="py-2 px-4 text-left text-gray-600 font-bold text-xs">기출 회차</th>
                              <th className="py-2 px-4 text-right text-gray-600 font-bold text-xs">회독수</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedYears.map(([yearKey, maxSession]) => (
                              <tr key={yearKey} className="border-b border-gray-800/50 last:border-0">
                                <td className="py-2.5 px-4 text-gray-300 font-medium">{yearKey}</td>
                                <td className="py-2.5 px-4 text-right">
                                  <span className="bg-yellow-900/30 border border-yellow-700/40 text-yellow-400 font-black text-xs px-2.5 py-1 rounded-full">
                                    {maxSession}회독
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 날짜 + 연도 + 회차별 상세 */}
            {Object.keys(studyLogs).length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">아직 학습 기록이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-gray-400 uppercase">날짜별 기록</h2>
                {Object.entries(studyLogs).sort((a, b) => b[0].localeCompare(a[0])).map(([date, sessions]) => {
                  // sessions: { "2024년 1회 [1회차]": LogEntry, ... }
                  // 연도키별로 묶기: { "2024년 1회": { "1회차": LogEntry, ... } }
                  const grouped: Record<string, Record<string, any>> = {};
                  Object.entries(sessions).forEach(([key, data]) => {
                    const match = key.match(/^(.+) \[(\d+회차)\]$/);
                    if (match) {
                      const yearPart = match[1];
                      const sessionPart = match[2];
                      if (!grouped[yearPart]) grouped[yearPart] = {};
                      grouped[yearPart][sessionPart] = data;
                    } else {
                      // 구버전 키 (회차 없는 것) 호환
                      if (!grouped[key]) grouped[key] = {};
                      grouped[key]['기록'] = data;
                    }
                  });

                  const dayTotal = Object.values(sessions).reduce((s: number, d: any) => s + (d.total || 0), 0);
                  const dayTime = Object.values(sessions).reduce((s: number, d: any) => s + (d.totalTime || 0), 0);

                  return (
                    <div key={date}>
                      {/* 날짜 헤더 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-white border-l-2 border-blue-500 pl-2">{date}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{formatDuration(dayTime)}</span>
                          <span className="font-bold text-gray-400">{dayTotal}문제</span>
                        </div>
                      </div>

                      {/* 연도별 카드 */}
                      <div className="space-y-3">
                        {Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([yearPart, sessionEntries]) => {
                          const yearTotal = Object.values(sessionEntries).reduce((s: number, d: any) => s + (d.total || 0), 0);
                          const yearKnow = Object.values(sessionEntries).reduce((s: number, d: any) => s + ((d.scores?.know as number) || 0), 0);
                          const yearDontknow = Object.values(sessionEntries).reduce((s: number, d: any) => s + ((d.scores?.dontknow as number) || 0), 0);

                          return (
                            <div key={yearPart} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                              {/* 연도 헤더 */}
                              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-800/60">
                                <span className="text-sm font-black text-blue-300">{yearPart}</span>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-red-400 font-bold">🔴 {yearDontknow}</span>
                                  <span className="text-blue-400 font-bold">🔵 {yearKnow}</span>
                                  <span className="text-gray-400">{yearTotal}문제</span>
                                </div>
                              </div>

                              {/* 회차별 행 */}
                              <div className="divide-y divide-gray-800/50">
                                {Object.entries(sessionEntries)
                                  .sort((a, b) => {
                                    const na = parseInt(a[0]) || 0;
                                    const nb = parseInt(b[0]) || 0;
                                    return na - nb;
                                  })
                                  .map(([sessionLabel, data]: [string, any]) => {
                                    const know = (data.scores?.know as number) || 0;
                                    const dontknow = (data.scores?.dontknow as number) || 0;
                                    const total = data.total || 0;
                                    const rate = total > 0 ? Math.round((know / total) * 100) : 0;
                                    return (
                                      <div key={sessionLabel} className="px-4 py-3">
                                        {/* 회차 레이블 */}
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="text-xs font-black text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-800/40">{sessionLabel}</span>
                                          <div className="flex items-center gap-2">
                                            {data.lastStudyTime && <span className="text-[10px] text-gray-600">{data.lastStudyTime}</span>}
                                            <span className="text-xs font-bold text-white bg-gray-700 px-2 py-0.5 rounded-full">{rate}% 정답</span>
                                          </div>
                                        </div>
                                        {/* 안다/모른다 카드 */}
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-2 text-center">
                                            <p className="text-[9px] text-red-400 font-bold mb-1">🔴 모른다</p>
                                            <p className="text-lg font-black text-red-400">{dontknow}</p>
                                            <p className="text-[9px] text-red-500/60">{total > 0 ? Math.round((dontknow/total)*100) : 0}%</p>
                                          </div>
                                          <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-2 text-center">
                                            <p className="text-[9px] text-blue-400 font-bold mb-1">🔵 안다</p>
                                            <p className="text-lg font-black text-blue-400">{know}</p>
                                            <p className="text-[9px] text-blue-500/60">{rate}%</p>
                                          </div>
                                          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 text-center">
                                            <p className="text-[9px] text-gray-400 font-bold mb-1">📝 합계</p>
                                            <p className="text-lg font-black text-gray-300">{total}</p>
                                            <p className="text-[9px] text-gray-600">{formatDuration(data.totalTime)}</p>
                                          </div>
                                        </div>
                                        {/* 진행바 */}
                                        <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden flex">
                                          <div style={{ width: `${total > 0 ? (dontknow/total)*100 : 0}%` }} className="bg-red-500" />
                                          <div style={{ width: `${total > 0 ? (know/total)*100 : 0}%` }} className="bg-blue-500" />
                                        </div>

                                        {/* 문제 번호별 상세 */}
                                        {data.questionStats && Object.keys(data.questionStats).length > 0 && (
                                          <div className="mt-3">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">문제별 상세</p>
                                            <div className="bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
                                              <table className="w-full text-xs">
                                                <thead>
                                                  <tr className="border-b border-gray-800">
                                                    <th className="py-1.5 px-3 text-left text-gray-600 font-bold">문제</th>
                                                    <th className="py-1.5 px-3 text-center text-red-500 font-bold">🔴 모른다</th>
                                                    <th className="py-1.5 px-3 text-center text-blue-500 font-bold">🔵 안다</th>
                                                    <th className="py-1.5 px-3 text-right text-gray-600 font-bold">합계</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {Object.entries(data.questionStats as Record<string, {know:number,dontknow:number}>)
                                                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                                                    .map(([qNo, qStat]) => {
                                                      const qTotal = qStat.know + qStat.dontknow;
                                                      return (
                                                        <tr key={qNo} className={`border-b border-gray-800/50 last:border-0 ${qStat.dontknow > 0 ? 'bg-red-950/10' : ''}`}>
                                                          <td className="py-1.5 px-3 font-bold text-gray-300">{qNo === '0' ? '-' : `${qNo}번`}</td>
                                                          <td className="py-1.5 px-3 text-center">
                                                            {qStat.dontknow > 0 ? <span className="font-black text-red-400">{qStat.dontknow}회</span> : <span className="text-gray-700">-</span>}
                                                          </td>
                                                          <td className="py-1.5 px-3 text-center">
                                                            {qStat.know > 0 ? <span className="font-black text-blue-400">{qStat.know}회</span> : <span className="text-gray-700">-</span>}
                                                          </td>
                                                          <td className="py-1.5 px-3 text-right text-gray-500">{qTotal}</td>
                                                        </tr>
                                                      );
                                                    })}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== ADD VIEW ===== */}
        {view === 'add' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">새 문제 추가</h2><button onClick={() => setView('list')}><X className="w-6 h-6 text-gray-500" /></button></div>
            <textarea value={newQ} onChange={(e) => setNewQ(e.target.value)} className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white min-h-[100px]" placeholder="문제 내용" />
            <textarea value={newA} onChange={(e) => setNewA(e.target.value)} className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white min-h-[100px]" placeholder="답안 내용" />
            <div className="flex items-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <input value={newAImg} onChange={(e) => setNewAImg(e.target.value)} className="bg-transparent w-full text-white outline-none" placeholder="답안 사진 주소 (예: /images/answers/01.jpg)" />
            </div>
            <button onClick={() => handleAddQuestion()} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> 저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
