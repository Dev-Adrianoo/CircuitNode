import express from "express";

const app: express.Express = express()
const PORT =  3000;

app.use(express.json());



app.listen(PORT, ()=>{  
      
    console.log(`FURACÃO ${PORT}`)
});