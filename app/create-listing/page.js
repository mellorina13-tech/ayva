'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function CreateListingPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Ev & Tadilat',
    price: '',
    price_type: 'sabit',
    location: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    })
  }, [router])

  const categories = [
    'Ev & Tadilat',
    'Temizlik',
    'Eğitim',
    'Taşımacılık',
    'Teknoloji',
    'Güzellik & Bakım',
    'Teknik Servis',
    'Etkinlik'
  ]

  const priceTypes = [
    { value: 'sabit', label: 'Sabit Fiyat' },
    { value: 'saat', label: 'Saat Başı' },
    { value: 'm²', label: 'Metrekare' },
    { value: 'gün', label: 'Günlük' },
  ]

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            ...formData,
            user_id: user?.id,
            price: parseFloat(formData.price),
          }
        ])

      if (error) throw error

      setMessage('İlan başarıyla oluşturuldu!')
      setTimeout(() => router.push('/'), 2000)
    } catch (error) {
      setMessage('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Yeni İlan Oluştur
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('başarıyla') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Başlık</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Profesyonel Boya Badana"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Açıklama</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Hizmetiniz hakkında detaylı bilgi verin..."
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Fiyat (₺)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Fiyat Tipi</label>
                <select
                  name="price_type"
                  value={formData.price_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {priceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Konum</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Örn: İstanbul, Kadıköy"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Oluşturuluyor...' : 'İlanı Yayınla'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}