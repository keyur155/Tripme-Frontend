"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, CheckCircle, MapPin, Clock, Mail } from 'lucide-react';
import PolicyHeader from '@/components/shared/PolicyHeader';
import Footer from '@/components/shared/Footer';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <PolicyHeader />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-[#C45D3E] hover:text-[#A84B32] mb-6 sm:mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#F5E6D3] rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <Package className="text-[#C45D3E] w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              Shipping Policy
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">
              Last Updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-8 text-gray-700 leading-relaxed">

                {/* Intro */}
                <section className="border-l-4 border-[#C45D3E] pl-4 sm:pl-6">
                  <p className="text-base sm:text-lg text-gray-600 mb-4">
                    At <strong>Tripme</strong> ("Tripme", "we", "our", "us"), we operate exclusively as a
                    <strong> digital travel and accommodation marketplace</strong>. We connect guests with hosts
                    offering stays and travel services across India.
                  </p>
                  <p className="text-base sm:text-lg text-gray-600">
                    <strong>Tripme does not sell, manufacture, or ship any physical goods.</strong> This policy
                    explains the nature of our services and how bookings and confirmations are delivered to you.
                  </p>
                </section>

                {/* Section 1 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <span className="w-2 h-2 bg-[#C45D3E] rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    1. No Physical Shipping
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Tripme is a 100% digital platform. All products and services offered through our platform are
                    intangible in nature, including:
                  </p>
                  <ul className="list-none space-y-3 ml-2 sm:ml-4">
                    {[
                      'Accommodation bookings (stays, homestays, villas, hotels)',
                      'Travel service bookings (guides, experiences, activities)',
                      'Digital booking confirmations and invoices',
                      'Electronic receipts and payment records',
                    ].map((item) => (
                      <li key={item} className="flex items-start">
                        <CheckCircle size={16} className="text-[#C45D3E] mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm sm:text-base text-gray-600 mt-4">
                    Since no physical product is shipped, no shipping charges, delivery timelines, or logistics
                    partners are involved in any transaction on Tripme.
                  </p>
                </section>

                {/* Section 2 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <span className="w-2 h-2 bg-[#C45D3E] rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    2. Booking Confirmation Delivery
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Upon successful payment, your booking confirmation is delivered digitally:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-[#FDF8F3] rounded-xl p-4 text-center">
                      <Mail className="text-[#C45D3E] mx-auto mb-2" size={24} />
                      <p className="text-sm font-semibold text-gray-800">Email</p>
                      <p className="text-xs text-gray-500 mt-1">Confirmation sent to your registered email instantly</p>
                    </div>
                    <div className="bg-[#FDF8F3] rounded-xl p-4 text-center">
                      <MapPin className="text-[#C45D3E] mx-auto mb-2" size={24} />
                      <p className="text-sm font-semibold text-gray-800">Dashboard</p>
                      <p className="text-xs text-gray-500 mt-1">Booking details available in your account under My Bookings</p>
                    </div>
                    <div className="bg-[#FDF8F3] rounded-xl p-4 text-center">
                      <Clock className="text-[#C45D3E] mx-auto mb-2" size={24} />
                      <p className="text-sm font-semibold text-gray-800">Instant</p>
                      <p className="text-xs text-gray-500 mt-1">Access your booking confirmation within minutes of payment</p>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <span className="w-2 h-2 bg-[#C45D3E] rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    3. Service Fulfilment
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    The "delivery" of our service is fulfilled at the time and location of your booking — when you
                    check in to your stay or participate in the booked experience. The host is responsible for
                    providing the listed accommodation or service at the agreed dates and location.
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    Tripme acts as a facilitator and marketplace; the actual service is fulfilled directly by the
                    host at the property or venue.
                  </p>
                </section>

                {/* Section 4 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <span className="w-2 h-2 bg-[#C45D3E] rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    4. Cancellations & Refunds
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    For cancellations, refunds, or issues related to your booking, please refer to our{' '}
                    <Link href="/refund-cancellation" className="text-[#C45D3E] hover:text-[#A84B32] font-medium underline underline-offset-2">
                      Refund & Cancellation Policy
                    </Link>
                    . Since all transactions are digital, refunds (where applicable) are processed back to the
                    original payment method and do not involve any physical return of goods.
                  </p>
                </section>

                {/* Section 5 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <span className="w-2 h-2 bg-[#C45D3E] rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    5. Contact Us
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    If you have any questions about this policy or your booking confirmation, our support team is
                    here to help.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-2">
                    <p className="text-sm sm:text-base text-gray-700">
                      <strong>Email:</strong>{' '}
                      <a href="mailto:support@tripmeglobal.com" className="text-[#C45D3E] hover:text-[#A84B32]">
                        support@tripmeglobal.com
                      </a>
                    </p>
                    <p className="text-sm sm:text-base text-gray-700">
                      <strong>Website:</strong>{' '}
                      <Link href="/contact" className="text-[#C45D3E] hover:text-[#A84B32]">
                        tripme.in/contact
                      </Link>
                    </p>
                    <p className="text-sm sm:text-base text-gray-700">
                      <strong>Response Time:</strong> Within 24–48 business hours
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
