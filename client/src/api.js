export const API = import.meta.env.VITE_API || 'http://localhost:5000';

export async function getEmployees(){
  const r = await fetch(`${API}/employees`);
  return r.json();
}

export async function addEmployee(payload){
  const r = await fetch(`${API}/employees`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return r.json();
}

export async function getTasks(){
  const r = await fetch(`${API}/tasks`);
  return r.json();
}

export async function addTask(payload){
  const r = await fetch(`${API}/tasks`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return r.json();
}
