# People-Based WCAG 2.2 Map

A companion to the Intopia WCAG 2.2 Map. Where Intopia organizes criteria by **Principle → Guideline → Success Criterion**, this map organizes by **User Group → Need → Success Criterion**.

Many criteria appear under multiple groups — this is intentional and reinforces how interconnected accessibility is. Shared criteria are noted.

---

## 1. Screen Reader Users

*Quick check: Can someone understand this without seeing it?*

### Structure & Semantics

| WCAG SC | Title | Level |
|---|---|---|
| 1.3.1 | Info and Relationships | A |
| 1.3.2 | Meaningful Sequence | A |
| 2.4.1 | Bypass Blocks | A |
| 2.4.6 | Headings and Labels | AA |
| 2.4.10 | Section Headings | AAA |

### Text Alternatives

| WCAG SC | Title | Level |
|---|---|---|
| 1.1.1 | Non-text Content | A |
| 1.2.1 | Audio-only and Video-only | A |
| 1.2.3 | Audio Description or Media Alternative | A |
| 1.2.5 | Audio Description | AA |
| 1.2.8 | Media Alternative | AAA |

### Links, Buttons & Names

| WCAG SC | Title | Level |
|---|---|---|
| 2.4.4 | Link Purpose in Context | A |
| 2.4.9 | Link Purpose Link Only | AAA |
| 4.1.2 | Name, Role, Value | A |

### Dynamic Content

| WCAG SC | Title | Level |
|---|---|---|
| 4.1.3 | Status Messages | AA |
| 1.3.6 | Identify Purpose | AAA |

### Tables & Data

| WCAG SC | Title | Level | Notes |
|---|---|---|---|
| 1.3.1 | Info and Relationships | A | Table headers, data cell associations |

---

## 2. Keyboard-Only Users

*Quick check: Can I complete the entire task with Tab, Enter, and arrow keys?*

### Reachability

| WCAG SC | Title | Level |
|---|---|---|
| 2.1.1 | Keyboard | A |
| 2.1.2 | No Keyboard Trap | A |
| 2.1.4 | Character Key Shortcuts | A |
| 2.5.7 | Dragging Movements | AA |

### Focus

| WCAG SC | Title | Level |
|---|---|---|
| 2.4.3 | Focus Order | A |
| 2.4.7 | Focus Visible | AA |
| 2.4.11 | Focus Not Obscured Minimum | AA |
| 2.4.12 | Focus Not Obscured Enhanced | AAA |
| 2.4.13 | Focus Appearance | AAA |
| 3.2.1 | On Focus | A |

### Interaction

| WCAG SC | Title | Level | Notes |
|---|---|---|---|
| 2.5.1 | Pointer Gestures | A | Keyboard alternatives required |
| 2.5.2 | Pointer Cancellation | A | |
| 2.5.4 | Motion Actuation | A | Keyboard alternatives required |
| 2.5.8 | Target Size Minimum | AA | |

---

## 3. Low Vision Users

*Quick check: Does the page still work at 200–400% zoom?*

### Contrast

| WCAG SC | Title | Level | Shared with |
|---|---|---|---|
| 1.4.3 | Contrast Minimum | AA | Color Vision |
| 1.4.6 | Contrast Enhanced | AAA | Color Vision |
| 1.4.11 | Non-text Contrast | AA | Color Vision |

### Resize & Reflow

| WCAG SC | Title | Level |
|---|---|---|
| 1.4.4 | Resize Text | AA |
| 1.4.10 | Reflow | AA |
| 1.4.12 | Text Spacing | AA |

### Hover & Visibility

| WCAG SC | Title | Level | Shared with |
|---|---|---|---|
| 1.4.13 | Content on Hover or Focus | AA | |
| 2.4.7 | Focus Visible | AA | Keyboard |
| 2.4.11 | Focus Not Obscured Minimum | AA | Keyboard |
| 2.5.8 | Target Size Minimum | AA | Keyboard |

### Images of Text

| WCAG SC | Title | Level |
|---|---|---|
| 1.4.5 | Images of Text | AA |
| 1.4.9 | Images of Text No Exception | AAA |

---

## 4. Color Vision Differences

*Quick check: If I remove color, does the meaning remain clear?*

### Color Independence

| WCAG SC | Title | Level |
|---|---|---|
| 1.4.1 | Use of Color | A |

### Contrast

| WCAG SC | Title | Level | Shared with |
|---|---|---|---|
| 1.4.3 | Contrast Minimum | AA | Low Vision |
| 1.4.6 | Contrast Enhanced | AAA | Low Vision |
| 1.4.11 | Non-text Contrast | AA | Low Vision |

---

## 5. Cognitive & Neurological Differences

*Quick check: If someone is confused, does the interface help them recover?*

### Predictability

| WCAG SC | Title | Level |
|---|---|---|
| 3.2.1 | On Focus | A |
| 3.2.2 | On Input | A |
| 3.2.3 | Consistent Navigation | AA |
| 3.2.4 | Consistent Identification | AA |
| 3.2.6 | Consistent Help | A |

### Input Assistance

| WCAG SC | Title | Level |
|---|---|---|
| 3.3.1 | Error Identification | A |
| 3.3.2 | Labels or Instructions | A |
| 3.3.3 | Error Suggestion | AA |
| 3.3.4 | Error Prevention Legal/Financial/Data | AA |
| 3.3.7 | Redundant Entry | A |
| 3.3.8 | Accessible Authentication Minimum | AA |
| 3.3.9 | Accessible Authentication Enhanced | AAA |

### Time & Navigation

| WCAG SC | Title | Level | Shared with |
|---|---|---|---|
| 2.2.1 | Timing Adjustable | A | |
| 2.2.2 | Pause, Stop, Hide | A | |
| 2.2.6 | Timeouts | AAA | |
| 2.4.5 | Multiple Ways | AA | |
| 2.4.6 | Headings and Labels | AA | Screen Readers |

### Readability

| WCAG SC | Title | Level |
|---|---|---|
| 3.1.3 | Unusual Words | AAA |
| 3.1.4 | Abbreviations | AAA |
| 3.1.5 | Reading Level | AAA |

### Seizure & Motion

| WCAG SC | Title | Level |
|---|---|---|
| 2.3.1 | Three Flashes or Below Threshold | A |
| 2.3.2 | Three Flashes | AAA |
| 2.3.3 | Animation from Interactions | AAA |

---

## 6. Deaf & Hard of Hearing Users

*Quick check: Can someone use this without hearing the audio?*

### Captions

| WCAG SC | Title | Level |
|---|---|---|
| 1.2.2 | Captions Prerecorded | A |
| 1.2.4 | Captions Live | AA |

### Transcripts & Alternatives

| WCAG SC | Title | Level | Shared with |
|---|---|---|---|
| 1.2.1 | Audio-only and Video-only | A | Screen Readers |
| 1.2.3 | Audio Description or Media Alternative | A | |
| 1.2.8 | Media Alternative | AAA | |

### Sign Language

| WCAG SC | Title | Level |
|---|---|---|
| 1.2.6 | Sign Language Prerecorded | AAA |

### Visual Equivalents

| WCAG SC | Title | Level | Notes |
|---|---|---|---|
| 1.3.3 | Sensory Characteristics | A | Don't rely on sound alone for instructions |

---

## Visual Design Notes

Suggested layout for the visual version:

- **6 columns** — one per user group
- **Rows grouped by need** (sub-categories above)
- **Shared criteria** highlighted with a connecting color or indicator to show overlap between groups
- **Conformance levels** color-coded: A (green), AA (blue), AAA (purple) or similar
- Complements the Intopia map: Intopia answers "what does WCAG say?" — this map answers "who does each criterion help?"
