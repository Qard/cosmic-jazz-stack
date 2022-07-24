import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react"
import * as React from "react"

import { createUserSession, getUserId } from "~/session.server"
import { verifyLogin } from "~/models/user.server"
import { safeRedirect, validateEmail } from "~/utils"

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect("/")
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes")
  const remember = formData.get("remember")

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    )
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    )
  }

  const user = await verifyLogin(email, password)

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    )
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  })
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  }
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/notes"
  const actionData = useActionData<typeof action>()
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <div className="section is-large is-half">
            <Form method="post" className="box">
              <div className="field">
                <label
                  htmlFor="email"
                  className="label"
                >
                  Email Address
                </label>
                <div className={"control has-icons-left" + (actionData?.errors?.email ? " has-icons-right" : "")}>
                  <input
                    ref={emailRef}
                    id="email"
                    required
                    autoFocus={true}
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={actionData?.errors?.email ? true : undefined}
                    aria-describedby="email-error"
                    className="input"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                  {actionData?.errors?.email && (
                    <span className="icon is-small is-right">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  )}
                </div>
                {actionData?.errors?.email && (
                  <p className="help is-danger">
                    {actionData.errors.email}
                  </p>
                )}
              </div>

              <div className="field">
                <label
                  htmlFor="password"
                  className="label"
                >
                  Password
                </label>
                <div className={"control has-icons-left" + (actionData?.errors?.password ? " has-icons-right" : "")}>
                  <input
                    id="password"
                    ref={passwordRef}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={actionData?.errors?.password ? true : undefined}
                    aria-describedby="password-error"
                    className={"input" + (actionData?.errors?.password ? " is-danger" : "")}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-key"></i>
                  </span>
                  {actionData?.errors?.password && (
                    <span className="icon is-small is-right">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  )}
                </div>
                {actionData?.errors?.password && (
                  <p className="help is-danger">
                    {actionData.errors.password}
                  </p>
                )}
              </div>

              <div className="field">
                <div className="control">
                  <label htmlFor="remember" className="checkbox">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                    />
                    Remember me
                  </label>
                </div>
              </div>

              <input type="hidden" name="redirectTo" value={redirectTo} />

              <div className="field">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-link is-fullwidth"
                  >
                    Log In
                  </button>
                </div>
              </div>

              <div className="field">
                <div className="control">
                  Don't have an account?{" "}
                  <Link
                    className="text-blue-500 underline"
                    to={{
                      pathname: "/join",
                      search: searchParams.toString(),
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
