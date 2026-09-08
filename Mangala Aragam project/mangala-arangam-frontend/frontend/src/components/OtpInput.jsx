import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaRedo } from 'react-icons/fa'

export default function OtpInput({ length = 6, onComplete, onResend, resendCooldownSeconds = 30 }) {
  const [digits, setDigits] = useState(Array(length).fill(''))
  const [cooldown, setCooldown] = useState(resendCooldownSeconds)
  const inputRefs = useRef([])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const updateDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return // digits only, one char
    const next = [...digits]
    next[index] = value
    setDigits(next)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    if (next.every((d) => d !== '')) {
      onComplete?.(next.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = Array(length).fill('')
    pasted.split('').forEach((d, i) => (next[i] = d))
    setDigits(next)
    const lastIndex = Math.min(pasted.length, length) - 1
    inputRefs.current[lastIndex]?.focus()
    if (pasted.length === length) onComplete?.(pasted)
  }

  const handleResend = () => {
    if (cooldown > 0) return
    setDigits(Array(length).fill(''))
    inputRefs.current[0]?.focus()
    setCooldown(resendCooldownSeconds)
    onResend?.()
  }

  return (
    <div>
      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileFocus={{ scale: 1.08, borderColor: '#C9962B' }}
            className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-display font-semibold rounded-xl border-2 border-stone/15 text-stone outline-none bg-white"
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
            cooldown > 0 ? 'text-stone/35 cursor-not-allowed' : 'text-kumkum hover:underline'
          }`}
        >
          <FaRedo size={11} />
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}
