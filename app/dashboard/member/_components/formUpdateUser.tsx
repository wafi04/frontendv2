import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateUsers, updateUserSchema } from "@/validation/user";
import { useUpdateUser } from "../server/route";

export function FormUpdateUser({
  initialData
}: {
  initialData?: {
    balance: number,
    username: string,
    name: string
    role: string
  }
}) {
  const form = useForm<UpdateUsers>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      balance: initialData?.balance ?? 0,
      role: initialData?.role ?? "member",
    },
  });
  const { mutate, isPending, error } = useUpdateUser()

  function onSubmit(values: UpdateUsers) {
    mutate({
      ...values,
      username: initialData?.username as string,
    })
  }

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan username"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Username harus minimal 3 karakter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Masukkan balance"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Balance dalam bentuk angka
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role pengguna" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Pilih role yang sesuai untuk pengguna
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            className="flex-1"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            Update User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </Form>
  );
}