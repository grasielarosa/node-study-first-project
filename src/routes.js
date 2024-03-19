import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query ?? {};

      try {
        const tasks = database.select(
          "tasks",
          search
            ? {
                title: search,
                description: search,
              }
            : null
        );
        return response
          .setHeader("Content-type", "application/json")
          .writeHead(200)
          .end(JSON.stringify(tasks));
      } catch (error) {
        return response.writeHead(500).end("Error retrieving tasks");
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (request, response) => {
      const { title, description } = request.body;

      if (!title || !description) {
        return response
          .writeHead(400)
          .end('Missing "title" or "description" parameter');
      }
      const newTask = {
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title,
        description,
        completed_at: null,
      };

      try {
        await database.insert("tasks", newTask);
        response.statusCode = 201;
        response.end();
      } catch (error) {
        response.statusCode = 500;
        response.end("Failed to insert new task");
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      if (!id) {
        return response.writeHead(400).end('Missing "id" parameter');
      }
      const { title, description } = request.body || {};
      const task = database.select("tasks", { id });
      if (!task) {
        return response.writeHead(404).end("Task not found");
      }
      database.update("tasks", id, {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        updatedAt: new Date(),
      });
      return response.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const { completed_at } = request.body || {};

      if (!id) {
        return response.writeHead(400).end('Missing "id" parameter');
      }

      const [task] = database.select("tasks", { id });

      if (!task) {
        return response.writeHead(404).end("Task not found");
      }

      const isTaskCompleted = completed_at === true;
      if (isTaskCompleted) {
        database.update("tasks", id, {
          completed_at: new Date(),
          updatedAt: new Date(),
        });
      }
      return response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      if (!id) {
        return response.writeHead(400).end('Missing "id" parameter');
      }

      try {
        database.delete("tasks", id);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(`Task ${id} deleted`);
      } catch (error) {
        if (error.message.includes("not found")) {
          response.writeHead(404);
        } else {
          console.error(error);
          response.writeHead(500);
        }
        response.end(error.message);
      }
    },
  },
];
