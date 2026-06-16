import { z } from "zod"

// 1. Student CRUD Validation
export const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  admissionNumber: z.string().min(3, "Admission number is required."),
  classId: z.string().optional(),
  parentName: z.string().min(2, "Parent name is required."),
  phone: z.string().min(6, "Valid phone number is required."),
  address: z.string().min(5, "Address must be at least 5 characters.")
})

// 2. Teacher CRUD Validation
export const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  department: z.string().min(2, "Department is required."),
  qualification: z.string().min(2, "Qualification details required."),
  joiningDate: z.string().optional()
})

// 3. Assignment Validation
export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  classId: z.string().min(1, "Class is required."),
  dueDate: z.string().min(1, "Due date is required."),
  fileUrl: z.string().optional()
})

// 4. Exam Validation
export const examSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  classId: z.string().min(1, "Class is required."),
  examDate: z.string().min(1, "Exam date is required."),
  durationMinutes: z.number().min(5, "Duration must be at least 5 minutes."),
  questions: z.array(
    z.object({
      id: z.string(),
      questionText: z.string().min(1, "Question text required."),
      options: z.array(z.string().min(1, "Option text required.")).length(4),
      correctOption: z.enum(["A", "B", "C", "D"])
    })
  ).min(1, "At least one question is required.")
})
