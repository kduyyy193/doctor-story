import React, { useState } from 'react';
import { DoctorLevel, PlayerProfile, Hospital } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface RegistrationScreenProps {
  onRegistrationComplete: (profile: PlayerProfile) => void;
  level: DoctorLevel;
  hospital: Hospital;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegistrationComplete, level, hospital }) => {
  const [name, setName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hospital || !selectedDepartmentId) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const selectedDepartment = hospital.departments.find(d => d.id === selectedDepartmentId);
    if (!selectedDepartment) {
        alert('Khoa không hợp lệ.');
        return;
    }

    onRegistrationComplete({
      name,
      hospital: hospital,
      department: selectedDepartment,
      level: level,
      achievements: 0,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-2">Gia nhập Bệnh viện {hospital.name}</h1>
        <p className="text-center text-slate-400 mb-8">Hoàn thành hồ sơ của bạn để bắt đầu sự nghiệp tại đây.</p>

        <Card className="!p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-600 pb-2">Thông tin Cá nhân</h2>
                <Input
                  id="doctor-name"
                  label="Tên Bác sĩ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ví dụ: BS. Nguyễn Văn An"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Cấp bậc</label>
                  <p className="w-full px-3 py-2 border border-slate-700 bg-slate-900 rounded-md shadow-sm text-indigo-400 font-semibold">{level}</p>
                </div>
              </div>

              {/* Department Selection */}
              <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-600 pb-2">Nơi làm việc</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Bệnh viện</label>
                    <p className="w-full px-3 py-2 border border-slate-700 bg-slate-900 rounded-md shadow-sm text-slate-300">{hospital.name} - {hospital.location}</p>
                  </div>
                  <Select
                      id="department"
                      label="Chọn Khoa Chuyên môn"
                      value={selectedDepartmentId}
                      onChange={(e) => setSelectedDepartmentId(e.target.value)}
                      required
                  >
                      <option value="" disabled>-- Chọn một khoa --</option>
                      {hospital.departments.map(dep => (
                          <option key={dep.id} value={dep.id}>{dep.name}</option>
                      ))}
                  </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 text-center">
              <Button type="submit" className="w-full md:w-1/2 !py-3 !text-lg">
                Bắt đầu sự nghiệp
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};