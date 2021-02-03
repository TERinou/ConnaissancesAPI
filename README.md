
# ConnaissancesAPI
API de connaissance pour le projet TER 2021 du groupe TERinou.

## Pré-requis
Pour installer l'API, vous devez avoir installé Node.Js 12+ avec npm.

## Installation
```bash
git clone git@github.com:TERinou/ConnaissancesAPI.git
cd ConnaissancesAPI
npm i --save express mongodb mongoose body-parser cors
```

## Variables d'environnement
```bash
export DEV_PORT=<listening_port>
export DB_URL=<url_database_connection>
```

## Lancer
```bash
node index.js
```
