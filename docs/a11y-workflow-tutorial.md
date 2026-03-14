# A11y Workflow Tutorial

This will be an overview of Accessibility as applied to web development. My experience is in web software, so that will be the most fleshed out area, but I'd like to touch on all parts.

Each section should have a summary, references, and take aways.  Eventually, I might include a short 5 question multiple choice quiz at the end of each section, but that will be an add on later.

I'd like to use an example of a Meet the Team page with a list of doctors, nurses, etc. for the Maple Valley Health office.  Items on the list can be edited, deleted, added.  A form to add/edit will be part of the example that will be used throughout this tutorial.

I want to information to stand on its own and then have a separate page, let's apply our knowledge.

WebAIM conducts an assessment every year of the million top websites.  They found that 96% fall into six categories - I'd like to make sure that people walk away with an understanding of at least these issues
WCAG Failure Type	% of home pages
Low contrast text	79.1%
Missing alternative text for images	55.5%
Missing form input labels	48.2%
Empty links	45.4%
Empty buttons	29.6%
Missing document language	15.8%

I eventually will want to include some code snippets embedded in some of the pages

## Overview

I want to provide an overview of the tutorial, who it is for, how to use the companion demo

## What is Accessibility

This should include a general definition

There are a few quotes, I'd like to include - need to find the exact quote and who said it

- “Accessibility: Essential for some, useful for all.”  from Shawn Lawton Henry, W3C Web Accessibility Initiative (WAI) Program Lead
- Disabilities are something that anyone can be a member of
- "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect,"  by Tim Berners-Lee, W3C Director and inventor of the World Wide Web. 1997


Users who rely on accessible experiences - give example of user's disabilities with links to W3c user personas and videos

Mental models

- Someone with xyz disability wouldn't ever use our website
- If I can't count who is using our site, why should I invest in making it accessible?
- Harm - if someone can't use the site, what is the harm?  Critical medical, banking, school sites for their children
- Making something accessible takes too much time and is costly
- Remember early days of mobile devices where so much rework was done to make something responsive and then mobile first practices started.
- Permanent, temporary, situational
- accessibility is someone else's job
- Accessibility limits creativity

Accessible devices - By disability type, list accessible devices uses and a couple of aspects that they rely on in terms of accessibility

WCAG - what is it.  Make sure to point out that it is the law and an international standard

ARIA - guidelines from W3C

While talking about WCAG and Aria, talk a little bit about W3C

## WCAG mapped to assistive devices

There are a lot of maps and checklists of the WCAG success criteria, I'd like to present a disability focused way of thinking about WCAG.  I had brainstormed this with Chatgpt - see the doc wcag-mapping.md for initial thoughts.

## Workflow sections

### User Research

I want to emphasize here how important it is to include users with disabilities.  There are some sites who offer people with disabilities who can navigate a site with assistive devices, but I want to emphasize that they aren't users.  I'd like to give an example where you wouldn't walk up to a random person who uses and iPhone and ask them to test your site.

### Product Management & Design

Use Figma annotations
Design for the rotor menu

Use AI assitance to review designs for accessibility, grounding in trusted resources

Use AI assistance to add accessible requirements

Request and give demos using assistive technologies - keyboard, screen reader

Accessibility - usability + device compatability + standards (WCAG)

Think about someone going through using a keyboard

Colors  - contrast finder - Source: https://app.contrast-finder.org/?lang=en


### Development

Use semantic HTML
“No ARIA is better than bad ARIA.” — W3C WAI-ARIA Authoring Practices

Guidance for AI assistants - provide vercel skills

Enable PR bot review tools

Create an accessibility doc in the repo

#### Tools

jest-axe
biome
eslint-plugin-jsx-a11y
playwright-axe

Biome vs eslint-plugin-jsx-a11y vs axe-core

static analysis vs tests - render page (no styles) vs tests - render page (with styels)

Storybook

chrome dev tools - accessibility tree

### Testing

Screen readers
axe-dev
wave - web aim
andi

### Monitoring

ci
playwright tests on the production site


### Getting User Feedback

User feedback
Accessibility statement


## Resources

Fundamentals
W3C - Introduction to Web Accessibility - https://www.w3.org/WAI/fundamentals/accessibility-intro/
W3C - User Stories - https://www.w3.org/WAI/people-use-web/user-stories/
W3C - How to Meet WCAG (Quick Reference) - https://www.w3.org/WAI/WCAG22/quickref/
Intopia - WCAG 2.2 Map - https://intopia.digital/wp-content/uploads/2023/12/Intopia-WCAG-2.2-Map-Landscape-version.pdf
W3C - Aria Authoring Practices Guide (APG) - https://www.w3.org/WAI/ARIA/apg/
W3C - ARIA - https://www.w3.org/TR/wai-aria/


Keyboard Navigation and Screen Reader
Web Aim Keyboard Accessibility - https://webaim.org/techniques/keyboard/
Deque Screen Reader keyboard Shortcuts and Gestures: https://dequeuniversity.com/screenreaders/

Legal and ISO Standard
ADA - https://www.ada.gov/resources/2024-03-08-web-rule/
W3C ISO Standard Announcement - https://www.w3.org/WAI/news/2025-10-21/wcag22-iso/

Fundamentals
W3C - Introduction to Web Accessibility - https://www.w3.org/WAI/fundamentals/accessibility-intro/
W3C - User Stories - https://www.w3.org/WAI/people-use-web/user-stories/
W3C - How to Meet WCAG (Quick Reference) - https://www.w3.org/WAI/WCAG22/quickref/
Intopia - WCAG 2.2 Map - https://intopia.digital/wp-content/uploads/2023/12/Intopia-WCAG-2.2-Map-Landscape-version.pdf
W3C - Aria Authoring Practices Guide (APG) - https://www.w3.org/WAI/ARIA/apg/
W3C - ARIA - https://www.w3.org/TR/wai-aria/


Keyboard Navigation and Screen Reader
Web Aim Keyboard Accessibility - https://webaim.org/techniques/keyboard/
Deque Screen Reader keyboard Shortcuts and Gestures: https://dequeuniversity.com/screenreaders/

Legal and ISO Standard
ADA - https://www.ada.gov/resources/2024-03-08-web-rule/
W3C ISO Standard Announcement - https://www.w3.org/WAI/news/2025-10-21/wcag22-iso/