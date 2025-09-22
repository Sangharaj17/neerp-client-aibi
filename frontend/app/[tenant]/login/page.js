import TenantError from '@/components/TenantError';
import LoginForm from '@/components/LoginForm';
import axiosAdmin from "@/utils/axiosAdmin";

export const dynamic = 'force-dynamic';

export default async function LoginPage({ params }) {
  const { tenant } = await params;
  //console.log(tenant);

  if (tenant === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md max-w-sm text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Client URL</h1>
          <p className="text-gray-600">Please use a valid client name in the URL (e.g., http://localhost:3000/your-client-name).</p>
        </div>
      </div>
    );
  }

  try {
    const res = await axiosAdmin.get(`/api/clients/domain/${tenant}/with-subscription-check`, {
      headers: { "X-Tenant": tenant }, // ✅ explicit for server-side
    });

    return <LoginForm tenant={tenant} />;
  } catch (err) {
    console.log("Axios fetch failed:", err);

    let reason = "not_found";

    if (err.response) {
      try {
        const { error } = err.response.data;
        console.log("-----error------>", error);

        const lowerError = error?.toLowerCase() || "";
        if (lowerError.includes("inactive")) reason = "inactive";
        else if (lowerError.includes("no active subscriptions")) reason = "no_subscription";
        else if (lowerError.includes("expired")) reason = "expired";
      } catch (parseErr) {
        console.warn("Error parsing axios error response", parseErr);
      }
    } else {
      reason = "server_unreachable";
    }

    return <TenantError tenant={tenant} reason={reason} />;
  }
}
// Inline error component or import it from another file
// function TenantError({ tenant, reason }) {
//   const title = reason === 'inactive' ? '🚫 Tenant Inactive' : '❌ Tenant Not Found';
//   const message = reason === 'inactive'
//     ? `The tenant "${tenant}" is currently inactive. Please contact support.`
//     : `The tenant "${tenant}" was not found. Please check the domain or contact support.`;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-red-50">
//       <div className="bg-white p-8 rounded shadow-md max-w-md text-center">
//         <h1 className="text-2xl font-semibold text-red-600 mb-2">{title}</h1>
//         <p className="text-gray-600">{message}</p>
//       </div>
//     </div>
//   );
// }
