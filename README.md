# echat.id
## WA API
<<<<<<< HEAD
--
## Run WA client
```
node waclient.js
=======


## Run WA client
```
node waclient.js
#default port 3000
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
```

## Run WA API
```
node app.js
<<<<<<< HEAD
=======
#default port 8080
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
```

### Testing
```
npm test
```
<<<<<<< HEAD
=======
### Login
localhost:3000/login.php

[![851516843_474942097108504402.jpg](https://s14.postimg.org/c3lpwxl9t/851516843_474942097108504402.jpg)](https://postimg.org/image/6fff61gx9/)

connect with your WA mobile apps

### GET /sendmsg?user=CONTACT&msg=MESSAGETEXT
send message to contact (contact can be number or name)
```
  {"success":true,"msg":"thanksyou"}
``` 

### GET /list
get contacts
```
    ["jhon","+191734562","+628821985723"]
```

### GET /chat?user=CONTACT
get history 
```
    [
    "23452343455":
        {
            "from":"jhon",
            "timestamp":234214534,
            "text":"hello",
            "status":"seen"
        }
    "987654345663":
        {
            "from":"you",
            "timestamp":234234534,
            "text":"hi",
            "status":"sent"
        }
    ]
```
### GET /unread
get all unread msg
```
```
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
