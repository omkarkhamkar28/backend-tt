const mongoose = require("mongoose");

const classSubjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  oneWeekLectures: { type: Number, required: true }, // per week lectures
});

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subjects: [classSubjectSchema],
});

const teacherSubjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  classAssigned: { type: String, required: true }, // "8", "9", "10" etc.
});

const teacherSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  subjects: [teacherSubjectSchema], // subjects handled by teacher
});

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    totalClasses: Number,
    totalTeachers: Number,
    weekDays: Number,
    lecturesPerDay: Number,

    classNames: [String],

    classWiseSubjects: [classSchema],

    teachers: [teacherSchema],
  },
  { timestamps: true }
);

// 🎯 Model export
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
