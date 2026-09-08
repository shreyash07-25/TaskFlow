from config import tasks_collection


def get_tasks_by_user(user_id):
    return list(tasks_collection.find({"user_id": user_id}))


def create_task(task_data):
    return tasks_collection.insert_one(task_data)


def get_task_by_id(task_id, user_id):
    return tasks_collection.find_one({
        "_id": task_id,
        "user_id": user_id
    })


def update_task(task_id, user_id, update_data):
    return tasks_collection.update_one(
        {
            "_id": task_id,
            "user_id": user_id
        },
        {
            "$set": update_data
        }
    )


def delete_task(task_id, user_id):
    return tasks_collection.delete_one({
        "_id": task_id,
        "user_id": user_id
    })