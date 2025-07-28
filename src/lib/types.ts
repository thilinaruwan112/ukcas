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
  instituteName: string;
  instituteAddress: string;
  registeredDate: string;
  email: string;
  password?: string;
}
