import React, { useState } from 'react';
import { PlayerProfile, Patient, Department } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TrophyIcon, ArrowLeftStartOnRectangleIcon } from './ui/Icons';

interface DepartmentViewProps {
  playerProfile: PlayerProfile;
  onSelectPatient: (patient: Patient) => void;
  onLogout: () => void;
}

const PatientCard: React.FC<{ patient: Patient; onSelect: () => void; }> = ({ patient, onSelect }) => {
  return (
    <Card className="flex items-center space-x-4 bg-slate-800/80 backdrop-blur-sm hover:border-indigo-500">
      <img src={patient.avatarUrl} alt={patient.name} className="w-20 h-20 rounded-full object-cover border-2 border-slate-600" />
      <div className="flex-1">
        <h3 className="font-bold text-lg text-slate-200">{patient.name}, {patient.age} tuổi</h3>
        <p className="text-sm text-slate-400"><strong>Giới tính:</strong> {patient.gender}</p>
        <p className="text-sm text-slate-400 italic mt-1">"{patient.initialComplaint}"</p>
      </div>
      <Button onClick={onSelect}>
        Thăm khám
      </Button>
    </Card>
  );
}

const DepartmentCard: React.FC<{ dept: Department; isEnabled: boolean; onSelect: () => void; }> = ({ dept, isEnabled, onSelect }) => {
    const Icon = dept.icon;
    const cardClasses = isEnabled 
        ? 'cursor-pointer hover:border-indigo-500 hover:bg-slate-700/50' 
        : 'opacity-40 cursor-not-allowed';
    
    return (
        <Card onClick={isEnabled ? onSelect : undefined} className={`text-center transition-all duration-200 ${cardClasses}`}>
            <Icon className="w-12 h-12 mx-auto text-indigo-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-200">{dept.name}</h3>
        </Card>
    );
};


export const DepartmentView: React.FC<DepartmentViewProps> = ({ playerProfile, onSelectPatient, onLogout }) => {
  const { name, level, hospital, department, achievements } = playerProfile;
  const [viewMode, setViewMode] = useState<'departments' | 'patients'>('departments');
  
  const patients = hospital.departments.find(d => d.id === department.id)?.patients || [];

  const renderContent = () => {
    if (viewMode === 'patients') {
      return (
        <div>
           <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-slate-300">Bệnh nhân đang chờ khám</h2>
                <Button variant="secondary" onClick={() => setViewMode('departments')}>
                    Quay lại Sảnh
                </Button>
            </div>
          {patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map(patient => (
                <PatientCard key={patient.id} patient={patient} onSelect={() => onSelectPatient(patient)} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <h3 className="text-xl font-medium text-slate-300">Không có bệnh nhân nào.</h3>
              <p className="text-slate-500 mt-2">Phòng khám hôm nay vắng vẻ.</p>
            </Card>
          )}
        </div>
      );
    }

    return (
        <div>
            <h2 className="text-3xl font-semibold text-slate-300 mb-6 text-center">Các Khoa trong {hospital.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {hospital.departments.map(dept => (
                    <DepartmentCard 
                        key={dept.id}
                        dept={dept}
                        isEnabled={dept.id === department.id}
                        onSelect={() => setViewMode('patients')}
                    />
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-slate-800/50 backdrop-blur-md shadow-xl rounded-xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center border border-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">BS. {name}</h1>
            <p className="text-md text-slate-400">{level} - {department.name}, {hospital.name}</p>
          </div>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
             <div className="flex items-center space-x-2 text-yellow-400">
                <TrophyIcon className="w-6 h-6" />
                <span className="font-bold text-lg">{achievements} Thành tích</span>
            </div>
            <Button onClick={onLogout} variant="secondary" className="flex items-center space-x-2">
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                <span>Đăng xuất</span>
            </Button>
          </div>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};