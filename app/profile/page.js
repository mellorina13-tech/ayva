'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profileData)

      const { data: listingsData } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setMyListings(listingsData || [])
      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleDelete(id) {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (!error) {
      setMyListings(myListings.filter(l => l.id !== id))
      alert('İlan silindi!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          Yükleniyor...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Profil Bilgileri</h2>
            <button
              onClick={() => router.push('/profile/edit')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Düzenle
            </button>
          </div>
          <div className="space-y-2">
            <p><strong>Ad Soyad:</strong> {profile?.full_name || 'Belirtilmemiş'}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Telefon:</strong> {profile?.phone || 'Belirtilmemiş'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">İlanlarım ({myListings.length})</h2>
          
          {myListings.length === 0 ? (
            <p className="text-gray-600">Henüz ilan oluşturmadınız.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-gray-50 rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
                  <p className="text-sm text-purple-600 mb-2">{listing.category}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-pink-500">
                      ₺{listing.price}{listing.price_type !== 'sabit' ? `/${listing.price_type}` : ''}
                    </span>
                    <span className="text-yellow-500">★ {listing.rating} ({listing.review_count})</span>
                  </div>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}