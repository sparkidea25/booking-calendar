import { Request, Response } from "express";

// when i input minutes, it should calculate the endtime from the start time
export async function createBooking(req: Request, res: Response) {
  const data = {
    photographers: [
      {
        id: "1",
        name: "Otto Crawford",
        availabilities: [
          {
            starts: "2020-11-25T08:00:00.000Z",
            ends: "2020-11-25T16:00:00.000Z",
          },
        ],
        bookings: [
          {
            id: "1",
            starts: "2020-11-25T08:30:00.000Z",
            ends: "2020-11-25T09:30:00.000Z",
          },
        ],
      },
      {
        id: "2",
        name: "Jens Mills",
        availabilities: [
          {
            starts: "2020-11-25T08:00:00.000Z",
            ends: "2020-11-25T09:00:00.000Z",
          },
          {
            starts: "2020-11-25T13:00:00.000Z",
            ends: "2020-11-25T16:00:00.000Z",
          },
        ],
        bookings: [
          {
            id: "2",
            starts: "2020-11-25T15:00:00.000Z",
            ends: "2020-11-25T16:00:00.000Z",
          },
        ],
      },

      {
        id: "3",
        name: "Jens Mills 3",
        availabilities: [
          {
            starts: "2020-11-25T08:00:00.000Z",
            ends: "2020-11-25T09:00:00.000Z",
          },
          {
            starts: "2020-11-25T13:00:00.000Z",
            ends: "2020-11-25T16:00:00.000Z",
          },
        ],
        bookings: [
          // {
          //   id: "2",
          //   starts: "2020-11-25T15:00:00.000Z",
          //   ends: "2020-11-25T16:00:00.000Z",
          // },
        ],
      },
    ],
  };

  //   const res = [
  //     {
  //       photographer: {
  //         id: 1,
  //         name: "Otto Crawford",
  //       },
  //       timeSlot: {
  //         starts: "2020-11-25T09:30:00.000Z",
  //         ends: "2020-11-25T11:00:00.000Z",
  //       },
  //     },
  //     {
  //       photographer: { id: "2", name: "Jens Mills" },
  //       timeSlot: {
  //         starts: "2020-11-25T13:00:00.000Z",
  //         ends: "2020-11-25T14:30:00.000Z",
  //       },
  //     },
  //   ];

  function availableTimeSlotsForBooking(durationInMinutes: number) {
    const availablePhotographers: {
      photographer: { id: string; name: string };
      timeSlot: { starts: string; ends: string };
    }[] = [];


    const dataP = [];

    const durationInSecs = durationInMinutes * 60000;
    const sortDate = (arr: { starts: string; ends: string }[]) => {
      return arr.sort((a, b) => {
        if (new Date(a.starts) < new Date(b.starts)) return -1;
        else if (new Date(a.starts) > new Date(b.starts)) return 1;
        else return 0;
      });
    };

    const getPBooking = (
      bookings: { id?: string; starts: string; ends: string }[],
      availabilities: { starts: string; ends: string }[]
    ) => {
      let timeSlot: { starts?: string; ends?: string } = {};
      let sortAvailabilities = sortDate(availabilities);
      for (let book of bookings) {
        const bookingStart = new Date(book.starts).getTime();
        const bookingEnds = new Date(book.ends).getTime();
        // const timeDiff = Math.ceil((bookingEnds - bookingStart) / 60000);
        const getHourBookingWasDone = sortAvailabilities.find((time) => {
          return book.starts >= time.starts && book.ends <= time.ends;
        });

        if (getHourBookingWasDone) {
          // remove slot from availability
          sortAvailabilities = sortAvailabilities.filter((time) => {
            return time.starts !== getHourBookingWasDone.starts;
          });

          // check for time slows before start time or after end time;

          const bookedHourStart = new Date(
            getHourBookingWasDone.starts
          ).getTime();
          const bookedHourEnd = new Date(getHourBookingWasDone.ends).getTime();

          const availableTimeBetweenStart = Math.abs(
            Math.ceil((bookedHourStart - bookingStart) / 60000)
          );
          const availableTimeBetweenEnd = Math.abs(
            Math.ceil((bookedHourEnd - bookingEnds) / 60000)
          );

          if (
            availableTimeBetweenStart >= durationInMinutes ||
            availableTimeBetweenEnd >= durationInMinutes
          ) {
            if (availableTimeBetweenStart >= durationInMinutes) {
              const start = new Date(getHourBookingWasDone.starts);
              timeSlot.starts = getHourBookingWasDone.starts;
              timeSlot.ends = new Date(
                start.setTime(start.getTime() + durationInSecs)
              ).toISOString();
            } else if (availableTimeBetweenEnd >= durationInMinutes) {
              const end = new Date(book.ends);

              const start = new Date(end.setTime(end.getTime() + 60000));

              timeSlot.starts = start.toISOString();
              timeSlot.ends = new Date(
                new Date(start).setTime(start.getTime() + durationInSecs)
              ).toISOString();
            }
            break;
          }
          const availableTime =
            getAvailabilityforPWithBooking(sortAvailabilities);
          if (availableTime) {
            const start = new Date(availableTime.starts);
            timeSlot.starts = start.toISOString();
            timeSlot.ends = new Date(
              start.setTime(start.getTime() + durationInSecs)
            ).toISOString();
          } else {
            timeSlot = {};
          }

          break;
        } else {
          const availableTime =
            getAvailabilityforPWithBooking(sortAvailabilities);
          if (availableTime) {
            const start = new Date(availableTime.starts);
            timeSlot.starts = start.toISOString();
            timeSlot.ends = new Date(
              start.setTime(start.getTime() + durationInSecs)
            ).toISOString();
          } else {
            timeSlot = {};
          }
          break;
        }
      }
      return timeSlot;
    };

    const getAvailabilityforPWithBooking = (
      availabilities: { starts: string; ends: string }[]
    ) => {
      // const sortedAvailabilities = sortDate(availabilities);
      let availableTime: { starts: string; ends: string } | undefined;
      for (const time of availabilities) {
        const startTime = new Date(time.starts).getTime();
        const endTime = new Date(time.ends).getTime();
        const timeDiff = Math.ceil((endTime - startTime) / 60000);
        if (timeDiff >= durationInMinutes) {
          availableTime = time;
          break;
        }
      }
      return availableTime;
    };

    for (let ph of data.photographers) {
      if (ph.availabilities.length === 0) {
        continue;
      }

      if (ph.bookings.length === 0) {
        const availabilities = ph.availabilities;
        const avTime = getAvailabilityforPWithBooking(sortDate(availabilities));
        if (!avTime) {
          // complete this line...similar to the, just set time slot to the first availability in accordace with the duration
          // dataP.push();
          continue;
        }
        if (avTime) {
          dataP.push({
            photographer: {
              id: ph.id,
              name: ph.name,
            },
            timeSlot: {
              starts: avTime.starts,
              ends: avTime.ends,
            },
          });
        }
      }

      if (ph.bookings.length > 0) {
        const { bookings, availabilities } = ph;
        const slot = getPBooking(bookings, availabilities);
        if (Object.keys(slot).length > 0) {
          dataP.push({
            photographer: {
              id: ph.id,
              name: ph.name,
            },
            timeSlot: {
              starts: slot.starts,
              ends: slot.ends,
            },
          });
        } else {
          continue;
        }
      }
    }
    return { photographers: dataP };
  }
  const durationInMinutes: any = req.query.durationInMinutes;
  return res
    .status(200)
    .json(availableTimeSlotsForBooking((durationInMinutes as number) || 90));
}