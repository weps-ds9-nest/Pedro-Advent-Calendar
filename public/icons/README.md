# Lesson Icons Directory

Place your 24 Pedro Pascal icons in this directory.

## Expected Naming Conventions
By default, the application will attempt to load the icon corresponding to the day from the following path:
- `/icons/pedro-[day].webp` (padded with leading zero, e.g. `pedro-01.webp`, `pedro-12.webp`)
- If the WebP file fails to load, it will automatically fall back to `.png` format (e.g. `pedro-01.png`, `pedro-12.png`).
- If neither is present, it will fallback to the `🎁` emoji.

You can also specify a custom filename in your lesson markdown's YAML frontmatter using the `icon` key (e.g., `icon: my-pedro.png`), in which case the app will attempt to load `/icons/my-pedro.png`.
