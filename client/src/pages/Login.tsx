import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [, setLocation] = useLocation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Giriş başarısız oldu. Bilgilerinizi kontrol edin.");
            }

            const data = await response.json();

            toast.success(`Hoş geldiniz, ${data.user.name}`);

            // Redirect to home or dashboard
            window.location.href = "/";
        } catch (error: any) {
            toast.error(error.message || "Giriş başarısız.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <CardTitle>Giriş Yap</CardTitle>
                    <CardDescription>
                        Akademik Etki Değerlendirme Sistemine devam etmek için giriş yapın.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground space-y-1">
                            <p className="font-semibold">Demo Hesapları (Şifre: 1234):</p>
                            <ul className="grid grid-cols-2 gap-1">
                                <li>• yazar@aie.com</li>
                                <li>• hakem@aie.com</li>
                                <li>• baskan@aie.com</li>
                                <li>• admin@aie.com</li>
                            </ul>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
