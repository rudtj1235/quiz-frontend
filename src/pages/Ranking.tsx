import React, { useEffect, useState } from 'react';
import { getRankingAll, getRankingBySchool } from '../api';
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
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    if (filter === 'all') {
      getRankingAll().then(res => setUsers(res.users));
    } else {
      getRankingBySchool(school).then(res => setUsers(res.users));
    }
  }, [filter, school, userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-bold mb-4 text-black">실시간 랭킹보드</h2>
        <div className="flex gap-2 mb-2">
          <Button onClick={() => setFilter('all')} className="!text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>전체</Button>
          <Button onClick={() => setFilter('school')} className="!text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>학교별</Button>
          {filter === 'school' && (
            <input
              type="text"
              value={school}
              onChange={e => setSchool(e.target.value)}
              placeholder="학교명 입력"
              className="border rounded px-2 py-1 ml-2 text-black"
            />
          )}
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border text-sm text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1">순위</th>
                <th className="px-2 py-1">학교</th>
                <th className="px-2 py-1">닉네임(IP)</th>
                <th className="px-2 py-1">점수</th>
                <th className="px-2 py-1">시간(초)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} className={u._id === userId ? 'font-bold bg-yellow-50' : ''}>
                  <td className="px-2 py-1 text-center">{i + 1}</td>
                  <td className="px-2 py-1">{u.school}</td>
                  <td className="px-2 py-1">{u.nickname}{u.ip ? ` (${getIpPrefix(u.ip)})` : ''}</td>
                  <td className="px-2 py-1 text-center">{u.score}</td>
                  <td className="px-2 py-1 text-center">{(u.time / 1000).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 조건부 버튼 렌더링 */}
        {userId ? (
          <Button onClick={() => navigate('/quiz')} className="w-full mt-4 !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>
            문제 다시 풀기
          </Button>
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
