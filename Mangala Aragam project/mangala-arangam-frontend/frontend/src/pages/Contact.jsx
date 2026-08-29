import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2 text-center">Get in Touch</p>
        <h1 className="font-display text-4xl text-stone text-center mb-12">Contact Us</h1>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10">
        <RevealGroup className="space-y-6" stagger={0.08} direction="left">
          {[
            { icon: <FaMapMarkerAlt />, title: 'Office', detail: 'Chennai, Tamil Nadu, India' },
            { icon: <FaPhone />, title: 'Phone', detail: '+91 90000 12345' },
            { icon: <FaEnvelope />, title: 'Email', detail: 'hello@mangalaarangam.in' },
          ].map((item) => (
            <RevealItem key={item.title}>
              <motion.div whileHover={{ x: 4 }} className="flex items-start gap-4">
                <motion.span
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  className="w-11 h-11 rounded-full bg-kumkum/10 text-kumkum flex items-center justify-center shrink-0"
                >
                  {item.icon}
                </motion.span>
                <div>
                  <p className="font-display text-lg text-stone">{item.title}</p>
                  <p className="text-sm text-stone/55">{item.detail}</p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal direction="right" delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                  className="font-display text-xl text-kumkum mb-2"
                >
                  Message sent
                </motion.p>
                <p className="text-sm text-stone/55">We'll get back to you within a day.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="space-y-4"
              >
                <input required placeholder="Your Name" className="input" />
                <input required type="email" placeholder="Your Email" className="input" />
                <textarea required placeholder="Message" rows={4} className="input resize-none" />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors"
                >
                  Send Message
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  )
}
