export const MenuTab: React.FC<{ menuItems: any[]; setMenuItems: (items: any[]) => void }> = ({ menuItems, setMenuItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'drinks',
    image: '',
    featured: false
  });

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentItem(null);
    setFormData({ name: '', description: '', price: 0, category: 'drinks', image: '', featured: false });
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      featured: item.featured || false
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updated = menuItems.filter(item => item.id !== id);
      setMenuItems(updated);
      localStorage.setItem('menuItems', JSON.stringify(updated));
      toast.success('Item deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Please fill all fields');
      return;
    }

    let updated;
    if (currentItem) {
      updated = menuItems.map(item => item.id === currentItem.id ? { ...item, ...formData } : item);
      toast.success('Item updated successfully');
    } else {
      const newItem = { id: Date.now().toString(), ...formData };
      updated = [...menuItems, newItem];
      toast.success('Item added successfully');
    }

    setMenuItems(updated);
    localStorage.setItem('menuItems', JSON.stringify(updated));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Menu Items</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentItem ? 'Edit Item' : 'Add New Item'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Price (Fbu)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                {initialCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#00B4D8] focus:ring-[#00B4D8]"
              />
              <label className="text-[#042029] dark:text-white">Featured Item</label>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg mb-2 text-[#042029] dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-3 line-clamp-2">{item.description}</p>
                <p className="text-[#00B4D8] mb-4">{item.price.toLocaleString()} Fbu</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};