'use client';

import { User, Heart, FileText } from 'lucide-react';

export default function MyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-1">山田 太郎</h2>
          <p className="text-gray-600">yamada@example.com</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            無料会員
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <Heart className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="text-3xl font-bold mb-1">8</p>
            <p className="text-sm text-gray-600">お気に入り物件</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <FileText className="w-10 h-10 mx-auto mb-3 text-blue-500" />
            <p className="text-3xl font-bold mb-1">3</p>
            <p className="text-sm text-gray-600">問い合わせ履歴</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <User className="w-10 h-10 mx-auto mb-3 text-green-500" />
            <p className="text-3xl font-bold mb-1">19日</p>
            <p className="text-sm text-gray-600">会員歴</p>
          </div>
        </div>
      </div>
    </div>
  );
}
