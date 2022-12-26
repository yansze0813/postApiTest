const express = require('express')
const app = express()
const postRouter = require('./routes/Posts')

app.use(express.json())
app.use("/", postRouter)


app.listen(3001,() => {
    console.log(`Server running on port 3001`)
});
