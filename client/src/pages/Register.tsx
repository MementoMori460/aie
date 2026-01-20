import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [, setLocation] = useLocation();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Kayıt işlemi başarısız oldu.");
            }

            const data = await response.json();
            toast.success(`Hoş geldiniz, ${data.user.name}. Kayıt başarıyla tamamlandı.`);

            // Redirect to home
            window.location.href = "/";
        } catch (error: any) {
            toast.error(error.message || "Kayıt başarısız.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <CardTitle>Kayıt Ol</CardTitle>
                    <CardDescription>
                        Akademik Etki Değerlendirme Sistemine katılmak için hesap oluşturun.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input
                                id="name"
                                placeholder="Adınız Soyadınız"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@aie.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                    <p className="text-sm text-muted-foreground">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Giriş Yapın
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
