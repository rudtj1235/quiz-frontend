import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const OperationSelect: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (op: 'addition' | 'multiplication') => {
    localStorage.setItem('operation', op);
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xs flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">연산 선택</h2>
        <Button onClick={() => handleSelect('addition')} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>덧셈</Button>
        <Button onClick={() => handleSelect('multiplication')} className="w-full !text-black border border-gray-300 bg-white hover:bg-gray-100" style={{color: 'black'}}>곱셈</Button>
      </div>
    </div>
  );
};

export default OperationSelect; 