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



export function FormUpdateUser({
  initialData
} : {
  initialData? : {
    balance : number,
    username : string,
    role : string
  }
}) {
  const form = useForm<UpdateUsers>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      balance: initialData?.balance ?? 0,
      role: initialData?.role ?? "member",
    },
  });

  function onSubmit(values: UpdateUsers) {
    console.log(values);
    alert(`Data berhasil disubmit: ${JSON.stringify(values, null, 2)}`);
  }

  return (
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
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