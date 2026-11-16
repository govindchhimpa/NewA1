#!/bin/bash
# Run a Node tool from tools/ with the globally installed playwright, at low priority
# (10 agents share 2 CPU cores).  usage: tools/run.sh still.js scene s1 0,1 out/stills/me
cd "$(dirname "$0")/.." || exit 1
export NODE_PATH="$(npm root -g)"
exec nice -n 5 node "tools/$@"
