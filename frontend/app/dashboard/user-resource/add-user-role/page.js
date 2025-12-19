"use client";

import { useEffect, useState } from "react";
import Input from "@/components/UI/Input";
import ActionModal from "@/components/AMC/ActionModal";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const API_ROLES = "/api/roles";

export default function AddUserRolePage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState("");
  const [roleName, setRoleName] = useState("");

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_ROLES);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.content)
          ? res.data.content
          : [];
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
      setAlert("Could not fetch roles.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (event) => {
    event.preventDefault();
    const trimmedName = roleName.trim();

    if (!trimmedName) {
      toast.error("Please enter a role name.");
      return;
    }

    // Check for duplicate role name (case-insensitive)
    const isDuplicate = roles.some(r =>
      r.role?.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Role name already exists.");
      return;
    }

    setSaving(true);
    setAlert("");
    try {
      const res = await axiosInstance.post(API_ROLES, { role: trimmedName });
      const created = res.data;
      setRoles((prev) => [created, ...prev]);
      setRoleName("");
      toast.success("Role created successfully.");
    } catch (error) {
      console.error("Failed to create role", error);
      toast.error("Failed to create role.");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setEditingName(role.role);
    setEditModalOpen(true);
    setAlert("");
  };

  const handleUpdateRole = async () => {
    const trimmedName = editingName.trim();
    if (!editingRole || !trimmedName) {
      toast.error("Please enter a role name.");
      return;
    }

    // Check for duplicate role name (case-insensitive), excluding current role
    const isDuplicate = roles.some(r =>
      r.role?.toLowerCase().trim() === trimmedName.toLowerCase() &&
      r.roleId !== editingRole.roleId
    );
    if (isDuplicate) {
      toast.error("Role name already exists.");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.put(`${API_ROLES}/${editingRole.roleId}`, {
        role: trimmedName,
      });
      setRoles((prev) =>
        prev.map((role) =>
          role.roleId === editingRole.roleId
            ? { ...role, role: trimmedName }
            : role
        )
      );
      toast.success("Role updated successfully.");
      setEditModalOpen(false);
      setEditingRole(null);
      setEditingName("");
    } catch (error) {
      console.error("Failed to update role", error);
      toast.error("Failed to update role.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Delete role "${role.role}"?`)) return;
    setSaving(true);
    setAlert("");
    try {
      await axiosInstance.delete(`${API_ROLES}/${role.roleId}`);
      setRoles((prev) => prev.filter((r) => r.roleId !== role.roleId));
      setAlert("Role deleted.");
    } catch (error) {
      console.error("Failed to delete role", error);
      setAlert("Deleting role failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Add User Role</h1>
        <p className="text-sm text-gray-600">
          Create simple roles that can be assigned permissions from the Assign Role page.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleCreateRole}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter new role name"
              className="w-full"
              required
              disabled={saving}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add Role
          </button>
        </form>
      </section>

      {alert && (
        <div className="flex items-center gap-3 rounded border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <ShieldCheck className="h-4 w-4" />
          <span>{alert}</span>
          <button
            type="button"
            className="ml-auto text-blue-600 hover:text-blue-800"
            onClick={() => setAlert("")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Existing Roles
          </h2>
          <span className="text-xs text-gray-500">
            {roles.length} {roles.length === 1 ? "role" : "roles"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left font-medium">#</th>
                <th className="px-4 py-2 text-left font-medium">Role Name</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    <p className="mt-2 text-xs">Loading roles…</p>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    No roles created yet.
                  </td>
                </tr>
              ) : (
                roles.map((role, index) => (
                  <tr
                    key={role.roleId ?? role.id ?? index}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {role.role || role.name || `Role ${role.roleId ?? role.id}`}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(role)}
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-blue-50"
                        disabled={saving}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(role)}
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        disabled={saving}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ActionModal isOpen={isEditModalOpen} onCancel={() => setEditModalOpen(false)}>
        <div className="space-y-5">
          <header>
            <h3 className="text-lg font-semibold text-gray-900">Edit Role</h3>
            <p className="text-xs text-gray-500">
              Update the role name. Permissions can be managed from the Assign Role screen.
            </p>
          </header>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Role Name
            </label>
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Role name"
              className="w-full"
              disabled={saving}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onClick={() => setEditModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              onClick={handleUpdateRole}
              disabled={saving || !editingName.trim()}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
