#!/bin/sh
RC=1
while [ $RC -ne 0 ]; do
DEBUG=nightmare xvfb-run --server-args="-screen 0 1024x768x24" node waclient.js
   RC=$?
done
