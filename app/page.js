'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

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

        {loading ? (
          <p className="text-center">Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
                <p className="text-sm text-purple-600 mb-2">{listing.category}</p>
                <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-500">
                    ₺{listing.price}{listing.price_type !== 'sabit' ? `/${listing.price_type}` : ''}
                  </span>
                  <span className="text-yellow-500">★ {listing.rating} ({listing.review_count})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}