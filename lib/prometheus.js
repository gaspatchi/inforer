import client from "prom-client";

export let registry = new client.Registry();

export let teachers_find = new client.Counter({ name: "inforer_teachers_find", help: "Количество поисков преподавателя" });
export let teachers_select = new client.Counter({ name: "inforer_teachers_select", help: "Количество просмотров страницы преподователя" });

export let lessons_find = new client.Counter({ name: "inforer_lessons_find", help: "Количество поисков пары" });
export let lessons_select = new client.Counter({ name: "inforer_lessons_select", help: "Количество просмотров страницы пары" });

export let cabinet_find = new client.Counter({ name: "inforer_cabinet_find", help: "Количество поисков кабинета" });
export let cabinet_select = new client.Counter({ name: "inforer_cabinet_select", help: "Количество просмотров страницы кабинета" });

registry.registerMetric(teachers_find);
registry.registerMetric(teachers_select);
registry.registerMetric(lessons_find);
registry.registerMetric(lessons_select);
registry.registerMetric(cabinet_find);
registry.registerMetric(cabinet_select);