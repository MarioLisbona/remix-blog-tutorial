import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { marked } from "marked";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "Params.slug is required");
  const post = await getPost(params.slug);
  invariant(post, `404 - Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json({ post, html });
};

export default function AdminPostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </main>
  );
}
