export interface TeamMember {
  id: string;
  name: string;
  role: 'physician' | 'nurse';
  specialty: string;
  clinicalInterests: string;
  location: string;
  education: string;
  personalInterests: string;
  photoUrl: string;
}

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'dr-chen',
    name: 'Dr. Maria Chen',
    role: 'physician',
    specialty: 'Family Medicine',
    clinicalInterests: 'Preventive care, chronic disease management, pediatric wellness',
    location: 'Maple Valley Main Clinic',
    education: 'MD, University of Washington School of Medicine',
    personalInterests: 'Trail running, community gardening, reading historical fiction',
    photoUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 'dr-okafor',
    name: 'Dr. James Okafor',
    role: 'physician',
    specialty: 'Internal Medicine',
    clinicalInterests: 'Cardiology referrals, diabetes management, geriatric care',
    location: 'Maple Valley Main Clinic',
    education: 'MD, Johns Hopkins University School of Medicine',
    personalInterests: 'Jazz piano, woodworking, mentoring pre-med students',
    photoUrl:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 'np-larson',
    name: 'Sarah Larson, NP',
    role: 'nurse',
    specialty: 'Pediatrics',
    clinicalInterests: 'Childhood immunizations, developmental screenings, adolescent health',
    location: 'Maple Valley Pediatric Center',
    education: 'MSN, Oregon Health & Science University',
    personalInterests: 'Watercolor painting, hiking with her dogs, youth soccer coaching',
    photoUrl:
      'https://images.unsplash.com/photo-1594824476967-48c8b964f137?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 'dr-patel',
    name: 'Dr. Priya Patel',
    role: 'physician',
    specialty: 'Preventive Medicine',
    clinicalInterests: 'Health screenings, lifestyle counseling, womens health',
    location: 'Maple Valley Wellness Center',
    education: 'MD, Stanford University School of Medicine',
    personalInterests: 'Yoga instruction, vegetarian cooking, travel photography',
    photoUrl:
      'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 'rn-thompson',
    name: 'Marcus Thompson, RN',
    role: 'nurse',
    specialty: 'Chronic Care Management',
    clinicalInterests: 'Heart failure monitoring, patient education, telehealth coordination',
    location: 'Maple Valley Main Clinic',
    education: 'BSN, University of Michigan School of Nursing',
    personalInterests: 'Marathon running, photography, volunteering at food banks',
    photoUrl:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 'dr-nakamura',
    name: 'Dr. Emily Nakamura',
    role: 'physician',
    specialty: 'Sports Medicine',
    clinicalInterests: 'Musculoskeletal injuries, concussion management, exercise prescriptions',
    location: 'Maple Valley Sports Health',
    education: 'DO, Pacific Northwest University of Health Sciences',
    personalInterests: 'Rock climbing, snowboarding, coaching youth basketball',
    photoUrl:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 'np-garcia',
    name: 'Elena Garcia, NP',
    role: 'nurse',
    specialty: 'Geriatric Care',
    clinicalInterests: 'Fall prevention, memory care coordination, medication management',
    location: 'Maple Valley Senior Center',
    education: 'DNP, University of California San Francisco',
    personalInterests: 'Salsa dancing, baking, genealogy research',
    photoUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
  },
];
