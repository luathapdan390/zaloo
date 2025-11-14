import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedMessage } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      message: {
        type: Type.STRING,
        description: 'Toàn bộ nội dung tin nhắn Zalo hoàn chỉnh, bắt đầu bằng "Chào {full_name},".'
      }
    },
    required: ['message'],
  },
};

export const generateMessages = async (persona: string, offer: string): Promise<GeneratedMessage[]> => {
  try {
    const prompt = `
      Dựa trên chân dung khách hàng sau: "${persona}"
      Và đây là sản phẩm/giải pháp tôi đang cung cấp: "${offer}"

      Hãy tạo ra 4 thông điệp marketing khác nhau để gửi hàng loạt qua Zalo.
      Mỗi thông điệp phải tuân thủ nghiêm ngặt cấu trúc sau:
      1. Chào hỏi: Bắt đầu bằng "Chào {full_name},"
      2. Nỗi đau: Xác định và đề cập đến một vấn đề hoặc thách thức lớn mà khách hàng này có thể đang đối mặt.
      3. Giải pháp: Giới thiệu một cách thuyết phục giải pháp của bạn ("${offer}") như là câu trả lời cho vấn đề của họ.
      4. Kêu gọi hành động (CTA): Mời họ tham gia một nhóm Zalo, kết bạn, hoặc yêu cầu thêm thông tin.

      Ví dụ mẫu: "Chào {full_name}, là một chủ doanh nghiệp, anh/chị có đang gặp khó khăn trong việc quản lý đội ngũ nhân sự không? Em có một bộ quy trình tinh gọn đã giúp hơn 50 doanh nghiệp tự động hoá vận hành và tăng hiệu suất 200%. Kết bạn Zalo với em để nhận tài liệu miễn phí nhé!"

      Yêu cầu trả về kết quả dưới dạng một mảng JSON hợp lệ theo schema đã cung cấp. Không thêm bất kỳ văn bản nào khác ngoài mảng JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedResponse) || !parsedResponse.every(item => typeof item.message === 'string')) {
       throw new Error("Invalid JSON structure received from API.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error generating messages:", error);
    if (error instanceof Error) {
        if(error.message.includes('JSON')) {
            throw new Error("Đã có lỗi xảy ra khi xử lý dữ liệu từ AI. Vui lòng thử lại.");
        }
        throw new Error(`Lỗi khi gọi API Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred.");
  }
};
