A Practical Mental Model for Accessibility

Think about accessibility in three layers:

1. Input – How users control the interface
2. Perception – How users receive information
3. Understanding – How users comprehend and complete tasks

These map nicely to WCAG:

Layer	WCAG Principle
Perception	Perceivable
Input	Operable
Understanding	Understandable
System reliability	Robust

But developers often reason more easily about user modes like the ones you listed.

Accessibility by User Mode

Your categories are excellent. We can map WCAG criteria to them.

1. Screen Reader Users

These users rely on semantic structure and accessible names.

Key needs:

Meaningful structure

Text alternatives

Accessible names

Proper roles and relationships

Important WCAG Success Criteria:

WCAG SC	Title	Why it matters
1.1.1	Non-text Content	alt text for images
1.3.1	Info and Relationships	headings, lists, labels
1.3.2	Meaningful Sequence	reading order
2.4.6	Headings and Labels	navigation
2.4.4	Link Purpose	links make sense
4.1.2	Name, Role, Value	ARIA widgets
4.1.3	Status Messages	dynamic updates

Developer mental check:

Can someone understand this page without seeing it?

2. Keyboard-Only Users

Many users cannot use a mouse.

Includes:

mobility impairments

power users

screen reader users

Key needs:

everything reachable by keyboard

visible focus

logical tab order

Key WCAG SC:

WCAG SC	Title
2.1.1	Keyboard
2.1.2	No Keyboard Trap
2.4.3	Focus Order
2.4.7	Focus Visible
2.4.11	Focus Appearance (WCAG 2.2)
2.5.7	Dragging Movements
2.5.8	Target Size

Developer mental check:

Can I complete the entire task with Tab, Enter, and arrow keys?

3. Low Vision Users

These users:

zoom

enlarge text

use screen magnifiers

Needs:

resizable text

responsive layout

strong contrast

Key WCAG SC:

WCAG SC	Title
1.4.3	Contrast Minimum
1.4.4	Resize Text
1.4.10	Reflow
1.4.11	Non-text Contrast
1.4.12	Text Spacing
1.4.13	Content on Hover

Developer mental check:

Does the page still work at 200–400% zoom?

4. Color Vision Impairment

Color blindness affects ~8% of men.

Needs:

color not the only signal

clear visual differentiation

Key WCAG SC:

WCAG SC	Title
1.4.1	Use of Color
1.4.3	Contrast
1.4.11	Non-text Contrast

Developer mental check:

If I remove color, does the meaning remain clear?

Example:

error states

charts

required fields

5. Cognitive Impairments

This is one of the hardest areas.

Includes:

ADHD

dyslexia

memory challenges

learning disabilities

Needs:

predictable interactions

clear instructions

error prevention

Key WCAG SC:

WCAG SC	Title
3.2.3	Consistent Navigation
3.2.4	Consistent Identification
3.3.1	Error Identification
3.3.2	Labels or Instructions
3.3.3	Error Suggestion
3.3.4	Error Prevention
2.2.1	Timing Adjustable

Developer mental check:

If someone is confused, does the interface help them recover?

6. Hearing Impairment

Needs:

captions

transcripts

visual equivalents

Key WCAG SC:

WCAG SC	Title
1.2.2	Captions
1.2.3	Audio Description or Media Alternative
1.2.5	Audio Description

Developer mental check:

Can someone use this without hearing the audio?