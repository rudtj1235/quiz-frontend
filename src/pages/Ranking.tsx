import React, { useEffect, useState } from 'react';
import { getRankingAll, getRankingBySchool, validateSchool } from '../api';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const getIpPrefix = (ip?: string) => {
  if (!ip) return '';
  if (ip === '::1') return 'localhost';
  const parts = ip.split('.');
  return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : ip;
};

const Ranking: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [school, setSchool] = useState(localStorage.getItem('school') || '');
  const [filter, setFilter] = useState('all');
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolResults, setSchoolResults] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolError, setSchoolError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '';
  const [myRank, setMyRank] = useState<any>(null);

  // 학교명 검색 함수
  const handleSchoolSearch = async () => {
    setSchoolError('');
    setSchoolResults([]);
    setSelectedSchool('');
    if (!schoolSearch) return;
    const data = await validateSchool(schoolSearch);
    if (data.length === 0) {
      setSchoolResults([]);
      setSchoolError('해당 학교의 데이터는 없습니다.');
    } else {
      setSchoolResults(data);
    }
    setShowSchoolModal(false);
  };

  // 학교 선택
  const handleSelectSchool = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setSchool(schoolName);
    setShowSchoolModal(false);
    setSchoolError('');
    setFilter('school');
  };

  useEffect(() => {
    const op = localStorage.getItem('operation') || 'addition';
    if (filter === 'all') {
      getRankingAll(op).then(res => setUsers(res.users));
    } else if (filter === 'school' && school) {
      getRankingBySchool(school, op).then(res => setUsers(res.users));
    }
  }, [filter, school, userId]);

  useEffect(() => {
    // 내 순위 찾기
    if (users && userId) {
      const idx = users.findIndex(u => u._id === userId);
      if (idx !== -1) {
        setMyRank({ ...users[idx], rank: idx + 1 });
      } else {
        setMyRank(null);
      }
    }
  }, [users, userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-bold mb-4 text-black">랭킹! 나의 순위는?</h2>
        <div className="flex gap-2 mb-2">
          <Button onClick={() => setFilter('all')} className="!text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>전체</Button>
          <Button onClick={() => setShowSchoolModal(true)} className="!text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>학교별</Button>
          {filter === 'school' && (
            <span className="ml-2 text-black">{school}</span>
          )}
        </div>
        {/* 학교 검색 모달 */}
        {showSchoolModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={schoolSearch}
                  onChange={e => setSchoolSearch(e.target.value)}
                  placeholder="학교명 입력"
                  className="border rounded px-2 py-1 text-black w-full"
                  onKeyDown={e => { if (e.key === 'Enter') handleSchoolSearch(); }}
                />
                <Button onClick={handleSchoolSearch} className="border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black', minWidth: '60px'}}>확인</Button>
              </div>
              <Button onClick={() => setShowSchoolModal(false)} className="w-full border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>닫기</Button>
            </div>
          </div>
        )}
        {/* 학교 검색 결과 모달 */}
        {schoolResults.length > 0 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
              <div className="font-bold mb-2 text-center">학교를 선택하세요</div>
              <ul className="mb-4 max-h-60 overflow-y-auto">
                {schoolResults.map((s, i) => (
                  <li key={i} className="mb-2">
                    <Button onClick={() => handleSelectSchool(s)} className="w-full border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>{s}</Button>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setSchoolResults([])} className="w-full border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>닫기</Button>
            </div>
          </div>
        )}
        {/* 학교 검색 에러 모달 */}
        {schoolError && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
              <div className="text-red-500 text-center mb-4">{schoolError}</div>
              <Button onClick={() => setSchoolError('')} className="w-full border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>닫기</Button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border text-sm text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1">순위</th>
                <th className="px-2 py-1">학교</th>
                <th className="px-2 py-1">닉네임(IP)</th>
                <th className="px-2 py-1">맞은 개수</th>
                <th className="px-2 py-1">시간(초)</th>
                <th className="px-2 py-1">점수</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((u, i) => (
                <tr key={u._id} className={u._id === userId ? 'font-bold bg-yellow-50' : ''}>
                  <td className="px-2 py-1 text-center">{i + 1}</td>
                  <td className="px-2 py-1">{u.school}</td>
                  <td className="px-2 py-1">{u.nickname}{u.ip ? ` (${getIpPrefix(u.ip)})` : ''}</td>
                  <td className="px-2 py-1 text-center">{u.totalCorrect ?? '-'}</td>
                  <td className="px-2 py-1 text-center">{(u.time / 1000).toFixed(2)}</td>
                  <td className="px-2 py-1 text-center">{Number(u.score).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 내 순위 별도 표시 */}
        {myRank && myRank.rank > 10 && (
          <div className="w-full mt-4 p-4 border-t border-gray-300">
            <div className="font-bold mb-2">내 순위</div>
            <table className="min-w-full border text-sm text-black">
              <tbody>
                <tr className="font-bold bg-yellow-50">
                  <td className="px-2 py-1 text-center">{myRank.rank}</td>
                  <td className="px-2 py-1">{myRank.school}</td>
                  <td className="px-2 py-1">{myRank.nickname}{myRank.ip ? ` (${getIpPrefix(myRank.ip)})` : ''}</td>
                  <td className="px-2 py-1 text-center">{myRank.totalCorrect ?? '-'}</td>
                  <td className="px-2 py-1 text-center">{(myRank.time / 1000).toFixed(2)}</td>
                  <td className="px-2 py-1 text-center">{Number(myRank.score).toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {/* 조건부 버튼 렌더링 */}
        {userId ? (
          <div className="flex gap-2 w-full mt-4">
            <Button onClick={() => navigate('/quiz')} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>
              재도전
            </Button>
            <Button onClick={() => navigate('/operation-select')} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>
              곱셈/덧셈 선택 창
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/')} className="w-full mt-4 !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>
            문제 풀기
          </Button>
        )}
      </div>
    </div>
  );
};
export default Ranking;