import type { Institute, BlogPost, Event, Certificate, AdminUser } from './types';

export const mockInstitutes: Institute[] = [
  {
    id: '1',
    name: 'Global Tech University',
    logoUrl: 'https://placehold.co/100x100.png',
    country: 'United Kingdom',
    description: 'A leading institution in technology and engineering education.',
    courses: ['Computer Science', 'Data Analytics', 'AI & Machine Learning'],
    status: 'Accredited',
    balance: 150,
  },
  {
    id: '2',
    name: 'London School of Business',
    logoUrl: 'https://placehold.co/100x100.png',
    country: 'United Kingdom',
    description: 'Premier business school offering MBA and finance programs.',
    courses: ['MBA', 'Finance', 'International Business'],
    status: 'Accredited',
    balance: 250,
  },
  {
    id: '3',
    name: 'Cambridge Arts College',
    logoUrl: 'https://placehold.co/100x100.png',
    country: 'United Kingdom',
    description: 'Renowned for its vibrant arts and humanities programs.',
    courses: ['Fine Arts', 'History of Art', 'Modern Languages'],
    status: 'Accredited',
    balance: 85,
  },
  {
    id: '4',
    name: 'European Engineering Institute',
    logoUrl: 'https://placehold.co/100x100.png',
    country: 'Germany',
    description: 'A top-ranked institute for mechanical and electrical engineering.',
    courses: ['Mechanical Engineering', 'Electrical Engineering', 'Robotics'],
    status: 'Accredited',
    balance: 5,
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    slug: 'the-future-of-accreditation',
    title: 'The Future of Higher Education Accreditation',
    author: 'Dr. Jane Doe',
    date: '2024-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1649860771747-ee7be7afa585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwwfHx8fDE3NTM2OTI3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'Exploring how technology and global standards are shaping the future of university accreditation.',
    content: '<p>The world of higher education is undergoing a seismic shift. In this article, we delve into the trends that are redefining what it means for an institution to be accredited in the 21st century.</p>',
  },
  {
    slug: 'why-choose-ukcas',
    title: 'Why a UKCAS Accreditation Matters for Your Institute',
    author: 'John Smith',
    date: '2024-06-28',
    imageUrl: 'https://images.unsplash.com/photo-1599081595468-de614fc93694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwwfHx8fDE3NTM2OTI3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'A UKCAS accreditation is more than a badge; it\'s a commitment to excellence and a passport to global recognition.',
    content: '<p>Learn about the rigorous standards and benefits that come with a UKCAS accreditation, and how it can elevate your institution\'s profile on the world stage.</p>',
  },
];

export const mockEvents: Event[] = [
  {
    slug: 'global-education-summit-2024',
    title: 'Global Education Summit 2024',
    date: '2024-11-05',
    location: 'London, UK',
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Join education leaders from around the world to discuss the future of learning and international collaboration.',
  },
  {
    slug: 'accreditation-standards-workshop',
    title: 'Workshop on New Accreditation Standards',
    date: '2024-09-20',
    location: 'Online',
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'A virtual workshop for institutes preparing for the new 2025 UKCAS accreditation standards.',
  },
];

export const mockCertificates: Certificate[] = [
    { 
        id: 'UKCAS-12345678', 
        studentName: 'Alice Johnson', 
        courseName: 'Data Analytics', 
        issueDate: '2024-07-21', 
        instituteId: '1',
        status: 'Approved'
    },
    { 
        id: 'UKCAS-87654321', 
        studentName: 'Bob Williams', 
        courseName: 'MBA', 
        issueDate: '2024-06-15', 
        instituteId: '2',
        status: 'Approved'
    },
    { 
        id: 'UKCAS-11223344', 
        studentName: 'Charlie Brown', 
        courseName: 'Fine Arts', 
        issueDate: '2024-05-30', 
        instituteId: '3' ,
        status: 'Approved'
    },
    { 
        id: 'UKCAS-99887766', 
        studentName: 'Diana Prince', 
        courseName: 'Mechanical Engineering', 
        issueDate: '2024-08-01', 
        instituteId: '4',
        status: 'Approved'
    },
     { 
        id: 'UKCAS-23456789', 
        studentName: 'Eve Adams', 
        courseName: 'Computer Science', 
        issueDate: '2024-08-05', 
        instituteId: '1' ,
        status: 'Pending'
    },
    { 
        id: 'UKCAS-34567890', 
        studentName: 'Frank White', 
        courseName: 'International Business', 
        issueDate: '2024-08-02', 
        instituteId: '2',
        status: 'Pending'
    }
];

export const mockAdminUsers: AdminUser[] = [
    {
        id: '1',
        instituteName: 'Code Alpha',
        instituteAddress: 'Colombo',
        registeredDate: '2025-06-06T10:30:00.000Z',
        email: 'dulajhansana1973@gmail.com',
        password: 'password123'
    },
    {
        id: '2',
        instituteName: 'Tech Institute',
        instituteAddress: '123 Main Street, Colombo',
        registeredDate: '2025-06-11T11:30:00.000Z',
        email: 'admin@example.com',
        password: 'password123'
    },
    {
        id: '3',
        instituteName: 'Global Tech University',
        instituteAddress: 'London, UK',
        registeredDate: '2024-07-20T09:00:00.000Z',
        email: 'contact@globaltech.edu',
        password: 'password123'
    }
];
