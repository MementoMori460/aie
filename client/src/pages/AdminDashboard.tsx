import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseDate } from "../../../shared/calculations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Shield, Users, Key, Save, RefreshCw, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
    const { data: currentUser } = trpc.auth.me.useQuery();

    if (!currentUser || currentUser.role !== "admin") {
        return (
            <div className="container py-8 flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Yetkisiz Erişim</h1>
                    <p className="text-muted-foreground">Bu sayfayı görüntülemek için Yönetici (Admin) yetkisine sahip olmalısınız.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yönetici Paneli</h1>
                    <p className="text-muted-foreground">Kullanıcıları yönetin ve sistem ayarlarını yapılandırın.</p>
                </div>
            </div>

            <Tabs defaultValue="users" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Kullanıcılar
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Sistem Ayarları (API)
                    </TabsTrigger>
                    <TabsTrigger value="prompt" className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        AI İstem (Prompt)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <UsersTab />
                </TabsContent>

                <TabsContent value="settings">
                    <SettingsTab />
                </TabsContent>

                <TabsContent value="prompt">
                    <PromptTab />
                </TabsContent>
            </Tabs>
            <AdminFooter />
        </div>
    );
}

function PromptTab() {
    const { data: prompt, isLoading, refetch } = trpc.admin.getPrompt.useQuery();
    const { data: history, refetch: refetchHistory } = trpc.admin.getPromptHistory.useQuery();

    const savePrompt = trpc.admin.savePrompt.useMutation({
        onSuccess: () => {
            toast.success("Prompt Kaydedildi");
            refetch();
            refetchHistory();
            setIsEditing(false);
        }
    });

    const setActivePrompt = trpc.admin.setActivePrompt.useMutation({
        onSuccess: () => {
            toast.success("Prompt Aktif Edildi");
            refetch();
            refetchHistory();
        }
    });

    const deletePrompt = trpc.admin.deletePrompt.useMutation({
        onSuccess: () => {
            toast.success("Versiyon Silindi");
            refetchHistory();
        },
        onError: (err) => toast.error(err.message)
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");

    if (isLoading) return <Skeleton className="h-[400px]" />;

    const handleEdit = () => {
        setEditValue(prompt || "");
        setIsEditing(true);
    };

    const handleSave = () => {
        savePrompt.mutate({ promptText: editValue });
    };

    return (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle>Mevcut Yapay Zeka İstemi (Prompt)</CardTitle>
                            <CardDescription>
                                Sistem analiz yaparken bu şablonu kullanır.
                            </CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button onClick={handleEdit} variant="outline" size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Düzenle
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">İptal</Button>
                                <Button onClick={handleSave} disabled={savePrompt.isPending} size="sm">
                                    Kaydet & Aktif Et
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[500px]">
                        {isEditing ? (
                            <Textarea
                                className="font-mono text-sm h-full min-h-[500px] resize-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />
                        ) : (
                            <div className="bg-muted p-4 rounded-md overflow-x-auto max-h-[600px] overflow-y-auto whitespace-pre-wrap font-mono text-sm h-full">
                                {prompt}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nasıl Çalışır?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            Bu sistem, yüklenen makale metnini ve meta verilerini alarak belirlenen prompt şablonuna yerleştirir ve yapay zeka modeline gönderir.
                        </p>
                        <p>
                            Prompt içinde <strong>{"{{paper_text}}"}</strong> gibi değişkenler kullanılmaz, sistem metni otomatik olarak sona ekler.
                        </p>
                        <ul className="list-disc pl-4 space-y-1 mt-2">
                            <li>JSON formatında yanıt istenir.</li>
                            <li>Göstergeler (Indicators) tanımlanmalıdır.</li>
                            <li>Kıdemli Akademisyen persona'sı kullanılır.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Geçmiş Versiyonlar</CardTitle>
                        <CardDescription>Eski prompt kayıtları.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {history?.map((h) => (
                                <div key={h.id} className="flex flex-col gap-2 p-3 border rounded-lg text-sm bg-card hover:bg-accent/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium">
                                            {parseDate(h.createdAt).toLocaleDateString("tr-TR")}
                                            <span className="text-xs text-muted-foreground ml-2">
                                                {parseDate(h.createdAt).toLocaleTimeString("tr-TR")}
                                            </span>
                                        </div>
                                        {h.isActive && <Badge className="bg-green-600">Aktif</Badge>}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate line-clamp-2">
                                        {(h as any).creatorName} tarafından oluşturuldu.
                                    </div>

                                    {!h.isActive && (
                                        <div className="flex gap-2 mt-2 pt-2 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs flex-1"
                                                onClick={() => setActivePrompt.mutate({ id: h.id })}
                                                disabled={setActivePrompt.isPending}
                                            >
                                                Geri Yükle
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => deletePrompt.mutate({ id: h.id })}
                                                disabled={deletePrompt.isPending}
                                            >
                                                Sil
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {history?.length === 0 && (
                                <div className="text-center text-muted-foreground py-4">
                                    Henüz geçmiş kaydı yok.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function UsersTab() {
    const { data: users, isLoading, refetch } = trpc.admin.listUsers.useQuery();
    const updateUserRole = trpc.admin.updateUserRole.useMutation({
        onSuccess: () => {
            toast.success("Rol Güncellendi", { description: "Kullanıcı yetkisi başarıyla değiştirildi." });
            refetch();
        }
    });

    const toggleBlock = trpc.admin.toggleBlock.useMutation({
        onSuccess: () => {
            toast.success("Durum Güncellendi");
            refetch();
        },
        onError: (err) => toast.error(err.message)
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");

    if (isLoading) return <Skeleton className="h-[400px]" />;

    const filteredUsers = users?.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle>Kullanıcı Listesi</CardTitle>
                        <CardDescription>Sistemdeki tüm kayıtlı kullanıcıları ve rollerini yönetin.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <AddUserDialog onUserCreated={() => refetch()} />
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Yenile
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                        <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="İsim veya E-posta ile ara..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Tabs value={roleFilter} onValueChange={setRoleFilter} className="w-full md:w-auto">
                        <TabsList>
                            <TabsTrigger value="all">Tümü</TabsTrigger>
                            <TabsTrigger value="admin">Yöneticiler</TabsTrigger>
                            <TabsTrigger value="board_chair">Başhakemler</TabsTrigger>
                            <TabsTrigger value="reviewer">Hakemler</TabsTrigger>
                            <TabsTrigger value="user">Kullanıcılar</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Ad Soyad / Email</TableHead>
                                <TableHead>Kayıt Tarihi</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Engelli</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Kritere uygun kullanıcı bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers?.map((user) => (
                                    <TableRow key={user.id} className={user.isBlocked ? "bg-red-50 dark:bg-red-950/20" : ""}>
                                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{user.name || "İsimsiz"}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {parseDate(user.createdAt).toLocaleDateString("tr-TR")}
                                        </TableCell>
                                        <TableCell>
                                            <RoleBadge role={user.role} />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={!!user.isBlocked}
                                                onCheckedChange={(checked) => toggleBlock.mutate({ id: user.id, isBlocked: checked })}
                                                disabled={toggleBlock.isPending || user.role === 'admin'}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-1">
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(val) => updateUserRole.mutate({ userId: user.id, role: val as any })}
                                                disabled={updateUserRole.isPending}
                                            >
                                                <SelectTrigger className="w-[110px] h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">Kullanıcı</SelectItem>
                                                    <SelectItem value="reviewer">Hakem</SelectItem>
                                                    <SelectItem value="board_chair">Başhakem</SelectItem>
                                                    <SelectItem value="admin">Yönetici</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <EditUserDialog user={user} onUserUpdated={refetch} />
                                            <ResetPasswordDialog userId={user.id} onPasswordReset={refetch} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function AddUserDialog({ onUserCreated }: { onUserCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"user" | "admin" | "reviewer" | "board_chair">("user");
    const [expertise, setExpertise] = useState("");

    const createUser = trpc.admin.createUser.useMutation({
        onSuccess: () => {
            toast.success("Kullanıcı Oluşturuldu", { description: `${name} adlı kullanıcı başarıyla sisteme eklendi.` });
            setOpen(false);
            onUserCreated();
            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            setRole("user");
            setExpertise("");
        },
        onError: (error) => {
            toast.error("Hata", { description: error.message || "Kullanıcı oluşturulurken bir hata oluştu." });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createUser.mutate({ name, email, password, role, expertise });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Yeni Kullanıcı Ekle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
                    <DialogDescription>
                        Sisteme manuel olarak yeni bir kullanıcı ekleyin. Kullanıcı bu bilgilerle giriş yapabilecektir.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-name">Ad Soyad</Label>
                        <Input
                            id="new-name"
                            placeholder="Ad Soyad"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-email">E-posta</Label>
                        <Input
                            id="new-email"
                            type="email"
                            placeholder="ornek@aie.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Şifre</Label>
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-role">Rol</Label>
                        <Select value={role} onValueChange={(val) => setRole(val as any)}>
                            <SelectTrigger id="new-role">
                                <SelectValue placeholder="Rol Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Yazar (Kullanıcı)</SelectItem>
                                <SelectItem value="reviewer">Hakem</SelectItem>
                                <SelectItem value="board_chair">Kurul Başkanı</SelectItem>
                                <SelectItem value="admin">Yönetici</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-expertise">Uzmanlık Alanları</Label>
                        <Input
                            id="new-expertise"
                            placeholder="Örn: AI, Veri Bilimi"
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                        <Button type="submit" disabled={createUser.isPending}>
                            {createUser.isPending ? "Oluşturuluyor..." : "Kullanıcıyı Oluştur"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function SettingsTab() {
    const { data: settings, isLoading, refetch } = trpc.admin.getSettings.useQuery();
    const updateSetting = trpc.admin.updateSetting.useMutation({
        onSuccess: () => {
            toast.success("Ayar Kaydedildi", { description: "Sistem ayarı başarıyla güncellendi." });
            refetch();
        }
    });

    const [localKeys, setLocalKeys] = useState<{ [key: string]: string }>({});

    if (isLoading) return <Skeleton className="h-[400px]" />;

    const getKey = (key: string) => {
        return localKeys[key] !== undefined ? localKeys[key] : (settings?.find(s => s.key === key)?.value || "");
    };

    const handleSave = (key: string, description: string) => {
        updateSetting.mutate({ key, value: getKey(key), description });
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>LLM API Anahtarları</CardTitle>
                    <CardDescription>
                        Yapay Zeka özelliklerinin çalışması için gerekli API anahtarlarını buradan yönetin.
                        Bu anahtarlar veritabanında saklanır ve .env dosyasından önceliklidir.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="BUILT_IN_FORGE_API_KEY">Forge / OpenAI API Key</Label>
                        <div className="flex gap-2">
                            <Input
                                id="BUILT_IN_FORGE_API_KEY"
                                type="password"
                                placeholder="sk-..."
                                value={getKey("BUILT_IN_FORGE_API_KEY")}
                                onChange={(e) => setLocalKeys(prev => ({ ...prev, "BUILT_IN_FORGE_API_KEY": e.target.value }))}
                            />
                            <Button onClick={() => handleSave("BUILT_IN_FORGE_API_KEY", "Main LLM API Key")}>
                                <Save className="w-4 h-4 mr-2" />
                                Kaydet
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Gemini veya OpenAI modelleri için kullanılan ana anahtar.
                        </p>
                    </div>

                    <div className="grid gap-2 pt-4 border-t">
                        <h3 className="text-lg font-semibold">AI Analiz Ayarları</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai_analysis_max_chars">Analiz Karakter Sınırı</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="ai_analysis_max_chars"
                                        type="number"
                                        placeholder="15000"
                                        value={getKey("ai_analysis_max_chars")}
                                        onChange={(e) => setLocalKeys(prev => ({ ...prev, "ai_analysis_max_chars": e.target.value }))}
                                    />
                                    <Button onClick={() => handleSave("ai_analysis_max_chars", "Max characters for AI analysis")}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Kaydet
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    AI modeline gönderilecek makale metninin maksimum karakter sayısı. (Varsayılan: 15000)
                                    Daha yüksek değerler daha fazla token harcar ancak daha kapsamlı analiz sağlar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">SMTP E-posta Ayarları</h3>
                            <Button onClick={async () => {
                                const fields = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];
                                const promises = fields.map(key => {
                                    const val = getKey(key);
                                    if (val !== undefined) {
                                        return updateSetting.mutateAsync({ key, value: val, description: "SMTP Setting" });
                                    }
                                    return Promise.resolve();
                                });
                                await Promise.all(promises);
                                toast.success("SMTP Ayarları Kaydedildi");
                            }}>
                                <Save className="w-4 h-4 mr-2" />
                                SMTP Ayarlarını Kaydet
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="SMTP_HOST">SMTP Host</Label>
                                    <Input
                                        id="SMTP_HOST"
                                        placeholder="smtp.example.com"
                                        value={getKey("SMTP_HOST")}
                                        onChange={(e) => setLocalKeys(prev => ({ ...prev, "SMTP_HOST": e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="SMTP_PORT">SMTP Port</Label>
                                    <Input
                                        id="SMTP_PORT"
                                        placeholder="587"
                                        value={getKey("SMTP_PORT")}
                                        onChange={(e) => setLocalKeys(prev => ({ ...prev, "SMTP_PORT": e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="SMTP_USER">SMTP User</Label>
                                    <Input
                                        id="SMTP_USER"
                                        placeholder="user@example.com"
                                        value={getKey("SMTP_USER")}
                                        onChange={(e) => setLocalKeys(prev => ({ ...prev, "SMTP_USER": e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="SMTP_PASS">SMTP Password</Label>
                                    <Input
                                        id="SMTP_PASS"
                                        type="password"
                                        placeholder="******"
                                        value={getKey("SMTP_PASS")}
                                        onChange={(e) => setLocalKeys(prev => ({ ...prev, "SMTP_PASS": e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="SMTP_FROM">Gönderen Adresi (From)</Label>
                                <Input
                                    id="SMTP_FROM"
                                    placeholder='"Sistem" <noreply@example.com>'
                                    value={getKey("SMTP_FROM")}
                                    onChange={(e) => setLocalKeys(prev => ({ ...prev, "SMTP_FROM": e.target.value }))}
                                />
                            </div>

                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Atama Bildirimi</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Bir hakeme yeni görev atandığında e-posta gönder.
                                    </p>
                                </div>
                                <Switch
                                    checked={getKey("notify_on_assignment") === "true"}
                                    onCheckedChange={(checked) => {
                                        handleSave("notify_on_assignment", checked.toString());
                                        setLocalKeys(prev => ({ ...prev, "notify_on_assignment": checked.toString() }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Tamamlanma Bildirimi</Label>
                                <p className="text-sm text-muted-foreground">
                                    Bir değerlendirme tamamlandığında yöneticiye e-posta gönder.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={getKey("notify_on_completion") === "true"}
                                    onCheckedChange={(checked) => {
                                        handleSave("notify_on_completion", checked.toString());
                                        setLocalKeys(prev => ({ ...prev, "notify_on_completion": checked.toString() }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Hakem Raporu Bildirimi</Label>
                                <p className="text-sm text-muted-foreground">
                                    Bir hakem raporunu tamamlayıp gönderdiğinde yöneticiye bildir.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={getKey("notify_on_review_submission") === "true"}
                                    onCheckedChange={(checked) => {
                                        handleSave("notify_on_review_submission", checked.toString());
                                        setLocalKeys(prev => ({ ...prev, "notify_on_review_submission": checked.toString() }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Rol Değişikliği Bildirimi</Label>
                                <p className="text-sm text-muted-foreground">
                                    Bir kullanıcının yetkisi değiştirildiğinde kullanıcıya e-posta ile haber ver.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={getKey("notify_on_role_change") === "true"}
                                    onCheckedChange={(checked) => {
                                        handleSave("notify_on_role_change", checked.toString());
                                        setLocalKeys(prev => ({ ...prev, "notify_on_role_change": checked.toString() }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </div >
    );
}

function EditUserDialog({ user, onUserUpdated }: { user: any, onUserUpdated: () => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [expertise, setExpertise] = useState(user.expertise || "");

    const updateUser = trpc.admin.updateUser.useMutation({
        onSuccess: () => {
            toast.success("Kullanıcı Güncellendi");
            setOpen(false);
            onUserUpdated();
        },
        onError: (err) => toast.error("Hata: " + err.message)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser.mutate({ id: user.id, name, email, expertise });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Düzenle">
                    <Save className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kullanıcı Düzenle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Ad Soyad</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>E-posta</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Uzmanlık Alanları (Virgülle ayırın)</Label>
                        <Input
                            value={expertise}
                            onChange={e => setExpertise(e.target.value)}
                            placeholder="Örn: Yapay Zeka, Etik, Hukuk"
                        />
                        <p className="text-[10px] text-muted-foreground">Hakem atamalarında kullanılır.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                        <Button type="submit" disabled={updateUser.isPending}>Kaydet</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ResetPasswordDialog({ userId, onPasswordReset }: { userId: number, onPasswordReset: () => void }) {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");

    const resetPass = trpc.admin.resetPassword.useMutation({
        onSuccess: () => {
            toast.success("Şifre Sıfırlandı");
            setOpen(false);
            setPassword("");
            onPasswordReset();
        },
        onError: (err) => toast.error("Hata: " + err.message)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetPass.mutate({ id: userId, password });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Şifre Sıfırla">
                    <Key className="w-4 h-4 text-orange-500" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Şifre Sıfırla</DialogTitle>
                    <DialogDescription>
                        Kullanıcı için yeni bir şifre belirleyin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Yeni Şifre</Label>
                        <Input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={6} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                        <Button type="submit" disabled={resetPass.isPending}>Sıfırla</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function RoleBadge({ role }: { role: string }) {
    switch (role) {
        case "admin": return <Badge variant="destructive">Yönetici</Badge>;
        case "board_chair": return <Badge variant="default" className="bg-purple-600">Başhakem</Badge>;
        case "reviewer": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Hakem</Badge>;
        default: return <Badge variant="outline">Kullanıcı</Badge>;
    }
}

function AdminFooter() {
    const { data, isLoading, error } = trpc.system.version.useQuery();

    if (isLoading) return <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground animate-pulse">Loading version...</div>;
    if (error) return <div className="mt-8 pt-4 border-t text-center text-xs text-red-500">Version Error: {error.message}</div>;
    if (!data) return <div className="mt-8 pt-4 border-t text-center text-xs text-amber-500">Version: No Data</div>;

    return (
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground font-mono">
            System Version: <span className="font-semibold text-primary">{data.version}</span>
        </div>
    );
}
