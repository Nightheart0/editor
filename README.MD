# Sunstar's Editor

[See a demo here!](https://editor.sunstar.cx)

**This is still work in progress as evidenced by the lack of a catchy name for the project. I'll get it sorted out eventually.**

Leader Sunstar's little WYSIWYG math and rich text editor. A fork of the Matriculation Examination Board's rich text editor ([digabi/rich-text-editor](https://github.com/digabi/rich-text-editor)).

## Motivation

Every highschooler in Finland must pass a matriculation exam organized by the MEB in the Abitti Debian live USB environment in order to graduate. The editor used for math in the live USB distro is naturally the MEB's in-house rich text editor. Finnish high schools also tend to use Abitti for regular exams and the programs included in Abitti for classwork to prepare the students for the upcoming matriculation exam. That's how I got used to LaTeX and the MEB rich text editor in particular, in high school maths class.

However, in my opinion, the MEB editor lacks some features that I find useful. In particular:
- No actual rich text. The editor only allows you to inser special characters and LaTeX. No headings, no underlining, and so on despite the name. I would like to be able to use them in my math assignments.
- Renders LaTeX server-side. The editor sends a request to `/math.svg?latex=(INSERT LATEX HERE)` each time LaTeX is typed to convert it to SVG. There are far more efficient ways of achieving that.
- Uses MathQuill. It hasn't had a tagged release since 2016. I've replaced it with MathLive that's more modern.
- `en-us` locale. When the code and documentation are written in English, I'd expect English strings to ship with the finished bundle by default, with other locales added if necessary. The MEB editor only supports the `fi-fi` and `sv-fi` locales and nothing else. It's a common practice for many public institutions here to only bundle `fi-fi` and `sv-fi` and remove the English strings even if the code is written and documented 100% in English. The law doesn't forbid English, but only requires Finnish and Swedish by public institutions.
- Some bugs and other issues.

When a new school year started this August (the August of 2023 if you're reading in the future), I decided to fork the MEB editor and start this one to fix the shortcomings of the original.

## Todo/Roadmap

Here are the things that I'm currently working on/planning to do:

- Pull the strings from the `i18n/` folder, allowing for localization.
- Add support for actual rich text (only math is supported right now) like bold, italics, subscript, superscript, and so on.
- New initialization option to choose between a sticky toolbar (the current behavior) and a fixed one.
- Save/load (pretty important)
- Make the help dialog work and actually helpful.
