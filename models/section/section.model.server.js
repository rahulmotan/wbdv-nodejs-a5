var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);

function createSection(section) {
    return sectionModel.create(section);
}

function findSectionsForCourse(courseId) {
    return sectionModel.find({courseId: courseId});
}

function decrementSectionSeats(sectionId) {
    return sectionModel.update({
        _id: sectionId
    }, {
        $inc: {availableSeats: -1}
    });
}

function incrementSectionSeats(sectionId) {
    return sectionModel.update({
        _id: sectionId
    }, {
        $inc: {availableSeats: +1}
    });
}

function findSectionById(sectionId) {
    return sectionModel.findById(sectionId);
}

function deleteSection(sectionId) {
    return sectionModel.deleteOne({_id: sectionId});
}

function updateSection(newSection, sectionId) {
    return sectionModel.updateOne({
        _id: sectionId
    }, {
        $set:
            {
                courseId: newSection.courseId,
                name: newSection.name,
                seats: newSection.seats,
                availableSeats: newSection.availableSeats
            }
    })
}

module.exports = {
    createSection: createSection,
    updateSection: updateSection,
    findSectionsForCourse: findSectionsForCourse,
    decrementSectionSeats: decrementSectionSeats,
    incrementSectionSeats: incrementSectionSeats,
    findSectionById: findSectionById,
    deleteSection: deleteSection
};