# UI Style Guide

## Overall Style

This visual style is best described as **modern low-poly isometric
minimalism** with subtle influences from mobile strategy games. It
combines clean geometric forms, soft colours and generous spacing to
create a readable, approachable aesthetic.

The emphasis is on **clarity over realism**. Every object is immediately
recognisable at small sizes while maintaining a cohesive handcrafted
appearance.

------------------------------------------------------------------------

# Core Characteristics

## Geometry

-   Simple low-poly meshes
-   Mostly cubes, wedges and prisms
-   Very little fine detail
-   Hard edges rather than rounded organic forms
-   Consistent isometric viewing angle
-   Uniform object scale

Objects should feel like small tabletop pieces rather than realistic
environments.

## Colour Palette

Palette characteristics:

-   Bright pastel colours
-   High value (light) colours
-   Moderate saturation
-   No harsh blacks
-   Warm greens
-   Cyan-blue water
-   Cream coloured beaches
-   Orange timber structures
-   Soft red roofs

Avoid:

-   Heavy gradients
-   Dirty colours
-   High contrast textures
-   Dark realistic materials

## Lighting

Lighting is extremely soft.

Characteristics:

-   Ambient daylight
-   Gentle directional shadows
-   No dramatic highlights
-   No bloom
-   No reflections
-   No specular materials

Everything should appear matte.

## Texturing

Almost textureless.

Materials rely on:

-   Flat colours
-   Very subtle colour variation
-   Geometry instead of texture detail

No visible:

-   Wood grain
-   Stone textures
-   Fabric textures
-   Noise overlays

## Silhouette

Every asset should be identifiable from silhouette alone.

Objects are intentionally oversized:

-   Trees
-   Buildings
-   Rocks

This improves readability during gameplay.

------------------------------------------------------------------------

# UI Design Principles

The interface should feel like an extension of the world rather than a
separate HUD.

## Containers

Panels should use:

-   Rounded capsules
-   Thick borders
-   Dark navy backgrounds
-   Soft inner gradients
-   Thin separators

Avoid square windows or heavy framing.

## Icons

Icons should be:

-   Monoline
-   Simple
-   Circular
-   Consistent stroke width
-   Small but legible

Use symbols instead of text wherever possible.

## Typography

Typography should be:

-   Bold
-   Clean
-   Sans-serif
-   High contrast
-   Limited font weights

Prefer icons plus numbers over descriptive labels.

## Information Density

Show only the information needed for the current decision.

Good examples:

-   Hull
-   Movement
-   Boarding
-   Cargo

Hide advanced information behind expandable panels or contextual menus.

## Floating UI

UI should float above gameplay using:

-   Small anchored tooltips
-   Speech-bubble pointers
-   Compact stat capsules
-   Context-sensitive controls

Avoid permanent large windows.

------------------------------------------------------------------------

# Interaction Style

Menus should appear:

-   Near the selected object
-   With short transitions
-   Without covering gameplay

Interactions should feel lightweight.

------------------------------------------------------------------------

# Mobile Interaction

The mobile interface should prioritize **playfield protection** and
**touch clarity**.

Rules:

-   Keep the critical HUD within the safe area at all times
-   Keep the primary turn action permanently visible
-   Use compact status strips instead of large always-open panels
-   Prefer horizontal swipe trays for tile offers on phones
-   Replace hover-only discovery with persistent click or tap tooltips
-   Give tooltips explicit dismissal controls and allow tap-away dismissal
-   Prefer drag-and-drop placement from mobile trays when it is clear and
    visually anchored
-   Convert large sidebars into sheets or full-screen overlays on phones
-   Support portrait-first play while still compressing cleanly in
    landscape
-   Respect reduced-motion preferences
-   Maintain generous tap targets, ideally at least 44 px tall and wide

------------------------------------------------------------------------

# Animation

Animations should be subtle.

Examples:

-   Small scale pop
-   Gentle fade
-   Slide upward
-   Soft bounce

Avoid exaggerated elastic effects.

------------------------------------------------------------------------

# Asset Rules

Every new asset should satisfy:

-   Readable at 64×64 px
-   Recognisable by silhouette
-   Flat-shaded
-   Pastel palette
-   Minimal texture detail
-   Consistent isometric perspective
-   Soft shadow only

------------------------------------------------------------------------

# Design Keywords

-   Low-poly
-   Flat shaded
-   Isometric
-   Minimal
-   Pastel
-   Readable
-   Toy-like
-   Modern
-   Calm
-   Clean
-   Strategy game
-   Mobile-friendly
-   Elegant
