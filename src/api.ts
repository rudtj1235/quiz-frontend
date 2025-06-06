// .env 파일에 REACT_APP_API_URL=https://quiz-backend-tmna.onrender.com 처럼 설정하세요.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function registerUser(school: string, nickname: string) {
  const res = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ school, nickname })
  });
  return res.json();
}

export async function generateQuiz() {
  const res = await fetch(`${API_URL}/quiz/generate`);
  return res.json();
}

export async function submitQuiz(userId: string, questions: any[], totalTime: number) {
  const res = await fetch(`${API_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questions, totalTime })
  });
  return res.json();
}

export async function getRankingAll() {
  const res = await fetch(`${API_URL}/ranking/all`);
  return res.json();
}

export async function getRankingBySchool(school: string) {
  const res = await fetch(`${API_URL}/ranking/school?school=${encodeURIComponent(school)}`);
  return res.json();
}

export async function getUserInfo(userId: string | null) {
  const res = await fetch(`${API_URL}/user/info/${userId}`);
  return res.json();
}

export async function validateSchool(name: string) {
  const res = await fetch(`${API_URL}/school/search?name=${encodeURIComponent(name)}`);
  return res.json();
}
