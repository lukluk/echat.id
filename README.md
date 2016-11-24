# echat.id
## WA API


## Run WA client
```
node waclient.js
#default port 3000
```

## Run WA API
```
node app.js
#default port 8080
```

### Testing
```
npm test
```
### Login
localhost:3000/login.php

[![851516843_474942097108504402.jpg](https://s13.postimg.org/rmnuif587/851516843_474942097108504402.jpg =100x100)](https://postimg.org/image/48fv6hnar/)

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
