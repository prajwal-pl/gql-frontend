"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/lib/gql";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Mail, Lock, Loader2, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [login, { loading, error }] = useMutation(LOGIN);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await login({ variables: { input: values } });
      const token = res.data?.login?.token;
      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        toast.success("Successfully logged in!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-[#06050a] dark:via-black dark:to-[#070a0e] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-border/50 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <CardHeader className="relative z-10 space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Login to continue to your dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="relative z-10">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      className="pl-10"
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive flex items-center gap-1 mt-1"
                      >
                        <AlertCircle size={14} />
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium block"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      className="pl-10"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...register("password")}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-destructive flex items-center gap-1 mt-1"
                      >
                        <AlertCircle size={14} />
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Button
                  className="w-full h-11 mt-2"
                  disabled={loading || isSubmitting}
                  type="submit"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/15 text-destructive p-3 rounded-md text-sm flex items-center gap-2"
                  >
                    <AlertCircle size={16} />
                    <span>{error.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-center w-full"
            >
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?
              </p>
              <Button variant="link" className="p-0 h-auto mt-1" asChild>
                <Link href="/register">Create a new account</Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
