'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Id } from '@/convex/_generated/dataModel';

export default function SegmentsPage() {
  const router = useRouter();
  const segments = useQuery(api.segments.getAllWithRelations);
  const createSegment = useMutation(api.segments.create);
  const updateSegment = useMutation(api.segments.update);
  const deleteSegment = useMutation(api.segments.remove);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);

  const [formData, setFormData] = useState({
    key: '',
    label: '',
    icon: '',
    displayOrder: 0,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSegment(formData);
      setIsCreateModalOpen(false);
      setFormData({ key: '', label: '', icon: '', displayOrder: 0 });
    } catch (error) {
      console.error('Error creating segment:', error);
      alert('Failed to create segment');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSegment) return;

    try {
      await updateSegment({
        id: selectedSegment._id,
        ...formData,
      });
      setIsEditModalOpen(false);
      setSelectedSegment(null);
    } catch (error) {
      console.error('Error updating segment:', error);
      alert('Failed to update segment');
    }
  };

  const handleDelete = async () => {
    if (!selectedSegment) return;

    try {
      await deleteSegment({ id: selectedSegment._id });
      setIsDeleteModalOpen(false);
      setSelectedSegment(null);
    } catch (error) {
      console.error('Error deleting segment:', error);
      alert('Failed to delete segment');
    }
  };

  const openEditModal = (segment: any) => {
    setSelectedSegment(segment);
    setFormData({
      key: segment.key,
      label: segment.label,
      icon: segment.icon,
      displayOrder: segment.displayOrder,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (segment: any) => {
    setSelectedSegment(segment);
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
          <h2 className="text-2xl font-bold text-gray-900">Segments</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage business segments and their journey workflows
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Segment
        </Button>
      </div>

      {/* Segments List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phases
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
            {segments.map((segment) => (
              <tr
                key={segment._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/admin/phases?segment=${segment._id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{segment.icon}</span>
                    <span className="font-medium text-gray-900">{segment.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <code className="bg-gray-100 px-2 py-1 rounded">{segment.key}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {segment.phases?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {segment.phases?.reduce((acc, p) => acc + (p.steps?.length || 0), 0) || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {segment.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); openEditModal(segment); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); openDeleteModal(segment); }}
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
        title="Create New Segment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Segment</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Key"
            placeholder="e.g., builders"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            required
          />
          <Input
            label="Label"
            placeholder="e.g., Custom Home Builders"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />
          <Input
            label="Icon (Emoji)"
            placeholder="e.g., 🏗️"
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
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Segment"
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
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Segment"
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
            <strong>{selectedSegment?.label}</strong>?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This will permanently delete:
            </p>
            <ul className="mt-2 text-sm text-yellow-800 list-disc list-inside">
              <li>{selectedSegment?.phases?.length || 0} phases</li>
              <li>
                {selectedSegment?.phases?.reduce(
                  (acc: number, p: any) => acc + (p.steps?.length || 0),
                  0
                ) || 0}{' '}
                steps
              </li>
              <li>{selectedSegment?.requirements?.length || 0} requirements</li>
              <li>{selectedSegment?.decisions?.length || 0} decisions</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
