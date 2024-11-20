const express = require('express');
const cors = require('cors');
const complaintRouter = require('./routers/complaintsRouter');

const app = express();

const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/',async (req,res) => res.status(200).json({ msg:'hello bro' }));

app.use('/v1/api/complaints', complaintRouter);

app.listen(port,() => console.log(`server started at port ${port}`));
