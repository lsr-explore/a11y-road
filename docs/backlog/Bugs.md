# Bugs

- [ ] When running

```js
Error: Static generation failed due to dynamic usage on /maple-valley-health/contact, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/editor/definitions, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/editor/instances, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/editor/issue-sets, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/evaluation, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/getting-started, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/editor, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/team/add, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/team, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at h (apps/a11y-road/.next/server/app/page.js:2:11774)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /login, reason: `await searchParams`, `searchParams.then`, or similar
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at Object.get (apps/a11y-road/.next/server/chunks/7888.js:42:44548)
    at l (apps/a11y-road/.next/server/app/login/page.js:2:10371)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /site-auth, reason: `await searchParams`, `searchParams.then`, or similar
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at Object.get (apps/a11y-road/.next/server/chunks/7888.js:42:44548)
    at j (apps/a11y-road/.next/server/app/site-auth/page.js:2:10554)
    at stringify (<anonymous>)
Error: Static generation failed due to dynamic usage on /maple-valley-health/a11y-summary, reason: cookies
    at y (apps/a11y-road/.next/server/chunks/1755.js:1:84470)
    at n (apps/a11y-road/.next/server/chunks/9946.js:1:3365)
    at j (apps/a11y-road/.next/server/chunks/1588.js:1:2459)
    at g (apps/a11y-road/.next/server/chunks/1588.js:1:50341)
    at stringify (<anonymous>)
```

- [ ] when running pnpm:coverage, seeing the following error

```js
Failed to parse file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/apps/a11y-road/src/components/tutorial/tutorial-layout-shell.tsx. Excluding it from coverage.
 Error [RolldownError]: Parse failed with 1 error:
Expected a semicolon or an implicit semicolon after a statement, but found none
 7: } from '@a11y-road/a11y-ui/components/ui/sidebar';
 8:
 9: interface TutorialLayoutShellProps {
             ^
10:   sidebar: React.ReactNode;
11:   header: React.ReactNode;
    at error (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/shared/logs-D80CXhvg.mjs:147:24)
    at normalizeParseError (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/parse-ast-index.mjs:25:9)
    at wrap (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/parse-ast-index.mjs:5:39)
    at parseAstAsync (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/parse-ast-index.mjs:54:9)
    at V8CoverageProvider.remapCoverage (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:133:10)
    at file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:119:23
    at async Promise.all (index 0)
    at V8CoverageProvider.getCoverageMapForUncoveredFiles (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:109:4)
    at V8CoverageProvider.generateCoverage (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:56:29)
    at file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@8.0.2_@types+node@25.5.0_e_4kxurlaccx5pwvy3vhafhb737u/node_modules/vitest/dist/chunks/cli-api.BUXBO6jS.js:13567:23 {
  code: 'PARSE_ERROR',
  id: undefined,
  pos: 138
}
Failed to parse file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/apps/a11y-road/src/components/tutorial/tutorial-sidebar.tsx. Excluding it from coverage.
 Error [RolldownError]: Parse failed with 1 error:
Expected `,` or `)` but found `:`
41:   }, [pathname]);
42:
43:   const toggleExpanded = (slug: string) => {
                                  ^
44:     setExpandedSlugs((prev) => {
45:       const next = new Set(prev);
41:   }, [pathname]);
42:
43:   const toggleExpanded = (slug: string) => {
                             ^
44:     setExpandedSlugs((prev) => {
45:       const next = new Set(prev);
    at error (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/shared/logs-D80CXhvg.mjs:147:24)
    at normalizeParseError (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/parse-ast-index.mjs:25:9)
    at wrap (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/parse-ast-index.mjs:5:39)
    at parseAstAsync (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/rolldown@1.0.0-rc.11/node_modules/rolldown/dist/parse-ast-index.mjs:54:9)
    at V8CoverageProvider.remapCoverage (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:133:10)
    at file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:119:23
    at async Promise.all (index 1)
    at V8CoverageProvider.getCoverageMapForUncoveredFiles (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:109:4)
    at V8CoverageProvider.generateCoverage (file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/@vitest+coverage-v8@4.1.1_vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@_sbzz5nef2gqakgameohzi4oh5m/node_modules/@vitest/coverage-v8/dist/provider.js:56:29)
    at file:///Users/laurie/dev/a11y-workflow/prs/tutorial-prs/a11y-road/node_modules/.pnpm/vitest@4.1.1_@types+node@25.5.0_@vitest+ui@4.1.1_jsdom@29.0.1_vite@8.0.2_@types+node@25.5.0_e_4kxurlaccx5pwvy3vhafhb737u/node_modules/vitest/dist/chunks/cli-api.BUXBO6jS.js:13567:23 {
  code: 'PARSE_ERROR',
  id: undefined,
  pos: 1239
}
```