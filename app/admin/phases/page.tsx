'use client';

import React, { Suspense } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Id } from '@/convex/_generated/dataModel';

export default function PhasesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <PhasesPageContent />
    </Suspense>
  );
}

function PhasesPageContent() {
  const searchParams = useSearchParams();
  const segments = useQuery(api.segments.getAllWithRelations);
  const createPhase = useMutation(api.phases.create);
  const updatePhase = useMutation(api.phases.update);
  const deletePhase = useMutation(api.phases.remove);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<any>(null);
  const [filterSegmentId, setFilterSegmentId] = useState<string>('');
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);

  useEffect(() => {
    const segmentParam = searchParams.get('segment');
    if (segmentParam) setFilterSegmentId(segmentParam);
  }, [searchParams]);

  const [formData, setFormData] = useState({
    segmentId: '' as Id<'segments'> | '',
    key: '',
    label: '',
    duration: '',
    color: '#ffffff',
    accent: '#000000',
    displayOrder: 0,
  });

  // Flatten all phases from all segments
  const allPhases = useMemo(() => {
    if (!segments) return [];

    return segments.flatMap((segment) =>
      (segment.phases || []).map((phase) => ({
        ...phase,
        segment: {
          _id: segment._id,
          key: segment.key,
          label: segment.label,
          icon: segment.icon,
        },
      }))
    );
  }, [segments]);

  // Filter phases by selected segment
  const filteredPhases = useMemo(() => {
    if (!filterSegmentId) return allPhases;
    return allPhases.filter((p) => p.segment._id === filterSegmentId);
  }, [allPhases, filterSegmentId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.segmentId) {
      alert('Please select a segment');
      return;
    }

    try {
      await createPhase({
        segmentId: formData.segmentId,
        key: formData.key,
        label: formData.label,
        duration: formData.duration,
        color: formData.color,
        accent: formData.accent,
        displayOrder: formData.displayOrder,
      });
      setIsCreateModalOpen(false);
      setFormData({
        segmentId: '',
        key: '',
        label: '',
        duration: '',
        color: '#ffffff',
        accent: '#000000',
        displayOrder: 0,
      });
    } catch (error) {
      console.error('Error creating phase:', error);
      alert('Failed to create phase');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhase) return;

    try {
      await updatePhase({
        id: selectedPhase._id,
        key: formData.key,
        label: formData.label,
        duration: formData.duration,
        color: formData.color,
        accent: formData.accent,
        displayOrder: formData.displayOrder,
      });
      setIsEditModalOpen(false);
      setSelectedPhase(null);
    } catch (error) {
      console.error('Error updating phase:', error);
      alert('Failed to update phase');
    }
  };

  const handleDelete = async () => {
    if (!selectedPhase) return;

    try {
      await deletePhase({ id: selectedPhase._id });
      setIsDeleteModalOpen(false);
      setSelectedPhase(null);
    } catch (error) {
      console.error('Error deleting phase:', error);
      alert('Failed to delete phase');
    }
  };

  const openEditModal = (phase: any) => {
    setSelectedPhase(phase);
    setFormData({
      segmentId: phase.segmentId,
      key: phase.key,
      label: phase.label,
      duration: phase.duration,
      color: phase.color,
      accent: phase.accent,
      displayOrder: phase.displayOrder,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (phase: any) => {
    setSelectedPhase(phase);
    setIsDeleteModalOpen(true);
  };

  if (!segments) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phases</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage journey phases within each segment
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Phase
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Select
          label="Filter by Segment"
          value={filterSegmentId}
          onChange={(e) => setFilterSegmentId(e.target.value)}
        >
          <option value="">All Segments</option>
          {segments.map((segment) => (
            <option key={segment._id} value={segment._id}>
              {segment.icon} {segment.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Phases List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Steps
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPhases.map((phase) => (
              <React.Fragment key={phase._id}>
                <tr
                  key={phase._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedPhaseId((prev) => (prev === phase._id ? null : phase._id))
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {expandedPhaseId === phase._id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <span className="font-medium text-gray-900">{phase.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span>
                      {phase.segment.icon} {phase.segment.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <code className="bg-gray-100 px-2 py-1 rounded">{phase.key}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {phase.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: phase.color }}
                        title={`Background: ${phase.color}`}
                      />
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: phase.accent }}
                        title={`Accent: ${phase.accent}`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {phase.steps?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {phase.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); openEditModal(phase); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); openDeleteModal(phase); }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedPhaseId === phase._id && (
                  <tr key={`${phase._id}-steps`} className="bg-gray-50">
                    <td colSpan={8} className="px-8 py-4">
                      {phase.steps && phase.steps.length > 0 ? (
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <th className="pb-2 pr-6">Day</th>
                              <th className="pb-2 pr-6">Action</th>
                              <th className="pb-2 pr-6">Tool</th>
                              <th className="pb-2 pr-6">Status</th>
                              <th className="pb-2">Order</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {phase.steps.map((step: any) => (
                              <tr key={step._id}>
                                <td className="py-2 pr-6 text-gray-600">{step.day}</td>
                                <td className="py-2 pr-6 text-gray-900">{step.action}</td>
                                <td className="py-2 pr-6 text-gray-600">{step.tool || '—'}</td>
                                <td className="py-2 pr-6">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${step.isFuture ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {step.isFuture ? 'Future' : 'Current'}
                                  </span>
                                </td>
                                <td className="py-2 text-gray-600">{step.displayOrder}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-sm text-gray-500">No steps in this phase.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Phase"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Phase</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Segment"
            value={formData.segmentId}
            onChange={(e) =>
              setFormData({ ...formData, segmentId: e.target.value as Id<'segments'> })
            }
            required
          >
            <option value="">Select a segment...</option>
            {segments.map((segment) => (
              <option key={segment._id} value={segment._id}>
                {segment.icon} {segment.label}
              </option>
            ))}
          </Select>
          <Input
            label="Key"
            placeholder="e.g., prospecting"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            required
          />
          <Input
            label="Label"
            placeholder="e.g., Prospecting Sequence"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />
          <Input
            label="Duration"
            placeholder="e.g., 7 Days"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Background Color <span className="text-red-600">*</span>
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Accent Color <span className="text-red-600">*</span>
              </label>
              <input
                type="color"
                value={formData.accent}
                onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                required
              />
            </div>
          </div>
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
            }
            required
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Phase"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </>
        }
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Key"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            required
          />
          <Input
            label="Label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />
          <Input
            label="Duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Background Color <span className="text-red-600">*</span>
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Accent Color <span className="text-red-600">*</span>
              </label>
              <input
                type="color"
                value={formData.accent}
                onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </div>
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
            }
            required
          />
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Phase"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{' '}
            <strong>{selectedPhase?.label}</strong>?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This will permanently delete:
            </p>
            <ul className="mt-2 text-sm text-yellow-800 list-disc list-inside">
              <li>{selectedPhase?.steps?.length || 0} steps</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
