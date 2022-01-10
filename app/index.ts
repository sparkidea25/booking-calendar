import express from 'express';


let app = express();

const PORT = 9000;


app.listen(PORT, () => {
  console.log('`⚡️[server]: Server is running at https://localhost:${PORT}`');
})