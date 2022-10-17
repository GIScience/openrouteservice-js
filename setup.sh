#!/bin/bash
#
echo "VITE_ORS_API_KEY=$1" > .env.local;
echo "export default '$1'" > examples/apiKey.js;
