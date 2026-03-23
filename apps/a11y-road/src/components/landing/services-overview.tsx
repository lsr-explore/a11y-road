const services = [
  {
    name: 'Family Medicine',
    description:
      'Comprehensive care for patients of all ages, from routine checkups to chronic condition management.',
  },
  {
    name: 'Preventive Care',
    description:
      'Annual physicals, screenings, immunizations, and health risk assessments to keep you healthy.',
  },
  {
    name: 'Wellness Programs',
    description:
      'Nutrition counseling, weight management, stress reduction, and lifestyle coaching.',
  },
  {
    name: 'Pediatrics',
    description:
      'Well-child visits, developmental screenings, and sick visits for infants through adolescents.',
  },
];

export const ServicesOverview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          data-a11y-name="Services heading"
          className="text-3xl font-bold text-gray-900 text-center"
        >
          Our Services
        </h2>
        <p
          data-a11y-name="Services description"
          className="mt-2 text-gray-600 text-center max-w-2xl mx-auto"
        >
          We offer a wide range of healthcare services to meet your needs.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.name} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
