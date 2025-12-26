// components/TenantError.js or .tsx
export default function Error({ tenant, reason }) {
  let title = 'Tenant Not Found';
  let message = `The tenant "${tenant}" was not found. Please check the domain or contact support.`;

  if (reason === 'inactive') {
    title = 'Tenant Inactive';
    message = `The tenant "${tenant}" is currently inactive. Please contact support.`;
  } else if (reason === 'no_subscription') {
    title = 'No Active Subscription';
    message = `The tenant "${tenant}" does not have an active subscription. Please renew your plan.`;
  } else if (reason === 'expired') {
    title = 'Subscription Expired';
    message = `All subscriptions for "${tenant}" have expired. Please renew to continue.`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md px-6 py-12 text-center">
        <h1 className="text-xl font-medium text-gray-900 mb-3">{title}</h1>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
