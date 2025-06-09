import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { authClient } from "@/lib/auth-client";
import { db } from "@/lib/database";
import { postsTable } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";

type MainPageProps = {
  posts: {
    post: {
      id: number;
      title: string;
      content: string;
      authorId: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  }[];
};

export const getServerSideProps = (async (context) => {
  const res = await db
    .select()
    .from(postsTable)
    .leftJoin(user, eq(postsTable.authorId, user.id));

  if (!res) {
    return {
      notFound: true,
    };
  }

  const posts = res.map((p) => ({
    post: {
      id: p.posts.id,
      title: p.posts.title,
      content: p.posts.content,
      authorId: p.posts.authorId,
    },
    user: p.user
      ? {
          id: p.user.id,
          name: p.user.name,
          email: p.user.email,
        }
      : null,
  }));

  return {
    props: {
      posts,
    },
  };
}) satisfies GetServerSideProps<MainPageProps>;

export default function HomePage({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = authClient.useSession();

  const handleCreatePost = async () => {
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Your post title",
          content: "Your post content",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      alert(data.message || "Post created successfully");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

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

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <ul className="space-y-4">
                {posts.map((p) => (
                  <li key={p.post.id} className="p-4 bg-gray-50 rounded shadow">
                    <h3 className="font-bold">{p.post.title}</h3>
                    <p>{p.post.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {p.user
                        ? `By ${p.user.name} (${p.user.email})`
                        : "Unknown Author"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handleCreatePost}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Post
              </button>

              <button
                onClick={() => authClient.signOut()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Out
              </button>
            </div>
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
