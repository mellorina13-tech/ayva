'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredListings, setFilteredListings] = useState([])
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')

  useEffect(() => {
    async function getListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Hata:', error)
      } else {
        setListings(data)
      }
      setLoading(false)
    }
    
    getListings()
  }, [])

  useEffect(() => {
    if (categoryFilter && categoryFilter !== 'Tümü') {
      setFilteredListings(listings.filter(listing => listing.category === categoryFilter))
    } else {
      setFilteredListings(listings)
    }
  }, [categoryFilter, listings])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-4">
          İhtiyacınız olan hizmeti bulun
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Binlerce güvenilir hizmet sağlayıcısı arasından size en uygun olanı seçin
        </p>

        {categoryFilter && (
          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-6 flex justify-between items-center">
            <span className="text-purple-800 font-semibold">
              📂 Filtrelenen Kategori: <span className="text-purple-900 font-bold">{categoryFilter}</span>
            </span>
            <a 
              href="/"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Filtreyi Kaldır
            </a>
          </div>
        )}

        {loading ? (
          <p className="text-center">Yükleniyor...</p>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {categoryFilter ? `${categoryFilter} kategorisinde henüz ilan yok` : 'Henüz ilan yok'}
            </h3>
            <p className="text-gray-600 mb-6">İlk ilanı siz oluşturun!</p>
            <a 
              href="/create-listing"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition"
            >
              Ücretsiz İlan Ver
            </a>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 text-center">
              Toplam <span className="font-bold text-purple-600">{filteredListings.length}</span> ilan bulundu
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
                  <p className="text-sm text-purple-600 mb-2">{listing.category}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-500">
                      ₺{listing.price}{listing.price_type !== 'sabit' ? `/${listing.price_type}` : ''}
                    </span>
                    <span className="text-gray-500 text-sm">📍 {listing.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
