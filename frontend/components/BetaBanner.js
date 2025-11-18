'use client';

export default function BetaBanner() {
  return (
    <div className="fixed top-0 right-0 w-full flex justify-center z-[9999] pointer-events-none">
      <div className="bg-white text-black shadow-sm text-xs font-medium px-3 py-1.5 rounded-b-md">
        Beta Version
      </div>
    </div>
  );
}

