# CLEAN
Dansk, mobilorienteret rengøringsapp. Fase 2: et første afprøveligt kerneforløb.

## Implementeret
- Faste opgaver og udfoldelige sjældne opgaver.
- Opgavedetaljer med synlig huskeliste uden afkrydsning.
- Tidsstempelbaseret timer med pause, fortsæt og afslut.
- Lokal lagring af aktiv timer og gennemførelser.
- Resultat, rekord, næste dato og fortryd afslutning.
- Eksempelopgaver uden opdigtede gennemførelser.

## Kørsel
Statiske filer uden build-trin eller pakker. Servér repositoryets rod via en webserver, fx GitHub Pages. Appen bruger relative filstier, så den kan køre under /CLEAN/.
GitHub Pages er ikke aktiveret af denne commit.

## Data
Data gemmes i browserens localStorage under clean.phase2.v1. De sendes ikke til GitHub. Undgå at rydde webstedsdata. Eksport/import kommer i fase 4.
Fase 2 har faste eksempelopgaver. Opret/rediger/slet og registrering uden timer kommer i fase 3. Manifest, offline-cache og endelig hjemmeskærmsopsætning hører til fase 4.

## Validering
JavaScript syntakskontrolleret. Otte logikkontroller bestået: aktiv tid, pause, genoptagelse, serialisering/genåbning, rekorder og kalenderbaserede intervaller.
Browserlayout og fysisk iPhone er endnu ikke afprøvet, fordi udviklingsmiljøet var utilgængeligt.

## Manuel afprøvning
1. Åbn en opgave, start og kontrollér den synlige huskeliste.
2. Pause i et minut: tiden må ikke stige. Fortsæt.
3. Lås telefonen og genåbn: aktiv tid skal inkludere perioden; pauset tid må ikke.
4. Genindlæs under aktiv og pauset timer.
5. Afslut: kontrollér historik, rekord og næste dato.
6. Fortryd afslutning: registreringen fjernes, timeren genåbner pauset.
7. Afbryd: der må ikke blive gemt en gennemførelse.
8. Fold sjældne opgaver ud og ind.

Se [projektgrundlaget](docs/PROJEKT.md).
