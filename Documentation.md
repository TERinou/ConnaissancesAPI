# ConnaissanceAPI - Routes documentation

* [**Conversations**](#conversations)
  * [**/replies**](#replies)
  * [**/question**](#question)

## **Conversations**

Handle conversation between user's and the bot.

<br/>

### **/replies**

Manages responses (received and to be sent) from a user.

<br/>

🟡 **POST | Respond user's reply**

    http://localhost:8888/v1/conversations/replies

The `content` is a required key refereeing to user's reply, if null return an error. If an `id` is provided, then the user answers a question asked by the bot. In this case we send him back a message. Otherwise it is that he asks us a question.

**Body**
```json
{
  "content": "USER_REPLY",
  "id": "ANSWER_TO"
}
```
<br/>

<details>
<summary>Samples</summary>
<br/>

**:triangular_flag_on_post: User ask me a question**

**Body**
```json
{
  "content": "Que sais-tu sur les chaises ?"
}
```

**Response**
```json
{
  "ok": true,
  "word": {
    "relations": [
      "table",
      "tabouret"
    ],
    "_id": "602d28c829306fc1783b5084",
    "word": "chaise"
  }
}
```
:heavy_check_mark: `Status` **200 OK**

---

<br/>

**:triangular_flag_on_post: User answered my question**

**Body**
```json
{
    "content": "Avec des oeufs pour faire une omelette",
    "id": 123456
}
```

**Response**
```json
{
  "ok": true
}
```
:heavy_check_mark: `Status` **200 OK**
</details>

---

<br/>

### **/question**

Return a random question from the database.

<br/>

🟢 **GET | Generate a question**

    http://localhost:8888/v1/conversations/question

<br/>

<details>
<summary>Samples</summary>
<br/>

**:triangular_flag_on_post: Random example**

```json 
{
  "ok": true,
  "question": {
    "_id": "6027c3411a0cf4f5a1749c63",
    "content": "Que cuisine tu avec des champignons ?"
  }
}
```
:heavy_check_mark: `Status` **200 OK**
</details>