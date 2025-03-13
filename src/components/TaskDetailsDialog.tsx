import { Dialog, DialogContent } from "@/components/ui/dialog";

const TaskDetailsDialog = ({
  isModalOpen,
  onClose,
}: {
  isModalOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col"></DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
