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

```json
Body:
{
  "content": "USER_REPLY",
  "id": "ANSWER_TO"
}
```

<br/>

<details>
<summary>Samples</summary>
<br/>

```json
Body:
{
  "content": "What do you know about chairs ?"
}

Response: 
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
  "message": "User reply undefined"
}
```
:x: `Status` **400 Bad Request**
</details>

---

### **/question**

Return a random question from the database.

<br/>

🟢 **GET | Generate a question**

    http://localhost:8888/v1/conversations/question

<details>
<summary>Samples</summary>
<br/>

```json
Response: 
{
  "ok": true,
  "question": "What do you think about tomatoes?"
}
```
:heavy_check_mark: `Status` **200 OK**

---

```json
Response: 
{
  "ok": false,
  "code": "CO40401",
  "message": "No question found"
}
```
:x: `Status` **404 Bad Request**
</details>

---