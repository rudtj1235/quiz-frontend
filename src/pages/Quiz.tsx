import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz, submitQuiz } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface Question {
  left: number;
  right: number;
  answer: number;
  userAnswer?: number;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const generateAdditionQuiz = () => {
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const left = Math.floor(Math.random() * 900) + 100; // 100~999 (3자리)
      const right = Math.floor(Math.random() * 900) + 100; // 100~999 (3자리)
      // 2~3자리수로 제한
      const leftVal = Math.random() < 0.5 ? left : Math.floor(left / 10); // 2자리 또는 3자리
      const rightVal = Math.random() < 0.5 ? right : Math.floor(right / 10); // 2자리 또는 3자리
      questions.push({ left: leftVal, right: rightVal, answer: leftVal + rightVal });
    }
    return questions;
  };

  const generateMultiplicationQuiz = () => {
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const left = Math.floor(Math.random() * 90) + 10; // 10~99 (2자리)
      const right = Math.floor(Math.random() * 9) + 1; // 1~9 (1자리)
      questions.push({ left, right, answer: left * right });
    }
    return questions;
  };

  useEffect(() => {
    const op = localStorage.getItem('operation') || 'addition';
    // 서버에서 operation별 문제 받아오기
    generateQuiz(op).then(res => {
      setQuestions(res.questions);
      setStartTime(Date.now());
    });
  }, []);

  const handleAnswer = () => {
    if (input === '') return;
    const newAnswers = [...answers, Number(input)];
    setAnswers(newAnswers);
    setInput('');
    if (current < 4) {
      setCurrent(current + 1);
    } else {
      setEndTime(Date.now());
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    const userId = localStorage.getItem('userId') || '';
    const solved = questions.map((q, i) => ({ ...q, userAnswer: finalAnswers[i] }));
    const totalTime = (endTime || Date.now()) - startTime;
    const operation = localStorage.getItem('operation') || 'addition';
    const res = await submitQuiz(userId, solved, totalTime, operation);
    localStorage.setItem('score', res.score);
    localStorage.setItem('totalCorrect', res.totalCorrect);
    localStorage.setItem('totalTime', totalTime.toString());
    navigate('/result');
  };

  if (questions.length === 0) return <div>문제 불러오는 중...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xs flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-bold mb-4">문제풀이</h2>
        <div className="mb-2">
          <b>{current + 1}번 문제:</b> {questions[current].left} {localStorage.getItem('operation') === 'multiplication' ? '×' : '+'} {questions[current].right} = ?
        </div>
        <Input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAnswer(); }}
          autoFocus
        />
        <Button onClick={handleAnswer} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>제출</Button>
        <div className="text-gray-500">남은 문제: {5 - current - 1}개</div>
      </div>
    </div>
  );
};

export default Quiz;
