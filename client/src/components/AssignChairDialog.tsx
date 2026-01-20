
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog } from "lucide-react"; // Icon for Chair
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AssignChairDialogProps {
    evaluationId: number;
    currentChairId?: number | null;
    onAssignSuccess?: () => void;
}

export function AssignChairDialog({ evaluationId, currentChairId, onAssignSuccess }: AssignChairDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedChair, setSelectedChair] = useState<string>(currentChairId?.toString() || "");

    // Fetch potential chairs (users with 'board_chair' role + admins can be chairs too?)
    // Let's assume only 'board_chair' role for now, or maybe admin too if desired.
    // User request: "başkan atamasını kim nasıl yapıyor". Usually Admin assigns a Chair.
    const { data: users } = trpc.admin.listUsers.useQuery();

    // Filter for board_chair or admin (admins can technically chair)
    const chairs = users?.filter(u => u.role === "board_chair" || u.role === "admin") || [];

    const updateEvaluation = trpc.evaluation.update.useMutation({
        onSuccess: () => {
            toast.success("Başhakem Atandı", { description: "Değerlendirme için Başhakem başarıyla seçildi." });
            setOpen(false);
            if (onAssignSuccess) onAssignSuccess();
        },
        onError: (err) => {
            toast.error("Atama Hatası", { description: err.message });
        }
    });

    const handleAssign = () => {
        if (!selectedChair) return;
        updateEvaluation.mutate({
            id: evaluationId,
            boardChairId: parseInt(selectedChair)
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Başhakem Ata">
                    <UserCog className="w-4 h-4 text-purple-600" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Başhakem Atama</DialogTitle>
                    <DialogDescription>
                        Bu değerlendirme sürecini yönetecek Kurul Başkanını (Başhakem) seçin.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Select value={selectedChair} onValueChange={setSelectedChair}>
                            <SelectTrigger>
                                <SelectValue placeholder="Başhakem Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {chairs.length === 0 ? (
                                    <SelectItem value="none" disabled>Başhakem rolünde kullanıcı bulunamadı</SelectItem>
                                ) : (
                                    chairs.map((chair) => (
                                        <SelectItem key={chair.id} value={chair.id.toString()}>
                                            {chair.name || chair.email} ({chair.role === 'admin' ? 'Yönetici' : 'Başhakem'})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                    <Button onClick={handleAssign} disabled={!selectedChair || updateEvaluation.isPending}>
                        {updateEvaluation.isPending ? "Atanıyor..." : "Ata"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
