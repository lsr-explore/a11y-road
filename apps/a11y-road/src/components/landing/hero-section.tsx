'use client';

import Image from 'next/image';
import { A11yDemo } from '../a11y-demo';

export const HeroSection = () => {
  return (
    <section className="relative bg-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1
            data-a11y-name="Hero heading"
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Your Health, Our Priority
          </h1>
          <p data-a11y-name="Hero description" className="mt-4 text-lg text-teal-100 max-w-lg">
            Maple Valley Health provides comprehensive family medicine, preventive care, and
            wellness services for patients of all ages.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <A11yDemo
            instanceId="landing-hero-img-alt"
            label="Hero image"
            fixed={
              <Image
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
                alt="A doctor in a white coat smiling and consulting with a patient in a modern clinic"
                data-a11y-name="Hero image"
                className="rounded-lg shadow-lg max-w-full h-auto"
                width={600}
                height={400}
              />
            }
            broken={
              // @ts-expect-error Intentionally missing alt to demonstrate a11y violation
              <Image
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
                data-a11y-name="Hero image"
                className="rounded-lg shadow-lg max-w-full h-auto"
                width={600}
                height={400}
              />
            }
          />
        </div>
      </div>
    </section>
  );
};
