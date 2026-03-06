'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, Circle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { Id } from '@/convex/_generated/dataModel';

export default function DecisionsPage() {
  const segments = useQuery(api.segments.getAllWithRelations);
  const createDecision = useMutation(api.decisions.create);
  const updateDecision = useMutation(api.decisions.update);
  const deleteDecision = useMutation(api.decisions.remove);
  const toggleResolved = useMutation(api.decisions.toggleResolved);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [filterSegmentId, setFilterSegmentId] = useState<string>('');

  const [formData, setFormData] = useState({
    segmentId: '' as Id<'segments'> | '',
    decision: '',
    displayOrder: 0,
    isResolved: false,
    resolution: '',
  });

  // Flatten all decisions from all segments
  const allDecisions = useMemo(() => {
    if (!segments) return [];

    return segments.flatMap((segment) =>
      (segment.decisions || []).map((decision) => ({
        ...decision,
        segment: {
          _id: segment._id,
          key: segment.key,
          label: segment.label,
          icon: segment.icon,
        },
      }))
    );
  }, [segments]);

  // Filter decisions by selected segment
  const filteredDecisions = useMemo(() => {
    if (!filterSegmentId) return allDecisions;
    return allDecisions.filter((d) => d.segment._id === filterSegmentId);
  }, [allDecisions, filterSegmentId]);

  const handleToggleResolved = async (decisionId: Id<'openDecisions'>) => {
    try {
      await toggleResolved({ id: decisionId });
    } catch (error) {
      console.error('Error toggling resolved status:', error);
      alert('Failed to toggle resolved status');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.segmentId) {
      alert('Please select a segment');
      return;
    }

    try {
      await createDecision({
        segmentId: formData.segmentId,
        decision: formData.decision,
        displayOrder: formData.displayOrder,
        isResolved: formData.isResolved,
        resolution: formData.resolution || undefined,
      });
      setIsCreateModalOpen(false);
      setFormData({
        segmentId: '',
        decision: '',
        displayOrder: 0,
        isResolved: false,
        resolution: '',
      });
    } catch (error) {
      console.error('Error creating decision:', error);
      alert('Failed to create decision');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision) return;

    try {
      await updateDecision({
        id: selectedDecision._id,
        decision: formData.decision,
        displayOrder: formData.displayOrder,
        isResolved: formData.isResolved,
        resolution: formData.resolution || undefined,
      });
      setIsEditModalOpen(false);
      setSelectedDecision(null);
    } catch (error) {
      console.error('Error updating decision:', error);
      alert('Failed to update decision');
    }
  };

  const handleDelete = async () => {
    if (!selectedDecision) return;

    try {
      await deleteDecision({ id: selectedDecision._id });
      setIsDeleteModalOpen(false);
      setSelectedDecision(null);
    } catch (error) {
      console.error('Error deleting decision:', error);
      alert('Failed to delete decision');
    }
  };

  const openEditModal = (decision: any) => {
    setSelectedDecision(decision);
    setFormData({
      segmentId: decision.segmentId,
      decision: decision.decision,
      displayOrder: decision.displayOrder,
      isResolved: decision.isResolved,
      resolution: decision.resolution || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (decision: any) => {
    setSelectedDecision(decision);
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
          <h2 className="text-2xl font-bold text-gray-900">Open Decisions</h2>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage open decisions for each segment
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Decision
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

      {/* Decisions List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Decision
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolution
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
            {filteredDecisions.map((decision) => (
              <tr key={decision._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleResolved(decision._id)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    {decision.isResolved ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600">Resolved</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-600">Open</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 max-w-md">{decision.decision}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span>
                    {decision.segment.icon} {decision.segment.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {decision.resolution ? (
                    <p className="text-sm text-gray-600 max-w-md">{decision.resolution}</p>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No resolution yet</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {decision.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(decision)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(decision)}
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
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Decision"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Decision</Button>
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
          <Textarea
            label="Decision"
            placeholder="Describe the open decision or question..."
            value={formData.decision}
            onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
            required
            rows={3}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isResolved"
              checked={formData.isResolved}
              onChange={(e) =>
                setFormData({ ...formData, isResolved: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isResolved" className="text-sm font-medium text-gray-700">
              Mark as Resolved
            </label>
          </div>
          {formData.isResolved && (
            <Textarea
              label="Resolution"
              placeholder="Describe the resolution..."
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              rows={3}
            />
          )}
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
        title="Edit Decision"
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
          <Textarea
            label="Decision"
            value={formData.decision}
            onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
            required
            rows={3}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isResolved-edit"
              checked={formData.isResolved}
              onChange={(e) =>
                setFormData({ ...formData, isResolved: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isResolved-edit" className="text-sm font-medium text-gray-700">
              Mark as Resolved
            </label>
          </div>
          {formData.isResolved && (
            <Textarea
              label="Resolution"
              placeholder="Describe the resolution..."
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              rows={3}
            />
          )}
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
        title="Delete Decision"
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
            Are you sure you want to delete this decision?
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">{selectedDecision?.decision}</p>
            {selectedDecision?.resolution && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">Resolution:</p>
                <p className="text-sm text-gray-700">{selectedDecision.resolution}</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
