import React, { useState, useCallback } from 'react';
import { generateMessages } from './services/geminiService';
import { GeneratedMessage } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import MessageCard from './components/MessageCard';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [persona, setPersona] = useState<string>('Chủ doanh nghiệp 40 tuổi, đang gặp khó khăn trong việc quản lý nhân sự và tối ưu hoá quy trình.');
  const [offer, setOffer] = useState<string>('Bộ công thức giúp X3 doanh thu và tự động hoá doanh nghiệp');
  const [messages, setMessages] = useState<GeneratedMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!persona.trim() || !offer.trim()) {
      setError('Vui lòng nhập đầy đủ chân dung khách hàng và sản phẩm cung cấp.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      const result = await generateMessages(persona, offer);
      setMessages(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Đã có lỗi không xác định xảy ra.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [persona, offer]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="inline-block bg-brand-blue-light p-3 rounded-full mb-4">
              <SparklesIcon className="w-8 h-8 text-brand-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            AI Tạo Tin Nhắn Zalo
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Nhập chân dung khách hàng mục tiêu, AI sẽ giúp bạn tạo ra những thông điệp marketing cuốn hút và hiệu quả.
          </p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col space-y-4">
            <label htmlFor="persona" className="text-lg font-semibold text-gray-700">
              1. Mô tả chân dung khách hàng
            </label>
            <textarea
              id="persona"
              rows={4}
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Ví dụ: Chủ shop thời trang online, 25-35 tuổi, đang loay hoay tìm nguồn hàng chất lượng..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-shadow"
              disabled={isLoading}
            />

            <label htmlFor="offer" className="text-lg font-semibold text-gray-700">
              2. Sản phẩm/giải pháp bạn cung cấp
            </label>
            <input
              type="text"
              id="offer"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="Ví dụ: Bộ công thức thu hút nguồn lực..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-shadow"
              disabled={isLoading}
            />
            
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full md:w-auto self-end flex items-center justify-center gap-2 bg-brand-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5"/>
                  <span>Tạo tin nhắn</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">3. Kết quả từ AI</h2>
           <p className="text-gray-500 mb-6">Đây là các mẫu tin nhắn được tạo ra. Bạn có thể sao chép và sử dụng ngay!</p>
          
          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Lỗi! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!isLoading && messages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg, index) => (
                <MessageCard key={index} item={msg} />
              ))}
            </div>
          )}
          
          {!isLoading && !error && messages.length === 0 && (
            <div className="text-center py-10 px-6 bg-brand-blue-light rounded-lg border-2 border-dashed border-brand-blue/30">
              <p className="text-brand-blue font-semibold">Kết quả sẽ được hiển thị ở đây. Hãy bắt đầu thôi!</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;