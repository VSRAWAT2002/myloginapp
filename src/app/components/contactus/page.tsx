export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Our Team</h1>
      <p className="text-gray-600 mb-6">Have questions? Reach out to us below.</p>
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md text-center">
        <p className="font-semibold">Email: support@company.com</p>
        <p className="mt-2 text-blue-600">Response time: Within 24 hours</p>
      </div>
    </div>
  );
}