'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState(null)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [showServicesModal, setShowServicesModal] = useState(false)
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const categories = [
    { name: 'Ev & Tadilat', icon: '🏠', description: 'Boya, tadilat, tamirat işleri' },
    { name: 'Temizlik', icon: '🧹', description: 'Ev, ofis, inşaat temizliği' },
    { name: 'Eğitim', icon: '📚', description: 'Özel ders, kurs, koçluk' },
    { name: 'Taşımacılık', icon: '🚚', description: 'Nakliye, taşıma hizmetleri' },
    { name: 'Teknoloji', icon: '💻', description: 'Yazılım, donanım, IT destek' },
    { name: 'Güzellik & Bakım', icon: '💅', description: 'Kuaför, manikür, masaj' },
    { name: 'Teknik Servis', icon: '🔧', description: 'Elektronik tamiri, montaj' },
    { name: 'Etkinlik', icon: '🎉', description: 'Organizasyon, fotoğrafçılık' }
  ]

  const serviceTypes = [
    'Tümü',
    'Ev & Tadilat',
    'Temizlik',
    'Eğitim',
    'Taşımacılık',
    'Teknoloji',
    'Güzellik & Bakım',
    'Teknik Servis',
    'Etkinlik'
  ]

  return (
    <>
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
                A
              </div>
              <span className="text-2xl font-bold">Ayva</span>
            </Link>

            <div className="hidden md:flex gap-6 items-center">
              <button 
                onClick={() => setShowCategoriesModal(true)}
                className="hover:opacity-80 transition font-semibold"
              >
                Kategoriler
              </button>
              <button 
                onClick={() => setShowServicesModal(true)}
                className="hover:opacity-80 transition font-semibold"
              >
                Hizmetler
              </button>
              <button 
                onClick={() => setShowHowItWorksModal(true)}
                className="hover:opacity-80 transition font-semibold"
              >
                Nasıl Çalışır?
              </button>
            </div>

            <div className="flex gap-3 items-center">
              {user ? (
                <>
                  <span className="hidden md:block font-semibold">
                    Hoşgeldin, {user.user_metadata?.full_name || user.email}
                  </span>
                  <Link href="/profile" className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-purple-600 transition font-semibold">
                    Profilim
                  </Link>
                  <Link href="/create-listing" className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:shadow-lg transition font-semibold">
                    İlan Ver
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold">
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:block hover:opacity-80 transition font-semibold">
                    Hesabınız yok mu? Hemen giriş yapın
                  </Link>
                  <Link href="/login" className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-purple-600 transition font-semibold">
                    Giriş Yap
                  </Link>
                  <Link href="/create-listing" className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:shadow-lg transition font-semibold">
                    Ücretsiz İlan Ver
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Kategoriler Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoriesModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Kategoriler</h2>
              <button 
                onClick={() => setShowCategoriesModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6">İhtiyacınız olan hizmet kategorisini seçin</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/?category=${encodeURIComponent(category.name)}`}
                  onClick={() => setShowCategoriesModal(false)}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-300"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hizmetler Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowServicesModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Hizmetler</h2>
              <button 
                onClick={() => setShowServicesModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6">Hizmet türüne göre ilanları filtreleyin</p>
            
            <div className="space-y-3">
              {serviceTypes.map((service) => (
                <Link
                  key={service}
                  href={service === 'Tümü' ? '/' : `/?category=${encodeURIComponent(service)}`}
                  onClick={() => setShowServicesModal(false)}
                  className="block bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 hover:shadow-md transition border-2 border-transparent hover:border-purple-300"
                >
                  <span className="font-semibold text-gray-800 text-lg">
                    {service === 'Tümü' ? '📋 Tüm Hizmetler' : `${categories.find(c => c.name === service)?.icon || '⭐'} ${service}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nasıl Çalışır Modal */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowHowItWorksModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Nasıl Çalışır?</h2>
              <button 
                onClick={() => setShowHowItWorksModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-8">
              <p className="text-lg text-center font-semibold text-gray-800">
                🎉 <span className="text-purple-600">Ayva</span> tamamen <span className="text-pink-600">ÜCRETSİZ</span>dir! 
                Hizmet arayanlarla hizmet sağlayanları buluşturur.
              </p>
            </div>

            <div className="space-y-6">
              {/* Hizmet Arayanlar İçin */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  👤 Hizmet Arayanlar İçin
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">İlan Oluştur</h4>
                      <p className="text-gray-600">İhtiyacınız olan hizmeti (örn: &quot;Evde boya badana yapılacak&quot;) detaylı şekilde anlatın</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Teklifleri Bekle</h4>
                      <p className="text-gray-600">Uzmanlar ilanınızı görüp size teklif gönderecek veya iletişime geçecek</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">En Uygununu Seç</h4>
                      <p className="text-gray-600">Gelen teklifler arasından bütçenize ve ihtiyacınıza en uygun olanı seçin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hizmet Sağlayanlar İçin */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                  🔨 Hizmet Sağlayanlar (Ustalar) İçin
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">İlanları İncele</h4>
                      <p className="text-gray-600">Kategoriler arasından uzmanlık alanınıza uygun ilanları bulun</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Teklif Ver</h4>
                      <p className="text-gray-600">İlan sahibine teklif gönderin veya iletişim bilgilerini alın</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">İşi Üstlen</h4>
                      <p className="text-gray-600">Anlaşma sağlandıktan sonra profesyonel hizmetinizi sunun</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6 text-center">
                <h4 className="text-xl font-bold mb-2">🎯 Hemen Başla!</h4>
                <p className="mb-4">İster hizmet ara, ister hizmet sun - her şey ücretsiz!</p>
                <Link 
                  href="/create-listing"
                  onClick={() => setShowHowItWorksModal(false)}
                  className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:shadow-xl transition"
                >
                  Ücretsiz İlan Ver
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
