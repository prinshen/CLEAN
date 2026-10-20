# CLEAN
Dansk rengøringsapp til telefonen. Statisk HTML, CSS og JavaScript uden eksterne afhængigheder.

## Åbn appen
https://prinshen.github.io/CLEAN/

## Funktioner
- Egne faste og sjældne opgaver med interval, tidsestimat og huskeliste.
- Opret via “Ny opgave”; rediger/slet fra opgavedetaljer.
- Tid siden seneste rengøring: grå inden interval, gul ved interval og dagen efter, rød fra interval + 2.
- Timer med pause, genoptagelse, resultat og fortryd.
- Manuel registrering med dato; påvirker ikke personlig rekord.
- Historik sorteret efter udførelsesdato, lokal lagring og enkle indstillinger.

## Data
Den eksisterende lagernøgle clean.phase2.v1 bevares, så opdateringen ikke nulstiller brugerdata. Nye installationer starter uden eksempeldata. Tidligere gemte opgaver kan redigeres eller slettes individuelt.
Data ligger kun i browseren, ikke i GitHub. Eksport/import, nulstilling og offline-PWA hører til fase 4 og er endnu ikke implementeret.

## Kontrol
Kør fra repositoryets rod:
```sh
node tests/regression.cjs
```
Regressionstesten kontrollerer datoer, opgavestyring, manuel historik, fortryd, timersikkerhed og lagringsfejl i en simuleret DOM. Fysisk iPhone og visuelt layout er ikke automatisk testet.

Manuel kontrol: opret en opgave, rediger den, registrer en tidligere dato, start/pause/genåbn timer, afslut/fortryd og slet med bekræftelse. Kontrollér at appskift ikke fjerner indtastning i formularer.

Se [projektgrundlaget](docs/PROJEKT.md).
