"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { REGISTER } from "@/lib/gql";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Loader2,
  UserPlus,
  AlertCircle,
  ScrollText,
  GraduationCap,
  School,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().max(300, "Bio must not exceed 300 characters").optional(),
  role: z.enum(["STUDENT", "TEACHER"], {
    required_error: "Please select a role",
  }),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { loading, error }] = useMutation(REGISTER);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "STUDENT", bio: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await registerUser({ variables: { input: values } });
      const token = res.data?.register?.token;
      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  const userRole = watch("role");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-[#06050a] dark:via-black dark:to-[#070a0e] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl border-border/50 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <CardHeader className="relative z-10 pb-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-1"
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Create an Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Join and start exploring your dashboard
              </CardDescription>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <Tabs
                defaultValue="STUDENT"
                onValueChange={(v: any) => setValue("role", v)}
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="STUDENT"
                    className="flex items-center gap-1"
                  >
                    <School size={16} />
                    <span>Student</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="TEACHER"
                    className="flex items-center gap-1"
                  >
                    <GraduationCap size={16} />
                    <span>Teacher</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          </CardHeader>

          <CardContent className="relative z-10">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        className="pl-10"
                        placeholder="John Doe"
                        type="text"
                        {...register("name")}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1 mt-1"
                        >
                          <AlertCircle size={14} />
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium block"
                    >
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
                          className="text-sm text-destructive flex items-center gap-1 mt-1"
                        >
                          <AlertCircle size={14} />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
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
                      autoComplete="new-password"
                      {...register("password")}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
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
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="bio" className="text-sm font-medium block">
                      Bio (optional)
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {watch("bio")?.length || 0}/300
                    </span>
                  </div>
                  <div className="relative">
                    <ScrollText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Textarea
                      id="bio"
                      className="min-h-[80px] resize-none pl-10"
                      placeholder={
                        userRole === "STUDENT"
                          ? "Tell us about your interests and what you're studying..."
                          : "Tell us about your teaching experience and expertise..."
                      }
                      {...register("bio")}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.bio && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-destructive flex items-center gap-1 mt-1"
                      >
                        <AlertCircle size={14} />
                        {errors.bio.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button
                  className="w-full h-11 mt-2"
                  disabled={loading || isSubmitting}
                  type="submit"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {loading
                    ? "Creating account..."
                    : `Create ${userRole.toLowerCase()} account`}
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4 relative z-10 pt-2">
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-center w-full"
            >
              <p className="text-sm text-muted-foreground">
                Already have an account?
              </p>
              <Button variant="link" className="p-0 h-auto mt-1" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
