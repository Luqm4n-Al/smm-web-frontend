// untuk user management hapus saja ini hanya contoh

const BASE_URL =
  'https://6a05515aaa826ca75c09a751.mockapi.io/users';

export interface User {
  id: string;

  createdAt?: string;

  userId: string;

  username: string;

  email: string;

  role: string;

  status: 'Active' | 'Inactive';

  addDate: string;

  lastActive: string;

  access: boolean;
}

// GET USERS
export async function getUsers(): Promise<User[]> {
  const res = await fetch(
    `${BASE_URL}?page=1&limit=100`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(
      'Failed to fetch users'
    );
  }

  const data = await res.json();

  return data.map((user: any) => ({
    id:
      user.id ||
      user.userId,

    createdAt:
      user.createdAt || '',

    userId:
      user.userId || '',

    username:
      user.username || '',

    email:
      user.email || '',

    role:
      user.role || 'User',

    status:
      user.status || 'Active',

    addDate:
      user.addDate || '',

    lastActive:
      user.lastActive || '',

    access:
      user.access ??
      (user.status ===
        'Active'),
  }));
}

// UPDATE STATUS
export async function updateUserStatus(
  id: string,
  status: 'Active' | 'Inactive'
) {
  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        status,
        access:
          status ===
          'Active',
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      'Failed to update status'
    );
  }

  return res.json();
}