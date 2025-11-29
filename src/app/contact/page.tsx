'use client';

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-black text-black mb-6">Contact Us</h1>
        <p className="text-xl text-black leading-relaxed mb-4">
          Have questions or need assistance? We,d love to hear from you!
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Email</h2>
            <p className="text-black">support@skillzup.com</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Phone</h2>
            <p className="text-black">+91 12345 67890</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Address</h2>
            <p className="text-black">123 SkillzUp Street, Learning City, India</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
