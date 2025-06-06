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

  useEffect(() => {
    generateQuiz().then(res => {
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
    const res = await submitQuiz(userId, solved, totalTime);
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
          <b>{current + 1}번 문제:</b> {questions[current].left} + {questions[current].right} = ?
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
