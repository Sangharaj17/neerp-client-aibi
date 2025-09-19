// components/TenantError.js or .tsx
export default function Error({ tenant, reason }) {
  let title = '❌ Tenant Not Found';
  let message = `The tenant "${tenant}" was not found. Please check the domain or contact support.`;
console.log("-----reason------>",reason)
  if (reason === 'inactive') {
    title = '🚫 Tenant Inactive';
    message = `The tenant "${tenant}" is currently inactive. Please contact support.`;
  } else if (reason === 'no_subscription') {
    title = '⚠️ No Active Subscription';
    message = `The tenant "${tenant}" does not have an active subscription. Please renew your plan.`;
  } else if (reason === 'expired') {
    title = '🕓 Subscription Expired';
    message = `All subscriptions for "${tenant}" have expired. Please renew to continue.`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow-md max-w-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">{title}</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
