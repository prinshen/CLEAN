# CLEAN — projektgrundlag
Opdateret 20. oktober 2026.

## Formål
Personlig rengøringsapp til iPhone via GitHub-hostet webapp/PWA. Dansk brugerflade. Én opgave ad gangen; tidsestimat og rekord hjælper med at komme i gang.

## Godkendt scope
- Egne opgaver med navn, interval i dage, tidsestimat og underopgaver.
- To manuelt valgte grupper: faste opgaver og sjældne opgaver. Gruppens valg er uafhængigt af intervallet.
- Faste opgaver altid synlige; sjældne opgaver foldes ud. Den lukkede gruppe viser antal opgaver og antal farvemarkerede opgaver.
- Opgaver prioriteres efter næste rengøringsdato.
- Seneste udførelse, antal dage siden, historik, personlig rekord og næste dato. Ingen deadline- eller forsinkelsestekst.
- Underopgaver er en synlig huskeliste uden afkrydsning, også på timerskærmen.
- Dedikeret timer med start, pause, fortsæt og afslut. Korrekt tid ved låsning, appskift og genåbning.
- Én aktiv timer. Adgang tilbage til den fra overblikket.
- Afslutning gemmer direkte. Fortryd genåbner timeren pauset og fjerner gennemførelsen.
- Afbryd uden registrering, med bekræftelse.
- Registrering uden timer, med valgfri tidligere dato; ingen rekordpåvirkning.
- Nye opgaver kan få en seneste udførelsesdato eller stå som ikke udført endnu.
- Lokal lagring samt eksport/import. GitHub er kode/hosting, ikke backup af registreringerne.

## Design — godkendt
Grå og mørkeblå, moderne og minimalistisk uden at være koldt. Varm lys grå baggrund, dyb mørkeblå tekst og knapper, fine skillelinjer, luftige opgavelister, ingen tunge skygger eller permanent bundmenu.
Overblik → opgavedetaljer → dedikeret timer → resultat. Opgavestyring tilføjes i fase 3. Historik foldes ud på detaljeskærmen.

## Ikke i første version
AI, login, backend, synkronisering, notifikationer, XP, levels, streaks, statistikdashboard, automatiske rengøringssessioner eller særskilte intervaller for underopgaver.

## Faser
| Fase | Indhold | Status |
|---|---|---|
| 0 | Scope og projektgrundlag | Afsluttet |
| 1 | Design og skærmadfærd | Godkendt |
| 2 | Eksempelopgaver, overblik, detaljer, timer, resultat og lokal lagring | Implementeret; browser- og iPhone-afprøvning mangler |
| 3 | Egne opgaver, fuld historikadfærd og registrering uden timer | Ikke startet |
| 4 | iPhone-afprøvning, finpudsning, hosting/PWA, eksport/import og nulstilling | Ikke startet |

Efter fase 2 afprøver Jacob kerneforløbet, inden fase 3 bygges. Teknisk er fase 2 statisk HTML/CSS/JavaScript uden eksterne afhængigheder. Fuld offline-PWA er ikke implementeret endnu.

## Tekstprincip — fast krav
Ingen slogans, catchphrases, motivationsfraser eller dekorativ fyldtekst. Al tekst skal have en konkret funktion: navigation, handling, status eller nødvendige oplysninger. Minimalisme gælder også sproget.

## Opdateret design og statusvisning
- Opgaver er startskærmen. Ingen bundmenu. Diskret Indstillinger-knap nederst på oversigten.
- Ingen dato i toppen, slogans eller tekniske fasebeskeder på overblikket.
- Kompakte grupperede opgaverækker med tydelige trykflader og grå/mørkeblå farver.
- Vis tid siden sidste rengøring. Neutral inden intervallet, gul på intervaldagen og dagen efter, rød fra interval + 2 dage. Ved 7 dage: grå 0–6, gul 7–8, rød fra 9.
- Opgaver uden historik: “Ikke udført endnu”, neutral farve.
- Indstillinger indeholder valg om tidsestimater og forklaring af statusfarver.
- Fase 4 inkluderer nulstilling med bekræftelse; skeln mellem historik/rekorder og alle data inklusive egne opgaver. Nulstilling er endnu ikke implementeret.
