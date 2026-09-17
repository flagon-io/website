# flagon.io

The [Flagon, Inc.](https://www.flagon.io) company site, built in the open. One
Next.js app holds the marketing site, the public [handbook](https://www.flagon.io/handbook),
the [blog](https://www.flagon.io/blog), and the product docs, including a live
[API reference](https://www.flagon.io/docs/api). The content is Markdown/MDX you
can read, edit, and send a pull request against.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3001
```

Node 24 (see [`.nvmrc`](.nvmrc) and the `engines` field in `package.json`).

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npm run typecheck
```

## What's in here

- **Marketing site**: home, about, pricing, products, careers, and the rest of the public pages.
- **The handbook** (`/handbook`): the company's operating manual and source of truth, around 60 MDX pages, including the brand guidelines (`/brand` redirects into it).
- **The blog** (`/blog`).
- **Docs** (`/docs`), including a bespoke **API reference** (`/docs/api`) generated live from the OpenAPI document the API publishes.

## Project structure

```text
content/
  handbook/          # the company handbook, one .mdx per page
  blog/              # blog posts, one .mdx per post
src/
  app/               # routes (home, /about, /handbook, /blog, /docs, /pricing, ...)
    docs/api/        # the API reference route, its spec proxy, and Try-it proxy
  brand/             # the Flagon mark (SVG component)
  components/        # site chrome, MDX rendering, and the api/ reference components
  lib/               # content loaders and config (handbook.ts, blog.ts, openapi.ts, site.ts)
```

## Authoring content

### A handbook page

Create `content/handbook/<slug>.mdx`:

```mdx
---
title: How we work
description: The way we operate, day to day.
section: How we work
order: 1
---

Body goes here. Use `##` and `###` headings; the page renders its own H1.

<Callout type="brand" title="A pull-quote or aside">
  Callouts (type: brand | note | warn) are available in MDX without importing them.
</Callout>
```

Pages are grouped and ordered by the `section` and `order` fields. The section
order itself, and which sections are collapsible or marked "soon", lives in
[`src/lib/handbook.ts`](src/lib/handbook.ts). Only the `Chapters` section is numbered.

### A blog post

Create `content/blog/<slug>.mdx`:

```mdx
---
title: Starting Flagon
description: Why we're doing this, and doing it in the open.
date: 2026-06-15
author: Chase Pierce
role: Founder
tags: [company]
---

Body goes here.
```

Posts are sorted newest-first by `date`.

### Two things that will bite you

- **Quote any frontmatter value containing a colon-space.** `description: How we work: the details` breaks the YAML parse and the page loses its title, section, and order. Wrap it in double quotes: `description: "How we work: the details"`.
- **No em dashes or en dashes in prose.** House style uses commas, colons, and periods instead. Write in the present tense, as a company that exists and does what it says. The full voice is in the handbook's brand pages (`/handbook/brand-voice`).

New content files are read from disk, so the dev server may need a restart to
pick up a brand-new `.mdx` file in the handbook nav (edits to existing files
hot-reload fine).

## The API reference

`/docs/api` renders the OpenAPI document from `api.flagon.io`, proxied through
`/docs/api/spec` (same-origin, cached, revalidated) so it stays current and
sidesteps CORS. The renderer is hand-built (see [`src/lib/openapi.ts`](src/lib/openapi.ts)
and [`src/components/api/`](src/components/api/)): markdown descriptions,
recursive schema view, syntax-colored request/response examples, a filterable
scrollspy nav, authentication and models sections, a server switcher, and a live
"Try it" console.

While the spec has no paths, the page shows a "building in the open" state; the
full explorer activates on its own as endpoints ship. Try-it requests are
forwarded by [`/docs/api/proxy`](src/app/docs/api/proxy/route.ts), which only
targets the origins the spec itself declares (no open proxy) and adds no
credentials of its own; the viewer's token lives in their browser.

## Theming

Dark mode is class-based: a `.dark` class on `<html>`, set before first paint by
an inline script so there is no flash. Design tokens and the brand palette are
tokens in [`src/app/globals.css`](src/app/globals.css). The Flagon mark and the
theme are self-contained, so there are no private packages and nothing to
install beyond what is in `package.json`.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Tailwind CSS v4](https://tailwindcss.com)
- MDX via [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote) with
  `remark-gfm`, slugged and linkable headings, and Shiki code highlighting
- `react-markdown` for OpenAPI description fields

## Deploy

It is a standard Next.js App Router app and deploys to Vercel (or any Node 24
host) with `npm run build`. There is no bespoke build step.

## License

MIT, see [LICENSE](LICENSE). The words are ours; the code is yours to learn from.
