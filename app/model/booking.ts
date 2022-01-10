import mongoose, {Schema} from "mongoose";

const photoSchema = new Schema ({
    durationInMinutes: {
        type: Number
    },
    photographer: [{
        name: {
            type: String
        },
        availabilities: [{
            start: {
                type: Date
            },
            ends: {
                type: Date
            }
        }],
        booking: [{
            id: {
                type: Number,
                default: 0,
            },
            start: {
                type: Date
            },
            ends: {
                type: Date
            }
        }]

    }]

})