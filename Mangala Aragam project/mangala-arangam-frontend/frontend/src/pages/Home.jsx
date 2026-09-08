import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCalendarCheck, FaHandshake, FaShieldAlt, FaSearchLocation } from 'react-icons/fa'
import SearchBar from '../components/SearchBar'
import HallCard from '../components/HallCard'
import RatingStars from '../components/RatingStars'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import AnimatedCounter from '../components/AnimatedCounter'
import { halls, popularLocations } from '../data/mockHalls'

const steps = [
  { title: 'Search & Compare', desc: 'Filter mandapams by location, date, guest count and budget.', icon: <FaSearchLocation /> },
  { title: 'Send a Request', desc: 'Pick your date and send a booking request to the hall owner.', icon: <FaCalendarCheck /> },
  { title: 'Owner Confirms', desc: 'The owner accepts your request and the date is locked for you.', icon: <FaHandshake /> },
  { title: 'Pay Securely', desc: 'Complete payment and receive your confirmed booking.', icon: <FaShieldAlt /> },
]

const testimonials = [
  { name: 'Divya & Arjun', location: 'Mylapore', rating: 5, text: 'We compared six halls in an evening and booked Sri Maha Mangala Mandapam within two days. The date-wise calendar made it easy to see what was actually free.' },
  { name: 'Priya & Karthik', location: 'Anna Nagar', rating: 5, text: 'Royal Kalyana Mahal\'s owner responded to our request the same day. Payment and confirmation were both handled on the site.' },
  { name: 'Meena & Suresh', location: 'Velachery', rating: 4, text: 'Good range of budget options. We liked being able to see availability before even calling the hall.' },
]

const stats = [
  { value: 480, suffix: '+', label: 'Halls Listed' },
  { value: 12400, suffix: '+', label: 'Bookings Made' },
  { value: 38, suffix: '', label: 'Cities in Tamil Nadu' },
  { value: 4.7, suffix: '/5', label: 'Average Rating', decimal: true },
]

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-kumkum">
        {/* Animated gradient blobs */}
        <motion.div
          className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-gold/25 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full bg-blush/20 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-kumkum-dark/80 via-kumkum/70 to-ivory" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-24 pb-40 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="uppercase tracking-[0.3em] text-gold-light text-xs sm:text-sm font-semibold mb-5"
          >
            Mangala Arangam &middot; Wedding Halls of Tamil Nadu
          </motion.p>

          <h1 className="font-display text-4xl sm:text-6xl text-ivory leading-[1.1] text-balance">
            {['Find the Perfect Wedding Hall', 'for Your Special Day'].map((line, li) => (
              <motion.span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.7, delay: 0.15 + li * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 text-ivory/75 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Compare mandapams across Chennai by date, budget and guest count — then send a booking request in minutes.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative max-w-5xl mx-auto px-5 sm:px-8 -mt-24"
        >
          <SearchBar variant="hero" />
        </motion.div>
      </section>

      {/* Animated stats strip */}
      <section className="relative bg-ivory pt-14 pb-6">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-3xl sm:text-4xl text-kumkum">
                {s.decimal ? (
                  <>{s.value}{s.suffix}</>
                ) : (
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                )}
              </p>
              <p className="text-xs sm:text-sm text-stone/50 mt-1">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="h-10 sm:h-14" />

      {/* Featured halls */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Handpicked</p>
            <h2 className="font-display text-3xl text-stone">Featured Wedding Halls</h2>
          </div>
          <Link to="/halls" className="hidden sm:inline text-sm font-semibold text-kumkum hover:underline">
            View all halls →
          </Link>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.slice(0, 3).map((h) => (
            <RevealItem key={h.id}>
              <HallCard hall={h} />
            </RevealItem>
          ))}
        </RevealGroup>
        <Link to="/halls" className="sm:hidden mt-6 block text-center text-sm font-semibold text-kumkum">
          View all halls →
        </Link>
      </section>

      <Reveal className="kolam-divider max-w-7xl mx-auto mt-24" />

      {/* Popular locations */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <Reveal className="text-center">
          <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Across the city</p>
          <h2 className="font-display text-3xl text-stone mb-10">Popular Locations</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-5" stagger={0.06}>
          {popularLocations.map((loc) => (
            <RevealItem key={loc.name}>
              <Link to={`/halls?location=${encodeURIComponent(loc.name)}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="group relative rounded-2xl overflow-hidden h-40 shadow-card"
                >
                  <motion.img
                    src={loc.image}
                    alt={loc.name}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone/80 via-stone/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-ivory">
                    <p className="font-display text-lg">{loc.name}</p>
                    <p className="text-xs text-ivory/70">{loc.count} halls</p>
                  </div>
                </motion.div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Why choose us */}
      <section className="bg-parchment py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal className="text-center">
            <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Why Mangala Arangam</p>
            <h2 className="font-display text-3xl text-stone mb-12">Built for How Tamil Weddings Actually Get Planned</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-8" stagger={0.1}>
            {[
              { title: 'Real date-wise availability', desc: 'Every hall shows a live calendar — no calling five venues to find one free date.' },
              { title: 'Verified hall owners', desc: 'Every listing is reviewed and approved before it goes live for booking.' },
              { title: 'One place, start to finish', desc: 'Request, confirmation, payment and reviews all happen on Mangala Arangam.' },
            ].map((item) => (
              <RevealItem key={item.title}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 16px 40px -16px rgba(122,27,61,0.28)' }}
                  className="bg-white rounded-2xl p-7 shadow-card h-full"
                >
                  <h3 className="font-display text-xl text-kumkum mb-2">{item.title}</h3>
                  <p className="text-sm text-stone/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <Reveal className="text-center">
          <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">The process</p>
          <h2 className="font-display text-3xl text-stone mb-14">How It Works</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative" stagger={0.12}>
          {steps.map((s, i) => (
            <RevealItem key={s.title}>
              <div className="relative text-center px-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                  className="w-16 h-16 mx-auto rounded-full bg-kumkum text-gold-light flex items-center justify-center text-xl mb-5 shadow-card"
                >
                  {s.icon}
                </motion.div>
                <h3 className="font-display text-lg text-stone mb-2">{s.title}</h3>
                <p className="text-sm text-stone/55 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full kolam-divider-gold" />
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Reviews */}
      <section className="bg-kumkum py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal className="text-center">
            <p className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em] mb-2">Real weddings</p>
            <h2 className="font-display text-3xl text-ivory mb-12">Customer Reviews</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.1}>
            {testimonials.map((t) => (
              <RevealItem key={t.name}>
                <motion.div whileHover={{ y: -4 }} className="bg-ivory/95 rounded-2xl p-6 shadow-soft h-full">
                  <RatingStars rating={t.rating} />
                  <p className="text-sm text-stone/70 leading-relaxed mt-3">"{t.text}"</p>
                  <p className="font-display text-base text-kumkum mt-4">{t.name}</p>
                  <p className="text-xs text-stone/45">{t.location}</p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <Reveal className="max-w-5xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-stone mb-4 text-balance">
          Ready to find your mandapam?
        </h2>
        <p className="text-stone/55 mb-8 max-w-xl mx-auto">
          Browse verified wedding halls across Chennai and send your first booking request today.
        </p>
        <Link to="/halls">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-8 py-3.5 rounded-full bg-kumkum text-ivory font-semibold shadow-card"
          >
            Explore Halls
          </motion.span>
        </Link>
      </Reveal>
    </div>
  )
}
