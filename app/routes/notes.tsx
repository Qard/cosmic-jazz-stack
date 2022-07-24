import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react"

import { requireUserId } from "~/session.server"
import { useUser } from "~/utils"
import { getNoteListItems } from "~/models/note.server"

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const noteListItems = await getNoteListItems({ userId })
  return json<LoaderData>({ noteListItems })
}

export default function NotesPage() {
  const data = useLoaderData() as LoaderData
  const user = useUser()

  return (
    <div className="is-flex is-flex-direction-column is-fullheight">
      <nav className="navbar is-primary">
        <div className="navbar-brand">
          <Link to="." className="navbar-item">
            Notes
          </Link>
          <span role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </span>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item">{user.email}</div>
          </div>
          <div className="navbar-end">
            <Form action="/logout" method="post" className="navbar-item">
              <button
                type="submit"
                className="button"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </nav>

      <main className="columns">
        <aside className="column is-2 p-5 menu">
          <Link to="new" className="button is-primary">
            + New Note
          </Link>

          <p className="menu-label">
            Notes
          </p>

          <ul className="menu-list">
            {data.noteListItems.length === 0 ? (
              <li>No notes yet</li>
            ) : (
              data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "is-active" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))
            )}
          </ul>
        </aside>

        <div className="column p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
