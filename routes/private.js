const express = require('express');
const { getPrivateData } = require('../controllers/private'); //Aqui luego hay que cambiarlo por el home
const notesController = require('../controllers/notes-controller');
const projectsController = require('../controllers/projects-controller');
const reportsController = require('../controllers/reports-controller');
const programsController = require('../controllers/programs-controller');
const blogsController = require('../controllers/blogs-controller');
const usersController = require('../controllers/users-controller');
const factorsController = require('../controllers/factors-controller');
const recordsController = require('../controllers/records-controller');
const upload_fileController = require('../controllers/upload_file-controller');
const predictionController = require('../controllers/predictions-controller');
const {register } = require('../controllers/auth');
const upload = require("../middleware/upload");

const checkAuth = require('../middleware/auth');

const router = express.Router();

router.use(checkAuth);

router.get("/", getPrivateData); //Esto solo se agrega para tener algo que mostrar en el path de / en el get

router.get('/notes/:nid', notesController.getNoteById);

router.get('/user/', notesController.getNotesByUserId);

router.route("/notes").post(notesController.createNote);


router.route("/notes/:nid").patch(notesController.updateNote);
  
router.delete('/notes/:nid', notesController.deleteNote);


router.route("/project").post(projectsController.createProject);
router.get('/project/', projectsController.getProjects);
router.get('/project/:bid', projectsController.getProjectById);
router.get('/filteredproject/:uid', projectsController.getFilteredProjects);
router.delete('/project/:bid', projectsController.deleteProject);
router.patch('/project/:bid', projectsController.updateProject);


router.get('/users/', usersController.getUsers);
router.get('/allUsers/:uid', usersController.getAllUsers);
router.patch('/users/:uid', usersController.updateUser);
router.delete('/users/:uid', usersController.deleteUser);
router.get('/users/:uid', usersController.getUserById);
router.post('/userRole/:uid', usersController.updateRole);
router.get('/permissions/:uid/:bid', usersController.getPermissionsFromBio);

router.route("/register").post(register);


router.route("/program").post(programsController.createProgram);
router.get('/program/:pid', programsController.getProgramById);
router.get('/program/', programsController.getPrograms);
router.get('/filteredprogram/:bid', programsController.getFilteredPrograms);
router.get('/programproject/:bid', programsController.getProgramsFromBio);
router.patch('/program/:pid', programsController.updateProgram);
router.delete('/program/:pid', programsController.deleteProgram);
router.get('/programPicture/:pid', programsController.getProgramPicture);

router.route("/blog").post(blogsController.createBlog);
router.get('/blog/:pid', blogsController.getBlogById);
router.get('/blog/', blogsController.getBlogs);
router.get('/filteredblog/:bid', blogsController.getFilteredBlogs);
router.get('/blogproject/:bid', blogsController.getBlogsFromBio);
router.patch('/blog/:pid', blogsController.updateBlog);
router.delete('/blog/:pid', blogsController.deleteBlog);
router.get('/blogPicture/:pid', blogsController.getBlogPicture);



router.route("/report").post(reportsController.createReport);
router.get('/report/', reportsController.getReports);
router.get('/report/:bid', reportsController.getReportById);
router.get('/filteredreport/:uid', reportsController.getFilteredReports);
router.delete('/report/:bid', reportsController.deleteReport);
router.patch('/report/:bid', reportsController.updateReport);


router.route("/factor").post(factorsController.createFactor);
router.get('/factor/', factorsController.getFactors);
router.get('/factor/:fid', factorsController.getFactorById);
router.delete('/factor/:fid/:bid', factorsController.deleteFactor);
router.patch('/factor/:fid', factorsController.updateFactor);
router.get('/factorproject/:bid', factorsController.getFactorsFromBio);

router.route("/record").post(recordsController.createRecord);
router.get('/record/:bid/:pid', recordsController.getRecordsFromBioXProgram);
router.get('/record/num/:bid/:pid', recordsController.getNumRecordsFromBioXProgram);
router.delete('/record/:rid', recordsController.deleteRecord);
router.patch('/record/:rid', recordsController.updateRecord);

router.post("/upload_file", upload.single("file"), upload_fileController.saveImage);
router.get('/fetchImage/:file(*)', upload_fileController.getImage);

router.route("/prediction").post(predictionController.createPrediction);
router.get('/prediction/', predictionController.getPredictions);

module.exports = router;
