import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
        <h1 className="text-3xl font-bold text-green-600">
          Proof Submitted Successfully
        </h1>
        <p className="mt-4 text-slate-600">
          Your payment proof is now pending verification by the admin.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}