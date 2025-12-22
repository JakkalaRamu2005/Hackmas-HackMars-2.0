/**
 * Smart Task Breakdown System
 * AI-powered task breakdown into 5-10 minute chunks
 */

export interface SubTask {
    id: string;
    title: string;
    estimatedMinutes: number;
    completed: boolean;
    order: number;
}

export interface TaskWithSubtasks {
    taskId: number;
    taskTitle: string;
    subtasks: SubTask[];
    totalEstimatedMinutes: number;
    completedSubtasks: number;
}

/**
 * Generate smart subtasks for a given task
 */
export function generateSubtasks(taskTitle: string): SubTask[] {
    // AI-powered breakdown logic
    const subtasks: SubTask[] = [];

    // Analyze task title to determine breakdown strategy
    const keywords = taskTitle.toLowerCase();

    // Different breakdown strategies based on task type
    if (keywords.includes('algorithm') || keywords.includes('sorting') || keywords.includes('search')) {
        subtasks.push(
            { id: '1', title: 'Read theory and understand concepts', estimatedMinutes: 8, completed: false, order: 1 },
            { id: '2', title: 'Watch tutorial video or read examples', estimatedMinutes: 10, completed: false, order: 2 },
            { id: '3', title: 'Write pseudocode for the algorithm', estimatedMinutes: 7, completed: false, order: 3 },
            { id: '4', title: 'Implement basic version', estimatedMinutes: 10, completed: false, order: 4 },
            { id: '5', title: 'Test with sample inputs', estimatedMinutes: 6, completed: false, order: 5 },
            { id: '6', title: 'Optimize and handle edge cases', estimatedMinutes: 9, completed: false, order: 6 }
        );
    } else if (keywords.includes('database') || keywords.includes('sql')) {
        subtasks.push(
            { id: '1', title: 'Review database concepts', estimatedMinutes: 7, completed: false, order: 1 },
            { id: '2', title: 'Study SQL syntax and commands', estimatedMinutes: 8, completed: false, order: 2 },
            { id: '3', title: 'Practice basic queries', estimatedMinutes: 10, completed: false, order: 3 },
            { id: '4', title: 'Learn JOIN operations', estimatedMinutes: 9, completed: false, order: 4 },
            { id: '5', title: 'Practice complex queries', estimatedMinutes: 10, completed: false, order: 5 },
            { id: '6', title: 'Review and create cheat sheet', estimatedMinutes: 6, completed: false, order: 6 }
        );
    } else if (keywords.includes('oop') || keywords.includes('object') || keywords.includes('class')) {
        subtasks.push(
            { id: '1', title: 'Understand core OOP principles', estimatedMinutes: 8, completed: false, order: 1 },
            { id: '2', title: 'Study class and object concepts', estimatedMinutes: 7, completed: false, order: 2 },
            { id: '3', title: 'Learn inheritance with examples', estimatedMinutes: 9, completed: false, order: 3 },
            { id: '4', title: 'Practice polymorphism', estimatedMinutes: 8, completed: false, order: 4 },
            { id: '5', title: 'Code practical examples', estimatedMinutes: 10, completed: false, order: 5 },
            { id: '6', title: 'Review and summarize key points', estimatedMinutes: 8, completed: false, order: 6 }
        );
    } else if (keywords.includes('web') || keywords.includes('html') || keywords.includes('css') || keywords.includes('javascript')) {
        subtasks.push(
            { id: '1', title: 'Review HTML/CSS basics', estimatedMinutes: 7, completed: false, order: 1 },
            { id: '2', title: 'Study JavaScript fundamentals', estimatedMinutes: 9, completed: false, order: 2 },
            { id: '3', title: 'Build a simple component', estimatedMinutes: 10, completed: false, order: 3 },
            { id: '4', title: 'Add interactivity with JS', estimatedMinutes: 9, completed: false, order: 4 },
            { id: '5', title: 'Style and make responsive', estimatedMinutes: 8, completed: false, order: 5 },
            { id: '6', title: 'Test and debug', estimatedMinutes: 7, completed: false, order: 6 }
        );
    } else {
        // Generic breakdown for any topic
        subtasks.push(
            { id: '1', title: 'Read and understand the basics', estimatedMinutes: 8, completed: false, order: 1 },
            { id: '2', title: 'Watch explanatory video or tutorial', estimatedMinutes: 9, completed: false, order: 2 },
            { id: '3', title: 'Take notes on key concepts', estimatedMinutes: 7, completed: false, order: 3 },
            { id: '4', title: 'Practice with examples', estimatedMinutes: 10, completed: false, order: 4 },
            { id: '5', title: 'Solve practice problems', estimatedMinutes: 10, completed: false, order: 5 },
            { id: '6', title: 'Review and create summary', estimatedMinutes: 6, completed: false, order: 6 }
        );
    }

    return subtasks;
}

/**
 * Get task breakdown with subtasks
 */
export function getTaskBreakdown(taskId: number, taskTitle: string): TaskWithSubtasks {
    const subtasks = generateSubtasks(taskTitle);
    const totalEstimatedMinutes = subtasks.reduce((sum, st) => sum + st.estimatedMinutes, 0);
    const completedSubtasks = subtasks.filter(st => st.completed).length;

    return {
        taskId,
        taskTitle,
        subtasks,
        totalEstimatedMinutes,
        completedSubtasks,
    };
}

/**
 * Update subtask completion status
 */
export function toggleSubtask(
    breakdown: TaskWithSubtasks,
    subtaskId: string
): TaskWithSubtasks {
    const updatedSubtasks = breakdown.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    return {
        ...breakdown,
        subtasks: updatedSubtasks,
        completedSubtasks: updatedSubtasks.filter(st => st.completed).length,
    };
}

/**
 * Get progress percentage for a task
 */
export function getTaskProgress(breakdown: TaskWithSubtasks): number {
    if (breakdown.subtasks.length === 0) return 0;
    return Math.round((breakdown.completedSubtasks / breakdown.subtasks.length) * 100);
}

/**
 * Get estimated time remaining
 */
export function getTimeRemaining(breakdown: TaskWithSubtasks): number {
    return breakdown.subtasks
        .filter(st => !st.completed)
        .reduce((sum, st) => sum + st.estimatedMinutes, 0);
}

/**
 * Storage functions
 */
const STORAGE_KEY = 'task_breakdowns';

export const taskBreakdownStorage = {
    save: (breakdowns: Record<number, TaskWithSubtasks>): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(breakdowns));
        } catch (error) {
            console.error('Failed to save task breakdowns:', error);
        }
    },

    load: (): Record<number, TaskWithSubtasks> => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Failed to load task breakdowns:', error);
            return {};
        }
    },

    clear: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear task breakdowns:', error);
        }
    },
};
