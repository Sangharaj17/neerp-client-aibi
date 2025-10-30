'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
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
  Loader2, // ✅ Import Loader2 from lucide-react
} from 'lucide-react';

const NavigationAccordion = () => {
  const [openSections, setOpenSections] = useState({});
  const [loadingHref, setLoadingHref] = useState('');
  const pathname = usePathname();
  const { tenant: tenantFromParams } = useParams();
  const tenant = tenantFromParams || getTenant();
  const [clientname, setClientname] = useState('');

  useEffect(() => {
    if (!tenant) return;
    const clientNameKey = `${tenant}_clientName`;
    const storedClientName = localStorage.getItem(clientNameKey);
    setClientname(storedClientName || '');
  }, [tenant]);

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
    // { title: 'Cabin Subtypes Prizes', slug: 'cabin-subtypes-prizes' },
    // { title: 'Landing door Prizes', slug: 'landing-door-prizes' },
    { title: 'Light Fittings', slug: 'light-fittings' },
    { title: 'Wiring Pluggable Harness', slug: 'wiring-pluggable-harness' },
    { title: 'ARD Type', slug: 'add-ard-type' },
    { title: 'Car Bracket & Counter Brace', slug: 'car-counter-bracket' },
    { title: 'Governer Safety Rope', slug: 'governer-safety-rope' },
    // { title: 'Car Door SubType', slug: 'car-door-subtype' },
    { title: 'LOP Type', slug: 'lop-type' },
    { title: 'Other material', slug: 'other-material' },
    { title: 'Cop Type', slug: 'cop-type' },
    // { title: 'Lop Main Type', slug: 'lop-main-type' },,
    { title: 'Counter Frame Type', slug: 'frame-type' },
    { title: 'Wire rope', slug: 'wire-rope' },
    { title: 'Guide Rail', slug: 'guide-rail' },
    { title: 'Counter Weight', slug: 'counter-weight' },
    { title: 'Fastener', slug: 'fastener' },    
  ];

  const componentsPricingSubmenu = componentsPricing.map(type => ({
    title: type.title,
    // Clean URL; middleware will rewrite to /<tenant>/...
    href: `/dashboard/components-pricing/${type.slug}`,
  }));


  const materialTypes = [
    { title: 'Elevator Operation', slug: 'elevator-operation' },
    { title: 'Landing Door Type', slug: 'landing-door-type' },
    { title: 'Car Door Type', slug: 'car-door-type' },
    { title: 'Cabin Type', slug: 'cabin-type' },
    { title: 'Cabin Flooring', slug: 'cabin-flooring' },
    { title: 'Cabin False Ceiling', slug: 'cabin-false-ceiling' },
    { title: 'Air System Type', slug: 'air-system-type' },
    { title: 'Control Panel Type', slug: 'control-panel-type' },
    { title: 'Machine Room Type', slug: 'machine-room-type' },
    { title: 'Type Of Lift', slug: 'type-of-lift' },
    { title: 'Cabin Subtypes Prizes', slug: 'cabin-subtypes-prizes' },
    { title: 'Landing door Prizes', slug: 'landing-door-prizes' },
    { title: 'WIRING PLUGABLE HARNESS', slug: 'wiring-plugable-harness' },
    { title: 'Add ARD Type', slug: 'add-ard-type' },
    { title: 'Car Bracket & Counter Brace', slug: 'car-bracket-counter-bracket' },
    { title: 'GOVERNER SAFETY ROPE', slug: 'governer-safety-rope' },
    { title: 'Car Door SubType', slug: 'car-door-subtype' },
    { title: 'LOP Type', slug: 'lop-type' },
    { title: 'Other material', slug: 'other-material' },
    { title: 'Cop Main type', slug: 'cop-main-type' },
    { title: 'Lop Main Type', slug: 'lop-main-type' },
    { title: 'Wire rope', slug: 'wire-rope' },
    { title: 'Guide Rail', slug: 'guide-rail' },
    { title: 'Counter Weight', slug: 'counter-weight' },
  ];


  const materialSubmenu = materialTypes.map(type => ({
    title: type.title,
    href: `/dashboard/material-management/${type.slug}`,
  }));


  const menuSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: BarChart3,
      hasSubmenu: false,
      href: '/dashboard/dashboard-data'
    },
    {
      id: 'user-resource',
      title: 'User/Resource',
      icon: Users,
      hasSubmenu: true,
      submenu: [
        { title: 'Users', href: '/users' },
        { title: 'Roles', href: '/roles' },
        { title: 'Permissions', href: '/permissions' },
        { title: 'Resources', href: '/resources' }
      ]
    },
    {
      id: 'components-pricing',
      title: 'Components & Pricing',
      icon: Package,
      hasSubmenu: true,
      submenu: componentsPricingSubmenu,
    },
    // {
    //   id: 'material-management',
    //   title: 'Material Management',
    //   icon: Package,
    //   hasSubmenu: true,
    //   submenu: [
    //     { title: 'Add ARD Type', href: `/${tenant}/dashboard/material-management/add-ard-type` },
    //     { title: 'Air System Type', href: `/${tenant}/dashboard/material-management/air-system-type` },
    //     { title: 'Cabin False Celling', href: `/${tenant}/dashboard/material-management/cabin-false-celling` },
    //     { title: 'Cabin Flooring', href: `/${tenant}/dashboard/material-management/cabin-flooring` },
    //     { title: 'Cabin Subtypes Prizes', href: `/${tenant}/dashboard/material-management/cabin-subtypes-prizes` },
    //     { title: 'Cabin Type', href: `/${tenant}/dashboard/material-management/cabin-type` },
    //     { title: 'Car Bracket Counter Bracket', href: `/${tenant}/dashboard/material-management/car-bracket-counter-bracket` },
    //     { title: 'Car Door Subtype', href: `/${tenant}/dashboard/material-management/car-door-subtype` },
    //     { title: 'Car Door Type', href: `/${tenant}/dashboard/material-management/car-door-type` },
    //     { title: 'Control Panel Type', href: `/${tenant}/dashboard/material-management/control-panel-type` },
    //     { title: 'Cop Main Type', href: `/${tenant}/dashboard/material-management/cop-main-type` },
    //     { title: 'Counter Weight', href: `/${tenant}/dashboard/material-management/counter-weight` },
    //     { title: 'Elevator Operation', href: `/${tenant}/dashboard/material-management/elevator-operation` },
    //     { title: 'Governer Saftey Rope', href: `/${tenant}/dashboard/material-management/governer-saftey-rope` },
    //     { title: 'Guide Rail', href: `/${tenant}/dashboard/material-management/guide-rail` },
    //     { title: 'Landing Door Prizes', href: `/${tenant}/dashboard/material-management/landing-door-prizes` },
    //     { title: 'Landing Door Type', href: `/${tenant}/dashboard/material-management/landing-door-type` },
    //     { title: 'Lop Main Type', href: `/${tenant}/dashboard/material-management/lop-main-type` },
    //     { title: 'LOP Type', href: `/${tenant}/dashboard/material-management/lop-type` },
    //     { title: 'Machine Room Type', href: `/${tenant}/dashboard/material-management/machine-room-type` },
    //     { title: 'Other Material', href: `/${tenant}/dashboard/material-management/other-material` },
    //     { title: 'Type Of Lift', href: `/${tenant}/dashboard/material-management/type-of-lift` },
    //     { title: 'Wire Rope', href: `/${tenant}/dashboard/material-management/wire-rope` },
    //     { title: 'Wiring Plugable Harness', href: `/${tenant}/dashboard/material-management/wiring-plugable-harnes` }
    //   ]
    // },
    {
      id: 'lead-management',
      title: 'Lead Management',
      icon: Target,
      hasSubmenu: true,
      submenu: [
        { title: 'Lead List', href: `/dashboard/lead-management/lead-list` },
        { title: 'To Do List', href: `/dashboard/lead-management/to-do-list` },
        { title: 'Activity List', href: `/dashboard/lead-management/activity-list` },
        { title: 'List All Mail To Lead', href: `/dashboard/lead-management/mail-to-lead` },
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
        { title: 'Oncall Quotation List', href: `/dashboard/quotations/approved` },
        { title: 'AMC Renewals Quotation List', href: `/dashboard/quotations/amc-renewal-quatation-list` },
      { title: 'AMC Quatation Setup', href: `/dashboard/quotations/amc_quatation_setup` }

      ]
    },
    {
      id: 'jobs',
      title: 'Jobs',
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { title: 'Add New Job Detail', href: `/dashboard/jobs/add-new-job-detail` },
                { title: 'Add Payment', href: `/dashboard/jobs/add-payment` },

        { title: 'Amc Jobs List', href: `/dashboard/jobs/amc_job_list/false` },
        { title: 'Brekdown Todo Form ', href: `/dashboard/jobs/add-breakdown-call`},
         { title: 'Add Renewal Job Activity', href: `/dashboard/jobs/add-renewal-job-activity/0` },
      { title: 'Amc Invoices', href: `/dashboard/jobs/amc-invoices`},
            { title: 'Amc Payment Invoices', href: `/dashboard/jobs/amc-payments`},


      ]
    },
    {
      id: 'accounts',
      title: 'Accounts',
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { title: 'Chart of Accounts', href: '/accounts/chart' },
        { title: 'Transactions', href: '/accounts/transactions' },
        { title: 'Reports', href: '/accounts/reports' },
        { title: 'Settings', href: '/accounts/settings' }
      ]
    },
     {
      id: 'settings',
      title: 'settings',
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { title: 'Company Setting', href: '/dashboard/settings' },
      ]
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200 h-16">
        <h2 className="text-lg font-semibold text-gray-800">{clientname}</h2>
      </div>

      <nav className="p-2">
        {menuSections.map((section) => {
          const isActive = isSectionActive(section);
          const isOpen = openSections[section.id];

          return (
            <div key={section.id} className="mb-1">
              {section.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 text-left rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.submenu.map((item, index) => {
                        const isItemActive = isLinkActive(item.href);
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => handleNavigation(item.href)}
                            className={`flex items-center justify-between p-2 text-sm rounded-md transition-colors ${
                              isItemActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span>{item.title}</span>
                            {loadingHref === item.href && (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-500 ml-2" />
                            )}
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
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  {loadingHref === section.href && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500 ml-2" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationAccordion;
