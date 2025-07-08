/**
 * HTML Content Utils
 * Utilities for handling HTML content safely
 */

// Simple HTML sanitizer - removes dangerous tags but keeps basic formatting
export const sanitizeHtml = (html) => {
    if (!html) return '';

    // Remove script tags and dangerous attributes
    const sanitized = html
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
        .replace(/<object[^>]*>.*?<\/object>/gi, '')
        .replace(/<embed[^>]*>/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/style="[^"]*"/gi, '') // Remove inline styles for security
        .replace(/style='[^']*'/gi, '');

    return sanitized;
};

// Convert line breaks to HTML if the content is plain text
export const formatTextContent = (content) => {
    if (!content) return '';

    // Check if content already contains HTML tags
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);

    if (hasHtmlTags) {
        // Content is already HTML, sanitize it and ensure proper formatting
        let sanitized = sanitizeHtml(content);

        // If content doesn't have proper paragraph structure, wrap in paragraphs
        if (!sanitized.includes('<p>') && !sanitized.includes('<div>') && !sanitized.includes('<br>')) {
            sanitized = `<p>${sanitized}</p>`;
        }

        return sanitized;
    } else {
        // Content is plain text, convert line breaks to HTML paragraphs
        const paragraphs = content
            .split(/\n\s*\n/) // Split by double line breaks for paragraphs
            .filter(p => p.trim()) // Remove empty paragraphs
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`) // Convert single line breaks to <br>
            .join('');

        return paragraphs || `<p>${content.replace(/\n/g, '<br>')}</p>`;
    }
};

// Strip HTML tags for plain text display (useful for previews)
export const stripHtml = (html) => {
    if (!html) return '';

    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
};

// Truncate HTML content for previews
export const truncateHtml = (html, maxLength = 150) => {
    const plainText = stripHtml(html);

    if (plainText.length <= maxLength) {
        return plainText;
    }

    return plainText.substring(0, maxLength).trim() + '...';
};
