
import React, { useState, useCallback } from 'react';
import CopyIcon from './icons/CopyIcon';
import { GeneratedMessage } from '../types';

interface MessageCardProps {
  item: GeneratedMessage;
}

const MessageCard: React.FC<MessageCardProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(item.message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [item.message]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative transition-transform hover:scale-[1.02] hover:shadow-lg">
      <p className="text-gray-700 whitespace-pre-wrap">{item.message}</p>
      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
          copied 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-500 hover:bg-brand-blue-light hover:text-brand-blue'
        }`}
        aria-label="Copy message"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <CopyIcon className="h-5 w-5" />
        )}
      </button>
      {copied && (
        <span className="absolute -top-3 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          Đã chép!
        </span>
      )}
    </div>
  );
};

export default MessageCard;
