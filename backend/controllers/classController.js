const projectModel = require('../models/projectModel.js');

// Add Class Names
const addClassNamesController = async (req, res) => {
  try {
    const { id } = req.params;
    const { classNames } = req.body; // array of class names like ["8", "9", "10"]

    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(404).send({ success: false, message: "❌ Project not found" });
    }

    // ✅ Validation
    if (!Array.isArray(classNames) || classNames.length === 0) {
      return res.status(400).send({ success: false, message: "Please provide valid class names" });
    }

    // ✅ Update classNames field
    project.classNames = classNames;

    // ✅ Also auto-create empty `classWiseSubjects` for each class if not exists
    project.classWiseSubjects = classNames.map((name) => ({
      className: name,
      subjects: [], // initially empty, will be filled later by addClassSubjectsController
    }));

    await project.save();

    res.status(200).send({
      success: true,
      message: "✅ Class names added successfully with empty subject structure",
      project,
    });
  } catch (err) {
    console.error("❌ Error in addClassNamesController:", err);
    res.status(500).send({
      success: false,
      message: "Error adding class names",
      error: err.message,
    });
  }
};


// Get All Classes (for specific project)
const getAllClassesController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.findById(id);

    if (!project) {
      return res.status(404).send({ success: false, message: "❌ Project not found" });
    }

    res.status(200).send({
      success: true,
      message: "✅ Classes fetched successfully",
      classes: project.classWiseSubjects || [], // returns all class names + subjects
    });
  } catch (err) {
    console.error("❌ Error fetching classes:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching classes",
      error: err.message,
    });
  }
};


module.exports = {
    addClassNamesController,
    getAllClassesController
};