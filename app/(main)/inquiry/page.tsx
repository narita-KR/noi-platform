'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Mail, Phone, User } from 'lucide-react';

function InquiryContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  // ダミー物件データ
  const property = {
    id: propertyId || '1',
    title: '東京都大田区 区分マンション',
    price: '5億8,000万円',
    location: '東京都大田区',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 物件情報カード */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">この物件について問い合わせ</h2>
        <div className="flex gap-4">
          <img
            src={property.image}
            alt={property.title}
            className="w-32 h-24 object-cover rounded"
          />
          <div>
            <h3 className="font-bold text-lg mb-2">{property.title}</h3>
            <p className="text-red-600 font-bold text-xl">{property.price}</p>
            <p className="text-gray-600 text-sm">{property.location}</p>
          </div>
        </div>
      </div>

      {/* 問い合わせフォーム */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">お問い合わせフォーム</h2>

        <form className="space-y-6">
          {/* お問い合わせ内容 */}
          <div>
            <label className="block text-sm font-medium mb-3">
              <FileText className="inline w-4 h-4 mr-2" />
              お問い合わせ内容（複数選択可）
            </label>
            <div className="space-y-2">
              {['資料請求', '現地見学希望', '詳細情報希望', '融資相談', 'その他'].map((item) => (
                <label key={item} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ユーザー情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline w-4 h-4 mr-2" />
                お名前 *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="山田 太郎"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                メールアドレス *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                電話番号 *
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="03-1234-5678"
              />
            </div>
          </div>

          {/* メッセージ */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ご質問・ご要望
            </label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ご質問やご要望をご記入ください"
            />
          </div>

          {/* プライバシーポリシー */}
          <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-scroll text-sm text-gray-600">
            <h3 className="font-bold mb-2">個人情報の取り扱いについて</h3>
            <p>
              お客様からご提供いただいた個人情報は、お問い合わせへの回答、資料送付、
              その他当社サービスのご案内のために利用させていただきます...
            </p>
          </div>

          <label className="flex items-center">
            <input type="checkbox" required className="mr-2" />
            <span className="text-sm">個人情報の取り扱いに同意する *</span>
          </label>

          {/* 送信ボタン */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            <Mail className="inline w-5 h-5 mr-2" />
            資料請求
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          ※ は必須項目です。3営業日以内にご連絡いたします。
        </p>
      </div>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">読み込み中...</div>}>
      <InquiryContent />
    </Suspense>
  );
}
