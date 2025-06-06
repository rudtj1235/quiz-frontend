const API_URL = 'http://localhost:5000/api';

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
