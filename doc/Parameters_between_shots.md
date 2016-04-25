# Parameters transmition between shots

Sometimes we need a parameter generated in one shot in other shot. This is the way to do this.
 
## Define output parameters

There is a special stage in shots called **'emit'**. The emit behaviour is wide different from other stages behaviours.
   
   1. Allways has to return an key:value object with the parameters we want to expose to others shots. 
   2. **emit** doesn't recive resolve and reject method so allways is synchronous

As other stages **emit** is optional

Example:

```js
    emit : function(){
        return {
            whatever : "any text value",
            whatevermore : {
                some: "thing",
                someArray: []
            }
        }
    }
```

## Connect outputs with inputs in other shots.

- This is can be done only in **straw.json**.
- Input are always set into **this.params**

straw.json example:

```js
    [...]
  "shots" : {
    "test1" : {},
    "test2" : {
      "inputs" : {
        "inWhatever" : {"test1": "whatever"}
      }
    }
    [...]
  }

```

This example set **this.params.inWhatever** parameter of **test2** shot with the value of whatever output parameter emit by **test1** shot

**(*) Important:** Obviously inputs only can get values from previous shots.
 
So in our example:

    console.log(this.params.inWhatever)
    
result:

    any text value
    


