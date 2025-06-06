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

export async function generateQuiz(operation?: string) {
  const op = operation || localStorage.getItem('operation') || 'addition';
  const res = await fetch(`${API_URL}/quiz/generate?operation=${op}`);
  return res.json();
}

export async function submitQuiz(userId: string, questions: any[], totalTime: number, operation: string) {
  const res = await fetch(`${API_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questions, totalTime, operation })
  });
  return res.json();
}

export async function getRankingAll(operation?: string) {
  const op = operation || localStorage.getItem('operation') || 'addition';
  const res = await fetch(`${API_URL}/ranking/all?operation=${op}`);
  return res.json();
}

export async function getRankingBySchool(school: string, operation?: string) {
  const op = operation || localStorage.getItem('operation') || 'addition';
  const res = await fetch(`${API_URL}/ranking/school?school=${encodeURIComponent(school)}&operation=${op}`);
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
