import { apiClient } from './client.js';

document.addEventListener('DOMContentLoaded', async function () {
  console.log('Hello World!');
  const data = await apiClient.getTasks();
  if (data) {
    displayTasks(data['hydra:member']);
  }
});
function displayTasks(tasks) {
  const main = document.querySelector('main');
  const cards = document.createElement('div');
  cards.classList.add('cards');
  const section = document.createElement('section');
  section.classList.add('grid');
  const grid = document.createElement('div');
  grid.classList.add('s12',  'm6', 'l3');

  tasks.forEach(task => {
    const taskElement = document.createElement('article');
    taskElement.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <p>Due Date: ${new Date(task.dueDate).toLocaleString()}</p>
      <p>Completed: ${task.completed}</p>
    `;
    grid.appendChild(taskElement);
  });

  section.appendChild(grid);
  cards.appendChild(section);
  main.appendChild(cards);
}
