const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('inncore_token');
}

function setToken(token) {
  localStorage.setItem('inncore_token', token);
}

function clearToken() {
  localStorage.removeItem('inncore_token');
  localStorage.removeItem('inncore_user');
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('inncore_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem('inncore_user', JSON.stringify(user));
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'X-Api-Token': token } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.error || data.msg || data.Err || 'Something went wrong';
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ─── Auth ───
export async function login(email, password) {
  const data = await request('/auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setToken(data.token);
    if (data.email) {
      setStoredUser(data.email);
    }
  }
  return data;
}

export async function register(firstName, lastName, email, password) {
  const data = await request('/v1/user', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  return data;
}

// ─── Users ───
export async function getUser(id) {
  return request(`/v1/user/${id}`);
}

export async function getUsers() {
  return request('/v1/user');
}

export async function updateUser(id, params) {
  return request(`/v1/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function deleteUser(id) {
  return request(`/v1/user/${id}`, {
    method: 'DELETE',
  });
}

// ─── Hotels ───
export async function getHotels(page = 1, limit = 12, rating = 0) {
  let query = `?page=${page}&limit=${limit}`;
  if (rating > 0) query += `&rating=${rating}`;
  return request(`/v1/hotel${query}`);
}

export async function getHotel(id) {
  return request(`/v1/hotel/${id}`);
}

export async function getHotelRooms(hotelId) {
  return request(`/v1/hotel/${hotelId}/rooms`);
}

// ─── Rooms ───
export async function getRooms() {
  return request('/v1/room');
}

// ─── Bookings ───
export async function bookRoom(roomId, params) {
  return request(`/v1/room/${roomId}/book`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getBooking(id) {
  return request(`/v1/booking/${id}`);
}

export async function cancelBooking(id) {
  return request(`/v1/booking/${id}/cancel`);
}

export async function getUserBookings(userId) {
  return request(`/v1/booking/user/${userId}`);
}

// ─── Admin ───
export async function getAdminBookings() {
  return request('/v1/admin/booking');
}

// ─── Storage Helpers ───
export { getToken, setToken, clearToken, getStoredUser, setStoredUser };
