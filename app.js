const express = require('express');
const path = require('path');

const router = require('./routes/route');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(router);
// app.use("/", (req,res,next) => {
//     res.send("<p>hi</p>");
//     console.log(rouer);
// });


app.listen(3000);