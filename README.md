**Inforer** - сервис для получения информации о кабинете/паре/преподе

**Примеры запросов и ответов**


----------
- `POST` /group/find - Поиск группы
- `Request`
```
{
	"query": "..."
}
```
- `Response`
```
{
    "result": [
        {
            "group_id": 1,
            "group": "311",
            "course": null,
            "speciality": {
				"speciality": "..."
            }
        },
        {
            "group_id": 2,
            "group": "321",
            "course": 2,
            "speciality": {
				"speciality": "..."
            }
        }
    ]
}
```
- `GET` /group/{group_id} - Получение информации о группе
- `Response`
```
{
  "result": {
    "group": {
      "group_id": 2,
      "group": "321",
      "course": 2,
      "teacher": {
        "teacher_id": 2,
        "firstname": "...",
        "lastname": "...",
        "patronymic": "..."
      },
      "speciality": {
        "speciality": "..."
      }
    }
  }
}
```

- `POST` /lesson/find - Поиск пары
- `Request`
```
{
	"query": "..."
}
```
- `Response`
```
{
    "result": [
        {
            "lesson_id": 1,
            "lesson": "Информатика"
        },
        {
            "lesson_id": 3,
            "lesson": "История"
        }
    ]
}
```

- `GET` /lesson/{lesson_id} - Получение информации о паре
- `Response`
```
{
    "result": {
        "lesson": {
            "lesson_id": 3,
            "lesson": "История",
            "description": null,
            "verified": false
        },
        "teachers": [
            {
                "teacher": {
                    "teacher_id": 3,
                    "firstname": "...",
                    "lastname": "...",
                    "patronymic": "..."
                }
            }
        ],
        "groups": [
            {
                "group": {
                    "group_id": 2,
                    "group": "321",
                    "course": null,
                    "speciality": {
                        "speciality": "..."
                    }
                }
            },
            {
                "group": {
                    "group_id": 3,
                    "group": "011",
                    "course": null,
                    "speciality": null
                }
            }
        ]
    }
}
```

- `POST` /teacher/find - Поиск пары
- `Request`
```
{
	"query": "..."
}
```
- `Response`
```
{
    "result": [
        {
            "teacher_id": 2,
            "firstname": "...",
            "lastname": "...",
            "patronymic": "..."
        }
    ]
}
```

- `GET` /teacher/{teacher_id} - Получение информации о преподе
- `Response`
```
{
    "result": {
        "teacher": {
            "teacher_id": 2,
            "firstname": "...",
            "lastname": "...",
            "patronymic": "...",
            "email": null,
            "post": null,
            "verified": false,
            "image": "..."
        },
        "lessons": [
            {
                "lesson": {
                    "lesson_id": 1,
                    "lesson": "Информатика"
                }
            },
            {
                "lesson": {
                    "lesson_id": 2,
                    "lesson": "Математика"
                }
            }
        ],
        "groups": [
            {
                "group": {
                    "group_id": 1,
                    "group": "311",
                    "course": null,
                    "speciality": null
                }
            },
            {
                "group": {
                    "group_id": 2,
                    "group": "321",
                    "course": null,
                    "speciality": {
                        "speciality": "..."
                    }
                }
            }
        ]
    }
}
```


- `POST` /cabinet/find - Поиск кабинета
- `Request`
```
{
	"query": "..."
}
```
- `Response`
```
{
    "result": [
        {
            "cabinet_id": 1,
            "cabinet": "126"
        },
        {
            "cabinet_id": 2,
            "cabinet": "101"
        },
        {
            "cabinet_id": 3,
            "cabinet": "112"
        }
    ]
}
```

- `GET` /cabinet/{cabinet_id} - Получение информации о кабинете
- `Response`
```
{
    "result": {
        "cabinet": {
            "cabinet_id": 3,
            "cabinet": "112",
            "housing": null,
            "floor": null,
            "description": null,
            "verified": false,
            "image": "..."
        },
        "lessons": [
            {
                "index": 1,
                "lesson": {
                    "lesson_id": 3,
                    "lesson": "История"
                },
                "group": {
                    "group_id": 2,
                    "group": "321",
                    "course": null
                },
                "teacher": {
                    "teacher_id": 3,
                    "firstname": "...",
                    "lastname": "...",
                    "patronymic": "..."
                }
            },
            {
                "index": 2,
                "lesson": {
                    "lesson_id": 4,
                    "lesson": "Физика"
                },
                "group": {
                    "group_id": 4,
                    "group": "911",
                    "course": null
                },
                "teacher": {
                    "teacher_id": 4,
                    "firstname": "...",
                    "lastname": "...",
                    "patronymic": "..."
                }
            },
            {
                "index": 4,
                "lesson": {
                    "lesson_id": 5,
                    "lesson": "Русский"
                },
                "group": {
                    "group_id": 5,
                    "group": "511",
                    "course": null
                },
                "teacher": {
                    "teacher_id": 5,
                    "firstname": "...",
                    "lastname": "...",
                    "patronymic": "..."
                }
            }
        ]
    }
}
```