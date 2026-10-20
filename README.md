# CLEAN
Dansk rengøringsapp: https://prinshen.github.io/CLEAN/

## Funktioner
Egne faste og sjældne opgaver, intervaller, synlige underopgaver, timer/pause, manuel registrering, historik og rekorder.
Indstillinger nederst på oversigten indeholder eksport/import og to nulstillinger.

## Data
Data gemmes kun på enheden under localStorage-nøglen clean.phase2.v1. Nøglen er bevaret for kompatibilitet med tidligere versioner.
Eksportér backup til en JSON-fil. Import erstatter alle data efter validering og bekræftelse. En eksporteret timer gendannes pauset.
Nulstil historik/rekorder bevarer opgaver. Slet alle data fjerner også opgaver og indstillinger. Begge kræver bekræftelse.
Ved ugyldige gemte data åbnes en tom visning uden at overskrive dem; Indstillinger giver adgang til rå eksport, import og nulstilling.

## PWA
Webmanifest, 192/512 px ikoner og 180 px Apple touch icon. Service worker caches appfiler efter et onlinebesøg. Standalone-visning fra hjemmeskærmen.
Ved nye udgivelser skal versionen i index.html, sw.js og versionsmærket i indstillinger opdateres samlet. Service worker-cachen bruger præfikset clean-shell- og rører ikke andre apps.

## Test
Fra repositoryets rod:
```sh
node tests/regression.cjs
```
Testene bruger simuleret DOM/lager. Knaptests efterligner browserens standardtype submit på knapper uden eksplicit type.
Fysisk iPhone, visuel afprøvning, offlinegenåbning og filhåndtering i Safari udestår.

Se [projektgrundlaget](docs/PROJEKT.md).
