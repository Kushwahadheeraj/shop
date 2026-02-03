"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API_BASE_URL from "@/lib/apiConfig";

export default function SectionTitleEditor({ sectionId, defaultTitle = "Section Title" }) {
  const [title, setTitle] = useState(defaultTitle);
  const [newTitle, setNewTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = `${API_BASE_URL}/home/section-titles/${sectionId}`;

  useEffect(() => {
    fetchTitle();
  }, [sectionId]);

  const fetchTitle = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.title) {
          setTitle(data.data.title);
          setNewTitle(data.data.title);
        } else {
          // If no title exists in DB, stick with default but set newTitle to default
          setNewTitle(defaultTitle);
        }
      }
    } catch (err) {
      console.error("Error fetching title:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      });
      if (res.ok) {
        setTitle(newTitle);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-b pb-4 mb-4">
      <span className="font-semibold text-gray-700 min-w-[100px]">Section Title:</span>
      {isEditing ? (
        <div className="flex gap-2 items-center flex-1 w-full sm:w-auto">
          <Input 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            className="max-w-md"
            placeholder="Enter section title"
          />
          <Button size="sm" onClick={handleUpdateTitle}>Save</Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      ) : (
        <div className="flex gap-2 items-center flex-1">
          <span className="text-lg font-bold text-orange-600">{title}</span>
          <Button size="sm" variant="ghost" onClick={() => { setNewTitle(title); setIsEditing(true); }}>
            <span className="text-xs text-blue-500 underline">Edit</span>
          </Button>
        </div>
      )}
    </div>
  );
}
