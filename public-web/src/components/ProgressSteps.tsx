import { CheckCircle2 } from "lucide-react";

export default function ProgressSteps({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = ["Register", "Payment", "Upload Proof"];

  return (
    <div className="mb-5 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone || isActive
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <CheckCircle2 size={16} /> : stepNumber}
              </div>

              <p
                className={`mt-2 text-[11px] font-medium ${
                  isActive ? "text-cyan-700" : "text-slate-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full ${
              step <= currentStep ? "bg-cyan-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}