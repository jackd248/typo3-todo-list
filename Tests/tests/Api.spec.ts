import {test, expect} from '@playwright/test';
import {getRandomNumber} from './../utils/helper';

test('should create a new task', async ({request}) => {
    const title = '[Api] New task ' + getRandomNumber(1, 1000);
    const newTask = await request.post(`/_api/tasks`, {
        data: {
            title: title,
            description: 'Lorem ipsum',
        }
    });
    expect(newTask.ok()).toBeTruthy();
    expect(await newTask.json()).toEqual(expect.objectContaining({
        title: title,
        description: 'Lorem ipsum',
    }));
});

test('should list all task', async ({ request }) => {
    const response = await request.get(`/_api/tasks`);
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    const tasks = json['hydra:member'];

    expect(tasks).toEqual(expect.arrayContaining([
        expect.objectContaining({
            title: expect.stringMatching(/New task/),
            description: 'Lorem ipsum'
        })
    ]));
});

test('should update a task', async ({request}) => {
    const tasks = await request.get(`/_api/tasks`);
    expect(tasks.ok()).toBeTruthy();
    const json = await tasks.json();
    const task = json['hydra:member'][json['hydra:member'].length - 1];

    const title = '[Api] Updated task ' + getRandomNumber(1, 1000);
    const updatedTask = await request.patch(`/_api/tasks/` + task.uid, {
        data: {
            title: title,
            description: task.description,
        }
    });
    expect(updatedTask.ok()).toBeTruthy();
    expect(await updatedTask.json()).toEqual(expect.objectContaining({
        title: title,
    }));
});

test('should delete a task', async ({request}) => {
    const tasks = await request.get(`/_api/tasks`);
    expect(tasks.ok()).toBeTruthy();
    const json = await tasks.json();
    const task = json['hydra:member'][json['hydra:member'].length - 1];

    const response = await request.delete(`/_api/tasks/` + task.uid);
    expect(response.ok()).toBeTruthy();
});
