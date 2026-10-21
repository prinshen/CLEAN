# CLEAN — projektgrundlag
Opdateret 21. oktober 2026.

## Formål
Personlig rengøringsapp til iPhone via GitHub-hostet webapp/PWA. Dansk brugerflade. Én opgave ad gangen; tidsestimat og rekord hjælper med at komme i gang.

## Godkendt scope
- Egne opgaver med navn, interval i dage, tidsestimat og underopgaver.
- To manuelt valgte grupper: faste opgaver og sjældne opgaver. Gruppens valg er uafhængigt af intervallet.
- Faste opgaver altid synlige; sjældne opgaver foldes ud. Den lukkede gruppe viser antal opgaver og antal farvemarkerede opgaver.
- Opgaver prioriteres efter næste rengøringsdato.
- Næste rengøring i oversigten; seneste udførelse, historik og personlig rekord i opgavedetaljer.
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
Overblik → opgavedetaljer → dedikeret timer → resultat. Opgaver oprettes fra oversigten og redigeres fra detaljeskærmen. Historik foldes ud på detaljeskærmen.

## Ikke i første version
AI, login, backend, synkronisering, notifikationer, XP, levels, streaks, statistikdashboard, automatiske rengøringssessioner eller særskilte intervaller for underopgaver.

## Faser
| Fase | Indhold | Status |
|---|---|---|
| 0 | Scope og projektgrundlag | Afsluttet |
| 1 | Design og skærmadfærd | Godkendt |
| 2 | Eksempelopgaver, overblik, detaljer, timer, resultat og lokal lagring | Implementeret; Jacob har bekræftet, at siden åbner. Fuld iPhone-test udestår |
| 3 | Egne opgaver, fuld historikadfærd og registrering uden timer | Implementeret; logiktest bestået, visuel/iPhone-test udestår |
| 4 | iPhone-afprøvning, finpudsning, hosting/PWA, eksport/import og nulstilling | Funktioner implementeret; fysisk iPhone/offline-afprøvning udestår |

Jacob har bedt om fase 3 efter fase 2. Teknisk er fase 2 statisk HTML/CSS/JavaScript uden eksterne afhængigheder. Offlinefiler, webmanifest og ikoner er nu implementeret.

## Tekstprincip — fast krav
Ingen slogans, catchphrases, motivationsfraser eller dekorativ fyldtekst. Al tekst skal have en konkret funktion: navigation, handling, status eller nødvendige oplysninger. Minimalisme gælder også sproget.

## Opdateret design og statusvisning
- Opgaver er startskærmen. Ingen bundmenu. Diskret Indstillinger-knap nederst på oversigten.
- Ingen dato i toppen, slogans eller tekniske fasebeskeder på overblikket.
- Kompakte grupperede opgaverækker med tydelige trykflader og grå/mørkeblå farver.
- Vis tid til næste rengøring til højre: “Om 4 dage”, “I dag” eller “3 dage over”. Neutral inden intervallet, gul på intervaldagen og to dage efter, rød ved mere end to dages overskridelse. Ved 7 dage: grå 0–6, gul 7–9, rød fra 10.
- Forventet tid står under opgavenavnet i oversigten og følger indstillingen for tidsestimater.
- Start rengøring står øverst under opgavenavnet i detaljevisningen. Registrer uden timer bliver nederst.
- Opgaver uden historik: “Ikke udført endnu”, neutral farve.
- Indstillinger indeholder valg om tidsestimater og forklaring af statusfarver.
- Fase 4 inkluderer nulstilling med bekræftelse; skeln mellem historik/rekorder og alle data inklusive egne opgaver. Nulstilling er implementeret under Indstillinger.

## Fase 3 — implementeret
- Ny opgave fra oversigten; rediger/slet på opgavedetaljer. Sletning kræver bekræftelse og omfatter opgavens historik.
- Nye installationer starter uden eksempelopgaver. Eksisterende lokale opgaver, tider og indstillinger bevares under samme lagernøgle. De kan nu redigeres og slettes individuelt.
- Registrering uden timer kan dateres i dag eller tidligere. Historik sorteres efter udførelsestidspunkt; seneste udførelse er den nyeste dato, ikke senest indtastede post. Manuel registrering giver aldrig en rekord.
- Fortryd manuel registrering fjerner kun den registrering. Fortryd målt gennemførelse genåbner timeren pauset.
- Opgaver med aktiv/pauset timer kan først ændres, slettes eller registreres manuelt, når timeren er afsluttet/afbrudt.
- Redigering bevarer historik og rekorder. Hvis omfanget ændres væsentligt, kan opgaven oprettes separat for en ny rekordhistorik.
- Formularer bevares ved appskift. Ugemte ændringer kræver bekræftelse ved Annuller.
- Regressionstest: node tests/regression.cjs. Testen bruger simuleret DOM/lager; den erstatter ikke browser- eller iPhone-test.

## Fase 4 — version 6
- Rettet knapfejl: browseren gav knapper uden type værdien submit, og appen ignorerede dermed tryk på opgaver. Opgaver og switches har nu eksplicit type=button; kun submit-knapper tilknyttet en formular udelades af navigationshåndteringen.
- Nulstil historik/rekorder bevarer opgaver og indstillinger. Slet alle data fjerner opgaver, historik, rekorder, indstillinger og timer. Begge kræver bekræftelse. Ingen nulstilling sker automatisk ved opdatering.
- Backup som JSON med app-id og formatversion. En timer eksporteres pauset uden at ændre den kørende timer. Import validerer hele filen, viser antal opgaver og registreringer og erstatter først efter bekræftelse. Lagringsfejl efterlader eksisterende data intakte.
- Ugyldige gemte data overskrives ikke automatisk. Indstillinger er tilgængelig til rå eksport, import eller nulstilling.
- Webmanifest med standalone-visning, PNG-ikoner til hjemmeskærm og Apple touch icon.
- Service worker henter appfiler ved onlinebesøg og bruger dem offline. Cache er afgrænset til CLEAN; opgavedata ligger fortsat i localStorage. Opdatering af appfiler sletter ikke brugerdata.
- Regressionstest dækker browserens standardknaptype, eksisterende opgaver, recovery, nulstilling, backupvalidering og import med annullering/lagringsfejl. Testene køres i simuleret DOM, ikke en rigtig browser.
- Resterende accepttest: Safari på iPhone, tilføjelse til hjemmeskærm, første onlineindlæsning efterfulgt af flytilstand, baggrundstimer, eksport til Filer og import tilbage.
