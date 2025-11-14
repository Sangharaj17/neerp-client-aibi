'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import ActionModal from '@/components/AMC/ActionModal';

export default function AssignRolePage() {
  const [roles, setRoles] = useState([]);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isRolePickerOpen, setRolePickerOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const [rolesRes, permissionsRes] = await Promise.all([
          axiosInstance.get('/api/roles'),
          axiosInstance.get('/api/permissions'),
        ]);
        const rolesData = Array.isArray(rolesRes.data)
          ? rolesRes.data
          : Array.isArray(rolesRes.data?.content)
            ? rolesRes.data.content
            : [];
        setRoles(rolesData);
        setPermissionsByModule(permissionsRes.data || {});
      } catch (error) {
        console.error('Failed to load roles or permissions', error);
        toast.error('Failed to load roles or permissions. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const moduleEntries = useMemo(
    () => Object.entries(permissionsByModule || {}),
    [permissionsByModule]
  );

  const selectedPermissionSet = useMemo(
    () => new Set(selectedPermissionIds),
    [selectedPermissionIds]
  );

  const loadPermissionsForRole = async (roleId) => {
    if (!roleId) return;
    setAssignmentsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/permissions/role/${roleId}`);
      const assignedIds = Array.isArray(response.data)
        ? response.data
        : [];
      setSelectedPermissionIds(assignedIds.map(Number));
    } catch (error) {
      console.error('Failed to fetch role permissions', error);
      toast.error('Failed to load permissions for this role.');
      setSelectedPermissionIds([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const selectedRole = useMemo(
    () =>
      roles.find(
        (role) =>
          String(role.roleId ?? role.id) === String(selectedRoleId)
      ) || null,
    [roles, selectedRoleId]
  );

  const filteredRoles = useMemo(() => {
    if (!roleSearchTerm) return roles;
    const term = roleSearchTerm.toLowerCase();
    return roles.filter((role) =>
      (role.role || role.name || '')
        .toLowerCase()
        .includes(term)
    );
  }, [roles, roleSearchTerm]);

  const openRolePicker = () => {
    setRoleSearchTerm('');
    setRolePickerOpen(true);
  };

  const handleRoleSelect = async (role) => {
    setRolePickerOpen(false);
    if (!role) {
      setSelectedRoleId('');
      setSelectedPermissionIds([]);
      return;
    }
    const roleId = String(role.roleId ?? role.id);
    setSelectedRoleId(roleId);
    await loadPermissionsForRole(roleId);
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissionIds((prev) => {
      const id = Number(permissionId);
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  };

  const toggleModule = (moduleName, permissions, checked) => {
    const modulePermissionIds = permissions.map((perm) => Number(perm.id));
    setSelectedPermissionIds((prev) => {
      if (checked) {
        const merged = new Set([...prev, ...modulePermissionIds]);
        return Array.from(merged);
      }
      return prev.filter((id) => !modulePermissionIds.includes(id));
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId) {
      toast.error('Please select a role first.');
      return;
    }
    if (selectedPermissionIds.length === 0) {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm">
              This will remove all permissions from{' '}
              <strong>{selectedRole?.role || selectedRole?.name || 'this role'}</strong>.
            </span>
            <div className="flex justify-end gap-3 text-sm">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  toast.dismiss(t.id);
                  submitSave();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ),
        { duration: 4000 }
      );
      return;
    }
    await submitSave();
  };

  const submitSave = async () => {
    setSaving(true);
    try {
      const uniqueIds = Array.from(new Set(selectedPermissionIds.map(Number)));
      await axiosInstance.post(
        `/api/permissions/role/${selectedRoleId}`,
        uniqueIds
      );
      toast.success('Permissions updated successfully.');
    } catch (error) {
      console.error('Failed to save permissions', error);
      toast.error('Failed to update permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Assign Permissions to Roles</h1>
        <p className="text-sm text-gray-600">
          Select a role to review and update the permissions assigned to it. Changes are saved per role.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <label htmlFor="role-select" className="text-sm font-medium text-gray-700">
          Select Role
        </label>
        <button
          type="button"
          className="inline-flex min-w-[220px] items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm hover:bg-gray-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={openRolePicker}
          disabled={loading || roles.length === 0}
        >
          <span className="truncate">
            {selectedRole
              ? selectedRole.role || selectedRole.name || `Role ${selectedRole.roleId ?? selectedRole.id}`
              : loading
              ? 'Loading roles...'
              : roles.length === 0
              ? 'No roles available'
              : 'Choose a role'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </section>

      <ActionModal
        isOpen={isRolePickerOpen}
        onCancel={() => setRolePickerOpen(false)}
        title="Select Role"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Search roles..."
            value={roleSearchTerm}
            onChange={(e) => setRoleSearchTerm(e.target.value)}
          />
          <div className="max-h-72 overflow-y-auto rounded border border-gray-200">
            {filteredRoles.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No roles match your search.</div>
            ) : (
              filteredRoles.map((role) => {
                const id = String(role.roleId ?? role.id);
                const isActive = id === selectedRoleId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`flex w-full items-center justify-between px-4 py-2 text-sm transition hover:bg-indigo-50 ${
                      isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'
                    }`}
                  >
                    <span className="truncate">
                      {role.role || role.name || `Role ${role.roleId ?? role.id}`}
                    </span>
                    {isActive && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onClick={() => setRolePickerOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
              onClick={() => handleRoleSelect(null)}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </ActionModal>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Loading permissions...
        </div>
      ) : moduleEntries.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
          No permissions found. Ensure the permission master data is configured.
        </div>
      ) : (
        <section className="flex flex-col gap-4">
          {selectedRoleId ? (
            assignmentsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                Loading role permissions...
              </div>
            ) : null
          ) : (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              Select a role to view and edit its permissions.
            </div>
          )}

          {moduleEntries.map(([moduleName, permissions]) => {
            const allSelected = permissions.every((perm) =>
              selectedPermissionSet.has(Number(perm.id))
            );
            const partiallySelected = !allSelected && permissions.some((perm) =>
              selectedPermissionSet.has(Number(perm.id))
            );

            return (
              <details
                key={moduleName}
                className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm"
                open
              >
                <summary className="flex cursor-pointer items-center justify-between bg-gray-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">{moduleName}</h2>
                    <p className="text-xs text-gray-500">
                      {permissions.length} permission{permissions.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-indigo-600"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = partiallySelected;
                      }}
                      onChange={(e) => toggleModule(moduleName, permissions, e.target.checked)}
                    />
                    Select all
                  </label>
                </summary>

                <div className="grid gap-2 border-t border-gray-200 bg-white p-4 md:grid-cols-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center gap-3 rounded border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:border-indigo-300"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600"
                        checked={selectedPermissionSet.has(Number(permission.id))}
                        onChange={() => togglePermission(permission.id)}
                      />
                      <span className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {permission.featureName || `Feature ${permission.featureId}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          #{permission.featureId} · Module ID {permission.moduleId}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </details>
            );
          })}
        </section>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={() => {
            setSelectedPermissionIds([]);
            toast('Selection cleared', { icon: '🧹' });
          }}
          disabled={!selectedRoleId || saving}
        >
          Clear Selection
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          onClick={handleSave}
          disabled={!selectedRoleId || saving}
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
