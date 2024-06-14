const { z } = require('zod');

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
    password: z.string().min(6, 'Password is required'),
    email: z.string().email('Invalid email').optional(),
    mobile: z.string().optional().refine(value => value ? /^[0-9]+$/.test(value) : true, {
        message: "Mobile number must contain only digits",
    }),
}).refine(data => data.email || data.mobile, {
    message: "Either email or mobile must be provided",
    path: ["email", "mobile"],
});

const discussionSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    title: z.string().min(1, "Title is required"),
    text: z.string().min(1, "Text is required"),
    image: z.string().optional(),
    hashtags: z.array(z.string()).optional(),
    created_on: z.date().optional(),
    view_count: z.number().int().optional(),
    likes: z.array(z.string()).optional(),
    comments: z.array(z.string()).optional(),
});

const commentSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    discussion_id: z.string().min(1, "Discussion ID is required"),
    text: z.string().min(1, "Text is required"),
    created_on: z.date().optional(),
    likes: z.array(z.string()).optional(),
    replies: z.array(z.string()).optional(),
});

const replySchema = z.object({
    comment_id: z.string().min(1, "Comment ID is required"),
    user_id: z.string().min(1, "User ID is required"),
    text: z.string().min(1, "Text is required"),
    created_on: z.date().optional(),
    likes: z.array(z.string()).optional(),
});

module.exports = {
    userSchema,
    loginSchema,
    discussionSchema,
    commentSchema,
    replySchema
};
