import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Result: React.FC = () => {
  const score = localStorage.getItem('score');
  const totalCorrect = localStorage.getItem('totalCorrect');
  const totalTime = localStorage.getItem('totalTime');
  const attempts = localStorage.getItem('attempts');
  const averageScore = localStorage.getItem('averageScore');
  const navigate = useNavigate();

  React.useEffect(() => {
    // 결과 페이지 진입 시 사용자 정보 갱신(도전 횟수, 평균 점수)
    fetch(`http://localhost:5000/api/user/info/${localStorage.getItem('userId')}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          localStorage.setItem('attempts', data.user.attempts);
          localStorage.setItem('averageScore', data.user.averageScore);
        }
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xs flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-bold mb-4">결과/점수</h2>
        <div>정답 개수: {totalCorrect} / 5</div>
        <div>소요 시간: {totalTime ? (Number(totalTime) / 1000).toFixed(2) : 0}초</div>
        <div>최종 점수: {score}</div>
        <div>도전 횟수: {attempts || 1}</div>
        <div>평균 점수: {averageScore ? Number(averageScore).toFixed(2) : score}</div>
        <Button onClick={() => navigate('/')} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>다시하기</Button>
        <Button onClick={() => navigate('/ranking')} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>랭킹보드</Button>
      </div>
    </div>
  );
};

export default Result;
