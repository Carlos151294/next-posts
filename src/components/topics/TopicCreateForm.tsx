"use client";

import { createTopic } from "@/actions";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@heroui/react";
import { startTransition, useActionState } from "react";
import FormButton from "./FormButton";

export const TopicCreateForm = () => {
  const [formState, action, isPending] = useActionState(createTopic, {
    // initial state for formState
    errors: {},
  });

  // We could pass directly the action as the form submit handler but there's a but
  // that get forms reset after submission by default
  // To solve this, we create this handleSubmit
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button color="primary">Create Topic</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name" // adds name property to FormData
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              isInvalid={!!formState.errors.name}
              errorMessage={
                <div className="flex flex-col">
                  {formState.errors.name?.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </div>
              }
            />
            <Textarea
              name="description" // adds description property to FormData
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.join(", ")}
            />

            {formState.errors.form ? (
              <div className="rounded p-2 bg-red-200 border border-red-400">
                {formState.errors.form?.join(", ")}
              </div>
            ) : null}

            <FormButton isLoading={isPending}>Save</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
