import React, { useState, useEffect, useRef } from 'react';
import { DoctorLevel, ChatMessage } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { PaperAirplaneIcon, BrainIcon } from './ui/Icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface CompetencyTestScreenProps {
  onTestPassed: (level: DoctorLevel) => void;
}

const LevelCard: React.FC<{ level: DoctorLevel, onSelect: () => void }> = ({ level, onSelect }) => (
    <Card onClick={onSelect} className="text-center p-8">
        <h3 className="text-xl font-semibold text-indigo-400">{level}</h3>
    </Card>
);


export const CompetencyTestScreen: React.FC<CompetencyTestScreenProps> = ({ onTestPassed }) => {
    const [step, setStep] = useState<'selection' | 'test' | 'result'>('selection');
    const [level, setLevel] = useState<DoctorLevel | null>(null);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [testResult, setTestResult] = useState<'pass' | 'fail' | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (step === 'test' && level && !chatSession) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const systemInstruction = `Bạn là một giám khảo y khoa cao cấp, nghiêm khắc nhưng công bằng. Người dùng là một ứng viên cho vị trí '${level}'. Nhiệm vụ của bạn là hỏi họ chính xác ba câu hỏi y khoa, lần lượt từng câu, phù hợp với cấp bậc họ đã chọn. Sau mỗi câu trả lời, hãy đánh giá ngắn gọn và nói "Đúng." hoặc "Sai.", sau đó ngay lập tức hỏi câu tiếp theo. Không giải thích. Sau khi đánh giá câu trả lời thứ ba, hãy đếm số câu trả lời đúng. Nếu ứng viên trả lời đúng từ hai câu trở lên, câu trả lời cuối cùng của bạn phải chỉ và chính xác là: "ĐẠT: Chúc mừng, bạn đã vượt qua kỳ thi." Nếu họ trả lời đúng ít hơn hai câu, câu trả lời cuối cùng của bạn phải chỉ và chính xác là: "KHÔNG ĐẠT: Rất tiếc, bạn đã không vượt qua. Vui lòng thử lại." Bắt đầu cuộc trò chuyện bằng cách hỏi câu hỏi đầu tiên.`;

                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
                setChatSession(newChat);
                startTest(newChat);
            } catch (error) {
                console.error("Failed to initialize Gemini:", error);
                alert("Không thể khởi tạo AI. Vui lòng kiểm tra API key của bạn.");
                resetTest();
            }
        }
    }, [step, level, chatSession]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSelectLevel = (selectedLevel: DoctorLevel) => {
        setLevel(selectedLevel);
        setStep('test');
    };

    const startTest = async (session: Chat) => {
        setIsLoading(true);
        try {
            const response = await session.sendMessage({ message: "Bắt đầu bài kiểm tra." });
            setChatHistory([{ id: 'start', sender: 'system', text: response.text }]);
        } catch (error) {
            console.error("Error starting test:", error);
            setChatHistory([{ id: 'error', sender: 'system', text: "Đã xảy ra lỗi khi bắt đầu bài kiểm tra. Vui lòng thử lại." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !chatSession) return;

        const newPlayerMessage: ChatMessage = { id: Date.now().toString(), sender: 'player', text: userInput };
        setChatHistory(prev => [...prev, newPlayerMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chatSession.sendMessage({ message: userInput });
            const aiResponseText = response.text;
            
            if (aiResponseText.includes('ĐẠT:')) {
                setTestResult('pass');
                setStep('result');
                const cleanText = aiResponseText.replace('ĐẠT:', '').trim();
                setChatHistory(prev => [...prev, { id: 'result-pass', sender: 'system', text: cleanText }]);
            } else if (aiResponseText.includes('KHÔNG ĐẠT:')) {
                setTestResult('fail');
                setStep('result');
                const cleanText = aiResponseText.replace('KHÔNG ĐẠT:', '').trim();
                setChatHistory(prev => [...prev, { id: 'result-fail', sender: 'system', text: cleanText }]);
            } else {
                const systemResponse: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'system', text: aiResponseText };
                setChatHistory(prev => [...prev, systemResponse]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'system', text: "Tôi xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại." };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetTest = () => {
        setStep('selection');
        setLevel(null);
        setChatSession(null);
        setChatHistory([]);
        setTestResult(null);
        setIsLoading(false);
    }
    
    if (step === 'selection') {
        return (
             <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl mx-auto text-center">
                    <BrainIcon className="w-16 h-16 mx-auto text-indigo-500"/>
                    <h1 className="text-4xl font-bold text-center text-indigo-400 mt-4 mb-2">Bài kiểm tra Năng lực</h1>
                    <p className="text-center text-slate-400 mb-8">Trước khi bắt đầu sự nghiệp, hãy chứng tỏ kiến thức chuyên môn của bạn.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.values(DoctorLevel).map(lvl => (
                           <LevelCard key={lvl} level={lvl} onSelect={() => handleSelectLevel(lvl)} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
                <h2 className="text-xl font-bold border-b border-slate-600 pb-3 mb-4 text-center text-slate-300">Kỳ thi Vấn đáp - Cấp bậc: {level}</h2>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {chatHistory.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'player' ? 'bg-indigo-600 text-white' : 'bg-slate-600 text-slate-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-md p-3 rounded-lg bg-slate-600 text-slate-200">
                            <LoadingSpinner/>
                        </div>
                      </div>
                  )}
                  {step === 'result' && (
                      <div className={`text-center p-4 rounded-md mt-4 ${testResult === 'pass' ? 'bg-green-900/50 border border-green-500 text-green-300' : 'bg-red-900/50 border border-red-500 text-red-300'}`}>
                          <p className="font-bold mb-4">{testResult === 'pass' ? "KẾT QUẢ: ĐẠT" : "KẾT QUẢ: KHÔNG ĐẠT"}</p>
                          {testResult === 'pass' ? (
                                <Button onClick={() => onTestPassed(level!)}>Chọn Bệnh viện</Button>
                          ) : (
                                <Button onClick={resetTest} variant="secondary">Thử lại</Button>
                          )}
                      </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {step === 'test' && (
                    <div className="mt-4 flex items-center space-x-2">
                      <input
                        type="text"
                        className="flex-1 w-full px-4 py-2 border border-slate-600 bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-400"
                        placeholder="Nhập câu trả lời của bạn..."
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <button onClick={handleSendMessage} disabled={isLoading} className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-slate-500">
                        <PaperAirplaneIcon className="w-6 h-6"/>
                      </button>
                    </div>
                )}
            </Card>
        </div>
    );
};