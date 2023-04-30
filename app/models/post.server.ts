import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";

type Post = {
  slug: string;
  title: string;
};

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug: slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}

export async function editPost(post) {
  return prisma.post.update({
    where: {
      slug: post.slug
    },
    data: {
      title: post.title,
      slug: post.slug,
      markdown: post.markdown
    }
  })
}

export async function deletePost(slug) {
  return prisma.post.delete({
    where: {
      slug: slug,
    },
  });
}
