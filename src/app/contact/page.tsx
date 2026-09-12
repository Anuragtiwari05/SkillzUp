"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Card from "@/component/ui/Card";
import Reveal from "@/component/ui/Reveal";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const items = [
    {
      icon: Mail,
      title: "Email",
      value: "support@skillzup.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 12345 67890",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 SkillzUp Street, Learning City, India",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <p className="eyebrow text-primary-600 mb-3 text-center sm:text-left">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-neutral-900 mb-6 text-center sm:text-left">
            Contact Us
          </h1>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-10 text-center sm:text-left">
            Have questions or need assistance? We&apos;d love to hear from you!
          </p>
        </Reveal>

        <div className="space-y-6">
          {items.map((item, idx) => (
            <Reveal key={item.title} delay={0.1 + idx * 0.08}>
              <Card hover={false} className="p-6 flex items-center gap-4">
                <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-neutral-900 mb-1">
                    {item.title}
                  </h2>
                  <p className="text-neutral-600 break-all">{item.value}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
