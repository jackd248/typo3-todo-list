const apiUrl = '/_api/tasks';

const apiClient = {
  // GET request
  getTasks: async function() {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('GET request failed:', error);
    }
  },

  // POST request
  createTask: async function(task) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Task created:', data);
      return data;
    } catch (error) {
      console.error('POST request failed:', error);
    }
  },

  // PATCH request
  updateTask: async function(taskId, updatedTask) {
    try {
      const response = await fetch(`${apiUrl}/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Task updated:', data);
      return data;
    } catch (error) {
      console.error('PATCH request failed:', error);
    }
  },

  // DELETE request
  deleteTask: async function(taskId) {
    try {
      const response = await fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log('Task deleted:', taskId);
    } catch (error) {
      console.error('DELETE request failed:', error);
    }
  }
};

export { apiClient };
