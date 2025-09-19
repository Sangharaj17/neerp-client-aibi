import Tooltip from "@/components/UI/Tooltip";

export default function StageTwoButton({ activeStage, setActiveStage, hasAllRequiredFieldsForAddLeadFilled }) {
  const isDisabled = !hasAllRequiredFieldsForAddLeadFilled;

  const button = (
    <button
      onClick={() => {
        if (true) setActiveStage(2);
        else alert("❌ Please submit the Lead first.");
      }}
      className={`px-6 py-2 rounded-md border-b-4 transition ${
        activeStage === 2
          ? "border-green-600 text-green-700 font-semibold bg-green-50"
          : "border-transparent hover:bg-gray-100"
      }`}
      disabled={isDisabled}
    >
      Stage 2: Add Technical Enquiry
    </button>
  );

  return isDisabled ? (
    <Tooltip message="First Fill Lead Values">{button}</Tooltip>
  ) : (
    button
  );
}
