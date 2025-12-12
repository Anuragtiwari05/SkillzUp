"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-black text-black mb-6">
          Contact Us
        </h1>

        <p className="text-lg sm:text-xl text-black leading-relaxed mb-4">
          Have questions or need assistance? We’d love to hear from you!
        </p>

        <div className="mt-8 space-y-8">
          {/* Email */}
          <div className="bg-white shadow-md p-5 rounded-xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Email</h2>
            <p className="text-black break-all">support@skillzup.com</p>
          </div>

          {/* Phone */}
          <div className="bg-white shadow-md p-5 rounded-xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Phone</h2>
            <p className="text-black">+91 12345 67890</p>
          </div>

          {/* Address */}
          <div className="bg-white shadow-md p-5 rounded-xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Address</h2>
            <p className="text-black">
              123 SkillzUp Street, Learning City, India
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
