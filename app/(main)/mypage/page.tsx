'use client';

import { User, Heart, FileText, Settings, LogOut } from 'lucide-react';

export default function MyPage() {
  const user = {
    name: '山田 太郎',
    email: 'yamada@example.com',
    memberType: '無料会員',
    favoriteCount: 8,
    inquiryCount: 3,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="text-center pb-4 border-b">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {user.memberType}
              </span>
            </div>

            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2 font-medium">
                <User className="w-4 h-4" />
                基本情報
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                お気に入り物件 ({user.favoriteCount})
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                問い合わせ履歴 ({user.inquiryCount})
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                設定
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2 text-red-600">
                <LogOut className="w-4 h-4" />
                ログアウト
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">お気に入り</p>
                  <p className="text-2xl font-bold">{user.favoriteCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">問い合わせ</p>
                  <p className="text-2xl font-bold">{user.inquiryCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">会員歴</p>
                  <p className="text-lg font-bold">19日</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              最近のお気に入り物件
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200"
                    alt="物件"
                    className="w-32 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">東京都大田区 区分マンション</h3>
                    <p className="text-red-600 font-bold text-lg">5億8,000万円</p>
                    <p className="text-sm text-gray-600">利回り 6.2% | 築15年</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
