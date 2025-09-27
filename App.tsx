import React, { useState } from 'react';
import { GameStage, PlayerProfile, Patient, DoctorLevel, Hospital } from './types';
import { RegistrationScreen } from './components/RegistrationScreen';
import { DepartmentView } from './components/DepartmentView';
import { ConsultationRoom } from './components/ConsultationRoom';
import { CompetencyTestScreen } from './components/CompetencyTestScreen';
import { HospitalSelectionScreen } from './components/HospitalSelectionScreen';
import { HOSPITALS } from './constants';


const App: React.FC = () => {
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.HOSPITAL_SELECTION);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [doctorLevel, setDoctorLevel] = useState<DoctorLevel | null>(DoctorLevel.INTERN);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const handleTestPassed = (level: DoctorLevel) => {
    setDoctorLevel(level);
    setGameStage(GameStage.HOSPITAL_SELECTION);
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setGameStage(GameStage.REGISTRATION);
  }

  const handleRegistrationComplete = (profile: PlayerProfile) => {
    setPlayerProfile(profile);
    setGameStage(GameStage.DEPARTMENT_VIEW);
  };
  
  const handleLogout = () => {
    setPlayerProfile(null);
    setCurrentPatient(null);
    setDoctorLevel(DoctorLevel.INTERN);
    setSelectedHospital(null);
    setGameStage(GameStage.HOSPITAL_SELECTION);
  };

  const handleSelectPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setGameStage(GameStage.CONSULTATION);
  };

  const handleEndConsultation = (achievementGained: boolean) => {
    if (achievementGained && playerProfile) {
        setPlayerProfile({ ...playerProfile, achievements: playerProfile.achievements + 1 });
    }
    setCurrentPatient(null);
    setGameStage(GameStage.DEPARTMENT_VIEW);
  };

  const handleBackToDepartment = () => {
    setCurrentPatient(null);
    setGameStage(GameStage.DEPARTMENT_VIEW);
  }

  const renderContent = () => {
    switch (gameStage) {
      case GameStage.COMPETENCY_TEST:
        return <CompetencyTestScreen onTestPassed={handleTestPassed} />;
      case GameStage.HOSPITAL_SELECTION:
        return <HospitalSelectionScreen hospitals={HOSPITALS} onSelectHospital={handleHospitalSelect} />
      case GameStage.REGISTRATION:
        if (doctorLevel && selectedHospital) {
          return <RegistrationScreen onRegistrationComplete={handleRegistrationComplete} level={doctorLevel} hospital={selectedHospital} />;
        }
        // Fallback
        setGameStage(GameStage.HOSPITAL_SELECTION);
        return null;
      case GameStage.DEPARTMENT_VIEW:
        if (playerProfile) {
          return <DepartmentView playerProfile={playerProfile} onSelectPatient={handleSelectPatient} onLogout={handleLogout} />;
        }
        // Fallback
        setGameStage(GameStage.HOSPITAL_SELECTION);
        return null;
      case GameStage.CONSULTATION:
        if (playerProfile && currentPatient) {
          return <ConsultationRoom playerProfile={playerProfile} patient={currentPatient} onEndConsultation={handleEndConsultation} onBack={handleBackToDepartment} />;
        }
        // Fallback
        setGameStage(GameStage.DEPARTMENT_VIEW);
        return null;
      default:
        return <HospitalSelectionScreen hospitals={HOSPITALS} onSelectHospital={handleHospitalSelect} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default App;