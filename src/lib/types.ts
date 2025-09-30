

export interface Institute {
  id: string;
  name: string;
  logoUrl: string;
  country: string;
  description: string;
  courses: Course[];
  status: 'Accredited' | 'Pending Review' | 'Denied';
  balance: number;
}

export interface Course {
    id: string;
    institute_id: string;
    course_name: string;
    course_code: string | null;
    description: string | null;
    duration: string | null;
    active_status: string | number;
    created_at: string;
    updated_at: string;
    created_by: string;
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
    balance?: number;
}

export interface UserInstituteAssignment {
    id: string;
    institute_id: string;
    user_account: string;
    institute: ApiInstitute; // Can be partial until fully loaded
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
  studentId?: string;
  courseId?: string;
  status: 'Approved' | 'Pending' | 'Denied' | 'Rejected';
  student_name?: string;
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
  institute_id: string;
  name: string;
  email_address: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  country: string;
  created_at: string;
  active_status: string | number;
  student_photo?: string | null;
  id_card_front?: string | null;
  id_card_back?: string | null;
  ol_certificate?: string | null;
  al_certificate?: string | null;
}

export interface CertificateVerificationData {
  id: number;
  institute_id: number;
  student_id: number;
  course_id: number;
  certificate_id: number;
  created_at: string;
  created_by: string;
  is_active: number;
  approved_status: 'Approved' | 'Pending' | 'Rejected';
  from_date: string;
  to_date: string;
  name: string;
  date_of_birth: string;
  email_address: string;
  country: string;
  phone_number: string;
  address: string;
  student_photo: string;
}

    
