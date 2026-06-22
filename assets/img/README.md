# Site images

The homepage carousel ("A glimpse of the selection") is wired to load these
five photos automatically. **Drop the files in this folder using these exact
names** and they'll appear — no code changes needed. Until then, each slide
shows a warm gradient placeholder.

| Filename            | Photo to use                                                        |
|---------------------|---------------------------------------------------------------------|
| `whiskey.jpg`       | The whiskey wall — Jack Daniel's / Jim Beam / Jameson / Fireball / Jägermeister (the deer-head + neon shelf) |
| `gin-liqueurs.jpg`  | Gin shelf + Baileys / Disaronno / Carolans / Canadian LTD           |
| `bourbon.jpg`       | Bourbon wall — Buffalo Trace / Woodford / Maker's Mark / Crown Royal / Aperol |
| `store.jpg`         | The wide shot of the store (counter + Johnnie Walker striding-man statue) |
| `tequila.jpg`       | Premium tequila — Don Julio 1942 / Clase Azul / Espolón / Milagro    |

## Tips
- **Format:** `.jpg` (or rename the table above to `.png` / `.webp` if needed).
- **Size:** ~1000–1400px on the long edge is plenty; keeps the page fast.
- **Orientation:** the carousel cards are portrait (4:5), so vertical phone
  photos fit best. Landscape works too — it just center-crops.

## How to add them
- **Easiest:** commit the five files into this `assets/img/` folder on the
  `claude/beautiful-gauss-s929dr` branch, or
- send them to me as **file attachments** (not pasted inline) and I'll commit
  them for you.

You can wire more images anywhere a card uses the `--photo` hook, e.g.:

```html
<div class="showcase__media bg--beer" style="--photo:url('assets/img/beer.jpg')"></div>
```
