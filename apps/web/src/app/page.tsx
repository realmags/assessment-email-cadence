'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

type Cadence = {
  id: string;
  name: string;
};

enum WorkflowStatus {
  Started = 'STARTED',
  Running = 'RUNNING',
  Completed = 'COMPLETED',
}

type Enrollment = {
  cadenceId: string;
  contactEmail: string;
  workflowId: string;
  createdAt: number;
};

export default function Dashboard() {
  const [selectedCadenceId, setSelectedCadenceId] = useState('');
  const [email, setEmail] = useState('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [updateSteps, setUpdateSteps] = useState('');

  const fetchCadences = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cadences`,
    );
    if (res.ok) {
      return res.json();
    }
  };

  const fetchEnrollments = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments`,
    );
    if (res.ok) {
      const data = await res.json();
      const dataWithStatus = await Promise.all(
        data.map(async (e: Enrollment) => {
          try {
            const statusRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments/${e.workflowId}`,
            );
            if (statusRes.ok) {
              const status = await statusRes.json();
              return { ...e, state: status };
            }
          } catch (err) {
            alert(`Failed to fetch status for workflow ${e.workflowId}`);
            console.error(err);
          }
          return e;
        }),
      );

      return dataWithStatus;
    }
  };

  const { data: cadences = [] } = useSWR<Cadence[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cadences`,
    fetchCadences,
  );

  const { data: enrollments = [], mutate: mutateEnrollments } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments`,
    fetchEnrollments,
    { refreshInterval: 5000 },
  );

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCadenceId || !email) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cadenceId: selectedCadenceId,
          contactEmail: email,
        }),
      },
    );

    if (res.ok) {
      alert('Enrolled successfully!');
      setEmail('');
      mutateEnrollments();
    } else {
      alert('Failed to enroll');
    }
  };

  const handleUpdateWorkflow = async () => {
    if (!selectedWorkflowId || !updateSteps) return;
    try {
      const steps = JSON.parse(updateSteps);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments/${selectedWorkflowId}/update-cadence`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steps }),
        },
      );
      if (res.ok) {
        alert('Workflow signaled!');
        mutateEnrollments();
      } else {
        alert('Failed to signal workflow');
      }
    } catch (err) {
      alert('Invalid JSON steps or network error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Email Cadence Dashboard
          </h1>
          <Link
            href="/cadences/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create New Cadence
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enroll Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Enroll Contact</h2>
            <form onSubmit={handleEnroll} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Cadence
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={selectedCadenceId}
                  onChange={(e) => setSelectedCadenceId(e.target.value)}
                  required
                >
                  <option value="">Select...</option>
                  {cadences.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Start Enrollment
              </button>
            </form>
          </div>

          {/* Update Workflow Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Update Running Workflow
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Workflow
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={selectedWorkflowId}
                  onChange={(e) => setSelectedWorkflowId(e.target.value)}
                >
                  <option value="">Select...</option>
                  {enrollments
                    .filter((e) => e.state?.status === WorkflowStatus.Running)
                    .map((e) => (
                      <option key={e.workflowId} value={e.workflowId}>
                        {e.contactEmail} ({e.workflowId})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Steps (JSON)
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border h-32 font-mono text-sm"
                  value={updateSteps}
                  onChange={(e) => setUpdateSteps(e.target.value)}
                  placeholder='[{"id":"new1","type":"WAIT","seconds":5}]'
                />
              </div>
              <button
                type="button"
                onClick={handleUpdateWorkflow}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
              >
                Signal Workflow Update
              </button>
            </div>
          </div>
        </div>

        {/* Active Enrollments List */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Enrollments</h2>
            <button
              onClick={() => mutateEnrollments()}
              className="text-blue-600 hover:text-blue-800"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadence ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workflow ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Step
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((e) => (
                  <tr key={e.workflowId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {e.contactEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {e.cadenceId}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate"
                      title={e.workflowId}
                    >
                      {e.workflowId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {e.state?.currentStepIndex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${e.state?.status === WorkflowStatus.Running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {e.state?.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {e.state?.stepsVersion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
