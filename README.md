# Tim Plavi Repozitorij

Ovaj repozitorij u sebi koristi Git Submodules sustav. Na taj nacin mozete backend i frontend repozitorije ujediniti u jedan zajednicki repozitorij radi lakseg organiziranja koda.

## Kako pravilno klonirati

Obicni `git clone git@github.com:zip-fsre/plavi.git` nece raditi, zato jer:

1. Folderi (submoduli) `plavi-backend` i `plavi-frontend` se nece stvoriti i/ili nece popuniti sa azurnim podacima
2. Ta komanda po zadanom klonira `main` branch, a nama je potreban branch `main_sa_git_submodulima`.

Pravilna komanda je: `git clone -b main_sa_git_submodulima --recursive git@github.com:zip-fsre/plavi.git`
