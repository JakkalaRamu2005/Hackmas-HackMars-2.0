// Share and Export Utilities

export interface ShareData {
    completedCount: number;
    totalTasks: number;
    streak: number;
    points: number;
    studyTime: number; // in minutes
    achievements: number;
}

export const generateShareText = (data: ShareData): string => {
    const percentage = Math.round((data.completedCount / data.totalTasks) * 100);

    return `🎄 I'm crushing my exam prep with StudyAdvent.ai! 🎄

📊 My Progress:
✅ ${data.completedCount}/${data.totalTasks} tasks completed (${percentage}%)
🔥 ${data.streak}-day streak
⭐ ${data.points} points earned
⏱️ ${Math.floor(data.studyTime / 60)}h ${data.studyTime % 60}m studied
🏆 ${data.achievements} achievements unlocked

Turn your boring syllabus into a festive advent calendar! 🎁
#StudyAdvent #StudyMotivation #ChristmasStudying`;
};

export const shareToTwitter = (data: ShareData) => {
    const text = generateShareText(data);
    const url = encodeURIComponent(window.location.origin);
    const tweetText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, '_blank');
};

export const shareToLinkedIn = (data: ShareData) => {
    const url = encodeURIComponent(window.location.origin);
    const title = encodeURIComponent('StudyAdvent.ai - My Study Progress');
    const summary = encodeURIComponent(`I completed ${data.completedCount}/${data.totalTasks} tasks with a ${data.streak}-day streak!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
};

export const shareToFacebook = (data: ShareData) => {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

export const shareToWhatsApp = (data: ShareData) => {
    const text = generateShareText(data);
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
};

export const copyToClipboard = async (data: ShareData): Promise<boolean> => {
    try {
        const text = generateShareText(data);
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

export const downloadAsImage = async (elementId: string, filename: string = 'studyadvent-progress.png'): Promise<void> => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Progress card element not found. Please try again.');
        }

        // Import html2canvas dynamically
        const html2canvas = (await import('html2canvas')).default;

        // Create canvas with high quality settings
        const canvas = await html2canvas(element, {
            backgroundColor: '#0F2A1D', // Solid background to avoid oklab parsing issues
            scale: 2, // Higher quality (2x resolution)
            useCORS: true, // Allow cross-origin images
            allowTaint: true, // Allow cross-origin images
            logging: false, // Disable console logs to suppress oklab warnings
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            removeContainer: true, // Clean up after rendering
            onclone: (clonedDoc) => {
                // Ensure the cloned element is visible and properly styled
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.display = 'block';
                    clonedElement.style.position = 'relative';
                }
            }
        });

        // Convert canvas to blob for better browser compatibility
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to create image blob');
            }

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            link.style.display = 'none';

            // Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup blob URL after a short delay
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }, 'image/png', 1.0); // Maximum quality PNG

    } catch (error) {
        console.error('Failed to download image:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to download image. Please try again.');
    }
};
