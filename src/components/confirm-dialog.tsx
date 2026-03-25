"use client";

import { Button, Modal } from "@heroui/react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isDestructive = false,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={(open) => {
          if (!open) onCancel();
        }}
      >
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.Header>
                  <Modal.Heading>{title}</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p className="text-sm text-white/60">{description}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    isDisabled={isPending}
                    variant="outline"
                    onPress={() => {
                      close();
                      onCancel();
                    }}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    className={
                      isDestructive
                        ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        : ""
                    }
                    isDisabled={isPending}
                    variant={isDestructive ? "ghost" : "primary"}
                    onPress={onConfirm}
                  >
                    {isPending ? "Eliminando…" : confirmLabel}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
