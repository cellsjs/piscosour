---
title: Google Analytics Integration
layout: doc_page.html
order: 13
---

# Google Analytics Integration

- Store user information into `$HOME/.piscosour` directory. This directory is treated as a recipe stored in `config.recipes.userConfig`

- Send usage information to google analytics just setting analytics item into piscosour.json.

```json
  "analytics" : {
    "id": "UA-xxxxxxxxx-xx",
    "ask" : true
  }
```

- First time any command is executed the user is going to be asked for permission to send usage information to google analytics (see `analytics.ask` param).
