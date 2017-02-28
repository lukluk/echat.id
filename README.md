# echat.id
## WA API
### WA Client
```
DEBUG=nightmare xvfb-run --server-args="-screen 0 1024x768x24" node waclient.js 
```
### WA queue API
```
pm2 start app.js
```

IP:3100/ping

SCAN QR code from /ping

pm2 start app.js

IP:8080/wa/sendmsg?user=USER&msg=MESSAGE

