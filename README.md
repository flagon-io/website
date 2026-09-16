# flagon.io

The [Flagon, Inc.](https://www.flagon.io) company site — the homepage, the
[handbook](https://www.flagon.io/handbook), and the
[blog](https://www.flagon.io/blog). We build in the open, and that includes the
website you're looking at the source of right now.

It's one thing, treated like a product: the marketing site, the company
handbook, and the blog all live in this repo. Content is Markdown/MDX you can
read, edit, and send a pull request against.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Tailwind CSS v4](https://tailwindcss.com) with a small, self-contained brand
  theme (see [`src/app/globals.css`](src/app/globals.css))
- MDX content via [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote),
  with `remark-gfm`, slugged/linkable headings, and Shiki code highlighting
- The Flagon mark and design tokens are inlined — no private packages, nothing
  to install beyond what's in `package.json`

## Layout

```text
content/
  handbook/     # the company handbook, one .mdx per page
  blog/         # blog posts, one .mdx per post
src/
  app/          # routes: home, /about, /brand, /handbook, /blog
  brand/        # the Flagon mark (SVG component)
  components/   # site chrome + MDX rendering
  lib/          # content loaders, site config
```

## Content

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
```

Sections are grouped and ordered by the `section` and `order` fields. The
section order itself lives in [`src/lib/handbook.ts`](src/lib/handbook.ts).

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

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npm run typecheck
```

Node 24 (see [`.nvmrc`](.nvmrc)).

## License

MIT — see [LICENSE](LICENSE). The words are ours; the code is yours to learn from.
