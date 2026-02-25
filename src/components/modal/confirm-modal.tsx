import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ConfirmModalProps = {
  onConfirm: () => void;
  children: React.ReactNode;
};

export default function ConfirmModal({ onConfirm, children }: ConfirmModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-style-neutral-800 border-style-neutral-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-style-neutral-0">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-style-neutral-400">
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-style-neutral-500 text-style-neutral-0 hover:bg-style-neutral-900 hover:text-style-neutral-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-style-red-500 text-style-neutral-0 hover:bg-style-red-500/80"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}