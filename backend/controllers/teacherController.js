const projectModel = require('../models/projectModel.js');

const addTeachersController = async (req, res) => {
  try {
    const { id } = req.params;
    const { teachers } = req.body; // [{ teacherName, subjects: [{ classAssigned, subjectName }] }]

    // 🔍 1. Validate project
    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "❌ Project not found",
      });
    }

    // 🔍 2. Validate teacher structure
    if (!Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide valid teachers array",
      });
    }

    // 🔍 3. Optional: verify classAssigned values exist in project.classNames
    const validClasses = project.classNames || [];
    for (const t of teachers) {
      for (const s of t.subjects) {
        if (!validClasses.includes(s.classAssigned)) {
          return res.status(400).send({
            success: false,
            message: `Invalid class '${s.classAssigned}' for teacher '${t.teacherName}'`,
          });
        }
      }
    }

    // ✅ 4. Save new teachers (replace or merge)
    project.teachers = teachers;
    await project.save();

    res.status(200).send({
      success: true,
      message: "✅ Teachers & subjects added successfully",
      project,
    });
  } catch (err) {
    console.error("❌ Error in addTeachersController:", err);
    res.status(500).send({
      success: false,
      message: "Error adding teachers",
      error: err.message,
    });
  }
};

module.exports = {
    addTeachersController
}