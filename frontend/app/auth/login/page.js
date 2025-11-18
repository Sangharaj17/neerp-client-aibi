import TenantError from '@/components/TenantError';
import LoginForm from '@/components/LoginForm';
import axiosAdmin from "@/utils/axiosAdmin";
import { headers } from 'next/headers';
import { getServerTenant } from '@/utils/tenant';

export default async function LoginPage() {
  const hdrs = await headers();
  const tenant = getServerTenant(hdrs);

  // If no tenant detected, show a generic login form
  if (!tenant || tenant === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md max-w-sm text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600 mb-4">Please access this application through your assigned domain.</p>
          <p className="text-sm text-gray-500">If you're a developer, use ?tenant=your-client in the URL.</p>
        </div>
      </div>
    );
  }

  try {
    const clientResponse = await axiosAdmin.get(`/api/clients/domain/${tenant}/with-subscription-check`, {
      headers: { "X-Tenant": tenant },
    });
    // Client name is nested in client object: {modules: [...], client: {clientName: '...'}}
    const clientName = clientResponse.data?.client?.clientName || clientResponse.data?.clientName || '';
    return <LoginForm tenant={tenant} clientName={clientName} />;
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

