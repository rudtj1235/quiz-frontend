import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const EnterInfo: React.FC = () => {
  const [school, setSchool] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await registerUser(school, nickname);
    if (res.user && res.user._id) {
      localStorage.setItem('userId', res.user._id);
      localStorage.setItem('school', school);
      navigate('/quiz');
    } else {
      setError(res.message || '등록 실패');
    }
  };

  const isSchoolValid = /[초중고]$/.test(school);
  const schoolWarning = school && !isSchoolValid ? '학교명 뒤에 초/중/고 를 붙여서 입력해주세요.' : '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6 text-center">학교/닉네임 입력</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input type="text" placeholder="학교명" value={school} onChange={e => setSchool(e.target.value)} />
          <Input type="text" placeholder="닉네임" value={nickname} onChange={e => setNickname(e.target.value)} />
          {schoolWarning && <div className="text-red-500 text-center text-sm">{schoolWarning}</div>}
          <Button type="submit" className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}} disabled={!isSchoolValid}>시작</Button>
        </form>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default EnterInfo;
