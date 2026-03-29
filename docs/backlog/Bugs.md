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