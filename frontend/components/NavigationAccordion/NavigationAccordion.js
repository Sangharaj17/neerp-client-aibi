'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { getTenant } from '@/utils/tenant';
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Target,
  UserCheck,
  FileText,
  Settings,
  DollarSign,
  ChevronRight,
  Loader2,
  Search,
  LayoutDashboard,
  Briefcase,
  CreditCard,
  FileSpreadsheet,
  LogOut,
  ChevronUp,
  User
} from 'lucide-react';
import Input from '@/components/UI/Input';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import CompanyLogo from './CompanyLogo';

const NavigationAccordion = () => {
  const [openSections, setOpenSections] = useState({});
  const [loadingHref, setLoadingHref] = useState('');
  const pathname = usePathname();
  const { tenant: tenantFromParams } = useParams();
  const tenant = tenantFromParams || getTenant();
  const [searchQuery, setSearchQuery] = useState('');

  // Profile State
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!tenant) return;
    const userKey = `${tenant}_username`;
    const userEmailKey = `${tenant}_userEmail`;
    setUsername(localStorage.getItem(userKey) || 'User');
    setUserEmail(localStorage.getItem(userEmailKey) || 'user@example.com');
  }, [tenant]);

  const handleLogout = async () => {
    try {
      const tokenKey = `${tenant}_token`;
      const storedToken = localStorage.getItem(tokenKey);

      await axiosInstance.post(
        "/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      localStorage.removeItem(`${tenant}_username`);
      localStorage.removeItem(`${tenant}_modules`);
      localStorage.removeItem(`${tenant}_token`);
      localStorage.removeItem(`${tenant}_clientName`);
      localStorage.removeItem(`${tenant}_userEmail`);
      localStorage.removeItem(`${tenant}_clientId`);

      toast.success("Logged out successfully");
      router.push(`/auth/login`);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const newOpenSections = {};
    menuSections.forEach(section => {
      if (section.hasSubmenu && section.submenu) {
        const isActive = section.submenu.some(item => pathname === item.href);
        if (isActive) {
          newOpenSections[section.id] = true;
        }
      }
    });
    setOpenSections(newOpenSections);
    setLoadingHref('');
  }, [pathname]);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleNavigation = (href) => {
    if (href !== pathname) {
      setLoadingHref(href);
    }
  };

  const isLinkActive = (href) => pathname === href;

  const isSectionActive = (section) => {
    if (!section.hasSubmenu) {
      return isLinkActive(section.href);
    }
    return section.submenu?.some(item => isLinkActive(item.href)) || false;
  };

  const componentsPricing = [
    { title: 'Capacity N Unit', slug: 'capacity-unit' },
    { title: 'Basic Setup', slug: 'basic-setup' },
    { title: 'Elevator Operation', slug: 'operator-elevators' },
    { title: 'Landing Door Type', slug: 'landing-door-type' },
    { title: 'Car Door Type', slug: 'car-door-type' },
    { title: 'Cabin Type', slug: 'cabin-type' },
    { title: 'Cabin Flooring', slug: 'cabin-flooring' },
    { title: 'Cabin False Ceiling', slug: 'cabin-false-ceiling' },
    { title: 'Air System Type', slug: 'air-system-type' },
    { title: 'Control Panel Type', slug: 'control-panel-type' },
    { title: 'Machine Room Type', slug: 'machine-room-type' },
    { title: 'Type Of Lift', slug: 'type-of-lift' },
    { title: 'Light Fittings', slug: 'light-fittings' },
    { title: 'Wiring Pluggable Harness', slug: 'wiring-pluggable-harness' },
    { title: 'ARD Type', slug: 'add-ard-type' },
    { title: 'Car Bracket & Counter Brace', slug: 'car-counter-bracket' },
    { title: 'Governer Safety Rope', slug: 'governer-safety-rope' },
    { title: 'LOP Type', slug: 'lop-type' },
    { title: 'Other material', slug: 'other-material' },
    { title: 'Cop Type', slug: 'cop-type' },
    { title: 'Counter Frame Type', slug: 'frame-type' },
    { title: 'Wire rope', slug: 'wire-rope' },
    { title: 'Guide Rail', slug: 'guide-rail' },
    { title: 'Counter Weight', slug: 'counter-weight' },
    { title: 'Fastener', slug: 'fastener' },
  ];

  const componentsPricingSubmenu = componentsPricing.map(type => ({
    title: type.title,
    href: `/dashboard/components-pricing/${type.slug}`,
  }));

  const menuSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      hasSubmenu: false,
      href: '/dashboard/dashboard-data'
    },
    {
      id: 'user-resource',
      title: 'User/Resource',
      icon: Users,
      hasSubmenu: true,
      submenu: [
        { title: 'Employee List', href: '/dashboard/user-resource/employee-list' },
        { title: 'Add User Role', href: '/dashboard/user-resource/add-user-role' },
        { title: 'Assign Role', href: '/dashboard/user-resource/assign-role' },
        { title: 'Change Password', href: '/dashboard/user-resource/change-password' },
        { title: 'Add Required Document', href: '/dashboard/user-resource/add-required-document' },
        { title: 'Add Tax Type', href: '/dashboard/user-resource/add-tax-type' },
        { title: 'Employee In Time', href: '/dashboard/user-resource/employee-in-time' },
        { title: 'Employee Out Time', href: '/dashboard/user-resource/employee-out-time' },
        { title: 'Employee Leave Entry', href: '/dashboard/user-resource/employee-leave-entry' },
        { title: 'Employee Attendance List', href: '/dashboard/user-resource/employee-attendance-list' },
      ]
    },
    {
      id: 'components-pricing',
      title: 'Components & Pricing',
      icon: Package,
      hasSubmenu: true,
      submenu: componentsPricingSubmenu,
    },
    {
      id: 'lead-management',
      title: 'Lead Management',
      icon: Target,
      hasSubmenu: true,
      submenu: [
        { title: 'Lead List', href: `/dashboard/lead-management/lead-list` },
        { title: 'To Do List', href: `/dashboard/lead-management/to-do-list` },
        { title: 'Lead Setting (setup)', href: `/dashboard/lead-management/lead-setting` }
      ]
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: UserCheck,
      hasSubmenu: true,
      submenu: [
        { title: 'Customer List', href: '/dashboard/customer/customer-list' },
        { title: 'Customers Sites Todo List', href: `/dashboard/customer/customer-todo-list` },
        { title: 'Customer Groups', href: '/customer-groups' },
        { title: 'Customer History', href: '/customer-history' },
        { title: 'Feedback', href: '/feedback' }
      ]
    },
    {
      id: 'quotations',
      title: 'Quotations',
      icon: FileText,
      hasSubmenu: true,
      submenu: [
        { title: 'New Installation Quotation List', href: `/dashboard/quotations/new-installation` },
        { title: 'AMC Quotation List', href: `/dashboard/quotations/amc_quatation_list` },
        { title: 'Material Repair Quotation List', href: `/dashboard/quotations/material_repair_quatation_list` },
        { title: 'Modernization Quotation List', href: `/dashboard/quotations/ModernizationList` },
        { title: 'Oncall Quotation List', href: `/dashboard/quotations/oncall-quotation-list` },
        { title: 'AMC Renewals Quotation List', href: `/dashboard/quotations/amc-renewal-quatation-list` },
        { title: 'AMC Quatation Setup', href: `/dashboard/quotations/amc_quatation_setup` }
      ]
    },
    {
      id: 'jobs',
      title: 'Jobs',
      icon: Briefcase,
      hasSubmenu: true,
      submenu: [
        { title: 'Add New Job Detail', href: `/dashboard/jobs/add-new-job-detail` },
        { title: 'Add Payment', href: `/dashboard/jobs/add-payment` },
        { title: 'Amc Jobs List', href: `/dashboard/jobs/amc_job_list/false` },
        { title: 'Brekdown Todo Form ', href: `/dashboard/jobs/add-breakdown-call` },
        { title: 'Add Renewal Job Activity', href: `/dashboard/jobs/add-renewal-job-activity/0` },
        { title: 'Invoices', href: `/dashboard/jobs/amc-invoices` },
        { title: 'Payment Invoices', href: `/dashboard/jobs/amc-payments` },
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { title: 'Company Setting', href: '/dashboard/settings' },
        { title: 'Amc Quotation Pdf Setting', href: '/dashboard/settings/pdf_setting' },
      ]
    }
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return menuSections;
    return menuSections
      .map(section => {
        if (!section.hasSubmenu) {
          return section.title.toLowerCase().includes(normalizedQuery) ? section : null;
        }
        const sub = (section.submenu || []).filter(i => i.title.toLowerCase().includes(normalizedQuery));
        return sub.length ? { ...section, submenu: sub } : null;
      })
      .filter(Boolean);
  }, [normalizedQuery]);

  return (
    <div className="w-64 sticky top-0 z-20 bg-white h-screen flex flex-col font-sans text-sm border-r border-slate-200">
      {/* Header with Company Logo */}
      <div className="h-14 flex-shrink-0 flex items-center justify-left px-4 border-b border-slate-200">
        <CompanyLogo />
      </div>

      {/* Search Bar */}
      <div className="p-3 flex-shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-900 text-sm rounded-md pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {(normalizedQuery ? filteredSections : menuSections).map((section) => {
          const isActive = isSectionActive(section);
          const isOpen = normalizedQuery ? true : openSections[section.id];
          const Icon = section.icon;

          return (
            <div key={section.id}>
              {section.hasSubmenu ? (
                <div className="space-y-0.5">
                  <button
                    onClick={() => toggleSection(section.id)}
                    title={section.title}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                      <span>{section.title}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                      {section.submenu.map((item, index) => {
                        const isItemActive = isLinkActive(item.href);
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => handleNavigation(item.href)}
                            title={item.title}
                            className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${isItemActive
                                ? 'text-slate-900 font-medium bg-slate-100'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.title}</span>
                              {loadingHref === item.href && (
                                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={section.href}
                  onClick={() => handleNavigation(section.href)}
                  title={section.title}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                    <span>{section.title}</span>
                  </div>
                  {loadingHref === section.href && (
                    <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-slate-200 bg-white">
        {isProfileOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 animate-in slide-in-from-bottom-2 duration-200">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-xs font-semibold text-slate-500">My Account</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2 text-slate-500" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        )}

        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center w-full gap-3 p-2 rounded-md transition-colors border border-transparent ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-100'
            }`}
        >
          <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200 text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{username}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
          <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default NavigationAccordion;
