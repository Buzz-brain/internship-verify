
import React, { useEffect, useState } from 'react';
import { CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { User as UserIcon, Plus, Edit, Trash2, Search } from 'lucide-react';


import { usersApi, User } from '../../api/users';

const roleOptions = [
  { value: 'department', label: 'Department' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'student', label: 'Student' },
];


const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [loading, setLoading] = useState(false);

  // Add/Edit form state
  const [form, setForm] = useState<{ name: string; email: string; role: User['role']; status?: User['status']; password?: string }>({ name: '', email: '', role: 'supervisor', status: 'active', password: '' });

  // Fetch users from backend
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (err) {
      // TODO: handle error (show toast)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  // Filtered users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setForm({ name: '', email: '', role: 'supervisor', status: 'active', password: '' });
    setAddModal(true);
  };
  const openEditModal = (user: User) => {
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setEditModal({ open: true, user });
  };
  const openDeleteModal = (user: User) => setDeleteModal({ open: true, user });

  // Handlers (real API calls)
  const handleAdd = async () => {
    try {
      if (!form.password) throw new Error('Password is required');
      await usersApi.addUser({ ...form, password: form.password });
      setAddModal(false);
      loadUsers();
    } catch (err) {
      // TODO: handle error (show toast)
    }
  };
  const handleEdit = async () => {
    if (!editModal.user) return;
    try {
      await usersApi.updateUser(editModal.user._id, { ...form });
      setEditModal({ open: false, user: null });
      loadUsers();
    } catch (err) {
      // TODO: handle error (show toast)
    }
  };
  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await usersApi.deleteUser(deleteModal.user._id);
      setDeleteModal({ open: false, user: null });
      loadUsers();
    } catch (err) {
      // TODO: handle error (show toast)
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">View, add, edit, or remove users in your department.</p>
        </div>
        <Button className="mt-4 md:mt-0 flex items-center" onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="relative overflow-x-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td>
              </tr>
            ) : filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <UserIcon className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={
                    user.role === 'department' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'supervisor' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  + ' px-2 py-1 rounded text-xs font-semibold'}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  + ' px-2 py-1 rounded text-xs font-semibold'}>
                    {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button size="sm" variant="ghost" className="mr-2" onClick={() => openEditModal(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => openDeleteModal(user)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title=""
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd}>Add User</Button>
          </div>
        }
      >
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Add User</h2>
        </CardHeader>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Select label="Role" options={roleOptions} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))} />
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title=""
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setEditModal({ open: false, user: null })}>Cancel</Button>
            <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
          </div>
        }
      >
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
        </CardHeader>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Select label="Role" options={roleOptions} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))} />
          <Select label="Status" options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as User['status'] }))} />
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title=""
        size="sm"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, user: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        }
      >
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Delete User</h2>
        </CardHeader>
        <div className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{deleteModal.user?.name}</span>?</div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
