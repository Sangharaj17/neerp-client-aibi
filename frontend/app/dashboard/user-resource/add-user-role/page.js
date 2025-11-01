"use client";

import React, { useState, useEffect, useMemo } from "react";
import Input from '@/components/UI/Input';
import ReusableTable from '@/components/UI/ReusableTable';
import { Pencil, Trash2, ShieldCheck, X, Plus, CheckSquare, Square, Loader2 } from "lucide-react";
import ActionModal from '@/components/AMC/ActionModal';

const API = {
  ROLES: '/api/roles',
  PERMISSIONS: '/api/permissions',
  ROLE_PERMISSIONS: (roleId) => `/api/permissions/role/${roleId}`,
};

function CreateRoleTab({ selected, setSelected }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [alert, setAlert] = useState("");
  const [saving, setSaving] = useState(false);

  // New state for modal and permissions
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // or 'edit'
  const [modalRole, setModalRole] = useState(null); // current role object or null
  const [modalRoleName, setModalRoleName] = useState("");
  const [modalPermissions, setModalPermissions] = useState([]); // ids
  const [allPermissions, setAllPermissions] = useState({});
  const [modalIdLoading, setModalIdLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(API.ROLES)
      .then(res => res.json())
      .then(arr => setRoles(Array.isArray(arr) ? arr : []))
      .catch(() => setAlert("Could not fetch roles."))
      .finally(() => setLoading(false));
  }, []);

  // Fetch all permissions (modules)
  useEffect(() => {
    if (!showModal) return;
    setModalIdLoading(true);
    fetch(API.PERMISSIONS)
      .then(res => res.json())
      .then(map => setAllPermissions(map || {}))
      .finally(() => setModalIdLoading(false));
  }, [showModal]);

  // Open modal for adding
  const openCreateModal = () => {
    setModalType('create');
    setModalRole(null);
    setModalRoleName(roleName); // start with entered name
    setModalPermissions([]);
    setShowModal(true);
  };
  // Open modal for editing (row object)
  const openEditModal = (role) => {
    setModalType('edit');
    setModalRole(role);
    setModalRoleName(role.role);
    setShowModal(true);
    setModalPermissions([]); // will load below
    // fetch permissions for role
    setModalIdLoading(true);
    fetch(API.ROLE_PERMISSIONS(role.roleId))
      .then(res => res.json())
      .then(ids => setModalPermissions(Array.isArray(ids) ? ids : []))
      .finally(() => setModalIdLoading(false));
  };
  // Modal permission toggle
  const modalTogglePerm = (pid) => {
    setModalPermissions(arr => arr.includes(pid) ? arr.filter(x=>x!==pid) : [...arr,pid]);
  };

  // Save modal (add or edit)
  const handleModalSave = async () => {
    setSaving(true);
    setAlert("");
    try {
      let currentRole = modalRole;
      // 1. If ADD, create role first
      if (modalType==='create') {
        const resp = await fetch(API.ROLES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: modalRoleName }),
        });
        if (!resp.ok) throw new Error('Role creation failed');
        currentRole = await resp.json();
        setRoles(r => [currentRole, ...r]);
        setRoleName("");
      } else if (modalType==='edit' && modalRoleName !== modalRole.role) {
        // update role label
        const resp = await fetch(`${API.ROLES}/${modalRole.roleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: modalRoleName }),
        });
        if(resp.ok){
          setRoles(r=>r.map(row=>row.roleId===modalRole.roleId?{...row,role:modalRoleName}:row));
        } else {
          throw new Error('Name update failed');
        }
      }
      // 2. Assign permissions
      const roleId = (currentRole && currentRole.roleId) || (modalRole && modalRole.roleId);
      if(roleId) {
        const numericPermIds = modalPermissions.map(id => Number(id));
        const resp2 = await fetch(API.ROLE_PERMISSIONS(roleId), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(numericPermIds),
        });
        if(!resp2.ok) {
          const errText = await resp2.text().catch(()=>"");
          throw new Error(errText || "Assign permissions failed");
        }
      }
      setAlert(`Role ${modalType==='create' ? 'created' : 'updated'} + permissions assigned`);
      setShowModal(false);
    } catch(e) {
      setAlert(e.message||'Failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete role?")) return;
    setSaving(true);
    try {
      await fetch(`${API.ROLES}/${id}`, { method: "DELETE" });
      setRoles(r => r.filter(row => row.roleId !== id));
      setAlert("Role deleted");
      if (selected === id) setSelected(null);
    } catch {
      setAlert("Delete failed");
    } setSaving(false);
  };

  // Modal body
  const renderModal = () => (
    <ActionModal isOpen={showModal} onCancel={()=>setShowModal(false)}>
      <div className="space-y-6">
        <div>
          <label className="text-xs text-gray-700 mb-1 block">Role Name</label>
          <Input value={modalRoleName} onChange={e=>setModalRoleName(e.target.value)} placeholder="Role name" className="w-full" required disabled={modalType==='edit'&&saving} />
        </div>
        <div className="text-xs text-gray-700 mb-1">Assign Permissions</div>
        {modalIdLoading ? <div className="text-blue-500 text-sm p-3">Loading permissions…</div> :
         Object.keys(allPermissions).length===0 ? <div className="text-gray-400">No permissions found.</div> :
         Object.entries(allPermissions).map(([module, features]) => (
           <div key={module} className="mb-3">
             <div className="font-semibold text-gray-600 text-xs mb-1">{module}</div>
             <div className="flex flex-wrap gap-x-4 gap-y-3">
               {features.map(feature => (
                 <button
                   key={feature.id}
                   type="button"
                   className={`flex items-center gap-2 px-3 py-2 rounded border text-xs shadow-sm ${modalPermissions.includes(feature.id)?'bg-blue-100 border-blue-600':'border-gray-200 bg-white'}`}
                   onClick={()=>modalTogglePerm(feature.id)}
                   style={{ minWidth: 160, justifyContent:'flex-start' }}
                 >
                   {modalPermissions.includes(feature.id)
                     ? <CheckSquare className="text-blue-600" size={16}/>
                     : <Square className="text-gray-300" size={16}/>
                   }
                   {feature.featureName}
                 </button>
               ))}
             </div>
           </div>
         ))
        }
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-4 py-2 rounded bg-gray-100 text-gray-700" type="button" onClick={()=>setShowModal(false)} disabled={saving}>Cancel</button>
          <button className="px-4 py-2 rounded bg-gray-900 text-white" type="button" onClick={handleModalSave} disabled={saving||!modalRoleName}>{saving?'Saving…':'Save'}</button>
        </div>
      </div>
    </ActionModal>
  );

  // Update form to show modal on add
  return (
    <div className="py-2 space-y-7">
      {/* Modal for add/edit */}
      {renderModal()}
      <form onSubmit={e=>{e.preventDefault();openCreateModal();}} className="flex flex-col sm:flex-row gap-2 items-end max-w-xl mx-auto px-2">
        <div className="flex-1">
          <label className="text-xs text-gray-600 mb-1 block">Role Name</label>
          <Input value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="New role name" className="w-full" required />
        </div>
        <button type="submit" disabled={saving || !roleName} className="h-9 px-5 bg-gray-900 text-white rounded-md flex items-center gap-2 disabled:opacity-30">
          <Plus size={16}/>{saving ? "Saving…" : "Add Role"}
        </button>
      </form>
      <div className="max-w-2xl mx-auto">
        {alert && <div className="mb-4 px-3 py-2 rounded border border-gray-200 bg-blue-50 text-blue-700 flex items-center gap-2"><ShieldCheck size={18}/>{alert}<button className="ml-auto px-1" onClick={()=>setAlert("")}> <X size={18}/> </button></div>}
        <table className="w-full text-sm border-collapse bg-white rounded shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border-b w-12">#</th>
              <th className="text-left p-2 border-b">Role Name</th>
              <th className="p-2 border-b">Assign</th>
              <th className="p-2 border-b">Edit</th>
              <th className="p-2 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="p-4 text-center text-gray-400"><Loader2 className="inline animate-spin"/> Loading…</td></tr>}
            {roles.length === 0 && !loading && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No roles yet.</td></tr>}
            {roles.map((role, idx) => (
              <tr key={role.roleId} className={selected===role.roleId?"bg-gray-50":"hover:bg-gray-50"}>
                <td className="p-2">{idx+1}</td>
                <td className="p-2 font-medium text-gray-800">{role.role}</td>
                <td className="p-2 text-center">
                  <button type="button" className={`rounded w-8 h-8 flex items-center justify-center ${selected===role.roleId?'bg-gray-900 text-white':'bg-gray-100 text-gray-800 hover:bg-gray-200'}`} onClick={() => setSelected(role.roleId)}>
                    <CheckSquare size={18} />
                  </button>
                </td>
                <td className="p-2 text-center">
                  <button title="Edit Role" className="w-8 h-8 rounded bg-gray-100 hover:bg-blue-100 flex items-center justify-center" onClick={()=>openEditModal(role)}><Pencil className="text-blue-500" size={16}/></button>
                </td>
                <td className="p-2 text-center">
                  <button className="w-8 h-8 rounded bg-gray-100 hover:bg-red-100 flex items-center justify-center" onClick={()=>handleDelete(role.roleId)}><Trash2 className="text-red-500" size={17}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssignPermissionTab({ selectedRoleId }) {
  const [allPermissions, setAllPermissions] = useState({});
  const [perm, setPerm] = useState([]); // permission IDs
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);
    fetch(API.PERMISSIONS)
      .then(res => res.json())
      .then(map => setAllPermissions(map||{}))
      .finally(()=>setLoading(false));
  }, [selectedRoleId]);
  useEffect(() => {
    if (!selectedRoleId) return;
    setRoleLoading(true);
    fetch(API.ROLE_PERMISSIONS(selectedRoleId)).then(res => res.json()).then(ids => setPerm(Array.isArray(ids)?ids:[])).finally(()=>setRoleLoading(false));
  }, [selectedRoleId]);

  const toggle = (pid) => setPerm(arr => arr.includes(pid) ? arr.filter(x=>x!==pid) : [...arr, pid]);
  const save = async ()=> {
    setAlert("");
    setLoading(true);
    try {
      await fetch(API.ROLE_PERMISSIONS(selectedRoleId), {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(perm),
      });
      setAlert("Permissions updated");
    } catch {
      setAlert("Save failed");
    } setLoading(false);
  }
  if (!selectedRoleId) return <div className="text-gray-400 mt-10 text-center">Select a role to assign permissions.</div>;
  return (
    <div className="max-w-2xl mx-auto py-3 space-y-6">
      {alert && <div className="mb-4 px-3 py-2 rounded border border-gray-200 bg-blue-50 text-blue-700 flex items-center gap-2"><ShieldCheck size={18}/> {alert} <button className="ml-auto px-1" onClick={()=>setAlert("")}> <X size={18}/> </button></div>}
      {(loading||roleLoading) && <div className="flex items-center gap-2 text-blue-600 text-sm"><Loader2 className="animate-spin" /> Loading…</div>}
      {!loading && !roleLoading && Object.keys(allPermissions).length===0 && <div className="text-gray-400">No permissions found.</div>}
      {!loading && !roleLoading && Object.entries(allPermissions).map(([module, features]) => (
        <div key={module} className="border rounded-lg mb-2">
          <div className="bg-gray-50 border-b px-3 py-2 font-medium text-gray-700 text-xs uppercase tracking-wider">{module}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 p-3">
            {features.map(feature => (
              <button
                key={feature.id}
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded border border-gray-200 shadow-sm text-sm hover:bg-gray-100"
                style={{ minWidth: 180, justifyContent:'flex-start' }}
                aria-checked={perm.includes(feature.id)}
                onClick={() => toggle(feature.id)}
              >
                {perm.includes(feature.id)
                  ? <CheckSquare className="text-blue-600" size={19} />
                  : <Square className="text-gray-300" size={19}/>
                }
                <span>{feature.featureName}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 mt-6">
        <button onClick={save} disabled={loading || roleLoading} className="h-9 px-4 rounded-md bg-gray-900 text-white flex items-center gap-1 disabled:opacity-50">
          <CheckSquare size={18}/>
          {loading ? "Saving…" : "Save Permissions"}
        </button>
      </div>
    </div>
  );
}

export default function UserRolePage() {
  const [tab, setTab] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-5">
      <div className="flex gap-1 mb-6">
        <button onClick={()=>setTab(0)} className={`px-4 py-2 rounded-t-md text-sm border border-b-0 border-gray-200 ${tab===0?'bg-white font-semibold text-gray-900':'bg-gray-50 text-gray-400'}`}>Create Role</button>
        <button onClick={()=>setTab(1)} className={`px-4 py-2 rounded-t-md text-sm border border-b-0 border-gray-200 ${tab===1?'bg-white font-semibold text-gray-900':'bg-gray-50 text-gray-400'}`}>Assign Role Permissions</button>
      </div>
      <div className="bg-white border border-gray-200 shadow-sm rounded-b-md px-2 sm:px-8 py-6 min-h-[300px]">
        {tab === 0 && <CreateRoleTab selected={selectedRole} setSelected={setSelectedRole}/>} 
        {tab === 1 && <AssignPermissionTab selectedRoleId={selectedRole} />} 
      </div>
    </div>
  );
}


