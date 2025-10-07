const Project = require('../models/projectModel');

// ➕ Add Project
const addProjectController = async (req, res) => {
  try {
    const { projectName, totalClasses, totalTeachers, weekDays, lecturesPerDay, classNames } = req.body;

    const project = new Project({
      projectName,
      totalClasses,
      totalTeachers,
      weekDays,
      lecturesPerDay,
      classNames: classNames || [], // optional array of class names
      classWiseSubjects: [], // initially empty — will be added later
      teachers: [],          // initially empty
    });

    await project.save();

    res.status(201).send({
      success: true,
      message: "✅ Project added successfully",
      project,
    });
  } catch (err) {
    console.error("❌ Error in addProjectController:", err);
    res.status(500).send({
      success: false,
      message: "Error in adding project",
      error: err.message,
    });
  }
};

// 📋 Get All Projects
const getAllProjectsController = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "📚 All projects fetched successfully",
      total: projects.length,
      projects,
    });
  } catch (err) {
    console.error("❌ Error in getAllProjectsController:", err);
    res.status(500).send({
      success: false,
      message: "Error while fetching projects",
      error: err.message,
    });
  }
};

// 📘 Get Single Project (with full structure)
const getSingleProjectController = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "❌ Project not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "✅ Single project fetched successfully",
      project: {
        _id: project._id,
        projectName: project.projectName,
        totalClasses: project.totalClasses,
        totalTeachers: project.totalTeachers,
        weekDays: project.weekDays,
        lecturesPerDay: project.lecturesPerDay,
        classNames: project.classNames || [],
        classWiseSubjects: project.classWiseSubjects || [], // now included
        teachers: project.teachers || [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ Error in getSingleProjectController:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching project",
      error: err.message,
    });
  }
};

// Update Project
const updateProjectController = async (req, res) => {
    try {
        const { projectName, totalClasses, totalTeachers, weekDays, lecturesPerDay } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { projectName, totalClasses, totalTeachers, weekDays, lecturesPerDay },
            { new: true }
        );

        if (!updatedProject) return res.status(404).send({ success: false, message: "Project not found" });

        res.status(200).send({
            success: true,
            message: "Project updated successfully",
            updatedProject
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error updating project",
            error: err.message
        });
    }
};

// Delete Project
const deleteProjectController = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).send({ success: false, message: "Project not found" });

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).send({ success: true, message: "Project deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error deleting project", error: err.message });
    }
};

// const generateTimeTableController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const project = await Project.findById(id);
//     if (!project)
//       return res.status(404).send({ success: false, message: "Project not found" });

//     const { classNames, teachers, weekDays, lecturesPerDay, classWiseSubjects } = project;

//     // Initialize structures
//     const timetable = {};           // timetable[class][day][lecture] = { subject, teacher }
//     const teacherSchedule = {};     // teacherSchedule[teacherName][day][lecture] = true/false
//     const classLectureCount = {};   // classLectureCount[class][subject] = remaining lectures per week

//     // Initialize timetable and lecture counts
//     classNames.forEach(cls => {
//       timetable[cls] = Array.from({ length: weekDays }, () => Array(lecturesPerDay).fill(null));
//       classLectureCount[cls] = {};
//     });

//     teachers.forEach(t => {
//       teacherSchedule[t.teacherName] = Array.from({ length: weekDays }, () => Array(lecturesPerDay).fill(false));
//     });

//     // Fill classLectureCount from classWiseSubjects
//     classWiseSubjects.forEach(cls => {
//       const className = cls.className;
//       cls.subjects.forEach(sub => {
//         classLectureCount[className][sub.subjectName] = sub.oneWeekLectures;
//       });
//     });

//     // Function to get teacher for class+subject
//     const getTeacher = (className, subjectName) => {
//       const teacher = teachers.find(t =>
//         t.subjects.some(s => s.classAssigned === className && s.subjectName === subjectName)
//       );
//       return teacher ? teacher.teacherName : null;
//     };

//     // Assign lectures for each class
//     classNames.forEach(cls => {
//       for (let day = 0; day < weekDays; day++) {
//         for (let lec = 0; lec < lecturesPerDay; lec++) {
//           // Pick subjects that still have remaining lectures
//           const availableSubjects = Object.keys(classLectureCount[cls]).filter(
//             sub => classLectureCount[cls][sub] > 0
//           );

//           // Shuffle to avoid same pattern every day
//           availableSubjects.sort(() => Math.random() - 0.5);

//           let assigned = false;
//           for (const subName of availableSubjects) {
//             const teacher = getTeacher(cls, subName);
//             if (!teacherSchedule[teacher][day][lec]) {
//               timetable[cls][day][lec] = { subject: subName, teacher };
//               teacherSchedule[teacher][day][lec] = true;
//               classLectureCount[cls][subName]--;
//               assigned = true;
//               break;
//             }
//           }

//           // Fallback if no subject could be assigned (rare)
//           if (!assigned) {
//             const subName = availableSubjects[0];
//             const teacher = getTeacher(cls, subName);
//             timetable[cls][day][lec] = { subject: subName, teacher };
//             teacherSchedule[teacher][day][lec] = true;
//             classLectureCount[cls][subName]--;
//           }
//         }
//       }
//     });

//     res.status(200).send({ success: true, message: "Timetable generated", timetable });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, message: "Error generating timetable", error: err.message });
//   }
// };


const generateTimeTableController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project)
      return res.status(404).send({ success: false, message: "Project not found" });

    const {
      projectName,
      classNames,
      teachers,
      weekDays,
      lecturesPerDay,
      classWiseSubjects,
    } = project;

    // Initialize structures
    const timetable = {};           // timetable[class][day][lecture] = { subject, teacher }
    const teacherSchedule = {};     // teacherSchedule[teacherName][day][lecture] = true/false
    const classLectureCount = {};   // classLectureCount[class][subject] = remaining lectures per week

    // Initialize timetable and lecture counts
    classNames.forEach((cls) => {
      timetable[cls] = Array.from({ length: weekDays }, () =>
        Array(lecturesPerDay).fill(null)
      );
      classLectureCount[cls] = {};
    });

    teachers.forEach((t) => {
      teacherSchedule[t.teacherName] = Array.from({ length: weekDays }, () =>
        Array(lecturesPerDay).fill(false)
      );
    });

    // Fill classLectureCount from classWiseSubjects
    classWiseSubjects.forEach((cls) => {
      const className = cls.className;
      cls.subjects.forEach((sub) => {
        classLectureCount[className][sub.subjectName] = sub.oneWeekLectures;
      });
    });

    // Function to get teacher for class+subject
    const getTeacher = (className, subjectName) => {
      const teacher = teachers.find((t) =>
        t.subjects.some(
          (s) => s.classAssigned === className && s.subjectName === subjectName
        )
      );
      return teacher ? teacher.teacherName : null;
    };

    // Assign lectures for each class
    classNames.forEach((cls) => {
      for (let day = 0; day < weekDays; day++) {
        for (let lec = 0; lec < lecturesPerDay; lec++) {
          // Pick subjects that still have remaining lectures
          const availableSubjects = Object.keys(classLectureCount[cls]).filter(
            (sub) => classLectureCount[cls][sub] > 0
          );

          // Shuffle to avoid same pattern every day
          availableSubjects.sort(() => Math.random() - 0.5);

          let assigned = false;
          for (const subName of availableSubjects) {
            const teacher = getTeacher(cls, subName);
            if (!teacherSchedule[teacher][day][lec]) {
              timetable[cls][day][lec] = { subject: subName, teacher };
              teacherSchedule[teacher][day][lec] = true;
              classLectureCount[cls][subName]--;
              assigned = true;
              break;
            }
          }

          // Fallback if no subject could be assigned (rare)
          if (!assigned && availableSubjects.length > 0) {
            const subName = availableSubjects[0];
            const teacher = getTeacher(cls, subName);
            timetable[cls][day][lec] = { subject: subName, teacher };
            teacherSchedule[teacher][day][lec] = true;
            classLectureCount[cls][subName]--;
          }
        }
      }
    });

    // ✅ Send projectName along with timetable
    res.status(200).send({
      success: true,
      message: "Timetable generated",
      projectName,
      timetable,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error generating timetable",
      error: err.message,
    });
  }
};



module.exports = {
    addProjectController,
    getAllProjectsController,
    getSingleProjectController,
    generateTimeTableController,
    updateProjectController,
    deleteProjectController
}