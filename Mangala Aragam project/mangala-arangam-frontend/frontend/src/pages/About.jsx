import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2 text-center">Our Story</p>
        <h1 className="font-display text-4xl text-stone text-center mb-8 text-balance">
          Built for Tamil Weddings, Not Generic Events
        </h1>
      </Reveal>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="arch-frame h-64 mb-10"
      >
        <img
          src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1400&auto=format&fit=crop"
          alt="Wedding mandapam"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <Reveal delay={0.15} className="prose prose-stone max-w-none text-stone/65 leading-relaxed space-y-4">
        <p>
          Mangala Arangam started with a simple frustration: families spending weeks calling hall after
          hall, only to find out on the fourth call that the date they wanted was already taken. We built
          a single place to search mandapams by date, budget and guest count — with a real, hall-owner
          maintained calendar behind every listing.
        </p>
        <p>
          Every hall on the platform is reviewed before it goes live, and every booking request goes
          straight to the owner for a same-window response. From the first search to the final payment,
          the whole process stays in one place.
        </p>
      </Reveal>
    </div>
  )
}
