import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import type { ActionArgs } from "@remix-run/node";
import { editPost, deletePost } from "~/models/post.server";
import { useState } from "react";



export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "Params.slug is required");
  const post = await getPost(params.slug);
  invariant(post, `404 - Post not found: ${params.slug}`);

  return json({ post });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");
  const btnAction = formData.get("_action");

  const errors = {
    title: title ? null : " - Title is required",
    slug: slug ? null : " - Slug is required",
    markdown: markdown ? null : " - Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "Title must be a string");
  invariant(typeof slug === "string", "Slug must be a string");
  invariant(typeof markdown === "string", "Markdown must be a string");

  console.log('btnAction value', btnAction)

  if (btnAction === 'delete') {
  await deletePost(slug)
  }

  if (btnAction === 'edit') {
    await editPost({ title, slug, markdown })
  }

  return redirect("/posts/admin");
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function AdminPostSlug() {
  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [markdown, setMarkdown] = useState(post.markdown)

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        <span className="text-red-600">Edit/Delete: </span>
        {post.title}
      </h1>
      <Form method="post">
        <p>
          <label>
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              value={title}
              onChange={evt => setTitle(evt.target.value)}
              type="text"
              name="title"
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              value={slug}
              onChange={evt => setSlug(slug)}
              type="text"
              name="slug"
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:{" "}
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            value={markdown}
            onChange={evt => setMarkdown(evt.target.value)}
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
          />
        </p>
        <p className="text-right">
          <button
            name="_action"
            value="delete"
            type="submit"
            className="rounded bg-red-500 m-2 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isCreating}
          >
            {isCreating ? "Deleting..." : "Delete Post"}
          </button>
          <button
            name="_action"
            value="edit"
            type="submit"
            className="rounded bg-blue-500 mt-2 ml-2 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isCreating}
          >
            {isCreating ? "Editing..." : "Edit Post"}
          </button>
        </p>
      </Form>
    </main>
  );
}
