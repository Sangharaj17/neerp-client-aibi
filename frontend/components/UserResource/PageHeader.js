'use client';

export default function PageHeader({ title, description, icon: Icon }) {
  return (
    <header className="space-y-2 mb-6">
      {Icon && (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      )}
      {!Icon && (
        <>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </>
      )}
    </header>
  );
}

