import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, Patient, ChatMessage } from '../types';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { PaperAirplaneIcon, ArrowLeftStartOnRectangleIcon } from './ui/Icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface ConsultationRoomProps {
  playerProfile: PlayerProfile;
  patient: Patient;
  onEndConsultation: (achievementGained: boolean) => void;
  onBack: () => void;
}

export const ConsultationRoom: React.FC<ConsultationRoomProps> = ({ playerProfile, patient, onEndConsultation, onBack }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<'correct' | 'incorrect' | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const systemInstruction = `Bạn là một bệnh nhân tên là ${patient.name}, ${patient.age} tuổi, giới tính ${patient.gender}. Bạn đang nhập vai một người bị ${patient.correctDiagnosis} với các triệu chứng sau: ${patient.symptoms.join(', ')}. Tính cách của bạn là ${patient.systemPromptPersonality}. Người chơi là Bác sĩ ${playerProfile.name}. Tuyệt đối không tiết lộ chẩn đoán của bạn. Chỉ tiết lộ các triệu chứng của bạn một cách tự nhiên khi bác sĩ hỏi các câu hỏi liên quan. Nếu bác sĩ hỏi những câu hỏi không liên quan, hãy tỏ ra bối rối hoặc nói rằng bạn không biết. Giữ câu trả lời của bạn ngắn gọn và tự nhiên, giống như một bệnh nhân thực sự. Bắt đầu bằng cách chào bác sĩ.`;
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChatSession(newChat);
        
        const startChat = async (session: Chat) => {
             setIsLoading(true);
             try {
                const response = await session.sendMessage({ message: "Bác sĩ đã vào phòng." });
                setChatHistory([{ id: 'start', sender: 'patient', text: response.text }]);
            } catch (error) {
                 console.error("Error starting chat:", error);
                 setChatHistory([{ id: 'error', sender: 'system', text: "Đã xảy ra lỗi khi bắt đầu cuộc trò chuyện." }]);
            } finally {
                setIsLoading(false);
            }
        };
        startChat(newChat);

    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
        alert("Không thể khởi tạo AI. Vui lòng kiểm tra API key của bạn.");
    }
  }, [patient, playerProfile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading || !chatSession) return;

    const newPlayerMessage: ChatMessage = { id: Date.now().toString(), sender: 'player', text: userInput };
    setChatHistory(prev => [...prev, newPlayerMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userInput });
      const patientResponse: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'patient', text: response.text };
      setChatHistory(prev => [...prev, patientResponse]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'patient', text: "Tôi xin lỗi, tôi thấy hơi mệt và không thể trả lời ngay bây giờ." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDiagnosisSubmit = () => {
    if(!diagnosis.trim()) return;
    if (diagnosis.toLowerCase().includes(patient.correctDiagnosis.toLowerCase())) {
        setDiagnosisResult('correct');
    } else {
        setDiagnosisResult('incorrect');
    }
  };

  const renderDiagnosisResult = () => {
    if (diagnosisResult === 'correct') {
      return (
        <div className="text-center p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-md">
            <p className="font-bold">Chẩn đoán Đúng!</p>
            <p className="text-sm">Chẩn đoán đúng là: {patient.correctDiagnosis}.</p>
            <Button onClick={() => onEndConsultation(true)} className="mt-4 w-full">Tuyệt vời!</Button>
        </div>
      );
    }
    if (diagnosisResult === 'incorrect') {
      return (
        <div className="text-center p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-md">
            <p className="font-bold">Chẩn đoán Sai!</p>
            <p className="text-sm">Chẩn đoán đúng là: {patient.correctDiagnosis}.</p>
            <Button onClick={() => onEndConsultation(false)} className="mt-4 w-full" variant="secondary">Cố gắng lần sau</Button>
        </div>
      );
    }
    return (
        <Button onClick={handleDiagnosisSubmit} className="w-full">Xác nhận Chẩn đoán</Button>
    );
  };

  if (patient.isCritical) {
      return (
          <div className="h-screen w-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-red-900/30 animate-pulse"></div>
              <div className="z-10 w-full max-w-2xl bg-slate-800/80 backdrop-blur-sm border border-red-500 rounded-xl shadow-2xl p-8 text-center">
                  <h2 className="text-4xl font-bold text-red-400 mb-4 tracking-widest">TÌNH TRẠNG NGUY KỊCH</h2>
                  <img src={patient.avatarUrl} alt={patient.name} className="w-32 h-32 rounded-full mx-auto my-4 object-cover border-4 border-red-500/50" />
                  <p className="font-semibold text-2xl text-slate-200">{patient.name}, {patient.age} tuổi</p>
                  <p className="text-lg text-center text-red-300 mt-4 p-4 bg-red-900/30 rounded-lg">{patient.statusText}</p>
                   <div className="mt-6 space-y-4">
                     <input placeholder="Nhập chẩn đoán khẩn cấp" className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 placeholder:text-slate-400" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} disabled={!!diagnosisResult}/>
                     {renderDiagnosisResult()}
                 </div>
              </div>
          </div>
      );
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-white relative overflow-hidden font-sans">
      {/* HUD / Side Panel */}
      <div className="absolute top-0 left-0 h-full w-96 bg-black/20 backdrop-blur-sm p-6 flex flex-col space-y-4 border-r border-slate-700/50 z-20">
        <h2 className="text-xl font-bold text-slate-200 border-b border-slate-600 pb-3">Hồ sơ Bệnh nhân</h2>
        <div className="text-center">
          <img src={patient.avatarUrl} alt={patient.name} className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-slate-600" />
          <p className="font-semibold text-xl text-slate-200 mt-2">{patient.name}</p>
          <p className="text-slate-400">{patient.age} tuổi - {patient.gender}</p>
        </div>
        <div className="bg-indigo-900/30 rounded-md p-3">
          <p className="text-sm font-semibold text-indigo-300 mb-1">Than phiền ban đầu:</p>
          <p className="text-sm italic text-indigo-300">"{patient.initialComplaint}"</p>
        </div>
        <div className="mt-auto space-y-2">
            <label className="block text-sm font-medium text-slate-300">Chẩn đoán cuối cùng:</label>
            <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} disabled={!!diagnosisResult} rows={2} className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"/>
            {renderDiagnosisResult()}
        </div>
      </div>

      {/* Patient Image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src={patient.avatarUrl} alt={patient.name} className="max-h-[85vh] max-w-[50vw] object-contain opacity-40" />
      </div>
      
      {/* Back Button */}
      <div className="absolute top-4 right-4 z-30">
        <Button variant="secondary" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeftStartOnRectangleIcon className="w-5 h-5"/>
          <span>Rời phòng</span>
        </Button>
      </div>

      {/* Dialogue Box */}
      <div className="absolute bottom-0 left-96 right-0 h-[40%] bg-black/30 backdrop-blur-sm border-t border-slate-700/50 flex flex-col p-6 z-10">
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {chatHistory.map(msg => (
            <div key={msg.id} className="mb-3 text-lg">
              <span className={`font-bold ${msg.sender === 'player' ? 'text-indigo-400' : 'text-green-400'}`}>
                {msg.sender === 'player' ? `BS. ${playerProfile.name}` : patient.name}:
              </span>
              <span className="ml-2 text-slate-300">{msg.text}</span>
            </div>
          ))}
           {isLoading && <LoadingSpinner />}
          <div ref={chatEndRef} />
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 w-full px-4 py-3 border border-slate-600 bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-400"
            placeholder={diagnosisResult ? "Buổi khám đã kết thúc." : "Nhập câu hỏi của bạn..."}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading || !!diagnosisResult}
          />
          <button onClick={handleSendMessage} disabled={isLoading || !!diagnosisResult} className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-slate-500">
            <PaperAirplaneIcon className="w-6 h-6"/>
          </button>
        </div>
      </div>
    </div>
  );
};