import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function ProductTable({ products, onEdit, onDelete, onView }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Photos</TableHead>
            <TableHead>Fix Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Discount Price</TableHead>
            <TableHead>Total Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {product.photos && product.photos.length > 0 ? (
                  <div className="flex flex-row gap-1 flex-wrap">
                    {product.photos.map((url, idx) => (
                      <img key={idx} src={url} alt="photo" className="w-10 h-10 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{product.fixPrice}</TableCell>
              <TableCell>{product.discount}</TableCell>
              <TableCell>{product.discountPrice}</TableCell>
              <TableCell>{product.totalProduct}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.tags && product.tags.length > 0 ? product.tags.join(", ") : "-"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(product)}>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(product._id)} className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 