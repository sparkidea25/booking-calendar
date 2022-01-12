import express from 'express';

import bookingRouter from "../app/routes/booking.router"

let app = express();

let PORT = 9000;

app.use(bookingRouter);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
})