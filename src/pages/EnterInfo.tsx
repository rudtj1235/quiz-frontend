import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, validateSchool } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const EnterInfo: React.FC = () => {
  const [school, setSchool] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const navigate = useNavigate();

  // 학교 검색 함수
  const handleSchoolSearch = async () => {
    setError('');
    setSearchResults([]);
    setSelectedSchool('');
    if (!school) return;
    const res = await validateSchool(school); // /api/school/search?name=school
    if (res.length === 0) {
      setSearchResults([]);
      setShowModal(true);
    } else {
      setSearchResults(res);
      setShowModal(true);
    }
  };

  // 학교 선택
  const handleSelectSchool = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setSchool(schoolName);
    setShowModal(false);
    setError('');
  };

  // Enter 키로도 검색
  const handleSchoolInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSchoolSearch();
    }
  };

  // 회원가입/문제풀이 진행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedSchool) {
      setError('학교를 먼저 검색하고 선택해 주세요.');
      return;
    }
    const res = await registerUser(selectedSchool, nickname);
    if (res.user && res.user._id) {
      localStorage.setItem('userId', res.user._id);
      localStorage.setItem('school', selectedSchool);
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
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="학교명"
              value={school}
              onChange={e => setSchool(e.target.value)}
              onKeyDown={handleSchoolInputKeyDown}
            />
            <Button type="button" onClick={handleSchoolSearch}>확인</Button>
          </div>
          <Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          {schoolWarning && <div className="text-red-500 text-center text-sm">{schoolWarning}</div>}
          <Button type="submit" className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}} disabled={!selectedSchool}>시작</Button>
        </form>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        {/* 모달/팝업 */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
              {searchResults.length === 0 ? (
                <div className="text-center text-red-500 mb-4">해당하는 학교가 없습니다. 학교명을 확인해 주세요.</div>
              ) : (
                <ul className="mb-4">
                  {searchResults.map((s, i) => (
                    <li key={i} className="mb-2">
                      <Button onClick={() => handleSelectSchool(s)} className="w-full border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>{s}</Button>
                    </li>
                  ))}
                </ul>
              )}
              <Button onClick={() => setShowModal(false)} className="w-full border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>닫기</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterInfo;
