3/22 - Conversation with Claude

I would think it is hard to come up with a color palette without an
external tool to help with checking.  Figma has a bunch of plugins that
check for contrast ratios.  It might be that writing and running a
playwright test using playwright axe is the best way to be assured of
delivering a sit that meets the contrast ratio requirements.  I also
think that you were right earlier, a checklist would be a stronger way to
 support accessible development.  It is hard because development teams
are always asking for checklists, but what some teams don't understand is
 that delivering against a checklist doesn't always deliver an accessible
 site.

An example is that you added the "add team member" button at the top of
the page area.  This is good for keyboard navigation.  Some teams put it
at the bottom of the list which would require someone who uses a
keyboard/screen reader to navigate a bunch of extra navigation just to
add a team member.  This type of empathy and recognition is hard to
capture in a checklist.

--------------------

Claude's response

⏺ That's a really sharp distinction. There are essentially two layers to
  accessible development:

  1. Mechanically verifiable — contrast ratios, missing alt text, missing
  labels, heading hierarchy. Automated tools like Playwright + axe-core
  catch these reliably. A checklist works here because the criteria are
  binary.
  2. Design intent and empathy — where to place the action button, what
  the tab order should be, whether a keyboard user's journey is reasonable
   vs. technically possible. No checklist or automated test catches "the
  button works but it's in a terrible place."

  Your button placement example is perfect. A checklist item like
  "interactive elements are keyboard accessible" would pass in both cases
  — button at top or bottom. But the lived experience is completely
  different. That's the kind of knowledge that lives in guidance like your
   accessibility-first rules doc, not in a checklist.

  Maybe the sweet spot for AI code generation is both: a checklist for the
   mechanical layer (and Playwright axe tests to enforce it), plus the
  principles doc for the design-judgment layer. The first run of your
  evaluation might have shown that the principles doc alone doesn't cover
  the mechanical side well enough — which makes sense, because "think
  about the accessibility tree first" doesn't tell you to pick colors with
   4.5:1 contrast.