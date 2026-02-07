'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">検索結果</h1>
      <p className="text-gray-600">カテゴリ: {category || 'すべて'}</p>
      <div className="mt-8 bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-500">検索機能は実装中です</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">読み込み中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
