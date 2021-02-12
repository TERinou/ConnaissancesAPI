# ConnaissancesAPI
API de connaissance pour le projet TER 2021 du groupe TERinou.

* [Pré-requis](#pré-requis)
* [Installation](#installation)
* [Variables d'environnement](#variables-denvironnement)
* [Lancer](#lancer)
* [Documentation](#documentation)
  * [Conversations `/conversation`](#conversations-conversation)


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

### Conversations `/conversation`

Handle conversation between user's and the bot.

#### :label: replies `/conversations/replies`

:triangular_flag_on_post: **Method POST**

<details open>
<summary>More details</summary>
<br/>

Handle POST replies. The `content` is a required key refereeing to user's reply, if null return an error. If an `id` is provided, then the user answers a question asked by the bot. In this case we send him back a message. Otherwise it is that he asks us a question.
<br/>


```json
Body:
{
  "content": "USER_REPLY",
  "id": "ANSWER_TO"
}
```

<details>
<summary>Samples</summary>
<br/>

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
:heavy_check_mark: `Status` **200 OK**

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
:heavy_check_mark: `Status` **200 OK**

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
:x: `Status` **400 Bad Request**
</details>
</details>