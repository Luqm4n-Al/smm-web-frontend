// hapus saja file ini hanya untuk mnenerapkan uinya seperti apa
// untuk askses mock api bisa cari di web https://mockapi.io/projects (Opsional saja)

const BASE_URL =
  'https://6a05515aaa826ca75c09a751.mockapi.io/users';

export async function getUsers() {
  const response = await fetch(BASE_URL, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed fetch users');
  }

  return response.json();
}