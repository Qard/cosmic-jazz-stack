import { Link } from "@remix-run/react"

import { useOptionalUser } from "~/utils"

export default function Index() {
  const user = useOptionalUser()
  return (
    <main className="container">
      <div className="section">
        <div className="hero is-medium is-primary">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title is-primary">
                Cosmic Jazz Stack
              </h1>
              <p className="subtitle">
                Check the README.md file for instructions on how to get this
                project deployed.
              </p>
              {user ? (
                <div className="field">
                  <div className="control">
                    <Link to="/notes" className="button">
                      View Notes for {user.email}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="field is-grouped is-grouped-centered">
                  <div className="control">
                    <Link to="/join" className="button">
                      Sign up
                    </Link>
                  </div>
                  <div className="control">
                    <Link to="/login" className="button is-primary">
                      Log In
                    </Link>
                  </div>
                </div>
              )}
              <a href="https://remix.run" className="image is-128x128 is-inline-block mt-6">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="logos">
          {[
            {
              src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
              alt: "Fly.io",
              href: "https://fly.io",
            },
            {
              src: "http://archaeogeek.github.io/UCL2014_talk/images/postgresql_logo.png",
              alt: "PostgreSQL",
              href: "https://postgresql.org",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
              alt: "Prisma",
              href: "https://prisma.io",
            },
            {
              src: "https://bulma.io/images/bulma-logo.png",
              alt: "Bulma",
              href: "https://bulma.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
              alt: "Cypress",
              href: "https://www.cypress.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
              alt: "MSW",
              href: "https://mswjs.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
              alt: "Vitest",
              href: "https://vitest.dev",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
              alt: "Testing Library",
              href: "https://testing-library.com",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
              alt: "Prettier",
              href: "https://prettier.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
              alt: "ESLint",
              href: "https://eslint.org",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
              alt: "TypeScript",
              href: "https://typescriptlang.org",
            },
          ].map((img) => (
            <a key={img.href} href={img.href} className="image m-2 p-4 is-inline-block">
              <img alt={img.alt} src={img.src} />
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
