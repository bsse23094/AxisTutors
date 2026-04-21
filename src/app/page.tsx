import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import HomePage from './(public)/page'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  )
}
