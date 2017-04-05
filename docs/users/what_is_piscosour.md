---
title: What is Piscosour
layout: doc_page.html
order: 2
---

# pisco-website: Create a documentation webpage.

With this recipe you can create a documentation webpage for your recipe based in your .md files.

This website is intended to show a different documentation for the users of your recipe and for the developers.

For every target (users and developers), the documentation is organized in:

* ```guides``` To explain everything related to your recipe.
* ```tutorials``` Quick and guided examples.
* ```documentation``` for the API documentation.

If your documents are organized, just run:

```shell
pisco-website recipe:create-website
```

This will create a folder with name ```dist``` containing your static documentation webpage.

If you want a different folder name for your distribution, just tell it to pisco-website:
```shell
pisco-website recipe:create-website --destination [your/dist/folder]
```


## Docs organization.
In order to create your website correctly, you must organize your docs folder according to this criteria:

### Docs folder name
By default, pisco-website will search for a folder with name ```webDocs```. If your documentation is in another folder you should tell pisco-website where is it.

  ```shell
  pisco-website recipe:create-website --docsSource [your-folder]
  ```

### Create the tree structure
Your documentation folder should have the following structure.

  ```
  webDocs
  │    index.md
  │
  └─── users
  │    │   get_started.md
  |    |   general01.md
  |    |   ...
  │    └─── guides
  │    │    | guide01.md
  │    │    | ...
  │    │    
  │    └─── tutorials
  │         | tutorial01.md
  │         | ...
  │       
  └─── developers
  │    │   get_started.md
  |    |   general02.md
  |    |   ...
  │    └─── guides
  │    │    | guide02.md
  │    │    | ...
  │    │    
  │    └─── tutorials
  │         | tutorial02.md
  │         | ...
  │
  └─── images
  │    │   image01.jpg
  │    │   ...
  │
  ```

  **IMPORTANT:**
  * You should have an ```index.md``` (if you don't add one, pisco-website will create for you asking you a few questions).
  * You should have at least one md document at first level into ```users``` and ```developers``` because this will be the entry point of each section. It's recommended to place there the "get_started" file.
  * If your recipe only has information for ```users``` or ```developers```, just delete the other folder.
  * If you don't have ```guides``` or ```tutorials``` for any of your targets, just delete the folder.

### Create an ```index.md``` file.

It's necessary to create an ```index.md``` in the root of your documentation folder in order to have an entry point to your website.
The content of this file should be only this metadata.

```html
---
toolName: [Your tool name]
claim: [A short and fresh sentence]
npmName: [Tool name in npm]
layout: index.html
---
```

* ```layout``` will be always ```index.html``` for the index.md file.

### Add metadata to all your md files

It's necessary to provide a little bit of information about your documentation files to create the webpage correctly, so all your md files shoud have this metadata at the top.

```html
---
title: [Page title]
layout: doc_page.html
---
```

* ```layout``` will be always ```doc_page.html``` for your documentation files.



## Best practices writing your md files.

### Use only one h1.
Your md documents should have one and only one h1 (# whatever) which is the title of your document.

### Code blocks
The markdown parser will guess which language are you using in your code blocks, but to ensure a good highlight just add to your code block what language are you adding the language name to it as follows:

* bash:

~~~

```bash
[your code]
```
~~~

* javascript:

~~~
```javascript
[your code]
```
~~~

* json

~~~
```json
[your code]
```
~~~

* You will find a complete list at this link: [Highlight supported languages](https://highlightjs.org/static/demo/)
