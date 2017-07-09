import express from "express";
import { Specialties, Teachers, Groups, Schedule, Lessons, Cabinets } from "../models/schedule";
import { groups_find, groups_select, teachers_find, teachers_select, lessons_find, lessons_select, cabinet_find, cabinet_select } from "../lib/prometheus";
import _ from "lodash";
import sequelize from "sequelize";
import tarantool from "../lib/tarantool";
import { JsonValidate } from "../middlewares/validate";

let info_router = express.Router();

info_router.post("/group/find", JsonValidate("search"), async (req, res) => {
	try {
		let groups = await Groups.findAll({
			attributes: ["group_id", "group", "course"],
			where: {
				group: { $like: `%${req.body.query}%` }
			}
		});
		if (groups.length === 0) {
			res.status(404).json({ message: "Группа не найдена" });
		} else {
			groups_find.inc();
			res.status(200).json({ "result": groups });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "searchGroups", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно произвести поиск" });
	}
});

info_router.get("/group/:group", async (req, res) => {
	try {
		let group = await Groups.findOne({
			attributes: ["group_id", "group", "course"],
			where: { group_id: req.params.group }, include: [
				{ model: Teachers, as: "teacher", attributes: ["teacher_id", "firstname", "lastname", "patronymic"] },
				{ model: Specialties, as: "speciality", attributes: ["speciality"]}]});
		if (group === null) {
			res.status(404).json({ message: "Группа не найдена" });
		} else {
			groups_select.inc();
			res.status(200).json({ "result": group });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "selectGroup", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить страницу группы" });
	}
});

info_router.post("/teacher/find", JsonValidate("search"), async (req, res) => {
	try {
		let teachers = await Teachers.findAll({
			attributes: ["teacher_id", "firstname", "lastname", "patronymic"],
			where: {
				$or: [
					{ firstname: { $like: `%${req.body.query}%` } },
					{ lastname: { $like: `%${req.body.query}%` } },
					{ patronymic: { $like: `%${req.body.query}%` } }
				]
			}
		});
		if (teachers.length === 0) {
			res.status(404).json({ message: "Преподаватель не найден" });
		} else {
			teachers_find.inc();
			res.status(200).json({ "result": teachers });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "searchTeachers", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно произвести поиск" });
	}
});

info_router.get("/teacher/:teacher", async (req, res) => {
	try {
		let result = {};
		let teacher = await Teachers.findOne({
			attributes: ["teacher_id", "image_id", "firstname", "lastname", "patronymic", "email", "post", "verified"],
			where: { teacher_id: req.params.teacher }
		});
		if (teacher === null) {
			res.status(404).json({ message: "Преподаватель не найден" });
		} else {
			result.teacher = teacher;
			let image = await tarantool.selectImage(result.teacher.dataValues.image_id);
			if (image[0][0] === true) {
				result.teacher.dataValues.image = image[1][0];
			} else {
				result.teacher.dataValues.image = null;
			}
			let lessons = await Schedule.findAll({
				attributes: [],
				where: { teacher_id: req.params.teacher }, include: [
					{ model: Lessons, as: "lesson", attributes: ["lesson_id", "lesson"] }]
			});
			let groups = await Schedule.findAll({
				attributes: [],
				where: { teacher_id: req.params.teacher }, include: [
					{
						model: Groups, as: "group", attributes: ["group_id", "group", "course"],
						include: [{
							attributes: ["speciality"],
							model: Specialties, as: "speciality"
						}]
					}]
			});
			if (lessons.length !== 0) {
				result.lessons = lessons;
			} else {
				result.lessons = null;
			}
			if (groups.length !== 0) {
				result.groups = groups;
			} else {
				result.groups = null;
			}
			delete result.teacher.dataValues.image_id;
			teachers_select.inc();
			res.status(200).json({ "result": result });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "selectTeacher", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить профиль преподавателя" });
	}
});

info_router.post("/lesson/find", JsonValidate("search"), async (req, res) => {
	try {
		let lessons = await Lessons.findAll({
			attributes: ["lesson_id", "lesson"],
			where: {
				$or: [
					{ lesson: { $like: `%${req.body.query}%` } },
					{ shortname: { $like: `%${req.body.query}%` } }
				]
			}
		});
		if (lessons.length === 0) {
			res.status(404).json({ message: "Пара не найдена" });
		} else {
			lessons_find.inc();
			res.status(200).json({ "result": lessons });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "searchLessons", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно произвести поиск" });
	}
});

info_router.get("/lesson/:lesson", async (req, res) => {
	try {
		let result = {};
		let lesson = await Lessons.findOne({
			attributes: ["lesson_id", "lesson", "description", "verified"],
			where: { lesson_id: req.params.lesson }
		});
		if (lesson === null) {
			res.status(404).json({ message: "Пара не найдена" });
		} else {
			result.lesson = lesson;
			let teachers = await Schedule.findAll({
				attributes: [],
				where: { lesson_id: req.params.lesson }, include: [{ model: Teachers, as: "teacher", attributes: ["teacher_id", "firstname", "lastname", "patronymic"] }]
			});
			let groups = await Schedule.findAll({
				attributes: [],
				where: { lesson_id: req.params.lesson }, include: [
					{
						model: Groups, as: "group", attributes: ["group_id", "group", "course"],
						include: [{
							attributes: ["speciality"],
							model: Specialties, as: "speciality"
						}]
					}]
			});
			if (teachers.length !== 0) {
				result.teachers = _.uniqBy(teachers, "teacher.teacher_id");
			} else {
				result.teachers = null;
			}
			if (groups.length !== 0) {
				result.groups = _.uniqBy(groups, "group.group_id");
			} else {
				result.groups = null;
			}
			lessons_select.inc();
			res.status(200).json({ "result": result });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "selectLesson", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить страницу пары" });
	}
});

info_router.post("/cabinet/find", JsonValidate("search"), async (req, res) => {
	try {
		let cabinets = await Cabinets.findAll({
			attributes: ["cabinet_id", "cabinet"],
			where: {
				cabinet: { $like: `%${req.body.query}%` }
			}
		});
		if (cabinets.length === 0) {
			res.status(404).json({ message: "Кабинет не найден" });
		} else {
			cabinet_find.inc();
			res.status(200).json({ "result": cabinets });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "searchCabinets", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно произвести поиск" });
	}
});


info_router.get("/cabinet/:cabinet", async (req, res) => {
	try {
		let result = {};
		let cabinet = await Cabinets.findOne({
			attributes: ["cabinet_id", "image_id", "cabinet", "housing", "floor", "description", "verified"],
			where: { cabinet_id: req.params.cabinet }
		});
		if (cabinet === null) {
			res.status(404).json({ message: "Кабинет не найден" });
		} else {
			result.cabinet = cabinet;
			let image = await tarantool.selectImage(result.cabinet.dataValues.image_id);
			if (image[0][0] === true) {
				result.cabinet.dataValues.image = image[1][0];
			} else {
				result.cabinet.dataValues.image = null;
			}
			let lessons = await Schedule.findAll({
				attributes: ["index"],
				where: { cabinet_id: req.params.cabinet, date: [sequelize.literal("select date from schedules order by date desc limit 1")] },
				include: [
					{ model: Lessons, as: "lesson", attributes: ["lesson_id", "lesson"] },
					{ model: Groups, as: "group", attributes: ["group_id", "group", "course"] },
					{ model: Teachers, as: "teacher", attributes: ["teacher_id", "firstname", "lastname", "patronymic"] }]
			});
			if (lessons.length !== 0) {
				result.lessons = _.sortBy(lessons, "index");
			} else {
				result.lessons = null;
			}
			delete result.cabinet.dataValues.image_id;
			cabinet_select.inc();
			res.status(200).json({ "result": result });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Info", section: "selectCabinet", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить страницу кабинета" });
	}
});


export default info_router;