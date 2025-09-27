import { ComponentType, SVGProps } from 'react';

export enum GameStage {
  COMPETENCY_TEST = 'COMPETENCY_TEST',
  HOSPITAL_SELECTION = 'HOSPITAL_SELECTION',
  REGISTRATION = 'REGISTRATION',
  DEPARTMENT_VIEW = 'DEPARTMENT_VIEW',
  CONSULTATION = 'CONSULTATION',
}

export enum DoctorLevel {
  INTERN = 'Thực tập sinh',
  RESIDENT = 'Bác sĩ nội trú',
  ATTENDING = 'Bác sĩ chính',
}

export interface PlayerProfile {
  name: string;
  hospital: Hospital;
  department: Department;
  level: DoctorLevel;
  achievements: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  patients: Patient[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  avatarUrl: string;
  initialComplaint: string;
  symptoms: string[];
  correctDiagnosis: string;
  isCritical: boolean;
  statusText?: string;
  systemPromptPersonality: string;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'patient' | 'system';
  text: string;
}