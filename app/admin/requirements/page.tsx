'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Id } from '@/convex/_generated/dataModel';

export default function RequirementsPage() {
  const segments = useQuery(api.segments.getAllWithRelations);
  const createRequirement = useMutation(api.requirements.create);
  const updateRequirement = useMutation(api.requirements.update);
  const deleteRequirement = useMutation(api.requirements.remove);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [filterSegmentId, setFilterSegmentId] = useState<string>('');

  const [formData, setFormData] = useState({
    segmentId: '' as Id<'segments'> | '',
    area: '',
    items: [''],
    displayOrder: 0,
  });

  // Flatten all requirements from all segments
  const allRequirements = useMemo(() => {
    if (!segments) return [];

    return segments.flatMap((segment) =>
      (segment.requirements || []).map((req) => ({
        ...req,
        segment: {
          _id: segment._id,
          key: segment.key,
          label: segment.label,
          icon: segment.icon,
        },
      }))
    );
  }, [segments]);

  // Filter requirements by selected segment
  const filteredRequirements = useMemo(() => {
    if (!filterSegmentId) return allRequirements;
    return allRequirements.filter((r) => r.segment._id === filterSegmentId);
  }, [allRequirements, filterSegmentId]);

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, ''] });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems.length ? newItems : [''] });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.segmentId) {
      alert('Please select a segment');
      return;
    }

    // Filter out empty items
    const filteredItems = formData.items.filter((item) => item.trim() !== '');
    if (filteredItems.length === 0) {
      alert('Please add at least one requirement item');
      return;
    }

    try {
      await createRequirement({
        segmentId: formData.segmentId,
        area: formData.area,
        items: filteredItems,
        displayOrder: formData.displayOrder,
      });
      setIsCreateModalOpen(false);
      setFormData({
        segmentId: '',
        area: '',
        items: [''],
        displayOrder: 0,
      });
    } catch (error) {
      console.error('Error creating requirement:', error);
      alert('Failed to create requirement');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequirement) return;

    // Filter out empty items
    const filteredItems = formData.items.filter((item) => item.trim() !== '');
    if (filteredItems.length === 0) {
      alert('Please add at least one requirement item');
      return;
    }

    try {
      await updateRequirement({
        id: selectedRequirement._id,
        area: formData.area,
        items: filteredItems,
        displayOrder: formData.displayOrder,
      });
      setIsEditModalOpen(false);
      setSelectedRequirement(null);
    } catch (error) {
      console.error('Error updating requirement:', error);
      alert('Failed to update requirement');
    }
  };

  const handleDelete = async () => {
    if (!selectedRequirement) return;

    try {
      await deleteRequirement({ id: selectedRequirement._id });
      setIsDeleteModalOpen(false);
      setSelectedRequirement(null);
    } catch (error) {
      console.error('Error deleting requirement:', error);
      alert('Failed to delete requirement');
    }
  };

  const openEditModal = (requirement: any) => {
    setSelectedRequirement(requirement);
    setFormData({
      segmentId: requirement.segmentId,
      area: requirement.area,
      items: requirement.items.length > 0 ? requirement.items : [''],
      displayOrder: requirement.displayOrder,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (requirement: any) => {
    setSelectedRequirement(requirement);
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
          <h2 className="text-2xl font-bold text-gray-900">Requirements</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage Salesforce requirements for each segment
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Requirement
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

      {/* Requirements List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
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
            {filteredRequirements.map((requirement) => (
              <tr key={requirement._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{requirement.area}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span>
                    {requirement.segment.icon} {requirement.segment.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {requirement.items.slice(0, 3).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                    {requirement.items.length > 3 && (
                      <li className="text-gray-500 italic">
                        +{requirement.items.length - 3} more
                      </li>
                    )}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {requirement.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(requirement)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(requirement)}
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
        title="Create New Requirement"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Requirement</Button>
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
            label="Area"
            placeholder="e.g., Lead Capture, Nurture Flow"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirement Items <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    required
                  />
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addItem}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
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
        title="Edit Requirement"
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
            label="Area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirement Items <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    required
                  />
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addItem}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
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
        title="Delete Requirement"
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
            Are you sure you want to delete the requirement area{' '}
            <strong>{selectedRequirement?.area}</strong>?
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Items to be deleted:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {selectedRequirement?.items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
