'use client';

import Image from 'next/image';
import Link from 'next/link';
import { A11yDemo } from '../a11y-demo';
import { useA11yMode } from '../providers/a11y-mode-provider';

interface TeamCardProps {
  id: string;
  name: string;
  role: string;
  specialty: string;
  location: string;
  education: string;
  clinicalInterests: string;
  personalInterests: string;
  photoUrl: string;
  onDelete: () => void;
}

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

export const TeamCard = ({
  id,
  name,
  role,
  specialty,
  location,
  education,
  clinicalInterests,
  personalInterests,
  photoUrl,
  onDelete,
}: TeamCardProps) => {
  const { isAccessible } = useA11yMode();
  const roleLabel = role === 'physician' ? 'Physician' : 'Nurse';

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={photoUrl}
          alt={`Photo of ${name}`}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-teal-700 font-medium">{roleLabel}</p>
        </div>
        <p className="mt-1 text-sm text-gray-600">{specialty}</p>
        <p className="mt-1 text-xs text-gray-500">{location}</p>

        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-700">Education</p>
            <p>{education}</p>
          </div>
          {clinicalInterests && (
            <div>
              <p className="font-medium text-gray-700">Clinical Interests</p>
              <p>{clinicalInterests}</p>
            </div>
          )}
          {personalInterests && (
            <div>
              <p className="font-medium text-gray-700">Personal Interests</p>
              <p>{personalInterests}</p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link
            href={`/maple-valley-health/team/${id}/edit`}
            className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600 rounded"
          >
            Edit profile
          </Link>
          <A11yDemo instanceId="team-delete-button" label="Delete member button">
            {isAccessible ? (
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete ${name}`}
                className="text-gray-400 hover:text-red-600 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal-600 rounded p-1"
              >
                <TrashIcon />
              </button>
            ) : (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- intentionally inaccessible for a11y demo
              <div
                onClick={onDelete}
                className="cursor-pointer text-gray-400 hover:text-red-600 transition-colors p-1"
                style={{ outline: 'none' }}
              >
                <TrashIcon />
              </div>
            )}
          </A11yDemo>
        </div>
      </div>
    </div>
  );
};
