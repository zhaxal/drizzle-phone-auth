import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome to BetterAuth
        </h1>

        {data ? (
          <div className="text-center">
            <p className="text-lg mb-4">You are logged in as:</p>
            <p className="font-semibold">{data.user?.email}</p>
            <p className="text-sm text-gray-500">{data.user?.id}</p>

            <button
              onClick={() => authClient.signOut()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg mb-4">You are not logged in.</p>
            <a href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </div>
        )}
        <div className="mt-8 text-center">
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
