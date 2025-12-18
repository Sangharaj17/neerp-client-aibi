import Tooltip from "@/components/UI/Tooltip";

export default function StageTwoButton({ activeStage, setActiveStage, hasAllRequiredFieldsForAddLeadFilled }) {
  const isDisabled = !hasAllRequiredFieldsForAddLeadFilled;

  const button = (
    <button
      onClick={() => {
        if (!isDisabled) setActiveStage(2);
      }}
      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeStage === 2
          ? "border-neutral-900 text-neutral-900 bg-neutral-50"
          : isDisabled
            ? "border-transparent text-neutral-300 cursor-not-allowed"
            : "border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
        }`}
      disabled={isDisabled}
    >
      Stage 2: Add Technical Enquiry
    </button>
  );

  return isDisabled ? (
    <Tooltip message="Please fill required lead fields first">{button}</Tooltip>
  ) : (
    button
  );
}
