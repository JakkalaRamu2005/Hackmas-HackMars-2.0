/**
 * Export Study Plan
 * Export calendar as PDF or Google Calendar format
 */

import type { Task } from "@/app/page";

export interface ExportOptions {
    format: "pdf" | "google-calendar" | "ical";
    includeCompleted: boolean;
    includeSubtasks: boolean;
    includeNotes: boolean;
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarURL(tasks: Task[], syllabusTitle: string): string {
    // Google Calendar doesn't support bulk import via URL, but we can create individual events
    // For demo, we'll create a URL for the first task
    const firstIncompleteTask = tasks.find(t => !t.isCompleted);

    if (!firstIncompleteTask) {
        return "";
    }

    const title = encodeURIComponent(`📚 ${firstIncompleteTask.title}`);
    const details = encodeURIComponent(`Study task from ${syllabusTitle}\n\nDay ${firstIncompleteTask.day} of your StudyAdvent calendar 🎄`);

    // Set date to today + day number
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + firstIncompleteTask.day);
    const dateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
}

/**
 * Generate iCal format
 */
export function generateICalFile(tasks: Task[], syllabusTitle: string): string {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//StudyAdvent.ai//Study Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${syllabusTitle} - StudyAdvent`,
        'X-WR-TIMEZONE:UTC',
    ].join('\r\n');

    tasks.forEach((task) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + task.day);
        const dateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');

        const event = [
            '',
            'BEGIN:VEVENT',
            `UID:studyadvent-${task.day}-${timestamp}@studyadvent.ai`,
            `DTSTAMP:${timestamp}`,
            `DTSTART;VALUE=DATE:${dateStr}`,
            `DTEND;VALUE=DATE:${dateStr}`,
            `SUMMARY:📚 Day ${task.day}: ${task.title}`,
            `DESCRIPTION:Study task from ${syllabusTitle}\\n\\nComplete this task as part of your StudyAdvent calendar! 🎄`,
            `STATUS:${task.isCompleted ? 'COMPLETED' : 'CONFIRMED'}`,
            'BEGIN:VALARM',
            'TRIGGER:-PT1H',
            'ACTION:DISPLAY',
            'DESCRIPTION:Time to study!',
            'END:VALARM',
            'END:VEVENT',
        ].join('\r\n');

        ical += event;
    });

    ical += '\r\nEND:VCALENDAR';
    return ical;
}

/**
 * Download iCal file
 */
export function downloadICalFile(tasks: Task[], syllabusTitle: string): void {
    const icalContent = generateICalFile(tasks, syllabusTitle);
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyAdvent-${syllabusTitle.replace(/[^a-z0-9]/gi, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate PDF content (HTML)
 */
export function generatePDFHTML(
    tasks: Task[],
    syllabusTitle: string,
    completedCount: number,
    options: ExportOptions
): string {
    const filteredTasks = options.includeCompleted
        ? tasks
        : tasks.filter(t => !t.isCompleted);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${syllabusTitle} - Study Plan</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #D42426;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #165B33;
      margin: 0;
      font-size: 32px;
    }
    .header .subtitle {
      color: #F8B229;
      font-size: 18px;
      margin-top: 10px;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 30px 0;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 10px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #165B33;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
    }
    .task {
      margin: 15px 0;
      padding: 15px;
      border-left: 4px solid #165B33;
      background: #f9f9f9;
      page-break-inside: avoid;
    }
    .task.completed {
      border-left-color: #F8B229;
      background: #fffef0;
    }
    .task-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .task-day {
      background: #165B33;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      margin-right: 15px;
    }
    .task.completed .task-day {
      background: #F8B229;
    }
    .task-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      flex: 1;
    }
    .task-status {
      font-size: 24px;
    }
    .checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #165B33;
      display: inline-block;
      margin-right: 10px;
      vertical-align: middle;
    }
    .checkbox.checked {
      background: #F8B229;
      position: relative;
    }
    .checkbox.checked::after {
      content: '✓';
      position: absolute;
      color: white;
      font-weight: bold;
      left: 3px;
      top: -2px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    .christmas-emoji {
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎄 ${syllabusTitle}</h1>
    <div class="subtitle">Your StudyAdvent Calendar - Generated with AI</div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${tasks.length}</div>
      <div class="stat-label">Total Tasks</div>
    </div>
    <div class="stat">
      <div class="stat-value">${completedCount}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat">
      <div class="stat-value">${Math.round((completedCount / tasks.length) * 100)}%</div>
      <div class="stat-label">Progress</div>
    </div>
  </div>

  <h2 style="color: #165B33; margin-top: 40px;">📚 Your Study Tasks</h2>
  
  ${filteredTasks.map(task => `
    <div class="task ${task.isCompleted ? 'completed' : ''}">
      <div class="task-header">
        <span class="task-day">Day ${task.day}</span>
        <span class="task-title">${task.title}</span>
        <span class="task-status">${task.isCompleted ? '✅' : '⬜'}</span>
      </div>
    </div>
  `).join('')}

  <div class="footer">
    <p><strong>StudyAdvent.ai</strong> - AI-Powered Study Planning</p>
    <p>Generated on ${new Date().toLocaleDateString()} | Make studying fun this Christmas! 🎅</p>
    <p style="margin-top: 20px;">
      <span class="christmas-emoji">🎄 Good luck with your studies! 🎁</span>
    </p>
  </div>
</body>
</html>
  `;

    return html;
}

/**
 * Download as PDF (using print dialog)
 */
export function downloadAsPDF(
    tasks: Task[],
    syllabusTitle: string,
    completedCount: number,
    options: ExportOptions
): void {
    const html = generatePDFHTML(tasks, syllabusTitle, completedCount, options);

    // Create a new window with the HTML
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();

        // Wait for content to load, then print
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };
    }
}

/**
 * Export study plan based on format
 */
export function exportStudyPlan(
    tasks: Task[],
    syllabusTitle: string,
    completedCount: number,
    options: ExportOptions
): void {
    switch (options.format) {
        case 'pdf':
            downloadAsPDF(tasks, syllabusTitle, completedCount, options);
            break;
        case 'google-calendar':
            const gcalURL = generateGoogleCalendarURL(tasks, syllabusTitle);
            if (gcalURL) {
                window.open(gcalURL, '_blank');
            }
            break;
        case 'ical':
            downloadICalFile(tasks, syllabusTitle);
            break;
    }
}
