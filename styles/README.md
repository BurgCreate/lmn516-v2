# LMN516 CSS structure

`app/globals.css` is now only the global entry file. It imports the files below in a fixed order so the original cascade and appearance remain unchanged.

- `00-tokens.css`: design tokens and theme variables
- `01-base.css`: reset, global elements and paper texture
- `02-header.css`: primary site header
- `03-home.css`: homepage sections, cards and footer
- `04-content.css`: archive, article and shared content pages
- `05-moments.css`: moments page, floating bubble and transition effects
- `06-mobile-fixes.css`: legacy mobile-only corrections
- `07-typography.css`: consolidated typography system
- `08-spacing.css`: shared spacing rhythm
- `09-layout.css`: containers and responsive layout roles
- `10-cards.css`: shared card system
- `11-buttons.css`: buttons, links and focus behavior
- `12-navigation.css`: shared navigation system
- `13-motion.css`: shared motion system
- `14-night-theme.css`: complete dark/night theme layers
- `15-photos.css`: photo wall page

## Rule

Add new styles to the most relevant file rather than to `app/globals.css`. Do not reorder the imports unless the cascade is reviewed.
