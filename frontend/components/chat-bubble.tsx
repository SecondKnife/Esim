"use client";

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Configuration - bạn có thể thay đổi các thông tin này
const CHAT_CONFIG = {
  zalo: {
    enabled: true,
    link: process.env.NEXT_PUBLIC_ZALO_LINK || "https://zalo.me/your-zalo-id",
    phone: process.env.NEXT_PUBLIC_ZALO_PHONE || "0901234567", // Số Zalo
  },
  whatsapp: {
    enabled: true,
    link: process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/84901234567",
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "84901234567", // Số WhatsApp với country code
  },
  phone: {
    enabled: true,
    number: process.env.NEXT_PUBLIC_PHONE_NUMBER || "1900123456", // Số điện thoại để gọi
    display: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "1900 123 456", // Hiển thị
  },
};

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleZaloClick = () => {
    window.open(CHAT_CONFIG.zalo.link, "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open(CHAT_CONFIG.whatsapp.link, "_blank");
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${CHAT_CONFIG.phone.number}`;
  };

  if (!CHAT_CONFIG.zalo.enabled && !CHAT_CONFIG.whatsapp.enabled && !CHAT_CONFIG.phone.enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {/* Chat Options Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 mb-2 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {CHAT_CONFIG.zalo.enabled && (
            <Button
              onClick={handleZaloClick}
              className="bg-[#0068FF] hover:bg-[#0052CC] text-white rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center group relative"
              title="Chat Zalo"
            >
              {/* Zalo Icon */}
              <span className="text-2xl font-extrabold">Z</span>
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat Zalo
              </span>
            </Button>
          )}

          {CHAT_CONFIG.whatsapp.enabled && (
            <Button
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center group relative"
              title="Chat WhatsApp"
            >
              {/* WhatsApp Icon */}
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat WhatsApp
              </span>
            </Button>
          )}

          {CHAT_CONFIG.phone.enabled && (
            <Button
              onClick={handlePhoneClick}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center group relative"
              title={`Gọi ${CHAT_CONFIG.phone.display}`}
            >
              <Phone className="h-6 w-6" />
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Gọi {CHAT_CONFIG.phone.display}
              </span>
            </Button>
          )}
        </div>
      )}

      {/* Main Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-full shadow-2xl h-16 w-16 p-0 flex items-center justify-center relative transition-all duration-300 hover:scale-110"
        aria-label="Mở menu chat"
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse border-2 border-white dark:border-gray-900">
            {[CHAT_CONFIG.zalo.enabled, CHAT_CONFIG.whatsapp.enabled, CHAT_CONFIG.phone.enabled].filter(Boolean).length}
          </span>
        )}
      </Button>
    </div>
  );
};

export default ChatBubble;

