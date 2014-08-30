class App
  constructor: (@name) ->
    console.log "#{name} was initialized"

  doStuff: ->
    console.log "The Most Useful Method Ever!"



app = new App 'Hello World App'

app.doStuff()
