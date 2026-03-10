import { ContactForm } from '../../components/contact/contact-form';

export const metadata = {
  title: 'Contact Us | Maple Valley Health',
  description: 'Get in touch with Maple Valley Health. We are here to help.',
};

export default function ContactPage() {
  return (
    <main className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-600">
          Have a question or need to schedule an appointment? Fill out the form
          below and we&apos;ll get back to you as soon as possible.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
