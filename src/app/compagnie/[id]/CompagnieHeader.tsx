"use client";

import { useState } from "react";
import { Card, Stack, Heading, Text, Button, Flex, Box, Input } from "@/components/ui";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { FaTheaterMasks } from "react-icons/fa";
import { updateCompany, deleteCompany } from "@/app/(auth)/company-actions";

export function CompagnieHeader({
  compagnieId,
  initialNom,
  canEdit,
  canDelete,
  onDeleted,
}: {
  compagnieId: number;
  initialNom: string;
  canEdit: boolean;
  canDelete: boolean;
  onDeleted: () => void;
}) {
  const [nom, setNom] = useState(initialNom);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSubmitting, setNameSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const handleSaveName = async () => {
    setNameSubmitting(true);
    setNameError(null);
    const fd = new FormData();
    fd.set("id", String(compagnieId));
    fd.set("nom", editValue);
    const result = await updateCompany(fd);
    setNameSubmitting(false);
    if ("error" in result) {
      setNameError(result.error ?? null);
    } else {
      setNom(editValue);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    setDeleteSubmitting(true);
    setDeleteError(null);
    const fd = new FormData();
    fd.set("id", String(compagnieId));
    const result = await deleteCompany(fd);
    setDeleteSubmitting(false);
    if ("error" in result) {
      setDeleteError(result.error ?? null);
    } else {
      onDeleted();
    }
  };

  return (
    <Card className="p-8 border-black/5 shadow-sm bg-white">
      <Flex align="start" justify="between" gap={4}>
        <Flex align="center" gap={4} className="flex-1 min-w-0">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <FaTheaterMasks size={24} />
          </div>
          {editing ? (
            <Stack gap={2} className="flex-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="text-lg font-semibold"
                autoFocus
              />
              {nameError && <Text className="text-xs text-red-500">{nameError}</Text>}
              <Flex gap={2}>
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  disabled={nameSubmitting || editValue.length < 2}
                >
                  {nameSubmitting ? "..." : "Enregistrer"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setNameError(null);
                  }}
                  icon={<LuX />}
                />
              </Flex>
            </Stack>
          ) : (
            <Heading as="h3" className="font-serif truncate">
              {nom}
            </Heading>
          )}
        </Flex>

        {!editing && (
          <Flex gap={2} className="shrink-0">
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(true);
                  setEditValue(nom);
                }}
                className="hover:bg-primary/10 hover:text-primary"
                icon={<LuPencil size={14} />}
              />
            )}
            {canDelete && !confirmDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmDelete(true)}
                className="hover:bg-red-50 hover:text-red-600"
                icon={<LuTrash2 size={14} />}
              />
            )}
          </Flex>
        )}
      </Flex>

      {confirmDelete && (
        <Box className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
          <Stack gap={3}>
            <Text className="text-sm font-medium text-red-800">
              Supprimer &laquo;{nom}&raquo; ? Cette action est irréversible.
            </Text>
            {deleteError && <Text className="text-xs text-red-600">{deleteError}</Text>}
            <Flex gap={2}>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? "..." : "Confirmer la suppression"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteError(null);
                }}
                icon={<LuX />}
              />
            </Flex>
          </Stack>
        </Box>
      )}
    </Card>
  );
}
