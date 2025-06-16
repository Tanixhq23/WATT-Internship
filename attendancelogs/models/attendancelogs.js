const mongoose = require("mongoose");

const AttendancelogsSchema = new mongoose.Schema({
    time:{type: String, required: true},
    eventName:{type:String, required:true},
    payload:{type:String, required: true},
    result: {type: String, required: true},
});

module.exports = mongoose.model("attendancelogs", AttendancelogsSchema);
