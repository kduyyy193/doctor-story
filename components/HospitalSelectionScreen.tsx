import React from 'react';
import { Hospital } from '../types';
import { Card } from './ui/Card';
import { MedicalKitIcon } from './ui/Icons'; // A generic icon for hospitals

interface HospitalSelectionScreenProps {
  hospitals: Hospital[];
  onSelectHospital: (hospital: Hospital) => void;
}

const HospitalServerCard: React.FC<{ hospital: Hospital; onSelect: () => void; }> = ({ hospital, onSelect }) => {
  return (
    <Card onClick={onSelect} className="!p-0 overflow-hidden group">
        <div className="p-6">
            <h3 className="text-2xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">{hospital.name}</h3>
            <p className="text-slate-400">{hospital.location}</p>
        </div>
        <div className="bg-indigo-600/20 px-6 py-3 text-center font-semibold text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            Gia nhập
        </div>
    </Card>
  );
};

export const HospitalSelectionScreen: React.FC<HospitalSelectionScreenProps> = ({ hospitals, onSelectHospital }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        <MedicalKitIcon className="w-16 h-16 mx-auto text-indigo-500" />
        <h1 className="text-4xl font-bold text-center text-indigo-400 mt-4 mb-2">Chọn Bệnh viện</h1>
        <p className="text-center text-slate-400 mb-8">Nơi bạn sẽ bắt đầu hành trình cứu người của mình. Hãy chọn một "server" để gia nhập.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map(hospital => (
            <HospitalServerCard key={hospital.id} hospital={hospital} onSelect={() => onSelectHospital(hospital)} />
          ))}
        </div>
      </div>
    </div>
  );
};