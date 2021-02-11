# ConnaissancesAPI
API de connaissance pour le projet TER 2021 du groupe TERinou.

* [Pré-requis](#pré-requis)
* [Installation](#installation)
* [Variables d'environnement](#variables-denvironnement)
* [Lancer](#lancer)
* [Documentation](#documentation)
	* [Questions](#questions)


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

### Questions

#### :heavy_check_mark: getAnswer

Return an answer to the user question give.

:triangular_flag_on_post: **GET** `/questions/getAnswer?content=userQuestion`

<details>
<summary>More details</summary>
<br/>

:bulb: **Query params**

| Key     | Value        | Description                                  |
| ------- | ------------ | -------------------------------------------- |
| content | userQuestion | The user's question, if null return an error |

<br/>

:pencil2: **Samples**:

**GET** `/questions/getAnswer?content=What do you know about chairs?`

```json
{
  "ok": true,
  "answer": "BOT_ANSWER"
}
```

**GET** `/questions/getAnswer`

```json
{
  "ok": false,
  "code": "ME40001",
  "message": "No question were asked"
}
```
</details>