'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TeamMember } from '@/data/team-members';
import { useTeamData } from '../providers/team-data-provider';

interface TeamFormProps {
  existingMember?: TeamMember;
}

interface FormErrors {
  name?: string;
  role?: string;
  specialty?: string;
  location?: string;
  education?: string;
  photoUrl?: string;
}

const roleOptions: { value: TeamMember['role']; label: string }[] = [
  { value: 'physician', label: 'Physician' },
  { value: 'nurse', label: 'Nurse' },
];

export const TeamForm = ({ existingMember }: TeamFormProps) => {
  const router = useRouter();
  const { addMember, updateMember } = useTeamData();
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = Boolean(existingMember);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newErrors: FormErrors = {};

    const name = formData.get('name') as string;
    const role = formData.get('role') as TeamMember['role'];
    const specialty = formData.get('specialty') as string;
    const location = formData.get('location') as string;
    const education = formData.get('education') as string;
    const photoUrl = formData.get('photoUrl') as string;
    const clinicalInterests = formData.get('clinicalInterests') as string;
    const personalInterests = formData.get('personalInterests') as string;

    if (!name) newErrors.name = 'Name is required';
    if (!role) newErrors.role = 'Role is required';
    if (!specialty) newErrors.specialty = 'Specialty is required';
    if (!location) newErrors.location = 'Location is required';
    if (!education) newErrors.education = 'Education is required';
    if (!photoUrl) newErrors.photoUrl = 'Photo URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const memberData = {
      name,
      role,
      specialty,
      location,
      education,
      photoUrl,
      clinicalInterests: clinicalInterests || '',
      personalInterests: personalInterests || '',
    };

    if (existingMember) {
      updateMember(existingMember.id, memberData);
    } else {
      addMember(memberData);
    }

    router.push('/maple-valley-health/team');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={existingMember?.name}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? true : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue={existingMember?.role ?? ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
          aria-describedby={errors.role ? 'role-error' : undefined}
          aria-invalid={errors.role ? true : undefined}
        >
          <option value="">Select a role</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p id="role-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.role}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
          Specialty
        </label>
        <input
          type="text"
          id="specialty"
          name="specialty"
          defaultValue={existingMember?.specialty}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
          aria-describedby={errors.specialty ? 'specialty-error' : undefined}
          aria-invalid={errors.specialty ? true : undefined}
        />
        {errors.specialty && (
          <p id="specialty-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.specialty}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={existingMember?.location}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
          aria-describedby={errors.location ? 'location-error' : undefined}
          aria-invalid={errors.location ? true : undefined}
        />
        {errors.location && (
          <p id="location-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.location}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
          Education
        </label>
        <input
          type="text"
          id="education"
          name="education"
          defaultValue={existingMember?.education}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
          aria-describedby={errors.education ? 'education-error' : undefined}
          aria-invalid={errors.education ? true : undefined}
        />
        {errors.education && (
          <p id="education-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.education}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Photo URL
        </label>
        <input
          type="url"
          id="photoUrl"
          name="photoUrl"
          defaultValue={existingMember?.photoUrl}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
          aria-describedby={errors.photoUrl ? 'photoUrl-error' : undefined}
          aria-invalid={errors.photoUrl ? true : undefined}
        />
        {errors.photoUrl && (
          <p id="photoUrl-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.photoUrl}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="clinicalInterests" className="block text-sm font-medium text-gray-700 mb-1">
          Clinical Interests
        </label>
        <textarea
          id="clinicalInterests"
          name="clinicalInterests"
          rows={3}
          defaultValue={existingMember?.clinicalInterests}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
        />
      </div>

      <div>
        <label htmlFor="personalInterests" className="block text-sm font-medium text-gray-700 mb-1">
          Personal Interests
        </label>
        <textarea
          id="personalInterests"
          name="personalInterests"
          rows={3}
          defaultValue={existingMember?.personalInterests}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-2 focus:outline-teal-600 focus:border-teal-600"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"
        >
          {isEditing ? 'Save Changes' : 'Add Team Member'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/maple-valley-health/team')}
          className="px-6 py-3 text-gray-700 font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
