#!/bin/bash

echo y | keytool -genkeypair -dname "cn=Mark Jones, ou=JavaSoft, o=Sun, c=US" -alias business -keypass kpi135 -keystore /working/android.keystore
  -storepass ab987c -validity 9999
