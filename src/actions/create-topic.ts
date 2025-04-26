"use server";

import { db } from "@/db";
import paths from "@/helpers/paths";
import { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    form?: string[];
  };
}

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

export const createTopic = async (
  _formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> => {
  const name = formData.get("name");
  const description = formData.get("description");

  // Validation
  const result = createTopicSchema.safeParse({ name, description });

  // Throw validation errors
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // Request
  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
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

    return {
      errors: {
        form: ["Something went wrong"],
      },
    };
  }

  // Revalidate to update cache
  revalidatePath("/");

  // It must be place as the last thing to be running within the server function
  redirect(paths.topicShow(topic.slug));

  return { errors: {} };
};
