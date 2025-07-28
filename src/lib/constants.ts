import {
  LayoutDashboard,
  FileText,
  Gavel,
  MessageSquare,
  BarChart,
  Settings,
  ShieldCheck,
} from 'lucide-react'

export const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/applications', label: 'Applications', icon: FileText },
  { href: '/assessor-portal', label: 'Assessor Portal', icon: Gavel },
  {
    href: '/compliance-assistant',
    label: 'AI Assistant',
    icon: ShieldCheck,
  },
  { href: '/messaging', label: 'Messages', icon: MessageSquare },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/admin', label: 'Admin', icon: Settings },
]
