# ConnaissancesAPI
API de connaissance pour le projet TER 2021 du groupe TERinou.

* [Pré-requis](#pré-requis)
* [Installation](#installation)
* [Variables d'environnement](#variables-denvironnement)
* [Lancer](#lancer)
* [Documentation](#documentation)
  * [Conversations](#conversations)


## Pré-requis
Pour installer l'API, vous devez avoir installé Node.Js 12+ avec npm.

## Installation
```bash
git clone git@github.com:TERinou/ConnaissancesAPI.git
cd ConnaissancesAPI
npm i
```

## Variables d'environnement
```bash
export TERINOU_PORT=<listening_port> # (default: 8888)
export TERINOU_DB=<url_database_connection> # (default: terinou)
```

## Lancer
```bash
# Serveur de développement
npm run dev

# Serveur de production
node index.js
```

## Documentation

### Conversations

#### :heavy_check_mark: replies

Return an answer to user's replies.

:triangular_flag_on_post: **POST** `/conversations/replies`

<details open>
<summary>More details</summary>

<br/>

:pencil2: **Samples**:

```json
Body:
{
  "content": "What do you know about chairs ?"
}

response: 
{
  "ok": true,
  "answer": "BOT_REPLY"
}
```
`Status` **200 OK**

---

```json
Body: 
{
  "content": "I love dogs and cats",
  "id": 69420
}

Response: 
{
  "ok": true,
  "message": "BOT_REPLY"
}
```
`Status` **200 OK**

---

```json
Body: {}

Response: 
{
  "ok": false,
  "code": "CO40001",
  "message": "No reply found"
}
```
`Status` **400 Bad Request**
</details>