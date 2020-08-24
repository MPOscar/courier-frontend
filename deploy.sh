#/bin/bash
#upload files
aws s3 cp ./dist s3://rondanet.com --recursive --acl public-read
