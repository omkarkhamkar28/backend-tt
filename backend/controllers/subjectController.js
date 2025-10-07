const projectModel = require('../models/projectModel');

// Add or Update Class Subjects
const addClassSubjectsController = async (req, res) => {
  try {
    const { id } = req.params; // project ID
    const { className, subjects } = req.body;

    if (!className || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide valid class name and subject list",
      });
    }

    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    // ✅ Check if class already exists in project.classWiseSubjects
    const classIndex = project.classWiseSubjects.findIndex(
      (cls) => cls.className === className
    );

    if (classIndex > -1) {
      // Class exists → update its subjects
      project.classWiseSubjects[classIndex].subjects = subjects;
    } else {
      // New class → add to array
      project.classWiseSubjects.push({ className, subjects });
    }

    await project.save();

    res.status(200).send({
      success: true,
      message: `Subjects added/updated successfully for class ${className}`,
      classWiseSubjects: project.classWiseSubjects,
    });
  } catch (err) {
    console.error("❌ Error in addClassSubjectsController:", err);
    res.status(500).send({
      success: false,
      message: "Error adding class subjects",
      error: err.message,
    });
  }
};




module.exports = {
    addClassSubjectsController
};