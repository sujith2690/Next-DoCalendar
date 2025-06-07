// import mongoose from "mongoose";

// const EventSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users",
//         required: true
//     },
//     userEmail: {
//         type: String,
//         required: true
//     },
//     events: [
//         {
//             googleEventId: {
//                 type: String,
//                 required: true
//             },
//             summary: String,
//             description: String,
//             location: String,
//             start: Object,
//             end: Object,
//             attendees: [],
//             createdAt: {
//                 type: Date,
//                 default: Date.now
//             }
//         }
//     ],
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const eventModel = mongoose.models.GoogleEvent || mongoose.model("GoogleEvent", EventSchema);
// export default eventModel;



import mongoose from "mongoose";

const AttendeeSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        responseStatus: { type: String, default: "needsAction" },
    },
    { _id: false } // prevents Mongo from auto-adding _id for subdocs
);

const EventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    events: [
        {
            googleEventId: {
                type: String,
                required: true,
            },
            summary: String,
            description: String,
            location: String,
            start: Object,
            end: Object,
            attendees: [AttendeeSchema], // ✅ Now attendees field is properly structured
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// if (mongoose.models.GoogleEvent) {
//     delete mongoose.models.GoogleEvent;
// }
const eventModel =
    mongoose.models.GoogleEvent || mongoose.model("GoogleEvent", EventSchema);
export default eventModel;
