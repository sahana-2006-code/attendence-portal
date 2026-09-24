import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../services/subject.service.js";
import ApiResponse from "../utils/apiResponse.js";
export const create = async (req, res, next) => {
  try {
    const subject = await createSubject(req.body, req.user.id);
    return res.status(201).json(
    new ApiResponse(
        201,
        "Subject created successfully",
        subject
    )
);
    
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const subjects = await getAllSubjects(req.user.id);

   return res.status(200).json(
    new ApiResponse(
        200,
        "Subjects fetched successfully",
        subjects
    )
);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const subject = await getSubjectById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const subject = await updateSubject(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteSubject(req.params.id, req.user.id);

    return res.status(200).json(
    new ApiResponse(
        200,
        "Subject deleted successfully"
    )
);
  } catch (error) {
    next(error);
  }
};