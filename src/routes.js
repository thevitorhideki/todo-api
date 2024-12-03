import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {search} = req.query

      const tasks = database.select('tasks', search ? {
        title: search.title,
        description: search.description
      } : null);

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (!req.body?.title && !req.body?.description) {
        return res.writeHead(400).end('Informe o título e a descrição')
      }

      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now()
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      if (!req.body?.title && !req.body?.description) {
        return res.writeHead(400).end('Informe o título e a descrição')
      }
      
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end('Informe o título e a descrição')
      }

      const task = database.selectOne('tasks', id)

      if (!task) {
        return res.writeHead(404).end('A Task com esse ID não existe')
      }

      database.update('tasks', id, {
        ...task,
        title: title ? title : task.title,
        description: description ? description : task.description,
        updated_at: Date.now()
      });
      

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectOne('tasks', id)

      if (!task) {
        return res.writeHead(404).end('A Task com esse ID não existe')
      }

      database.delete('tasks', id);

      res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {id} = req.params

      const task = database.selectOne('tasks', id)

      if (!task) {
        return res.writeHead(404).end('A Task com esse ID não existe')
      }

      database.update('tasks', id, {
        ...task,
        completed_at: !task.completed_at ? Date.now() : null
      })

      return res.writeHead(204).end()
    }
  }
];
