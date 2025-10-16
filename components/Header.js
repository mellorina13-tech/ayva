'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState(null)
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

  return (
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
            <Link href="/" className="hover:opacity-80 transition">Kategoriler</Link>
            <Link href="/" className="hover:opacity-80 transition">Hizmetler</Link>
            <Link href="/" className="hover:opacity-80 transition">Nasıl Çalışır?</Link>
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
  )
}