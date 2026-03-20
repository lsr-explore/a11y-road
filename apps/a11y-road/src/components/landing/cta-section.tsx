'use client';

import Link from 'next/link';
import { A11yDemo } from '../a11y-demo';

export const CtaSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Ready to Schedule an Appointment?</h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Our team is here to help. Contact us today to book your visit.
        </p>
        <div className="mt-8">
          <A11yDemo
            instanceId="landing-cta-contrast"
            label="Book appointment button"
            fixed={
              <Link
                href="/contact"
                className="inline-block px-8 py-3 text-lg font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
              >
                Book an Appointment
              </Link>
            }
            broken={
              <Link
                href="/contact"
                className="inline-block px-8 py-3 text-lg font-semibold text-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Book an Appointment
              </Link>
            }
          />
        </div>
      </div>
    </section>
  );
};
