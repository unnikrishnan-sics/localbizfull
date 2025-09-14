const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4056
const db = require("./dbConnection");
const router = require("./router");
const cors=require("cors")
var morgan = require('morgan')

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use("/", router);
app.use('/uploads', express.static('uploads'));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

