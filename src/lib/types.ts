

export interface Institute {
  id: string;
  name: string;
  logoUrl: string;
  country: string;
  description: string;
  courses: string[];
  status: 'Accredited' | 'Pending Review' | 'Denied';
  balance: number;
}

export interface ApiInstitute {
    id: string;
    name: string;
    code: string;
    type: string;
    accreditation_status: 'Accredited' | 'Conditional' | 'Pending' | 'Rejected';
    accreditation_valid_until: string;
    email: string;
    phone: string;
    website: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    logo?: string;
    logo_path?: string;
    cover_image?: string;
    cover_image_path?: string;
    status: 'Active' | 'Inactive';
    created_at: string;
    updated_at: string;
    created_by: string;
    slug: string;
}

export interface UserInstituteAssignment {
    id: string;
    institute: ApiInstitute;
    role: string;
    created_at: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  excerpt: string;
  content: string;
}

export interface Event {
  slug: string;
  title: string;
  date: string;
  location: string;
  imageUrl:string;
  description: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  instituteId: string;
  status: 'Approved' | 'Pending' | 'Denied';
}

export interface AdminUser {
  id: string;
  userName: string;
  instituteName: string;
  instituteAddress: string;
  registeredDate: string;
  email: string;
  password?: string;
  balance: number;
  assignedInstitutes?: ApiInstitute[];
}

export interface Student {
    id: string;
    name: string;
    course: string;
    joinedDate: string;
}
