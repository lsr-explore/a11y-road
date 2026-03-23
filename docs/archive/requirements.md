# Maple Valley Health Requirements

## Overview

This is an example site that will demonstrate accessibility errors and fixes.  It will also be used as a portfolio project that I will share with prospective employers.

This site will have a companion docusaurus site that will describe an accessibility workflow for development teams.

## Users

* People who want a demo site to see accessibility errors and fixes.  They will try to navigate the site using assistive devices to compare the experience.  
* Accessibility testers who want to test their ability to identify accessibility errors.  They will try to navigate the site using assistive devices and testing tools and will want to verify if they have found all the known issues on the site.
* Development teams - UX, Product, Frontend Developers will explore the site for the experience using assitive devices and testing tools and may inspect the code.
* Prospective employers.  I would like to showcase to prospective employers, my talents putting together a site that demonstrates a clean, navigable site that helps people understand accessibility.  It should be a secure site and well maintained, with quality checks and should be well organized using modern tech stack.  I will preface that this was created with the assistance of an AI Agent.

## Accessibility interaction overview

### Primary requirements

* There should be a way for the user to toggle accessibility on/off for the entire site.
  * A user can open the page in a different tab and have accessibility enabled for one tab, but not the other.
* A user should be able to open a side panel with a list of accessibility issues for the page.
  * There should be a way to highlight the accessibility issue on the page from the side panel
  * The issue should have the following information
    * Title
    * Description
    * WCAG 2 success criteria including the id, title, level (there may be more than one) - Eventually may include WCAG 3
    * Impacted users/assistive devices
    * Tags
    * Testing method
* The side panel should be automatically generated from the code
* Summary of issues page - There should be a separate page that lists the accessibility issues for the site.  This can be filtered and sorted and organized by Page, Success Criteria.  This should also be automatically generated and will have a csv or json export
* There will be an admin site where someone can edit/add accessibility issues.  The accessibility issue will later be connected to a page by a developer.
* Some of the same accessibility issues will be present on every page because I want to make sure that the issues found during the webaim one million testing are represented on every page in case someone just reviews a single page.

### Possible enhancements

* There should be a way for the user to toggle accessibility on/off for a page

## Product overview

* This will be an example Drs Practice.
* Every page should have some announcement that indicates that it is a demo site and not to use real data.
* Every page should indicate if it has accessibility issues or is broken.
* Suggested pages
  * Landing page
  * Services
  * Team
  * Booking
  * Location
  * Contact
  * Privacy Policy
  * Accessibility Statement
  * Cookie preferences
  * Patient portal
    * Intake form
    * Chart of test results
