import { getFacultyDashboard ,getStudentDashboard} from "../services/dashboard.service.js";

export const facultyDashboard = async (req, res, next) => {

    try {

        const dashboard = await getFacultyDashboard(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: dashboard,
        });

    } catch (error) {

        next(error);

    }

};
export const studentDashboard = async (req, res, next) => {

    try {

        const dashboard = await getStudentDashboard(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: dashboard,
        });

    } catch (error) {

        next(error);

    }

};