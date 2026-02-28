// src/types/Question.ts

// 1. 원시 데이터 타입 (외부 파일에서 가져올 때)
export interface RawQuestion {
  id?: string | number;
  subject?: string;
  year?: number | string;
  question_no?: number;
  question?: string;
  content?: string;
  answer?: string;
  
  image_url?: string | string[] | null;       // (기존) 문제 이미지
  answer_image_url?: string | string[] | null; // 👈 ✅ [추가] 해설 이미지 (물음표 ? 붙여주세요)
}

// 2. 앱 내부 상태용 타입 (앱에서 사용할 때)
export interface Question {
  id: string | number;
  subject: string;
  year: string;
  question_no: number;
  question: string;
  answer: string;
  
  image_url: string | string[] | null;       // (기존) 문제 이미지
  answer_image_url: string | string[] | null; // 👈 ✅ [추가] 해설 이미지 (여긴 물음표 뺍니다)

  repetition: number;
  interval: number;
  ef: number;
  next_review_date: number;
}