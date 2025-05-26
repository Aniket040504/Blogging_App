const path=require("path");
const express=require('express');

const app= express();
const PORT= process.env.PORT || 5000;

app.set('view engine',ejs);
app.search('views', path.resolve("./views"));


app.listen(PORT, ()=>console.log(`Server started on ${PORT}`));