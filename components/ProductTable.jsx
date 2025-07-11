import React from "react";
import { Button } from "@/components/ui/button";

export default function ProductTable({ products, onEdit, onDelete, onView, editId, editData, onEditChange, onEditSave, onEditCancel }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Photos</th>
            <th className="border px-2 py-1">Fix Price</th>
            <th className="border px-2 py-1">Discount</th>
            <th className="border px-2 py-1">Discount Price</th>
            <th className="border px-2 py-1">Total Product</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Tags</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <input name="name" value={editData.name} onChange={onEditChange} className="border px-1 py-0.5" />
                ) : (
                  product.name
                )}
              </td>
              <td className="border px-2 py-1">
                {product.photos && product.photos.length > 0 ? (
                  <div className="flex flex-row gap-1 flex-wrap">
                    {product.photos.map((url, idx) => (
                      <img key={idx} src={url} alt="photo" className="w-10 h-10 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <input name="fixPrice" type="number" value={editData.fixPrice} onChange={onEditChange} className="border px-1 py-0.5" />
                ) : (
                  product.fixPrice
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <input name="discount" type="number" value={editData.discount} onChange={onEditChange} className="border px-1 py-0.5" />
                ) : (
                  product.discount
                )}
              </td>
              <td className="border px-2 py-1">{product.discountPrice}</td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <input name="totalProduct" type="number" value={editData.totalProduct} onChange={onEditChange} className="border px-1 py-0.5" />
                ) : (
                  product.totalProduct
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <input name="category" value={editData.category} onChange={onEditChange} className="border px-1 py-0.5" />
                ) : (
                  product.category
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <input name="tags" value={editData.tags ? editData.tags.join(", ") : ""} onChange={e => onEditChange({ target: { name: "tags", value: e.target.value.split(",").map(t => t.trim()) } })} className="border px-1 py-0.5" />
                ) : (
                  product.tags && product.tags.length > 0 ? product.tags.join(", ") : "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <>
                    <Button size="sm" onClick={() => onEditSave(product._id)} className="mr-2">Save</Button>
                    <Button size="sm" variant="outline" onClick={onEditCancel}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={() => onEdit(product)} className="mr-1">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(product._id)} className="mr-1">Delete</Button>
                    <Button size="sm" variant="secondary" onClick={() => onView(product)}>View</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 