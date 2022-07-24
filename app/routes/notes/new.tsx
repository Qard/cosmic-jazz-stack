import type { ActionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import * as React from "react"

import { createNote } from "~/models/note.server"
import { requireUserId } from "~/session.server"

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const title = formData.get("title")
  const body = formData.get("body")

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    )
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required" } },
      { status: 400 }
    )
  }

  const note = await createNote({ title, body, userId })

  return redirect(`/notes/${note.id}`)
}

export default function NewNotePage() {
  const actionData = useActionData<typeof action>()
  const titleRef = React.useRef<HTMLInputElement>(null)
  const bodyRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus()
    }
  }, [actionData])

  return (
    <Form method="post">
      <div className="field">
        <label className="label">
          <span>Title</span>
        </label>
        <div className="control">
          <input
            ref={titleRef}
            name="title"
            className="input"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </div>
        {actionData?.errors?.title && (
          <p className="help is-danger" id="title-error">
            {actionData.errors.title}
          </p>
        )}
      </div>

      <div className="field">
        <label className="label">
          <span>Body</span>
        </label>
        <div className="control">
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="textarea"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </div>
        {actionData?.errors?.body && (
          <p className="help is-danger" id="body-error">
            {actionData.errors.body}
          </p>
        )}
      </div>

      <div className="field">
        <div className="control">
          <button
            type="submit"
            className="button is-primary"
          >
            Save
          </button>
        </div>
      </div>
    </Form>
  )
}
