import { Hospital, Patient, Department } from './types';
import { StethoscopeIcon, UserGroupIcon, HeartIcon, BrainIcon, PlusIcon, MedicalKitIcon } from './components/ui/Icons';

const MOCK_PATIENTS_INTERNAL: Patient[] = [
  {
    id: 'p001',
    name: 'Nguyễn Văn A',
    age: 58,
    gender: 'Nam',
    avatarUrl: 'https://picsum.photos/seed/patient1/200',
    initialComplaint: 'Cảm thấy mệt và khó thở khi đi bộ.',
    symptoms: ['mệt mỏi', 'khó thở khi gắng sức', 'sưng mắt cá chân', 'ho khan về đêm'],
    correctDiagnosis: 'Suy tim sung huyết',
    isCritical: false,
    systemPromptPersonality: 'lo lắng và hơi cáu kỉnh',
  },
  {
    id: 'p002',
    name: 'Trần Thị B',
    age: 45,
    gender: 'Nữ',
    avatarUrl: 'https://picsum.photos/seed/patient2/200',
    initialComplaint: 'Đau bụng âm ỉ và sụt cân không rõ nguyên nhân.',
    symptoms: ['đau vùng thượng vị', 'sụt cân nhanh', 'chán ăn', 'buồn nôn', 'vàng da nhẹ'],
    correctDiagnosis: 'Loét dạ dày tá tràng',
    isCritical: false,
    systemPromptPersonality: 'bình tĩnh nhưng tỏ ra đau đớn',
  },
];

const MOCK_PATIENTS_PEDIATRICS: Patient[] = [
  {
    id: 'p003',
    name: 'Lê Gia Bảo',
    age: 6,
    gender: 'Nam',
    avatarUrl: 'https://picsum.photos/seed/patient3/200',
    initialComplaint: 'Sốt cao, ho nhiều và chảy nước mũi.',
    symptoms: ['sốt 39°C', 'ho có đờm', 'chảy nước mũi trong', 'biếng ăn', 'quấy khóc'],
    correctDiagnosis: 'Viêm phế quản cấp',
    isCritical: false,
    systemPromptPersonality: 'nhút nhát và chỉ trả lời khi mẹ bé gợi ý',
  },
];

const MOCK_PATIENTS_EMERGENCY: Patient[] = [
    {
      id: 'p004',
      name: 'Phạm Thị C',
      age: 32,
      gender: 'Nữ',
      avatarUrl: 'https://picsum.photos/seed/patient4/200',
      initialComplaint: 'Đau ngực dữ dội, khó thở.',
      symptoms: ['đau thắt ngực trái', 'khó thở', 'đổ mồ hôi', 'chóng mặt'],
      correctDiagnosis: 'Nhồi máu cơ tim cấp',
      isCritical: true,
      statusText: 'Bệnh nhân đang trong tình trạng nguy kịch và không thể giao tiếp. Dấu hiệu sinh tồn không ổn định. Cần chẩn đoán và điều trị khẩn cấp dựa trên các triệu chứng do y tá ghi nhận.',
      systemPromptPersonality: 'Bất tỉnh, không thể giao tiếp.',
    },
];

const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dep01', name: 'Nội khoa', icon: StethoscopeIcon, patients: MOCK_PATIENTS_INTERNAL },
  { id: 'dep02', name: 'Nhi khoa', icon: UserGroupIcon, patients: MOCK_PATIENTS_PEDIATRICS },
  { id: 'dep03', name: 'Cấp cứu', icon: PlusIcon, patients: MOCK_PATIENTS_EMERGENCY },
  { id: 'dep04', name: 'Ngoại khoa', icon: MedicalKitIcon, patients: [] },
  { id: 'dep05', name: 'Thần kinh', icon: BrainIcon, patients: [] },
  { id: 'dep06', name: 'Tim mạch', icon: HeartIcon, patients: [] },
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'h01',
    name: 'Bệnh viện Hy Vọng',
    location: 'Thành phố Neo-Veridia',
    departments: MOCK_DEPARTMENTS,
  },
  {
    id: 'h02',
    name: 'Viện Y học Aurora',
    location: 'Thủ phủ Ánh Sáng',
    departments: MOCK_DEPARTMENTS.slice(0, 4),
  },
  {
    id: 'h03',
    name: 'Trung tâm Y tế Zenith',
    location: 'Quận Thiên Đỉnh',
    departments: MOCK_DEPARTMENTS.slice(1, 5),
  }
];