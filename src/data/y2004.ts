// [Fix 1] 'import type'을 사용하여 컴파일러에게 이것이 런타임에 제거될 타입임을 명시합니다.
import type { Question } from '../types/Question';

// [Fix 2] Omit으로 id를 제거하고, 새로운 id 타입(string)과
// 원본 인터페이스에 누락된 'content' 속성을 추가하여 타입을 확장(Extend)합니다.
type QuestionFixed = Omit<Question, 'id'> & {
  id: string;      // string 타입으로 재정의
  content: string; // 누락된 content 속성 추가 (필수)
};

// Partial<QuestionFixed>를 사용하여 모든 필드를 선택적(Optional)으로 만들되,
// 정의된 속성들은 오류 없이 받아들이도록 합니다.
export const data2004: Partial<QuestionFixed>[] = [
  {
    "id": "2004-1-1",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 1회",
    "question_no": 1,
    "content": "아래 그림의 회로에 대해서 각 물음에 답하시오. (1) 시퀀스도로 표시하시오. (2) t1 시간에 서멀 릴레이가 작동하고, t3 시간에서 수동으로 복귀하였다. 이때의 동작을 타임 차트로 표시하시오. [도면 참조]",
    "answer": "1. [시퀀스 도면 참조]\n2. [타임 차트 도면 참조]",
    "image_url": "/images/questions/2004-1-1.png",
    "answer_image_url": "/images/answers/2004-1-1.png"
  },
  {
    "id": "2004-1-2",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 1회",
    "question_no": 2,
    "content": "권상기용 전동기의 출력이 50 [kW]이고 분당 회전속도가 950 [rpm]일 때 그림을 참고하여 물음에 답하시오. 단, 기중기의 기계 효율은 100 [%] 이다. (1) 권상 속도는 몇 [m/min]인가? (2) 권상기의 권상 중량은 몇 [kg]인가? [도면 참조]",
    "answer": "1. 1790.71 [m/min]\n2. 170.88 [kg]",
    "image_url": "/images/questions/2004-1-2.png",
    "answer_image_url": "/images/answers/2004-1-2.png"
  },
  {
    "id": "2004-1-3",
    "subject": "전력공학",
    "year": "2004년 1회",
    "question_no": 3,
    "content": "66 [kV]/6.6 [kV], 6000 [kVA]의 3상 변압기 1대를 설치한 배전 변전소로부터 긍장 1.5 [km]의 1회선 고압 배전 선로에 의해 공급되는 수용가 인입구에서 3상 단락고장이 발생하였다. 선로의 전압강하를 고려하여 다음 물음에 답하시오. 단, 변압기 1상당의 리액턴스는 0.4 [Ω], 배전선 1선당의 저항은 0.9 [Ω/km], 리액턴스는 0.4 [Ω/km]라 하고 기타의 정수는 무시하는 것으로 한다. (1) 1상분의 단락회로를 그리시오. (2) 수용가 인입구에서의 3상 단락 전류를 구하시오. (3) 이 수용가에서 사용하는 차단기로서는 몇 [MVA] 것이 적당하겠는가? [도면 참조]",
    "answer": "1. [단락회로 도면 참조]\n2. 2268.12 [A]\n3. 28.29 [MVA]",
    "image_url": "/images/questions/2004-1-3.png",
    "answer_image_url": "/images/answers/2004-1-3.png"
  },
  {
    "id": "2004-1-4",
    "subject": "전력공학",
    "year": "2004년 1회",
    "question_no": 4,
    "content": "3상 4선식 22.9 [kV] 수변전실 단선 결선도이다. 그림에서 표시된 ①~⑩까지의 명칭을 쓰시오. [도면 참조]",
    "answer": "① 전압계용 전환 개폐기\n② 변류기\n③ 역률계\n④ 전류계용 전환 개폐기\n⑤ 전력 퓨즈\n⑥ 방전 코일\n⑦ 접지형 계기용 변압기\n⑧ 영상 변류기\n⑨ 지락 방향 계전기\n⑩ 지락 과전압 계전기",
    "image_url": "/images/questions/2004-1-4.png",
    "answer_image_url": "/images/answers/2004-1-4.png"
  },
  {
    "id": "2004-1-5",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 1회",
    "question_no": 5,
    "content": "단상 3선식 110/220 [V] 분전반 시설... (4) 분전반의 복선 결선도를 완성하시오. (5) 설비 불평형률은? [도면 참조]",
    "answer": "1. 25 [mm²] 2. 22 [호] 3. 80 [A] 4. [복선 결선도 참조] 5. 17.39 [%]",
    // 스크린샷 확인: 2004-1-5-1.png 존재
    "image_url": ["/images/questions/2004-1-5.png", "/images/questions/2004-1-5-1.png"],
    "answer_image_url": ["/images/answers/2004-1-5.png", "/images/answers/2004-1-5-1.png"]
  },
  {
    "id": "2004-1-6",
    "subject": "전기기기",
    "year": "2004년 1회",
    "question_no": 6,
    "content": "연축전지의 정격 용량 100 [Ah], 상시 부하 5 [kW], 표준전압 100 [V]인 부동 충전 방식이 있다. (1) 부동 충전 방식의 충전기 2차 전류는 몇 [A]인가? (2) 부동 충전 방식의 회로도를 전원, 연축전지, 부하, 충전기 등을 이용하여 간단히 그리시오. (단, 심벌 부근에 명칭을 쓰시오.)",
    "answer": "1. 60 [A]\n2. [회로도 도면 참조]",
    "image_url": "/images/questions/2004-1-6.png",
    "answer_image_url": "/images/answers/2004-1-6.png"
  },
  {
    "id": "2004-1-7",
    "subject": "전력공학",
    "year": "2004년 1회",
    "question_no": 7,
    "content": "전기제품에서의 깜빡거림 현상(플리커 현상)을 경감시키기 위한 전원측과 수용가측에서의 대책을 각각 3가지씩 쓰시오.",
    "answer": "1. [전원측] ① 전용계통으로 공급 ② 공급 전압 승압 ③ 단락 용량이 큰 계통에서 공급\n2. [수용가측] ① 직렬 콘덴서 설치 ② 부스터 설치 ③ 직렬 리액터 설치",
    "image_url": "/images/questions/2004-1-7.png",
    "answer_image_url": "/images/answers/2004-1-7.png"
  },
  {
    "id": "2004-1-8",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 1회",
    "question_no": 8,
    "content": "배선평면도와 주어진 조건을 이용하여 물음에 답하시오...",
    "answer": "1. [기호 참조] 2. ① 2가닥, ② 3가닥, ③ 4가닥 3. 케이블 헤드 4. 4각 박스 25개, 부싱 46개",
    // 스크린샷 확인: 2004-1-8-1.png 존재
    "image_url": ["/images/questions/2004-1-8.png", "/images/questions/2004-1-8-1.png"],
    "answer_image_url": "/images/answers/2004-1-8.png"
  },
  {
    "id": "2004-1-9",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 1회",
    "question_no": 9,
    "content": "가로 8 [m], 세로 18 [m] 사무실 형광등 설치... (3) 소요 등수는 몇 조인가?",
    "answer": "1. 2.5 2. 66 [%] 3. 36 [조]",
    // 스크린샷 확인: 2004-1-9-1.png 존재
    "image_url": ["/images/questions/2004-1-9.png", "/images/questions/2004-1-9-1.png"],
    "answer_image_url": "/images/answers/2004-1-9.png"
  },
  {
    "id": "2004-1-10",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 1회",
    "question_no": 10,
    "content": "일반적인 열음극 형광등과 비교하여 슬림라인(Slim line) 형광등의 장점 5가지와 단점 3가지를 쓰시오.",
    "answer": "1. [장점] ① 기동장치 불필요 ② 순시 점등 ③ 점등 불량 고장 없음 ④ 효율 좋음 ⑤ 수명 단축 없음\n2. [단점] ① 점등 장치 비쌈 ② 전압이 높아 음극 손상 쉬움 ③ 전압이 높아 위험",
    "image_url": "/images/questions/2004-1-10.png",
    "answer_image_url": "/images/answers/2004-1-10.png"
  },
  {
    "id": "2004-1-11",
    "subject": "전력공학",
    "year": "2004년 1회",
    "question_no": 11,
    "content": "피뢰기에 대한 다음 각 물음에 답하시오. (1) 교류용 피뢰기의 구조는 무엇과 무엇으로 구성되어 있는가? (2) 피뢰기의 정격 전압은 어떤 전압을 말하는가? (3) 피뢰기의 제한 전압은 어떤 전압을 말하는가?",
    "answer": "1. 직렬 갭과 특성요소\n2. 속류를 차단할 수 있는 교류 최고전압\n3. 피뢰기 방전 중 피뢰기 단자에 남게 되는 충격전압",
    "image_url": "/images/questions/2004-1-11.png",
    "answer_image_url": "/images/answers/2004-1-11.png"
  },
  {
    "id": "2004-1-12",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 1회",
    "question_no": 12,
    "content": "전동기의 정·역 운전 회로도에 대한 동작 설명과 미완성 도면을 보고 물음에 답하시오. (1) 주회로 부분을 완성하시오. (2) 보조 회로 부분을 완성하시오. 단, MCF/MCR 보조 접점은 a접점 1개, b접점 2개를 사용함. [도면 참조]",
    "answer": "1. [주회로 완성 도면 참조]\n2. [보조회로 완성 도면 참조]",
    "image_url": "/images/questions/2004-1-12.png",
    "answer_image_url": "/images/answers/2004-1-12.png"
  },
  {
    "id": "2004-1-12",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 1회",
    "question_no": 12,
    "content": "전동기의 정·역 운전 주회로와 보조 회로를 완성하시오.",
    "answer": "1. [주회로 도면] 2. [보조회로 도면]",
    "image_url": ["/images/questions/2004-1-12.png", "/images/questions/2004-1-12-1.png"], // 문제 1-12 추가
    "answer_image_url": "/images/answers/2004-1-12.png"
  },
  {
    "id": "2004-1-14",
    "subject": "전력공학",
    "year": "2004년 1회",
    "question_no": 14,
    "content": "역률을 과보상하여 경부하시에 콘덴서가 과대 삽입되는 경우의 결점을 3가지 쓰시오.",
    "answer": "1. 앞선 역률에 의한 전력 손실 발생\n2. 모선 전압의 과상승\n3. 설비 용량이 감소하여 과부하 위험\n4. 고조파 왜곡의 증대",
    "image_url": "/images/questions/2004-1-14.png",
    "answer_image_url": "/images/answers/2004-1-14.png"
  },
  {
    "id": "2004-2-1",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 2회",
    "question_no": 1,
    "content": "조명 설비에 대한 다음 각 물음에 답하시오. (1) 배선 도면에 H400 으로 표현되어 있다. 이것의 의미를 쓰시오. (2) 비상용 조명을 건축기준법에 따른 형광등으로 시설하고자 할 때 그림 기호로 표현하시오. (3) 평면이 15×10 [m]인 사무실에 40 [W], 전광속 2500 [lm]인 형광등을 사용하여 평균 조도를 300 [lx]로 유지하도록 설계할 때 필요한 형광등 수를 산정하시오. (단, 조명률 0.6, 감광보상률 1.3) [도면 참조]",
    "answer": "1. 400 [W] 수은등\n2. [비상용 조명 형광등 기호 참조]\n3. 39 [등]",
    "image_url": "/images/questions/2004-2-1.png",
    "answer_image_url": "/images/answers/2004-2-1.png"
  },
  {
    "id": "2004-2-2",
    "subject": "전기기기",
    "year": "2004년 2회",
    "question_no": 2,
    "content": "변압기의 Δ-Δ 결선 방식의 장점과 단점을 3가지씩 쓰시오.",
    "answer": "장점: 제3고조파 제거 등 / 단점: 중성점 접지 불가 등",
    "image_url": "/images/questions/2004-2-2.png",
    "answer_image_url": ["/images/answers/2004-2-2.png", "/images/answers/2004-2-2-1.png"] // 답변 2-2 추가
  },
  {
    "id": "2004-2-3",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 2회",
    "question_no": 3,
    "content": "인텔리전트 빌딩의 전산시스템 비상전원으로 사용되는 UPS에 대하여 다음 물음에 답하시오. (1) UPS의 우리말 명칭은? (2) AC→DC부와 DC→AC부 변환 부분의 명칭은? (3) 축전지 용량(C)을 구하는 공식과 각 기호의 의미를 쓰시오.",
    "answer": "1. 무정전 전원 공급 장치\n2. AC→DC: 컨버터, DC→AC: 인버터\n3. C = (1/L) × K × I [Ah] (C: 축전지 용량[Ah], L: 보수율, K: 용량환산 시간 계수, I: 방전 전류[A])",
    "image_url": "/images/questions/2004-2-3.png",
    "answer_image_url": "/images/answers/2004-2-3.png"
  },
  {
    "id": "2004-2-4",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 2회",
    "question_no": 4,
    "content": "릴레이 A, B, C를 이용한 유접점 회로와 무접점 회로를 그리시오.",
    "answer": "[도면 참조]",
    "image_url": "/images/questions/2004-2-4.png",
    "answer_image_url": ["/images/answers/2004-2-4.png", "/images/answers/2004-2-4-1.png"] // 답변 2-4 추가
  },
  {
    "id": "2004-2-5",
    "subject": "전력공학",
    "year": "2004년 2회",
    "question_no": 5,
    "content": "66 [kV] 선로 지락사고 시 계전기와 전류계에 흐르는 전류를 구하시오.",
    "answer": "1. 2.12 [A] 2. 5.49 [A] 3. 3.64 [A] 4. 3.64 [A]",
    "image_url": "/images/questions/2004-2-5.png",
    "answer_image_url": ["/images/answers/2004-2-5.png", "/images/answers/2004-2-5-1.png"] // 답변 2-5 추가
  },
  {
    "id": "2004-2-6",
    "subject": "전력공학",
    "year": "2004년 2회",
    "question_no": 6,
    "content": "22.9 [kV-Y] 1000 [kVA] 이하 특고압 간이 수전 설비 표준 결선도를 보고 물음에 답하시오. (1) 도면에서 생략 가능한 것은? (2) 22.9 [kV-Y]용 LA는 어떤 붙임형을 사용해야 하는가? (3) 공동주택 등 사고 시 정전 피해가 큰 경우 인입선은 몇 회선으로 시설하는가? (4) 지중 인입선에 사용하는 케이블 규격은? (5) 22.9 [kV-Y] 계통에서 사용하는 케이블은? (6) 300 [kVA] 이하에서 PF 대신 사용하는 COS의 최소 비대칭 차단 전류 용량 [kA]은? [도면 참조]",
    "answer": "1. LA용 DS\n2. Disconnector 또는 Isolator\n3. 2회선\n4. CNCV-W 케이블(수밀형) 또는 TR CNCV-W 케이블(트리억제형)\n5. CV 케이블\n6. 10 [kA]",
    "image_url": "/images/questions/2004-2-6.png",
    "answer_image_url": "/images/answers/2004-2-6.png"
  },
  {
    "id": "2004-2-7",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 2회",
    "question_no": 7,
    "content": "전동기(M)와 전열기(H)가 접속된 저압 옥내간선에서 간선의 굵기를 결정하는 최소 전류 [A]를 구하시오. (단, 수용률 70% 적용, 전동기: 40A, 30A / 전열기: 10A, 15A, 20A) [도면 참조]",
    "answer": "80.5 [A]",
    "image_url": "/images/questions/2004-2-7.png",
    "answer_image_url": "/images/answers/2004-2-7.png"
  },
  {
    "id": "2004-2-8",
    "subject": "전기기기",
    "year": "2004년 2회",
    "question_no": 8,
    "content": "부하 A, B, C에 공급할 변압기 Tr의 표준 용량을 결정하시오. (단, 부등률 1.1, 역률 80%, 부하설비: A-50kW/80%, B-75kW/85%, C-65kW/75%) [도면 참조]",
    "answer": "200 [kVA] 선정",
    "image_url": "/images/questions/2004-2-8.png",
    "answer_image_url": "/images/answers/2004-2-8.png"
  },
  {
    "id": "2004-2-9",
    "subject": "전력공학",
    "year": "2004년 2회",
    "question_no": 9,
    "content": "3상 3선식 220 [V] 수전회로에 대한 설비불평형률 관련 물음에 답하시오. (1) 3상 3선식 선로의 설비불평형률 한도는? (2) 주어진 그림의 설비불평형률 [%]은? (3) P, Q점에서 단선 시 설비불평형률 [%]은? [도면 참조]",
    "answer": "1. 30 [%] 이하\n2. 34.15 [%]\n3. 60.09 [%]",
    "image_url": "/images/questions/2004-2-9.png",
    "answer_image_url": "/images/answers/2004-2-9.png"
  },
  {
    "id": "2004-2-10",
    "subject": "전력공학",
    "year": "2004년 2회",
    "question_no": 10,
    "content": "고압 선로의 접지사고 검출 및 경보장치에서 A선에 누전사고 발생 시 물음에 답하시오. (1) 1차측 A, B, C선의 대지전압 [V]은? (2) 2차측 전구전압, 전압계 지시 전압, 경보벨 전압 [V]은? [도면 참조]",
    "answer": "1. ① A선: 0 [V], ② B선: 6600 [V], ③ C선: 6600 [V]\n2. ① 전구A: 0 [V], ② 전구B: 110 [V], ③ 전구C: 110 [V], ④ 전압계: 190 [V], ⑤ 경보벨: 190 [V]",
    "image_url": "/images/questions/2004-2-10.png",
    "answer_image_url": "/images/answers/2004-2-10.png"
  },
  {
    "id": "2004-2-11",
    "subject": "전력공학",
    "year": "2004년 2회",
    "question_no": 11,
    "content": "큐비클식 고압 수전반 도면을 보고 물음에 답하시오. (1) ④번 기기의 명칭은? (2) ⑦번 진상용 콘덴서(300kVA)가 수전 설비 용량에 포함되는지 여부와 포함 시 용량은? (3) ⑨번 CH의 명칭은? [도면 참조]",
    "answer": "1. 유입 차단기\n2. 포함되지 않는다\n3. 케이블 헤드",
    "image_url": "/images/questions/2004-2-11.png",
    "answer_image_url": "/images/answers/2004-2-11.png"
  },
  {
    "id": "2004-2-12",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 2회",
    "question_no": 12,
    "content": "아파트 단지의 상정 부하와 수용 부하, 변압기 용량을 산정하시오.",
    "answer": "1. 507,400 [VA] 2. 273,150 [VA] 3. 150 [kVA]",
    "image_url": ["/images/questions/2004-2-12.png", "/images/questions/2004-2-12-1.png"], // 문제 2-12 추가
    "answer_image_url": "/images/answers/2004-2-12.png"
  },
  {
    "id": "2004-2-13",
    "subject": "전기기기",
    "year": "2004년 2회",
    "question_no": 13,
    "content": "비상용 자가 발전기 선정 시 유도 전동기 기동 용량이 1800 [kVA], 허용 전압 강하 20%, 과도 리액턴스 26%일 때 이론상 최소 용량 [kVA]은?",
    "answer": "1872 [kVA]",
    "image_url": "/images/questions/2004-2-13.png",
    "answer_image_url": "/images/answers/2004-2-13.png"
  },
  {
    "id": "2004-2-14",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 2회",
    "question_no": 14,
    "content": "유도 전동기 정·역 운전 단선 결선도를 보고 물음에 답하시오. (1) 3선 결선도를 그리시오. (2) 정·역회전을 위한 조작 회로를 완성하시오. (단, OFF 2개, ON 2개, RL, GL 램프 사용) [도면 참조]",
    "answer": "1. [3선 결선도 도면 참조]\n2. [조작 회로 도면 참조]",
    "image_url": "/images/questions/2004-2-14.png",
    "answer_image_url": "/images/answers/2004-2-14.png"
  },
  {
    "id": "2004-2-15",
    "subject": "전기설비기술기준",
    "year": "2004년 2회",
    "question_no": 15,
    "content": "지중 전선로의 시설에 관한 물음에 답하시오. (1) 지중 전선로 시설 방식 3가지는? (2) 지중 전선로에 사용되는 전선은?",
    "answer": "1. 직접매설식, 관로식, 암거식\n2. 케이블",
    "image_url": "/images/questions/2004-2-15.png",
    "answer_image_url": "/images/answers/2004-2-15.png"
  },
  {
    "id": "2004-3-1",
    "subject": "전기기기",
    "year": "2004년 3회",
    "question_no": 1,
    "content": "단상 유도 전동기에 대한 다음 각 물음에 답하시오. (1) 분상 기동형 단상 유도 전동기의 회전 방향을 바꾸려면 어떻게 하면 되는가? (2) 기동방식에 따른 단상 유도전동기의 종류를 분상 기동형을 제외하고 3가지만 쓰시오. (3) 단상 유도 전동기의 절연을 E종 절연물로 하였을 경우 허용 최고 온도는 몇 $120 [^\\circ \\text{C}]$인가?",
    "answer": "1. 기동권선의 접속을 반대로 바꾸어 준다.\n2. ① 반발 기동형 ② 세이딩 코일형 ③ 콘덴서 기동형\n3. $120 [^\\circ \\text{C}]$",
    "image_url": "/images/questions/2004-3-1.png",
    "answer_image_url": "/images/answers/2004-3-1.png"
  },
  {
    "id": "2004-3-2",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 3회",
    "question_no": 2,
    "content": "단상 2선식 $100 [\\text{V}]$의 옥내배선에서 소비전력 $40 [\\text{W}]$, 역률 $80 [\\%]$의 형광등을 $80$ [등] 설치할 때 이 시설을 $16 [\\text{A}]$의 분기회로로 하려고 한다. 이때 필요한 분기회로는 최소 몇 회선이 필요한가? 단, 한 회로의 부하전류는 분기회로 용량의 $70 [\\%]$로 하고 수용률은 $100 [\\%]$로 한다.",
    "answer": "16 [A] 분기 4회로",
    "image_url": "/images/questions/2004-3-2.png",
    "answer_image_url": "/images/answers/2004-3-2.png"
  },
  {
    "id": "2004-3-3",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 3,
    "content": "도면은 자가용 수전 설비의 복선 결선도이다. 도면을 보고 다음 각 물음에 답하시오. (1) ③과 ④에 그려져야 할 기계 기구의 명칭은 무엇인가? (2) ⑤의 명칭은 무엇인가? (3) ⑥은 단상 변압기 3대를 $\\Delta\\text{-Y}$결선하고 ⑦은 $\\Delta\\text{-}\\Delta$ 결선하여 그리시오. [도면 참조]",
    "answer": "1. ③ 계기용 변압기, ④ 차단기\n2. ⑤ 과전류 계전기\n3. [도면의 Δ-Y 및 Δ-Δ 결선 참조]",
    "image_url": "/images/questions/2004-3-3.png",
    "answer_image_url": "/images/answers/2004-3-3.png"
  },
  {
    "id": "2004-3-4",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 4,
    "content": "그림에서 B점의 차단기 용량을 $100 [\\text{MVA}]$로 제한하기 위한 한류 리액터의 리액턴스는 몇 $[\\%]$인가? 단, $20 [\\text{MVA}]$를 기준으로 한다. [도면 참조]",
    "answer": "10 [%]",
    "image_url": "/images/questions/2004-3-4.png",
    "answer_image_url": "/images/answers/2004-3-4.png"
  },
  {
    "id": "2004-3-5",
    "subject": "전기응용 및 공사재료",
    "year": "2004년 3회",
    "question_no": 5,
    "content": "조명 설비에 대한 다음 각 물음에 답하시오. (1) 배선 도면에 H400 으로 표현되어 있다. 이것의 의미를 쓰시오. (2) 비상용 조명을 건축기준법에 따른 형광등으로 시설하고자 할 때 이것을 일반적인 경우의 그림 기호로 표현하시오. (3) 평면이 $15 \\times 10 [\\text{m}]$인 사무실에 $40 [\\text{W}]$, 전광속 $2500 [\\text{lm}]$인 형광등을 사용하여 평균 조도를 $300 [\\text{lx}]$로 유지하도록 설계하고자 한다. 이 사무실에 필요한 형광등 수를 산정하시오. 단, 조명률은 $0.6$이고, 감광보상률은 $1.3$이다.",
    "answer": "1. 400 [W] 수은등\n2. [비상용 조명 형광등 기호 참조]\n3. 39 [등]",
    "image_url": "/images/questions/2004-3-5.png",
    "answer_image_url": "/images/answers/2004-3-5.png"
  },
  {
    "id": "2004-3-6",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 3회",
    "question_no": 6,
    "content": "그림과 같은 전자 릴레이 회로를 미완성 다이오드매트릭스 회로에 다이오드를 추가시켜 다이오드매트릭스로 바꾸어 그리시오. [도면 참조]",
    "answer": "[완성된 다이오드매트릭스 회로도 참조]",
    "image_url": "/images/questions/2004-3-6.png",
    "answer_image_url": "/images/answers/2004-3-6.png"
  },
  {
    "id": "2004-3-7",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 7,
    "content": "불평형 부하의 제한에 관련된 다음 물음에 답하시오. (1) 저압, 고압 및 특고압 수전의 3상 3선식 또는 3상 4선식에서 설비 불평형률을 몇 $[\\%]$ 이하로 하는 것을 원칙으로 하는가? (2) 제한 원칙에 따르지 않아도 되는 경우를 2가지만 쓰시오. (3) 부하 설비가 그림과 같을 때 설비 불평형률은 몇 $[\\%]$인가? 단, H는 전열기 부하이고, M은 전동기 부하이다. [도면 참조]",
    "answer": "1. 30 [%] 이하\n2. ① 저압 수전에서 전용 변압기 등으로 수전하는 경우 ② 고압 및 특고압 수전에서 $100 [\\text{kVA}]$ 이하의 단상 부하인 경우\n3. 17.03 [%]",
    "image_url": "/images/questions/2004-3-7.png",
    "answer_image_url": "/images/answers/2004-3-7.png"
  },
  {
    "id": "2004-3-8",
    "subject": "회로이론 및 제어공학",
    "year": "2004년 3회",
    "question_no": 8,
    "content": "릴레이 시퀀스도를 논리회로로 바꾸고 타임차트를 완성하시오.",
    "answer": "[도면 및 타임차트 참조]",
    "image_url": "/images/questions/2004-3-8.png",
    "answer_image_url": ["/images/answers/2004-3-8.png", "/images/answers/2004-3-8-1.png"] // 답변 3-8 추가
  },
  {
    "id": "2004-3-9",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 9,
    "content": "과전류 계전기의 동작시험을 하기 위한 시험기의 배치도를 보고 다음 각 물음에 답하시오. (1) 회로도의 기기를 사용하여 동작 시험을 하기 위한 단자 접속을 기입하시오. (2) A, B 및 C에 표시된 기기의 명칭을 기입하시오. (3) 스위치 $S_{2}$를 투입(ON)하고 행하는 시험 명칭과 개방(OFF)하고 행하는 시험 명칭은 무엇인가? [도면 참조]",
    "answer": "1. 1-4, 2-6, 6-9, 6-8, 7-10\n2. Ⓐ 물 저항기 Ⓑ 전류계 Ⓒ 사이클 카운터\n3. $S_{2}$ ON 시: 계전기 한시 동작 특성 시험, $S_{2}$ OFF 시: 계전기 최소 동작 전류 시험",
    "image_url": "/images/questions/2004-3-9.png",
    "answer_image_url": "/images/answers/2004-3-9.png"
  },
  {
    "id": "2004-3-10",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 10,
    "content": "건물의 구내 간선 계통도에서 차단기 규격과 케이블 굵기를 산정하시오.",
    "answer": "1. 237.02 [A] 2. 35 [mm²] 3. 800/800 [A] 4. CV1",
    "image_url": ["/images/questions/2004-3-10.png", "/images/questions/2004-3-10-1.png"], // 문제 3-10 추가
    "answer_image_url": ["/images/answers/2004-3-10.png", "/images/answers/2004-3-10-1.png"] // 답변 3-10 추가
  },
  {
    "id": "2004-3-11",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 11,
    "content": "부하 전력이 $4000 [\\text{kW}]$, 역률 $80 [\\%]$인 부하에 전력용 콘덴서 $1800 [\\text{kVA}]$를 설치하였다. (1) 역률은 몇 $[\\%]$로 개선되었는가? (2) 부하설비의 역률이 낮은 경우 수용가 측면에서 어떤 손해가 있는지 3가지만 쓰시오. (3) 전력용 콘덴서와 함께 설치되는 방전코일과 직렬 리액터의 용도를 간단히 설명하시오.",
    "answer": "1. 95.78 [%]\n2. ① 전력 손실이 커진다 ② 전압 강하가 커진다 ③ 전기 요금이 증가한다\n3. 방전 코일: 콘덴서에 축적된 잔류 전하 방전, 직렬 리액터: 제5고조파 제거",
    "image_url": "/images/questions/2004-3-11.png",
    "answer_image_url": "/images/answers/2004-3-11.png"
  },
  {
    "id": "2004-3-12",
    "subject": "전력공학",
    "year": "2004년 3회",
    "question_no": 12,
    "content": "수용가 A, B, C에 공급하는 배전 선로의 최대 전력이 $450 [\\text{kW}]$일 때 다음 물음에 답하시오. (1) 수용가의 부등률은 얼마인가? (2) 부등률이 크다는 것은 어떤 것을 의미하는가? (3) 수용률의 의미를 간단히 설명하시오. [부하 데이터 참조]",
    "answer": "1. 1.41\n2. 최대 전력을 소비하는 기기의 사용 시간대가 서로 다르다.\n3. 설비 용량에 대한 최대 전력의 비를 백분율로 나타낸 것",
    "image_url": "/images/questions/2004-3-12.png",
    "answer_image_url": "/images/answers/2004-3-12.png"
  },
  {
    "id": "2004-3-13",
    "subject": "전기기기",
    "year": "2004년 3회",
    "question_no": 13,
    "content": "그림의 회로는 $\\text{Y-}\\Delta$ 기동 방식의 주회로 부분이다. (1) 주회로 부분의 미완성 회로에 대한 결선을 완성하시오. (2) $\\text{Y-}\\Delta$ 기동 시와 전전압 기동 시의 기동 전류를 비교 설명하시오. (3) 전동기를 운전할 때 $\\text{Y-}\\Delta$ 기동에 대한 기동 및 운전에 대한 조작 요령을 설명하시오. [도면 참조]",
    "answer": "1. [주회로 완성 결선도 참조]\n2. Y 기동 전류는 전전압 기동 전류의 $1/3$배이다.\n3. Y결선으로 기동한 후 타이머 설정 시간이 지나면 $\\Delta$결선으로 운전한다. 이때 Y와 $\\Delta$는 동시 투입이 되어서는 안 된다.",
    "image_url": "/images/questions/2004-3-13.png",
    "answer_image_url": "/images/answers/2004-3-13.png"
  },
  {
    "id": "2004-3-14",
    "subject": "전기기기",
    "year": "2004년 3회",
    "question_no": 14,
    "content": "우리나라 고속전철 전동기 구동용 인버터에 대하여 다음 각 물음에 답하시오. (1) 전류형 인버터와 전압형 인버터의 회로상의 차이점을 2가지씩 쓰시오. (2) 전류형 인버터와 전압형 인버터의 출력 파형상의 차이점을 설명하시오.",
    "answer": "1. [전류형] ① DC Link 양단에 리액터 사용 ② 인버터부에 SCR 사용 / [전압형] ① 평활용 콘덴서 사용 ② 출력의 맥동을 줄이기 위해 LC 필터 사용\n2. 전류형: 전압-정현파, 전류-구형파 / 전압형: 전압-PWM 구형파, 전류-정현파",
    "image_url": "/images/questions/2004-3-14.png",
    // 답변 3회차 14번: 사진 두 개 구분해서 추가
    "answer_image_url": ["/images/answers/2004-3-14.png", "/images/answers/2004-3-14-1.png"]
  },
  {
    "id": "2004-3-15",
    "subject": "전기기기",
    "year": "2004년 3회",
    "question_no": 15,
    "content": "발전기에 대한 다음 각 물음에 답하시오. (1) 정격전압 $6000 [\\text{V}]$, 용량 $5000 [\\text{kVA}]$인 3상 교류 발전기에서 여자전류 $300 [\\text{A}]$, 무부하 단자전압 $6000 [\\text{V}]$, 단락전류 $700 [\\text{A}]$일 때 단락비는 얼마인가? (2) 단락비가 큰 교류 발전기의 특징을 설명하시오. (3) 비상용 동기발전기의 병렬운전 조건을 4가지 쓰시오.",
    "answer": "1. 1.45\n2. ① 치수가 크고 ② 가격이 높고 ③ 손실이 크고 ④ 효율은 낮고 ⑤ 전압변동률은 적고 ⑥ 안정도는 높다.\n3. 기전력의 ① 크기 ② 위상 ③ 주파수 ④ 파형이 같을 것",
    "image_url": "/images/questions/2004-3-15.png",
    "answer_image_url": "/images/answers/2004-3-15.png"
  }
]