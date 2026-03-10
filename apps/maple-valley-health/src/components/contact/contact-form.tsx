'use client';

import { useState } from 'react';
import { useA11yMode } from '../providers/a11y-mode-provider';
import { A11yDemo } from '../a11y-demo';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const { isAccessible } = useA11yMode();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newErrors: FormErrors = {};

    if (!formData.get('name')) newErrors.name = 'Name is required';
    if (!formData.get('email')) newErrors.email = 'Email is required';
    if (!formData.get('message')) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-medium">
          Thank you! Your message has been sent. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  if (isAccessible) {
    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <A11yDemo instanceId="contact-form-labels">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <A11yDemo instanceId="contact-focus-indicator">
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={errors.name ? true : undefined}
            />
          </A11yDemo>
          {errors.name && (
            <A11yDemo instanceId="contact-error-announcement">
              <p
                id="name-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.name}
              </p>
            </A11yDemo>
          )}
        </A11yDemo>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={errors.email ? true : undefined}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
            aria-describedby={errors.message ? 'message-error' : undefined}
            aria-invalid={errors.message ? true : undefined}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"
        >
          Send Message
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <A11yDemo instanceId="contact-form-labels">
        <A11yDemo instanceId="contact-focus-indicator">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            style={{ outline: 'none' }}
          />
        </A11yDemo>
        {errors.name && (
          <A11yDemo instanceId="contact-error-announcement">
            <p className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          </A11yDemo>
        )}
      </A11yDemo>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
          style={{ outline: 'none' }}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Message"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
          style={{ outline: 'none' }}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors"
        style={{ outline: 'none' }}
      >
        Send Message
      </button>
    </form>
  );
}
