"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { supabase } from "../lib/supabase"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const [isLoading, setIsLoading] = useState(false)
  const [signupCount, setSignupCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // For the fading in
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    // Fetch signup count from Supabase
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('prometheus-waitlist')
        .select('*', { count: 'exact', head: true })
      if (!error && typeof count === 'number') {
        setSignupCount(count)
      }
    }
    fetchCount()
    // Check localStorage for isSubmitted
    if (typeof window !== 'undefined') {
      const submitted = localStorage.getItem('prometheus_waitlist_is_submitted')
      if (submitted === 'true') {
        setIsSubmitted(true)
      }
    }
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.")
      return
    }
    setIsLoading(true)
    // Insert email into Supabase
    const { error } = await supabase
      .from('prometheus-waitlist')
      .insert([{ email }])
    if (!error) {
      setIsSubmitted(true)
      setSignupCount((prev) => prev + 1)
      setEmail("")
      if (typeof window !== 'undefined') {
        localStorage.setItem('prometheus_waitlist_is_submitted', 'true')
      }
    } else {
      alert("Error submitting your email. Please try again later.")
    }
    setIsLoading(false)
  }

  return (
    <div className={`min-h-screen bg-white flex flex-col`}>
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center">
            <img src="/assets/prometheus-icon.png" alt="Prometheus Icon" className="w-10 h-9" />
            <img src="/assets/prometheus-logo.png" alt="Prometheus" className="h-8 ml-3" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`container mx-auto px-4 transition-opacity duration-1000 flex-1 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="max-w-2xl mx-auto text-center pt-16 pb-16">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-black mb-6 leading-tight">
            Build{" "}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              hardware
            </span>{" "}
            projects faster with Prometheus
          </h1>

          {/* New Subtitle */}
          <p className="text-lg font-mono text-gray-800 mb-8 mt-8">The world's first AI Hardware x Software Engineer 🔥</p>

          {/* Signup Count */}
          {/* <p className="text-lg font-mono text-gray-600 mb-12">
            {signupCount > 0 ? `Join ${signupCount.toLocaleString()} users who have signed up` : "Be the first to join the waitlist"}
          </p> */}

          {/* Waitlist Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-14">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 px-4 border border-gray-300 rounded-none font-mono text-base focus:border-black focus:ring-0 focus:outline-none"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 bg-white text-black border-2 border-black rounded-none font-mono font-medium hover:bg-gray-50 focus:ring-0 focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="border-2 border-black p-8">
                <h3 className="text-xl font-mono font-bold text-black mb-2">{"You're on the list!"}</h3>
                <p className="font-mono text-gray-600">{"We'll notify you when Prometheus is ready."}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/assets/prometheus-icon.png" alt="Prometheus Icon" className="w-8 h-7" />
              <img src="/assets/prometheus-logo.png" alt="Prometheus" className="h-7 ml-2" />
            </div>
            <div className="text-sm font-mono text-gray-600">© 2025 Prometheus. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
