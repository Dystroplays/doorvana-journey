'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { Id } from '@/convex/_generated/dataModel';

export default function StepsPage() {
  const segments = useQuery(api.segments.getAllWithRelations);
  const createStep = useMutation(api.steps.create);
  const updateStep = useMutation(api.steps.update);
  const deleteStep = useMutation(api.steps.remove);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [filterSegmentId, setFilterSegmentId] = useState<string>('');
  const [filterPhaseId, setFilterPhaseId] = useState<string>('');

  const [formData, setFormData] = useState({
    phaseId: '' as Id<'phases'> | '',
    day: '',
    action: '',
    detail: '',
    tool: '',
    icon: '',
    displayOrder: 0,
    isFuture: false,
  });

  const [formSegmentId, setFormSegmentId] = useState<string>('');

  // Get all phases from all segments
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

  // Flatten all steps from all phases
  const allSteps = useMemo(() => {
    if (!segments) return [];

    return segments.flatMap((segment) =>
      (segment.phases || []).flatMap((phase) =>
        (phase.steps || []).map((step) => ({
          ...step,
          phase: {
            _id: phase._id,
            key: phase.key,
            label: phase.label,
          },
          segment: {
            _id: segment._id,
            key: segment.key,
            label: segment.label,
            icon: segment.icon,
          },
        }))
      )
    );
  }, [segments]);

  // Filter steps by segment and phase
  const filteredSteps = useMemo(() => {
    let steps = allSteps;

    if (filterSegmentId) {
      steps = steps.filter((s) => s.segment._id === filterSegmentId);
    }

    if (filterPhaseId) {
      steps = steps.filter((s) => s.phase._id === filterPhaseId);
    }

    return steps;
  }, [allSteps, filterSegmentId, filterPhaseId]);

  // Get phases for filter dropdown
  const filterPhases = useMemo(() => {
    if (!filterSegmentId) return allPhases;
    return allPhases.filter((p) => p.segment._id === filterSegmentId);
  }, [allPhases, filterSegmentId]);

  // Get phases for form dropdown
  const formPhases = useMemo(() => {
    if (!formSegmentId) return [];
    return allPhases.filter((p) => p.segment._id === formSegmentId);
  }, [allPhases, formSegmentId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phaseId) {
      alert('Please select a phase');
      return;
    }

    try {
      await createStep({
        phaseId: formData.phaseId,
        day: formData.day,
        action: formData.action,
        detail: formData.detail,
        tool: formData.tool,
        icon: formData.icon,
        displayOrder: formData.displayOrder,
        isFuture: formData.isFuture,
      });
      setIsCreateModalOpen(false);
      setFormData({
        phaseId: '',
        day: '',
        action: '',
        detail: '',
        tool: '',
        icon: '',
        displayOrder: 0,
        isFuture: false,
      });
      setFormSegmentId('');
    } catch (error) {
      console.error('Error creating step:', error);
      alert('Failed to create step');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep) return;

    try {
      await updateStep({
        id: selectedStep._id,
        day: formData.day,
        action: formData.action,
        detail: formData.detail,
        tool: formData.tool,
        icon: formData.icon,
        displayOrder: formData.displayOrder,
        isFuture: formData.isFuture,
      });
      setIsEditModalOpen(false);
      setSelectedStep(null);
    } catch (error) {
      console.error('Error updating step:', error);
      alert('Failed to update step');
    }
  };

  const handleDelete = async () => {
    if (!selectedStep) return;

    try {
      await deleteStep({ id: selectedStep._id });
      setIsDeleteModalOpen(false);
      setSelectedStep(null);
    } catch (error) {
      console.error('Error deleting step:', error);
      alert('Failed to delete step');
    }
  };

  const openEditModal = (step: any) => {
    setSelectedStep(step);
    setFormData({
      phaseId: step.phaseId,
      day: step.day,
      action: step.action,
      detail: step.detail,
      tool: step.tool,
      icon: step.icon,
      displayOrder: step.displayOrder,
      isFuture: step.isFuture,
    });
    setFormSegmentId(step.segment._id);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (step: any) => {
    setSelectedStep(step);
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
          <h2 className="text-2xl font-bold text-gray-900">Steps</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage individual steps within journey phases
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Filter by Segment"
            value={filterSegmentId}
            onChange={(e) => {
              setFilterSegmentId(e.target.value);
              setFilterPhaseId('');
            }}
          >
            <option value="">All Segments</option>
            {segments.map((segment) => (
              <option key={segment._id} value={segment._id}>
                {segment.icon} {segment.label}
              </option>
            ))}
          </Select>
          <Select
            label="Filter by Phase"
            value={filterPhaseId}
            onChange={(e) => setFilterPhaseId(e.target.value)}
            disabled={!filterSegmentId}
          >
            <option value="">All Phases</option>
            {filterPhases.map((phase) => (
              <option key={phase._id} value={phase._id}>
                {phase.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Steps List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Step
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tool
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {filteredSteps.map((step) => (
              <tr key={step._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{step.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{step.action}</div>
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {step.detail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span>
                    {step.segment.icon} {step.segment.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {step.phase.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {step.day}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {step.tool}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {step.isFuture ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Future
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Current
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {step.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(step)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(step)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormSegmentId('');
        }}
        title="Create New Step"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormSegmentId('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Step</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Segment"
            value={formSegmentId}
            onChange={(e) => {
              setFormSegmentId(e.target.value);
              setFormData({ ...formData, phaseId: '' });
            }}
            required
          >
            <option value="">Select a segment...</option>
            {segments.map((segment) => (
              <option key={segment._id} value={segment._id}>
                {segment.icon} {segment.label}
              </option>
            ))}
          </Select>
          <Select
            label="Phase"
            value={formData.phaseId}
            onChange={(e) =>
              setFormData({ ...formData, phaseId: e.target.value as Id<'phases'> })
            }
            required
            disabled={!formSegmentId}
          >
            <option value="">Select a phase...</option>
            {formPhases.map((phase) => (
              <option key={phase._id} value={phase._id}>
                {phase.label}
              </option>
            ))}
          </Select>
          <Input
            label="Day"
            placeholder="e.g., Day 0, Month 1-12"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            required
          />
          <Input
            label="Action"
            placeholder="e.g., Set up tracking"
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            required
          />
          <Textarea
            label="Detail"
            placeholder="Detailed description of the step..."
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
            required
            rows={3}
          />
          <Input
            label="Tool"
            placeholder="e.g., Salesforce"
            value={formData.tool}
            onChange={(e) => setFormData({ ...formData, tool: e.target.value })}
            required
          />
          <Input
            label="Icon (Emoji)"
            placeholder="e.g., 📊"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            required
          />
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
            }
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFuture"
              checked={formData.isFuture}
              onChange={(e) => setFormData({ ...formData, isFuture: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFuture" className="text-sm font-medium text-gray-700">
              Future State Step
            </label>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Step"
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
            label="Day"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            required
          />
          <Input
            label="Action"
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            required
          />
          <Textarea
            label="Detail"
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
            required
            rows={3}
          />
          <Input
            label="Tool"
            value={formData.tool}
            onChange={(e) => setFormData({ ...formData, tool: e.target.value })}
            required
          />
          <Input
            label="Icon (Emoji)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            required
          />
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
            }
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFuture-edit"
              checked={formData.isFuture}
              onChange={(e) => setFormData({ ...formData, isFuture: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFuture-edit" className="text-sm font-medium text-gray-700">
              Future State Step
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Step"
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
            Are you sure you want to delete this step?
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedStep?.icon}</span>
              <strong className="text-gray-900">{selectedStep?.action}</strong>
            </div>
            <p className="text-sm text-gray-600">{selectedStep?.detail}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
