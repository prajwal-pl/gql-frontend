"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { CHANGE_PASSWORD, ME, UPDATE_PROFILE } from "@/lib/gql";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  KeyRound,
  Loader2,
  Save,
  RefreshCw,
  FileEdit,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
  email: z.string().email("Must be a valid email").optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Page() {
  const { data, loading, refetch } = useQuery(ME, {
    fetchPolicy: "network-only",
  });
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE);
  const [changePassword, { loading: changing }] = useMutation(CHANGE_PASSWORD);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set up forms with validation
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    setMounted(true);

    if (data?.me) {
      profileForm.reset({
        name: data.me.name || "",
        bio: data.me.bio || "",
        email: data.me.email || "",
      });
    }
  }, [data, profileForm]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const saveProfile = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        variables: { input: values },
        onCompleted: () => {
          toast.success("Profile updated successfully");
          refetch();
          setIsEditing(false);
        },
      });
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const savePassword = async (values: PasswordFormValues) => {
    try {
      await changePassword({
        variables: values,
        onCompleted: () => {
          toast.success("Password changed successfully");
          passwordForm.reset();
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
      console.error(error);
    }
  };

  const roleColor =
    data?.me?.role === "TEACHER"
      ? "bg-cyan-600 text-white"
      : data?.me?.role === "STUDENT"
      ? "bg-purple-600 text-white"
      : "bg-amber-600 text-white";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 via-white to-cyan-50 dark:from-[#06050a] dark:via-black dark:to-[#070a0e]">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          User Profile
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manage your account settings and preferences
        </motion.p>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* User Card - Left Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Card className="border border-border/50 shadow-lg overflow-hidden">
              <CardHeader className="pb-4 pt-6 text-center bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20">
                <div className="flex justify-center">
                  {loading || !mounted ? (
                    <Skeleton className="h-24 w-24 rounded-full" />
                  ) : (
                    <Avatar className="h-24 w-24 bg-gradient-to-br from-purple-600 to-cyan-600 text-white text-2xl border-4 border-background shadow-lg">
                      <AvatarFallback>
                        {data?.me?.name ? getInitials(data.me.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <AnimatePresence mode="wait">
                  {loading || !mounted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <Skeleton className="h-6 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h2 className="text-xl font-semibold">
                        {data?.me?.name}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {data?.me?.email}
                      </p>
                      <div className="mt-2 inline-flex">
                        <span
                          className={`text-xs font-medium rounded-full px-2.5 py-1 ${roleColor}`}
                        >
                          {data?.me?.role}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className="my-4" />

                <div className="text-left mt-3">
                  <h3 className="text-sm font-medium mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground mb-4 break-words">
                    {loading || !mounted ? (
                      <>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5" />
                      </>
                    ) : (
                      data?.me?.bio || "No bio provided"
                    )}
                  </p>

                  <h3 className="text-sm font-medium mb-2">Member since</h3>
                  <p className="text-sm text-muted-foreground">August 2025</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => refetch()}
                  disabled={loading}
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh Profile
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Profile Forms - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Card className="border border-border/50 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your personal details
                        </CardDescription>
                      </div>
                      <FileEdit size={20} className="text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-4"
                      id="profile-form"
                      onSubmit={profileForm.handleSubmit(saveProfile)}
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">
                          Name
                        </label>
                        <div className="relative">
                          <User
                            size={16}
                            className="absolute left-3 top-2.5 text-muted-foreground"
                          />
                          <Input
                            className="pl-9"
                            placeholder="Your name"
                            {...profileForm.register("name")}
                            disabled={!isEditing}
                          />
                        </div>
                        {profileForm.formState.errors.name && (
                          <p className="text-sm text-destructive mt-1">
                            {profileForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">
                          Email
                        </label>
                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-3 top-2.5 text-muted-foreground"
                          />
                          <Input
                            className="pl-9"
                            placeholder="Your email"
                            type="email"
                            {...profileForm.register("email")}
                            disabled={!isEditing}
                          />
                        </div>
                        {profileForm.formState.errors.email && (
                          <p className="text-sm text-destructive mt-1">
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium block">
                            Bio
                          </label>
                          <span className="text-xs text-muted-foreground">
                            {profileForm.watch("bio")?.length || 0}/300
                          </span>
                        </div>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="min-h-[100px] resize-none"
                          {...profileForm.register("bio")}
                          disabled={!isEditing}
                        />
                        {profileForm.formState.errors.bio && (
                          <p className="text-sm text-destructive mt-1">
                            {profileForm.formState.errors.bio.message}
                          </p>
                        )}
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t bg-muted/50 p-4">
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            profileForm.reset({
                              name: data?.me?.name || "",
                              bio: data?.me?.bio || "",
                              email: data?.me?.email || "",
                            });
                          }}
                        >
                          <XCircle size={16} className="mr-2" />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          form="profile-form"
                          disabled={updating || !profileForm.formState.isDirty}
                          className="gap-2"
                        >
                          {updating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="default"
                      >
                        <FileEdit size={16} className="mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="security">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Card className="border border-border/50 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Change Password</CardTitle>
                          <CardDescription>
                            Update your security credentials
                          </CardDescription>
                        </div>
                        <ShieldCheck
                          size={20}
                          className="text-muted-foreground"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form
                        id="password-form"
                        className="space-y-4"
                        onSubmit={passwordForm.handleSubmit(savePassword)}
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-medium block">
                            Current Password
                          </label>
                          <div className="relative">
                            <KeyRound
                              size={16}
                              className="absolute left-3 top-2.5 text-muted-foreground"
                            />
                            <Input
                              className="pl-9"
                              placeholder="Enter current password"
                              type="password"
                              {...passwordForm.register("currentPassword")}
                            />
                          </div>
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="text-sm text-destructive mt-1">
                              {
                                passwordForm.formState.errors.currentPassword
                                  .message
                              }
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium block">
                            New Password
                          </label>
                          <div className="relative">
                            <KeyRound
                              size={16}
                              className="absolute left-3 top-2.5 text-muted-foreground"
                            />
                            <Input
                              className="pl-9"
                              placeholder="Enter new password"
                              type="password"
                              {...passwordForm.register("newPassword")}
                            />
                          </div>
                          {passwordForm.formState.errors.newPassword && (
                            <p className="text-sm text-destructive mt-1">
                              {
                                passwordForm.formState.errors.newPassword
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t bg-muted/50 p-4">
                      <Button
                        type="submit"
                        form="password-form"
                        disabled={changing || !passwordForm.formState.isDirty}
                      >
                        {changing ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <ShieldCheck size={16} className="mr-2" />
                        )}
                        Update Password
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
