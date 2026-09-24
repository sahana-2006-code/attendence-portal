import Subject from "../models/Subject.js";
import AppError from "../utils/AppError.js";

export const createSubject = async (subjectData, facultyId) => {
  const existingSubject = await Subject.findOne({
    subjectCode: subjectData.subjectCode,
  });

  if (existingSubject) {
    throw new AppError("Subject code already exists", 409);
  }

  const subject = await Subject.create({
    ...subjectData,
    department: subjectData.department
      ? String(subjectData.department).trim().toUpperCase()
      : subjectData.department,
    semester: Number(subjectData.semester),
    section: subjectData.section
      ? String(subjectData.section).trim().toUpperCase()
      : subjectData.section,
    faculty: facultyId,
  });

  return subject;
};

export const getAllSubjects = async (facultyId) => {
  return await Subject.find({
    faculty: facultyId,
    isActive: true,
  }).sort({ createdAt: -1 });
};

export const getSubjectById = async (id, facultyId) => {
  const subject = await Subject.findOne({
    _id: id,
    faculty: facultyId,
    isActive: true,
  });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject;
};

export const updateSubject = async (id, facultyId, updateData) => {
  const subject = await Subject.findOneAndUpdate(
    {
      _id: id,
      faculty: facultyId,
      isActive: true,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject;
};

export const deleteSubject = async (id, facultyId) => {
  const subject = await Subject.findOneAndUpdate(
    {
      _id: id,
      faculty: facultyId,
      isActive: true,
    },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject;
};