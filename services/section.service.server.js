module.exports = function (app) {

    app.post('/api/course/:courseId/section', createSection);
    app.get('/api/course/:courseId/section', findSectionsForCourse);
    app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
    app.get('/api/student/section', findSectionsForStudent);
    app.put('/api/course/:courseId/section/:sectionId/update', updateSection);
    app.delete('/api/section/:sectionId/delete', deleteSection);
    app.delete('/api/section/:sectionId/deregister', deregisterStudentInSection);

    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function deleteSection(req, res) {
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        enrollmentModel.deleteEnrollment(sectionId, studentId)
            .then(function () {
                sectionModel.deleteSection(sectionId).then(
                    function (obj) {
                        res.sendStatus(200);
                    })
            })
    }

    function deregisterStudentInSection(req, res) {
        var sectionId = req.params['sectionId'];
        var currentUser = req.session.currentUser;
        if (currentUser !== undefined) {
            var studentId = currentUser._id;
            sectionModel.incrementSectionSeats(sectionId)
                .then(function () {
                    return enrollmentModel.deleteEnrollment(sectionId, studentId)
                        .then(function (obj) {
                            if (obj.n > 0) {
                                res.sendStatus(200);
                            }
                        })
                })
        } else {
            res.sendStatus(500);
        }
    }

    function updateSection(req, res) {
        var newSection = req.body;
        var sectionId = req.params.sectionId;
        sectionModel.findSectionById(sectionId)
            .then(function (object) {
                var currentSection = object._doc;
                newSection.availableSeats = currentSection.availableSeats +
                    (newSection.seats - currentSection.seats);
                sectionModel.updateSection(newSection, sectionId)
                    .then(function (obj) {
                        res.json(newSection);
                    })
            })

    }

    function findSectionsForStudent(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        if (currentUser !== undefined) {
            enrollmentModel
                .findSectionsForStudent(studentId)
                .then(function (enrollments) {
                    res.json(enrollments)
                });
        }
    }


    function enrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        if (currentUser !== undefined) {
            var studentId = currentUser._id;
            var enrollment = {
                student: studentId,
                section: sectionId
            };

            sectionModel
                .decrementSectionSeats(sectionId)
                .then(function () {
                    return enrollmentModel
                        .enrollStudentInSection(enrollment)
                })
                .then(function (enrollment) {
                    res.json(enrollment);
                })
        } else {
            res.sendStatus(500);
        }
    }

    function findSectionsForCourse(req, res) {
        var courseId = req.params['courseId'];
        sectionModel
            .findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })
    }

    function createSection(req, res) {
        var section = req.body;
        sectionModel
            .createSection(section)
            .then(function (section) {
                res.json(section);
            })
    }
}
;