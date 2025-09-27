import TenantError from '@/components/TenantError';
import LoginForm from '@/components/LoginForm';
import axiosAdmin from "@/utils/axiosAdmin";
import { headers } from 'next/headers';
import { getServerTenant } from '@/utils/tenant';

export default async function LoginPage() {
  const hdrs = headers();
  const tenant = getServerTenant(hdrs);

  if (!tenant || tenant === 'login') {
    // On localhost, assume full host (with port) as tenant
    const hostHeader = hdrs.get('host') || '';
    const [hostName, hostPort] = hostHeader.split(':');
    if (hostName?.includes('localhost')) {
      const assumed = hostPort ? `localhost:${hostPort}` : 'localhost';
      try {
        await axiosAdmin.get(`/api/clients/domain/${assumed}/with-subscription-check`, {
          headers: { "X-Tenant": assumed },
        });
        return <LoginForm tenant={assumed} />;
      } catch (err) {
        // fall through to error rendering below
      }
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md max-w-sm text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Client URL</h1>
          <p className="text-gray-600">Please open with a valid client domain or add ?tenant=your-client in dev.</p>
        </div>
      </div>
    );
  }

  try {
    await axiosAdmin.get(`/api/clients/domain/${tenant}/with-subscription-check`, {
      headers: { "X-Tenant": tenant },
    });
    return <LoginForm tenant={tenant} />;
  } catch (err) {
    let reason = "not_found";
    if (err.response) {
      try {
        const { error } = err.response.data;
        const lowerError = error?.toLowerCase() || "";
        if (lowerError.includes("inactive")) reason = "inactive";
        else if (lowerError.includes("no active subscriptions")) reason = "no_subscription";
        else if (lowerError.includes("expired")) reason = "expired";
      } catch {}
    } else {
      reason = "server_unreachable";
    }
    return <TenantError tenant={tenant} reason={reason} />;
  }
}


