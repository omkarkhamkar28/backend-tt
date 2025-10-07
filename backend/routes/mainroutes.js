let express = require("express");
const {
    addProjectController,
    getAllProjectsController,
    getSingleProjectController,
    generateTimeTableController,
    updateProjectController,
    deleteProjectController
} = require("../controllers/projectController");

const {
    getAllClassesController,
    addClassNamesController
} = require("../controllers/classController");

const {
    addTeachersController
} = require("../controllers/teacherController");

const { addClassSubjectsController } = require("../controllers/subjectController");


//router object 
const router = express.Router();

// Project routes
router.post("/project", addProjectController);
router.get("/projects", getAllProjectsController);
router.get("/project/:id", getSingleProjectController);
router.put("/project-update/:id", updateProjectController);
router.delete("/project-delete/:id", deleteProjectController);

// Class routes
router.put("/project/:id/classes", addClassNamesController);
router.get("/classes", getAllClassesController);


// Teacher routes
router.put("/project/:id/teachers", addTeachersController);


// Teacher routes
router.put("/project/:id/subject", addClassSubjectsController);

router.get("/project/:id/generate-timetable", generateTimeTableController);



module.exports = router;
