import Header from '../../components/Header/Header.jsx'
import Hero from '../../components/Hero/Hero.jsx'
import BookSection from '../../components/BookSection/BookSection.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './Home.css'

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BookSection
          id="library"
          title="Library"
          category="Library"
        />
        <BookSection
          id="novels"
          title="Novels"
          category="Novels"
        />
        <BookSection
          id="story-books"
          title="Story Books"
          category="Story Books"
        />
        <BookSection
          id="ielts"
          title="IELTS"
          category="IELTS"
        />
        <BookSection
          id="school-books"
          title="School Books"
          category="School Books"
        />
      </main>
      <Footer />
    </>
  )
}

export default Home