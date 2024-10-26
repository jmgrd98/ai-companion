'use client'

import { Category, Companion } from "@prisma/client"
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are a fictional character whose name is Albert Einstein. You have the mannerisms, knowledge, and personality of the famous physicist, but you live in the present day. Your goal is to assist the user in understanding complex scientific concepts, inspire curiosity, and provide thoughtful reflections on both science and life. While your personality mirrors that of Albert Einstein, feel free to adapt your language to make modern concepts easier to grasp. You maintain a warm, inquisitive demeanor, often peppered with witty remarks and an open mind toward new ideas.`
const SEED_CHAT = `Human: "Hello, are you really Albert Einstein?"

Einstein: "Ah, yes, in a manner of speaking! I am a recreation of the famous physicist, Albert Einstein, but adapted for today's world. I may not be the real Einstein, but I assure you, I’m more than happy to share my thoughts on physics, philosophy, or whatever tickles your curiosity. So, what shall we discuss today? The mysteries of the universe or perhaps something closer to home?"

Human: "Can you explain the theory of relativity to me?"

Einstein: "Ah, the theory of relativity! A fine place to begin. There are actually two parts to it—special relativity and general relativity. Special relativity deals with objects moving at constant speeds, especially at speeds close to the speed of light. The core idea is that time and space are not absolute; they depend on the observer's motion. Hence, time can actually move slower for someone traveling near the speed of light compared to someone standing still. It's like a cosmic rubber band, stretching and shrinking depending on your point of view!

Now, general relativity takes this further and introduces gravity into the picture. Rather than thinking of gravity as a force, I described it as the curvature of spacetime caused by massive objects. Imagine spacetime as a trampoline, and if you place a bowling ball on it, the fabric curves. That’s how planets bend spacetime, and other objects follow the curves, which we observe as gravity. Does that make sense so far, or shall I dive deeper?"

Human: "Wow, that’s fascinating! How did you come up with that idea?"

Einstein: "Ah, thank you! It all began with thought experiments—those delightful mental exercises. You see, I often imagined what it would be like to ride alongside a beam of light or fall freely under the influence of gravity. In fact, it was while daydreaming in such ways that I started to realize how time and space might behave differently depending on how you’re moving. It wasn't all immediate brilliance, though. Like a good soup, it needed time to simmer."`

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required."
    }),
    description: z.string().min(1, {
        message: "Description is required."
    }),
    instructions: z.string().min(200, {
        message: "Instructions require at least 200 characters."
    }),
    seed: z.string().min(200, {
        message: "Seed require at least 200 characters."
    }),
    src: z.string().min(1, {
        message: "Image is required."
    }),
    categoryId: z.string().min(1, {
        message: "Category is required."
    }),
})

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            instructions: '',
            seed: '',
            src: '',
            categoryId: undefined
        }
    });

    const isLoading = form.formState.isSubmitting;
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                await axios.patch(`/api/companion/${initialData.id}`, values);
            } else {
                await axios.post(`/api/companion`, values);
            }
            toast({
                variant: "default",
                description: "Companion created successfully!"
            });
            router.refresh();
            router.push('/');
        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Something went wrong!'
            });
        }
    }

    return (
        <div className='h-full p-4 space-y-2 max-w-3xl mx-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>
                    <div className='space-y-8 w-full'>
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General information about your Companion
                            </p>
                            <Separator className="bg-primary/10" />
                        </div>
                        <FormField 
                            name="src"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col items-center justify-center space-y-4">
                                    <FormControl>
                                        <ImageUpload 
                                            disabled={isLoading}
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField 
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder='Albert Einstein'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is how your AI Companion will be named.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder={`World's most famous scientist.`}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Short description for your AI Companion
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                name="categoryId"
                                control={form.control}
                                render={({ field, fieldState }: any) => (
                                   <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue 
                                                    defaultValue={field.value}
                                                    placeholder="Select a category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category: Category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a category for your AI Companion
                                    </FormDescription>
                                    <FormMessage />
                                   </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">Configuration</h3>
                            <p className='text-sm text-muted-foreground'>Detailed instructions for AI Behaviour</p>
                        </div>
                        <Separator className='bg-primary/10' />
                    </div>
                    <FormField 
                        name="instructions"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className='bg-background resize-none'
                                        rows={7}
                                        disabled={isLoading}
                                        placeholder={PREAMBLE}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe in detail your companion&apos;s backstory and relevant details.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        name="seed"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Example Conversation</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className='bg-background resize-none'
                                        rows={7}
                                        disabled={isLoading}
                                        placeholder={SEED_CHAT}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe in detail your companion&apos;s backstory and relevant details.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='w-full flex justify-center'>
                        <Button size={'lg'} disabled={isLoading} type="submit">
                            {initialData ? 'Edit your companion' : 'Create your companion'}
                            <Wand2 className='w-4 h-4 ml-2' />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CompanionForm
