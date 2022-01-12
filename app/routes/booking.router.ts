import {Router} from "express";
import * as bookingController from "../controller/booking.controller";

const bookingRouter = Router();

bookingRouter.get('/booking', bookingController.createBooking)

export default bookingRouter;