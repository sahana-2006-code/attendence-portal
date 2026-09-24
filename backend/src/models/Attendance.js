import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
{
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    faculty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true,
    },

    session:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AttendanceSession",
        required:true,
    },

    attendanceTime:{
        type:Date,
        default:Date.now,
    },

    studentLatitude:{
        type:Number,
        required:true,
    },

    studentLongitude:{
        type:Number,
        required:true,
    },

    status:{
        type:String,
        enum:["Present","Absent"],
        default:"Present",
    },
},
{
    timestamps:true,
}
);

attendanceSchema.index(
{
    student:1,
    session:1,
},
{
    unique:true,
}
);

const Attendance = mongoose.model(
    "Attendance",
    attendanceSchema
);

export default Attendance;