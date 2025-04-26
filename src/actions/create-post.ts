"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/helpers/paths";
import { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    form?: string[];
  };
}

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

export const createPost = async (
  slug: string,
  _formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> => {
  const title = formData.get("title");
  const content = formData.get("content");

  const result = createPostSchema.safeParse({ title, content });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();
  if (!session || !session.user || !session.user?.id) {
    return {
      errors: {
        form: ["You must be signed in to do this"],
      },
    };
  }

  const topic = await db.topic.findFirst({
    where: { slug },
  });

  if (!topic) {
    return { errors: { form: ["Cannot find topic"] } };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id as string,
        topicId: topic.id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          form: [error.message],
        },
      };
    }

    return { errors: { form: ["Failed to create post"] } };
  }

  // Revalidate topic show page
  revalidatePath(paths.topicShow(slug));

  redirect(paths.postShow(slug, post.id));

  return { errors: {} };
};
