// Demo data for one-click demonstration
export const DEMO_SYLLABUS = `Computer Science Final Exam - December 2024

📚 Data Structures & Algorithms
- Arrays and Linked Lists fundamentals
- Stacks, Queues, and their applications
- Binary Trees and Binary Search Trees
- Graph algorithms (BFS, DFS, Dijkstra)
- Sorting algorithms (Quick Sort, Merge Sort, Heap Sort)
- Dynamic Programming basics and applications

💻 Object-Oriented Programming
- Classes, Objects, and Encapsulation
- Inheritance and Polymorphism
- Abstract classes and Interfaces
- Design Patterns (Singleton, Factory, Observer, Strategy)

🗄️ Database Management Systems
- SQL queries (SELECT, JOIN, GROUP BY, HAVING)
- Database normalization (1NF, 2NF, 3NF, BCNF)
- Transactions and ACID properties
- Indexing and query optimization

⚙️ Operating Systems
- Process management and scheduling
- Memory management and virtual memory
- File systems and I/O management
- Deadlocks and synchronization

🌐 Web Development
- HTML5, CSS3, and responsive design
- JavaScript ES6+ features
- RESTful API design
- Authentication and security best practices

Total: 24 topics to master before Christmas! 🎄`;

export interface DemoTask {
    day: number;
    title: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

export const DEMO_TASKS: DemoTask[] = [
    { day: 1, title: "Master Arrays and Linked Lists", isUnlocked: true, isCompleted: true },
    { day: 2, title: "Learn Stacks and Queues", isUnlocked: true, isCompleted: true },
    { day: 3, title: "Understand Binary Trees", isUnlocked: true, isCompleted: true },
    { day: 4, title: "Study Graph Algorithms", isUnlocked: true, isCompleted: true },
    { day: 5, title: "Practice Sorting Algorithms", isUnlocked: true, isCompleted: false },
    { day: 6, title: "Learn Dynamic Programming", isUnlocked: true, isCompleted: false },
    { day: 7, title: "Master OOP Concepts", isUnlocked: false, isCompleted: false },
    { day: 8, title: "Study Inheritance & Polymorphism", isUnlocked: false, isCompleted: false },
    { day: 9, title: "Learn Design Patterns", isUnlocked: false, isCompleted: false },
    { day: 10, title: "Practice SQL Queries", isUnlocked: false, isCompleted: false },
    { day: 11, title: "Master Database Normalization", isUnlocked: false, isCompleted: false },
    { day: 12, title: "Understand Transactions", isUnlocked: false, isCompleted: false },
    { day: 13, title: "Study Process Management", isUnlocked: false, isCompleted: false },
    { day: 14, title: "Learn Memory Management", isUnlocked: false, isCompleted: false },
    { day: 15, title: "Master File Systems", isUnlocked: false, isCompleted: false },
    { day: 16, title: "Understand Deadlocks", isUnlocked: false, isCompleted: false },
    { day: 17, title: "Learn HTML5 & CSS3", isUnlocked: false, isCompleted: false },
    { day: 18, title: "Master JavaScript ES6+", isUnlocked: false, isCompleted: false },
    { day: 19, title: "Build RESTful APIs", isUnlocked: false, isCompleted: false },
    { day: 20, title: "Study Authentication", isUnlocked: false, isCompleted: false },
    { day: 21, title: "Practice Security Best Practices", isUnlocked: false, isCompleted: false },
    { day: 22, title: "Review Data Structures", isUnlocked: false, isCompleted: false },
    { day: 23, title: "Final OOP Review", isUnlocked: false, isCompleted: false },
    { day: 24, title: "Complete Practice Exam", isUnlocked: false, isCompleted: false },
];

export const DEMO_COMPLETED_COUNT = 4;

export const DEMO_GAMIFICATION = {
    points: 65,
    streak: 4,
    lastCompletedDate: new Date().toISOString(),
    totalCompleted: 4,
    achievements: [
        {
            id: "first_task",
            name: "Getting Started",
            description: "Complete your first task",
            icon: "🎁",
            unlocked: true,
            unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: "streak_3",
            name: "On Fire!",
            description: "Maintain a 3-day streak",
            icon: "🔥",
            unlocked: true,
            unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    unlockedRewards: [],
};

export const DEMO_ANALYTICS = {
    sessions: [
        {
            id: "demo_1",
            startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            duration: 30,
            taskId: 1,
            taskTitle: "Master Arrays and Linked Lists",
            completedTask: true,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            hourOfDay: 14,
        },
        {
            id: "demo_2",
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
            duration: 45,
            taskId: 2,
            taskTitle: "Learn Stacks and Queues",
            completedTask: true,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            hourOfDay: 15,
        },
        {
            id: "demo_3",
            startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
            duration: 40,
            taskId: 3,
            taskTitle: "Understand Binary Trees",
            completedTask: true,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            hourOfDay: 16,
        },
        {
            id: "demo_4",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
            duration: 35,
            taskId: 4,
            taskTitle: "Study Graph Algorithms",
            completedTask: true,
            date: new Date().toISOString().split('T')[0],
            hourOfDay: new Date().getHours(),
        },
    ],
    dailyStats: [],
    totalStudyTime: 150,
    totalTasksCompleted: 4,
    currentStreak: 4,
    longestStreak: 4,
    averageSessionDuration: 37.5,
    productivityByHour: Array(24).fill(0).map((_, i) => (i >= 14 && i <= 16 ? 30 : 0)),
    completionRate: 100,
};
