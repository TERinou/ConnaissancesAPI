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
export TERINOU_PORT=<listening_port> # (default: 8080)
export TERINOU_DB=<url_database_connection> # (default: terinou)
```

## Lancer
```bash
# Serveur de développement
npm start dev

# Serveur de release
node index.js
```


jest supertest