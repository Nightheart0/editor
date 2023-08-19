# (Inser some cool name here)

This is a fork of [digabi/rich-text-editor](https://github.com/digabi/rich-text-editor).

## Motivation

I'm a Finnish high school student coding part-time.

Every highschooler in this country must pass a matriculation exam organized by the MEB in the Abitti Debian live USB environment in order to graduate. The editor used for math in the live USB distro is naturally the MEB's in-house rich text editor. Finnish high schools tend to use Abitti for regular exams too and the programs included in Abitti for classwork to prepare us for the upcoming matriculation exam. That's how I got used to LaTeX and the MEB rich text editor in particular, in maths class (I have yet to take my matriculation exam).

However, in my opinion, the MEB editor lacks some features that I find useful. In particular:
- No actual rich text. The editor only allows you to inser special characters and LaTeX. No headings, no underlining, and so on despite the name. I would like to be able to use them in my math assignments.
- Renders LaTeX server-side. The editor sends a request to `/math.svg?latex=(INSERT LATEX HERE)` each time LaTeX is typed to convert it to SVG. There are far more efficient ways of achieving that.
- Uses MathQuill. MathQuill splits the text field to a raw LaTeX view and a math view, taking up unnecessary space.
- `en-us` locale. When the code and documentation are written in English, I'd expect English strings to ship with the finished bundle by default, with other locales added if necessary. The MEB editor only supports the `fi-fi` and `sv-fi` locales and nothing else. It's a common practice for many public institutions here to only bundle `fi-fi` and `sv-fi` and remove the English strings even if the code is written and documented 100% in English. The law doesn't forbid English, but only requires Finnish and Swedish.

When school began again this August, I decided to fork the MEB editor and start this one to fix the shortcomings of the original.

## Todo/Roadmap

Here are the things that I'm currently working on/planning to do:

- Pull the strings from the `i18n/` folder, allowing for localization.
- Add support for actual rich text (only math is supported right now) like bold, italics, subscript, superscript, and so on.
- New initialization option to choose between a sticky toolbar (the current behavior) and a fixed one.
- Save/load (pretty important)
- Make the help dialog work and actually helpful.
