'use client';

import { useState } from 'react';

// 型定義
interface Hotel {
  hotelNo: number;
  hotelName: string;
  hotelThumbnailUrl: string;
  hotelInformationUrl: string;
  reviewAverage: number;
  hotelSpecial: string;
}

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchHotels = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');
    setHotels([]);

    try {
      // 楽天トラベルキーワード検索APIのエンドポイント
      const applicationId = 'b7730ddc-9bb7-4503-acb0-04b2efabb8c7';
      const url = `https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20130426?format=json&applicationId=${applicationId}&keyword=${encodeURIComponent(
        keyword
      )}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.hotels) {
        // 楽天APIのレスポンス構造（hotel[0].hotel[1]...）に合わせてデータを抽出
        const fetchedHotels = data.hotels.map((item: any) => item.hotel[0].hotelBasicInfo);
        setHotels(fetchedHotels);
      } else {
        setError('該当する宿泊施設が見つかりませんでした。');
      }
    } catch (err) {
      console.error(err);
      setError('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>
          ✈️ 楽天トラベル 旅行検索AIアプリ
        </h1>

        {/* 検索フォーム */}
        <form onSubmit={searchHotels} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: 温泉, 札幌, ディズニー など"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </form>

        {/* エラー表示 */}
        {error && <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p>}

        {/* 検索結果一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {hotels.map((hotel) => (
            <div
              key={hotel.hotelNo}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <img
                src={hotel.hotelThumbnailUrl}
                alt={hotel.hotelName}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
                  {hotel.hotelName}
                </h2>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                  ⭐ 評価: {hotel.reviewAverage || '評価なし'}
                </p>
                <a
                  href={hotel.hotelInformationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  詳細・予約を見る &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
