# Google Analytics Integration

- Store user information into $HOME/.piscosour directory. This directory is treated as a recipe stored in **config.recipes.userConfig**
- Send usage information to google analytics just setting analytics item into piscosour.json. 
```
  "analytics" : {
    "id": "UA-xxxxxxxxx-xx",
    "ask" : true
  }
```
- (with analytics.ask param) First time any command is executed the user is going to be asked for permission to send usage information to google analytics.
